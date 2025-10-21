-- TEST SCRIPT: Check if secure_user_login function exists
-- Run this in Supabase SQL Editor to verify the function was created

-- Check if the function exists
SELECT 
  routine_name,
  routine_type,
  security_type,
  data_type
FROM information_schema.routines 
WHERE routine_name = 'secure_user_login';

-- If the function exists, test it
SELECT * FROM secure_user_login('admin', 'admin123', '127.0.0.1');

-- Check current RLS policies
SELECT 
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies 
WHERE tablename = 'users';
