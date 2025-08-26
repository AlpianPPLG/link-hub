-- Clean up problematic custom color values that conflict with theme preferences
-- This script removes default colors (#000000, #ffffff, empty strings) that override theme styling

-- Remove black and white custom colors that interfere with theme styling
UPDATE appearances 
SET 
  custom_background_color = NULL 
WHERE 
  custom_background_color IN ('#000000', '#ffffff', '', '000000', 'ffffff');

UPDATE appearances 
SET 
  custom_button_color = NULL 
WHERE 
  custom_button_color IN ('#000000', '#ffffff', '', '000000', 'ffffff');

UPDATE appearances 
SET 
  custom_text_color = NULL 
WHERE 
  custom_text_color IN ('#000000', '#ffffff', '', '000000', 'ffffff');

-- Update timestamp
UPDATE appearances 
SET updated_at = CURRENT_TIMESTAMP 
WHERE 
  custom_background_color IS NULL 
  OR custom_button_color IS NULL 
  OR custom_text_color IS NULL;