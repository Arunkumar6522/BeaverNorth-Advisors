-- STEP 1: Fix the critical RLS security vulnerability
-- This removes the dangerous policy that exposes all user data to anonymous users

-- Drop the insecure policy
DROP POLICY IF EXISTS "Allow login access" ON users;

-- Create a secure policy that prevents anonymous access to sensitive data
CREATE POLICY "No anonymous access to sensitive data" ON users
  FOR SELECT
  TO anon
  USING (false);

-- Create policy for authenticated users to see their own data
CREATE POLICY "Authenticated users see own data" ON users
  FOR ALL
  TO authenticated
  USING (auth.uid()::text = username);

-- Create policy for service role (admin operations)
CREATE POLICY "Service role full access" ON users
  FOR ALL
  TO service_role
  USING (true);

-- Verify RLS is enabled
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
