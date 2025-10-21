-- STEP 3: Update admin user password and create audit logging

-- First, check if password_hash column exists, if not create it
DO $$
BEGIN
    -- Check if password_hash column exists
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'password_hash'
    ) THEN
        -- Add password_hash column if it doesn't exist
        ALTER TABLE users ADD COLUMN password_hash TEXT;
        
        -- If there's a 'password' column, migrate data to password_hash
        IF EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'users' AND column_name = 'password'
        ) THEN
            -- Migrate existing passwords to password_hash
            UPDATE users 
            SET password_hash = crypt(password, gen_salt('bf', 12))
            WHERE password IS NOT NULL;
            
            -- Drop the old password column
            ALTER TABLE users DROP COLUMN password;
        END IF;
    END IF;
END $$;

-- Update the existing admin user to use proper password hash
UPDATE users 
SET password_hash = crypt('admin123', gen_salt('bf', 12))
WHERE username = 'admin';

-- Create audit logging table for login attempts
CREATE TABLE IF NOT EXISTS login_attempts (
  id SERIAL PRIMARY KEY,
  username TEXT,
  ip_address TEXT,
  success BOOLEAN,
  attempted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on login_attempts
ALTER TABLE login_attempts ENABLE ROW LEVEL SECURITY;

-- Policy for login attempts (only service role can insert)
CREATE POLICY "Service role can log attempts" ON login_attempts
  FOR ALL
  TO service_role
  USING (true);

-- Verify the setup
SELECT 
  schemaname,
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables 
WHERE tablename IN ('users', 'login_attempts');
