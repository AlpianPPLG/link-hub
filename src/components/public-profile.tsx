"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ExternalLink, Share2, Check } from "lucide-react"

interface User {
  id: string
  name: string
  username: string
  avatar_url?: string
  bio?: string
}

interface Link {
  id: string
  title: string
  url: string
  order: number
  clicks: number
}

interface Appearance {
  profile_theme: string
  background_image_url?: string
  custom_background_color?: string
  custom_button_color?: string
  custom_text_color?: string
}

interface PublicProfileProps {
  user: User
  links: Link[]
  appearance: Appearance
}

export function PublicProfile({ user, links, appearance }: PublicProfileProps) {
  const [copiedUrl, setCopiedUrl] = useState(false)

  useEffect(() => {
    const trackView = async () => {
      try {
        await fetch("/api/track-view", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username: user.username }),
        })
      } catch (error) {
        console.error("Error tracking view:", error)
      }
    }

    trackView()
  }, [user.username])

  const handleLinkClick = async (linkId: string, url: string) => {
    // Track the click
    try {
      await fetch("/api/track-click", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ linkId }),
      })
    } catch (error) {
      console.error("Error tracking click:", error)
    }

    // Open the link
    window.open(url, "_blank", "noopener,noreferrer")
  }

  const handleShare = async () => {
    const url = window.location.href

    if (navigator.share) {
      try {
        await navigator.share({
          title: `${user.name} - LinkHub`,
          text: user.bio || `Check out ${user.name}'s links`,
          url: url,
        })
      } catch (error) {
        // Fallback to clipboard
        copyToClipboard(url)
      }
    } else {
      copyToClipboard(url)
    }
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedUrl(true)
      setTimeout(() => setCopiedUrl(false), 2000)
    } catch (error) {
      console.error("Failed to copy:", error)
    }
  }

  const getThemeClasses = () => {
    const baseThemes = {
      dark: {
        background: "bg-gray-900",
        card: "bg-gray-800 border-gray-700",
        text: "text-white",
        subtext: "text-gray-300",
        button: "bg-white text-gray-900 hover:bg-gray-100",
      },
      forest: {
        background: "bg-green-900",
        card: "bg-green-800 border-green-700",
        text: "text-white",
        subtext: "text-green-100",
        button: "bg-green-600 text-white hover:bg-green-500",
      },
      ocean: {
        background: "bg-blue-900",
        card: "bg-blue-800 border-blue-700",
        text: "text-white",
        subtext: "text-blue-100",
        button: "bg-blue-600 text-white hover:bg-blue-500",
      },
      light: {
        background: "bg-gray-50",
        card: "bg-white border-gray-200",
        text: "text-gray-900",
        subtext: "text-gray-600",
        button: "bg-gray-900 text-white hover:bg-gray-800",
      },
    }

    return baseThemes[appearance.profile_theme as keyof typeof baseThemes] || baseThemes.light
  }

  const themeClasses = getThemeClasses()

  const getCustomStyles = () => {
    const styles: React.CSSProperties = {}

    if (appearance.custom_background_color) {
      styles.backgroundColor = appearance.custom_background_color
    }

    return styles
  }

  const getCustomButtonStyles = () => {
    const styles: React.CSSProperties = {}

    if (appearance.custom_button_color) {
      styles.backgroundColor = appearance.custom_button_color
      // Calculate contrasting text color
      const hex = appearance.custom_button_color.replace("#", "")
      const r = Number.parseInt(hex.substr(0, 2), 16)
      const g = Number.parseInt(hex.substr(2, 2), 16)
      const b = Number.parseInt(hex.substr(4, 2), 16)
      const brightness = (r * 299 + g * 587 + b * 114) / 1000
      styles.color = brightness > 128 ? "#000000" : "#ffffff"
    }

    return styles
  }

  const getCustomTextStyles = () => {
    const styles: React.CSSProperties = {}

    if (appearance.custom_text_color) {
      styles.color = appearance.custom_text_color
    }

    return styles
  }

  return (
    <div className={`min-h-screen ${themeClasses.background} py-8 px-4`} style={getCustomStyles()}>
      <div className="max-w-md mx-auto">
        {/* Profile Header */}
        <div className="text-center mb-8">
          <Avatar className="h-24 w-24 mx-auto mb-4">
            <AvatarImage src={user.avatar_url || "/placeholder.svg"} alt={user.name} />
            <AvatarFallback className="text-2xl">
              {user.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <h1 className={`text-2xl font-bold ${themeClasses.text} mb-2`} style={getCustomTextStyles()}>
            {user.name}
          </h1>

          <p className={`text-sm ${themeClasses.subtext} mb-4`}>@{user.username}</p>

          {user.bio && (
            <p className={`${themeClasses.text} mb-6 leading-relaxed`} style={getCustomTextStyles()}>
              {user.bio}
            </p>
          )}

          {/* Share Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleShare}
            className={`${themeClasses.card} ${themeClasses.text} border-current`}
          >
            {copiedUrl ? (
              <>
                <Check className="h-4 w-4 mr-2" />
                Copied!
              </>
            ) : (
              <>
                <Share2 className="h-4 w-4 mr-2" />
                Share Profile
              </>
            )}
          </Button>
        </div>

        {/* Links */}
        <div className="space-y-4">
          {links.length === 0 ? (
            <Card className={themeClasses.card}>
              <CardContent className="py-12 text-center">
                <ExternalLink className={`h-12 w-12 ${themeClasses.subtext} mx-auto mb-4`} />
                <p className={themeClasses.subtext}>No links available yet</p>
              </CardContent>
            </Card>
          ) : (
            links.map((link) => (
              <Card
                key={link.id}
                className={`${themeClasses.card} cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-lg`}
                onClick={() => handleLinkClick(link.id, link.url)}
                style={getCustomButtonStyles()}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className={`font-semibold ${themeClasses.text} mb-1`} style={getCustomTextStyles()}>
                        {link.title}
                      </h3>
                      <p className={`text-sm ${themeClasses.subtext} truncate`}>{link.url}</p>
                    </div>
                    <ExternalLink className={`h-5 w-5 ${themeClasses.subtext} ml-4 flex-shrink-0`} />
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
          <p className={`text-sm ${themeClasses.subtext} mb-2`}>Create your own LinkHub</p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open("/", "_blank")}
            className={`${themeClasses.card} ${themeClasses.text} border-current`}
          >
            Get Started Free
          </Button>
        </div>
      </div>
    </div>
  )
}
