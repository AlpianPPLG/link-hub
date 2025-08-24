import { type NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/lib/auth"
import { executeQuery } from "@/lib/database"
import { z } from "zod"

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  bio: z.string().max(160, "Bio must be less than 160 characters").optional(),
  avatar_url: z.string().url().optional().or(z.literal("")),
  about_me: z.string().max(1000, "About me must be less than 1000 characters").optional(),
  hobby: z.string().max(500, "Hobby must be less than 500 characters").optional(),
  tech_stack: z.string().max(500, "Tech stack must be less than 500 characters").optional(),
  footer_message: z.string().max(200, "Footer message must be less than 200 characters").optional(),
  welcome_message: z.string().max(150, "Welcome message must be less than 150 characters").optional(),
})

// PUT - Update profile
export async function PUT(request: NextRequest) {
  try {
    const token = request.cookies.get("auth-token")?.value
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = verifyToken(token)
    if (!user) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = profileSchema.parse(body)

    await executeQuery("UPDATE users SET name = ?, bio = ?, avatar_url = ?, about_me = ?, hobby = ?, tech_stack = ?, footer_message = ?, welcome_message = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?", [
      validatedData.name,
      validatedData.bio || null,
      validatedData.avatar_url || null,
      validatedData.about_me || null,
      validatedData.hobby || null,
      validatedData.tech_stack || null,
      validatedData.footer_message || null,
      validatedData.welcome_message || null,
      user.id,
    ])

    return NextResponse.json({ message: "Profile updated successfully" }, { status: 200 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0].message }, { status: 400 })
    }

    console.error("Error updating profile:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
