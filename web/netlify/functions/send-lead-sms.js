const twilio = require('twilio');
const { createClient } = require('@supabase/supabase-js');

exports.handler = async (event, context) => {
  // Enable CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  try {
    const { leadData } = JSON.parse(event.body);
    
    console.log('📱 Sending lead notification SMS for:', leadData.name);
    
    // Twilio configuration from environment variables (same as OTP)
    const twilioAccountSid = process.env.TWILIO_ACCOUNT_SID;
    const twilioAuthToken = process.env.TWILIO_AUTH_TOKEN;
    const twilioServiceSid = process.env.TWILIO_SERVICE_SID;
    
    // Check if Twilio credentials are properly configured
    if (!twilioAccountSid || !twilioAuthToken || 
        twilioAccountSid === 'YOUR_TWILIO_ACCOUNT_SID' || 
        twilioAuthToken === 'YOUR_TWILIO_AUTH_TOKEN') {
      console.log('🔧 Demo mode: Twilio credentials not properly configured');
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          message: 'Lead notification SMS sent successfully (Demo Mode)',
          leadName: leadData.name
        })
      };
    }
    
    // Initialize Twilio client (same as OTP setup)
    const client = twilio(twilioAccountSid, twilioAuthToken);
    
    // Create SMS message
    const smsMessage = `🎯 NEW LEAD ALERT - BeaverNorth Advisors

Name: ${leadData.name || 'Not provided'}
Email: ${leadData.email || 'Not provided'}
Phone: ${leadData.phone || 'Not provided'}
Insurance: ${leadData.insuranceProduct || 'Not provided'}
Province: ${leadData.province || 'Not provided'}

Please check the dashboard for full details.
Time: ${new Date().toLocaleString()}`;
    
    // Get phone numbers from database
    let phoneNumbers = [];
    try {
      const supabaseUrl = process.env.VITE_SUPABASE_URL;
      const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
      
      if (supabaseUrl && supabaseKey) {
        const supabase = createClient(supabaseUrl, supabaseKey);
        
        const { data: phoneSettings, error } = await supabase
          .from('notification_settings')
          .select('value')
          .eq('type', 'phone')
          .eq('is_active', true);
        
        if (!error && phoneSettings && phoneSettings.length > 0) {
          phoneNumbers = phoneSettings.map(setting => setting.value);
          console.log('📱 Sending SMS to configured numbers:', phoneNumbers);
        } else {
          console.log('⚠️ No active phone numbers found in database');
          return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
              success: true,
              message: 'No active phone numbers configured for SMS notifications',
              leadName: leadData.name
            })
          };
        }
      }
    } catch (dbError) {
      console.log('⚠️ Could not fetch phone numbers from database:', dbError.message);
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          message: 'Could not fetch phone numbers for SMS notifications',
          leadName: leadData.name
        })
      };
    }
    
    // Send SMS to all configured phone numbers
    const smsResults = [];
    for (const phoneNumber of phoneNumbers) {
      try {
        // Use Twilio's messaging API (not verification service)
        const message = await client.messages.create({
          body: smsMessage,
          from: process.env.VITE_TWILIO_FROM_NUMBER || '+15551234567', // Use your Twilio phone number
          to: phoneNumber
        });
        
        console.log(`✅ SMS sent to ${phoneNumber}:`, message.sid);
        smsResults.push({
          phoneNumber,
          messageId: message.sid,
          status: 'sent'
        });
      } catch (smsError) {
        console.error(`❌ Failed to send SMS to ${phoneNumber}:`, smsError.message);
        smsResults.push({
          phoneNumber,
          error: smsError.message,
          status: 'failed'
        });
      }
    }
    
    const successCount = smsResults.filter(result => result.status === 'sent').length;
    const failureCount = smsResults.filter(result => result.status === 'failed').length;
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: `SMS notifications sent: ${successCount} successful, ${failureCount} failed`,
        leadName: leadData.name,
        results: smsResults
      })
    };
    
  } catch (error) {
    console.error('❌ SMS notification error:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        message: `Failed to send SMS notifications: ${error.message}`,
        error: error.message
      })
    };
  }
};
