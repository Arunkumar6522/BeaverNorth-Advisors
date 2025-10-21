-- =====================================================
-- USER MANAGEMENT - LIST ALL USERS
-- =====================================================
-- Description: View all users in the system
-- Usage: Run to see all users and their details
-- =====================================================

-- List all users
SELECT 
  id,
  username,
  email,
  full_name,
  role,
  created_at,
  updated_at,
  CASE 
    WHEN password_hash LIKE '$2a$%' THEN '✅ Properly hashed'
    ELSE '❌ Hash issue'
  END as password_status
FROM users
ORDER BY created_at DESC;

-- Count users by role
SELECT 
  role,
  COUNT(*) as user_count
FROM users
GROUP BY role
ORDER BY user_count DESC;

-- Show user statistics
SELECT 
  'Total Users' as metric,
  COUNT(*) as value
FROM users
UNION ALL
SELECT 
  'Admin Users',
  COUNT(*)
FROM users
WHERE role = 'admin'
UNION ALL
SELECT 
  'Regular Users',
  COUNT(*)
FROM users
WHERE role = 'user';
