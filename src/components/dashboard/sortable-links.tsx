"use client"

import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { DraggableLink } from "./draggable-link"

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
  isDragging?: boolean
}

export function SortableLinks({ links, onLinksReordered, isDragging = false }: SortableLinksProps) {
  // Sort links by order to ensure proper display
  const sortedLinks = [...links].sort((a, b) => a.order - b.order)

  const handleLinkUpdated = (updatedLink: Link) => {
    console.log("🔗 Link updated:", updatedLink.title)
    // Just notify parent about the update
    onLinksReordered(links.map(l => l.id))
  }

  const handleLinkDeleted = (deletedLinkId: string) => {
    console.log("🗑️ Link deleted:", deletedLinkId)
    // Just notify parent about the deletion
    onLinksReordered(links.filter(l => l.id !== deletedLinkId).map(l => l.id))
  }

  const handleToggleChanged = (linkId: string, newValue: boolean) => {
    console.log("🔄 Toggle changed:", linkId, newValue)
    // Just notify parent about the toggle change
    onLinksReordered(links.map(l => l.id))
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
          onLinkUpdated={handleLinkUpdated}
          onLinkDeleted={handleLinkDeleted}
          onToggleChanged={handleToggleChanged}
          isDragging={isDragging}
        />
      ))}
    </div>
  )
}

interface SortableLinkProps {
  link: Link
  onLinkUpdated: (link: Link) => void
  onLinkDeleted: (linkId: string) => void
  onToggleChanged: (linkId: string, newValue: boolean) => void
  isDragging?: boolean
}

function SortableLink({ link, onLinkUpdated, onLinkDeleted, onToggleChanged, isDragging = false }: SortableLinkProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isLinkDragging,
  } = useSortable({ id: link.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div ref={setNodeRef} style={style}>
      <DraggableLink
        link={link}
        onLinkUpdated={() => onLinkUpdated(link)}
        onLinkDeleted={() => onLinkDeleted(link.id)}
        onToggleChanged={() => onToggleChanged(link.id, link.is_active)}
        dragHandleProps={{ ...attributes, ...listeners }}
        isDragging={isLinkDragging || isDragging}
      />
    </div>
  )
}
