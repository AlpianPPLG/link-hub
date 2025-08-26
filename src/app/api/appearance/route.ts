import { type NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/lib/auth"
import { executeQuery } from "@/lib/database"
import { z } from "zod"

const appearanceSchema = z.object({
  profile_theme: z.enum(["light", "dark", "forest", "ocean"]),
  custom_background_color: z.string().optional(),
  custom_button_color: z.string().optional(),
  custom_text_color: z.string().optional(),
})

// GET - Fetch user's appearance settings
export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("auth-token")?.value
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = verifyToken(token)
    if (!user) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    const appearance = (await executeQuery("SELECT * FROM appearances WHERE user_id = ?", [user.id])) as any[]

    return NextResponse.json({ 
      appearance: appearance[0] || { 
        profile_theme: "light",
        custom_background_color: null,
        custom_button_color: null,
        custom_text_color: null
      } 
    }, { status: 200 })
  } catch (error) {
    console.error("Error fetching appearance:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// PUT - Update appearance settings
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
    const validatedData = appearanceSchema.parse(body)

    // Filter out default/meaningless custom colors
    const cleanCustomBackgroundColor = 
      validatedData.custom_background_color === "" || 
      validatedData.custom_background_color === "#000000" || 
      validatedData.custom_background_color === "#ffffff" 
        ? null 
        : validatedData.custom_background_color

    const cleanCustomButtonColor = 
      validatedData.custom_button_color === "" || 
      validatedData.custom_button_color === "#000000" || 
      validatedData.custom_button_color === "#ffffff" 
        ? null 
        : validatedData.custom_button_color

    const cleanCustomTextColor = 
      validatedData.custom_text_color === "" || 
      validatedData.custom_text_color === "#000000" || 
      validatedData.custom_text_color === "#ffffff" 
        ? null 
        : validatedData.custom_text_color

    // Check if appearance record exists
    const existingAppearance = (await executeQuery("SELECT user_id FROM appearances WHERE user_id = ?", [
      user.id,
    ])) as any[]

    if (existingAppearance.length === 0) {
      // Create new appearance record
      await executeQuery(
        "INSERT INTO appearances (user_id, profile_theme, custom_background_color, custom_button_color, custom_text_color) VALUES (?, ?, ?, ?, ?)",
        [
          user.id,
          validatedData.profile_theme,
          cleanCustomBackgroundColor,
          cleanCustomButtonColor,
          cleanCustomTextColor,
        ],
      )
    } else {
      // Update existing appearance record
      await executeQuery(
        "UPDATE appearances SET profile_theme = ?, custom_background_color = ?, custom_button_color = ?, custom_text_color = ?, updated_at = CURRENT_TIMESTAMP WHERE user_id = ?",
        [
          validatedData.profile_theme,
          cleanCustomBackgroundColor,
          cleanCustomButtonColor,
          cleanCustomTextColor,
          user.id,
        ],
      )
    }

    return NextResponse.json({ message: "Appearance updated successfully" }, { status: 200 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0].message }, { status: 400 })
    }

    console.error("Error updating appearance:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
