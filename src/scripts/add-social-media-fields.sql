-- Migration script to add social media links and profile sections
-- This script creates social_links table and adds about_me, hobby fields to users table

-- Create social_links table
CREATE TABLE IF NOT EXISTS social_links (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id VARCHAR(36) NOT NULL,
    platform ENUM('instagram', 'facebook', 'twitter', 'linkedin', 'github', 'youtube', 'tiktok', 'discord', 'twitch', 'website') NOT NULL,
    url VARCHAR(500) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    display_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_social_links_user_id (user_id),
    INDEX idx_social_links_active (is_active),
    UNIQUE KEY unique_user_platform (user_id, platform)
);

-- Add about_me and hobby fields to users table
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS about_me TEXT,
ADD COLUMN IF NOT EXISTS hobby TEXT;

-- Add tech_stack field for developer profiles (optional)
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS tech_stack TEXT;