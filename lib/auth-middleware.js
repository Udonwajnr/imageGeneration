import { Database } from "./database.js"

export async function validateUser(request) {
  try {
    const body = await request.json()
    const { userId } = body

    if (!userId) {
      return { error: "User ID is required", status: 401 }
    }

    const user = await Database.findUserById(userId)
    if (!user) {
      return { error: "User not found", status: 401 }
    }

    return { user, body }
  } catch (error) {
    return { error: "Invalid request", status: 400 }
  }
}

export async function validateAdmin(request) {
  const validation = await validateUser(request)
  if (validation.error) {
    return validation
  }

  if (!validation.user.isAdmin) {
    return { error: "Admin access required", status: 403 }
  }

  return validation
}

export function validateInput(data, schema) {
  const errors = []

  for (const [field, rules] of Object.entries(schema)) {
    const value = data[field]

    if (rules.required && (!value || (typeof value === "string" && !value.trim()))) {
      errors.push(`${field} is required`)
      continue
    }

    if (value && rules.type && typeof value !== rules.type) {
      errors.push(`${field} must be of type ${rules.type}`)
    }

    if (value && rules.minLength && value.length < rules.minLength) {
      errors.push(`${field} must be at least ${rules.minLength} characters`)
    }

    if (value && rules.maxLength && value.length > rules.maxLength) {
      errors.push(`${field} must be no more than ${rules.maxLength} characters`)
    }

    if (value && rules.min && value < rules.min) {
      errors.push(`${field} must be at least ${rules.min}`)
    }

    if (value && rules.max && value > rules.max) {
      errors.push(`${field} must be no more than ${rules.max}`)
    }

    if (value && rules.enum && !rules.enum.includes(value)) {
      errors.push(`${field} must be one of: ${rules.enum.join(", ")}`)
    }
  }

  return errors
}

export function sanitizeInput(input) {
  if (typeof input === "string") {
    return input.trim().replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
  }
  return input
}
