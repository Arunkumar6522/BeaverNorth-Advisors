// Twilio SMS service for OTP verification
// This will be used on the backend in a real implementation

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

// Simulate Twilio OTP sending
export async function sendOTP(phoneNumber: string): Promise<{ success: boolean; message: string; sessionId?: string }> {
  const { countryCode, number, fullNumber } = parsePhoneNumber(phoneNumber)
  
  console.log('📱 Sending OTP to:', fullNumber)
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  // Simulate OTP generation (in production, this would be 6 random digits)
  const otp = Math.floor(100000 + Math.random() * 900000).toString()
  
  // Store OTP in sessionStorage for demo purposes
  const sessionData = {
    otp,
    phone: fullNumber,
    timestamp: Date.now(),
    attempts: 0
  }
  sessionStorage.setItem('twilio_otp_session', JSON.stringify(sessionData))
  
  console.log('🔐 Generated OTP:', otp)
  
  // In production, you would make an API call to your backend:
  /*
  const response = await fetch('/api/send-otp', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      to: fullNumber,
      serviceSid: config.serviceSid
    })
  })
  
  const result = await response.json()
  return result
  */
  
  return {
    success: true,
    message: `OTP sent to ${fullNumber}`,
    sessionId: 'demo_session_' + Date.now()
  }
}

// Verify OTP code
export async function verifyOTP(phoneNumber: string, code: string): Promise<{ success: boolean; message: string }> {
  const sessionData = sessionStorage.getItem('twilio_otp_session')
  
  if (!sessionData) {
    return {
      success: false,
      message: 'No active session found. Please request a new OTP.'
    }
  }
  
  const { otp, phone, attempts, timestamp } = JSON.parse(sessionData)
  const { fullNumber } = parsePhoneNumber(phoneNumber)
  
  // Check if session is expired (5 minutes)
  if (Date.now() - timestamp > 5 * 60 * 1000) {
    sessionStorage.removeItem('twilio_otp_session')
    return {
      success: false,
      message: 'OTP expired. Please request a new OTP.'
    }
  }
  
  // Check attempt limit (3 attempts)
  if (attempts >= 3) {
    sessionStorage.removeItem('twilio_otp_session')
    return {
      success: false,
      message: 'Too many attempts. Please request a new OTP.'
    }
  }
  
  // Verify the code
  if (code === otp && phone === fullNumber) {
    sessionStorage.removeItem('twilio_otp_session')
    return {
      success: true,
      message: 'Phone number verified successfully!'
    }
  } else {
    // Update attempt count
    const updatedSession = {
      ...JSON.parse(sessionData),
      attempts: attempts + 1
    }
    sessionStorage.setItem('twilio_otp_session', JSON.stringify(updatedSession))
    
    return {
      success: false,
      message: 'Invalid OTP code. Please try again.'
    }
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
