-- =====================================================
-- USER MANAGEMENT - CREATE USERS
-- =====================================================
-- Description: Create all users with proper credentials
-- Usage: Run after initial setup to create users
-- =====================================================

-- Insert Ayyappa user
INSERT INTO users (username, password_hash, email, full_name, role) 
VALUES (
  'ayyappa', 
  crypt('9211027', gen_salt('bf', 12)),
  'ayyappa.research@gmail.com', 
  'Ayyappa', 
  'admin'
) ON CONFLICT (username) DO UPDATE SET
  password_hash = crypt('9211027', gen_salt('bf', 12)),
  email = 'ayyappa.research@gmail.com',
  full_name = 'Ayyappa',
  role = 'admin';

-- Insert Shini user
INSERT INTO users (username, password_hash, email, full_name, role) 
VALUES (
  'shini', 
  crypt('7635120', gen_salt('bf', 12)),
  'shantoshini@gmail.com', 
  'Shini', 
  'admin'
) ON CONFLICT (username) DO UPDATE SET
  password_hash = crypt('7635120', gen_salt('bf', 12)),
  email = 'shantoshini@gmail.com',
  full_name = 'Shini',
  role = 'admin';

-- Insert Arun user
INSERT INTO users (username, password_hash, email, full_name, role) 
VALUES (
  'arun', 
  crypt('7299981628', gen_salt('bf', 12)),
  'arunkumark1664@gmail.com', 
  'Arun Kumar', 
  'admin'
) ON CONFLICT (username) DO UPDATE SET
  password_hash = crypt('7299981628', gen_salt('bf', 12)),
  email = 'arunkumark1664@gmail.com',
  full_name = 'Arun Kumar',
  role = 'admin';

-- Verify users created
SELECT 
  username,
  email,
  full_name,
  role,
  CASE 
    WHEN password_hash LIKE '$2a$%' THEN '✅ Properly hashed'
    ELSE '❌ Hash issue'
  END as password_status
FROM users
ORDER BY username;
