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
    // Validate request body
    if (!event.body) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          success: false,
          message: 'Request body is missing',
          error: 'Missing request body'
        })
      };
    }
    
    let bodyData;
    try {
      bodyData = JSON.parse(event.body);
    } catch (parseError) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          success: false,
          message: 'Invalid JSON in request body',
          error: parseError.message
        })
      };
    }
    
    const { to } = bodyData;
    
    if (!to) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          success: false,
          message: 'Phone number (to) is required',
          error: 'Missing phone number'
        })
      };
    }
    
    console.log('📱 Sending OTP to:', to);
    
    const twilioAccountSid = process.env.TWILIO_ACCOUNT_SID;
    const twilioAuthToken = process.env.TWILIO_AUTH_TOKEN;
    const twilioServiceSid = process.env.TWILIO_SERVICE_SID;
    
    // Check if Twilio credentials are properly configured
    const hasAccountSid = twilioAccountSid && twilioAccountSid.startsWith('AC');
    const hasAuthToken = !!twilioAuthToken;
    const hasServiceSid = twilioServiceSid && twilioServiceSid.startsWith('VA');
    
    if (!hasAccountSid || !hasAuthToken || !hasServiceSid) {
      console.log('🔧 Demo mode: Twilio credentials not properly configured');
      console.log('📋 Config check:', {
        hasAccountSid,
        hasAuthToken,
        hasServiceSid
      });
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
    console.error('❌ Error details:', {
      message: error.message,
      code: error.code,
      status: error.status,
      name: error.name,
      stack: error.stack
    });
    
    // Provide more specific error messages
    let errorMessage = 'Failed to send OTP. Please try again.';
    let errorDetails = error.message || 'Unknown error';
    
    if (error.code === 20404) {
      errorMessage = 'Twilio service not found. Please check your TWILIO_SERVICE_SID configuration.';
    } else if (error.code === 20003) {
      errorMessage = 'Twilio authentication failed. Please check your Twilio credentials.';
    } else if (error.message && error.message.includes('resource not found')) {
      errorMessage = 'Twilio service not found. Please verify your TWILIO_SERVICE_SID is correct.';
    } else if (error.message) {
      errorMessage = `Failed to send OTP: ${error.message}`;
    }
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        message: errorMessage,
        error: errorDetails,
        code: error.code || null,
        status: error.status || null
      })
    };
  }
};
