const express = require('express');
const cors = require('cors');
const twilio = require('twilio');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('dist'));

// Twilio configuration
const twilioAccountSid = process.env.TWILIO_ACCOUNT_SID || '[YOUR_TWILIO_ACCOUNT_SID]';
const twilioAuthToken = process.env.TWILIO_AUTH_TOKEN || '[YOUR_TWILIO_AUTH_CONFIG]';
const twilioServiceSid = process.env.TWILIO_SERVICE_SID || '[YOUR_TWILIO_SERVICE_SID]';

// Initialize Twilio client
const client = twilio(twilioAccountSid, twilioAuthToken);

// API Routes
app.post('/api/send-otp', async (req, res) => {
  try {
    const { to, serviceSid } = req.body;
    
    console.log('📱 Sending OTP to:', to);
    
    // Send verification via Twilio
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

app.post('/api/verify-otp', async (req, res) => {
  try {
    const { to, code, verificationSid } = req.body;
    
    console.log('🔐 Verifying OTP:', code, 'for:', to);
    
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
