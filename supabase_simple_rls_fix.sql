-- ============================================
-- SIMPLE RLS FIX - ALLOW ALL OPERATIONS
-- ============================================
-- This is the simplest approach for a contact form

-- 1. First, drop ALL existing policies on leads table
DO $$ 
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'leads') LOOP
        EXECUTE 'DROP POLICY IF EXISTS ' || quote_ident(r.policyname) || ' ON leads';
    END LOOP;
END $$;

-- 2. Create ONE simple policy that allows everything for everyone
CREATE POLICY "Allow all operations on leads" ON leads
  FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

-- 3. Make sure RLS is enabled
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- 4. Verify the policy
SELECT 
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies
WHERE tablename = 'leads';

-- Expected output:
-- tablename | policyname                    | permissive | roles    | cmd
-- ----------+-------------------------------+------------+----------+-----
-- leads     | Allow all operations on leads | PERMISSIVE | {public} | ALL

