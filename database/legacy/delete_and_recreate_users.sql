-- DELETE ALL USERS AND RECREATE TABLE
-- ⚠️ WARNING: This will delete ALL user data permanently!
-- Run this in Supabase SQL Editor

-- 1. Drop the existing users table (this deletes everything)
DROP TABLE IF EXISTS users CASCADE;

-- 2. Recreate the users table from scratch
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

-- 3. Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- 4. Create secure policies
-- Allow anonymous users to verify login
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

-- 5. Create indexes
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_email ON users(email);

-- 6. Insert Ayyappa user
INSERT INTO users (username, password_hash, email, full_name, role) 
VALUES (
  'ayyappa', 
  crypt('9211027', gen_salt('bf', 12)),
  'ayyappa.research@gmail.com', 
  'Ayyappa', 
  'admin'
);

-- 7. Insert Shini user
INSERT INTO users (username, password_hash, email, full_name, role) 
VALUES (
  'shini', 
  crypt('7635120', gen_salt('bf', 12)),
  'shantoshini@gmail.com', 
  'Shini', 
  'admin'
);

-- 8. Insert Arun user
INSERT INTO users (username, password_hash, email, full_name, role) 
VALUES (
  'arun', 
  crypt('7299981628', gen_salt('bf', 12)),
  'arunkumark1664@gmail.com', 
  'Arun Kumar', 
  'admin'
);

-- 9. Verify the setup
SELECT 
  'Table Recreated Successfully' as status,
  COUNT(*) as user_count,
  'All users created successfully' as message
FROM users;

-- 10. Show all users
SELECT 
  username,
  email,
  full_name,
  role,
  CASE 
    WHEN password_hash LIKE '$2a$%' THEN '✅ Properly hashed'
    ELSE '❌ Hash issue'
  END as password_status
FROM users
ORDER BY username;
