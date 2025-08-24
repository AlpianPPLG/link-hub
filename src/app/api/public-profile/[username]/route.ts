import { type NextRequest, NextResponse } from "next/server"
import { executeQuery } from "@/lib/database"

export async function GET(request: NextRequest, { params }: { params: Promise<{ username: string }> }) {
  try {
    const { username } = await params
    
    // Get user data
    const userResults = (await executeQuery(
      "SELECT id, name, username, avatar_url, bio, about_me, hobby, tech_stack, footer_message, welcome_message FROM users WHERE username = ?",
      [username],
    )) as any[]

    if (userResults.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const user = userResults[0]

    // Get active links
    const links = await executeQuery(
      "SELECT id, title, url, `order`, clicks FROM links WHERE user_id = ? AND is_active = TRUE ORDER BY `order` ASC",
      [user.id],
    )

    // Get social links
    const socialLinks = await executeQuery(
      "SELECT platform, url, is_active, display_order FROM social_links WHERE user_id = ? AND is_active = TRUE ORDER BY display_order ASC, created_at ASC",
      [user.id]
    )

    // Get appearance settings
    const appearanceResults = (await executeQuery("SELECT * FROM appearances WHERE user_id = ?", [user.id])) as any[]
    const appearance = appearanceResults[0] || { 
      profile_theme: "light",
      custom_background_color: null,
      custom_button_color: null,
      custom_text_color: null
    }

    return NextResponse.json(
      {
        user,
        links,
        appearance,
        socialLinks,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Error fetching public profile:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
