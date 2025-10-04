-- ============================================
-- UPDATE LEADS TABLE - ADD MISSING COLUMNS
-- ============================================
-- Run this SQL in Supabase SQL Editor
-- This adds gender and referral_code columns to the leads table

-- 1. Add gender column
ALTER TABLE leads ADD COLUMN IF NOT EXISTS gender TEXT;

-- 2. Add referral_code column  
ALTER TABLE leads ADD COLUMN IF NOT EXISTS referral_code TEXT;

-- 3. Add check constraint for gender values
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'leads_gender_check'
  ) THEN
    ALTER TABLE leads ADD CONSTRAINT leads_gender_check 
      CHECK (gender IN ('male', 'female', 'others', 'prefer-not-to-say') OR gender IS NULL);
  END IF;
END $$;

-- 4. Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_leads_gender ON leads(gender);
CREATE INDEX IF NOT EXISTS idx_leads_referral_code ON leads(referral_code);

-- 5. Add column comments for documentation
COMMENT ON COLUMN leads.gender IS 'Gender of the lead: male, female, others, prefer-not-to-say, or null';
COMMENT ON COLUMN leads.referral_code IS 'Optional referral code provided by the lead';

-- 6. Verify the changes
SELECT 
  column_name, 
  data_type, 
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_name = 'leads'
  AND column_name IN ('gender', 'referral_code')
ORDER BY column_name;

-- Expected output:
-- column_name    | data_type | is_nullable | column_default
-- ---------------+-----------+-------------+---------------
-- gender         | text      | YES         | null
-- referral_code  | text      | YES         | null

