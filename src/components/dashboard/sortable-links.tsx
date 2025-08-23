"use client"

import { useState, useEffect } from "react"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { DraggableLink } from "./draggable-link"
import { toast } from "sonner"

interface Link {
  id: string
  title: string
  url: string
  description?: string
  order: number
  clicks: number
  is_active: boolean
}

interface SortableLinksProps {
  links: Link[]
  onLinksReordered: (newOrder: string[]) => void
}

export function SortableLinks({ links, onLinksReordered }: SortableLinksProps) {
  const [sortedLinks, setSortedLinks] = useState<Link[]>(links)

  useEffect(() => {
    setSortedLinks(links)
  }, [links])

  const handleReorder = async (newOrder: string[]) => {
    try {
      const response = await fetch("/api/links/reorder", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ linkIds: newOrder }),
      })

      if (!response.ok) {
        throw new Error("Failed to reorder links")
      }

      toast.success("Links reordered successfully!")
      onLinksReordered(newOrder)
    } catch (error) {
      console.error("Error reordering links:", error)
      toast.error("Failed to reorder links. Please try again.")
    }
  }

  if (sortedLinks.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p>No links yet. Add your first link to get started!</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {sortedLinks.map((link) => (
        <SortableLink
          key={link.id}
          link={link}
          onLinkUpdated={() => onLinksReordered(sortedLinks.map(l => l.id))}
          onLinkDeleted={() => onLinksReordered(sortedLinks.filter(l => l.id !== link.id).map(l => l.id))}
          onToggleChanged={() => onLinksReordered(sortedLinks.map(l => l.id))}
        />
      ))}
    </div>
  )
}

interface SortableLinkProps {
  link: Link
  onLinkUpdated: () => void
  onLinkDeleted: () => void
  onToggleChanged: () => void
}

function SortableLink({ link, onLinkUpdated, onLinkDeleted, onToggleChanged }: SortableLinkProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: link.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div ref={setNodeRef} style={style}>
      <DraggableLink
        link={link}
        onLinkUpdated={onLinkUpdated}
        onLinkDeleted={onLinkDeleted}
        onToggleChanged={onToggleChanged}
        dragHandleProps={{ ...attributes, ...listeners }}
        isDragging={isDragging}
      />
    </div>
  )
}
