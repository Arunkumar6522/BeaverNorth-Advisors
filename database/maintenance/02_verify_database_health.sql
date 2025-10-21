-- =====================================================
-- MAINTENANCE - VERIFY DATABASE HEALTH
-- =====================================================
-- Description: Check database health and integrity
-- Usage: Run to verify everything is working correctly
-- =====================================================

-- Check table structure
SELECT 
  'Table Structure' as check_type,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns 
WHERE table_name = 'users' AND table_schema = 'public'
ORDER BY ordinal_position;

-- Check RLS status
SELECT 
  'RLS Status' as check_type,
  tablename,
  CASE 
    WHEN rowsecurity THEN '✅ RLS ENABLED'
    ELSE '❌ RLS DISABLED'
  END as rls_status
FROM pg_tables 
WHERE tablename = 'users' AND schemaname = 'public';

-- Check policies
SELECT 
  'Policy Check' as check_type,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies 
WHERE tablename = 'users' AND schemaname = 'public';

-- Check users data
SELECT 
  'Users Data' as check_type,
  COUNT(*) as user_count,
  COUNT(CASE WHEN password_hash LIKE '$2a$%' THEN 1 END) as properly_hashed_passwords,
  COUNT(CASE WHEN role = 'admin' THEN 1 END) as admin_count
FROM users;

-- Test login function (if exists)
SELECT 
  'Login Function Test' as check_type,
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM information_schema.routines 
      WHERE routine_name = 'secure_user_login'
    ) THEN '✅ Function exists'
    ELSE '❌ Function missing'
  END as function_status;

-- Check indexes
SELECT 
  'Index Check' as check_type,
  indexname,
  indexdef
FROM pg_indexes 
WHERE tablename = 'users' AND schemaname = 'public';
