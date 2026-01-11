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
    
    // Log credential status (without exposing actual values)
    console.log('🔐 Credential check:', {
      hasAccountSid: !!twilioAccountSid && twilioAccountSid.startsWith('AC'),
      accountSidLength: twilioAccountSid?.length || 0,
      hasAuthToken: !!twilioAuthToken,
      authTokenLength: twilioAuthToken?.length || 0,
      hasServiceSid: !!twilioServiceSid && twilioServiceSid.startsWith('VA'),
      serviceSidLength: twilioServiceSid?.length || 0,
      serviceSidPrefix: twilioServiceSid?.substring(0, 4) || 'none'
    });
    
    // Check if Twilio credentials are properly configured
    const hasAccountSid = twilioAccountSid && twilioAccountSid.startsWith('AC');
    const hasAuthToken = !!twilioAuthToken && twilioAuthToken.length > 20;
    const hasServiceSid = twilioServiceSid && twilioServiceSid.startsWith('VA');
    
    if (!hasAccountSid || !hasAuthToken || !hasServiceSid) {
      console.error('🔧 Demo mode: Twilio credentials not properly configured');
      console.error('📋 Config check details:', {
        hasAccountSid,
        accountSidValid: twilioAccountSid?.startsWith('AC'),
        hasAuthToken,
        authTokenLength: twilioAuthToken?.length,
        hasServiceSid,
        serviceSidValid: twilioServiceSid?.startsWith('VA'),
        serviceSidValue: twilioServiceSid ? `${twilioServiceSid.substring(0, 4)}...` : 'missing'
      });
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
    
    console.log('📤 Attempting to verify OTP via Twilio...');
    console.log('📋 Service SID:', twilioServiceSid);
    console.log('📋 Phone number:', to);
    console.log('📋 OTP code:', code);
    
    // Verify the OTP code
    let verificationCheck;
    try {
      verificationCheck = await client.verify.v2
        .services(twilioServiceSid)
        .verificationChecks
        .create({ to: to, code: code });
      
      console.log('✅ Twilio verification check completed!');
      console.log('📋 Verification status:', verificationCheck.status);
      console.log('📋 Verification SID:', verificationCheck.sid);
    } catch (twilioError) {
      console.error('❌ Twilio API call failed:', twilioError);
      console.error('❌ Error code:', twilioError.code);
      console.error('❌ Error message:', twilioError.message);
      console.error('❌ Error status:', twilioError.status);
      throw twilioError; // Re-throw to be caught by outer catch block
    }
    
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
    console.error('❌ Error details:', {
      message: error.message,
      code: error.code,
      status: error.status,
      name: error.name,
      stack: error.stack
    });
    
    // Check for specific error types
    let errorMessage = `Verification failed: ${error.message}`;
    
    if (error.code === 20404) {
      errorMessage = 'Twilio service not found. Please check your TWILIO_SERVICE_SID configuration. The Service SID may be incorrect or the service may not exist in your Twilio account.';
    } else if (error.code === 20003) {
      errorMessage = 'Twilio authentication failed. Please check your Twilio Account SID and Auth Token.';
    } else if (error.message && error.message.includes('not found')) {
      errorMessage = 'Verification service not found. Please check your Twilio Service SID configuration.';
    } else if (error.status === 404) {
      errorMessage = 'Verification service not found. The Service SID may be incorrect or the verification was not created.';
    }
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        message: errorMessage,
        error: error.message,
        code: error.code || null,
        status: error.status || null
      })
    };
  }
};
