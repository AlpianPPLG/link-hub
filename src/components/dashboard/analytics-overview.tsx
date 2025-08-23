"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BarChart3, TrendingUp, Eye, MousePointer, Download, Globe, Clock } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts"

interface Link {
  id: string
  title: string
  url: string
  order: number
  is_active: boolean
  clicks: number
}

interface AnalyticsData {
  totalClicks: number
  totalViews: number
  uniqueVisitors: number
  topCountries: Array<{ country: string; clicks: number }>
  clicksOverTime: Array<{ date: string; clicks: number; views: number }>
  linkPerformance: Array<{ linkId: string; title: string; clicks: number; ctr: number }>
  recentActivity: Array<{ type: string; timestamp: string; details: string }>
}

interface AnalyticsOverviewProps {
  links: Link[]
}

export function AnalyticsOverview({ links }: AnalyticsOverviewProps) {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [timeRange, setTimeRange] = useState("7d")
  const [activeTab, setActiveTab] = useState("overview")

  useEffect(() => {
    fetchAnalytics()
  }, [timeRange])

  const fetchAnalytics = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/analytics?range=${timeRange}`)
      if (response.ok) {
        const data = await response.json()
        setAnalyticsData(data)
      }
    } catch (error) {
      console.error("Error fetching analytics:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const exportAnalytics = async () => {
    try {
      const response = await fetch(`/api/analytics/export?range=${timeRange}`)
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `analytics-${timeRange}.csv`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      }
    } catch (error) {
      console.error("Error exporting analytics:", error)
    }
  }

  const totalClicks = links.reduce((sum, link) => sum + link.clicks, 0)
  const activeLinks = links.filter((link) => link.is_active).length
  const topLink = links.reduce((prev, current) => (prev.clicks > current.clicks ? prev : current), links[0])

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Analytics</h2>
            <p className="text-gray-600 dark:text-gray-400">Track your link performance</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/3 mb-1"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Analytics</h2>
          <p className="text-gray-600 dark:text-gray-400">Track your link performance and audience insights</p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" onClick={exportAnalytics}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clicks</CardTitle>
            <MousePointer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData?.totalClicks || totalClicks}</div>
            <p className="text-xs text-muted-foreground">
              {timeRange === "7d" ? "Last 7 days" : timeRange === "30d" ? "Last 30 days" : "All time"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Profile Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData?.totalViews || 0}</div>
            <p className="text-xs text-muted-foreground">People who visited your profile</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unique Visitors</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData?.uniqueVisitors || 0}</div>
            <p className="text-xs text-muted-foreground">Individual people reached</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top Performer</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{topLink?.clicks || 0}</div>
            <p className="text-xs text-muted-foreground truncate">{topLink?.title || "No links yet"}</p>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="audience">Audience</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Clicks Over Time</CardTitle>
                <CardDescription>Daily clicks and profile views</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={analyticsData?.clicksOverTime || []}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="clicks" stroke="#3b82f6" strokeWidth={2} />
                    <Line type="monotone" dataKey="views" stroke="#10b981" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Link Performance</CardTitle>
                <CardDescription>Clicks per link</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={links.slice(0, 5)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="title" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="clicks" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Link Performance Details</CardTitle>
              <CardDescription>Detailed statistics for each of your links</CardDescription>
            </CardHeader>
            <CardContent>
              {links.length === 0 ? (
                <div className="text-center py-8">
                  <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400">No links to analyze yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {links
                    .sort((a, b) => b.clicks - a.clicks)
                    .map((link, index) => {
                      const clickRate = analyticsData?.totalViews
                        ? ((link.clicks / analyticsData.totalViews) * 100).toFixed(1)
                        : "0.0"
                      return (
                        <div key={link.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full text-sm font-medium">
                              {index + 1}
                            </div>
                            <div className="flex-1">
                              <h3 className="font-medium text-gray-900 dark:text-white">{link.title}</h3>
                              <p className="text-sm text-gray-600 dark:text-gray-400 truncate">{link.url}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-6">
                            <div className="text-right">
                              <div className="text-lg font-bold text-gray-900 dark:text-white">{link.clicks}</div>
                              <div className="text-xs text-gray-600 dark:text-gray-400">clicks</div>
                            </div>
                            <div className="text-right">
                              <div className="text-lg font-bold text-gray-900 dark:text-white">{clickRate}%</div>
                              <div className="text-xs text-gray-600 dark:text-gray-400">CTR</div>
                            </div>
                            <Badge variant={link.is_active ? "default" : "secondary"}>
                              {link.is_active ? "Active" : "Inactive"}
                            </Badge>
                            <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                              <div
                                className="bg-blue-600 h-2 rounded-full"
                                style={{
                                  width: totalClicks > 0 ? `${(link.clicks / totalClicks) * 100}%` : "0%",
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      )
                    })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audience" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Top Countries</CardTitle>
                <CardDescription>Where your visitors are from</CardDescription>
              </CardHeader>
              <CardContent>
                {analyticsData?.topCountries && analyticsData.topCountries.length > 0 ? (
                  <div className="space-y-3">
                    {analyticsData.topCountries.slice(0, 5).map((country, index) => (
                      <div key={country.country} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded text-xs flex items-center justify-center font-medium">
                            {index + 1}
                          </div>
                          <span className="font-medium">{country.country || "Unknown"}</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className="text-sm text-gray-600 dark:text-gray-400">{country.clicks} clicks</span>
                          <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full"
                              style={{
                                width: `${(country.clicks / (analyticsData?.totalClicks || 1)) * 100}%`,
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Globe className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-400">No geographic data yet</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Visitor Insights</CardTitle>
                <CardDescription>Understanding your audience</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <span className="text-sm font-medium">Total Visitors</span>
                    <span className="text-lg font-bold">{analyticsData?.uniqueVisitors || 0}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <span className="text-sm font-medium">Return Visitors</span>
                    <span className="text-lg font-bold">
                      {analyticsData?.totalViews && analyticsData?.uniqueVisitors
                        ? Math.max(0, analyticsData.totalViews - analyticsData.uniqueVisitors)
                        : 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <span className="text-sm font-medium">Avg. Clicks per Visitor</span>
                    <span className="text-lg font-bold">
                      {analyticsData?.uniqueVisitors
                        ? ((analyticsData?.totalClicks || 0) / analyticsData.uniqueVisitors).toFixed(1)
                        : "0.0"}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="activity" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest interactions with your profile</CardDescription>
            </CardHeader>
            <CardContent>
              {analyticsData?.recentActivity && analyticsData.recentActivity.length > 0 ? (
                <div className="space-y-4">
                  {analyticsData.recentActivity.slice(0, 10).map((activity, index) => (
                    <div key={index} className="flex items-center space-x-4 p-3 border rounded-lg">
                      <div className="flex-shrink-0">
                        {activity.type === "click" ? (
                          <MousePointer className="h-5 w-5 text-blue-600" />
                        ) : (
                          <Eye className="h-5 w-5 text-green-600" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{activity.details}</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400 flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {new Date(activity.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400">No recent activity</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
