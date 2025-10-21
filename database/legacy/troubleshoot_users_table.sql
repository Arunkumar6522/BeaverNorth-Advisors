-- TROUBLESHOOT USERS TABLE VISIBILITY
-- Run this in Supabase SQL Editor to diagnose the issue

-- 1. Check if users table exists
SELECT 
  'Table Existence Check' as check_type,
  CASE 
    WHEN COUNT(*) > 0 THEN '✅ Users table exists'
    ELSE '❌ Users table does not exist'
  END as status
FROM information_schema.tables 
WHERE table_name = 'users' AND table_schema = 'public';

-- 2. Check table structure
SELECT 
  'Table Structure' as check_type,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns 
WHERE table_name = 'users' AND table_schema = 'public'
ORDER BY ordinal_position;

-- 3. Check RLS status
SELECT 
  'RLS Status' as check_type,
  tablename,
  CASE 
    WHEN rowsecurity THEN '✅ RLS ENABLED'
    ELSE '❌ RLS DISABLED'
  END as rls_status
FROM pg_tables 
WHERE tablename = 'users' AND schemaname = 'public';

-- 4. Check current policies
SELECT 
  'Current Policies' as check_type,
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies 
WHERE tablename = 'users' AND schemaname = 'public';

-- 5. Try to select from users table (this might fail due to RLS)
SELECT 
  'Data Access Test' as check_type,
  COUNT(*) as user_count
FROM users;

-- 6. Check if you have the right permissions
SELECT 
  'Permission Check' as check_type,
  grantee,
  privilege_type
FROM information_schema.table_privileges 
WHERE table_name = 'users' AND table_schema = 'public';
