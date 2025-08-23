import { NextResponse } from "next/server"
import { executeQuery } from "@/lib/database"

export async function GET() {
  try {
    // Test database connection
    const result = await executeQuery("SELECT 1 as test")
    return NextResponse.json({ 
      success: true, 
      message: "Database connection successful",
      result 
    })
  } catch (error) {
    console.error("Database connection test failed:", error)
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown database error",
      details: process.env.NODE_ENV === 'development' ? error : undefined
    }, { status: 500 })
  }
}
