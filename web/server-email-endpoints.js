// Email Marketing API Endpoints
// Add these endpoints to your server.js file

// Unsubscribe endpoint
app.get('/api/unsubscribe', async (req, res) => {
  try {
    const { email, reason, name, category_id, category_name } = req.query;
    
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email parameter is required'
      });
    }

    if (!supabase) {
      return res.status(500).json({
        success: false,
        message: 'Database not configured'
      });
    }

    // Check if already unsubscribed
    const { data: existing } = await supabase
      .from('email_unsubscribers')
      .select('*')
      .eq('email', email.toLowerCase())
      .single();

    if (existing) {
      return res.send(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Already Unsubscribed</title>
          <style>
            body { font-family: Arial, sans-serif; text-align: center; padding: 50px; background: #f5f5f5; }
            .container { background: white; padding: 40px; border-radius: 8px; max-width: 500px; margin: 0 auto; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
            h1 { color: #1E377C; }
            p { color: #6B7280; line-height: 1.6; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Already Unsubscribed</h1>
            <p>You have already been removed from our email list.</p>
          </div>
        </body>
        </html>
      `);
    }

    // Get IP and user agent
    const ipAddress = req.ip || req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || 'unknown';
    const userAgent = req.headers['user-agent'] || 'unknown';

    // Insert unsubscribe record
    const { data, error } = await supabase
      .from('email_unsubscribers')
      .insert({
        email: email.toLowerCase(),
        name: name || null,
        category_id: category_id || null,
        category_name: category_name || null,
        unsubscribed_at: new Date().toISOString(),
        reason: reason || 'User requested unsubscribe',
        ip_address: ipAddress,
        user_agent: userAgent
      })
      .select()
      .single();

    if (error) {
      console.error('Error unsubscribing:', error);
      return res.status(500).send(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Error</title>
          <style>
            body { font-family: Arial, sans-serif; text-align: center; padding: 50px; background: #f5f5f5; }
            .container { background: white; padding: 40px; border-radius: 8px; max-width: 500px; margin: 0 auto; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
            h1 { color: #EF4444; }
            p { color: #6B7280; line-height: 1.6; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Error</h1>
            <p>Failed to unsubscribe. Please try again or contact us.</p>
          </div>
        </body>
        </html>
      `);
    }

    // Return HTML page for user
    res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Unsubscribed</title>
        <style>
          body { font-family: Arial, sans-serif; text-align: center; padding: 50px; background: #f5f5f5; }
          .container { background: white; padding: 40px; border-radius: 8px; max-width: 500px; margin: 0 auto; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
          h1 { color: #1E377C; }
          p { color: #6B7280; line-height: 1.6; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>✓ Successfully Unsubscribed</h1>
          <p>You have been removed from our email list. You will no longer receive emails from us.</p>
          <p style="font-size: 12px; color: #9CA3AF; margin-top: 20px;">If you have any questions, please contact us at beavernorthadvisors@gmail.com</p>
        </div>
      </body>
      </html>
    `);

  } catch (error) {
    console.error('Unsubscribe error:', error);
    res.status(500).send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Error</title>
        <style>
          body { font-family: Arial, sans-serif; text-align: center; padding: 50px; background: #f5f5f5; }
          .container { background: white; padding: 40px; border-radius: 8px; max-width: 500px; margin: 0 auto; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
          h1 { color: #EF4444; }
          p { color: #6B7280; line-height: 1.6; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Error</h1>
          <p>An error occurred. Please try again later.</p>
        </div>
      </body>
      </html>
    `);
  }
});

// Get unsubscribers endpoint
app.get('/api/unsubscribers', async (req, res) => {
  try {
    if (!supabase) {
      return res.status(500).json({
        success: false,
        message: 'Database not configured'
      });
    }

    const { data, error } = await supabase
      .from('email_unsubscribers')
      .select('*')
      .order('unsubscribed_at', { ascending: false });

    if (error) {
      console.error('Error fetching unsubscribers:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch unsubscribers',
        error: error.message
      });
    }

    res.json({
      success: true,
      data: data || []
    });

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred',
      error: error.message
    });
  }
});

// Delete unsubscriber endpoint
app.delete('/api/unsubscribers/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!supabase) {
      return res.status(500).json({
        success: false,
        message: 'Database not configured'
      });
    }

    const { error } = await supabase
      .from('email_unsubscribers')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting unsubscriber:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to delete unsubscriber',
        error: error.message
      });
    }

    res.json({
      success: true,
      message: 'Unsubscriber deleted successfully'
    });

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred',
      error: error.message
    });
  }
});

// Check if email is unsubscribed (for email sending)
app.get('/api/check-unsubscribed', async (req, res) => {
  try {
    const { email } = req.query;
    
    if (!email || !supabase) {
      return res.json({ isUnsubscribed: false });
    }

    const { data } = await supabase
      .from('email_unsubscribers')
      .select('id')
      .eq('email', email.toLowerCase())
      .single();

    res.json({
      isUnsubscribed: !!data
    });

  } catch (error) {
    res.json({ isUnsubscribed: false });
  }
});

