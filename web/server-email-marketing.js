// Email Marketing Backend Endpoints
// Add these routes to your main server.js file

const express = require('express');
const router = express.Router();
const { createClient } = require('@supabase/supabase-js');
const nodemailer = require('nodemailer');

// Initialize Supabase client
const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY
);

// Initialize email transporter (will be configured when AWS SES is approved)
let emailTransporter = null;

function initializeEmailTransporter() {
  if (process.env.AWS_SES_SMTP_HOST && process.env.AWS_SES_SMTP_USER && process.env.AWS_SES_SMTP_PASS) {
    emailTransporter = nodemailer.createTransport({
      host: process.env.AWS_SES_SMTP_HOST,
      port: parseInt(process.env.AWS_SES_SMTP_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.AWS_SES_SMTP_USER,
        pass: process.env.AWS_SES_SMTP_PASS
      }
    });
    console.log('✅ AWS SES Email transporter initialized');
  } else {
    console.log('⚠️ AWS SES credentials not configured. Email sending will be disabled.');
  }
}

initializeEmailTransporter();

// Unsubscribe endpoint
router.post('/api/email-marketing/unsubscribe', async (req, res) => {
  try {
    const { email, name, reason } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    const ipAddress = req.ip || req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || 'unknown';
    const userAgent = req.headers['user-agent'] || 'unknown';

    // Check if already unsubscribed
    const { data: existing } = await supabase
      .from('email_unsubscribers')
      .select('*')
      .eq('email', email.toLowerCase())
      .single();

    if (existing) {
      return res.json({
        success: true,
        message: 'Already unsubscribed',
        alreadyUnsubscribed: true,
        data: existing
      });
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
      return res.status(500).json({
        success: false,
        message: 'Failed to process unsubscribe request'
      });
    }

    res.json({
      success: true,
      message: 'Successfully unsubscribed',
      data: unsubscriber
    });
  } catch (error) {
    console.error('Unsubscribe error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// Get unsubscribers list
router.get('/api/email-marketing/unsubscribers', async (req, res) => {
  try {
    const { page = 1, limit = 50, search } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    let query = supabase
      .from('email_unsubscribers')
      .select('*', { count: 'exact' })
      .order('unsubscribed_at', { ascending: false });

    if (search) {
      query = query.or(`email.ilike.%${search}%,name.ilike.%${search}%`);
    }

    const { data, error, count } = await query
      .range(offset, offset + parseInt(limit) - 1);

    if (error) {
      throw error;
    }

    res.json({
      success: true,
      data,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count || 0,
        totalPages: Math.ceil((count || 0) / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Error fetching unsubscribers:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch unsubscribers',
      error: error.message
    });
  }
});

// Send email campaign
router.post('/api/email-marketing/send-campaign', async (req, res) => {
  try {
    const { campaignId, templateContent, recipients } = req.body;

    if (!emailTransporter) {
      return res.status(503).json({
        success: false,
        message: 'Email service not configured. Please configure AWS SES credentials.'
      });
    }

    if (!campaignId || !templateContent || !recipients || !Array.isArray(recipients)) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: campaignId, templateContent, recipients'
      });
    }

    // Get unsubscribers list
    const { data: unsubscribers } = await supabase
      .from('email_unsubscribers')
      .select('email');

    const unsubscribedEmails = new Set(unsubscribers?.map(u => u.email.toLowerCase()) || []);

    // Filter out unsubscribed emails
    const validRecipients = recipients.filter(r => 
      !unsubscribedEmails.has(r.email.toLowerCase())
    );

    if (validRecipients.length === 0) {
      return res.json({
        success: true,
        message: 'No valid recipients (all unsubscribed)',
        sent: 0,
        skipped: recipients.length
      });
    }

    const results = {
      sent: 0,
      failed: 0,
      skipped: recipients.length - validRecipients.length,
      errors: []
    };

    // Send emails in batches
    const BATCH_SIZE = 20;
    for (let i = 0; i < validRecipients.length; i += BATCH_SIZE) {
      const batch = validRecipients.slice(i, i + BATCH_SIZE);
      
      await Promise.all(batch.map(async (recipient) => {
        try {
          // Personalize content
          const personalizedContent = templateContent.replace(/{name}/g, recipient.name);
          
          // Add unsubscribe link
          const unsubscribeUrl = `${process.env.APP_URL || 'http://localhost:3001'}/api/email-marketing/unsubscribe?email=${encodeURIComponent(recipient.email)}`;
          const emailWithUnsubscribe = personalizedContent + `
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #E5E7EB; text-align: center; font-size: 12px; color: #6B7280;">
              <p>Don't want to receive these emails? <a href="${unsubscribeUrl}" style="color: #1E377C;">Unsubscribe</a></p>
            </div>
          `;

          await emailTransporter.sendMail({
            from: process.env.AWS_SES_FROM_EMAIL || process.env.EMAIL_USER,
            to: recipient.email,
            subject: req.body.subject || 'Email from BeaverNorth Advisors',
            html: emailWithUnsubscribe
          });

          results.sent++;

          // Update recipient status
          await supabase
            .from('email_recipients')
            .update({
              status: 'sent',
              sent_at: new Date().toISOString()
            })
            .eq('id', recipient.id);
        } catch (error) {
          results.failed++;
          results.errors.push({
            email: recipient.email,
            error: error.message
          });

          // Update recipient status
          await supabase
            .from('email_recipients')
            .update({
              status: 'failed'
            })
            .eq('id', recipient.id);
        }
      }));

      // Rate limiting: wait 1 second between batches
      if (i + BATCH_SIZE < validRecipients.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    // Update campaign status
    await supabase
      .from('email_campaigns')
      .update({
        sent_count: results.sent,
        status: results.sent > 0 ? 'sent' : 'failed'
      })
      .eq('id', campaignId);

    res.json({
      success: true,
      message: `Campaign sent: ${results.sent} emails sent, ${results.failed} failed, ${results.skipped} skipped`,
      results
    });
  } catch (error) {
    console.error('Error sending campaign:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send campaign',
      error: error.message
    });
  }
});

module.exports = router;

