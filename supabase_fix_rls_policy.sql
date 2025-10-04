-- ============================================
-- FIX RLS POLICY FOR LEADS TABLE
-- ============================================
-- This allows anonymous users to insert leads (form submissions)
-- while maintaining security for other operations

-- 1. Drop existing restrictive policies if any
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON leads;
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON leads;

-- 2. Create policy to allow ANYONE to insert leads (public form submissions)
CREATE POLICY "Allow public lead submissions" ON leads
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- 3. Create policy to allow authenticated users to read all leads
CREATE POLICY "Allow authenticated users to read leads" ON leads
  FOR SELECT
  TO authenticated
  USING (true);

-- 4. Create policy to allow authenticated users to update leads
CREATE POLICY "Allow authenticated users to update leads" ON leads
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- 5. Create policy to allow authenticated users to delete leads (soft delete)
CREATE POLICY "Allow authenticated users to delete leads" ON leads
  FOR DELETE
  TO authenticated
  USING (true);

-- 6. Verify RLS is enabled
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- 7. Check all policies
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'leads';

-- Expected output should show:
-- - "Allow public lead submissions" for INSERT (anon, authenticated)
-- - "Allow authenticated users to read leads" for SELECT (authenticated)
-- - "Allow authenticated users to update leads" for UPDATE (authenticated)
-- - "Allow authenticated users to delete leads" for DELETE (authenticated)

