"use client"

import { useState, useEffect } from "react"
import { AddLinkModal } from "./add-link-modal"
import { DndContextWrapper } from "./dnd-context"
import { LinksSkeleton } from "@/components/loading-skeleton"
import { LinkIcon } from "@/components/ui/link-icon"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Plus } from "lucide-react"

interface Link {
  id: string
  title: string
  url: string
  description?: string
  order: number
  is_active: boolean
  clicks: number
}

interface LinkManagerProps {
  links: Link[]
  onLinksChange: () => void
}

export function LinkManager({ links, onLinksChange }: LinkManagerProps) {
  const [isLoading, setIsLoading] = useState(false)

  // Refresh links when component mounts or when links change
  useEffect(() => {
    // This will be called when the component mounts
  }, [])

  const handleLinkAdded = () => {
    onLinksChange()
  }

  const handleLinkUpdated = () => {
    onLinksChange()
  }

  const handleLinkDeleted = () => {
    onLinksChange()
  }

  const handleToggleChanged = () => {
    onLinksChange()
  }

  const handleLinksReordered = (newOrder: string[]) => {
    // The reordering is handled by the API, just refresh the links
    onLinksChange()
  }

  if (isLoading && links.length === 0) {
    return <LinksSkeleton />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Your Links</h2>
          <p className="text-gray-600 dark:text-gray-400">Manage and organize your links</p>
        </div>
        <AddLinkModal onLinkAdded={handleLinkAdded} />
      </div>

      {/* Links List */}
      <div className="space-y-4">
        {links.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <LinkIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No links yet</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">Get started by adding your first link</p>
              <Button onClick={() => document.querySelector('[data-add-link]')?.click()}>
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Link
              </Button>
            </CardContent>
          </Card>
        ) : (
          <DndContextWrapper
            links={links}
            onLinksReordered={handleLinksReordered}
          />
        )}
      </div>
    </div>
  )
}
