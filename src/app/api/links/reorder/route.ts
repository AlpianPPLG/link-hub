import { NextRequest, NextResponse } from "next/server"
import { executeQuery } from "@/lib/database"

export async function PUT(request: NextRequest) {
  try {
    const { linkIds } = await request.json()

    if (!linkIds || !Array.isArray(linkIds)) {
      return NextResponse.json(
        { error: "Invalid request body. Expected array of link IDs." },
        { status: 400 }
      )
    }

    // Update the order for each link
    for (let i = 0; i < linkIds.length; i++) {
      await executeQuery(
        "UPDATE links SET `order` = ? WHERE id = ?",
        [i + 1, linkIds[i]]
      )
    }

    return NextResponse.json({ message: "Links reordered successfully" })
  } catch (error) {
    console.error("Error reordering links:", error)
    return NextResponse.json(
      { error: "Failed to reorder links" },
      { status: 500 }
    )
  }
}
