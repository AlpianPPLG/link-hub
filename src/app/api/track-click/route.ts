/* eslint-disable @typescript-eslint/no-explicit-any */
import { type NextRequest, NextResponse } from "next/server"
import { executeQuery } from "@/lib/database"
import { z } from "zod"

const trackClickSchema = z.object({
  linkId: z.string().uuid("Invalid link ID"),
})

export async function POST(request: NextRequest) {
  try {
    // Check if request has content
    const contentLength = request.headers.get('content-length')
    if (!contentLength || contentLength === '0') {
      return NextResponse.json({ error: "Request body is required" }, { status: 400 })
    }

    // Check content type
    const contentType = request.headers.get('content-type')
    if (!contentType || !contentType.includes('application/json')) {
      return NextResponse.json({ error: "Content-Type must be application/json" }, { status: 400 })
    }

    let body
    try {
      body = await request.json()
    } catch (jsonError) {
      console.error("JSON parsing error:", jsonError)
      return NextResponse.json({ error: "Invalid JSON format" }, { status: 400 })
    }

    const { linkId } = trackClickSchema.parse(body)

    // Get client information
    const forwarded = request.headers.get("x-forwarded-for")
    const ip = forwarded ? forwarded.split(",")[0] : request.headers.get("x-real-ip") || "unknown"
    const userAgent = request.headers.get("user-agent") || ""
    const referrer = request.headers.get("referer") || ""

    // Get link and user info
    const linkInfo = (await executeQuery("SELECT user_id FROM links WHERE id = ?", [linkId])) as any[]

    if (linkInfo.length === 0) {
      return NextResponse.json({ error: "Link not found" }, { status: 404 })
    }

    const userId = linkInfo[0].user_id

    // Insert detailed click record
    await executeQuery(
      "INSERT INTO link_clicks (id, link_id, user_id, ip_address, user_agent, referrer, clicked_at) VALUES (?, ?, ?, ?, ?, ?, NOW())",
      [crypto.randomUUID(), linkId, userId, ip, userAgent, referrer],
    )

    // Increment simple click count for backward compatibility
    await executeQuery("UPDATE links SET clicks = clicks + 1 WHERE id = ?", [linkId])

    return NextResponse.json({ message: "Click tracked successfully" }, { status: 200 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0].message }, { status: 400 })
    }

    console.error("Error tracking click:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
