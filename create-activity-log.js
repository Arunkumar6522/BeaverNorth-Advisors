// Script to create activity_log table
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://dkaexqwgalswfiuqicml.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRrYWV4cXdnYXNsd2ZpdWlxY21sIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTUxNDkyOCwiZXhwIjoyMDc1MDkwOTI4fQ.HHuLb_9rFpnLxeG9tuuyrVptUb8OXkKLunEjtR5JpIc'

const supabase = createClient(supabaseUrl, supabaseKey)

async function createActivityLogTable() {
  try {
    console.log('🔧 Creating activity_log table...')
    
    // Create the table using SQL
    const { data, error } = await supabase.rpc('exec_sql', {
      sql: `
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
        
        CREATE INDEX IF NOT EXISTS idx_activity_log_created_at ON activity_log(created_at DESC);
        CREATE INDEX IF NOT EXISTS idx_activity_log_lead_id ON activity_log(lead_id);
        CREATE INDEX IF NOT EXISTS idx_activity_log_type ON activity_log(activity_type);
        
        ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;
        
        CREATE POLICY "Allow all operations on activity_log" ON activity_log
          FOR ALL
          TO public
          USING (true)
          WITH CHECK (true);
      `
    })
    
    if (error) {
      console.log('❌ Error creating table:', error.message)
      console.log('📝 Please run the SQL script manually in Supabase SQL Editor')
      return
    }
    
    console.log('✅ activity_log table created successfully!')
    
    // Test the table
    const { data: testData, error: testError } = await supabase
      .from('activity_log')
      .select('*')
      .limit(1)
    
    if (testError) {
      console.log('❌ Error testing table:', testError.message)
    } else {
      console.log('✅ Table is working correctly!')
    }
    
  } catch (error) {
    console.error('❌ Error:', error)
    console.log('📝 Please run the SQL script manually in Supabase SQL Editor')
  }
}

createActivityLogTable()
