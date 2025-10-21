-- DELETE ONLY USER ENTRIES (KEEP TABLE STRUCTURE)
-- ⚠️ WARNING: This will delete ALL user data but keep the table!
-- Run this in Supabase SQL Editor

-- 1. Delete all users
DELETE FROM users;

-- 2. Reset the sequence (so new IDs start from 1)
ALTER SEQUENCE users_id_seq RESTART WITH 1;

-- 3. Insert fresh admin user
INSERT INTO users (username, password_hash, email, full_name, role) 
VALUES (
  'admin', 
  crypt('admin123', gen_salt('bf', 12)),
  'admin@beavernorth.com', 
  'Administrator', 
  'admin'
);

-- 4. Insert your user
INSERT INTO users (username, password_hash, email, full_name, role) 
VALUES (
  'arunkumar', 
  crypt('admin123', gen_salt('bf', 12)),
  'arunkumark1664@gmail.com', 
  'Arun Kumar', 
  'admin'
);

-- 5. Verify the cleanup
SELECT 
  'Users Deleted and Recreated' as status,
  COUNT(*) as user_count,
  'Only admin and your user remain' as message
FROM users;
