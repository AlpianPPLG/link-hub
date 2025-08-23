"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { Camera, Palette, Eye } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import React from "react"

interface ProfileSettingsProps {
  user: { id: string; name: string; username: string; email: string; avatar_url?: string; bio?: string } | null
  onUserUpdate: () => void
}

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  bio: z.string().max(160, "Bio must be less than 160 characters").optional(),
})

const appearanceSchema = z.object({
  theme: z.enum(["light", "dark", "forest", "ocean"]),
  custom_background_color: z.string().optional(),
  custom_button_color: z.string().optional(),
  custom_text_color: z.string().optional(),
})

type ProfileFormData = z.infer<typeof profileSchema>
type AppearanceFormData = z.infer<typeof appearanceSchema>

export function ProfileSettings({ user, onUserUpdate }: ProfileSettingsProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isAppearanceLoading, setIsAppearanceLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [appearance, setAppearance] = useState<AppearanceFormData>({
    theme: "light",
    custom_background_color: "",
    custom_button_color: "",
    custom_text_color: "",
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || "",
      bio: user?.bio || "",
    },
  })

  const {
    register: registerAppearance,
    handleSubmit: handleAppearanceSubmit,
    formState: { errors: appearanceErrors },
    setValue: setAppearanceValue,
    watch: watchAppearance,
  } = useForm<AppearanceFormData>({
    resolver: zodResolver(appearanceSchema),
    defaultValues: appearance,
  })

  const selectedTheme = watchAppearance("theme")

  const fetchAppearance = async () => {
    try {
      const response = await fetch("/api/appearance")
      if (response.ok) {
        const data = await response.json()
        const appearanceData = {
          theme: data.appearance?.theme || "light",
          custom_background_color: data.appearance?.custom_background_color || "",
          custom_button_color: data.appearance?.custom_button_color || "",
          custom_text_color: data.appearance?.custom_text_color || "",
        }
        setAppearance(appearanceData)
        Object.entries(appearanceData).forEach(([key, value]) => {
          setAppearanceValue(key as keyof AppearanceFormData, value)
        })
      }
    } catch (error) {
      console.error("Error fetching appearance:", error)
    }
  }

  React.useEffect(() => {
    fetchAppearance()
  }, [])

  const onSubmit = async (data: ProfileFormData) => {
    setIsLoading(true)
    setError("")
    setSuccess("")

    try {
      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const result = await response.json()
        setError(result.error || "Failed to update profile")
        return
      }

      setSuccess("Profile updated successfully!")
      onUserUpdate()
    } catch (error) {
      setError("An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const onAppearanceSubmit = async (data: AppearanceFormData) => {
    setIsAppearanceLoading(true)
    setError("")
    setSuccess("")

    try {
      const response = await fetch("/api/appearance", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const result = await response.json()
        setError(result.error || "Failed to update appearance")
        return
      }

      setSuccess("Appearance updated successfully!")
      setAppearance(data)
    } catch (error) {
      setError("An unexpected error occurred")
    } finally {
      setIsAppearanceLoading(false)
    }
  }

  const getThemePreview = (theme: string) => {
    switch (theme) {
      case "dark":
        return { bg: "bg-gray-900", text: "text-white", button: "bg-white text-gray-900" }
      case "forest":
        return { bg: "bg-green-900", text: "text-white", button: "bg-green-600 text-white" }
      case "ocean":
        return { bg: "bg-blue-900", text: "text-white", button: "bg-blue-600 text-white" }
      default:
        return { bg: "bg-gray-50", text: "text-gray-900", button: "bg-gray-900 text-white" }
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Profile Settings</h2>
        <p className="text-gray-600 dark:text-gray-400">Manage your profile information and appearance</p>
      </div>

      {/* Profile Form */}
      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>Update your profile details and bio</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            {success && (
              <Alert>
                <AlertDescription>{success}</AlertDescription>
              </Alert>
            )}

            {/* Avatar Section */}
            <div className="flex items-center space-x-6">
              <Avatar className="h-20 w-20">
                <AvatarImage src={user?.avatar_url || "/placeholder.svg"} alt={user?.name} />
                <AvatarFallback className="text-lg">
                  {user?.name
                    ?.split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <Button variant="outline" size="sm" disabled>
                  <Camera className="h-4 w-4 mr-2" />
                  Change Avatar
                </Button>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Avatar upload coming soon</p>
              </div>
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  {...register("name")}
                  className={errors.name ? "border-red-500" : ""}
                  placeholder="Enter your full name"
                />
                {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input id="username" value={user?.username} disabled className="bg-gray-50 dark:bg-gray-800" />
                <p className="text-xs text-gray-600 dark:text-gray-400">Username cannot be changed</p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" value={user?.email} disabled className="bg-gray-50 dark:bg-gray-800" />
              <p className="text-xs text-gray-600 dark:text-gray-400">Email cannot be changed</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                {...register("bio")}
                className={errors.bio ? "border-red-500" : ""}
                placeholder="Tell people about yourself..."
                rows={3}
              />
              {errors.bio && <p className="text-sm text-red-500">{errors.bio.message}</p>}
              <p className="text-xs text-gray-600 dark:text-gray-400">{user?.bio?.length || 0}/160 characters</p>
            </div>

            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Updating..." : "Update Profile"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Appearance Customization Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Appearance & Themes
          </CardTitle>
          <CardDescription>Customize how your profile looks to visitors</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAppearanceSubmit(onAppearanceSubmit)} className="space-y-6">
            {/* Theme Selection */}
            <div className="space-y-4">
              <Label>Choose Theme</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { value: "light", name: "Light", desc: "Clean & bright" },
                  { value: "dark", name: "Dark", desc: "Sleek & modern" },
                  { value: "forest", name: "Forest", desc: "Natural & calm" },
                  { value: "ocean", name: "Ocean", desc: "Cool & refreshing" },
                ].map((theme) => {
                  const preview = getThemePreview(theme.value)
                  return (
                    <div
                      key={theme.value}
                      className={`relative cursor-pointer rounded-lg border-2 p-4 transition-all ${
                        selectedTheme === theme.value
                          ? "border-blue-500 ring-2 ring-blue-200"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      onClick={() => setAppearanceValue("theme", theme.value as any)}
                    >
                      <div className={`${preview.bg} rounded-md p-3 mb-2`}>
                        <div className={`${preview.text} text-xs font-medium mb-1`}>{user?.name}</div>
                        <div className={`${preview.button} rounded px-2 py-1 text-xs`}>Link</div>
                      </div>
                      <div className="text-sm font-medium">{theme.name}</div>
                      <div className="text-xs text-gray-500">{theme.desc}</div>
                    </div>
                  )
                })}
              </div>
              <input type="hidden" {...registerAppearance("theme")} />
            </div>

            <Separator />

            {/* Custom Colors */}
            <div className="space-y-4">
              <div>
                <Label className="text-base font-medium">Custom Colors</Label>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Override theme colors with your own (optional)
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="custom_background_color">Background Color</Label>
                  <div className="flex gap-2">
                    <Input
                      id="custom_background_color"
                      type="color"
                      {...registerAppearance("custom_background_color")}
                      className="w-16 h-10 p-1 border rounded"
                    />
                    <Input
                      placeholder="#ffffff"
                      {...registerAppearance("custom_background_color")}
                      className="flex-1"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="custom_button_color">Button Color</Label>
                  <div className="flex gap-2">
                    <Input
                      id="custom_button_color"
                      type="color"
                      {...registerAppearance("custom_button_color")}
                      className="w-16 h-10 p-1 border rounded"
                    />
                    <Input placeholder="#000000" {...registerAppearance("custom_button_color")} className="flex-1" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="custom_text_color">Text Color</Label>
                  <div className="flex gap-2">
                    <Input
                      id="custom_text_color"
                      type="color"
                      {...registerAppearance("custom_text_color")}
                      className="w-16 h-10 p-1 border rounded"
                    />
                    <Input placeholder="#000000" {...registerAppearance("custom_text_color")} className="flex-1" />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button type="submit" disabled={isAppearanceLoading}>
                {isAppearanceLoading ? "Updating..." : "Update Appearance"}
              </Button>
              <Button type="button" variant="outline" onClick={() => window.open(`/${user?.username}`, "_blank")}>
                <Eye className="h-4 w-4 mr-2" />
                Preview Profile
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Account Information */}
      <Card>
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
          <CardDescription>Your account details and public URL</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">Public URL</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Your LinkHub profile URL</p>
              </div>
              <div className="text-right">
                <p className="font-mono text-sm text-blue-600">linkhub.com/{user?.username}</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(`/${user?.username}`, "_blank")}
                  className="mt-2"
                >
                  View Profile
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
