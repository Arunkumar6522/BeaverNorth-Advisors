-- CREATE USER FOR LOGIN - Run this in Supabase SQL Editor
-- This will create the user you're trying to log in with

-- Create user with email arunkumark1664@gmail.com
INSERT INTO users (username, password_hash, email, full_name, role) 
VALUES (
  'arunkumar', 
  crypt('admin123', gen_salt('bf', 12)),  -- Password: admin123
  'arunkumark1664@gmail.com', 
  'Arun Kumar', 
  'admin'
) ON CONFLICT (email) DO UPDATE SET
  password_hash = crypt('admin123', gen_salt('bf', 12)),
  full_name = 'Arun Kumar',
  role = 'admin';

-- Verify the user was created
SELECT 
  id,
  username,
  email,
  full_name,
  role,
  CASE 
    WHEN password_hash LIKE '$2a$%' THEN '✅ Properly hashed'
    ELSE '❌ Hash issue'
  END as password_status
FROM users 
WHERE email = 'arunkumark1664@gmail.com';

-- Also ensure admin user exists
INSERT INTO users (username, password_hash, email, full_name, role) 
VALUES (
  'admin', 
  crypt('admin123', gen_salt('bf', 12)),  -- Password: admin123
  'admin@beavernorth.com', 
  'Administrator', 
  'admin'
) ON CONFLICT (username) DO UPDATE SET
  password_hash = crypt('admin123', gen_salt('bf', 12)),
  email = 'admin@beavernorth.com',
  full_name = 'Administrator',
  role = 'admin';

-- Show all users
SELECT 
  id,
  username,
  email,
  role,
  created_at
FROM users
ORDER BY created_at DESC;
