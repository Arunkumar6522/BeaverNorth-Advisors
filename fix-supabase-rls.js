#!/usr/bin/env node

/**
 * Automated Supabase RLS Fix Script
 * This script will disable RLS on the leads table to allow form submissions
 */

const https = require('https');

// Supabase Configuration
const SUPABASE_URL = 'https://dkaexqwgaslwfiuiqcml.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'YOUR_SERVICE_ROLE_KEY_HERE';

// SQL to disable RLS on leads table
const SQL_QUERY = `ALTER TABLE leads DISABLE ROW LEVEL SECURITY;`;

console.log('🔧 Supabase RLS Fix Script');
console.log('============================\n');

if (SUPABASE_SERVICE_ROLE_KEY === 'YOUR_SERVICE_ROLE_KEY_HERE') {
  console.error('❌ ERROR: Service Role Key not provided!');
  console.log('\n📋 How to use this script:\n');
  console.log('Option 1: Set environment variable:');
  console.log('  export SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"');
  console.log('  node fix-supabase-rls.js\n');
  console.log('Option 2: Edit this file and replace YOUR_SERVICE_ROLE_KEY_HERE with your actual key\n');
  console.log('🔑 Get your Service Role Key from:');
  console.log('  https://supabase.com/dashboard/project/dkaexqwgaslwfiuiqcml/settings/api\n');
  process.exit(1);
}

// Prepare the request
const postData = JSON.stringify({
  query: SQL_QUERY
});

const options = {
  hostname: 'dkaexqwgaslwfiuiqcml.supabase.co',
  port: 443,
  path: '/rest/v1/rpc/exec_sql',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData),
    'apikey': SUPABASE_SERVICE_ROLE_KEY,
    'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
    'Prefer': 'return=minimal'
  }
};

console.log('🔗 Connecting to Supabase...');
console.log(`📡 URL: ${SUPABASE_URL}`);
console.log('📝 Executing SQL: ALTER TABLE leads DISABLE ROW LEVEL SECURITY;\n');

const req = https.request(options, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    console.log(`📊 Response Status: ${res.statusCode}\n`);
    
    if (res.statusCode === 200 || res.statusCode === 201 || res.statusCode === 204) {
      console.log('✅ SUCCESS! RLS has been disabled on leads table!');
      console.log('✅ Your form submissions should now work!\n');
      console.log('🧪 Test it now:');
      console.log('  1. Go to: https://beavernorth.netlify.app');
      console.log('  2. Click "Get Your Free Quote"');
      console.log('  3. Fill and submit the form');
      console.log('  4. It should work! 🎉\n');
    } else {
      console.error('❌ ERROR: Failed to execute SQL');
      console.error(`Status: ${res.statusCode}`);
      console.error(`Response: ${data}\n`);
      console.log('💡 Alternative approach:');
      console.log('  Go to: https://supabase.com/dashboard/project/dkaexqwgaslwfiuiqcml/sql');
      console.log('  Run: ALTER TABLE leads DISABLE ROW LEVEL SECURITY;');
    }
  });
});

req.on('error', (error) => {
  console.error('❌ Connection Error:', error.message);
  console.log('\n💡 Manual fix:');
  console.log('  1. Go to: https://supabase.com/dashboard/project/dkaexqwgaslwfiuiqcml/sql');
  console.log('  2. Run: ALTER TABLE leads DISABLE ROW LEVEL SECURITY;');
});

req.write(postData);
req.end();

