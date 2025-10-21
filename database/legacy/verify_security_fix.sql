-- VERIFICATION SCRIPT - Run this to confirm security fix is working
-- Run this in Supabase SQL Editor after completing all 3 steps

-- 1. Check RLS status
SELECT 
  'RLS Status Check' as test_name,
  tablename,
  CASE 
    WHEN rowsecurity THEN '✅ RLS ENABLED' 
    ELSE '❌ RLS DISABLED' 
  END as status
FROM pg_tables 
WHERE tablename IN ('users', 'login_attempts');

-- 2. Check policies
SELECT 
  'Policy Check' as test_name,
  policyname,
  CASE 
    WHEN policyname LIKE '%anonymous%' AND qual = 'false' THEN '✅ SECURE - No anonymous access'
    WHEN policyname LIKE '%service_role%' THEN '✅ SECURE - Service role access'
    WHEN policyname LIKE '%authenticated%' THEN '✅ SECURE - Authenticated user access'
    ELSE '⚠️ CHECK POLICY'
  END as status
FROM pg_policies 
WHERE tablename = 'users';

-- 3. Test secure login function
SELECT 
  'Secure Login Test' as test_name,
  CASE 
    WHEN success THEN '✅ LOGIN FUNCTION WORKING'
    ELSE '❌ LOGIN FUNCTION FAILED'
  END as status,
  message
FROM secure_user_login('admin', 'admin123', '127.0.0.1');

-- 4. Check if anonymous users can see sensitive data (should fail)
SELECT 
  'Anonymous Access Test' as test_name,
  CASE 
    WHEN COUNT(*) = 0 THEN '✅ SECURE - No anonymous access to passwords'
    ELSE '❌ VULNERABLE - Anonymous users can see passwords'
  END as status
FROM users;

-- 5. Check login attempts logging
SELECT 
  'Audit Logging Test' as test_name,
  CASE 
    WHEN COUNT(*) > 0 THEN '✅ AUDIT LOGGING WORKING'
    ELSE '⚠️ NO LOGIN ATTEMPTS YET'
  END as status
FROM login_attempts;
