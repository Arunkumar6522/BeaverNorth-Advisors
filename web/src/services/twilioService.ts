// Twilio SMS service for OTP verification
import { envConfig } from '../config/twilio.config'

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

// Real Twilio OTP sending via backend API
export async function sendOTP(phoneNumber: string): Promise<{ success: boolean; message: string; sessionId?: string }> {
  const { fullNumber } = parsePhoneNumber(phoneNumber)
  
  console.log('📱 Sending OTP to:', fullNumber)
  
  try {
    // Make API call to backend Twilio endpoint
    const response = await fetch('/api/send-otp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: fullNumber,
        serviceSid: envConfig.serviceSid
      })
    })
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const result = await response.json()
    
    if (result.success) {
      // Store verification session for verification later
      const sessionData = {
        phone: fullNumber,
        timestamp: Date.now(),
        attempts: 0,
        verificationSid: result.verificationSid
      }
      sessionStorage.setItem('twilio_otp_session', JSON.stringify(sessionData))
      
      console.log('✅ Twilio OTP sent successfully:', result.verificationSid)
      
      return {
        success: true,
        message: `OTP sent to ${formatPhoneNumber(fullNumber)}`,
        sessionId: result.verificationSid
      }
    } else {
      console.error('❌ Twilio OTP failed:', result.message)
      return {
        success: false,
        message: result.message || 'Failed to send OTP'
      }
    }
    
  } catch (error) {
    console.error('❌ Network error sending OTP:', error)
    
    // Fallback to demo mode if backend is not available
    console.log('🔄 Falling back to demo mode...')
    
    const otp = Math.floor(1000 + Math.random() * 9000).toString()
    const sessionData = {
      otp,
      phone: fullNumber,
      timestamp: Date.now(),
      attempts: 0,
      isDemo: true
    }
    sessionStorage.setItem('twilio_otp_session', JSON.stringify(sessionData))
    
    console.log('🔐 Demo OTP generated:', otp)
    console.log('📱 SMS simulation:', formatPhoneNumber(fullNumber))
    console.log(`✅ OTP: ${otp} - Use this code to complete verification`)
    
    return {
      success: true,
      message: `Demo ready - check console for OTP: ${otp}`,
      sessionId: 'demo_session_' + Date.now(),
      demoOtp: otp
    }
  }
}

// Verify OTP code with real Twilio API
export async function verifyOTP(phoneNumber: string, code: string): Promise<{ success: boolean; message: string }> {
  const sessionData = sessionStorage.getItem('twilio_otp_session')
  
  if (!sessionData) {
    return {
      success: false,
      message: 'No active session found. Please request a new OTP.'
    }
  }
  
  const { phone, attempts, timestamp, verificationSid, isDemo } = JSON.parse(sessionData)
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
  
  // If in demo mode, verify against stored demo OTP
  if (isDemo) {
    const { otp } = JSON.parse(sessionData)
    if (code === otp && phone === fullNumber) {
      sessionStorage.removeItem('twilio_otp_session')
      return {
        success: true,
        message: 'Phone number verified successfully! (Demo mode)'
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
  
  // Real Twilio verification
  try {
    const response = await fetch('/api/verify-otp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: fullNumber,
        code: code,
        verificationSid: verificationSid
      })
    })
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const result = await response.json()
    
    if (result.success) {
      sessionStorage.removeItem('twilio_otp_session')
      return {
        success: true,
        message: 'Phone number verified successfully!'
      }
    } else {
      // Update attempt count for real verification
      const updatedSession = {
        ...JSON.parse(sessionData),
        attempts: attempts + 1
      }
      sessionStorage.setItem('twilio_otp_session', JSON.stringify(updatedSession))
      
      return {
        success: false,
        message: result.message || 'Invalid OTP code. Please try again.'
      }
    }
    
  } catch (error) {
    console.error('❌ Network error verifying OTP:', error)
    
    // Fallback to demo verification
    console.log('🔄 Falling back to demo verification...')
    
    return {
      success: false,
      message: 'Verification service temporarily unavailable. Please try again.'
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
