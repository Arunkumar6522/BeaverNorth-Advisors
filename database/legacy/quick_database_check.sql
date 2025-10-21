-- QUICK DATABASE CHECK - Run this to verify your setup
-- Copy and paste this in Supabase SQL Editor

-- 1. Check table structure
SELECT 
  'Table Structure' as check_type,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns 
WHERE table_name = 'users' 
ORDER BY ordinal_position;

-- 2. Check admin user data
SELECT 
  'Admin User Data' as check_type,
  id,
  username,
  email,
  role,
  CASE 
    WHEN password_hash IS NOT NULL THEN '✅ Has password_hash'
    ELSE '❌ No password_hash'
  END as password_status,
  CASE 
    WHEN password_hash LIKE '$2a$%' THEN '✅ Properly hashed'
    WHEN password_hash IS NOT NULL THEN '⚠️ Not bcrypt format'
    ELSE '❌ No hash'
  END as hash_format
FROM users 
WHERE username = 'admin';

-- 3. Test login verification
SELECT 
  'Login Test' as check_type,
  CASE 
    WHEN crypt('admin123', password_hash) = password_hash THEN '✅ Password verification works'
    ELSE '❌ Password verification failed'
  END as login_test
FROM users 
WHERE username = 'admin';

-- 4. Check RLS status
SELECT 
  'RLS Status' as check_type,
  tablename,
  CASE 
    WHEN rowsecurity THEN '✅ RLS ENABLED'
    ELSE '❌ RLS DISABLED'
  END as rls_status
FROM pg_tables 
WHERE tablename = 'users';
