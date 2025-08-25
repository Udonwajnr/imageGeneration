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
    const page = Number.parseInt(url.searchParams.get("page")) || 1
    const limit = Number.parseInt(url.searchParams.get("limit")) || 20

    const users = await Database.getAllUsers()

    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedUsers = users.slice(startIndex, endIndex)

    // Remove passwords and add computed fields
    const safeUsers = paginatedUsers.map(({ password, ...user }) => ({
      ...user,
      creditsRemaining: user.dailyCredits - user.usedCredits,
      isActive: user.lastLogin ? new Date(user.lastLogin) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) : false,
      joinedDaysAgo: Math.floor((Date.now() - new Date(user.createdAt).getTime()) / (24 * 60 * 60 * 1000)),
    }))

    return Response.json({
      users: safeUsers,
      pagination: {
        page,
        limit,
        total: users.length,
        totalPages: Math.ceil(users.length / limit),
        hasNext: endIndex < users.length,
        hasPrev: page > 1,
      },
    })
  } catch (error) {
    console.error("[v0] Failed to fetch users:", error)
    return Response.json({ message: "Internal server error" }, { status: 500 })
  }
}
