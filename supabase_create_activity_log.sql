-- ============================================
-- CREATE ACTIVITY LOG TABLE FOR DASHBOARD
-- ============================================

-- Create activity_log table
CREATE TABLE IF NOT EXISTS activity_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
  activity_type TEXT NOT NULL CHECK (activity_type IN ('lead_created', 'status_changed', 'lead_deleted', 'lead_updated', 'contact_made')),
  description TEXT NOT NULL,
  old_value TEXT,
  new_value TEXT,
  performed_by TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_activity_log_created_at ON activity_log(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_activity_log_lead_id ON activity_log(lead_id);
CREATE INDEX IF NOT EXISTS idx_activity_log_type ON activity_log(activity_type);

-- Enable RLS
ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to read activity log
CREATE POLICY "Allow authenticated users to read activity log" ON activity_log
  FOR SELECT
  TO authenticated
  USING (true);

-- Allow authenticated users to insert activity log
CREATE POLICY "Allow authenticated users to insert activity log" ON activity_log
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Create function to auto-log lead creation
CREATE OR REPLACE FUNCTION log_lead_creation()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO activity_log (lead_id, activity_type, description, new_value, performed_by)
  VALUES (
    NEW.id,
    'lead_created',
    'New lead submitted: ' || NEW.name,
    NEW.insurance_product,
    'System'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for lead creation
DROP TRIGGER IF EXISTS trigger_log_lead_creation ON leads;
CREATE TRIGGER trigger_log_lead_creation
  AFTER INSERT ON leads
  FOR EACH ROW
  EXECUTE FUNCTION log_lead_creation();

-- Create function to auto-log status changes
CREATE OR REPLACE FUNCTION log_status_change()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO activity_log (lead_id, activity_type, description, old_value, new_value, performed_by)
    VALUES (
      NEW.id,
      'status_changed',
      'Status changed for ' || NEW.name || ': ' || OLD.status || ' → ' || NEW.status,
      OLD.status,
      NEW.status,
      COALESCE(current_setting('app.current_user', true), 'System')
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for status changes
DROP TRIGGER IF EXISTS trigger_log_status_change ON leads;
CREATE TRIGGER trigger_log_status_change
  AFTER UPDATE ON leads
  FOR EACH ROW
  WHEN (OLD.status IS DISTINCT FROM NEW.status)
  EXECUTE FUNCTION log_status_change();

-- Create function to auto-log lead deletion
CREATE OR REPLACE FUNCTION log_lead_deletion()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.deleted_at IS NULL AND NEW.deleted_at IS NOT NULL THEN
    INSERT INTO activity_log (lead_id, activity_type, description, old_value, new_value, performed_by)
    VALUES (
      NEW.id,
      'lead_deleted',
      'Lead deleted: ' || NEW.name,
      'active',
      'deleted',
      COALESCE(current_setting('app.current_user', true), 'Admin')
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for lead deletion
DROP TRIGGER IF EXISTS trigger_log_lead_deletion ON leads;
CREATE TRIGGER trigger_log_lead_deletion
  AFTER UPDATE ON leads
  FOR EACH ROW
  WHEN (OLD.deleted_at IS NULL AND NEW.deleted_at IS NOT NULL)
  EXECUTE FUNCTION log_lead_deletion();

-- Add comment
COMMENT ON TABLE activity_log IS 'Tracks all lead-related activities for dashboard';

