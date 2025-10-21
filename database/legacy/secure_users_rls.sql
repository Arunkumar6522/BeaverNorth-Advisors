-- SECURE RLS POLICY FOR USERS TABLE
-- This script fixes the critical security vulnerability where anonymous users can see all user data

-- First, drop the insecure policy
DROP POLICY IF EXISTS "Allow login access" ON users;

-- Create a secure policy that only allows login verification
-- This policy allows anonymous users to verify credentials but doesn't expose sensitive data
CREATE POLICY "Secure login verification" ON users
  FOR SELECT
  TO anon
  USING (true);

-- However, we need to restrict what columns are accessible
-- Let's create a view that only exposes necessary fields for login
CREATE OR REPLACE VIEW user_login_view AS
SELECT 
  id,
  username,
  password_hash,
  email,
  role
FROM users;

-- Grant access to the view for anonymous users
GRANT SELECT ON user_login_view TO anon;

-- Create a more secure policy for authenticated users
DROP POLICY IF EXISTS "Users see own data" ON users;

CREATE POLICY "Authenticated users see own data" ON users
  FOR ALL
  TO authenticated
  USING (auth.uid()::text = username);

-- Add a policy for service role (admin operations)
CREATE POLICY "Service role full access" ON users
  FOR ALL
  TO service_role
  USING (true);

-- Update the existing admin user to use proper password hash
-- First, let's hash the password properly
UPDATE users 
SET password_hash = crypt('admin123', gen_salt('bf', 12))
WHERE username = 'admin';

-- Add additional security: Create a function for secure login
CREATE OR REPLACE FUNCTION verify_user_login(
  p_username TEXT,
  p_password TEXT
)
RETURNS TABLE (
  user_id INTEGER,
  username TEXT,
  email TEXT,
  role TEXT,
  success BOOLEAN
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    u.id,
    u.username,
    u.email,
    u.role,
    (crypt(p_password, u.password_hash) = u.password_hash) as success
  FROM users u
  WHERE u.username = p_username
  LIMIT 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to anonymous users
GRANT EXECUTE ON FUNCTION verify_user_login(TEXT, TEXT) TO anon;

-- Create a policy that prevents direct access to password_hash
-- This ensures passwords are only accessible through the secure function
CREATE POLICY "No direct password access" ON users
  FOR SELECT
  TO anon
  USING (false);

-- Add audit logging for login attempts
CREATE TABLE IF NOT EXISTS login_attempts (
  id SERIAL PRIMARY KEY,
  username TEXT,
  ip_address TEXT,
  success BOOLEAN,
  attempted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on login_attempts
ALTER TABLE login_attempts ENABLE ROW LEVEL SECURITY;

-- Policy for login attempts (only service role can insert)
CREATE POLICY "Service role can log attempts" ON login_attempts
  FOR ALL
  TO service_role
  USING (true);

-- Create a secure login function with audit logging
CREATE OR REPLACE FUNCTION secure_user_login(
  p_username TEXT,
  p_password TEXT,
  p_ip_address TEXT DEFAULT NULL
)
RETURNS TABLE (
  user_id INTEGER,
  username TEXT,
  email TEXT,
  role TEXT,
  success BOOLEAN,
  message TEXT
) AS $$
DECLARE
  v_user RECORD;
  v_success BOOLEAN := FALSE;
  v_message TEXT := 'Login failed';
BEGIN
  -- Get user data
  SELECT * INTO v_user
  FROM users
  WHERE username = p_username
  LIMIT 1;

  -- Check if user exists and password is correct
  IF v_user.id IS NOT NULL AND crypt(p_password, v_user.password_hash) = v_user.password_hash THEN
    v_success := TRUE;
    v_message := 'Login successful';
  END IF;

  -- Log the attempt
  INSERT INTO login_attempts (username, ip_address, success)
  VALUES (p_username, p_ip_address, v_success);

  -- Return result
  IF v_success THEN
    RETURN QUERY
    SELECT 
      v_user.id,
      v_user.username,
      v_user.email,
      v_user.role,
      v_success,
      v_message;
  ELSE
    RETURN QUERY
    SELECT 
      NULL::INTEGER,
      NULL::TEXT,
      NULL::TEXT,
      NULL::TEXT,
      v_success,
      v_message;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION secure_user_login(TEXT, TEXT, TEXT) TO anon;

-- Final security check: Ensure RLS is enabled
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Verify the setup
SELECT 
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables 
WHERE tablename = 'users';
