const twilio = require('twilio');

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
    const { to } = JSON.parse(event.body);
    
    console.log('📱 Sending OTP to:', to);
    
    const twilioAccountSid = process.env.TWILIO_ACCOUNT_SID;
    const twilioAuthToken = process.env.TWILIO_AUTH_TOKEN;
    const twilioServiceSid = process.env.TWILIO_SERVICE_SID;
    
    // Check if Twilio credentials are properly configured
    if (!twilioAccountSid || !twilioAuthToken || !twilioServiceSid || 
        !twilioAccountSid.startsWith('AC') || !twilioServiceSid.startsWith('VA')) {
      console.log('🔧 Demo mode: Twilio credentials not properly configured');
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          message: 'OTP sent successfully (Demo Mode)',
          verificationSid: 'demo_verification_sid',
          to: to
        })
      };
    }
    
    // Initialize Twilio client with real credentials
    const client = twilio(twilioAccountSid, twilioAuthToken);
    
    // Send verification SMS
    const verification = await client.verify.v2
      .services(twilioServiceSid)
      .verifications
      .create({ to: to, channel: 'sms' });
    
    console.log('✅ Twilio verification sent:', verification.sid);
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: 'OTP sent successfully',
        verificationSid: verification.sid,
        to: to
      })
    };
    
  } catch (error) {
    console.error('❌ Twilio OTP error:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        message: `Failed to send OTP: ${error.message}`,
        error: error.message
      })
    };
  }
};
