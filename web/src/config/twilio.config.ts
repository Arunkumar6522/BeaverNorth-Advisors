// Twilio Configuration
// Uses environment variables with fallbacks for demo mode

export const twilioConfig = {
  accountSid: import.meta.env.VITE_TWILIO_ACCOUNT_SID || 'demo-account-sid',
  authToken: import.meta.env.VITE_TWILIO_AUTH_TOKEN || 'demo-auth-token',
  serviceSid: import.meta.env.VITE_TWILIO_SERVICE_SID || 'demo-service-sid',
  fromNumber: import.meta.env.VITE_TWILIO_FROM_NUMBER || '+15551234567'
}

// Check if we're in demo mode
export const isDemoMode = () => {
  return twilioConfig.accountSid === 'demo-account-sid' || 
         twilioConfig.authToken === 'demo-auth-token' ||
         twilioConfig.serviceSid === 'demo-service-sid'
}

// Environment variables (for production deployment)
export const envConfig = {
  accountSid: import.meta.env.VITE_TWILIO_ACCOUNT_SID || twilioConfig.accountSid,
  authToken: import.meta.env.VITE_TWILIO_AUTH_TOKEN || twilioConfig.authToken,
  serviceSid: import.meta.env.VITE_TWILIO_SERVICE_SID || twilioConfig.serviceSid,
  fromNumber: import.meta.env.VITE_TWILIO_FROM_NUMBER || twilioConfig.fromNumber
}
