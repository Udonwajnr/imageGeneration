import { AuthService } from "@/lib/auth.js"
import { Database } from "@/lib/database.js"
import { validateInput } from "@/lib/auth-middleware.js"

export async function GET(request, { params }) {
  try {
    const { userId } = await params

    // Validate userId parameter
    const validationErrors = validateInput(
      { userId },
      {
        userId: { required: true, type: "string", minLength: 1 },
      },
    )

    if (validationErrors.length > 0) {
      return Response.json({ message: "Invalid user ID" }, { status: 400 })
    }

    const creditCheck = await AuthService.checkCredits(userId)
    const user = await Database.findUserById(userId)

    if (!user) {
      return Response.json({ message: "User not found" }, { status: 404 })
    }

    return Response.json({
      remaining: creditCheck.remaining,
      total: creditCheck.dailyLimit,
      used: user.usedCredits,
      hasCredits: creditCheck.hasCredits,
      resetTime: "Daily at midnight",
      userId: user.id,
    })
  } catch (error) {
    console.error("[v0] Failed to fetch credits:", error)
    return Response.json({ message: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request, { params }) {
  try {
    const { userId } = await params
    const body = await request.json()
    const { newCredits } = body

    // Validate admin authentication (simplified for now)
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

    // Validate input
    const validationErrors = validateInput(
      { userId, newCredits },
      {
        userId: { required: true, type: "string", minLength: 1 },
        newCredits: { required: true, type: "number", min: 0, max: 1000 },
      },
    )

    if (validationErrors.length > 0) {
      return Response.json({ message: "Validation failed", errors: validationErrors }, { status: 400 })
    }

    const success = await AuthService.resetUserCredits(userId, newCredits)

    if (!success) {
      return Response.json({ message: "Failed to reset credits" }, { status: 500 })
    }

    const updatedCreditCheck = await AuthService.checkCredits(userId)

    return Response.json({
      message: "Credits reset successfully",
      remaining: updatedCreditCheck.remaining,
      total: updatedCreditCheck.dailyLimit,
    })
  } catch (error) {
    console.error("[v0] Failed to reset credits:", error)
    return Response.json({ message: "Internal server error" }, { status: 500 })
  }
}
