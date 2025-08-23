-- Migration script to update appearances table schema
-- This script renames the 'theme' column to 'profile_theme' to separate application theme from profile theme

-- Check if the old column exists and the new column doesn't exist
-- MySQL syntax for renaming column
ALTER TABLE appearances 
CHANGE COLUMN theme profile_theme ENUM('light', 'dark', 'forest', 'ocean') DEFAULT 'light';

-- Add created_at and updated_at columns if they don't exist
ALTER TABLE appearances 
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;

-- Update any existing records with null values
UPDATE appearances SET profile_theme = 'light' WHERE profile_theme IS NULL;