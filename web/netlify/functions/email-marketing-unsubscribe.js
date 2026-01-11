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
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;
    
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

    if (event.httpMethod === 'GET') {
      // Handle unsubscribe via GET (for email links)
      const { email, token } = event.queryStringParameters || {};
      
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

      // Get IP and user agent
      const ipAddress = event.headers['x-forwarded-for'] || event.headers['x-real-ip'] || 'unknown';
      const userAgent = event.headers['user-agent'] || 'unknown';

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
            message: 'You are already unsubscribed',
            alreadyUnsubscribed: true
          })
        };
      }

      // Get contact info if exists
      const { data: contact } = await supabase
        .from('email_contacts')
        .select('name, category_id, email_categories(name)')
        .eq('email', email.toLowerCase())
        .limit(1)
        .single();

      // Add to unsubscribers table
      const { data: unsubscriber, error } = await supabase
        .from('email_unsubscribers')
        .insert({
          email: email.toLowerCase(),
          name: contact?.name || null,
          category_id: contact?.category_id || null,
          category_name: contact?.email_categories?.name || null,
          ip_address: ipAddress,
          user_agent: userAgent,
          reason: 'User clicked unsubscribe link'
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
            message: 'Failed to process unsubscribe request'
          })
        };
      }

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          message: 'Successfully unsubscribed. You will no longer receive emails from us.',
          data: unsubscriber
        })
      };
    }

    if (event.httpMethod === 'POST') {
      // Handle unsubscribe via POST (for API calls)
      const { email, name, reason } = JSON.parse(event.body || '{}');

      if (!email) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({
            success: false,
            message: 'Email is required'
          })
        };
      }

      const ipAddress = event.headers['x-forwarded-for'] || event.headers['x-real-ip'] || 'unknown';
      const userAgent = event.headers['user-agent'] || 'unknown';

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
            message: 'Already unsubscribed',
            alreadyUnsubscribed: true,
            data: existing
          })
        };
      }

      // Get contact info if exists
      const { data: contact } = await supabase
        .from('email_contacts')
        .select('name, category_id, email_categories(name)')
        .eq('email', email.toLowerCase())
        .limit(1)
        .single();

      // Add to unsubscribers table
      const { data: unsubscriber, error } = await supabase
        .from('email_unsubscribers')
        .insert({
          email: email.toLowerCase(),
          name: name || contact?.name || null,
          category_id: contact?.category_id || null,
          category_name: contact?.email_categories?.name || null,
          ip_address: ipAddress,
          user_agent: userAgent,
          reason: reason || 'User requested unsubscribe'
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
            message: 'Failed to process unsubscribe request'
          })
        };
      }

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          message: 'Successfully unsubscribed',
          data: unsubscriber
        })
      };
    }

    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({
        success: false,
        message: 'Method not allowed'
      })
    };

  } catch (error) {
    console.error('Unsubscribe error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        message: 'Internal server error',
        error: error.message
      })
    };
  }
};

