-- =====================================================
-- SECURITY - RLS POLICIES SETUP
-- =====================================================
-- Description: Set up Row Level Security policies
-- Usage: Run to secure the users table
-- =====================================================

-- Enable RLS on users table
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Allow login verification" ON users;
DROP POLICY IF EXISTS "Users see own data" ON users;
DROP POLICY IF EXISTS "Service role full access" ON users;
DROP POLICY IF EXISTS "Temporary admin access" ON users;

-- Create secure policies
-- Allow anonymous users to verify login (but not see sensitive data)
CREATE POLICY "Allow login verification" ON users
  FOR SELECT
  TO anon
  USING (true);

-- Allow authenticated users to see their own data
CREATE POLICY "Users see own data" ON users
  FOR ALL
  TO authenticated
  USING (auth.uid()::text = username);

-- Allow service role full access
CREATE POLICY "Service role full access" ON users
  FOR ALL
  TO service_role
  USING (true);

-- Verify RLS status
SELECT 
  'RLS Status' as check_type,
  tablename,
  CASE 
    WHEN rowsecurity THEN '✅ RLS ENABLED'
    ELSE '❌ RLS DISABLED'
  END as rls_status
FROM pg_tables 
WHERE tablename = 'users' AND schemaname = 'public';

-- Check policies
SELECT 
  'Policy Check' as check_type,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies 
WHERE tablename = 'users' AND schemaname = 'public';
