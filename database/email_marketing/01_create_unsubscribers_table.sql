-- Create unsubscribers table for email marketing
CREATE TABLE IF NOT EXISTS email_unsubscribers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  name TEXT,
  category_id TEXT,
  category_name TEXT,
  unsubscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  reason TEXT,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on email for fast lookups
CREATE INDEX IF NOT EXISTS idx_email_unsubscribers_email ON email_unsubscribers(email);

-- Create index on unsubscribed_at for filtering
CREATE INDEX IF NOT EXISTS idx_email_unsubscribers_date ON email_unsubscribers(unsubscribed_at);

-- Add RLS policies
ALTER TABLE email_unsubscribers ENABLE ROW LEVEL SECURITY;

-- Policy: Allow authenticated users to view unsubscribers
CREATE POLICY "Users can view unsubscribers" ON email_unsubscribers
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- Policy: Allow public to insert (for unsubscribe API)
CREATE POLICY "Public can unsubscribe" ON email_unsubscribers
  FOR INSERT
  WITH CHECK (true);

-- Policy: Allow authenticated users to delete
CREATE POLICY "Users can delete unsubscribers" ON email_unsubscribers
  FOR DELETE
  USING (auth.role() = 'authenticated');
