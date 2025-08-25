import { Database } from "@/lib/database.js"
import { AuthService } from "@/lib/auth.js"
import { validateUser, validateInput, sanitizeInput } from "@/lib/auth-middleware.js"
import { validateModel, sanitizeData } from "@/lib/models.js"
import { GoogleGenerativeAI } from "@google/generative-ai"
import { nanoid } from "nanoid"

export async function POST(request) {
  try {
    // 1️⃣ Validate user authentication
    const validation = await validateUser(request)
    if (validation.error) {
      return Response.json({ message: validation.error }, { status: validation.status })
    }

    const { user, body } = validation
    const { prompt, negativePrompt, width, height, model } = body

    // 2️⃣ Validate input schema
    const schema = {
      prompt: { required: true, type: "string", minLength: 3, maxLength: 1000 },
      negativePrompt: { type: "string", maxLength: 500 },
      width: { required: true, type: "number", min: 256, max: 2048 },
      height: { required: true, type: "number", min: 256, max: 2048 },
      model: { required: true, type: "string", enum: ["flash", "pro"] },
    }
    const validationErrors = validateInput(body, schema)
    if (validationErrors.length > 0) {
      return Response.json({ message: "Validation failed", errors: validationErrors }, { status: 400 })
    }

    // 3️⃣ Sanitize inputs
    const sanitizedPrompt = sanitizeInput(prompt)
    const sanitizedNegativePrompt = negativePrompt ? sanitizeInput(negativePrompt) : ""

    // 4️⃣ Check user credits
    const creditCheck = await AuthService.checkCredits(user.id)
    if (!creditCheck.hasCredits) {
      return Response.json(
        {
          message: `Insufficient credits. You have ${creditCheck.remaining} credits remaining.`,
          remaining: creditCheck.remaining,
          dailyLimit: creditCheck.dailyLimit,
        },
        { status: 403 }
      )
    }

    // 5️⃣ Generate the image
    let imageUrl
    if (process.env.GEMINI_API_KEY) {
      try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
        const modelInstance = genAI.getGenerativeModel({
          model: model === "pro" ? "gemini-2.0-flash-exp" : "gemini-2.0-flash-exp",
          generationConfig: {
            responseModalities: ["Text", "Image"]
          },
        })

        let fullPrompt = sanitizedPrompt
        if (sanitizedNegativePrompt) {
          fullPrompt += `. Avoid: ${sanitizedNegativePrompt}`
        }
        fullPrompt += `. Image dimensions: ${width}x${height}px`

        console.log("[v0] Sending request to Gemini API:", { fullPrompt, width, height, model })

        const result = await modelInstance.generateContent([{ text: `Generate an image: ${fullPrompt}` }])
        console.log("[v0] Gemini API response:", JSON.stringify(result, null, 2))

        // ✅ Corrected: loop through parts to find inlineData
        if (result.response && result.response.candidates && result.response.candidates[0]) {
          const candidate = result.response.candidates[0]
          if (candidate.content && candidate.content.parts) {
            for (const part of candidate.content.parts) {
              if (part.inlineData && part.inlineData.data) {
                const base64Data = part.inlineData.data
                const mimeType = part.inlineData.mimeType || "image/png"
                imageUrl = `data:${mimeType};base64,${base64Data}`
                console.log("[v0] Successfully extracted image data from Gemini API")
                break
              }
            }
          }
        }

        if (!imageUrl) {
          console.warn("[v0] Gemini API did not return image data, using fallback placeholder")
          imageUrl = `/placeholder.svg?height=${height}&width=${width}&query=${encodeURIComponent(sanitizedPrompt)}`
        }
      } catch (apiError) {
        console.error("[v0] Gemini API error:", apiError.response?.data || apiError)
        imageUrl = `/placeholder.svg?height=${height}&width=${width}&query=${encodeURIComponent(sanitizedPrompt)}`
      }
    } else {
      console.log("[v0] GEMINI_API_KEY not found, using mock generation")
      imageUrl = `/placeholder.svg?height=${height}&width=${width}&query=${encodeURIComponent(sanitizedPrompt)}`
    }

    // 6️⃣ Build final image data
    const imageData = {
      userId: user.id,
      prompt: sanitizedPrompt,
      negativePrompt: sanitizedNegativePrompt,
      width,
      height,
      model,
      imageUrl,
      shareableId: nanoid(10),
      isPublic: false,
    }

    // 7️⃣ Validate image data (after imageUrl and shareableId are set)
    const modelValidation = validateModel("image", imageData)
    if (!modelValidation.isValid) {
      console.error("[v0] Image validation failed:", modelValidation.errors)
      return Response.json({ message: "Invalid image data", errors: modelValidation.errors }, { status: 400 })
    }

    // 8️⃣ Sanitize and save
    const sanitizedImageData = sanitizeData("image", imageData)
    const image = await Database.saveImage(sanitizedImageData)

    // 9️⃣ Track usage and update credits
    await Database.trackUsage(user.id, 1)
    await Database.updateUserCredits(user.id, 1)
    const updatedCreditCheck = await AuthService.checkCredits(user.id)

    // 10️⃣ Return result
    return Response.json({
      ...image,
      creditsRemaining: updatedCreditCheck.remaining,
      dailyLimit: updatedCreditCheck.dailyLimit,
    })
  } catch (error) {
    console.error("[v0] Generation error:", error)
    return Response.json({ message: "Internal server error" }, { status: 500 })
  }
}
