-- Add user tracking columns to leads table
-- Run this in Supabase SQL Editor

-- Add contacted_by column to track who contacted the lead
ALTER TABLE leads ADD COLUMN IF NOT EXISTS contacted_by TEXT;

-- Add converted_by column to track who converted the lead  
ALTER TABLE leads ADD COLUMN IF NOT EXISTS converted_by TEXT;

-- Add created_by column to track who created the lead
ALTER TABLE leads ADD COLUMN IF NOT EXISTS created_by TEXT;

-- Add comments to the columns for documentation
COMMENT ON COLUMN leads.contacted_by IS 'Username of the user who contacted this lead';
COMMENT ON COLUMN leads.converted_by IS 'Username of the user who converted this lead';
COMMENT ON COLUMN leads.created_by IS 'Username of the user who created this lead';

-- Verify the columns were added
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'leads' 
AND column_name IN ('contacted_by', 'converted_by', 'created_by');

-- Test insert to make sure columns work
INSERT INTO leads (name, email, phone, contacted_by, converted_by, created_by) 
VALUES ('Test User', 'test@example.com', '+1234567890', 'arun', 'shini', 'admin')
ON CONFLICT DO NOTHING;

-- Clean up test record
DELETE FROM leads WHERE email = 'test@example.com';
