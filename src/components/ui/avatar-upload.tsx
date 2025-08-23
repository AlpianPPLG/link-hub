"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Camera, Upload, X, Loader2 } from "lucide-react"
import { toast } from "sonner"

interface AvatarUploadProps {
  currentAvatar?: string | null
  userName?: string
  onAvatarUpdate: (avatarUrl: string | null) => void
  className?: string
}

export function AvatarUpload({ 
  currentAvatar, 
  userName, 
  onAvatarUpdate, 
  className = "" 
}: AvatarUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [error, setError] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setError("")

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"]
    if (!allowedTypes.includes(file.type)) {
      setError("Invalid file type. Only JPEG, PNG, and WebP are allowed.")
      return
    }

    // Validate file size (5MB)
    const maxSize = 5 * 1024 * 1024
    if (file.size > maxSize) {
      setError("File too large. Maximum size is 5MB.")
      return
    }

    // Create preview
    const reader = new FileReader()
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string)
    }
    reader.readAsDataURL(file)

    // Upload file
    uploadAvatar(file)
  }

  const uploadAvatar = async (file: File) => {
    setIsUploading(true)
    
    try {
      const formData = new FormData()
      formData.append("avatar", file)

      const response = await fetch("/api/avatar", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const result = await response.json()
        throw new Error(result.error || "Failed to upload avatar")
      }

      const result = await response.json()
      onAvatarUpdate(result.avatar_url)
      setPreviewUrl(null)
      toast.success("Avatar updated successfully!")
      
    } catch (error) {
      console.error("Error uploading avatar:", error)
      setError(error instanceof Error ? error.message : "Failed to upload avatar")
      setPreviewUrl(null)
    } finally {
      setIsUploading(false)
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  const removeAvatar = async () => {
    setIsUploading(true)
    
    try {
      const response = await fetch("/api/avatar", {
        method: "DELETE",
      })

      if (!response.ok) {
        const result = await response.json()
        throw new Error(result.error || "Failed to remove avatar")
      }

      onAvatarUpdate(null)
      setPreviewUrl(null)
      toast.success("Avatar removed successfully!")
      
    } catch (error) {
      console.error("Error removing avatar:", error)
      setError(error instanceof Error ? error.message : "Failed to remove avatar")
    } finally {
      setIsUploading(false)
    }
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  const displayAvatar = previewUrl || currentAvatar

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Avatar Display */}
      <div className="flex items-center space-x-6">
        <div className="relative">
          <Avatar className="h-20 w-20">
            <AvatarImage src={displayAvatar || "/placeholder.svg"} alt={userName} />
            <AvatarFallback className="text-lg">
              {userName
                ?.split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
          
          {/* Loading overlay */}
          {isUploading && (
            <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
              <Loader2 className="h-6 w-6 text-white animate-spin" />
            </div>
          )}
        </div>

        {/* Upload Controls */}
        <div className="space-y-2">
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={triggerFileInput}
              disabled={isUploading}
            >
              <Camera className="h-4 w-4 mr-2" />
              {currentAvatar ? "Change Avatar" : "Upload Avatar"}
            </Button>

            {currentAvatar && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={removeAvatar}
                disabled={isUploading}
              >
                <X className="h-4 w-4 mr-2" />
                Remove
              </Button>
            )}
          </div>
          
          <p className="text-xs text-gray-600 dark:text-gray-400">
            JPEG, PNG, or WebP. Max 5MB.
          </p>
        </div>
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Error Display */}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Preview Notice */}
      {previewUrl && (
        <Alert>
          <Upload className="h-4 w-4" />
          <AlertDescription>
            Uploading your new avatar...
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}