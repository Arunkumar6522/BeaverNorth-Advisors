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
    const { to, serviceSid } = JSON.parse(event.body);
    
    console.log('📱 Sending OTP to:', to);
    
    // Demo mode - return success without actually sending
    console.log('🔧 Demo mode: Simulating OTP send to', to);
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
