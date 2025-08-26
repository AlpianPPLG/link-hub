"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { 
  Instagram, 
  Facebook, 
  Twitter, 
  Linkedin, 
  Github, 
  Youtube, 
  Music,
  MessageSquare,
  Zap,
  Globe
} from "lucide-react"

interface SocialLink {
  platform: string
  url: string
  is_active: boolean
  display_order: number
}

interface SocialMediaIconsProps {
  socialLinks: SocialLink[]
  className?: string
  iconSize?: "sm" | "md" | "lg"
}

const PLATFORM_ICONS = {
  instagram: Instagram,
  facebook: Facebook,
  twitter: Twitter,
  linkedin: Linkedin,
  github: Github,
  youtube: Youtube,
  tiktok: Music,
  discord: MessageSquare,
  twitch: Zap,
  website: Globe,
}

const PLATFORM_COLORS = {
  instagram: "hover:bg-gradient-to-r hover:from-purple-500 hover:via-pink-500 hover:to-orange-500 hover:text-white",
  facebook: "hover:bg-blue-600 hover:text-white",
  twitter: "hover:bg-sky-500 hover:text-white",
  linkedin: "hover:bg-blue-700 hover:text-white",
  github: "hover:bg-gray-800 hover:text-white dark:hover:bg-gray-200 dark:hover:text-gray-800",
  youtube: "hover:bg-red-600 hover:text-white",
  tiktok: "hover:bg-black hover:text-white",
  discord: "hover:bg-indigo-600 hover:text-white",
  twitch: "hover:bg-purple-600 hover:text-white",
  website: "hover:bg-gray-600 hover:text-white",
}

const SIZE_CLASSES = {
  sm: "h-8 w-8",
  md: "h-10 w-10",
  lg: "h-12 w-12",
}

const ICON_SIZE_CLASSES = {
  sm: "h-4 w-4",
  md: "h-5 w-5", 
  lg: "h-6 w-6",
}

export function SocialMediaIcons({ 
  socialLinks, 
  className = "",
  iconSize = "md" 
}: SocialMediaIconsProps) {
  const [clickedIcon, setClickedIcon] = useState<string | null>(null)

  const handleSocialClick = async (platform: string, url: string) => {
    setClickedIcon(platform)
    
    // Track the click (optional analytics)
    try {
      await fetch("/api/track-social-click", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ platform }),
      }).catch(() => {
        // Ignore tracking errors
      })
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      // Ignore tracking errors
    }

    // Open link in new tab
    window.open(url, "_blank", "noopener,noreferrer")
    
    // Reset click state after animation
    setTimeout(() => setClickedIcon(null), 300)
  }

  if (!socialLinks || socialLinks.length === 0) {
    return null
  }

  // Filter and sort active links
  const activeSocialLinks = socialLinks
    .filter(link => link.is_active)
    .sort((a, b) => a.display_order - b.display_order)

  if (activeSocialLinks.length === 0) {
    return null
  }

  return (
    <div className={`flex gap-3 justify-center items-center ${className}`}>
      {activeSocialLinks.map((link) => {
        const IconComponent = PLATFORM_ICONS[link.platform as keyof typeof PLATFORM_ICONS]
        const colorClass = PLATFORM_COLORS[link.platform as keyof typeof PLATFORM_COLORS]
        const isClicked = clickedIcon === link.platform

        if (!IconComponent) {
          return null
        }

        return (
          <Button
            key={link.platform}
            variant="outline"
            size="icon"
            className={`
              ${SIZE_CLASSES[iconSize]}
              ${colorClass}
              transition-all duration-300 ease-in-out
              transform
              ${isClicked ? 'scale-95' : 'hover:scale-110'}
              border-2
              hover:border-transparent
              active:scale-95
              bg-white text-gray-700 border-gray-300
              hover:shadow-lg
              !important
            `}
            style={{
              backgroundColor: '#ffffff',
              color: '#374151',
              borderColor: '#d1d5db'
            }}
            onClick={() => handleSocialClick(link.platform, link.url)}
            title={`Visit ${link.platform.charAt(0).toUpperCase() + link.platform.slice(1)}`}
          >
            <IconComponent className={`${ICON_SIZE_CLASSES[iconSize]} transition-colors duration-300`} />
          </Button>
        )
      })}
    </div>
  )
}