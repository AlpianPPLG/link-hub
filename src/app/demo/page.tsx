/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LinkIcon, ArrowLeft, Eye, MousePointer, Palette, Lock, Crown } from "lucide-react"
import { DemoPreview } from "@/components/demo/demo-preview"
import { DemoLinkManager } from "@/components/demo/demo-link-manager"
import { DemoThemeSelector } from "@/components/demo/demo-theme-selector"
import { DemoAnalytics } from "@/components/demo/demo-analytics"

export default function DemoPage() {
  const [activeTab, setActiveTab] = useState<'profile' | 'links' | 'themes' | 'analytics'>('profile')
  const [demoData, setDemoData] = useState({
    profile: {
      name: "Demo User",
      username: "demouser",
      bio: "This is a demo profile to showcase LinkHub features!",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&q=80"
    },
    links: [
      { id: "1", title: "🌐 Personal Website", url: "https://example.com", clicks: 127, isActive: true },
      { id: "2", title: "📱 Social Media", url: "https://instagram.com/demo", clicks: 89, isActive: true },
      { id: "3", title: "💼 Portfolio", url: "https://portfolio.demo", clicks: 56, isActive: true }
    ],
    theme: "light",
    customColors: {
      background: "#ffffff",
      button: "#3b82f6",
      text: "#1f2937"
    }
  })

  const updateDemoData = (newData: any) => {
    setDemoData(prev => ({ ...prev, ...newData }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors">
              <ArrowLeft className="h-5 w-5" />
              <span>Back to Home</span>
            </Link>
          </div>
          <div className="flex items-center space-x-2">
            <LinkIcon className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900 dark:text-white">LinkHub Demo</span>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/register">
              <Button>Get Full Access</Button>
            </Link>
          </div>
        </nav>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Demo Introduction */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 bg-blue-100 dark:bg-blue-900/30 px-4 py-2 rounded-full mb-4">
            <Eye className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <span className="text-blue-800 dark:text-blue-200 font-medium">Interactive Demo</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Try LinkHub Without Signing Up
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-6">
            Explore our features with this interactive demo. See how easy it is to create your personalized link hub!
          </p>
          
          {/* Demo Limitations Notice */}
          <Card className="max-w-2xl mx-auto bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800">
            <CardContent className="pt-6">
              <div className="flex items-start space-x-3">
                <Lock className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-1 flex-shrink-0" />
                <div className="text-left">
                  <h3 className="font-semibold text-amber-800 dark:text-amber-200 mb-2">Demo Limitations</h3>
                  <ul className="text-sm text-amber-700 dark:text-amber-300 space-y-1">
                    <li>• Changes are not saved (temporary only)</li>
                    <li>• Limited to 3 links maximum</li>
                    <li>• No real analytics data</li>
                    <li>• No custom domain or advanced features</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Demo Interface */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Side - Controls */}
          <div>
            {/* Tab Navigation */}
            <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg mb-6">
              {[
                { id: 'profile', label: 'Profile', icon: Eye },
                { id: 'links', label: 'Links', icon: LinkIcon },
                { id: 'themes', label: 'Themes', icon: Palette },
                { id: 'analytics', label: 'Analytics', icon: MousePointer }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-md transition-colors ${
                    activeTab === tab.id
                      ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  <tab.icon className="h-4 w-4" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="space-y-6">
              {activeTab === 'profile' && (
                <Card>
                  <CardHeader>
                    <CardTitle>Profile Information</CardTitle>
                    <CardDescription>Customize your profile details</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Display Name
                      </label>
                      <input
                        type="text"
                        value={demoData.profile.name}
                        onChange={(e) => updateDemoData({
                          profile: { ...demoData.profile, name: e.target.value }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Bio
                      </label>
                      <textarea
                        value={demoData.profile.bio}
                        onChange={(e) => updateDemoData({
                          profile: { ...demoData.profile, bio: e.target.value }
                        })}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                  </CardContent>
                </Card>
              )}

              {activeTab === 'links' && (
                <DemoLinkManager
                  links={demoData.links}
                  onLinksChange={(links) => updateDemoData({ links })}
                />
              )}

              {activeTab === 'themes' && (
                <DemoThemeSelector
                  currentTheme={demoData.theme}
                  customColors={demoData.customColors}
                  onThemeChange={(theme) => updateDemoData({ theme })}
                  onColorsChange={(customColors) => updateDemoData({ customColors })}
                />
              )}

              {activeTab === 'analytics' && (
                <DemoAnalytics links={demoData.links} />
              )}
            </div>

            {/* Upgrade Prompt */}
            <Card className="mt-8 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-purple-200 dark:border-purple-800">
              <CardContent className="pt-6">
                <div className="text-center">
                  <Crown className="h-12 w-12 text-purple-600 dark:text-purple-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-purple-900 dark:text-purple-100 mb-2">
                    Ready for the Full Experience?
                  </h3>
                  <p className="text-purple-700 dark:text-purple-300 mb-4">
                    Unlock unlimited links, real analytics, custom domains, and much more!
                  </p>
                  <Link href="/register">
                    <Button className="bg-purple-600 hover:bg-purple-700">
                      Create Free Account
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Side - Live Preview */}
          <div className="lg:sticky lg:top-8">
            <DemoPreview
              profile={demoData.profile}
              links={demoData.links}
              theme={demoData.theme}
              customColors={demoData.customColors}
            />
          </div>
        </div>
      </main>
    </div>
  )
}