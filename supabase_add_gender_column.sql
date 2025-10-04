-- Add gender column to leads table
ALTER TABLE leads ADD COLUMN IF NOT EXISTS gender TEXT;

-- Add a check constraint to ensure valid gender values
ALTER TABLE leads ADD CONSTRAINT leads_gender_check 
  CHECK (gender IN ('male', 'female', 'others', 'prefer-not-to-say') OR gender IS NULL);

-- Add a comment to document the column
COMMENT ON COLUMN leads.gender IS 'Gender of the lead: male, female, others, prefer-not-to-say, or null';

-- Optional: Add an index for faster gender-based queries (for analytics)
CREATE INDEX IF NOT EXISTS idx_leads_gender ON leads(gender);

