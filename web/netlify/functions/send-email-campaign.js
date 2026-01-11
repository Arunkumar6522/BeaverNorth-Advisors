const nodemailer = require('nodemailer');
const { createClient } = require('@supabase/supabase-js');

exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    const { campaignId, recipients, templateContent, templateName, fromEmail, fromName } = JSON.parse(event.body || '{}');

    if (!recipients || !Array.isArray(recipients) || recipients.length === 0) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ success: false, message: 'Recipients are required' })
      };
    }

    // Initialize Supabase
    const supabaseUrl = process.env.VITE_SUPABASE_URL;
    const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Check for unsubscribers
    const emails = recipients.map(r => r.email.toLowerCase().trim());
    const { data: unsubscribers } = await supabase
      .from('unsubscribers')
      .select('email')
      .in('email', emails);

    const unsubscribedEmails = new Set((unsubscribers || []).map(u => u.email.toLowerCase()));
    const validRecipients = recipients.filter(r => !unsubscribedEmails.has(r.email.toLowerCase().trim()));

    if (validRecipients.length === 0) {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          message: 'All recipients have unsubscribed',
          skipped: recipients.length
        })
      };
    }

    // Email configuration (AWS SES or SMTP)
    const emailUser = process.env.EMAIL_USER || process.env.AWS_SES_SMTP_USER;
    const emailPass = process.env.EMAIL_PASS || process.env.AWS_SES_SMTP_PASS;
    const emailHost = process.env.EMAIL_HOST || process.env.AWS_SES_SMTP_HOST || 'email-smtp.us-east-1.amazonaws.com';
    const emailPort = parseInt(process.env.EMAIL_PORT || process.env.AWS_SES_SMTP_PORT || '587');

    if (!emailUser || !emailPass) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          success: false,
          message: 'Email service not configured. Please configure AWS SES or SMTP credentials.'
        })
      };
    }

    // Create transporter
    const transporter = nodemailer.createTransport({
      host: emailHost,
      port: emailPort,
      secure: emailPort === 465,
      auth: {
        user: emailUser,
        pass: emailPass
      }
    });

    // Generate unsubscribe URL
    const baseUrl = process.env.UNSUBSCRIBE_BASE_URL || 'https://beavernorth.netlify.app';
    const unsubscribeUrl = `${baseUrl}/unsubscribe?email={email}&token={token}`;

    // Add unsubscribe footer to email content
    const unsubscribeFooter = `
      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #E5E7EB; text-align: center; font-size: 12px; color: #6B7280;">
        <p style="margin: 0;">Don't want to receive these emails?</p>
        <p style="margin: 5px 0;">
          <a href="${baseUrl}/unsubscribe?email={email}" style="color: #1E377C; text-decoration: underline;">Unsubscribe</a>
        </p>
      </div>
    `;

    const results = {
      sent: 0,
      failed: 0,
      skipped: recipients.length - validRecipients.length,
      errors: []
    };

    // Send emails in batches
    const BATCH_SIZE = 10;
    for (let i = 0; i < validRecipients.length; i += BATCH_SIZE) {
      const batch = validRecipients.slice(i, i + BATCH_SIZE);
      
      await Promise.all(batch.map(async (recipient) => {
        try {
          // Personalize content
          let personalizedContent = templateContent.replace(/{name}/g, recipient.name || 'Valued Customer');
          personalizedContent = personalizedContent.replace(/{email}/g, recipient.email);
          
          // Add unsubscribe link
          const finalContent = personalizedContent + unsubscribeFooter.replace(/{email}/g, encodeURIComponent(recipient.email));

          const mailOptions = {
            from: `"${fromName || 'BeaverNorth Advisors'}" <${fromEmail || emailUser}>`,
            to: recipient.email,
            subject: templateName,
            html: finalContent,
            headers: {
              'List-Unsubscribe': `<${baseUrl}/unsubscribe?email=${encodeURIComponent(recipient.email)}>`,
              'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click'
            }
          };

          await transporter.sendMail(mailOptions);
          results.sent++;

          // Update recipient status in database
          if (campaignId) {
            await supabase
              .from('email_recipients')
              .update({
                status: 'sent',
                sent_at: new Date().toISOString()
              })
              .eq('campaign_id', campaignId)
              .eq('email', recipient.email);
          }
        } catch (error) {
          results.failed++;
          results.errors.push({ email: recipient.email, error: error.message });
          
          // Update recipient status
          if (campaignId) {
            await supabase
              .from('email_recipients')
              .update({
                status: 'failed',
                error_message: error.message
              })
              .eq('campaign_id', campaignId)
              .eq('email', recipient.email);
          }
        }
      }));

      // Rate limiting: wait 1 second between batches
      if (i + BATCH_SIZE < validRecipients.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        results
      })
    };
  } catch (error) {
    console.error('Send email campaign error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        message: 'Failed to send email campaign',
        error: error.message
      })
    };
  }
};

