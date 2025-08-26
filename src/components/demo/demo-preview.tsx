/* eslint-disable @next/next/no-img-element */
"use client"

import { Card } from "@/components/ui/card"
import { ExternalLink, Smartphone } from "lucide-react"

interface DemoPreviewProps {
  profile: {
    name: string
    username: string
    bio: string
    avatar: string
  }
  links: Array<{
    id: string
    title: string
    url: string
    clicks: number
    isActive: boolean
  }>
  theme: string
  customColors: {
    background: string
    button: string
    text: string
  }
}

export function DemoPreview({ profile, links, theme }: DemoPreviewProps) {
  const getThemeClasses = () => {
    switch (theme) {
      case 'dark':
        return 'bg-gray-900 text-white'
      case 'forest':
        return 'bg-green-900 text-green-50'
      case 'ocean':
        return 'bg-blue-900 text-blue-50'
      case 'sunset':
        return 'bg-orange-900 text-orange-50'
      default:
        return 'bg-white text-gray-900'
    }
  }

  const getLinkClasses = () => {
    switch (theme) {
      case 'dark':
        return 'bg-gray-800 hover:bg-gray-700 text-white border-gray-700'
      case 'forest':
        return 'bg-green-800 hover:bg-green-700 text-green-50 border-green-700'
      case 'ocean':
        return 'bg-blue-800 hover:bg-blue-700 text-blue-50 border-blue-700'
      case 'sunset':
        return 'bg-orange-800 hover:bg-orange-700 text-orange-50 border-orange-700'
      default:
        return 'bg-gray-50 hover:bg-gray-100 text-gray-900 border-gray-200'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
        <Smartphone className="h-5 w-5" />
        <span className="font-medium">Live Preview</span>
      </div>
      
      <div className="bg-gray-800 p-4 rounded-2xl shadow-2xl">
        {/* Phone Frame */}
        <div className="bg-black p-1 rounded-xl">
          <div className={`w-full h-[600px] rounded-lg overflow-hidden ${getThemeClasses()}`}>
            <div className="p-6 text-center">
              {/* Avatar */}
              <div className="w-20 h-20 rounded-full mx-auto mb-4 overflow-hidden">
                <img 
                  src={profile.avatar} 
                  alt={profile.name}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Profile Info */}
              <h1 className="text-xl font-bold mb-1">{profile.name}</h1>
              <p className="text-sm opacity-80 mb-1">@{profile.username}</p>
              <p className="text-sm opacity-90 mb-6 px-4">{profile.bio}</p>
              
              {/* Links */}
              <div className="space-y-3">
                {links.filter(link => link.isActive).map((link) => (
                  <div
                    key={link.id}
                    className={`w-full p-4 rounded-lg border transition-colors cursor-pointer group ${getLinkClasses()}`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium truncate">{link.title}</span>
                      <ExternalLink className="h-4 w-4 opacity-60 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                ))}
                
                {links.filter(link => link.isActive).length === 0 && (
                  <div className="text-center py-8 opacity-60">
                    <p className="text-sm">No active links yet</p>
                    <p className="text-xs mt-1">Add some links to see them here!</p>
                  </div>
                )}
              </div>
              
              {/* Demo Badge */}
              <div className="mt-8 pt-4 border-t border-current/20">
                <div className="inline-flex items-center space-x-2 bg-black/20 px-3 py-1 rounded-full">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-xs font-medium">LIVE DEMO</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Preview Info */}
      <Card className="p-4">
        <div className="text-center">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
            Real-time Preview
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Changes you make will appear instantly in this preview. This is exactly how your profile will look to visitors!
          </p>
        </div>
      </Card>
    </div>
  )
}