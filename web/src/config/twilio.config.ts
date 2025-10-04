// Twilio Configuration
// Replace [AuthToken] with your actual Twilio Auth Token

export const twilioConfig = {
  accountSid: '[YOUR_TWILIO_ACCOUNT_SID]',
  authToken: '[YOUR_TWILIO_AUTH_TOKEN]',
  serviceSid: '[YOUR_TWILIO_SERVICE_SID]',
  fromNumber: '+15551234567' // Your Twilio phone number
}

// Environment variables (for production deployment)
export const envConfig = {
  accountSid: import.meta.env.VITE_TWILIO_ACCOUNT_SID || twilioConfig.accountSid,
  authToken: import.meta.env.VITE_TWILIO_AUTH_TOKEN || twilioConfig.authToken,
  serviceSid: import.meta.env.VITE_TWILIO_SERVICE_SID || twilioConfig.serviceSid,
  fromNumber: import.meta.env.VITE_TWILIO_FROM_NUMBER || twilioConfig.fromNumber
}
