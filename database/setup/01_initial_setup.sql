-- =====================================================
-- DATABASE SETUP - INITIAL SETUP
-- =====================================================
-- Description: Complete database initialization
-- Usage: Run this first to set up the entire database
-- =====================================================

-- 1. Create users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  email TEXT UNIQUE,
  full_name TEXT,
  role TEXT DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- 3. Create secure policies
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

-- 4. Create indexes
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- 5. Create update trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- 6. Create trigger
CREATE TRIGGER update_users_updated_at 
  BEFORE UPDATE ON users 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- 7. Verify setup
SELECT 
  'Database Setup Complete' as status,
  COUNT(*) as table_count
FROM information_schema.tables 
WHERE table_schema = 'public' AND table_name = 'users';
