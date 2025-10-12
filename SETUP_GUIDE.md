# BeaverNorth Advisors - Setup Guide

## 🚀 Quick Start

### 1. Environment Setup

1. Copy `env.example` to `.env` in the `web/` directory
2. Fill in your actual credentials:

```bash
cp env.example .env
```

### 2. Required Services

#### Twilio Setup
1. Create a Twilio account at https://www.twilio.com
2. Get your Account SID, Auth Token, and Service SID
3. Add them to your `.env` file

#### Supabase Setup
1. Create a Supabase project at https://supabase.com
2. Get your project URL and anon key
3. Add them to your `.env` file

### 3. Database Setup

Run these SQL scripts in your Supabase SQL Editor:

```sql
-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  email TEXT UNIQUE,
  full_name TEXT,
  role TEXT DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create leads table
CREATE TABLE IF NOT EXISTS leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  dob DATE NOT NULL,
  province TEXT NOT NULL,
  country_code TEXT DEFAULT '+1',
  smoking_status TEXT NOT NULL,
  insurance_product TEXT NOT NULL,
  status TEXT DEFAULT 'new',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  notes TEXT,
  contacted_by TEXT,
  converted_by TEXT,
  created_by TEXT
);

-- Create activity_log table
CREATE TABLE IF NOT EXISTS activity_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
  activity_type TEXT NOT NULL,
  description TEXT NOT NULL,
  old_value TEXT,
  new_value TEXT,
  performed_by TEXT DEFAULT 'System',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert admin user
INSERT INTO users (username, password, email, full_name, role) 
VALUES ('admin', 'admin123', 'admin@beavernorth.com', 'Administrator', 'admin')
ON CONFLICT (username) DO NOTHING;
```

### 4. Run the Application

```bash
cd web
npm install
npm run dev:full
```

This will start:
- Frontend: http://localhost:5173
- Backend: http://localhost:3001

### 5. Default Login Credentials

- **Username**: `admin`
- **Password**: `admin123`

## 🔧 Features

- **OTP Verification**: SMS-based phone verification via Twilio
- **Lead Management**: Complete CRUD operations for leads
- **Admin Dashboard**: Analytics and lead tracking
- **Multi-language Support**: English/French
- **Responsive Design**: Works on all devices

## 📱 Testing OTP

1. Use a verified phone number in your Twilio account
2. Enter the phone number in the contact form
3. Click "Send OTP"
4. Check your phone for the SMS code
5. Enter the code to verify

## 🚀 Deployment

1. Build the application: `npm run build`
2. Deploy the `dist/` folder to your hosting provider
3. Set environment variables in your hosting platform
4. Ensure your backend server is running

## 📞 Support

For setup assistance, contact: beavernorthadvisors@gmail.com
