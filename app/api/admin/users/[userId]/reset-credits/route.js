import { Database } from "@/lib/database.js"
import { AuthService } from "@/lib/auth.js"
import { validateInput } from "@/lib/auth-middleware.js"

export async function POST(request, { params }) {
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

    const { userId } = params
    const body = await request.json()
    const { newCredits } = body

    const validationErrors = validateInput(
      { userId, newCredits },
      {
        userId: { required: true, type: "string", minLength: 1 },
        newCredits: { type: "number", min: 0, max: 1000 },
      },
    )

    if (validationErrors.length > 0) {
      return Response.json({ message: "Validation failed", errors: validationErrors }, { status: 400 })
    }

    const user = await Database.findUserById(userId)
    if (!user) {
      return Response.json({ message: "User not found" }, { status: 404 })
    }

    const creditsToSet = newCredits !== undefined ? newCredits : 10
    const success = await AuthService.resetUserCredits(userId, creditsToSet)

    if (!success) {
      return Response.json({ message: "Failed to reset credits" }, { status: 500 })
    }

    // Get updated credit information
    const updatedCreditCheck = await AuthService.checkCredits(userId)

    return Response.json({
      message: "Credits reset successfully",
      userId,
      newDailyLimit: creditsToSet,
      remaining: updatedCreditCheck.remaining,
      resetBy: tokenData.email,
      resetAt: new Date().toISOString(),
    })
  } catch (error) {
    console.error("[v0] Failed to reset credits:", error)
    return Response.json({ message: "Internal server error" }, { status: 500 })
  }
}
