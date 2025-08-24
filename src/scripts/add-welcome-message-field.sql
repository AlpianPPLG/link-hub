-- Migration script to add welcome_message field to users table
-- This allows users to add a custom welcome greeting message for profile visitors

-- Add welcome_message field to users table
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS welcome_message TEXT;