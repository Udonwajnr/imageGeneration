import { Database } from "@/lib/database.js"
import { validateInput, sanitizeInput } from "@/lib/auth-middleware.js"

export async function GET(request, { params }) {
  try {
    const { shareableId } = params

    // Validate shareableId parameter
    const validationErrors = validateInput(
      { shareableId },
      {
        shareableId: { required: true, type: "string", minLength: 1, maxLength: 50 },
      },
    )

    if (validationErrors.length > 0) {
      return Response.json({ message: "Invalid shareable ID" }, { status: 400 })
    }

    // Sanitize the shareable ID
    const sanitizedShareableId = sanitizeInput(shareableId)

    const image = await Database.getImageByShareableId(sanitizedShareableId)

    if (!image) {
      return Response.json({ message: "Image not found" }, { status: 404 })
    }

    return Response.json(image)
  } catch (error) {
    console.error("Failed to fetch shared image:", error)
    return Response.json({ message: "Internal server error" }, { status: 500 })
  }
}
