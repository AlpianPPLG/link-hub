/* eslint-disable @typescript-eslint/no-explicit-any */
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
    const metric = searchParams.get("metric") || "clicks" // clicks, views, engagement

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
      default:
        startDate.setDate(now.getDate() - 7)
    }

    const startDateStr = startDate.toISOString().split('T')[0]

    let trendsData: any[] = []

    switch (metric) {
      case "clicks":
        // Get click trends over time
        trendsData = await executeQuery(
          `SELECT 
            DATE(clicked_at) as date,
            COUNT(*) as value,
            'clicks' as metric
           FROM link_clicks lc
           JOIN links l ON lc.link_id = l.id
           WHERE l.user_id = ? AND lc.clicked_at >= ?
           GROUP BY DATE(clicked_at)
           ORDER BY date`,
          [user.id, startDateStr]
        ) as any[]
        break

      case "views":
        // Get profile view trends over time
        trendsData = await executeQuery(
          `SELECT 
            DATE(viewed_at) as date,
            COUNT(*) as value,
            'views' as metric
           FROM profile_views
           WHERE user_id = ? AND viewed_at >= ?
           GROUP BY DATE(viewed_at)
           ORDER BY date`,
          [user.id, startDateStr]
        ) as any[]
        break

      case "engagement":
        // Get engagement trends (clicks + views combined)
        const clicksData = await executeQuery(
          `SELECT 
            DATE(clicked_at) as date,
            COUNT(*) as clicks
           FROM link_clicks lc
           JOIN links l ON lc.link_id = l.id
           WHERE l.user_id = ? AND lc.clicked_at >= ?
           GROUP BY DATE(clicked_at)`,
          [user.id, startDateStr]
        ) as any[]

        const viewsData = await executeQuery(
          `SELECT 
            DATE(viewed_at) as date,
            COUNT(*) as views
           FROM profile_views
           WHERE user_id = ? AND viewed_at >= ?
           GROUP BY DATE(viewed_at)`,
          [user.id, startDateStr]
        ) as any[]

        // Merge clicks and views data
        const allDates = new Set([
          ...clicksData.map(item => item.date),
          ...viewsData.map(item => item.date)
        ])

        trendsData = Array.from(allDates).map(date => {
          const clickData = clicksData.find(item => item.date === date) || { clicks: 0 }
          const viewData = viewsData.find(item => item.date === date) || { views: 0 }
          return {
            date,
            value: (clickData.clicks || 0) + (viewData.views || 0),
            metric: 'engagement'
          }
        }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        break

      default:
        return NextResponse.json({ error: "Invalid metric parameter" }, { status: 400 })
    }

    // Calculate trend indicators
    if (trendsData.length >= 2) {
      const recent = trendsData.slice(-7) // Last 7 data points
      const previous = trendsData.slice(-14, -7) // Previous 7 data points
      
      const recentAvg = recent.reduce((sum, item) => sum + item.value, 0) / recent.length
      const previousAvg = previous.reduce((sum, item) => sum + item.value, 0) / previous.length
      
      const trendPercentage = previousAvg > 0 ? ((recentAvg - previousAvg) / previousAvg) * 100 : 0
      const trendDirection = trendPercentage > 0 ? "up" : trendPercentage < 0 ? "down" : "stable"

      return NextResponse.json({
        trends: trendsData,
        trendAnalysis: {
          direction: trendDirection,
          percentage: Math.abs(trendPercentage).toFixed(1),
          recentAverage: recentAvg.toFixed(1),
          previousAverage: previousAvg.toFixed(1)
        },
        metric,
        range
      })
    }

    return NextResponse.json({
      trends: trendsData,
      trendAnalysis: {
        direction: "stable",
        percentage: "0.0",
        recentAverage: "0.0",
        previousAverage: "0.0"
      },
      metric,
      range
    })

  } catch (error) {
    console.error("Error fetching trends:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
