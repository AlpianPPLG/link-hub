import { type NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/lib/auth"
import { executeQuery } from "@/lib/database"
import { writeFile, mkdir } from "fs/promises"
import { join } from "path"
import { randomUUID } from "crypto"
import sharp from "sharp"

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"]

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get("auth-token")?.value
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = verifyToken(token)
    if (!user) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get("avatar") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Only JPEG, PNG, and WebP are allowed." },
        { status: 400 }
      )
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "File too large. Maximum size is 5MB." },
        { status: 400 }
      )
    }

    // Generate unique filename
    const filename = `${randomUUID()}.webp` // Convert all avatars to WebP for optimization
    
    // Create uploads directory if it doesn't exist
    const uploadsDir = join(process.cwd(), "public", "uploads", "avatars")
    try {
      await mkdir(uploadsDir, { recursive: true })
    } catch (error) {
      // Directory might already exist, that's fine
    }

    // Process and save file with Sharp
    const filepath = join(uploadsDir, filename)
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    
    try {
      // Process image with Sharp: resize, optimize, and convert to WebP
      await sharp(buffer)
        .resize(400, 400, {
          fit: 'cover',
          position: 'center'
        })
        .webp({ quality: 85 })
        .toFile(filepath)
    } catch (sharpError) {
      console.error("Error processing image with Sharp:", sharpError)
      // Fallback: save original file if Sharp fails
      await writeFile(filepath, buffer)
    }

    // Generate public URL
    const avatarUrl = `/uploads/avatars/${filename}`

    // Update user's avatar_url in database
    await executeQuery(
      "UPDATE users SET avatar_url = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
      [avatarUrl, user.id]
    )

    return NextResponse.json(
      { 
        message: "Avatar uploaded successfully",
        avatar_url: avatarUrl
      },
      { status: 200 }
    )
  } catch (error) {
    console.error("Error uploading avatar:", error)
    return NextResponse.json({ error: "Failed to upload avatar" }, { status: 500 })
  }
}

// DELETE - Remove avatar
export async function DELETE(request: NextRequest) {
  try {
    const token = request.cookies.get("auth-token")?.value
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = verifyToken(token)
    if (!user) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    // Remove avatar_url from database
    await executeQuery(
      "UPDATE users SET avatar_url = NULL, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
      [user.id]
    )

    return NextResponse.json(
      { message: "Avatar removed successfully" },
      { status: 200 }
    )
  } catch (error) {
    console.error("Error removing avatar:", error)
    return NextResponse.json({ error: "Failed to remove avatar" }, { status: 500 })
  }
}