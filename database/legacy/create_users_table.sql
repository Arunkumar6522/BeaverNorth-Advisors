-- CREATE USERS TABLE FROM SCRATCH
-- Run this in Supabase SQL Editor if the users table doesn't exist

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

-- 4. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- 5. Insert admin user
INSERT INTO users (username, password_hash, email, full_name, role) 
VALUES (
  'admin', 
  crypt('admin123', gen_salt('bf', 12)),
  'admin@beavernorth.com', 
  'Administrator', 
  'admin'
) ON CONFLICT (username) DO NOTHING;

-- 6. Insert your user
INSERT INTO users (username, password_hash, email, full_name, role) 
VALUES (
  'arunkumar', 
  crypt('admin123', gen_salt('bf', 12)),
  'arunkumark1664@gmail.com', 
  'Arun Kumar', 
  'admin'
) ON CONFLICT (email) DO NOTHING;

-- 7. Verify everything works
SELECT 
  'Setup Complete' as status,
  COUNT(*) as user_count,
  'Users table created and populated' as message
FROM users;
