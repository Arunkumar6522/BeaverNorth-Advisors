-- ============================================
-- ADD DELETE COLUMNS TO LEADS TABLE
-- ============================================
-- These columns are needed for soft delete functionality

-- Add delete-related columns
ALTER TABLE leads ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS delete_reason TEXT;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS delete_comment TEXT;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS deleted_by TEXT;

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_leads_deleted_at ON leads(deleted_at);
CREATE INDEX IF NOT EXISTS idx_leads_deleted_by ON leads(deleted_by);

-- Add comments to document the columns
COMMENT ON COLUMN leads.deleted_at IS 'Timestamp when lead was soft deleted (NULL = not deleted)';
COMMENT ON COLUMN leads.delete_reason IS 'Reason for deletion (e.g., duplicate, no_response, spam)';
COMMENT ON COLUMN leads.delete_comment IS 'Additional comment explaining the deletion';
COMMENT ON COLUMN leads.deleted_by IS 'Username/email of person who deleted the lead';

-- Verify the columns were added
SELECT 
  column_name, 
  data_type, 
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_name = 'leads'
  AND column_name IN ('deleted_at', 'delete_reason', 'delete_comment', 'deleted_by')
ORDER BY column_name;

-- Expected output:
-- column_name     | data_type                   | is_nullable | column_default
-- ----------------+-----------------------------+-------------+---------------
-- delete_comment  | text                        | YES         | null
-- delete_reason   | text                        | YES         | null
-- deleted_at      | timestamp with time zone    | YES         | null
-- deleted_by      | text                        | YES         | null

