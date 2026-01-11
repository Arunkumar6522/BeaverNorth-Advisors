// ============================================
// EMAIL MARKETING API ENDPOINTS
// Append these endpoints to your server.js file
// ============================================

// Unsubscribe endpoint
app.post('/api/unsubscribe', async (req, res) => {
  try {
    const { email, name, category_id, category_name, reason } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
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
      .eq('email', email)
      .single();

    if (existing) {
      return res.json({
        success: true,
        message: 'You are already unsubscribed',
        alreadyUnsubscribed: true
      });
    }

    const ipAddress = req.ip || req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || 'unknown';
    const userAgent = req.headers['user-agent'] || 'unknown';

    // Add to unsubscribers table
    const { data, error } = await supabase
      .from('email_unsubscribers')
      .insert({
        email,
        name,
        category_id,
        category_name,
        reason,
        unsubscribed_at: new Date().toISOString(),
        ip_address: ipAddress,
        user_agent: userAgent
      })
      .select()
      .single();

    if (error) {
      console.error('❌ Unsubscribe error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to unsubscribe',
        error: error.message
      });
    }

    console.log('✅ User unsubscribed:', email);
    res.json({
      success: true,
      message: 'Successfully unsubscribed',
      data
    });

  } catch (error) {
    console.error('❌ Unsubscribe API error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// Get unsubscribers list
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
      console.error('❌ Error fetching unsubscribers:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch unsubscribers',
        error: error.message
      });
    }

    res.json({
      success: true,
      data: data || [],
      count: data?.length || 0
    });

  } catch (error) {
    console.error('❌ Get unsubscribers error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// Check if emails are unsubscribed (for filtering before sending)
app.post('/api/check-unsubscribed', async (req, res) => {
  try {
    const { emails } = req.body; // Array of emails

    if (!emails || !Array.isArray(emails)) {
      return res.status(400).json({
        success: false,
        message: 'Emails array is required'
      });
    }

    if (!supabase) {
      return res.status(500).json({
        success: false,
        message: 'Database not configured'
      });
    }

    const { data, error } = await supabase
      .from('email_unsubscribers')
      .select('email')
      .in('email', emails);

    if (error) {
      console.error('❌ Error checking unsubscribed:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to check unsubscribed status',
        error: error.message
      });
    }

    const unsubscribedEmails = (data || []).map(item => item.email);

    res.json({
      success: true,
      unsubscribedEmails,
      count: unsubscribedEmails.length
    });

  } catch (error) {
    console.error('❌ Check unsubscribed error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// AWS SES Email Sending Endpoint (when AWS SES is approved)
app.post('/api/send-email-campaign', async (req, res) => {
  try {
    const { campaignId, recipients, templateContent, subject, fromEmail } = req.body;

    if (!campaignId || !recipients || !templateContent || !subject) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: campaignId, recipients, templateContent, subject'
      });
    }

    // Check AWS SES configuration
    const awsSesAccessKey = process.env.AWS_SES_ACCESS_KEY_ID;
    const awsSesSecretKey = process.env.AWS_SES_SECRET_ACCESS_KEY;
    const awsSesRegion = process.env.AWS_SES_REGION || 'us-east-1';
    const sesFromEmail = fromEmail || process.env.AWS_SES_FROM_EMAIL || process.env.EMAIL_USER;

    if (!awsSesAccessKey || !awsSesSecretKey) {
      return res.status(500).json({
        success: false,
        message: 'AWS SES not configured. Please add AWS_SES_ACCESS_KEY_ID and AWS_SES_SECRET_ACCESS_KEY to environment variables.',
        demoMode: true
      });
    }

    // TODO: Implement AWS SES sending when credentials are provided
    // Example implementation:
    /*
    const AWS = require('aws-sdk');
    const ses = new AWS.SES({
      accessKeyId: awsSesAccessKey,
      secretAccessKey: awsSesSecretKey,
      region: awsSesRegion
    });

    // Filter out unsubscribed emails
    const emailList = recipients.map(r => r.email);
    const { data: unsubscribedData } = await supabase
      .from('email_unsubscribers')
      .select('email')
      .in('email', emailList);
    
    const unsubscribedEmails = (unsubscribedData || []).map(u => u.email);
    const validRecipients = recipients.filter(r => !unsubscribedEmails.includes(r.email));

    // Send emails via SES
    const sendPromises = validRecipients.map(async (recipient) => {
      const personalizedContent = templateContent.replace(/{name}/g, recipient.name || 'Valued Customer');
      const unsubscribeUrl = `${process.env.APP_URL || 'http://localhost:5173'}/api/unsubscribe?email=${encodeURIComponent(recipient.email)}`;
      
      const emailContent = `
        ${personalizedContent}
        <hr style="margin: 20px 0; border: none; border-top: 1px solid #E5E7EB;">
        <p style="font-size: 12px; color: #6B7280; text-align: center;">
          <a href="${unsubscribeUrl}" style="color: #6B7280;">Unsubscribe</a> | 
          <a href="${process.env.APP_URL || 'http://localhost:5173'}" style="color: #6B7280;">Visit Website</a>
        </p>
      `;

      const params = {
        Source: sesFromEmail,
        Destination: {
          ToAddresses: [recipient.email]
        },
        Message: {
          Subject: {
            Data: subject,
            Charset: 'UTF-8'
          },
          Body: {
            Html: {
              Data: emailContent,
              Charset: 'UTF-8'
            }
          }
        }
      };

      return ses.sendEmail(params).promise();
    });

    await Promise.all(sendPromises);
    */

    // For now, return demo response
    res.json({
      success: true,
      message: 'AWS SES integration ready. Configure credentials to send emails.',
      demoMode: true,
      campaignId,
      recipientCount: recipients.length,
      note: 'Add AWS SES credentials to .env file: AWS_SES_ACCESS_KEY_ID, AWS_SES_SECRET_ACCESS_KEY, AWS_SES_REGION, AWS_SES_FROM_EMAIL'
    });

  } catch (error) {
    console.error('❌ Send email campaign error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

