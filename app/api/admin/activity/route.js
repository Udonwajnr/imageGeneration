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

    const url = new URL(request.url)
    const limit = Number.parseInt(url.searchParams.get("limit")) || 10

    const recentImages = await Database.getRecentActivity(limit)
    const users = await Database.getAllUsers()

    // Create user lookup map for performance
    const userMap = new Map(users.map((user) => [user.id, user]))

    // Transform images into activity format
    const activities = recentImages.map((image) => {
      const user = userMap.get(image.userId)
      return {
        id: image.id,
        userEmail: user ? user.email : "Unknown User",
        userId: image.userId,
        prompt: image.prompt.length > 50 ? image.prompt.substring(0, 50) + "..." : image.prompt,
        fullPrompt: image.prompt,
        model: image.model,
        width: image.width,
        height: image.height,
        imageUrl: image.imageUrl,
        createdAt: image.createdAt,
        shareableId: image.shareableId,
      }
    })

    return Response.json({
      activities,
      total: activities.length,
      limit,
    })
  } catch (error) {
    console.error("[v0] Failed to fetch activity:", error)
    return Response.json({ message: "Internal server error" }, { status: 500 })
  }
}
