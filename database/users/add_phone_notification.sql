-- Add phone number for SMS notifications
-- Replace +1234567890 with your actual phone number

INSERT INTO public.notification_settings (type, value, is_active) VALUES
    ('phone', '+1234567890', true)
ON CONFLICT DO NOTHING;

-- Verify the phone number was added
SELECT * FROM public.notification_settings WHERE type = 'phone';
