-- Create notification_settings table
CREATE TABLE IF NOT EXISTS public.notification_settings (
    id SERIAL PRIMARY KEY,
    type VARCHAR(20) NOT NULL CHECK (type IN ('email', 'phone')),
    value VARCHAR(255) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_notification_settings_type ON public.notification_settings(type);
CREATE INDEX IF NOT EXISTS idx_notification_settings_active ON public.notification_settings(is_active);

-- Enable RLS
ALTER TABLE public.notification_settings ENABLE ROW LEVEL SECURITY;

-- Create RLS policy for authenticated users
CREATE POLICY "Authenticated users can manage notification settings" ON public.notification_settings
    FOR ALL USING (auth.role() = 'authenticated');

-- Insert default notification settings
INSERT INTO public.notification_settings (type, value, is_active) VALUES
    ('email', 'beavernorthadvisors@gmail.com', true)
ON CONFLICT DO NOTHING;

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_notification_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
CREATE TRIGGER trigger_update_notification_settings_updated_at
    BEFORE UPDATE ON public.notification_settings
    FOR EACH ROW
    EXECUTE FUNCTION update_notification_settings_updated_at();

-- Grant permissions
GRANT ALL ON public.notification_settings TO authenticated;
GRANT USAGE, SELECT ON SEQUENCE public.notification_settings_id_seq TO authenticated;
