/* eslint-disable @typescript-eslint/no-explicit-any */
import { notFound } from "next/navigation"
import { PublicProfile } from "@/components/public-profile"
import { executeQuery } from "@/lib/database"

interface User {
  id: string
  name: string
  username: string
  avatar_url?: string
  bio?: string
  about_me?: string
  hobby?: string
  tech_stack?: string
  footer_message?: string
  welcome_message?: string
}

interface Link {
  id: string
  title: string
  url: string
  order: number
  clicks: number
}

interface Appearance {
  profile_theme: string
  background_image_url?: string
  custom_background_color?: string
  custom_button_color?: string
  custom_text_color?: string
}

async function getUserProfile(username: string): Promise<{
  user: User
  links: Link[]
  appearance: Appearance
  socialLinks: any[]
} | null> {
  try {
    // Get user data
    const userResults = (await executeQuery(
      "SELECT id, name, username, avatar_url, bio, about_me, hobby, tech_stack, footer_message, welcome_message FROM users WHERE username = ?",
      [username],
    )) as User[]

    if (userResults.length === 0) {
      return null
    }

    const user = userResults[0]

    // Get active links
    const links = (await executeQuery(
      "SELECT id, title, url, `order`, clicks FROM links WHERE user_id = ? AND is_active = TRUE ORDER BY `order` ASC",
      [user.id],
    )) as Link[]

    // Get social links
    const socialLinks = (await executeQuery(
      "SELECT platform, url, is_active, display_order FROM social_links WHERE user_id = ? AND is_active = TRUE ORDER BY display_order ASC, created_at ASC",
      [user.id]
    )) as any[]

    // Get appearance settings
    const appearanceResults = (await executeQuery("SELECT * FROM appearances WHERE user_id = ?", [
      user.id,
    ])) as Appearance[]
    const appearance = appearanceResults[0] || { 
      profile_theme: "light",
      custom_background_color: null,
      custom_button_color: null,
      custom_text_color: null
    }

    return { user, links, appearance, socialLinks }
  } catch (error) {
    console.error("Error fetching user profile:", error)
    return null
  }
}

export async function generateMetadata({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params
  const profile = await getUserProfile(username)

  if (!profile) {
    return {
      title: "Profile Not Found - LinkHub",
    }
  }

  return {
    title: `${profile.user.name} (@${profile.user.username}) - LinkHub`,
    description: profile.user.bio || `Check out ${profile.user.name}'s links on LinkHub`,
    openGraph: {
      title: `${profile.user.name} (@${profile.user.username})`,
      description: profile.user.bio || `Check out ${profile.user.name}'s links on LinkHub`,
      images: profile.user.avatar_url ? [profile.user.avatar_url] : [],
    },
  }
}

export async function generateStaticParams() {
  // This function tells Next.js which paths to pre-render at build time
  // Return an empty array to opt-out of static generation and use server-side rendering
  return []
}

export default async function UserProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params
  const profile = await getUserProfile(username)

  if (!profile) {
    notFound()
  }

  return <PublicProfile user={profile.user} links={profile.links} appearance={profile.appearance} socialLinks={profile.socialLinks} />
}
