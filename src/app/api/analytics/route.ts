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
    let startDate = new Date()
    
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
      default:
        startDate.setDate(now.getDate() - 7)
    }

    const startDateStr = startDate.toISOString().split('T')[0]

    // Get total clicks for the user's links
    const totalClicksResult = await executeQuery(
      "SELECT SUM(clicks) as total FROM links WHERE user_id = ?",
      [user.id]
    ) as any[]
    const totalClicks = totalClicksResult[0]?.total || 0

    // Get total profile views
    const totalViewsResult = await executeQuery(
      "SELECT COUNT(*) as total FROM profile_views WHERE user_id = ? AND viewed_at >= ?",
      [user.id, startDateStr]
    ) as any[]
    const totalViews = totalViewsResult[0]?.total || 0

    // Get unique visitors (based on IP addresses)
    const uniqueVisitorsResult = await executeQuery(
      "SELECT COUNT(DISTINCT ip_address) as total FROM profile_views WHERE user_id = ? AND viewed_at >= ?",
      [user.id, startDateStr]
    ) as any[]
    const uniqueVisitors = uniqueVisitorsResult[0]?.total || 0

    // Get clicks over time (daily)
    const clicksOverTimeResult = await executeQuery(
      `SELECT 
        DATE(clicked_at) as date,
        COUNT(*) as clicks
       FROM link_clicks lc
       JOIN links l ON lc.link_id = l.id
       WHERE l.user_id = ? AND lc.clicked_at >= ?
       GROUP BY DATE(clicked_at)
       ORDER BY date`,
      [user.id, startDateStr]
    ) as any[]

    // Get profile views over time (daily)
    const viewsOverTimeResult = await executeQuery(
      `SELECT 
        DATE(viewed_at) as date,
        COUNT(*) as views
       FROM profile_views
       WHERE user_id = ? AND viewed_at >= ?
       GROUP BY DATE(viewed_at)
       ORDER BY date`,
      [user.id, startDateStr]
    ) as any[]

    // Merge clicks and views data
    const clicksOverTime = clicksOverTimeResult.map(item => ({
      date: item.date,
      clicks: item.clicks,
      views: 0
    }))

    const viewsOverTime = viewsOverTimeResult.map(item => ({
      date: item.date,
      clicks: 0,
      views: item.views
    }))

    // Merge the data
    const allDates = new Set([
      ...clicksOverTime.map(item => item.date),
      ...viewsOverTime.map(item => item.date)
    ])

    const clicksOverTimeMerged = Array.from(allDates).map(date => {
      const clickData = clicksOverTime.find(item => item.date === date) || { clicks: 0, views: 0 }
      const viewData = viewsOverTime.find(item => item.date === date) || { clicks: 0, views: 0 }
      return {
        date,
        clicks: clickData.clicks,
        views: viewData.views
      }
    }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

    // Get top countries
    const topCountriesResult = await executeQuery(
      `SELECT 
        COALESCE(country, 'Unknown') as country,
        COUNT(*) as clicks
       FROM link_clicks lc
       JOIN links l ON lc.link_id = l.id
       WHERE l.user_id = ? AND lc.clicked_at >= ?
       GROUP BY country
       ORDER BY clicks DESC
       LIMIT 5`,
      [user.id, startDateStr]
    ) as any[]

    // Get recent activity
    const recentActivityResult = await executeQuery(
      `SELECT 
        'click' as type,
        lc.clicked_at as timestamp,
        CONCAT('Click on ', l.title) as details
       FROM link_clicks lc
       JOIN links l ON lc.link_id = l.id
       WHERE l.user_id = ?
       UNION ALL
       SELECT 
        'view' as type,
        pv.viewed_at as timestamp,
        'Profile viewed' as details
       FROM profile_views pv
       WHERE pv.user_id = ?
       ORDER BY timestamp DESC
       LIMIT 10`,
      [user.id, user.id]
    ) as any[]

    return NextResponse.json({
      totalClicks,
      totalViews,
      uniqueVisitors,
      topCountries: topCountriesResult,
      clicksOverTime: clicksOverTimeMerged,
      recentActivity: recentActivityResult
    })

  } catch (error) {
    console.error("Error fetching analytics:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
