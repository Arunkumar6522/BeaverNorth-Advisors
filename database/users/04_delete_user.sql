-- =====================================================
-- USER MANAGEMENT - DELETE USER
-- =====================================================
-- Description: Delete user from the system
-- Usage: Replace username/email with actual values to delete
-- =====================================================

-- Delete user by username
DELETE FROM users WHERE username = 'username_to_delete';  -- Replace with actual username

-- Delete user by email
DELETE FROM users WHERE email = 'email_to_delete@example.com';  -- Replace with actual email

-- Delete user by ID
DELETE FROM users WHERE id = 1;  -- Replace with actual user ID

-- Verify deletion
SELECT 
  'User Deleted' as status,
  COUNT(*) as remaining_users,
  'Check users table for remaining data' as message
FROM users;
