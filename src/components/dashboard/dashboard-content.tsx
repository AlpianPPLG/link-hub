"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { LinkIcon, Settings, LogOut, BarChart3, Eye } from "lucide-react"
import { LinkManager } from "./link-manager"
import { ProfileSettings } from "./profile-settings"
import { AnalyticsOverview } from "./analytics-overview"
import { DashboardSkeleton } from "@/components/loading-skeleton"
import { toast } from "sonner"

interface User {
  id: string
  name: string
  username: string
  email: string
  avatar_url?: string
  bio?: string
}

interface Link {
  id: string
  title: string
  url: string
  description?: string
  order: number
  is_active: boolean
  clicks: number
}

export function DashboardContent() {
  const [user, setUser] = useState<User | null>(null)
  const [links, setLinks] = useState<Link[]>([])
  const [activeTab, setActiveTab] = useState<"links" | "analytics" | "settings">("links")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const router = useRouter()

  useEffect(() => {
    fetchUserData()
    fetchLinks()
  }, [])

  const fetchUserData = async () => {
    try {
      const response = await fetch("/api/auth/me")
      if (response.ok) {
        const data = await response.json()
        setUser(data.user)
      } else {
        setError("Failed to load user data")
        toast.error("Failed to load user data")
      }
    } catch (error) {
      console.error("Error fetching user data:", error)
      setError("Failed to load user data")
      toast.error("Failed to load user data")
    } finally {
      setIsLoading(false)
    }
  }

  const fetchLinks = async () => {
    try {
      const response = await fetch("/api/links")
      if (response.ok) {
        const data = await response.json()
        setLinks(data.links || [])
      } else {
        toast.error("Failed to load links")
      }
    } catch (error) {
      console.error("Error fetching links:", error)
      toast.error("Failed to load links")
    }
  }

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" })
      toast.success("Logged out successfully")
      router.push("/")
      router.refresh()
    } catch (error) {
      console.error("Logout error:", error)
      toast.error("Failed to logout")
    }
  }

  const totalClicks = links.reduce((sum, link) => sum + link.clicks, 0)
  const activeLinks = links.filter((link) => link.is_active).length

  if (isLoading) {
    return <DashboardSkeleton />
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Error Loading Dashboard</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <LinkIcon className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">Manage your LinkHub</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(`/${user?.username}`, "_blank")}
                className="hidden sm:flex"
              >
                <Eye className="h-4 w-4 mr-2" />
                View Profile
              </Button>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader className="text-center">
                <Avatar className="h-20 w-20 mx-auto mb-4">
                  <AvatarImage src={user?.avatar_url || "/placeholder.svg"} alt={user?.name} />
                  <AvatarFallback className="text-lg">
                    {user?.name
                      ?.split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <CardTitle className="text-xl">{user?.name}</CardTitle>
                <CardDescription>@{user?.username}</CardDescription>
                <div className="flex justify-center mt-2">
                  <Badge variant="secondary" className="text-xs">
                    linkhub.com/{user?.username}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Active Links</span>
                    <span className="font-medium">{activeLinks}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Total Clicks</span>
                    <span className="font-medium">{totalClicks}</span>
                  </div>
                </div>
                <Separator className="my-4" />
                <nav className="space-y-2">
                  <Button
                    variant={activeTab === "links" ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => setActiveTab("links")}
                  >
                    <LinkIcon className="h-4 w-4 mr-2" />
                    Links
                  </Button>
                  <Button
                    variant={activeTab === "analytics" ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => setActiveTab("analytics")}
                  >
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Analytics
                  </Button>
                  <Button
                    variant={activeTab === "settings" ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => setActiveTab("settings")}
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </Button>
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeTab === "links" && <LinkManager links={links} onLinksChange={fetchLinks} />}
            {activeTab === "analytics" && <AnalyticsOverview links={links} />}
            {activeTab === "settings" && <ProfileSettings user={user} onUserUpdate={fetchUserData} />}
          </div>
        </div>
      </div>
    </div>
  )
}
