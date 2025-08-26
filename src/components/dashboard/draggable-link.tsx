/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState } from "react"
import { GripVertical, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { EditLinkModal } from "./edit-link-modal"
import { DeleteLinkDialog } from "./delete-link-dialog"
import { LinkToggle } from "./link-toggle"

interface Link {
  id: string
  title: string
  url: string
  description?: string
  order: number
  clicks: number
  is_active: boolean
}

interface DraggableLinkProps {
  link: Link
  onLinkUpdated: () => void
  onLinkDeleted: () => void
  onToggleChanged: () => void
  dragHandleProps?: any
  isDragging?: boolean
}

export function DraggableLink({ 
  link, 
  onLinkUpdated, 
  onLinkDeleted, 
  onToggleChanged,
  dragHandleProps,
  isDragging = false
}: DraggableLinkProps) {
  const [isHovered, setIsHovered] = useState(false)

  const handleExternalClick = () => {
    window.open(link.url, '_blank', 'noopener,noreferrer')
  }

  return (
    <Card 
      className={`p-4 transition-all duration-200 ${
        isDragging ? 'opacity-50 shadow-lg' : ''
      } ${isHovered ? 'shadow-md' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center gap-3">
        {/* Drag Handle */}
        <div
          {...dragHandleProps}
          className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors"
        >
          <GripVertical className="h-5 w-5" />
        </div>

        {/* Link Content */}
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-gray-900 dark:text-white truncate">{link.title}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{link.url}</p>
          {link.description && (
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 truncate">{link.description}</p>
          )}
        </div>

        {/* Link Stats */}
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <span>{link.clicks} clicks</span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <LinkToggle
            linkId={link.id}
            isActive={link.is_active}
            onToggleChanged={onToggleChanged}
          />
          
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
            onClick={handleExternalClick}
            title="Open link"
          >
            <ExternalLink className="h-4 w-4" />
          </Button>
          
          <EditLinkModal
            link={link}
            onLinkUpdated={onLinkUpdated}
          />
          
          <DeleteLinkDialog
            linkId={link.id}
            linkTitle={link.title}
            onLinkDeleted={onLinkDeleted}
          />
        </div>
      </div>
    </Card>
  )
}
