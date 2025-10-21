-- FIX USERS TABLE VISIBILITY
-- Run this in Supabase SQL Editor to make users table visible

-- 1. First, let's check if the table exists and create it if needed
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

-- 3. Drop existing policies that might be blocking access
DROP POLICY IF EXISTS "No anonymous access to sensitive data" ON users;
DROP POLICY IF EXISTS "Authenticated users see own data" ON users;
DROP POLICY IF EXISTS "Service role full access" ON users;

-- 4. Create a temporary policy to allow you to see the table (for setup purposes)
CREATE POLICY "Temporary admin access" ON users
  FOR ALL
  TO anon
  USING (true)
  WITH CHECK (true);

-- 5. Insert admin user if it doesn't exist
INSERT INTO users (username, password_hash, email, full_name, role) 
VALUES (
  'admin', 
  crypt('admin123', gen_salt('bf', 12)),
  'admin@beavernorth.com', 
  'Administrator', 
  'admin'
) ON CONFLICT (username) DO UPDATE SET
  password_hash = crypt('admin123', gen_salt('bf', 12));

-- 6. Insert your user
INSERT INTO users (username, password_hash, email, full_name, role) 
VALUES (
  'arunkumar', 
  crypt('admin123', gen_salt('bf', 12)),
  'arunkumark1664@gmail.com', 
  'Arun Kumar', 
  'admin'
) ON CONFLICT (email) DO UPDATE SET
  password_hash = crypt('admin123', gen_salt('bf', 12));

-- 7. Verify the data
SELECT 
  id,
  username,
  email,
  role,
  CASE 
    WHEN password_hash LIKE '$2a$%' THEN '✅ Properly hashed'
    ELSE '❌ Hash issue'
  END as password_status
FROM users
ORDER BY created_at DESC;
