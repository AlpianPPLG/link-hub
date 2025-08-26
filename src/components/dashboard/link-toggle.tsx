"use client"

import { useState } from "react"
import { Switch } from "@/components/ui/switch"
import { toast } from "sonner"

interface LinkToggleProps {
  linkId: string
  isActive: boolean
  onToggleChanged: () => void
}

export function LinkToggle({ linkId, isActive, onToggleChanged }: LinkToggleProps) {
  const [loading, setLoading] = useState(false)
  const [checked, setChecked] = useState(isActive)

  const handleToggle = async (newValue: boolean) => {
    setLoading(true)
    setChecked(newValue)
    
    try {
      const response = await fetch(`/api/links/${linkId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          is_active: newValue
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        const errorMessage = errorData.error || `HTTP ${response.status}: ${response.statusText}`
        throw new Error(errorMessage)
      }

      toast.success(newValue ? "Link enabled" : "Link disabled")
      onToggleChanged()
    } catch (error) {
      console.error("Error updating link status:", error)
      const errorMessage = error instanceof Error ? error.message : "Failed to update link status. Please try again."
      toast.error(errorMessage)
      // Revert the toggle if the API call failed
      setChecked(!newValue)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Switch
      checked={checked}
      onCheckedChange={handleToggle}
      disabled={loading}
      className="data-[state=checked]:bg-gray-900 dark:data-[state=checked]:bg-white"
    />
  )
}
