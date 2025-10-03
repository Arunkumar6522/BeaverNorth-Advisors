# Supabase Setup Instructions

## Create Users Table

1. **Go to your Supabase Dashboard**: https://supabase.com/dashboard
2. **Navigate to SQL Editor**
3. **Run the following SQL script** (copy from `/Users/art/projects/BeaverNorth-Advisors/sql/setup.sql`):

```sql
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

-- Insert a sample admin user (username: admin, password: admin123)
INSERT INTO users (username, password_hash, email, full_name, role) 
VALUES (
  'admin', 
  '$2a$10$rOiKGJr1FJP9LjDfLkzHNuE8CQVJVK5FdXQ5vYHn6zWGm9Vj8S9O2',  -- 'admin123' 
  'admin@beavernorth.com', 
  'Administrator', 
  'admin'
) ON CONFLICT (username) DO NOTHING;
```

## Test Credentials

- **Username**: `admin`
- **Password**: `admin123`

## How Authentication Works

1. User enters username/password on `/login`
2. System checks against your Supabase users table
3. On successful login → redirects to `/dashboard`
4. Dashboard shows "Welcome, Administrator" (or other users)
5. Session stored in localStorage for persistence

## Add More Users

To add more users, run:

```sql
INSERT INTO users (username, password_hash, email, full_name, role) 
VALUES ('your_username', 'password_hash', 'email@domain.com', 'Full Name', 'user');
```

**Note**: Replace `password_hash` with actual bcrypt hash of the password.
