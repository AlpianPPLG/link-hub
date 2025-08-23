import { type NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/lib/auth"
import { executeQuery } from "@/lib/database"
import { z } from "zod"

const updateLinkSchema = z.object({
  title: z.string().min(1).max(100).optional(),
  url: z.string().url().optional(),
  description: z.string().max(500).optional(),
  is_active: z.boolean().optional(),
})

// PUT - Update link
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
    const validatedData = updateLinkSchema.parse(body)

    // Check if link belongs to user
    const linkCheck = (await executeQuery("SELECT user_id FROM links WHERE id = ?", [params.id])) as any[]
    if (linkCheck.length === 0) {
      return NextResponse.json({ error: "Link not found" }, { status: 404 })
    }
    if (linkCheck[0].user_id !== user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    // Build update query dynamically
    const updateFields = []
    const updateValues = []

    if (validatedData.title !== undefined) {
      updateFields.push("title = ?")
      updateValues.push(validatedData.title)
    }
    if (validatedData.url !== undefined) {
      updateFields.push("url = ?")
      updateValues.push(validatedData.url)
    }
    if (validatedData.description !== undefined) {
      updateFields.push("description = ?")
      updateValues.push(validatedData.description)
    }
    if (validatedData.is_active !== undefined) {
      updateFields.push("is_active = ?")
      updateValues.push(validatedData.is_active)
    }

    if (updateFields.length === 0) {
      return NextResponse.json({ error: "No fields to update" }, { status: 400 })
    }

    updateFields.push("updated_at = CURRENT_TIMESTAMP")
    updateValues.push(params.id)

    await executeQuery(`UPDATE links SET ${updateFields.join(", ")} WHERE id = ?`, updateValues)

    return NextResponse.json({ message: "Link updated successfully" }, { status: 200 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0].message }, { status: 400 })
    }

    console.error("Error updating link:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// DELETE - Delete link
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = request.cookies.get("auth-token")?.value
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = verifyToken(token)
    if (!user) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    // Check if link belongs to user
    const linkCheck = (await executeQuery("SELECT user_id FROM links WHERE id = ?", [params.id])) as any[]
    if (linkCheck.length === 0) {
      return NextResponse.json({ error: "Link not found" }, { status: 404 })
    }
    if (linkCheck[0].user_id !== user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    await executeQuery("DELETE FROM links WHERE id = ?", [params.id])

    return NextResponse.json({ message: "Link deleted successfully" }, { status: 200 })
  } catch (error) {
    console.error("Error deleting link:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
