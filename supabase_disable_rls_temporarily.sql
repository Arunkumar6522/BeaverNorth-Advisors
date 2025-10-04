-- ============================================
-- TEMPORARY FIX: DISABLE RLS FOR TESTING
-- ============================================
-- This completely disables RLS on leads table
-- Use this ONLY for testing to confirm RLS is the issue

-- Option 1: Disable RLS completely (TEMPORARY - for testing only)
ALTER TABLE leads DISABLE ROW LEVEL SECURITY;

-- After testing, you can re-enable with proper policies:
-- ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Then verify:
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'leads';

-- Expected: rowsecurity should be 'false' (disabled)

