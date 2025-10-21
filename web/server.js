import express from 'express';
import cors from 'cors';
import twilio from 'twilio';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { JSDOM } from 'jsdom';
import rateLimit from 'express-rate-limit';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Rate limiting configuration
const otpRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
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
    ? ['https://yourdomain.com', 'https://www.yourdomain.com'] // Replace with your actual domains
    : ['http://localhost:5173', 'http://localhost:3000', 'http://localhost:3001'],
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

// Initialize Twilio client (with demo mode support)
let client = null;
if (twilioAccountSid && twilioAccountSid.startsWith('AC') && twilioAuthToken && twilioAuthToken !== 'demo_auth_token') {
  client = twilio(twilioAccountSid, twilioAuthToken);
} else {
  console.log('🔧 Running in demo mode - Twilio client not initialized');
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
      const author = item.querySelector('author')?.textContent || 'BeaverNorth Advisors'
      
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
  console.log(`📁 Serving React app on http://localhost:${port}`);
});
