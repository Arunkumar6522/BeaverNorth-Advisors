-- Setup Supabase Storage for testimonials images
-- This script creates a storage bucket for testimonial photos

-- Create the testimonials storage bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'testimonials',
  'testimonials',
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- Create RLS policy for public read access
CREATE POLICY "Public read access for testimonials images" ON storage.objects
FOR SELECT USING (bucket_id = 'testimonials');

-- Create RLS policy for authenticated users to upload
CREATE POLICY "Authenticated users can upload testimonials images" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'testimonials' 
  AND auth.role() = 'authenticated'
);

-- Create RLS policy for authenticated users to update
CREATE POLICY "Authenticated users can update testimonials images" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'testimonials' 
  AND auth.role() = 'authenticated'
);

-- Create RLS policy for authenticated users to delete
CREATE POLICY "Authenticated users can delete testimonials images" ON storage.objects
FOR DELETE USING (
  bucket_id = 'testimonials' 
  AND auth.role() = 'authenticated'
);

-- Verify the bucket was created
SELECT * FROM storage.buckets WHERE id = 'testimonials';
