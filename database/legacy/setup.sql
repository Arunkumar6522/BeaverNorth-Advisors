-- Create users table for custom authentication
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  email TEXT UNIQUE,
  full_name TEXT,
  role TEXT DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS (Row Level Security)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anonymous users to authenticate (login)
CREATE POLICY "Allow login access" ON users
  FOR SELECT
  TO anon
  USING (true);

-- Create policy to allow authenticated users to see their own data
CREATE POLICY "Users see own data" ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid()::text = username);

-- Insert a sample admin user (password: admin123)
-- You should change this password! 
INSERT INTO users (username, password_hash, email, full_name, role) 
VALUES (
  'admin', 
  '$2a$10$rOiKGJr1FJP9LjDfLkzHNuE8CQVJVK5FdXQ5vYHn6zWGm9Vj8S9O2',  -- 'admin123' 
  'admin@beavernorth.com', 
  'Administrator', 
  'admin'
) ON CONFLICT (username) DO NOTHING;

-- Create a function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to auto-update updated_at
CREATE TRIGGER update_users_updated_at 
  BEFORE UPDATE ON users 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();
