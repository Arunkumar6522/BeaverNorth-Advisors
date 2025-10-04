# Twilio OTP Setup Guide

This guide will help you integrate real Twilio SMS verification into your BeaverNorth Advisors website.

## 🚀 Prerequisites

1. **Twilio Account**: Sign up at [https://www.twilio.com](https://www.twilio.com)
2. **Verify Service**: Create a verification service in Twilio Console
3. **Phone Number**: Add a verified phone number for testing

## 📋 Configuration Steps

### 1. Update Twilio Configuration

Replace `[AuthToken]` in `web/src/config/twilio.config.ts` with your actual Twilio Auth Token:

```typescript
export const twilioConfig = {
  accountSid: 'YOUR_TWILIO_ACCOUNT_SID',
  authToken: 'YOUR_ACTUAL_AUTH_TOKEN_HERE', // ← Replace this
  serviceSid: 'YOUR_TWILIO_SERVICE_SID',
  fromNumber: '+15551234567' // Your Twilio phone number
}
```

### 2. Environment Variables (Optional)

Create a `.env` file in the `web/` directory:

```env
# Twilio Configuration
TWILIO_ACCOUNT_SID=YOUR_TWILIO_ACCOUNT_SID
TWILIO_AUTH_TOKEN=YOUR_ACTUAL_AUTH_TOKEN_HERE
TWILIO_SERVICE_SID=YOUR_TWILIO_SERVICE_SID

# Server Configuration
PORT=3001
NODE_ENV=development
```

## 🔧 Running the Application

### Development Mode (Frontend + Backend)

```bash
cd web
npm run dev:full
```

This will start:
- **Frontend**: http://localhost:5173 (Vite dev server)
- **Backend**: http://localhost:3001 (Express API with Twilio)

### Frontend Only (Demo Mode)

```bash
cd web
npm run dev
```

This runs in demo mode with simulated OTP in the browser console.

### Production Build

```bash
cd web
npm run build
npm run server
```

## 📱 Testing the Integration

### 1. Visit the Website
- Go to: http://localhost:5173
- Click any "Get Quote" or "Contact" button

### 2. Fill the Contact Form
- **Step 1**: Enter name and date of birth
- **Step 2**: Select smoking status, insurance type, province
- **Step 3**: Enter email and phone number with country code

### 3. Send OTP
- Select country code (defaults to Canada +1)
- Enter phone number: `5551234567`
- Click "Send OTP"
- Check your phone for the SMS code

### 4. Verify OTP
- Enter the 6-digit code from SMS
- Click "Get My Quote"
- Form will submit after successful verification

## 🌍 Country Support

The form supports 30+ countries with proper dialing codes:

| Country | Code | Example |
|---------|------|---------|
| Canada | +1 | +1 555 123 4567 |
| United States | +1 | +1 555 987 6543 |
| United Kingdom | +44 | +44 20 7946 0958 |
| Australia | +61 | +61 2 9374 4000 |
| Germany | +49 | +49 30 12345678 |
| France | +33 | +33 1 42 86 83 26 |

## 🔍 Debugging

### Console Logs

Check the browser console for detailed logs:

```
📱 Sending OTP to: +15551234567
✅ Twilio OTP sent successfully: VE1234567890abcdef...
🔐 Verifying OTP: 123456 for: +15551234567
📋 Twilio verification result: approved
```

### API Health Check

Visit: http://localhost:3001/api/health

```json
{
  "success": true,
  "message": "Twilio API server is running",
  "timestamp": "2025-01-04T08:00:00.000Z",
  "twilioConfigured": true
}
```

## ⚠️ Troubleshooting

### Common Issues

1. **"Failed to send OTP"**
   - Check if your Twilio Auth Token is correct
   - Verify the Service SID exists
   - Ensure your Twilio account has credits

2. **"Invalid phone number"**
   - Use proper international format: +15551234567
   - For US/Canada: Use +1 prefix
   - Phone number should be 10 digits after country code

3. **OTP not received**
   - Check SMS delivery settings in Twilio Console
   - Verify your phone number is listed as verified
   - Check spam folder

### Demo Mode Fallback

If the backend is not available, the app automatically falls back to demo mode:

```
🔄 Falling back to demo mode...
🔐 Demo OTP generated: 123456
Demo OTP sent to +15551234567 (Check console for code: 123456)
```

Use the code shown in the browser console to complete verification.

## 🚀 Production Deployment

### Netlify Configuration

Set these environment variables in Netlify:

```
VITE_TWILIO_ACCOUNT_SID=YOUR_TWILIO_ACCOUNT_SID
VITE_TWILIO_AUTH_TOKEN=YOUR_ACTUAL_AUTH_TOKEN_HERE
VITE_TWILIO_SERVICE_SID=YOUR_TWILIO_SERVICE_SID
```

### Backend Deployment

Deploy the Express server (`server.js`) to a service like:
- **Vercel** (serverless functions)
- **Railway**
- **Heroku**
- **DigitalOcean App Platform**

## 📞 Support

For Twilio-related issues:
- **Twilio Documentation**: https://www.twilio.com/docs/verify
- **Twilio Console**: https://console.twilio.com
- **Twilio Support**: https://support.twilio.com

## ✅ Verification Checklist

- [ ] Twilio Auth Token configured
- [ ] Verification service created
- [ ] Backend server running on port 3001
- [ ] Phone number verified in Twilio
- [ ] Frontend connecting to backend APIs
- [ ] OTP sending successfully
- [ ] OTP verification working
- [ ] Form submission after verification

**Your Canadian insurance website now has professional international phone verification! 🇨🇦📱✨**
