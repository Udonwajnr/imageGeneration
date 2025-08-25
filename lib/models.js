// Database models and validation schemas for MongoDB collections

export const UserModel = {
  // Collection name
  collection: "users",

  // Schema definition
  schema: {
    email: { type: "string", required: true, unique: true },
    password: { type: "string", required: true },
    role: { type: "string", enum: ["user", "admin"], default: "user" },
    dailyCredits: { type: "number", default: 10 },
    usedCredits: { type: "number", default: 0 },
    createdAt: { type: "date", default: () => new Date() },
    lastLogin: { type: "date", default: null },
  },

  // Validation function
  validate(userData) {
    const errors = []

    if (!userData.email || typeof userData.email !== "string") {
      errors.push("Email is required and must be a string")
    }

    if (!userData.password || typeof userData.password !== "string") {
      errors.push("Password is required and must be a string")
    }

    if (userData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userData.email)) {
      errors.push("Email must be a valid email address")
    }

    if (userData.password && userData.password.length < 6) {
      errors.push("Password must be at least 6 characters long")
    }

    return {
      isValid: errors.length === 0,
      errors,
    }
  },

  // Create indexes
  indexes: [{ key: { email: 1 }, unique: true }, { key: { role: 1 } }, { key: { createdAt: -1 } }],
}

export const ImageModel = {
  collection: "images",

  schema: {
    userId: { type: "string", required: true },
    prompt: { type: "string", required: true },
    negativePrompt: { type: "string", default: "" },
    width: { type: "number", default: 512 },
    height: { type: "number", default: 512 },
    model: { type: "string", enum: ["flash", "pro"], default: "flash" },
    imageUrl: { type: "string", required: true },
    shareableId: { type: "string", required: true, unique: true },
    isPublic: { type: "boolean", default: false },
    downloads: { type: "number", default: 0 },
    createdAt: { type: "date", default: () => new Date() },
  },

  validate(imageData) {
    const errors = []

    if (!imageData.userId || typeof imageData.userId !== "string") {
      errors.push("User ID is required and must be a string")
    }

    if (!imageData.prompt || typeof imageData.prompt !== "string") {
      errors.push("Prompt is required and must be a string")
    }

    if (imageData.prompt && imageData.prompt.length > 1000) {
      errors.push("Prompt must be less than 1000 characters")
    }

    if (!imageData.imageUrl || typeof imageData.imageUrl !== "string") {
      errors.push("Image URL is required and must be a string")
    }

    if (imageData.width && (imageData.width < 256 || imageData.width > 2048)) {
      errors.push("Width must be between 256 and 2048 pixels")
    }

    if (imageData.height && (imageData.height < 256 || imageData.height > 2048)) {
      errors.push("Height must be between 256 and 2048 pixels")
    }

    return {
      isValid: errors.length === 0,
      errors,
    }
  },

  indexes: [
    { key: { userId: 1, createdAt: -1 } },
    { key: { shareableId: 1 }, unique: true },
    { key: { createdAt: -1 } },
    { key: { isPublic: 1, createdAt: -1 } },
  ],
}

export const UsageModel = {
  collection: "usage",

  schema: {
    userId: { type: "string", required: true },
    date: { type: "date", required: true },
    creditsUsed: { type: "number", default: 0 },
    imagesGenerated: { type: "number", default: 0 },
    createdAt: { type: "date", default: () => new Date() },
    updatedAt: { type: "date", default: () => new Date() },
  },

  validate(usageData) {
    const errors = []

    if (!usageData.userId || typeof usageData.userId !== "string") {
      errors.push("User ID is required and must be a string")
    }

    if (!usageData.date || !(usageData.date instanceof Date)) {
      errors.push("Date is required and must be a valid date")
    }

    if (usageData.creditsUsed && (typeof usageData.creditsUsed !== "number" || usageData.creditsUsed < 0)) {
      errors.push("Credits used must be a non-negative number")
    }

    if (usageData.imagesGenerated && (typeof usageData.imagesGenerated !== "number" || usageData.imagesGenerated < 0)) {
      errors.push("Images generated must be a non-negative number")
    }

    return {
      isValid: errors.length === 0,
      errors,
    }
  },

  indexes: [
    { key: { userId: 1, date: 1 }, unique: true },
    { key: { date: -1 } },
    { key: { userId: 1, createdAt: -1 } },
  ],
}

// Helper function to create indexes for all models
export async function createIndexes(database) {
  const models = [UserModel, ImageModel, UsageModel]

  for (const model of models) {
    const collection = database.collection(model.collection)

    for (const index of model.indexes) {
      try {
        await collection.createIndex(index.key, {
          unique: index.unique || false,
          background: true,
        })
        console.log(`[v0] Created index for ${model.collection}:`, index.key)
      } catch (error) {
        // Index might already exist, which is fine
        if (!error.message.includes("already exists")) {
          console.error(`[v0] Error creating index for ${model.collection}:`, error)
        }
      }
    }
  }
}

// Helper function to validate data against model schema
export function validateModel(modelName, data) {
  const models = {
    user: UserModel,
    image: ImageModel,
    usage: UsageModel,
  }

  const model = models[modelName.toLowerCase()]
  if (!model) {
    return {
      isValid: false,
      errors: [`Unknown model: ${modelName}`],
    }
  }

  return model.validate(data)
}

// Helper function to sanitize data according to model schema
export function sanitizeData(modelName, data) {
  const models = {
    user: UserModel,
    image: ImageModel,
    usage: UsageModel,
  }

  const model = models[modelName.toLowerCase()]
  if (!model) {
    return data
  }

  const sanitized = {}

  // Only include fields that are defined in the schema
  for (const [field, config] of Object.entries(model.schema)) {
    if (data.hasOwnProperty(field)) {
      sanitized[field] = data[field]
    } else if (config.default !== undefined) {
      sanitized[field] = typeof config.default === "function" ? config.default() : config.default
    }
  }

  return sanitized
}
