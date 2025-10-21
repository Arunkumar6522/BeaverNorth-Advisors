-- DELETE SPECIFIC USER
-- Run this in Supabase SQL Editor to delete a specific user

-- Delete user by email
DELETE FROM users WHERE email = 'arunkumark1664@gmail.com';

-- Delete user by username
DELETE FROM users WHERE username = 'arunkumar';

-- Delete user by ID (replace 1 with actual ID)
DELETE FROM users WHERE id = 1;

-- Verify deletion
SELECT 
  'User Deleted' as status,
  COUNT(*) as remaining_users,
  'Check users table for remaining data' as message
FROM users;
