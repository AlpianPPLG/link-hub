import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
import { executeQuery } from "./database"

const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret-key"

export interface User {
  password: string
  id: string
  name: string
  username: string
  email: string
  avatar_url?: string
  bio?: string
  created_at: Date
  updated_at: Date
}

export interface AuthUser {
  id: string
  name: string
  username: string
  email: string
}

// Hash password
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

// Verify password
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

// Generate JWT token
export function generateToken(user: AuthUser): string {
  return jwt.sign(
    {
      id: user.id,
      username: user.username,
      email: user.email,
      name: user.name,
    },
    JWT_SECRET,
    { expiresIn: "7d" },
  )
}

// Verify JWT token
export function verifyToken(token: string): AuthUser | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AuthUser
    return decoded
  } catch (error) {
    return null
  }
}

// Get user by email
export async function getUserByEmail(email: string): Promise<User | null> {
  try {
    const results = (await executeQuery("SELECT * FROM users WHERE email = ?", [email])) as User[]

    return results.length > 0 ? results[0] : null
  } catch (error) {
    console.error("Error getting user by email:", error)
    return null
  }
}

// Get user by username
export async function getUserByUsername(username: string): Promise<User | null> {
  try {
    const results = (await executeQuery("SELECT * FROM users WHERE username = ?", [username])) as User[]

    return results.length > 0 ? results[0] : null
  } catch (error) {
    console.error("Error getting user by username:", error)
    return null
  }
}

// Create new user
export async function createUser(userData: {
  name: string
  username: string
  email: string
  password: string
}): Promise<User | null> {
  try {
    const hashedPassword = await hashPassword(userData.password)
    const userId = crypto.randomUUID()

    await executeQuery("INSERT INTO users (id, name, username, email, password) VALUES (?, ?, ?, ?, ?)", [
      userId,
      userData.name,
      userData.username,
      userData.email,
      hashedPassword,
    ])

    // Create default appearance settings
    await executeQuery("INSERT INTO appearances (user_id, theme) VALUES (?, ?)", [userId, "light"])

    const user = await getUserByEmail(userData.email)
    return user
  } catch (error) {
    console.error("Error creating user:", error)
    return null
  }
}
