// Simple OTP service (No Twilio - Development Mode)

export interface TwilioConfig {
  accountSid: string
  authToken: string
  serviceSid: string
  fromNumber: string
}

export interface PhoneNumber {
  countryCode: string
  number: string
  fullNumber: string
}

// Parse phone number into country code and number
export function parsePhoneNumber(phoneInput: string): PhoneNumber {
  const cleaned = phoneInput.replace(/\D/g, '')
  
  // Default to Canada +1 if no country code provided
  let countryCode = '+1'
  let number = cleaned
  
  if (cleaned.startsWith('1') && cleaned.length === 11) {
    countryCode = '+1'
    number = cleaned.slice(1)
  } else if (cleaned.startsWith('1') && cleaned.length === 10) {
    countryCode = '+1'
    number = cleaned
  } else if (cleaned.length >= 10) {
    // Assume it's a North American number without country code
    countryCode = '+1'
    number = cleaned.slice(-10)
  }
  
  return {
    countryCode,
    number,
    fullNumber: countryCode + number
  }
}

// Simple OTP sending (Development Mode - No SMS)
export async function sendOTP(phoneNumber: string): Promise<{ success: boolean; message: string; sessionId?: string }> {
  const { fullNumber } = parsePhoneNumber(phoneNumber)
  
  console.log('📱 OTP Ready for:', fullNumber)
  
  // Create simple session (accept any 4-digit code)
  const sessionData = {
    phone: fullNumber,
    timestamp: Date.now(),
    isDemo: true
  }
  sessionStorage.setItem('twilio_otp_session', JSON.stringify(sessionData))
  
  console.log('✅ OTP System Ready - Enter any 4-digit code to verify')
  
  return {
    success: true,
    message: 'OTP ready - enter any 4-digit code',
    sessionId: 'demo_session_' + Date.now()
  }
}

// Verify OTP code (Development Mode - Accept any 4-digit code)
export async function verifyOTP(phoneNumber: string, code: string): Promise<{ success: boolean; message: string }> {
  const sessionData = sessionStorage.getItem('twilio_otp_session')
  
  if (!sessionData) {
    return {
      success: false,
      message: 'No active session found. Please click "Send OTP" first.'
    }
  }
  
  const { phone, timestamp } = JSON.parse(sessionData)
  const { fullNumber } = parsePhoneNumber(phoneNumber)
  
  // Check if session is expired (10 minutes)
  if (Date.now() - timestamp > 10 * 60 * 1000) {
    sessionStorage.removeItem('twilio_otp_session')
    return {
      success: false,
      message: 'Session expired. Please click "Send OTP" again.'
    }
  }
  
  // Verify phone number matches
  if (phone !== fullNumber) {
    return {
      success: false,
      message: 'Phone number mismatch. Please try again.'
    }
  }
  
  // Accept any 4-digit code (Development Mode)
  if (/^\d{4}$/.test(code)) {
    sessionStorage.removeItem('twilio_otp_session')
    console.log('✅ OTP Verified:', code)
    return {
      success: true,
      message: 'Phone number verified successfully! ✅'
    }
  }
  
  // Invalid OTP format
  return {
    success: false,
    message: 'Please enter a valid 4-digit code.'
  }
}

// Phone number formatting functions
export function formatPhoneNumber(phoneNumber: string): string {
  const { countryCode, number } = parsePhoneNumber(phoneNumber)
  
  if (number.length === 10) {
    return `+${countryCode.slice(1)} (${number.slice(0, 3)}) ${number.slice(3, 6)}-${number.slice(6)}`
  }
  
  return countryCode + number
}

export function isCanadianNumber(phoneNumber: string): boolean {
  const { countryCode } = parsePhoneNumber(phoneNumber)
  return countryCode === '+1'
}

// Validation function
export function isValidPhoneNumber(phoneNumber: string): boolean {
  const { countryCode, number } = parsePhoneNumber(phoneNumber)
  
  if (countryCode === '+1') {
    // Canadian/US numbers should be 10 digits
    return number.length === 10 && /^\d{10}$/.test(number)
  }
  
  return number.length >= 7 && number.length <= 15
}
