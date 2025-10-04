// Direct SQL execution script to create activity_log table
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://dkaexqwgalswfiuqicml.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRrYWV4cXdnYXNsd2ZpdWlxY21sIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTUxNDkyOCwiZXhwIjoyMDc1MDkwOTI4fQ.HHuLb_9rFpnLxeG9tuuyrVptUb8OXkKLunEjtR5JpIc'

const supabase = createClient(supabaseUrl, supabaseKey)

async function createActivityLogTable() {
  try {
    console.log('🔧 Creating activity_log table using direct SQL...')
    
    // First, let's try to create the table using a direct SQL query
    const createTableSQL = `
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
    `
    
    console.log('📝 Executing CREATE TABLE...')
    
    // Try using rpc with exec_sql if available
    const { data: createData, error: createError } = await supabase.rpc('exec_sql', {
      sql: createTableSQL
    })
    
    if (createError) {
      console.log('❌ RPC method failed:', createError.message)
      console.log('📝 Trying alternative method...')
      
      // Alternative: Try to insert a test record to see if table exists
      const { data: testData, error: testError } = await supabase
        .from('activity_log')
        .select('*')
        .limit(1)
      
      if (testError && testError.message.includes('does not exist')) {
        console.log('🚨 CONFIRMED: activity_log table does not exist!')
        console.log('📋 You MUST run the SQL script manually in Supabase SQL Editor')
        console.log('')
        console.log('🔗 Go to: https://supabase.com/dashboard/project/dkaexqwgalswfiuqicml/sql')
        console.log('')
        console.log('📝 Copy and paste this SQL:')
        console.log('========================================')
        console.log(createTableSQL)
        console.log('')
        console.log('CREATE INDEX IF NOT EXISTS idx_activity_log_created_at ON activity_log(created_at DESC);')
        console.log('CREATE INDEX IF NOT EXISTS idx_activity_log_lead_id ON activity_log(lead_id);')
        console.log('CREATE INDEX IF NOT EXISTS idx_activity_log_type ON activity_log(activity_type);')
        console.log('')
        console.log('ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;')
        console.log('')
        console.log('CREATE POLICY "Allow all operations on activity_log" ON activity_log')
        console.log('  FOR ALL')
        console.log('  TO public')
        console.log('  USING (true)')
        console.log('  WITH CHECK (true);')
        console.log('========================================')
        return
      }
    }
    
    console.log('✅ Table creation attempted')
    
    // Test if table exists now
    const { data: testData, error: testError } = await supabase
      .from('activity_log')
      .select('*')
      .limit(1)
    
    if (testError) {
      console.log('❌ Table still does not exist:', testError.message)
      console.log('📋 Manual setup required - see instructions above')
    } else {
      console.log('✅ activity_log table exists and is accessible!')
      console.log('📊 Current records:', testData)
    }
    
  } catch (error) {
    console.error('❌ Error:', error)
    console.log('📋 Manual setup required in Supabase SQL Editor')
  }
}

createActivityLogTable()
