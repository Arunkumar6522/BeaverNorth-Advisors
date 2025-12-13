const { createClient } = require('@supabase/supabase-js');

exports.handler = async (event, context) => {
  // Enable CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
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
    const supabaseUrl = process.env.VITE_SUPABASE_URL;
    const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          success: false,
          message: 'Database configuration missing'
        })
      };
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Get email from query params
    const email = event.queryStringParameters?.email;
    
    if (!email) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          success: false,
          message: 'Email parameter is required'
        })
      };
    }

    // Get additional info from request
    const ipAddress = event.headers['x-forwarded-for'] || event.headers['x-real-ip'] || 'unknown';
    const userAgent = event.headers['user-agent'] || 'unknown';
    const reason = event.queryStringParameters?.reason || 'User requested unsubscribe';

    // Check if already unsubscribed
    const { data: existing } = await supabase
      .from('email_unsubscribers')
      .select('*')
      .eq('email', email.toLowerCase())
      .single();

    if (existing) {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          message: 'You have already been unsubscribed',
          alreadyUnsubscribed: true
        })
      };
    }

    // Insert unsubscribe record
    const { data, error } = await supabase
      .from('email_unsubscribers')
      .insert({
        email: email.toLowerCase(),
        unsubscribed_at: new Date().toISOString(),
        reason: reason,
        ip_address: ipAddress,
        user_agent: userAgent
      })
      .select()
      .single();

    if (error) {
      console.error('Error unsubscribing:', error);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          success: false,
          message: 'Failed to unsubscribe. Please try again.',
          error: error.message
        })
      };
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: 'You have been successfully unsubscribed from our email list.',
        data: data
      })
    };

  } catch (error) {
    console.error('Unsubscribe error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        message: 'An error occurred while processing your request',
        error: error.message
      })
    };
  }
};
