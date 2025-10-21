-- Supabase leads management schema - FIXED VERSION
-- Run this in your Supabase SQL Editor

-- Create leads table
CREATE TABLE IF NOT EXISTS leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- Basic Information
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  dob DATE NOT NULL,
  
  -- Location
  province TEXT NOT NULL,
  country_code TEXT DEFAULT '+1',
  
  -- Insurance Preferences
  smoking_status TEXT NOT NULL CHECK (smoking_status IN ('smoker', 'non-smoker')),
  insurance_product TEXT NOT NULL CHECK (insurance_product IN (
    'term-life', 'whole-life', 'non-medical', 'mortgage-life', 'senior-life', 'travel'
  )),
  
  -- Lead Status
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'converted')),
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  contacted_at TIMESTAMP WITH TIME ZONE,
  converted_at TIMESTAMP WITH TIME ZONE,
  
  -- Notes (optional)
  notes TEXT,
  
  -- Contact tracking
  contact_attempts INTEGER DEFAULT 0,
  last_contact_date TIMESTAMP WITH TIME ZONE
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at);
CREATE INDEX IF NOT EXISTS idx_leads_province ON leads(province);

-- Row Level Security (RLS)
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Create policy to allow authenticated users to read/write leads
CREATE POLICY "Allow authenticated users to manage leads" ON leads
  FOR ALL USING (auth.uid() IS NOT NULL);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_leads_updated_at BEFORE UPDATE ON leads
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data for testing
INSERT INTO leads (name, email, phone, dob, province, smoking_status, insurance_product, status) VALUES
  ('John Smith', 'john@example.com', '+15551234567', '1985-03-15', 'Ontario', 'non-smoker', 'term-life', 'new'),
  ('Sarah Johnson', 'sarah@example.com', '+15551234568', '1990-07-22', 'British Columbia', 'smoker', 'whole-life', 'contacted'),
  ('Michael Brown', 'michael@example.com', '+15551234569', '1978-11-08', 'Quebec', 'non-smoker', 'mortgage-life', 'converted'),
  ('Emily Davis', 'emily@example.com', '+15551234570', '1995-05-14', 'Alberta', 'non-smoker', 'travel', 'new'),
  ('David Wilson', 'david@example.com', '+15551234571', '1982-09-30', 'Ontario', 'smoker', 'senior-life', 'contacted')
ON CONFLICT DO NOTHING;

-- Create leads_statistics view for dashboard
CREATE OR REPLACE VIEW leads_statistics AS
SELECT 
  COUNT(*) as total_leads,
  COUNT(CASE WHEN status = 'new' THEN 1 END) as new_leads,
  COUNT(CASE WHEN status = 'contacted' THEN 1 END) as contacted_leads,
  COUNT(CASE WHEN status = 'converted' THEN 1 END) as converted_leads,
  COUNT(CASE WHEN created_at >= DATE_TRUNC('month', NOW()) THEN 1 END) as monthly_leads
FROM leads;
