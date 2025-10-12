// Twilio Configuration
// Replace [AuthToken] with your actual Twilio Auth Token

export const twilioConfig = {
  accountSid: process.env.VITE_TWILIO_ACCOUNT_SID || 'YOUR_TWILIO_ACCOUNT_SID',
  authToken: process.env.VITE_TWILIO_AUTH_TOKEN || 'YOUR_TWILIO_AUTH_TOKEN',
  serviceSid: process.env.VITE_TWILIO_SERVICE_SID || 'YOUR_TWILIO_SERVICE_SID',
  fromNumber: process.env.VITE_TWILIO_FROM_NUMBER || '+15551234567'
}

// Environment variables (for production deployment)
export const envConfig = {
  accountSid: import.meta.env.VITE_TWILIO_ACCOUNT_SID || twilioConfig.accountSid,
  authToken: import.meta.env.VITE_TWILIO_AUTH_TOKEN || twilioConfig.authToken,
  serviceSid: import.meta.env.VITE_TWILIO_SERVICE_SID || twilioConfig.serviceSid,
  fromNumber: import.meta.env.VITE_TWILIO_FROM_NUMBER || twilioConfig.fromNumber
}
