"use client"

import { useState } from "react"
import { DndContext, DragEndEvent, closestCenter } from "@dnd-kit/core"
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { SortableLinks } from "./sortable-links"

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
  const [items, setItems] = useState(links.map(link => link.id))

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (active.id !== over?.id) {
      setItems((items) => {
        const oldIndex = items.indexOf(active.id as string)
        const newIndex = items.indexOf(over?.id as string)

        const newItems = [...items]
        newItems.splice(oldIndex, 1)
        newItems.splice(newIndex, 0, active.id as string)

        return newItems
      })

      // Call the parent callback with new order
      const newOrder = [...items]
      const oldIndex = newOrder.indexOf(active.id as string)
      const newIndex = newOrder.indexOf(over?.id as string)
      newOrder.splice(oldIndex, 1)
      newOrder.splice(newIndex, 0, active.id as string)
      
      onLinksReordered(newOrder)
    }
  }

  return (
    <DndContext
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={items} strategy={verticalListSortingStrategy}>
        <SortableLinks 
          links={links} 
          onLinksReordered={onLinksReordered}
        />
      </SortableContext>
    </DndContext>
  )
}
