import { Database } from "@/lib/database.js"
import { AuthService } from "@/lib/auth.js"
import { validateInput } from "@/lib/auth-middleware.js"

export async function GET(request, { params }) {
  try {
    const { userId } = await params
    const url = new URL(request.url)
    const limit = Number.parseInt(url.searchParams.get("limit")) || 50

    // Validate userId parameter
    const validationErrors = validateInput(
      { userId, limit },
      {
        userId: { required: true, type: "string", minLength: 1 },
        limit: { type: "number", min: 1, max: 100 },
      },
    )

    if (validationErrors.length > 0) {
      return Response.json({ message: "Invalid parameters", errors: validationErrors }, { status: 400 })
    }

    // const authHeader = request.headers.get("authorization")
    // if (authHeader) {
    //   try {
    //     const token = authHeader.replace("Bearer ", "")
    //     const tokenData = await AuthService.verifyToken(token)
    //     const isAdmin = await AuthService.isAdmin(tokenData.userId)

    //     // Allow access if user is requesting their own images or is admin
    //     if (tokenData.userId !== userId && !isAdmin) {
    //       return Response.json({ message: "Access denied" }, { status: 403 })
    //     }
    //   } catch (error) {
    //     return Response.json({ message: "Invalid token" }, { status: 401 })
    //   }
    // } else {
    //   return Response.json({ message: "Authorization required" }, { status: 401 })
    // }

    // Verify user exists
    const user = await Database.findUserById(userId)
    if (!user) {
      return Response.json({ message: "User not found" }, { status: 404 })
    }

    const images = await Database.getUserImages(userId, limit)

    return Response.json({
      images,
      total: images.length,
      userId,
      limit,
    })
  } catch (error) {
    console.error("[v0] Failed to fetch images:", error)
    return Response.json({ message: "Internal server error" }, { status: 500 })
  }
}
