"use client"

import { useState, useEffect } from "react"
import { DndContext, DragEndEvent, closestCenter, DragStartEvent } from "@dnd-kit/core"
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { SortableLinks } from "./sortable-links"
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

interface DndContextWrapperProps {
  links: Link[]
  onLinksReordered: (newOrder: string[]) => void
}

export function DndContextWrapper({ links, onLinksReordered }: DndContextWrapperProps) {
  const [items, setItems] = useState<string[]>([])
  const [isDragging, setIsDragging] = useState(false)

  // Update items when links change - sort by order
  useEffect(() => {
    const sortedLinks = [...links].sort((a, b) => a.order - b.order)
    setItems(sortedLinks.map(link => link.id))
    console.log("🔄 Items updated:", sortedLinks.map(l => ({ id: l.id, title: l.title, order: l.order })))
  }, [links])

  const handleDragStart = (event: DragStartEvent) => {
    setIsDragging(true)
    const link = links.find(l => l.id === event.active.id)
    console.log("🚀 Drag started for link:", link?.title || event.active.id)
  }

  const handleDragEnd = async (event: DragEndEvent) => {
    setIsDragging(false)
    const { active, over } = event

    console.log("🏁 Drag ended:", { 
      active: active.id, 
      over: over?.id,
      currentItems: items 
    })

    if (active.id !== over?.id && over) {
      const oldIndex = items.indexOf(active.id as string)
      const newIndex = items.indexOf(over.id as string)

      console.log("🔄 Reordering:", { 
        oldIndex, 
        newIndex, 
        oldId: active.id, 
        newId: over.id 
      })

      if (oldIndex !== -1 && newIndex !== -1) {
        // Create new order array
        const newOrder = [...items]
        newOrder.splice(oldIndex, 1)
        newOrder.splice(newIndex, 0, active.id as string)

        console.log("✅ New order:", newOrder)

        // Update local state immediately for visual feedback
        setItems(newOrder)

        // Make API call to persist changes
        try {
          console.log("📤 Sending reorder request:", newOrder)
          
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

          console.log("✅ Reorder API response:", await response.json())
          toast.success("Links reordered successfully!")
          
          // Only call parent callback after successful API call
          onLinksReordered(newOrder)
        } catch (error) {
          console.error("❌ Error reordering links:", error)
          toast.error("Failed to reorder links. Please try again.")
          // Revert local state on error
          setItems(items)
          // Still call parent to refresh from server
          onLinksReordered([])
        }
      }
    }
  }

  return (
    <DndContext
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={items} strategy={verticalListSortingStrategy}>
        <SortableLinks 
          links={links} 
          onLinksReordered={onLinksReordered}
          isDragging={isDragging}
        />
      </SortableContext>
    </DndContext>
  )
}
