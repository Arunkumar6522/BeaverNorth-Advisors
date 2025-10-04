#!/usr/bin/env node

const https = require('https');

const SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRrYWV4cXdnYXNsd2ZpdWlxY21sIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTUxNDkyOCwiZXhwIjoyMDc1MDkwOTI4fQ.HHuLb_9rFpnLxeG9tuuyrVptUb8OXkKLunEjtR5JpIc";

console.log('🔧 Attempting to test lead insertion with service key...\n');

// Test data
const testLead = {
  name: "Test User",
  email: "test@example.com",
  phone: "+14385551234",
  dob: "1990-01-01",
  province: "Quebec",
  country_code: "+1",
  smoking_status: "non-smoker",
  insurance_product: "term-life",
  status: "new",
  gender: "male",
  referral_code: null
};

const postData = JSON.stringify(testLead);

const options = {
  hostname: 'dkaexqwgaslwfiuiqcml.supabase.co',
  port: 443,
  path: '/rest/v1/leads',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'apikey': SERVICE_KEY,
    'Authorization': `Bearer ${SERVICE_KEY}`,
    'Prefer': 'return=representation'
  }
};

console.log('📤 Attempting to insert test lead using service_role key...');

const req = https.request(options, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    console.log(`\n📊 Response Status: ${res.statusCode}`);
    
    if (res.statusCode === 201) {
      console.log('✅ SUCCESS! Lead inserted successfully!');
      console.log('✅ This means RLS can be bypassed with service_role key!');
      console.log('\n📋 Inserted data:', JSON.parse(data));
      console.log('\n💡 SOLUTION: Update your frontend to use service_role key');
      console.log('⚠️  WARNING: This is NOT recommended for production!');
      console.log('⚠️  You MUST fix RLS policies in Supabase SQL Editor\n');
    } else {
      console.error('❌ Still failing with service_role key');
      console.error(`Response: ${data}`);
      console.log('\n🔴 You MUST go to SQL Editor and run:');
      console.log('   ALTER TABLE leads DISABLE ROW LEVEL SECURITY;\n');
    }
  });
});

req.on('error', (error) => {
  console.error('❌ Connection Error:', error.message);
});

req.write(postData);
req.end();

