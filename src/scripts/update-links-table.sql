-- Add description field to links table if it doesn't exist
ALTER TABLE links ADD COLUMN IF NOT EXISTS description TEXT;

-- Add is_active field to links table if it doesn't exist (default to true)
ALTER TABLE links ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;

-- Update existing links to have is_active = true if the field was just added
UPDATE links SET is_active = TRUE WHERE is_active IS NULL;

-- Add index for better performance on is_active queries
CREATE INDEX IF NOT EXISTS idx_links_is_active ON links(is_active);

-- Add index for better performance on order queries
CREATE INDEX IF NOT EXISTS idx_links_order ON links(`order`);
