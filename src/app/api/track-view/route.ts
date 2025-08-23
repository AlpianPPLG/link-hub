import { type NextRequest, NextResponse } from "next/server"
import { executeQuery } from "@/lib/database"
import { z } from "zod"

const trackViewSchema = z.object({
  username: z.string().min(1, "Username is required"),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { username } = trackViewSchema.parse(body)

    // Get client information
    const forwarded = request.headers.get("x-forwarded-for")
    const ip = forwarded ? forwarded.split(",")[0] : request.headers.get("x-real-ip") || "unknown"
    const userAgent = request.headers.get("user-agent") || ""
    const referrer = request.headers.get("referer") || ""

    // Get user info
    const userInfo = (await executeQuery("SELECT id FROM users WHERE username = ?", [username])) as any[]

    if (userInfo.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const userId = userInfo[0].id

    // Insert profile view record
    await executeQuery(
      "INSERT INTO profile_views (id, user_id, ip_address, user_agent, referrer, viewed_at) VALUES (?, ?, ?, ?, ?, NOW())",
      [crypto.randomUUID(), userId, ip, userAgent, referrer],
    )

    return NextResponse.json({ message: "View tracked successfully" }, { status: 200 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0].message }, { status: 400 })
    }

    console.error("Error tracking view:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
