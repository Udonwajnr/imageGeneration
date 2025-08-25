import { NextResponse } from "next/server"

// Rate limiting store (in production, use Redis or similar)
const rateLimitStore = new Map()

function rateLimit(ip, limit = 10, windowMs = 60000) {
  const now = Date.now()
  const windowStart = now - windowMs

  if (!rateLimitStore.has(ip)) {
    rateLimitStore.set(ip, [])
  }

  const requests = rateLimitStore.get(ip)

  // Remove old requests outside the window
  const validRequests = requests.filter((timestamp) => timestamp > windowStart)
  rateLimitStore.set(ip, validRequests)

  if (validRequests.length >= limit) {
    return false
  }

  validRequests.push(now)
  rateLimitStore.set(ip, validRequests)
  return true
}

export function middleware(request) {
  const response = NextResponse.next()

  // Add security headers
  response.headers.set("X-Content-Type-Options", "nosniff")
  response.headers.set("X-Frame-Options", "DENY")
  response.headers.set("X-XSS-Protection", "1; mode=block")
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin")

  // Handle API routes
  if (request.nextUrl.pathname.startsWith("/api/")) {
    const ip = request.ip || request.headers.get("x-forwarded-for") || "unknown"

    // Rate limiting for API routes
    if (!rateLimit(ip, 30, 60000)) {
      // 30 requests per minute
      return new NextResponse(JSON.stringify({ message: "Too many requests. Please try again later." }), {
        status: 429,
        headers: {
          "Content-Type": "application/json",
          "Retry-After": "60",
        },
      })
    }

    // Add CORS headers for API routes
    response.headers.set("Access-Control-Allow-Origin", "*")
    response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
    response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization")
  }

  return response
}

export const config = {
  matcher: ["/api/:path*", "/((?!_next/static|_next/image|favicon.ico).*)"],
}
