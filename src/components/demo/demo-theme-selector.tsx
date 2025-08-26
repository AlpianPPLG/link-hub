/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Crown, Lock } from "lucide-react"

interface DemoThemeSelectorProps {
  currentTheme: string
  customColors: {
    background: string
    button: string
    text: string
  }
  onThemeChange: (theme: string) => void
  onColorsChange: (colors: any) => void
}

export function DemoThemeSelector({ 
  currentTheme, 
  onThemeChange}: DemoThemeSelectorProps) {
  const themes = [
    {
      id: 'light',
      name: 'Light',
      description: 'Clean & bright',
      preview: 'bg-white border-gray-200',
      available: true
    },
    {
      id: 'dark',
      name: 'Dark',
      description: 'Sleek & modern',
      preview: 'bg-gray-900 border-gray-700',
      available: true
    },
    {
      id: 'forest',
      name: 'Forest',
      description: 'Natural & calm',
      preview: 'bg-green-900 border-green-700',
      available: true
    },
    {
      id: 'ocean',
      name: 'Ocean',
      description: 'Cool & refreshing',
      preview: 'bg-blue-900 border-blue-700',
      available: false // Demo limitation
    },
    {
      id: 'sunset',
      name: 'Sunset',
      description: 'Warm & vibrant',
      preview: 'bg-orange-900 border-orange-700',
      available: false // Demo limitation
    },
    {
      id: 'custom',
      name: 'Custom',
      description: 'Your own style',
      preview: 'bg-gradient-to-br from-purple-500 to-pink-500',
      available: false // Demo limitation
    }
  ]

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Choose Theme</CardTitle>
          <CardDescription>
            Select a theme for your profile. Some themes are locked in the demo.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {themes.map((theme) => (
              <div key={theme.id} className="relative">
                <button
                  onClick={() => theme.available && onThemeChange(theme.id)}
                  disabled={!theme.available}
                  className={`w-full p-4 rounded-lg border-2 transition-all ${
                    currentTheme === theme.id
                      ? 'border-blue-500 ring-2 ring-blue-200 dark:ring-blue-800'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  } ${!theme.available ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  <div className={`w-full h-16 rounded-md mb-3 ${theme.preview}`}></div>
                  <div className="text-left">
                    <h3 className="font-medium text-gray-900 dark:text-white flex items-center">
                      {theme.name}
                      {!theme.available && (
                        <Lock className="h-3 w-3 ml-1 text-gray-400" />
                      )}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {theme.description}
                    </p>
                  </div>
                </button>
                
                {!theme.available && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-lg">
                    <div className="bg-black/70 text-white px-2 py-1 rounded text-xs font-medium">
                      Pro Only
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Custom Colors - Locked in Demo */}
      <Card className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-gray-100/50 dark:to-gray-800/50 z-10"></div>
        <CardHeader className="relative z-20">
          <CardTitle className="flex items-center">
            <span className="opacity-60">Custom Colors</span>
            <Crown className="h-5 w-5 ml-2 text-amber-500" />
          </CardTitle>
          <CardDescription className="opacity-60">
            Create your own color scheme (Premium feature)
          </CardDescription>
        </CardHeader>
        <CardContent className="relative z-20 opacity-60">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Background
              </label>
              <div className="w-full h-10 bg-gray-200 dark:bg-gray-700 rounded-md border"></div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Buttons
              </label>
              <div className="w-full h-10 bg-gray-200 dark:bg-gray-700 rounded-md border"></div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Text
              </label>
              <div className="w-full h-10 bg-gray-200 dark:bg-gray-700 rounded-md border"></div>
            </div>
          </div>
        </CardContent>
        <div className="absolute inset-0 flex items-center justify-center z-30">
          <div className="bg-amber-500 text-white px-4 py-2 rounded-lg font-medium text-sm">
            <Crown className="h-4 w-4 inline mr-2" />
            Premium Feature
          </div>
        </div>
      </Card>

      {/* Upgrade Notice */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-800">
        <CardContent className="pt-6">
          <div className="text-center">
            <Crown className="h-8 w-8 text-blue-600 dark:text-blue-400 mx-auto mb-3" />
            <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
              Unlock All Themes
            </h3>
            <p className="text-blue-700 dark:text-blue-300 text-sm mb-4">
              Get access to all 8 themes, custom colors, and advanced styling options with a free account.
            </p>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              Create Free Account
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}