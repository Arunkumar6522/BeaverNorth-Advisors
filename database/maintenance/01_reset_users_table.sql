-- =====================================================
-- MAINTENANCE - RESET USERS TABLE
-- =====================================================
-- Description: Complete reset of users table
-- Usage: Run to start fresh (deletes all data)
-- =====================================================

-- ⚠️ WARNING: This will delete ALL user data permanently!

-- Drop the existing users table (this deletes everything)
DROP TABLE IF EXISTS users CASCADE;

-- Recreate the users table from scratch
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  email TEXT UNIQUE,
  full_name TEXT,
  role TEXT DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create secure policies
CREATE POLICY "Allow login verification" ON users
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Users see own data" ON users
  FOR ALL
  TO authenticated
  USING (auth.uid()::text = username);

CREATE POLICY "Service role full access" ON users
  FOR ALL
  TO service_role
  USING (true);

-- Create indexes
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_email ON users(email);

-- Create update trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger
CREATE TRIGGER update_users_updated_at 
  BEFORE UPDATE ON users 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Verify reset
SELECT 
  'Table Reset Complete' as status,
  COUNT(*) as user_count,
  'Ready for new users' as message
FROM users;
