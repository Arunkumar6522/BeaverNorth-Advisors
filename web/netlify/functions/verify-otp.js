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
    const { to, code, verificationSid } = JSON.parse(event.body);
    
    console.log('🔐 Verifying OTP:', code, 'for:', to);
    
    // Demo mode - accept any 6-digit code
    console.log('🔧 Demo mode: Simulating OTP verification');
    if (code && code.length === 6 && /^\d+$/.test(code)) {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          message: 'OTP verified successfully (Demo Mode)',
          status: 'approved'
        })
      };
    } else {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: false,
          message: 'Invalid OTP code (Demo Mode)',
          status: 'denied'
        })
      };
    }
    
  } catch (error) {
    console.error('❌ Twilio verification error:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        message: `Verification failed: ${error.message}`,
        error: error.message
      })
    };
  }
};
