"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Edit2, Trash2, Eye, EyeOff, Lock } from "lucide-react"

interface Link {
  id: string
  title: string
  url: string
  clicks: number
  isActive: boolean
}

interface DemoLinkManagerProps {
  links: Link[]
  onLinksChange: (links: Link[]) => void
}

export function DemoLinkManager({ links, onLinksChange }: DemoLinkManagerProps) {
  const [isAddingLink, setIsAddingLink] = useState(false)
  const [editingLink, setEditingLink] = useState<string | null>(null)
  const [newLink, setNewLink] = useState({ title: "", url: "" })

  const addLink = () => {
    if (links.length >= 3) {
      alert("Demo is limited to 3 links maximum. Create an account for unlimited links!")
      return
    }
    
    if (newLink.title.trim() && newLink.url.trim()) {
      const link: Link = {
        id: Date.now().toString(),
        title: newLink.title,
        url: newLink.url,
        clicks: Math.floor(Math.random() * 50), // Demo random clicks
        isActive: true
      }
      onLinksChange([...links, link])
      setNewLink({ title: "", url: "" })
      setIsAddingLink(false)
    }
  }

  const updateLink = (id: string, updates: Partial<Link>) => {
    onLinksChange(links.map(link => 
      link.id === id ? { ...link, ...updates } : link
    ))
  }

  const deleteLink = (id: string) => {
    onLinksChange(links.filter(link => link.id !== id))
  }

  const toggleLinkStatus = (id: string) => {
    updateLink(id, { isActive: !links.find(l => l.id === id)?.isActive })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Manage Links</span>
          <span className="text-sm text-gray-500 dark:text-gray-400 font-normal">
            {links.length}/3 (Demo Limit)
          </span>
        </CardTitle>
        <CardDescription>
          Add and organize your important links. In the demo, you can add up to 3 links.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Add New Link */}
        {!isAddingLink ? (
          <Button
            onClick={() => setIsAddingLink(true)}
            className="w-full"
            variant="outline"
            disabled={links.length >= 3}
          >
            <Plus className="h-4 w-4 mr-2" />
            {links.length >= 3 ? "Demo Limit Reached" : "Add New Link"}
          </Button>
        ) : (
          <div className="space-y-3 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
            <input
              type="text"
              placeholder="Link title (e.g., My Portfolio)"
              value={newLink.title}
              onChange={(e) => setNewLink({ ...newLink, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
            <input
              type="url"
              placeholder="URL (https://example.com)"
              value={newLink.url}
              onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
            <div className="flex space-x-2">
              <Button onClick={addLink} size="sm">Add Link</Button>
              <Button 
                onClick={() => setIsAddingLink(false)} 
                variant="outline" 
                size="sm"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        {/* Existing Links */}
        <div className="space-y-3">
          {links.map((link) => (
            <div
              key={link.id}
              className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
            >
              {editingLink === link.id ? (
                <div className="space-y-3">
                  <input
                    type="text"
                    value={link.title}
                    onChange={(e) => updateLink(link.id, { title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                  <input
                    type="url"
                    value={link.url}
                    onChange={(e) => updateLink(link.id, { url: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                  <div className="flex space-x-2">
                    <Button onClick={() => setEditingLink(null)} size="sm">Save</Button>
                    <Button 
                      onClick={() => setEditingLink(null)} 
                      variant="outline" 
                      size="sm"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 dark:text-white truncate">
                      {link.title}
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                      {link.url}
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                      {link.clicks} clicks (demo data)
                    </p>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    <Button
                      onClick={() => toggleLinkStatus(link.id)}
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                    >
                      {link.isActive ? (
                        <Eye className="h-4 w-4 text-green-600" />
                      ) : (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      )}
                    </Button>
                    <Button
                      onClick={() => setEditingLink(link.id)}
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      onClick={() => deleteLink(link.id)}
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {links.length === 0 && (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <p className="text-sm">No links yet</p>
            <p className="text-xs mt-1">Add your first link to get started!</p>
          </div>
        )}

        {/* Demo Limitation Notice */}
        {links.length >= 3 && (
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Lock className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-amber-800 dark:text-amber-200 text-sm">
                  Demo Limit Reached
                </h4>
                <p className="text-amber-700 dark:text-amber-300 text-xs mt-1">
                  Youve reached the 3-link limit for the demo. Create a free account for unlimited links!
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}