import { notFound } from "next/navigation"
import { PublicProfile } from "@/components/public-profile"
import { executeQuery } from "@/lib/database"

interface User {
  id: string
  name: string
  username: string
  avatar_url?: string
  bio?: string
}

interface Link {
  id: string
  title: string
  url: string
  order: number
  clicks: number
}

interface Appearance {
  theme: string
  background_image_url?: string
  custom_background_color?: string
  custom_button_color?: string
  custom_text_color?: string
}

async function getUserProfile(username: string): Promise<{
  user: User
  links: Link[]
  appearance: Appearance
} | null> {
  try {
    // Get user data
    const userResults = (await executeQuery(
      "SELECT id, name, username, avatar_url, bio FROM users WHERE username = ?",
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

    // Get appearance settings
    const appearanceResults = (await executeQuery("SELECT * FROM appearances WHERE user_id = ?", [
      user.id,
    ])) as Appearance[]
    const appearance = appearanceResults[0] || { theme: "light" }

    return { user, links, appearance }
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

  return <PublicProfile user={profile.user} links={profile.links} appearance={profile.appearance} />
}
