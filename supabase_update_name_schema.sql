-- ============================================
-- UPDATE LEADS TABLE - SPLIT NAME INTO FIRST/LAST
-- ============================================
-- Run this SQL in Supabase SQL Editor
-- This changes the name field to first_name and last_name

-- Step 1: Add new columns
ALTER TABLE leads ADD COLUMN IF NOT EXISTS first_name TEXT;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS last_name TEXT;

-- Step 2: Migrate existing data (split existing name into first/last)
UPDATE leads 
SET 
  first_name = CASE 
    WHEN name IS NULL OR name = '' THEN NULL
    WHEN position(' ' in name) = 0 THEN name  -- No space, use as first name
    ELSE substring(name from 1 for position(' ' in name) - 1)  -- First part before space
  END,
  last_name = CASE 
    WHEN name IS NULL OR name = '' THEN NULL
    WHEN position(' ' in name) = 0 THEN NULL  -- No space, no last name
    ELSE substring(name from position(' ' in name) + 1)  -- Everything after first space
  END
WHERE first_name IS NULL OR last_name IS NULL;

-- Step 3: Make first_name required (NOT NULL)
ALTER TABLE leads ALTER COLUMN first_name SET NOT NULL;

-- Step 4: Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_leads_first_name ON leads(first_name);
CREATE INDEX IF NOT EXISTS idx_leads_last_name ON leads(last_name);

-- Step 5: Add column comments
COMMENT ON COLUMN leads.first_name IS 'First name of the lead';
COMMENT ON COLUMN leads.last_name IS 'Last name of the lead (optional)';

-- Step 6: Verify the changes
SELECT 
  column_name, 
  data_type, 
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_name = 'leads'
  AND column_name IN ('name', 'first_name', 'last_name')
ORDER BY column_name;

-- Step 7: Show sample of migrated data
SELECT 
  id,
  name as old_name,
  first_name,
  last_name,
  created_at
FROM leads 
ORDER BY created_at DESC 
LIMIT 5;

-- Expected output should show:
-- column_name | data_type | is_nullable | column_default
-- -------------+-----------+-------------+---------------
-- first_name   | text      | NO          | null
-- last_name    | text      | YES         | null
-- name         | text      | NO          | null
