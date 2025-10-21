-- CHECK EXISTING USERS - Run this in Supabase SQL Editor
-- This will show you what users currently exist in your database

-- Check all users in the database
SELECT 
  id,
  username,
  email,
  role,
  created_at
FROM users
ORDER BY created_at DESC;

-- Check if admin user exists
SELECT 
  'Admin User Check' as check_type,
  CASE 
    WHEN COUNT(*) > 0 THEN '✅ Admin user exists'
    ELSE '❌ No admin user found'
  END as status
FROM users 
WHERE username = 'admin';

-- Check if the email exists
SELECT 
  'Email Check' as check_type,
  CASE 
    WHEN COUNT(*) > 0 THEN '✅ Email exists'
    ELSE '❌ Email not found'
  END as status
FROM users 
WHERE email = 'arunkumark1664@gmail.com';
