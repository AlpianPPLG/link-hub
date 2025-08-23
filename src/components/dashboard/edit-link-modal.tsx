"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Pencil, Loader2 } from "lucide-react"
import { toast } from "sonner"

interface Link {
  id: string
  title: string
  url: string
  description?: string
  is_active: boolean
}

interface EditLinkModalProps {
  link: Link
  onLinkUpdated: (updatedLink: Link) => void
}

export function EditLinkModal({ link, onLinkUpdated }: EditLinkModalProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    url: "",
    description: ""
  })

  useEffect(() => {
    if (link) {
      setFormData({
        title: link.title,
        url: link.url,
        description: link.description || ""
      })
    }
  }, [link])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.title.trim() || !formData.url.trim()) {
      toast.error("Title and URL are required")
      return
    }

    // Basic URL validation
    try {
      new URL(formData.url)
    } catch {
      toast.error("Please enter a valid URL")
      return
    }

    setLoading(true)
    
    try {
      const response = await fetch(`/api/links/${link.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: formData.title.trim(),
          url: formData.url.trim(),
          description: formData.description.trim(),
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to update link")
      }

      // Create updated link object
      const updatedLink = {
        ...link,
        title: formData.title.trim(),
        url: formData.url.trim(),
        description: formData.description.trim(),
      }

      toast.success("Link updated successfully!")
      setOpen(false)
      onLinkUpdated(updatedLink)
    } catch (error) {
      console.error("Error updating link:", error)
      toast.error("Failed to update link. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Link</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              placeholder="Enter link title"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="url">URL *</Label>
            <Input
              id="url"
              type="url"
              placeholder="https://example.com"
              value={formData.url}
              onChange={(e) => handleInputChange("url", e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              placeholder="Brief description of this link"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              rows={3}
            />
          </div>
          
          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Link"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
