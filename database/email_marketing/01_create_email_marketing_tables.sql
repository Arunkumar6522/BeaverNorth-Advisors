-- Email Marketing Database Schema

-- Unsubscribers table
CREATE TABLE IF NOT EXISTS email_unsubscribers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  name TEXT,
  category_id TEXT,
  category_name TEXT,
  unsubscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  reason TEXT,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Email campaigns table
CREATE TABLE IF NOT EXISTS email_campaigns (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  template_id TEXT NOT NULL,
  template_name TEXT NOT NULL,
  category_id TEXT NOT NULL,
  category_name TEXT NOT NULL,
  recipient_count INTEGER NOT NULL,
  sent_count INTEGER DEFAULT 0,
  delivered_count INTEGER DEFAULT 0,
  opened_count INTEGER DEFAULT 0,
  clicked_count INTEGER DEFAULT 0,
  failed_count INTEGER DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending', -- pending, sending, sent, scheduled, failed
  scheduled_for TIMESTAMP WITH TIME ZONE,
  sent_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by TEXT
);

-- Email campaign recipients table
CREATE TABLE IF NOT EXISTS email_campaign_recipients (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  campaign_id UUID REFERENCES email_campaigns(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  name TEXT,
  status TEXT NOT NULL DEFAULT 'pending', -- pending, sent, delivered, opened, clicked, failed, bounced, unsubscribed
  sent_at TIMESTAMP WITH TIME ZONE,
  delivered_at TIMESTAMP WITH TIME ZONE,
  opened_at TIMESTAMP WITH TIME ZONE,
  clicked_at TIMESTAMP WITH TIME ZONE,
  failed_at TIMESTAMP WITH TIME ZONE,
  failure_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Email templates table
CREATE TABLE IF NOT EXISTS email_templates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by TEXT
);

-- Email categories table
CREATE TABLE IF NOT EXISTS email_categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Email contacts table
CREATE TABLE IF NOT EXISTS email_contacts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category_id UUID REFERENCES email_categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(category_id, email)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_unsubscribers_email ON email_unsubscribers(email);
CREATE INDEX IF NOT EXISTS idx_campaigns_status ON email_campaigns(status);
CREATE INDEX IF NOT EXISTS idx_campaigns_scheduled ON email_campaigns(scheduled_for);
CREATE INDEX IF NOT EXISTS idx_recipients_campaign ON email_campaign_recipients(campaign_id);
CREATE INDEX IF NOT EXISTS idx_recipients_email ON email_campaign_recipients(email);
CREATE INDEX IF NOT EXISTS idx_recipients_status ON email_campaign_recipients(status);
CREATE INDEX IF NOT EXISTS idx_contacts_category ON email_contacts(category_id);
CREATE INDEX IF NOT EXISTS idx_contacts_email ON email_contacts(email);

-- RLS Policies (if using RLS)
ALTER TABLE email_unsubscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_campaign_recipients ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_contacts ENABLE ROW LEVEL SECURITY;

-- Policy: Allow all operations for authenticated users (adjust based on your auth setup)
CREATE POLICY "Allow all for authenticated users" ON email_unsubscribers FOR ALL USING (true);
CREATE POLICY "Allow all for authenticated users" ON email_campaigns FOR ALL USING (true);
CREATE POLICY "Allow all for authenticated users" ON email_campaign_recipients FOR ALL USING (true);
CREATE POLICY "Allow all for authenticated users" ON email_templates FOR ALL USING (true);
CREATE POLICY "Allow all for authenticated users" ON email_categories FOR ALL USING (true);
CREATE POLICY "Allow all for authenticated users" ON email_contacts FOR ALL USING (true);

-- Policy: Allow public unsubscribe (no auth required)
CREATE POLICY "Allow public unsubscribe" ON email_unsubscribers FOR INSERT WITH CHECK (true);
