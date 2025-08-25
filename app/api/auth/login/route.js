import { AuthService } from "@/lib/auth.js"
import { validateInput, sanitizeInput } from "@/lib/auth-middleware.js"

export async function POST(request) {
  try {
    const body = await request.json()
    const { email, password } = body

    // Input validation schema
    const schema = {
      email: { required: true, type: "string", minLength: 3, maxLength: 100 },
      password: { required: true, type: "string", minLength: 1 },
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

    const user = await AuthService.login(sanitizedEmail, sanitizedPassword)

    const token = await AuthService.generateToken(user)

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user

    return Response.json({
      ...userWithoutPassword,
      token,
    })
  } catch (error) {
    // Don't expose specific error details for security
    return Response.json({ message: "Invalid credentials" }, { status: 401 })
  }
}
