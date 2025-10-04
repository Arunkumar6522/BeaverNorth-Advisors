# Setup Activity Log for Recent Lead Activity

## 🚨 **IMPORTANT: You need to run this SQL script in Supabase first!**

### Step 1: Go to Supabase SQL Editor
1. Open your Supabase dashboard: https://supabase.com/dashboard
2. Go to your project: `dkaexqwgalswfiuqicml`
3. Click on "SQL Editor" in the left sidebar

### Step 2: Run This SQL Script
Copy and paste this entire script into the SQL Editor and click "Run":

```sql
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

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_activity_log_created_at ON activity_log(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_activity_log_lead_id ON activity_log(lead_id);
CREATE INDEX IF NOT EXISTS idx_activity_log_type ON activity_log(activity_type);

-- Enable Row Level Security
ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;

-- Create permissive policy (allows all operations)
CREATE POLICY "Allow all operations on activity_log" ON activity_log
  FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

-- Add comment
COMMENT ON TABLE activity_log IS 'Tracks all lead-related activities for dashboard';
```

### Step 3: Verify the Table Was Created
After running the SQL, you should see:
- ✅ Table `activity_log` created
- ✅ Indexes created
- ✅ RLS enabled
- ✅ Policy created

### Step 4: Test the Activity Logging
1. Go to your website: https://beavernorth.netlify.app
2. Submit a new lead via the contact form
3. Go to dashboard and check "Recent Lead Activity"
4. Change a lead status in Leads Management
5. Delete a lead in Leads Management
6. All activities should now appear in the dashboard!

## 🔧 **If You Still Don't See Activities:**

1. **Check Browser Console** (F12) for any errors
2. **Check Supabase Logs** in your dashboard
3. **Verify the table exists** by running: `SELECT * FROM activity_log LIMIT 5;`

## 📊 **What You Should See:**

- **New Lead**: "New lead submitted: [Name]"
- **Status Change**: "Status changed for [Name]: new → contacted"
- **Lead Deletion**: "Lead deleted: [Name]"

---

**Once you run this SQL script, the recent lead activity will work perfectly!** 🎯
