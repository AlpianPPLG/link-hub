import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { verifyToken } from "@/lib/auth"

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Protected routes that require authentication
  const protectedRoutes = ["/dashboard"]
  const authRoutes = ["/login", "/register"]

  // Check if the current path is protected
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route))

  // Check if the current path is an auth route
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route))

  // Get token from cookies
  const token = request.cookies.get("auth-token")?.value

  // If accessing protected route without token, redirect to login
  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  // If accessing protected route, verify token
  if (isProtectedRoute && token) {
    const user = verifyToken(token)
    if (!user) {
      // Invalid token, redirect to login and clear cookie
      const response = NextResponse.redirect(new URL("/login", request.url))
      response.cookies.delete("auth-token")
      return response
    }
  }

  // If accessing auth routes while logged in, redirect to dashboard
  if (isAuthRoute && token) {
    const user = verifyToken(token)
    if (user) {
      return NextResponse.redirect(new URL("/dashboard", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
