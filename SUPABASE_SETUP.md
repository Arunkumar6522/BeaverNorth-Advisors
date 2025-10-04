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

---

## Update Leads Table - Add Missing Columns

### Add Gender Column

Run this SQL in Supabase SQL Editor:

```sql
-- Add gender column to leads table
ALTER TABLE leads ADD COLUMN IF NOT EXISTS gender TEXT;

-- Add a check constraint to ensure valid gender values
ALTER TABLE leads ADD CONSTRAINT leads_gender_check 
  CHECK (gender IN ('male', 'female', 'others', 'prefer-not-to-say') OR gender IS NULL);

-- Add a comment to document the column
COMMENT ON COLUMN leads.gender IS 'Gender of the lead: male, female, others, prefer-not-to-say, or null';

-- Optional: Add an index for faster gender-based queries (for analytics)
CREATE INDEX IF NOT EXISTS idx_leads_gender ON leads(gender);
```

### Add Referral Code Column

Run this SQL in Supabase SQL Editor:

```sql
-- Add referral_code column to leads table
ALTER TABLE leads ADD COLUMN IF NOT EXISTS referral_code TEXT;

-- Optional: Add an index for faster referral code lookups
CREATE INDEX IF NOT EXISTS idx_leads_referral_code ON leads(referral_code);

-- Add a comment to document the column
COMMENT ON COLUMN leads.referral_code IS 'Optional referral code provided by the lead';
```

### Verify Columns

After running the above SQL, verify the columns exist:

```sql
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'leads'
ORDER BY ordinal_position;
```

You should see both `gender` and `referral_code` columns in the results.
