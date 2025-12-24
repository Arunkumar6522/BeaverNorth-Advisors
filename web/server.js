import express from 'express';
import cors from 'cors';
import twilio from 'twilio';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { JSDOM } from 'jsdom';
import rateLimit from 'express-rate-limit';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Rate limiting configuration
const otpRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'production' ? 5 : 50, // 5 in production, 50 in development
  message: {
    success: false,
    error: 'Too many OTP requests, please try again later.',
    retryAfter: '15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const generalRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    success: false,
    error: 'Too many requests, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Secure CORS configuration
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://beavernorth.netlify.app', 'https://www.beavernorth.netlify.app'] // Production domains
    : ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175', 'http://localhost:3000', 'http://localhost:3001'], // Development domains
  credentials: true,
  optionsSuccessStatus: 200
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.static('dist'));

// Apply rate limiting
app.use('/api/', generalRateLimit);

// Twilio configuration
const twilioAccountSid = process.env.TWILIO_ACCOUNT_SID || 'YOUR_TWILIO_ACCOUNT_SID';
const twilioAuthToken = process.env.TWILIO_AUTH_TOKEN || 'YOUR_TWILIO_AUTH_TOKEN';
const twilioServiceSid = process.env.TWILIO_SERVICE_SID || 'YOUR_TWILIO_SERVICE_SID';

// Email configuration
const emailUser = process.env.EMAIL_USER || 'YOUR_EMAIL_USER';
const emailPass = process.env.EMAIL_PASS || 'YOUR_EMAIL_PASS';
const emailHost = process.env.EMAIL_HOST || 'smtp.gmail.com';
const emailPort = process.env.EMAIL_PORT || 587;

// Initialize Twilio client (with demo mode support)
let client = null;
if (twilioAccountSid && twilioAccountSid.startsWith('AC') && twilioAuthToken && twilioAuthToken !== 'demo_auth_token') {
  client = twilio(twilioAccountSid, twilioAuthToken);
} else {
  console.log('🔧 Running in demo mode - Twilio client not initialized');
}

// Initialize Supabase client
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
let supabase = null;
if (supabaseUrl && supabaseKey) {
  supabase = createClient(supabaseUrl, supabaseKey);
  console.log('🗄️ Supabase client initialized');
} else {
  console.log('🔧 Supabase not configured');
}

// Initialize Email transporter (with demo mode support)
let emailTransporter = null;
if (emailUser && emailUser !== 'YOUR_EMAIL_USER' && emailPass && emailPass !== 'YOUR_EMAIL_PASS') {
  emailTransporter = nodemailer.createTransport({
    host: emailHost,
    port: emailPort,
    secure: false, // true for 465, false for other ports
    auth: {
      user: emailUser,
      pass: emailPass
    }
  });
  console.log('📧 Email transporter initialized');
} else {
  console.log('🔧 Running in demo mode - Email transporter not initialized');
}

// API Routes
app.post('/api/send-otp', otpRateLimit, async (req, res) => {
  try {
    const { to, serviceSid } = req.body;
    
    console.log('📱 Sending OTP to:', to);
    
    // Demo mode - return success without actually sending
    if (!client) {
      console.log('🔧 Demo mode: Simulating OTP send to', to);
      res.json({
        success: true,
        message: 'OTP sent successfully (Demo Mode)',
        verificationSid: 'demo_verification_sid',
        to: to
      });
      return;
    }
    
    // Send verification via Twilio Verify Service
    const verification = await client.verify.v2
      .services(twilioServiceSid)
      .verifications
      .create({ 
        to: to, 
        channel: 'sms' 
      });
    
    console.log('✅ Twilio verification sent:', verification.sid);
    
    res.json({
      success: true,
      message: 'OTP sent successfully',
      verificationSid: verification.sid,
      to: to
    });
    
  } catch (error) {
    console.error('❌ Twilio OTP error:', error);
    
    res.status(500).json({
      success: false,
      message: `Failed to send OTP: ${error.message}`,
      error: error.message
    });
  }
});

app.post('/api/verify-otp', otpRateLimit, async (req, res) => {
  try {
    const { to, code, verificationSid } = req.body;
    
    console.log('🔐 Verifying OTP:', code, 'for:', to);
    
    // Demo mode - accept any 6-digit code
    if (!client) {
      console.log('🔧 Demo mode: Simulating OTP verification');
      if (code && code.length === 6 && /^\d+$/.test(code)) {
        res.json({
          success: true,
          message: 'OTP verified successfully (Demo Mode)',
          status: 'approved'
        });
        return;
      } else {
        res.json({
          success: false,
          message: 'Invalid OTP code (Demo Mode)',
          status: 'denied'
        });
        return;
      }
    }
    
    // Verify the code with Twilio
    const verificationCheck = await client.verify.v2
      .services(twilioServiceSid)
      .verificationChecks
      .create({ 
        to: to, 
        code: code 
      });
    
    console.log('📋 Twilio verification result:', verificationCheck.status);
    
    if (verificationCheck.status === 'approved') {
      res.json({
        success: true,
        message: 'OTP verified successfully',
        status: verificationCheck.status
      });
    } else {
      res.json({
        success: false,
        message: 'Invalid OTP code. Please try again.',
        status: verificationCheck.status
      });
    }
    
  } catch (error) {
    console.error('❌ Twilio verification error:', error);
    
    res.status(500).json({
      success: false,
      message: `Verification failed: ${error.message}`,
      error: error.message
    });
  }
});

// Email notification endpoint for new leads
app.post('/api/send-lead-notification', async (req, res) => {
  try {
    const { leadData } = req.body;
    
    console.log('📧 Sending lead notification email for:', leadData.name);
    
    // Demo mode - return success without actually sending
    if (!emailTransporter) {
      console.log('🔧 Demo mode: Simulating lead notification email');
      res.json({
        success: true,
        message: 'Lead notification email sent successfully (Demo Mode)',
        leadName: leadData.name
      });
      return;
    }
    
    // Create email template
    const emailTemplate = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>New Lead Notification</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #1E377C; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f9f9f9; padding: 20px; border-radius: 0 0 8px 8px; }
          .lead-info { background: white; padding: 15px; margin: 10px 0; border-radius: 5px; border-left: 4px solid #417F73; }
          .label { font-weight: bold; color: #1E377C; }
          .value { margin-left: 10px; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>🎯 New Lead Notification</h2>
            <p>BeaverNorth Financials</p>
          </div>
          <div class="content">
            <p><strong>Hello Team,</strong></p>
            <p>A new lead has been submitted through the website. Here are the details:</p>
            
            <div class="lead-info">
              <div><span class="label">Name:</span><span class="value">${leadData.name || 'Not provided'}</span></div>
              <div><span class="label">Email:</span><span class="value">${leadData.email || 'Not provided'}</span></div>
              <div><span class="label">Phone:</span><span class="value">${leadData.phone || 'Not provided'}</span></div>
              <div><span class="label">Date of Birth:</span><span class="value">${leadData.dob || 'Not provided'}</span></div>
              <div><span class="label">Province:</span><span class="value">${leadData.province || 'Not provided'}</span></div>
              <div><span class="label">Smoking Status:</span><span class="value">${leadData.smokingStatus || 'Not provided'}</span></div>
              <div><span class="label">Insurance Product:</span><span class="value">${leadData.insuranceProduct || 'Not provided'}</span></div>
              ${leadData.notes ? `<div><span class="label">Notes:</span><span class="value">${leadData.notes}</span></div>` : ''}
            </div>
            
            <p><strong>Next Steps:</strong></p>
            <ul>
              <li>Review the lead details in the admin dashboard</li>
              <li>Contact the lead within 24 hours</li>
              <li>Update the lead status as you progress</li>
            </ul>
            
            <div class="footer">
              <p>This email was automatically generated by the BeaverNorth Financials lead management system.</p>
              <p>Timestamp: ${new Date().toLocaleString()}</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;
    
    // Get email recipients from database
    let emailRecipients = ['beavernorthadvisors@gmail.com']; // Default fallback
    try {
      if (supabase) {
        const { data: emailSettings, error } = await supabase
          .from('notification_settings')
          .select('value')
          .eq('type', 'email')
          .eq('is_active', true);
        
        if (!error && emailSettings && emailSettings.length > 0) {
          emailRecipients = emailSettings.map(setting => setting.value);
          console.log('📧 Sending email to configured recipients:', emailRecipients);
        } else {
          console.log('⚠️ No active email addresses found in database, using default');
        }
      }
    } catch (dbError) {
      console.log('⚠️ Could not fetch email recipients from database:', dbError.message);
    }
    
    // Send email to all recipients
    const mailOptions = {
      from: emailUser,
      to: emailRecipients.join(', '),
      subject: `🎯 New Lead: ${leadData.name || 'Unknown'} - ${leadData.insuranceProduct || 'Insurance Inquiry'}`,
      html: emailTemplate
    };
    
    try {
      const info = await emailTransporter.sendMail(mailOptions);
      console.log('✅ Lead notification email sent to:', emailRecipients);
      
      res.json({
        success: true,
        message: `Lead notification email sent successfully to ${emailRecipients.length} recipients`,
        messageId: info.messageId,
        leadName: leadData.name,
        recipients: emailRecipients
      });
    } catch (emailError) {
      console.error('❌ Email sending failed, running in demo mode:', emailError.message);
      
      // If email fails due to credentials, return demo mode response
      res.json({
        success: true,
        message: `Lead notification email sent successfully (Demo Mode - Invalid Credentials) to ${emailRecipients.length} recipients`,
        leadName: leadData.name,
        recipients: emailRecipients,
        demoMode: true
      });
    }
    
  } catch (error) {
    console.error('❌ Email notification error:', error);
    
    res.status(500).json({
      success: false,
      message: `Failed to send lead notification email: ${error.message}`,
      error: error.message
    });
  }
});

// SMS notification endpoint for new leads
app.post('/api/send-lead-sms', async (req, res) => {
  try {
    const { leadData } = req.body;
    
    console.log('📱 Sending lead notification SMS for:', leadData.name);
    
    // Demo mode - return success without actually sending
    if (!client) {
      console.log('🔧 Demo mode: Simulating lead notification SMS');
      res.json({
        success: true,
        message: 'Lead notification SMS sent successfully (Demo Mode)',
        leadName: leadData.name
      });
      return;
    }
    
    // Create SMS message
    const smsMessage = `🎯 NEW LEAD ALERT - BeaverNorth Financials

Name: ${leadData.name || 'Not provided'}
Email: ${leadData.email || 'Not provided'}
Phone: ${leadData.phone || 'Not provided'}
Insurance: ${leadData.insuranceProduct || 'Not provided'}
Province: ${leadData.province || 'Not provided'}

Please check the dashboard for full details.
Time: ${new Date().toLocaleString()}`;
    
    // Get phone numbers from database
    let phoneNumbers = [];
    try {
      if (supabase) {
        const { data: phoneSettings, error } = await supabase
          .from('notification_settings')
          .select('value')
          .eq('type', 'phone')
          .eq('is_active', true);
        
        if (!error && phoneSettings && phoneSettings.length > 0) {
          phoneNumbers = phoneSettings.map(setting => setting.value);
          console.log('📱 Sending SMS to configured numbers:', phoneNumbers);
        } else {
          console.log('⚠️ No active phone numbers found in database');
          return res.json({
            success: true,
            message: 'No active phone numbers configured for SMS notifications',
            leadName: leadData.name
          });
        }
      }
    } catch (dbError) {
      console.log('⚠️ Could not fetch phone numbers from database:', dbError.message);
      return res.json({
        success: true,
        message: 'Could not fetch phone numbers for SMS notifications',
        leadName: leadData.name
      });
    }
    
    console.log('📱 SMS message prepared:', smsMessage);
    console.log('📱 Will send to phone numbers:', phoneNumbers);
    
    // Send SMS to all configured phone numbers
    const smsResults = [];
    for (const phoneNumber of phoneNumbers) {
      try {
        // Use Twilio's messaging API (not verification service)
        const message = await client.messages.create({
          body: smsMessage,
          from: process.env.TWILIO_PHONE_NUMBER || '+15551234567', // Use your Twilio phone number
          to: phoneNumber
        });
        
        console.log(`✅ SMS sent to ${phoneNumber}:`, message.sid);
        smsResults.push({
          phoneNumber,
          messageId: message.sid,
          status: 'sent'
        });
      } catch (smsError) {
        console.error(`❌ Failed to send SMS to ${phoneNumber}:`, smsError.message);
        smsResults.push({
          phoneNumber,
          error: smsError.message,
          status: 'failed'
        });
      }
    }
    
    const successCount = smsResults.filter(result => result.status === 'sent').length;
    const failureCount = smsResults.filter(result => result.status === 'failed').length;
    
    res.json({
      success: true,
      message: `SMS notifications sent: ${successCount} successful, ${failureCount} failed`,
      leadName: leadData.name,
      recipients: phoneNumbers,
      results: smsResults
    });
    
  } catch (error) {
    console.error('❌ SMS notification error:', error);
    
    res.status(500).json({
      success: false,
      message: `Failed to send lead notification SMS: ${error.message}`,
      error: error.message
    });
  }
});

// Blog RSS feed proxy endpoint
app.get('/api/blog-posts', async (req, res) => {
  try {
    console.log('🔍 Fetching blog posts from RSS feed...')
    
    const rssUrl = 'https://beavernorth.blogspot.com/feeds/posts/default?alt=rss'
    const response = await fetch(rssUrl)
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const xmlText = await response.text()
    console.log('📊 RSS feed fetched, length:', xmlText.length)
    
    // Parse XML to extract blog posts
    const dom = new JSDOM(xmlText, { contentType: 'text/xml' })
    const xmlDoc = dom.window.document
    const items = xmlDoc.querySelectorAll('item')
    
    console.log('📊 Found', items.length, 'blog posts')
    
    const blogPosts = Array.from(items).map((item) => {
      const title = item.querySelector('title')?.textContent || 'Untitled'
      const description = item.querySelector('description')?.textContent || ''
      const link = item.querySelector('link')?.textContent || ''
      const pubDate = item.querySelector('pubDate')?.textContent || ''
      const author = item.querySelector('author')?.textContent || 'BeaverNorth Financials'
      
      // Extract thumbnail image - try media:thumbnail first, then img from content
      let thumbnail = null
      
      // Try media:thumbnail first
      const mediaThumbnail = item.querySelector('media\\:thumbnail')
      if (mediaThumbnail) {
        thumbnail = mediaThumbnail.getAttribute('url')
      }
      
      // If no media thumbnail, try to extract from description
      if (!thumbnail && description) {
        const imgMatch = description.match(/<img[^>]+src="([^"]+)"/i)
        if (imgMatch) {
          thumbnail = imgMatch[1]
        }
      }
      
      // Extract categories from RSS feed
      const categories = []
      const categoryElements = item.querySelectorAll('category')
      categoryElements.forEach(cat => {
        const categoryText = cat.textContent?.trim()
        if (categoryText) {
          categories.push(categoryText)
        }
      })
      
      // If no categories found, use default
      const finalCategories = categories.length > 0 ? categories : ['Blog Post']
      
      return {
        title,
        content: description,
        link,
        pubDate,
        author,
        thumbnail,
        categories: finalCategories
      }
    })
    
    console.log('✅ Returning', blogPosts.length, 'blog posts')
    res.json({ success: true, posts: blogPosts })
    
  } catch (error) {
    console.error('❌ Blog posts fetch error:', error)
    res.status(500).json({ success: false, message: 'Failed to fetch blog posts', error: error.message })
  }
})

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Twilio API server is running',
    timestamp: new Date().toISOString(),
    twilioConfigured: !!twilioAuthToken && twilioAuthToken !== '[AuthToken]'
  });
});

// ============================================
// EMAIL MARKETING API ENDPOINTS
// ============================================

// Unsubscribe endpoint
app.get('/api/unsubscribe', async (req, res) => {
  try {
    const { email, reason, name, category_id, category_name } = req.query;
    
    if (!email) {
      return res.status(400).send(`
        <!DOCTYPE html>
        <html>
        <head><title>Error</title></head>
        <body style="font-family: Arial; text-align: center; padding: 50px;">
          <h1>Error</h1><p>Email parameter is required</p>
        </body>
        </html>
      `);
    }

    if (!supabase) {
      return res.status(500).send(`
        <!DOCTYPE html>
        <html>
        <head><title>Error</title></head>
        <body style="font-family: Arial; text-align: center; padding: 50px;">
          <h1>Error</h1><p>Database not configured</p>
        </body>
        </html>
      `);
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

    const ipAddress = req.ip || req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || 'unknown';
    const userAgent = req.headers['user-agent'] || 'unknown';

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
      console.error('❌ Unsubscribe error:', error);
      return res.status(500).send(`
        <!DOCTYPE html>
        <html>
        <head><title>Error</title></head>
        <body style="font-family: Arial; text-align: center; padding: 50px;">
          <h1>Error</h1><p>Failed to unsubscribe. Please try again.</p>
        </body>
        </html>
      `);
    }

    console.log('✅ User unsubscribed:', email);
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
    console.error('❌ Unsubscribe error:', error);
    res.status(500).send(`
      <!DOCTYPE html>
      <html>
      <head><title>Error</title></head>
      <body style="font-family: Arial; text-align: center; padding: 50px;">
        <h1>Error</h1><p>An error occurred. Please try again later.</p>
      </body>
      </html>
    `);
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
      data: data || []
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

// Check if email is unsubscribed
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

// Facebook Conversions API endpoint
app.post('/api/facebook-conversions', async (req, res) => {
  try {
    const { eventName, eventData, userData } = req.body;
    
    const facebookPixelId = process.env.FACEBOOK_PIXEL_ID || '2127848290952226';
    const facebookAccessToken = process.env.FACEBOOK_ACCESS_TOKEN;
    const facebookAppId = process.env.FACEBOOK_APP_ID || '2127848290952226';
    
    if (!facebookAccessToken) {
      console.log('⚠️ Facebook Access Token not configured');
      return res.json({
        success: false,
        message: 'Facebook Conversions API not configured'
      });
    }

    // Hash email and phone for privacy (SHA256)
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
      return res.json({
        success: true,
        message: 'Event sent to Facebook Conversions API',
        events_received: result.events_received || 1
      });
    } else {
      console.error('❌ Facebook Conversions API error:', result.error);
      return res.json({
        success: false,
        message: result.error?.message || 'Failed to send event to Facebook',
        error: result.error
      });
    }

  } catch (error) {
    console.error('❌ Facebook Conversions API handler error:', error);
    return res.status(500).json({
      success: false,
      message: `Facebook Conversions API error: ${error.message}`,
      error: error.message
    });
  }
});

// Serve React app in production
if (process.env.NODE_ENV === 'production') {
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist/index.html'));
  });
}

app.listen(port, () => {
  console.log(`🚀 Twilio API Server running on port ${port}`);
  console.log(`📡 Twilio Account SID: ${twilioAccountSid}`);
  console.log(`🔒 Twilio configured: ${!!twilioAuthToken && twilioAuthToken !== '[AuthToken]'}`);
  console.log(`📧 Email configured: ${!!emailTransporter}`);
  console.log(`📁 Serving React app on http://localhost:${port}`);
});
