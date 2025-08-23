import { type NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/lib/auth"
import { executeQuery } from "@/lib/database"
import { z } from "zod"

const linkSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title must be less than 100 characters"),
  url: z.string().url("Please enter a valid URL"),
  description: z.string().max(500).optional(),
  is_active: z.boolean().optional(),
})

// GET - Fetch user's links
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

    const links = await executeQuery("SELECT * FROM links WHERE user_id = ? ORDER BY `order` ASC", [user.id])

    return NextResponse.json({ links }, { status: 200 })
  } catch (error) {
    console.error("Error fetching links:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// POST - Create new link
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
    const validatedData = linkSchema.parse(body)

    // Get the next order number
    const orderResult = (await executeQuery("SELECT MAX(`order`) as max_order FROM links WHERE user_id = ?", [
      user.id,
    ])) as any[]
    const nextOrder = (orderResult[0]?.max_order || 0) + 1

    const linkId = crypto.randomUUID()

    await executeQuery("INSERT INTO links (id, user_id, title, url, description, is_active, `order`) VALUES (?, ?, ?, ?, ?, ?, ?)", [
      linkId,
      user.id,
      validatedData.title,
      validatedData.url,
      validatedData.description || null,
      validatedData.is_active ?? true,
      nextOrder,
    ])

    return NextResponse.json({ message: "Link created successfully", id: linkId }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0].message }, { status: 400 })
    }

    console.error("Error creating link:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
