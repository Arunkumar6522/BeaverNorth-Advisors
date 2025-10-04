-- Add referral_code column to leads table
ALTER TABLE leads ADD COLUMN IF NOT EXISTS referral_code TEXT;

-- Delete all existing leads (as requested by user)
DELETE FROM leads WHERE id IS NOT NULL;

-- Optional: Add an index for faster referral code lookups
CREATE INDEX IF NOT EXISTS idx_leads_referral_code ON leads(referral_code);

-- Optional: Add a comment to document the column
COMMENT ON COLUMN leads.referral_code IS 'Optional referral code provided by the lead';

