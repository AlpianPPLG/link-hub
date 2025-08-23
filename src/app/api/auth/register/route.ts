import { type NextRequest, NextResponse } from "next/server"
import { createUser, getUserByEmail, getUserByUsername } from "@/lib/auth"
import { z } from "zod"

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username must be less than 30 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate input
    const validatedData = registerSchema.parse(body)

    // Check if user already exists
    const existingUserByEmail = await getUserByEmail(validatedData.email)
    if (existingUserByEmail) {
      return NextResponse.json({ error: "User with this email already exists" }, { status: 400 })
    }

    const existingUserByUsername = await getUserByUsername(validatedData.username)
    if (existingUserByUsername) {
      return NextResponse.json({ error: "Username is already taken" }, { status: 400 })
    }

    // Create user
    const user = await createUser(validatedData)

    if (!user) {
      return NextResponse.json({ error: "Failed to create user" }, { status: 500 })
    }

    return NextResponse.json(
      {
        message: "User created successfully",
        user: {
          id: user.id,
          name: user.name,
          username: user.username,
          email: user.email,
        },
      },
      { status: 201 },
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0].message }, { status: 400 })
    }

    console.error("Registration error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
