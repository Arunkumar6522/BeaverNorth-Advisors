const crypto = require('crypto');
const fetch = require('node-fetch');

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

    const googleAdsCustomerId = process.env.GOOGLE_ADS_CUSTOMER_ID; // Format: 123-456-7890
    const googleAdsConversionActionId = process.env.GOOGLE_ADS_CONVERSION_ACTION_ID; // The conversion action ID
    const googleAdsAccessToken = process.env.GOOGLE_ADS_ACCESS_TOKEN; // OAuth 2.0 access token
    const googleAdsDeveloperToken = process.env.GOOGLE_ADS_DEVELOPER_TOKEN; // Developer token from Google Ads API

    if (!googleAdsCustomerId || !googleAdsConversionActionId || !googleAdsAccessToken || !googleAdsDeveloperToken) {
      console.log('⚠️ Google Ads Conversions API not configured');
      return {
        statusCode: 200, // Return 200 to not break client, but log error
        headers,
        body: JSON.stringify({ 
          success: false, 
          message: 'Google Ads Conversions API not configured. Please set environment variables.' 
        })
      };
    }

    // Hash user data for privacy (SHA-256)
    const hashData = (data) => {
      if (!data) return null;
      return crypto.createHash('sha256').update(data.toLowerCase().trim()).digest('hex');
    };

    // Map event names to conversion action IDs
    // You can create multiple conversion actions in Google Ads and map them here
    const conversionActionMap = {
      'LEAD_SUBMIT': googleAdsConversionActionId,
      'FORM_START': googleAdsConversionActionId, // Can use same or different action ID
      'OTP_VERIFIED': googleAdsConversionActionId,
      'PHONE_CLICK': googleAdsConversionActionId,
      'EMAIL_CLICK': googleAdsConversionActionId,
    };

    const conversionActionId = conversionActionMap[eventName] || googleAdsConversionActionId;

    // Prepare user identifiers (hashed)
    const userIdentifiers = [];
    if (userData?.email) {
      userIdentifiers.push({
        hashedEmail: hashData(userData.email)
      });
    }
    if (userData?.phone) {
      const phoneNumber = userData.phone.replace(/\D/g, ''); // Remove non-digits
      if (phoneNumber) {
        userIdentifiers.push({
          hashedPhoneNumber: hashData(phoneNumber)
        });
      }
    }

    // Prepare conversion data
    const conversionData = {
      conversionAction: `customers/${googleAdsCustomerId}/conversionActions/${conversionActionId}`,
      conversionDateTime: new Date().toISOString().replace(/\.\d{3}/, ''), // Format: YYYY-MM-DDTHH:mm:ss+00:00
      conversionValue: parseFloat(eventData?.value || '0'),
      currencyCode: eventData?.currency || 'CAD',
      ...(eventData?.transaction_id && { orderId: eventData.transaction_id }),
    };

    // Add user identifiers if available
    if (userIdentifiers.length > 0) {
      conversionData.userIdentifiers = userIdentifiers;
    }

    // Send to Google Ads Conversions API
    const apiUrl = `https://googleads.googleapis.com/v16/customers/${googleAdsCustomerId}:uploadClickConversions`;
    
    const payload = {
      conversions: [conversionData],
      partialFailure: false
    };

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${googleAdsAccessToken}`,
        'developer-token': googleAdsDeveloperToken,
        'login-customer-id': googleAdsCustomerId.replace(/-/g, ''), // Remove dashes for login-customer-id
      },
      body: JSON.stringify(payload)
    });

    const result = await response.json();

    if (response.ok) {
      console.log('✅ Google Ads Conversions API event sent:', result);
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ 
          success: true, 
          message: 'Event sent to Google Ads Conversions API', 
          result 
        })
      };
    } else {
      console.error('❌ Google Ads Conversions API error:', result);
      return {
        statusCode: response.status,
        headers,
        body: JSON.stringify({ 
          success: false, 
          message: result.error?.message || 'Failed to send event to Google Ads Conversions API', 
          error: result 
        })
      };
    }

  } catch (error) {
    console.error('❌ Google Ads Conversions API handler error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        success: false, 
        message: `Server error: ${error.message}`, 
        error: error.message 
      })
    };
  }
};
