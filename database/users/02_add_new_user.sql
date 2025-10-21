-- =====================================================
-- USER MANAGEMENT - ADD NEW USER
-- =====================================================
-- Description: Add a new user to the system
-- Usage: Replace the values below with new user details
-- =====================================================

-- Add new user (replace values as needed)
INSERT INTO users (username, password_hash, email, full_name, role) 
VALUES (
  'new_username',                    -- Replace with actual username
  crypt('new_password', gen_salt('bf', 12)),  -- Replace with actual password
  'new_email@example.com',            -- Replace with actual email
  'New User Full Name',               -- Replace with actual full name
  'admin'                             -- Replace with role: 'admin' or 'user'
) ON CONFLICT (username) DO UPDATE SET
  password_hash = crypt('new_password', gen_salt('bf', 12)),
  email = 'new_email@example.com',
  full_name = 'New User Full Name',
  role = 'admin';

-- Verify user added
SELECT 
  username,
  email,
  full_name,
  role,
  created_at
FROM users 
WHERE username = 'new_username';
