import { type NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/lib/auth"
import { executeQuery } from "@/lib/database"

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

    const { searchParams } = new URL(request.url)
    const range = searchParams.get("range") || "7d"

    // Calculate date range
    const now = new Date()
    const startDate = new Date()
    switch (range) {
      case "7d":
        startDate.setDate(now.getDate() - 7)
        break
      case "30d":
        startDate.setDate(now.getDate() - 30)
        break
      case "90d":
        startDate.setDate(now.getDate() - 90)
        break
      case "1y":
        startDate.setFullYear(now.getFullYear() - 1)
        break
    }

    // Get detailed analytics data
    const analyticsData = (await executeQuery(
      `SELECT 
         l.title as link_title,
         l.url as link_url,
         COUNT(lc.id) as total_clicks,
         DATE(lc.clicked_at) as click_date,
         lc.country,
         lc.referrer
       FROM links l
       LEFT JOIN link_clicks lc ON l.id = lc.link_id AND lc.clicked_at >= ?
       WHERE l.user_id = ?
       GROUP BY l.id, DATE(lc.clicked_at), lc.country, lc.referrer
       ORDER BY lc.clicked_at DESC`,
      [startDate.toISOString(), user.id],
    )) as any[]

    // Convert to CSV
    const csvHeaders = ["Link Title", "URL", "Clicks", "Date", "Country", "Referrer"]
    const csvRows = analyticsData.map((row) => [
      `"${row.link_title || ""}"`,
      `"${row.link_url || ""}"`,
      row.total_clicks || 0,
      row.click_date || "",
      `"${row.country || ""}"`,
      `"${row.referrer || ""}"`,
    ])

    const csvContent = [csvHeaders.join(","), ...csvRows.map((row) => row.join(","))].join("\n")

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="analytics-${range}.csv"`,
      },
    })
  } catch (error) {
    console.error("Error exporting analytics:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
