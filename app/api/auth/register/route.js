import { AuthService } from "@/lib/auth.js"
import { validateInput, sanitizeInput } from "@/lib/auth-middleware.js"

export async function POST(request) {
  try {
    const body = await request.json()
    const { email, password } = body

    // Input validation schema
    const schema = {
      email: { required: true, type: "string", minLength: 3, maxLength: 100 },
      password: { required: true, type: "string", minLength: 6, maxLength: 128 },
    }

    const validationErrors = validateInput(body, schema)
    if (validationErrors.length > 0) {
      return Response.json({ message: "Validation failed", errors: validationErrors }, { status: 400 })
    }

    // Sanitize inputs
    const sanitizedEmail = sanitizeInput(email).toLowerCase()
    const sanitizedPassword = sanitizeInput(password)

    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(sanitizedEmail)) {
      return Response.json({ message: "Invalid email format" }, { status: 400 })
    }

    // Password strength validation
    if (sanitizedPassword.length < 6) {
      return Response.json({ message: "Password must be at least 6 characters long" }, { status: 400 })
    }

    const user = await AuthService.register(sanitizedEmail, sanitizedPassword)

    const token = await AuthService.generateToken(user)

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user

    return Response.json({
      ...userWithoutPassword,
      token,
    })
  } catch (error) {
    if (error.message === "User already exists") {
      return Response.json({ message: "User already exists" }, { status: 409 })
    }
    if (error.message.includes("Validation failed")) {
      return Response.json({ message: error.message }, { status: 400 })
    }
    return Response.json({ message: "Registration failed" }, { status: 500 })
  }
}
