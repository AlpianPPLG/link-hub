"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Trash2, Plus, Link as LinkIcon } from "lucide-react"
import { toast } from "sonner"

interface SocialLink {
  platform: string
  url: string
  is_active: boolean
  display_order: number
}

interface SocialMediaManagerProps {
  onLinksUpdate?: () => void
}

const SOCIAL_PLATFORMS = [
  { value: "instagram", label: "Instagram", placeholder: "https://instagram.com/username" },
  { value: "facebook", label: "Facebook", placeholder: "https://facebook.com/username" },
  { value: "twitter", label: "Twitter/X", placeholder: "https://twitter.com/username" },
  { value: "linkedin", label: "LinkedIn", placeholder: "https://linkedin.com/in/username" },
  { value: "github", label: "GitHub", placeholder: "https://github.com/username" },
  { value: "youtube", label: "YouTube", placeholder: "https://youtube.com/@username" },
  { value: "tiktok", label: "TikTok", placeholder: "https://tiktok.com/@username" },
  { value: "discord", label: "Discord", placeholder: "https://discord.gg/username" },
  { value: "twitch", label: "Twitch", placeholder: "https://twitch.tv/username" },
  { value: "website", label: "Website", placeholder: "https://yourwebsite.com" },
]

export function SocialMediaManager({ onLinksUpdate }: SocialMediaManagerProps) {
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [newPlatform, setNewPlatform] = useState("")
  const [newUrl, setNewUrl] = useState("")

  // Fetch existing social links
  const fetchSocialLinks = async () => {
    try {
      const response = await fetch("/api/social-links")
      if (response.ok) {
        const data = await response.json()
        setSocialLinks(data.social_links || [])
      }
    } catch (error) {
      console.error("Error fetching social links:", error)
    }
  }

  useEffect(() => {
    fetchSocialLinks()
  }, [])

  const handleAddLink = async () => {
    if (!newPlatform || !newUrl) {
      setError("Please select a platform and enter a URL")
      return
    }

    // Basic URL validation
    try {
      new URL(newUrl)
    } catch {
      setError("Please enter a valid URL")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      const response = await fetch("/api/social-links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          platform: newPlatform,
          url: newUrl,
          is_active: true,
        }),
      })

      if (!response.ok) {
        const result = await response.json()
        throw new Error(result.error || "Failed to add social link")
      }

      await fetchSocialLinks()
      setNewPlatform("")
      setNewUrl("")
      toast.success("Social link added successfully!")
      onLinksUpdate?.()
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to add social link")
    } finally {
      setIsLoading(false)
    }
  }

  const handleRemoveLink = async (platform: string) => {
    setIsLoading(true)
    setError("")

    try {
      const response = await fetch(`/api/social-links?platform=${platform}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const result = await response.json()
        throw new Error(result.error || "Failed to remove social link")
      }

      await fetchSocialLinks()
      toast.success("Social link removed successfully!")
      onLinksUpdate?.()
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to remove social link")
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdateUrl = async (platform: string, newUrl: string) => {
    if (!newUrl) return

    // Basic URL validation
    try {
      new URL(newUrl)
    } catch {
      setError("Please enter a valid URL")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      // Remove old link and add new one
      await fetch(`/api/social-links?platform=${platform}`, { method: "DELETE" })
      
      const response = await fetch("/api/social-links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          platform,
          url: newUrl,
          is_active: true,
        }),
      })

      if (!response.ok) {
        const result = await response.json()
        throw new Error(result.error || "Failed to update social link")
      }

      await fetchSocialLinks()
      toast.success("Social link updated successfully!")
      onLinksUpdate?.()
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to update social link")
    } finally {
      setIsLoading(false)
    }
  }

  const availablePlatforms = SOCIAL_PLATFORMS.filter(
    platform => !socialLinks.some(link => link.platform === platform.value)
  )

  const selectedPlatform = SOCIAL_PLATFORMS.find(p => p.value === newPlatform)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <LinkIcon className="h-5 w-5" />
          Social Media Links
        </CardTitle>
        <CardDescription>
          Add your social media profiles to display on your public profile
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Existing Social Links */}
        {socialLinks.length > 0 && (
          <div className="space-y-3">
            <Label className="text-base font-medium">Current Social Links</Label>
            {socialLinks.map((link) => {
              const platform = SOCIAL_PLATFORMS.find(p => p.value === link.platform)
              return (
                <div key={link.platform} className="flex items-center gap-3 p-3 border rounded-lg">
                  <Badge variant="secondary" className="capitalize">
                    {platform?.label || link.platform}
                  </Badge>
                  <Input
                    value={link.url}
                    onChange={(e) => {
                      const updatedLinks = socialLinks.map(l => 
                        l.platform === link.platform 
                          ? { ...l, url: e.target.value }
                          : l
                      )
                      setSocialLinks(updatedLinks)
                    }}
                    onBlur={(e) => handleUpdateUrl(link.platform, e.target.value)}
                    className="flex-1"
                    placeholder={platform?.placeholder}
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleRemoveLink(link.platform)}
                    disabled={isLoading}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              )
            })}
          </div>
        )}

        {/* Add New Social Link */}
        {availablePlatforms.length > 0 && (
          <div className="space-y-4">
            <Label className="text-base font-medium">Add New Social Link</Label>
            <div className="flex gap-3">
              <Select value={newPlatform} onValueChange={setNewPlatform}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Platform" />
                </SelectTrigger>
                <SelectContent>
                  {availablePlatforms.map((platform) => (
                    <SelectItem key={platform.value} value={platform.value}>
                      {platform.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
                placeholder={selectedPlatform?.placeholder || "https://"}
                className="flex-1"
              />
              <Button onClick={handleAddLink} disabled={isLoading || !newPlatform || !newUrl}>
                <Plus className="h-4 w-4 mr-2" />
                Add
              </Button>
            </div>
          </div>
        )}

        {socialLinks.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <LinkIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No social media links added yet</p>
            <p className="text-sm">Add your first social link above</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}