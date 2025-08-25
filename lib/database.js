import { MongoClient } from "mongodb"
import { createIndexes } from "./models.js"

let client
let db

// Initialize MongoDB connection
async function connectToDatabase() {
  if (db) {
    return db
  }

  const uri = process.env.MONGODB_URI
  if (!uri) {
    console.warn("[v0] MONGODB_URI not found, using mock database")
    return null
  }

  try {
    client = new MongoClient(uri)
    await client.connect()
    db = client.db("ai-image-generator")

    await createIndexes(db)

    console.log("[v0] Connected to MongoDB")
    return db
  } catch (error) {
    console.error("[v0] MongoDB connection error:", error)
    return null
  }
}

const mockUsers = []
const mockImages = []
const mockUsage = []

export class Database {
  static async getDatabase() {
    return await connectToDatabase()
  }

  // User operations
  static async createUser(userData) {
    const database = await this.getDatabase()

    if (database) {
      // MongoDB implementation
      const user = {
        ...userData,
        createdAt: new Date(),
      }
      const result = await database.collection("users").insertOne(user)
      return { ...user, id: result.insertedId.toString() }
    } else {
      // Fallback to mock data
      const user = {
        ...userData,
        id: Math.random().toString(36).substr(2, 9),
        createdAt: new Date(),
      }
      mockUsers.push(user)
      return user
    }
  }

  static async findUserByEmail(email) {
    const database = await this.getDatabase()

    if (database) {
      const user = await database.collection("users").findOne({ email })
      return user ? { ...user, id: user._id.toString() } : null
    } else {
      return mockUsers.find((user) => user.email === email) || null
    }
  }

  static async findUserById(id) {
    const database = await this.getDatabase()

    if (database) {
      const { ObjectId } = await import("mongodb")
      const user = await database.collection("users").findOne({ _id: new ObjectId(id) })
      return user ? { ...user, id: user._id.toString() } : null
    } else {
      return mockUsers.find((user) => user.id === id) || null
    }
  }

  static async updateUserCredits(userId, creditsUsed) {
    const database = await this.getDatabase()

    if (database) {
      const { ObjectId } = await import("mongodb")
      await database
        .collection("users")
        .updateOne({ _id: new ObjectId(userId) }, { $inc: { usedCredits: creditsUsed } })
    } else {
      const userIndex = mockUsers.findIndex((user) => user.id === userId)
      if (userIndex !== -1) {
        mockUsers[userIndex].usedCredits += creditsUsed
      }
    }
  }

  // Image operations
  static async saveImage(imageData) {
    const database = await this.getDatabase()

    if (database) {
      const image = {
        ...imageData,
        shareableId: Math.random().toString(36).substr(2, 12),
        createdAt: new Date(),
      }
      const result = await database.collection("images").insertOne(image)
      return { ...image, id: result.insertedId.toString() }
    } else {
      const image = {
        ...imageData,
        id: Math.random().toString(36).substr(2, 9),
        shareableId: Math.random().toString(36).substr(2, 12),
        createdAt: new Date(),
      }
      mockImages.push(image)
      return image
    }
  }

  static async getUserImages(userId, limit = 20) {
    const database = await this.getDatabase()

    if (database) {
      const images = await database.collection("images").find({ userId }).sort({ createdAt: -1 }).limit(limit).toArray()
      return images.map((img) => ({ ...img, id: img._id.toString() }))
    } else {
      return mockImages
        .filter((image) => image.userId === userId)
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
        .slice(0, limit)
    }
  }

  static async getImageByShareableId(shareableId) {
    const database = await this.getDatabase()

    if (database) {
      const image = await database.collection("images").findOne({ shareableId })
      return image ? { ...image, id: image._id.toString() } : null
    } else {
      return mockImages.find((image) => image.shareableId === shareableId) || null
    }
  }

  // Usage tracking
  static async trackUsage(userId, creditsUsed) {
    const database = await this.getDatabase()

    if (database) {
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      await database.collection("usage").updateOne(
        { userId, date: today },
        {
          $inc: { creditsUsed, imagesGenerated: 1 },
          $setOnInsert: { userId, date: today },
        },
        { upsert: true },
      )
    } else {
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      const existingUsage = mockUsage.find(
        (usage) => usage.userId === userId && usage.date.getTime() === today.getTime(),
      )

      if (existingUsage) {
        existingUsage.creditsUsed += creditsUsed
        existingUsage.imagesGenerated += 1
      } else {
        mockUsage.push({
          userId,
          date: today,
          creditsUsed,
          imagesGenerated: 1,
        })
      }
    }
  }

  static async getAllUsers() {
    const database = await this.getDatabase()

    if (database) {
      const users = await database.collection("users").find({}).toArray()
      return users.map((user) => ({ ...user, id: user._id.toString() }))
    } else {
      return mockUsers
    }
  }

  static async getUserUsageHistory(userId) {
    const database = await this.getDatabase()

    if (database) {
      const usage = await database.collection("usage").find({ userId }).toArray()
      return usage.map((u) => ({ ...u, id: u._id.toString() }))
    } else {
      return mockUsage.filter((usage) => usage.userId === userId)
    }
  }

  static async getAdminStats() {
    const database = await this.getDatabase()

    if (database) {
      const totalUsers = await database.collection("users").countDocuments()
      const totalImages = await database.collection("images").countDocuments()
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const todayUsage = await database
        .collection("usage")
        .aggregate([{ $match: { date: today } }, { $group: { _id: null, totalCredits: { $sum: "$creditsUsed" } } }])
        .toArray()

      return {
        totalUsers,
        totalImages,
        dailyCreditsUsed: todayUsage[0]?.totalCredits || 0,
      }
    } else {
      return {
        totalUsers: mockUsers.length,
        totalImages: mockImages.length,
        dailyCreditsUsed: mockUsage.reduce((sum, usage) => sum + usage.creditsUsed, 0),
      }
    }
  }

  static async getRecentActivity(limit = 10) {
    const database = await this.getDatabase()

    if (database) {
      const recentImages = await database.collection("images").find({}).sort({ createdAt: -1 }).limit(limit).toArray()
      return recentImages.map((img) => ({ ...img, id: img._id.toString() }))
    } else {
      return mockImages.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()).slice(0, limit)
    }
  }
}
