import { NextRequest, NextResponse } from "next/server"
import { executeQuery } from "@/lib/database"

export async function PUT(request: NextRequest) {
  try {
    const { linkIds } = await request.json()
    console.log("Reorder request received:", { linkIds })

    if (!linkIds || !Array.isArray(linkIds)) {
      console.log("Invalid request body:", { linkIds })
      return NextResponse.json(
        { error: "Invalid request body. Expected array of link IDs." },
        { status: 400 }
      )
    }

    if (linkIds.length === 0) {
      console.log("Empty linkIds array")
      return NextResponse.json(
        { error: "No link IDs provided." },
        { status: 400 }
      )
    }

    console.log("Starting reorder process for", linkIds.length, "links")

    // Update the order for each link
    for (let i = 0; i < linkIds.length; i++) {
      const newOrder = i + 1
      const linkId = linkIds[i]
      console.log(`Updating link ${linkId} to order ${newOrder}`)
      
      await executeQuery(
        "UPDATE links SET `order` = ? WHERE id = ?",
        [newOrder, linkId]
      )
    }

    console.log("Reorder completed successfully")
    return NextResponse.json({ message: "Links reordered successfully" })
  } catch (error) {
    console.error("Error reordering links:", error)
    return NextResponse.json(
      { error: "Failed to reorder links" },
      { status: 500 }
    )
  }
}
