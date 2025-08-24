-- Migration script to add footer field to users table
-- This allows users to add a custom footer message to their profile

-- Add footer field to users table
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS footer_message TEXT;