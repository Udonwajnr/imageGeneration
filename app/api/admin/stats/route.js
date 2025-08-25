import { Database } from "@/lib/database.js"
import { AuthService } from "@/lib/auth.js"

export async function GET(request) {
  try {
    const authHeader = request.headers.get("authorization")
    if (!authHeader) {
      return Response.json({ message: "Authorization required" }, { status: 401 })
    }

    const token = authHeader.replace("Bearer ", "")
    const tokenData = await AuthService.verifyToken(token)
    const isAdmin = await AuthService.isAdmin(tokenData.userId)

    if (!isAdmin) {
      return Response.json({ message: "Admin access required" }, { status: 403 })
    }

    const stats = await Database.getAdminStats()

    // Get additional metrics
    const users = await Database.getAllUsers()
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)

    const activeUsers = users.filter((user) => {
      const lastLogin = user.lastLogin ? new Date(user.lastLogin) : new Date(user.createdAt)
      return lastLogin >= weekAgo
    }).length

    const newUsersToday = users.filter((user) => {
      const createdAt = new Date(user.createdAt)
      createdAt.setHours(0, 0, 0, 0)
      return createdAt.getTime() === today.getTime()
    }).length

    return Response.json({
      totalUsers: stats.totalUsers,
      totalImages: stats.totalImages,
      dailyCreditsUsed: stats.dailyCreditsUsed,
      activeUsers,
      newUsersToday,
      averageImagesPerUser: stats.totalUsers > 0 ? Math.round(stats.totalImages / stats.totalUsers) : 0,
    })
  } catch (error) {
    console.error("[v0] Failed to fetch admin stats:", error)
    return Response.json({ message: "Internal server error" }, { status: 500 })
  }
}
