// Test script to check and create activity_log table
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://dkaexqwgalswfiuqicml.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRrYWV4cXdnYXNsd2ZpdWlxY21sIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTUxNDkyOCwiZXhwIjoyMDc1MDkwOTI4fQ.HHuLb_9rFpnLxeG9tuuyrVptUb8OXkKLunEjtR5JpIc'

const supabase = createClient(supabaseUrl, supabaseKey)

async function testActivityLog() {
  try {
    console.log('🔍 Checking if activity_log table exists...')
    
    // Try to query the activity_log table
    const { data, error } = await supabase
      .from('activity_log')
      .select('*')
      .limit(1)
    
    if (error) {
      console.log('❌ activity_log table does not exist:', error.message)
      console.log('📝 You need to run the SQL script in Supabase SQL Editor')
      return
    }
    
    console.log('✅ activity_log table exists!')
    console.log('📊 Current activity logs:', data)
    
  } catch (error) {
    console.error('❌ Error testing activity_log:', error)
  }
}

testActivityLog()
