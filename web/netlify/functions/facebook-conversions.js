/**
 * Facebook Conversions API
 * Server-side event tracking for Facebook Pixel
 */

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
    const { eventName, eventData, userData } = JSON.parse(event.body);
    
    const facebookPixelId = process.env.FACEBOOK_PIXEL_ID || '2127848290952226';
    const facebookAccessToken = process.env.FACEBOOK_ACCESS_TOKEN;
    const facebookAppId = process.env.FACEBOOK_APP_ID || '2127848290952226';
    
    if (!facebookAccessToken) {
      console.log('⚠️ Facebook Access Token not configured');
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: false,
          message: 'Facebook Conversions API not configured'
        })
      };
    }

    // Hash email and phone for privacy (SHA256)
    const crypto = require('crypto');
    const hashData = (data) => {
      if (!data) return null;
      return crypto.createHash('sha256').update(data.toLowerCase().trim()).digest('hex');
    };

    // Prepare user data with hashed PII
    const hashedUserData = {
      em: userData?.email ? [hashData(userData.email)] : [],
      ph: userData?.phone ? [hashData(userData.phone.replace(/\D/g, ''))] : [],
    };

    // Map event names to Facebook standard events
    const eventMap = {
      'Lead': 'Lead',
      'Purchase': 'Purchase',
      'CompleteRegistration': 'CompleteRegistration',
      'InitiateCheckout': 'InitiateCheckout',
      'Contact': 'Contact',
      'PageView': 'PageView'
    };

    const fbEventName = eventMap[eventName] || eventName;

    // Prepare the payload
    const payload = {
      data: [
        {
          event_name: fbEventName,
          event_time: Math.floor(Date.now() / 1000),
          action_source: 'website',
          user_data: hashedUserData,
          custom_data: {
            currency: eventData?.currency || 'CAD',
            value: eventData?.value || '0',
            ...(eventData?.content_name && { content_name: eventData.content_name }),
            ...(eventData?.content_category && { content_category: eventData.content_category })
          }
        }
      ],
      access_token: facebookAccessToken
    };

    // Send to Facebook Conversions API
    const facebookApiUrl = `https://graph.facebook.com/v18.0/${facebookPixelId}/events`;
    
    const response = await fetch(facebookApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const result = await response.json();

    if (response.ok && !result.error) {
      console.log('✅ Facebook Conversions API event sent:', fbEventName);
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          message: 'Event sent to Facebook Conversions API',
          events_received: result.events_received || 1
        })
      };
    } else {
      console.error('❌ Facebook Conversions API error:', result.error);
      return {
        statusCode: 200, // Return 200 to not break client flow
        headers,
        body: JSON.stringify({
          success: false,
          message: result.error?.message || 'Failed to send event to Facebook',
          error: result.error
        })
      };
    }

  } catch (error) {
    console.error('❌ Facebook Conversions API handler error:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        message: `Facebook Conversions API error: ${error.message}`,
        error: error.message
      })
    };
  }
};

