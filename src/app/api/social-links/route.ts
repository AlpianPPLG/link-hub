import { type NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/lib/auth"
import { executeQuery } from "@/lib/database"
import { z } from "zod"

const socialLinkSchema = z.object({
  platform: z.enum(["instagram", "facebook", "twitter", "linkedin", "github", "youtube", "tiktok", "discord", "twitch", "website"]),
  url: z.string().url("Please enter a valid URL"),
  is_active: z.boolean().optional(),
  display_order: z.number().int().min(0).optional(),
})

const updateSocialLinksSchema = z.array(socialLinkSchema)

// GET - Fetch user's social links
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

    const socialLinks = await executeQuery(
      "SELECT platform, url, is_active, display_order FROM social_links WHERE user_id = ? ORDER BY display_order ASC, created_at ASC",
      [user.id]
    )

    return NextResponse.json({ social_links: socialLinks }, { status: 200 })
  } catch (error) {
    console.error("Error fetching social links:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// POST - Add a new social link
export async function POST(request: NextRequest) {
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
    const validatedData = socialLinkSchema.parse(body)

    // Check if platform already exists for this user
    const existingLink = await executeQuery(
      "SELECT id FROM social_links WHERE user_id = ? AND platform = ?",
      [user.id, validatedData.platform]
    ) as any[]

    if (existingLink.length > 0) {
      return NextResponse.json(
        { error: "Social link for this platform already exists" },
        { status: 400 }
      )
    }

    // Get the next display order
    const orderResult = await executeQuery(
      "SELECT COALESCE(MAX(display_order), -1) + 1 as next_order FROM social_links WHERE user_id = ?",
      [user.id]
    ) as any[]
    
    const displayOrder = validatedData.display_order ?? orderResult[0]?.next_order ?? 0

    await executeQuery(
      "INSERT INTO social_links (user_id, platform, url, is_active, display_order) VALUES (?, ?, ?, ?, ?)",
      [
        user.id,
        validatedData.platform,
        validatedData.url,
        validatedData.is_active ?? true,
        displayOrder,
      ]
    )

    return NextResponse.json({ message: "Social link added successfully" }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0].message }, { status: 400 })
    }

    console.error("Error adding social link:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// PUT - Update all social links
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
    const validatedData = updateSocialLinksSchema.parse(body)

    // Delete existing social links
    await executeQuery("DELETE FROM social_links WHERE user_id = ?", [user.id])

    // Insert new social links
    for (let i = 0; i < validatedData.length; i++) {
      const link = validatedData[i]
      await executeQuery(
        "INSERT INTO social_links (user_id, platform, url, is_active, display_order) VALUES (?, ?, ?, ?, ?)",
        [user.id, link.platform, link.url, link.is_active ?? true, link.display_order ?? i]
      )
    }

    return NextResponse.json({ message: "Social links updated successfully" }, { status: 200 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0].message }, { status: 400 })
    }

    console.error("Error updating social links:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// DELETE - Remove a specific social link
export async function DELETE(request: NextRequest) {
  try {
    const token = request.cookies.get("auth-token")?.value
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = verifyToken(token)
    if (!user) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    const url = new URL(request.url)
    const platform = url.searchParams.get("platform")

    if (!platform) {
      return NextResponse.json({ error: "Platform parameter is required" }, { status: 400 })
    }

    await executeQuery(
      "DELETE FROM social_links WHERE user_id = ? AND platform = ?",
      [user.id, platform]
    )

    return NextResponse.json({ message: "Social link removed successfully" }, { status: 200 })
  } catch (error) {
    console.error("Error removing social link:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}