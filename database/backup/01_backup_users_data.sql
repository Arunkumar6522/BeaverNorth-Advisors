-- =====================================================
-- MAINTENANCE - BACKUP USERS DATA
-- =====================================================
-- Description: Backup all user data
-- Usage: Run to export user data before maintenance
-- =====================================================

-- Export all users data
SELECT 
  id,
  username,
  email,
  full_name,
  role,
  created_at,
  updated_at
FROM users
ORDER BY id;

-- Export user statistics
SELECT 
  'Backup Summary' as info,
  COUNT(*) as total_users,
  COUNT(CASE WHEN role = 'admin' THEN 1 END) as admin_users,
  COUNT(CASE WHEN role = 'user' THEN 1 END) as regular_users,
  MIN(created_at) as oldest_user,
  MAX(created_at) as newest_user
FROM users;

-- Export user credentials (for reference only - passwords are hashed)
SELECT 
  username,
  email,
  full_name,
  role,
  'Password is hashed in database' as password_note
FROM users
ORDER BY username;
