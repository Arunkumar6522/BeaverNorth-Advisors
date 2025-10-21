-- Fix RLS policy for notification_settings table
-- Drop existing policy if it exists
DROP POLICY IF EXISTS "Authenticated users can manage notification settings" ON public.notification_settings;

-- Create a more permissive policy for authenticated users
CREATE POLICY "Enable all operations for authenticated users" ON public.notification_settings
    FOR ALL USING (auth.role() = 'authenticated');

-- Alternative: If the above doesn't work, try this more permissive policy
-- CREATE POLICY "Enable all operations for authenticated users" ON public.notification_settings
--     FOR ALL USING (true);

-- Grant additional permissions
GRANT ALL ON public.notification_settings TO authenticated;
GRANT USAGE, SELECT ON SEQUENCE public.notification_settings_id_seq TO authenticated;

-- Verify the table exists and has data
SELECT * FROM public.notification_settings;
