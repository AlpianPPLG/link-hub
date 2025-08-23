import { type NextRequest, NextResponse } from "next/server"
import { getUserByEmail, verifyPassword, generateToken } from "@/lib/auth"
import { z } from "zod"

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate input
    const validatedData = loginSchema.parse(body)

    // Get user by email
    const user = await getUserByEmail(validatedData.email)
    if (!user) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }

    // Verify password
    const isValidPassword = await verifyPassword(validatedData.password, user.password as string)
    if (!isValidPassword) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }

    // Generate token
    const token = generateToken({
      id: user.id,
      name: user.name,
      username: user.username,
      email: user.email,
    })

    // Create response with token in cookie
    const response = NextResponse.json(
      {
        message: "Login successful",
        user: {
          id: user.id,
          name: user.name,
          username: user.username,
          email: user.email,
        },
      },
      { status: 200 },
    )

    // Set HTTP-only cookie
    response.cookies.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    return response
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0].message }, { status: 400 })
    }

    console.error("Login error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
