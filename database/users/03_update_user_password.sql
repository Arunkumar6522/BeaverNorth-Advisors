-- =====================================================
-- USER MANAGEMENT - UPDATE USER PASSWORD
-- =====================================================
-- Description: Update password for existing user
-- Usage: Replace username and new_password with actual values
-- =====================================================

-- Update user password (replace values as needed)
UPDATE users 
SET 
  password_hash = crypt('new_password', gen_salt('bf', 12)),  -- Replace with new password
  updated_at = NOW()
WHERE username = 'username_to_update';  -- Replace with actual username

-- Alternative: Update by email
UPDATE users 
SET 
  password_hash = crypt('new_password', gen_salt('bf', 12)),  -- Replace with new password
  updated_at = NOW()
WHERE email = 'email_to_update@example.com';  -- Replace with actual email

-- Verify password updated
SELECT 
  username,
  email,
  CASE 
    WHEN password_hash LIKE '$2a$%' THEN '✅ Password updated'
    ELSE '❌ Password issue'
  END as password_status,
  updated_at
FROM users 
WHERE username = 'username_to_update';  -- Replace with actual username
