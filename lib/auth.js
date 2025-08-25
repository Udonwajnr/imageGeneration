import { Database } from "./database.js"
import { validateModel, sanitizeData } from "./models.js"

export class AuthService {
  static async hashPassword(password) {
    const encoder = new TextEncoder()
    const data = encoder.encode(password + process.env.AUTH_SALT || "default-salt")
    const hashBuffer = await crypto.subtle.digest("SHA-256", data)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")
  }

  static async verifyPassword(password, hashedPassword) {
    const hashedInput = await this.hashPassword(password)
    return hashedInput === hashedPassword
  }

  static async register(email, password) {
    const userData = { email, password }
    const validation = validateModel("user", userData)

    if (!validation.isValid) {
      throw new Error(`Validation failed: ${validation.errors.join(", ")}`)
    }

    const existingUser = await Database.findUserByEmail(email)
    if (existingUser) {
      throw new Error("User already exists")
    }

    const hashedPassword = await this.hashPassword(password)
    const sanitizedData = sanitizeData("user", {
      email,
      password: hashedPassword,
      role: "user",
      dailyCredits: 10,
      usedCredits: 0,
    })

    return Database.createUser(sanitizedData)
  }

  static async login(email, password) {
    const user = await Database.findUserByEmail(email)
    if (!user) {
      throw new Error("Invalid credentials")
    }

    const isValidPassword = await this.verifyPassword(password, user.password)
    if (!isValidPassword) {
      throw new Error("Invalid credentials")
    }

    const database = await Database.getDatabase()
    if (database) {
      const { ObjectId } = await import("mongodb")
      await database.collection("users").updateOne({ _id: new ObjectId(user.id) }, { $set: { lastLogin: new Date() } })
    }

    return user
  }

  static async checkCredits(userId) {
    const user = await Database.findUserById(userId)
    if (!user) {
      throw new Error("User not found")
    }

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const lastLogin = user.lastLogin ? new Date(user.lastLogin) : new Date(user.createdAt)
    lastLogin.setHours(0, 0, 0, 0)

    // Reset credits if it's a new day
    if (today.getTime() > lastLogin.getTime()) {
      const database = await Database.getDatabase()
      if (database) {
        const { ObjectId } = await import("mongodb")
        await database.collection("users").updateOne({ _id: new ObjectId(userId) }, { $set: { usedCredits: 0 } })
        user.usedCredits = 0
      }
    }

    const remaining = user.dailyCredits - user.usedCredits
    return {
      hasCredits: remaining > 0,
      remaining: Math.max(0, remaining),
      dailyLimit: user.dailyCredits,
    }
  }

  static async generateToken(user) {
    const payload = {
      userId: user.id,
      email: user.email,
      role: user.role,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60, // 24 hours
    }

    // Simple JWT-like token (in production, use proper JWT library)
    const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }))
    const payloadEncoded = btoa(JSON.stringify(payload))
    const signature = await this.hashPassword(`${header}.${payloadEncoded}`)

    return `${header}.${payloadEncoded}.${signature}`
  }

  static async verifyToken(token) {
    try {
      const [header, payload, signature] = token.split(".")
      const expectedSignature = await this.hashPassword(`${header}.${payload}`)

      if (signature !== expectedSignature) {
        throw new Error("Invalid token signature")
      }

      const decodedPayload = JSON.parse(atob(payload))

      if (decodedPayload.exp < Math.floor(Date.now() / 1000)) {
        throw new Error("Token expired")
      }

      return decodedPayload
    } catch (error) {
      throw new Error("Invalid token")
    }
  }

  static async isAdmin(userId) {
    const user = await Database.findUserById(userId)
    return user && user.role === "admin"
  }

  static async resetUserCredits(userId, newCredits = 10) {
    const database = await Database.getDatabase()
    if (database) {
      const { ObjectId } = await import("mongodb")
      await database.collection("users").updateOne(
        { _id: new ObjectId(userId) },
        {
          $set: {
            usedCredits: 0,
            dailyCredits: newCredits,
          },
        },
      )
      return true
    }
    return false
  }
}
