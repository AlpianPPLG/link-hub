"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3, TrendingUp, Eye, MousePointer, Lock } from "lucide-react"

interface Link {
  id: string
  title: string
  url: string
  clicks: number
  isActive: boolean
}

interface DemoAnalyticsProps {
  links: Link[]
}

export function DemoAnalytics({ links }: DemoAnalyticsProps) {
  const totalClicks = links.reduce((sum, link) => sum + link.clicks, 0)
  const totalViews = Math.floor(totalClicks * 1.8) // Demo calculation
  
  // Generate fake daily data for the last 7 days
  const dailyData = Array.from({ length: 7 }, (_, i) => ({
    day: new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { weekday: 'short' }),
    clicks: Math.floor(Math.random() * 20) + 5,
    views: Math.floor(Math.random() * 35) + 10
  }))

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <Eye className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Profile Views
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {totalViews.toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <MousePointer className="h-8 w-8 text-green-600 dark:text-green-400" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Link Clicks
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {totalClicks.toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Link Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Link Performance</CardTitle>
          <CardDescription>
            See how your links are performing (demo data)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {links.length > 0 ? (
              links.map((link) => (
                <div key={link.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 dark:text-white truncate">
                      {link.title}
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                      {link.url}
                    </p>
                  </div>
                  <div className="text-right ml-4">
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                      {link.clicks}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      clicks
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <BarChart3 className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p className="text-sm">No links to analyze yet</p>
                <p className="text-xs mt-1">Add some links to see performance data!</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Chart Placeholder - Locked in Demo */}
      <Card className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-gray-100/70 dark:to-gray-800/70 z-10"></div>
        <CardHeader className="relative z-20">
          <CardTitle className="flex items-center opacity-60">
            <TrendingUp className="h-5 w-5 mr-2" />
            Weekly Trends
          </CardTitle>
          <CardDescription className="opacity-60">
            Detailed charts and trends (Premium feature)
          </CardDescription>
        </CardHeader>
        <CardContent className="relative z-20 opacity-60">
          {/* Fake Chart */}
          <div className="h-32 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-end justify-around p-4">
            {dailyData.map((day, index) => (
              <div key={index} className="flex flex-col items-center space-y-2">
                <div 
                  className="bg-blue-500 w-6 rounded-t"
                  style={{ height: `${(day.clicks / 25) * 80}px` }}
                ></div>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {day.day}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
        <div className="absolute inset-0 flex items-center justify-center z-30">
          <div className="bg-purple-500 text-white px-4 py-2 rounded-lg font-medium text-sm">
            <Lock className="h-4 w-4 inline mr-2" />
            Premium Charts
          </div>
        </div>
      </Card>

      {/* Export Data - Locked in Demo */}
      <Card className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-gray-100/70 dark:to-gray-800/70 z-10"></div>
        <CardHeader className="relative z-20">
          <CardTitle className="opacity-60">Export Analytics</CardTitle>
          <CardDescription className="opacity-60">
            Download detailed reports (Premium feature)
          </CardDescription>
        </CardHeader>
        <CardContent className="relative z-20 opacity-60">
          <div className="grid grid-cols-2 gap-4">
            <button className="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg text-left cursor-not-allowed">
              <h4 className="font-medium text-gray-900 dark:text-white">CSV Export</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">Download as spreadsheet</p>
            </button>
            <button className="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg text-left cursor-not-allowed">
              <h4 className="font-medium text-gray-900 dark:text-white">PDF Report</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">Detailed analytics report</p>
            </button>
          </div>
        </CardContent>
        <div className="absolute inset-0 flex items-center justify-center z-30">
          <div className="bg-green-500 text-white px-4 py-2 rounded-lg font-medium text-sm">
            <Lock className="h-4 w-4 inline mr-2" />
            Premium Export
          </div>
        </div>
      </Card>

      {/* Demo Notice */}
      <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
        <CardContent className="pt-6">
          <div className="text-center">
            <BarChart3 className="h-8 w-8 text-blue-600 dark:text-blue-400 mx-auto mb-3" />
            <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
              Demo Analytics
            </h3>
            <p className="text-blue-700 dark:text-blue-300 text-sm">
              This shows sample analytics data. Real accounts get live tracking, detailed charts, and export features!
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}