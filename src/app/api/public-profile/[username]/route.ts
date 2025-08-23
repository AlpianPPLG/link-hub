import { type NextRequest, NextResponse } from "next/server"
import { executeQuery } from "@/lib/database"

export async function GET(request: NextRequest, { params }: { params: Promise<{ username: string }> }) {
  try {
    const { username } = await params
    
    // Get user data
    const userResults = (await executeQuery(
      "SELECT id, name, username, avatar_url, bio FROM users WHERE username = ?",
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

    // Get appearance settings
    const appearanceResults = (await executeQuery("SELECT * FROM appearances WHERE user_id = ?", [user.id])) as any[]
    const appearance = appearanceResults[0] || { theme: "light" }

    return NextResponse.json(
      {
        user,
        links,
        appearance,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Error fetching public profile:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
