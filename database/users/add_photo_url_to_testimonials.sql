-- Add photo_url column to testimonials table
-- This script adds an optional photo_url field to store client photos

-- Add the photo_url column
ALTER TABLE public.testimonials 
ADD COLUMN IF NOT EXISTS photo_url TEXT;

-- Add a comment to document the column
COMMENT ON COLUMN public.testimonials.photo_url IS 'Optional URL to client photo. If not provided, initials avatar will be shown.';

-- Update existing testimonials to have empty photo_url (optional)
-- UPDATE public.testimonials SET photo_url = NULL WHERE photo_url IS NULL;

-- Verify the column was added
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'testimonials' 
AND table_schema = 'public'
ORDER BY ordinal_position;
