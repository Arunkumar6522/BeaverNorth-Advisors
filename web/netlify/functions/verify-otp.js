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
    const { to, code } = JSON.parse(event.body);
    
    console.log('🔐 Verifying OTP:', code, 'for:', to);
    
    const twilioAccountSid = process.env.TWILIO_ACCOUNT_SID;
    const twilioAuthToken = process.env.TWILIO_AUTH_TOKEN;
    const twilioServiceSid = process.env.TWILIO_SERVICE_SID;
    
    // Check if Twilio credentials are properly configured
    if (!twilioAccountSid || !twilioAuthToken || !twilioServiceSid || 
        !twilioAccountSid.startsWith('AC') || !twilioServiceSid.startsWith('VA')) {
      console.log('🔧 Demo mode: Twilio credentials not properly configured');
      // Demo mode - accept any 6-digit code
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
    }
    
    // Initialize Twilio client with real credentials
    const client = twilio(twilioAccountSid, twilioAuthToken);
    
    // Verify the OTP code
    const verificationCheck = await client.verify.v2
      .services(twilioServiceSid)
      .verificationChecks
      .create({ to: to, code: code });
    
    console.log('📋 Twilio verification result:', verificationCheck.status);
    
    if (verificationCheck.status === 'approved') {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          message: 'OTP verified successfully',
          status: verificationCheck.status
        })
      };
    } else {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: false,
          message: 'Invalid OTP code. Please try again.',
          status: verificationCheck.status
        })
      };
    }
    
  } catch (error) {
    console.error('❌ Twilio verification error:', error);
    
    // Check for specific error types
    let errorMessage = `Verification failed: ${error.message}`;
    
    if (error.message && error.message.includes('not found')) {
      errorMessage = 'Verification service not found. Please check your Twilio Service SID configuration.';
    } else if (error.status === 404) {
      errorMessage = 'Verification service not found. The Service SID may be incorrect or the verification was not created.';
    } else if (error.code === 20404) {
      errorMessage = 'Verification not found. Please request a new verification code.';
    }
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        message: errorMessage,
        error: error.message,
        code: error.code,
        status: error.status
      })
    };
  }
};
