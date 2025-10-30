import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '../lib/supabase'
import { useI18n } from '../i18n'
import { useNavigate } from 'react-router-dom'
import { gtagEvent } from '../lib/analytics'

interface ContactModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function ContactModal({ isOpen, onClose }: ContactModalProps) {
  const { locale } = useI18n()
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    gender: '' as 'male' | 'female' | 'prefer-not-to-say' | '',
    dob: '2001-03-29',
    smokingStatus: '',
    province: '',
    insuranceProduct: '',
    email: '',
    phone: '',
    countryCode: '+1',
    otp: ''
  })

  const [loading, setLoading] = useState(false)
  const [validationErrors, setValidationErrors] = useState<{[key: string]: string}>({})
  const [otpSent, setOtpSent] = useState(false)
  const [otpResendTimer, setOtpResendTimer] = useState(0)
  const [sendingOtp, setSendingOtp] = useState(false)
  const [otpStatus, setOtpStatus] = useState<string>('')
  const [submitError, setSubmitError] = useState<string>('')

  const dobPickerRef = useRef<HTMLInputElement>(null)

  // OTP Timer Effect
  useEffect(() => {
    let interval: number
    if (otpResendTimer > 0) {
      interval = setInterval(() => {
        setOtpResendTimer((prev) => prev - 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [otpResendTimer])

  // Keep native date input in sync with state
  useEffect(() => {
    if (dobPickerRef.current) {
      try {
        dobPickerRef.current.value = formData.dob || ''
      } catch {}
    }
  }, [formData.dob])

  const sendOTP = async () => {
    if (sendingOtp || otpResendTimer > 0) return
    setOtpStatus('')
    setSendingOtp(true)
    try {
      const phoneNumber = `${formData.countryCode}${formData.phone.replace(/\D/g, '')}`
      gtagEvent('form_start', { form_id: 'enquiry', step: 'otp_send' })
      
      const apiUrl = window.location.hostname === 'localhost' 
        ? 'http://localhost:3001/api/send-otp'
        : '/.netlify/functions/send-otp'
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to: phoneNumber })
      })
      const result = await response.json()
      
      if (result.success) {
        setOtpSent(true)
        setOtpResendTimer(30)
        setOtpStatus('Verification code sent successfully.')
        gtagEvent('otp_sent', { form_id: 'enquiry' })
      } else {
        setOtpStatus(result.message || 'Failed to send verification code. Please try again.')
      }
    } catch (error) {
      setOtpStatus('Failed to send verification code. Please try again.')
    } finally {
      setSendingOtp(false)
    }
  }

  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitError('')
    setLoading(true)
    try {
      await verifyOTPAndSubmit()
      onClose()
      gtagEvent('lead_submit_success', { form_id: 'enquiry' })
      navigate('/success', { state: { submitted: true } })
    } catch (error: any) {
      const errorMessage = error?.message || 'Unknown error occurred'
      // If OTP failed, only show inline OTP error, not global submit error
      if (errorMessage === '__OTP__') {
        setLoading(false)
        return
      }
      gtagEvent('lead_submit_error', { form_id: 'enquiry', error: errorMessage })
      setSubmitError(errorMessage)
      setLoading(false)
    }
  }

  const verifyOTPAndSubmit = async () => {
    try {
      const phoneNumber = `${formData.countryCode}${formData.phone.replace(/\D/g, '')}`
      const apiUrl = window.location.hostname === 'localhost' 
        ? 'http://localhost:3001/api/verify-otp'
        : '/.netlify/functions/verify-otp'
      const verifyResponse = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to: phoneNumber, code: formData.otp })
      })
      const verifyResult = await verifyResponse.json()
      if (!verifyResult.success) {
        setValidationErrors(prev => ({ ...prev, otp: verifyResult.message || 'OTP verification failed' }))
        // Throw special token so submit handler doesn't show global error
        throw new Error('__OTP__')
      }
      gtagEvent('otp_verified', { form_id: 'enquiry' })
      await saveLeadToSupabase()
    } catch (error: any) {
      throw error
    }
  }

  const saveLeadToSupabase = async () => {
    try {
      // Validate required fields
      if (!formData.firstName || !formData.phone) {
        throw new Error('Missing required fields: first name or phone')
      }

      if (!formData.dob || !formData.smokingStatus || !formData.province || !formData.insuranceProduct) {
        throw new Error('Missing required fields: dob, smoking status, province, or insurance product')
      }
      
      // Check for validation errors
      if (validationErrors.firstName || validationErrors.lastName || validationErrors.email) {
        throw new Error('Please fix validation errors before submitting')
      }
      
      // Additional validation checks
      if (!validateName(formData.firstName)) {
        throw new Error('First name contains invalid characters')
      }
      
      if (formData.lastName && !validateName(formData.lastName)) {
        throw new Error('Last name contains invalid characters')
      }
      
      if (formData.email && !validateEmail(formData.email)) {
        throw new Error('Please enter a valid email address')
      }

      const leadData = {
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        email: formData.email,
        phone: `${formData.countryCode}${formData.phone.replace(/\D/g, '')}`,
        dob: formData.dob,
        province: formData.province,
        country_code: formData.countryCode,
        smoking_status: formData.smokingStatus,
        insurance_product: formData.insuranceProduct,
        status: 'new',
        gender: formData.gender || null
      }

      console.log('💾 Attempting to save lead to Supabase...')
      console.log('📋 Lead data:', leadData)
      
      // Check if we're using mock client (demo mode)
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://demo-project.supabase.co'
      const isMockClient = supabaseUrl === 'https://demo-project.supabase.co'
      
      if (isMockClient) {
        console.log('⚠️ Demo mode: Lead data would be saved to database')
        console.log('📊 Lead data (demo):', leadData)
        // In demo mode, we'll just log the data and continue
        return
      }
      
      // Real Supabase integration
      console.log('🔗 Supabase client loaded, inserting data...')
      
      const { data, error } = await supabase
        .from('leads')
        .insert([leadData])
        .select()
      
      if (error) {
        console.error('❌ Supabase error details:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        })
        throw new Error(`Database error: ${error.message}${error.hint ? ` (${error.hint})` : ''}`)
      }
      
      if (!data || data.length === 0) {
        throw new Error('No data returned from database after insert')
      }
      
      console.log('✅ Lead saved successfully to Supabase!')
      console.log('📊 Saved data:', data)
      
      // Log the lead creation activity
      try {
        console.log('📝 Attempting to log lead creation activity...')
        
        if (isMockClient) {
          console.log('⚠️ Demo mode: Activity logging skipped')
          return
        }
        
        const { error: logError } = await supabase
          .from('activity_log')
          .insert({
            lead_id: data[0].id,
            activity_type: 'lead_created',
            description: `New lead submitted: ${formData.firstName}`,
            new_value: formData.insuranceProduct,
            performed_by: 'System'
          })

        if (logError) {
          console.error('❌ Error logging activity:', logError)
          console.error('❌ Error details:', logError.message, logError.details, logError.hint)
          
          if (logError.message.includes('relation "activity_log" does not exist')) {
            console.error('🚨 ACTIVITY_LOG TABLE DOES NOT EXIST!')
            console.error('📋 Please run the SQL script in Supabase SQL Editor first!')
            
            // TEMPORARY: Store in localStorage as fallback
            const tempActivity = {
              id: Date.now().toString(),
              lead_id: data[0].id,
              activity_type: 'lead_created',
              description: `New lead submitted: ${formData.firstName}`,
              new_value: formData.insuranceProduct,
              performed_by: 'System',
              created_at: new Date().toISOString()
            }
            
            const existingActivities = JSON.parse(localStorage.getItem('temp_activities') || '[]')
            existingActivities.unshift(tempActivity)
            localStorage.setItem('temp_activities', JSON.stringify(existingActivities.slice(0, 20))) // Keep last 20
            
            console.log('💾 Activity saved to localStorage as fallback')
          }
        } else {
          console.log('✅ Activity logged: lead_created')
        }
      } catch (logError) {
        console.error('❌ Error logging activity:', logError)
      }
      
      // Send email notification
      try {
        console.log('📧 Sending lead notification email...')
        
        // Use Netlify function in production, local server in development
        const emailApiUrl = window.location.hostname === 'localhost' 
          ? 'http://localhost:3001/api/send-lead-notification'
          : '/.netlify/functions/send-lead-notification'
        
        const emailResponse = await fetch(emailApiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            leadData: {
              name: leadData.name,
              email: leadData.email,
              phone: leadData.phone,
              dob: leadData.dob,
              province: leadData.province,
              smokingStatus: leadData.smoking_status,
              insuranceProduct: leadData.insurance_product,
              notes: ''
            }
          })
        })
        
        if (emailResponse.ok) {
          const emailResult = await emailResponse.json()
          console.log('✅ Lead notification email sent:', emailResult.message)
        } else {
          console.log('⚠️ Failed to send lead notification email')
        }
      } catch (emailError) {
        console.error('❌ Email notification error:', emailError)
      }

      // Send SMS notification
      try {
        console.log('📱 Sending lead notification SMS...')
        
        // Use Netlify function in production, local server in development
        const smsApiUrl = window.location.hostname === 'localhost' 
          ? 'http://localhost:3001/api/send-lead-sms'
          : '/.netlify/functions/send-lead-sms'
        
        const smsResponse = await fetch(smsApiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            leadData: {
              name: leadData.name,
              email: leadData.email,
              phone: leadData.phone,
              dob: leadData.dob,
              province: leadData.province,
              smokingStatus: leadData.smoking_status,
              insuranceProduct: leadData.insurance_product,
              notes: ''
            }
          })
        })
        
        if (smsResponse.ok) {
          const smsResult = await smsResponse.json()
          console.log('✅ Lead notification SMS sent:', smsResult.message)
        } else {
          console.log('⚠️ Failed to send lead notification SMS')
        }
      } catch (smsError) {
        console.error('❌ SMS notification error:', smsError)
      }
      
    } catch (error: any) {
      console.error('🔴 Error saving lead - Full details:', error)
      throw error
    }
  }

  // Validation functions
  const validateName = (name: string) => {
    // Allow only letters, spaces, hyphens, and apostrophes
    const nameRegex = /^[a-zA-Z\s\-']+$/
    return nameRegex.test(name)
  }

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  // Helpers for DOB
  const formatDobInput = (raw: string) => {
    const digits = raw.replace(/\D/g, '').slice(0, 8)
    const mm = digits.slice(0, 2)
    const dd = digits.slice(2, 4)
    const yyyy = digits.slice(4, 8)
    if (digits.length <= 2) return mm
    if (digits.length <= 4) return `${mm}/${dd}`
    return `${mm}/${dd}/${yyyy}`
  }

  const maxDobDate = () => {
    const d = new Date()
    d.setHours(23, 59, 59, 999)
    return d
  }

  const parseDobToISO = (mmddyyyy: string): string | null => {
    const m = mmddyyyy.match(/^(\d{2})\/(\d{2})\/(\d{4})$/)
    if (!m) return null
    const month = Number(m[1])
    const day = Number(m[2])
    const year = Number(m[3])
    if (month < 1 || month > 12) return null
    if (day < 1 || day > 31) return null
    const dt = new Date(year, month - 1, day)
    if (isNaN(dt.getTime()) || dt.getMonth() !== month - 1 || dt.getDate() !== day || dt.getFullYear() !== year) return null
    if (dt > maxDobDate()) return null
    return `${year.toString().padStart(4, '0')}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    
    // Clear validation errors when user starts typing
    if (validationErrors[name]) {
      setValidationErrors(prev => ({ ...prev, [name]: '' }))
    }
    
    // Special validation for name fields
    if (name === 'firstName' || name === 'lastName') {
      if (value === '' || validateName(value)) {
        setFormData({
          ...formData,
          [name]: value
        })
      } else {
        // Show validation error for invalid characters
        setValidationErrors(prev => ({ 
          ...prev, 
          [name]: `${name === 'firstName' ? 'First name' : 'Last name'} can only contain letters, spaces, hyphens, and apostrophes` 
        }))
      }
      return
    }

    // DOB typed input with MM/DD/YYYY and min age 25
    if (name === 'dob') {
      const formatted = formatDobInput(value)
      const iso = parseDobToISO(formatted)
      setFormData(prev => ({ ...prev, dob: iso ?? formatted }))
      if (!iso && formatted.length === 10) {
        setValidationErrors(prev => ({ ...prev, dob: 'Enter a valid date (MM/DD/YYYY).' }))
      } else if (iso) {
        setValidationErrors(prev => ({ ...prev, dob: '' }))
      }
      return
    }
    
    // Special validation for email field
    if (name === 'email') {
      setFormData({
        ...formData,
        [name]: value
      })
      
      // Validate email format
      if (value && !validateEmail(value)) {
        setValidationErrors(prev => ({ 
          ...prev, 
          [name]: 'Please enter a valid email address' 
        }))
      }
      return
    }
    
    // Special validation for smoking status - allow toggle
    if (name === 'smokingStatus') {
      setFormData({
        ...formData,
        [name]: value
      })
      return
    }
    
    // Default case for all other fields (gender, province, insuranceProduct, phone, countryCode, otp)
    setFormData({
      ...formData,
      [name]: value
    })
  }

  if (!isOpen) return null

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.6)',
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      backdropFilter: 'blur(4px)'
    }} onClick={onClose}>
      
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ duration: 0.3 }}
        style={{
          background: '#ffffff',
          borderRadius: '24px',
          padding: window.innerWidth < 768 ? '24px' : '40px',
          width: '100%',
          maxWidth: window.innerWidth < 768 ? '95vw' : '420px',
          maxHeight: '90vh',
          overflow: 'auto',
          boxShadow: '0 32px 64px rgba(0,0,0,0.12)',
          border: '1px solid rgba(0,0,0,0.08)',
          position: 'relative',
          margin: window.innerWidth < 768 ? '16px' : '0'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            border: 'none',
            fontSize: '20px',
            cursor: 'pointer',
            color: '#9CA3AF',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '50%',
            background: 'transparent',
            transition: 'all 0.2s ease'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.background = '#F3F4F6'
            e.currentTarget.style.color = '#374151'
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = 'transparent'
            e.currentTarget.style.color = '#9CA3AF'
          }}
        >
          ×
        </button>

        {/* Header (no logo) */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                  <h2 style={{ 
            margin: '0 0 8px 0', 
            color: '#111827', 
            fontSize: '24px',
            fontWeight: '600',
            letterSpacing: '-0.02em'
          }}>
                    {currentStep === 1 ? (locale === 'fr' ? 'Commencer' : 'Get Started') : 
                     currentStep === 2 ? (locale === 'fr' ? `Salut ${formData.firstName} 👋` : `Hi ${formData.firstName} 👋`) :
                     (locale === 'fr' ? 'Presque terminé' : 'Almost Done')}
          </h2>
          <p style={{ 
            margin: '0 0 24px 0', 
            color: '#6B7280', 
            fontSize: '15px',
            fontWeight: '400'
          }}>
                    {currentStep === 1 ? (locale === 'fr' ? 'Parlez-nous de vous' : 'Tell us about yourself') : 
                     currentStep === 2 ? (locale === 'fr' ? 'Aidez-nous à personnaliser votre devis' : 'Help us personalize your quote') :
                     (locale === 'fr' ? 'Vérifiez vos coordonnées' : 'Verify your contact information')}
          </p>
          
          {/* Progress Bar */}
          <div style={{ 
            width: '100%', 
            height: '4px', 
            background: 'var(--surface-2)', 
            borderRadius: '2px', 
            overflow: 'hidden',
            marginBottom: '8px'
          }}>
            <motion.div
              initial={{ width: '0%' }}
              animate={{ width: `${(currentStep / 3) * 100}%` }}
              transition={{ duration: 0.3 }}
              style={{
                height: '100%',
                background: 'rgb(255, 203, 5)',
                borderRadius: '2px'
              }}
            />
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'center', gap: '6px' }}>
            {[1, 2, 3].map((step) => (
              <div
                key={step}
                style={{
                  width: step === currentStep ? '24px' : '8px',
                  height: '3px',
                  borderRadius: '2px',
                  background: step <= currentStep ? '#22C55E' : '#E5E7EB',
                  transition: 'all 0.3s ease'
                }}
              />
            ))}
          </div>
        </div>

        <div>
          {/* Step 1: Personal Information */}
            {currentStep === 1 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                style={{ display: 'grid', gap: '20px' }}
              >
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: window.innerWidth < 768 ? '1fr' : 'repeat(auto-fit, minmax(200px, 1fr))', 
                  gap: '32px', 
                  alignItems: 'start' 
                }}>
                  <div>
                    <label style={{ 
                              display: 'block', 
                              fontSize: '14px', 
                              fontWeight: '500', 
                              color: '#374151',
                              marginBottom: '8px'
                            }}>
                      {locale === 'fr' ? 'Prénom' : 'First name'} <span style={{ color: '#EF4444' }}>*</span>
                            </label>
                            <input
                              type="text"
                              name="firstName"
                              placeholder={locale === 'fr' ? 'Votre prénom' : 'Your first name'}
                              value={formData.firstName}
                              onChange={handleChange}
                              required
                              maxLength={25}
                              style={{
                                width: '100%',
                                padding: '14px 16px',
                                border: `2px solid ${validationErrors.firstName ? '#EF4444' : 'var(--line)'}`,
                                borderRadius: '12px',
                                fontSize: '16px',
                                background: '#ffffff',
                                color: '#111827',
                                outline: 'none',
                                transition: 'border-color 0.2s',
                                height: '48px',
                                boxSizing: 'border-box'
                              }}
                              onFocus={(e) => e.target.style.borderColor = validationErrors.firstName ? '#EF4444' : '#22C55E'}
                              onBlur={(e) => e.target.style.borderColor = validationErrors.firstName ? '#EF4444' : 'var(--line)'}
                            />
                            {validationErrors.firstName && (
                              <p style={{
                                color: '#EF4444',
                                fontSize: '12px',
                                margin: '4px 0 0 0',
                                fontWeight: '500'
                              }}>
                                {validationErrors.firstName}
                              </p>
                            )}
                  </div>
                  
                  <div>
                    <label style={{ 
                              display: 'block', 
                              fontSize: '14px', 
                              fontWeight: '500', 
                              color: '#374151',
                              marginBottom: '8px'
                            }}>
                      {locale === 'fr' ? 'Nom de famille' : 'Last name'} <span style={{ color: '#6B7280' }}>({locale === 'fr' ? 'optionnel' : 'optional'})</span>
                            </label>
                            <input
                              type="text"
                              name="lastName"
                              placeholder={locale === 'fr' ? 'Votre nom de famille' : 'Your last name'}
                              value={formData.lastName}
                              onChange={handleChange}
                              maxLength={25}
                              style={{
                                width: '100%',
                                padding: '14px 16px',
                                border: `2px solid ${validationErrors.lastName ? '#EF4444' : 'var(--line)'}`,
                                borderRadius: '12px',
                                fontSize: '16px',
                                background: '#ffffff',
                                color: '#111827',
                                outline: 'none',
                                transition: 'border-color 0.2s',
                                height: '48px',
                                boxSizing: 'border-box'
                              }}
                              onFocus={(e) => e.target.style.borderColor = validationErrors.lastName ? '#EF4444' : '#22C55E'}
                              onBlur={(e) => e.target.style.borderColor = validationErrors.lastName ? '#EF4444' : 'var(--line)'}
                            />
                            {validationErrors.lastName && (
                              <p style={{
                                color: '#EF4444',
                                fontSize: '12px',
                                margin: '4px 0 0 0',
                                fontWeight: '500'
                              }}>
                                {validationErrors.lastName}
                              </p>
                            )}
                  </div>
                </div>

                <div>
                  <label style={{ 
                    display: 'block', 
                    fontSize: '14px', 
                    fontWeight: '500', 
                    color: '#374151',
                    marginBottom: '8px'
                  }}>
                    {locale === 'fr' ? 'Genre' : 'Gender'} <span style={{ color: '#EF4444' }}>*</span>
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    required
                    style={{
                      width: '100%',
                      padding: '14px 16px',
                      border: '2px solid var(--line)',
                      borderRadius: '12px',
                      fontSize: '14px',
                      background: '#ffffff',
                      color: '#111827',
                      outline: 'none',
                      height: '48px',
                      lineHeight: '20px',
                      boxSizing: 'border-box'
                    }}
                  >
                    <option value="male">{locale === 'fr' ? 'Homme' : 'Male'}</option>
                    <option value="female">{locale === 'fr' ? 'Femme' : 'Female'}</option>
                    <option value="prefer-not-to-say">{locale === 'fr' ? 'Préfère ne pas répondre' : 'Prefer not to say'}</option>
                  </select>
                </div>

                <div>
                  <label style={{ 
                    display: 'block', 
                    fontSize: '14px', 
                    fontWeight: 600, 
                    color: 'var(--text-primary)',
                    marginBottom: '8px'
                  }}>
                    {locale === 'fr' ? 'Quand êtes‑vous né(e) ?' : 'When were you born?'} <span style={{ color: '#EF4444' }}>*</span>
                  </label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <div style={{ position: 'relative', width: '100%' }}>
                      <input
                        type="text"
                        name="dob"
                        placeholder="MM/DD/YYYY"
                        value={formData.dob.length === 10 && formData.dob.includes('-') ? (() => { const [y,m,d]=formData.dob.split('-'); return `${m}/${d}/${y}` })() : formData.dob}
                        onChange={handleChange}
                        maxLength={10}
                        style={{
                          width: '100%',
                          padding: '14px 44px 14px 16px',
                          border: `2px solid ${validationErrors.dob ? '#EF4444' : 'var(--line)'}`,
                          borderRadius: '12px',
                          fontSize: '16px',
                          background: 'var(--surface-1)',
                          color: 'var(--text-primary)',
                          outline: 'none',
                          height: '48px',
                          boxSizing: 'border-box'
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => dobPickerRef.current?.showPicker?.() || dobPickerRef.current?.click()}
                        aria-label="Pick date"
                        style={{
                          position: 'absolute',
                          right: '10px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          border: 'none',
                          background: 'transparent',
                          cursor: 'pointer',
                          color: '#6B7280',
                          fontSize: '18px',
                          padding: 0
                        }}
                      >
                        📅
                      </button>
                    </div>
                    <input
                      ref={dobPickerRef}
                      type="date"
                      aria-hidden="true"
                      tabIndex={-1}
                      style={{ position: 'absolute', opacity: 0, pointerEvents: 'none', width: 0, height: 0 }}
                      max={(function(){ const d=new Date(); const y=d.getFullYear(); const m=String(d.getMonth()+1).padStart(2,'0'); const day=String(d.getDate()).padStart(2,'0'); return `${y}-${m}-${day}`})()}
                      onChange={(e) => {
                        const iso = e.target.value // already YYYY-MM-DD
                        if (iso) {
                          const picked = new Date(iso)
                          if (picked > maxDobDate()) {
                            setValidationErrors(prev => ({ ...prev, dob: 'Date cannot be in the future.' }))
                            setFormData(prev => ({ ...prev, dob: '' }))
                          } else {
                            setValidationErrors(prev => ({ ...prev, dob: '' }))
                            setFormData(prev => ({ ...prev, dob: iso }))
                          }
                        }
                      }}
                    />
                  </div>
                  {validationErrors.dob && (
                    <p style={{ color: '#EF4444', fontSize: '12px', margin: '4px 0 0 0', fontWeight: 500 }}>
                      {validationErrors.dob}
                    </p>
                  )}
                </div>

                <button
                  type="button"
                  onClick={nextStep}
                  disabled={!formData.firstName || !formData.dob || !!validationErrors.firstName || !!validationErrors.dob}
                  style={{
                    width: '100%',
                    background: (!formData.firstName || !formData.dob || validationErrors.firstName || validationErrors.dob) ? 'var(--line)' : 'rgb(255, 203, 5)',
                    color: '#1E377C',
                    padding: '16px',
                    borderRadius: '12px',
                    border: 'none',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: (!formData.firstName || !formData.dob || validationErrors.firstName || validationErrors.dob) ? 'not-allowed' : 'pointer',
                    marginTop: '12px'
                  }}
                >
                  {locale === 'fr' ? 'Étape suivante' : 'Next Step'}
                </button>
              </motion.div>
            )}

            {/* Step 2: Insurance Preferences */}
            {currentStep === 2 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                style={{ display: 'grid', gap: '20px' }}
              >
                <div>
                  <label style={{ 
                    display: 'block', 
                    fontSize: '14px', 
                    fontWeight: 600, 
                    color: 'var(--text-primary)',
                    marginBottom: '12px'
                  }}>
                    {locale === 'fr' ? 'Êtes‑vous non‑fumeur ou fumeur ? *' : 'Are you a smoker or non-smoker? *'}
                  </label>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <label style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '8px', 
                      cursor: 'pointer',
                      padding: '12px 16px',
                      border: `2px solid ${formData.smokingStatus === 'non-smoker' ? 'rgb(255, 203, 5)' : 'var(--line)'}`,
                      borderRadius: '8px',
                      background: formData.smokingStatus === 'non-smoker' ? 'rgb(255, 203, 5)' : 'var(--surface-1)',
                      color: formData.smokingStatus === 'non-smoker' ? '#1E377C' : 'var(--text-primary)',
                      transition: 'all 0.2s',
                      opacity: 1,
                      pointerEvents: 'auto'
                    }}>
                      <input
                        type="radio"
                        name="smokingStatus"
                        value="non-smoker"
                        checked={formData.smokingStatus === 'non-smoker'}
                        onChange={handleChange}
                        required
                        style={{ display: 'none' }}
                      />
                      <span style={{ fontSize: '14px', fontWeight: 500 }}>{locale === 'fr' ? 'Non‑fumeur' : 'Non-Smoker'}</span>
                    </label>
                    <label style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '8px', 
                      cursor: 'pointer',
                      padding: '12px 16px',
                      border: `2px solid ${formData.smokingStatus === 'smoker' ? 'var(--brand-yellow)' : 'var(--line)'}`,
                      borderRadius: '8px',
                      background: formData.smokingStatus === 'smoker' ? 'var(--brand-yellow)' : 'var(--surface-1)',
                      color: formData.smokingStatus === 'smoker' ? '#1E377C' : 'var(--text-primary)',
                      transition: 'all 0.2s',
                      opacity: 1,
                      pointerEvents: 'auto'
                    }}>
                      <input
                        type="radio"
                        name="smokingStatus"
                        value="smoker"
                        checked={formData.smokingStatus === 'smoker'}
                        onChange={handleChange}
                        required
                        style={{ display: 'none' }}
                      />
                      <span style={{ fontSize: '14px', fontWeight: 500 }}>{locale === 'fr' ? 'Fumeur' : 'Smoker'}</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label style={{ 
                    display: 'block', 
                    fontSize: '14px', 
                    fontWeight: 600, 
                    color: 'var(--text-primary)',
                    marginBottom: '8px'
                  }}>
                    {locale === 'fr' ? "Quel type d'assurance recherchez‑vous ? *" : 'What type of insurance are you looking for? *'}
                  </label>
                  <select
                    name="insuranceProduct"
                    value={formData.insuranceProduct}
                    onChange={handleChange}
                    required
                    style={{
                      width: '100%',
                      padding: '14px 16px',
                      border: '2px solid var(--line)',
                      borderRadius: '12px',
                      fontSize: '16px',
                      background: 'var(--surface-1)',
                      color: 'var(--text-primary)',
                      outline: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    <option value="">{locale === 'fr' ? "Choisissez un type d'assurance" : 'Select insurance type'}</option>
                    <option value="term-life">{locale === 'fr' ? 'Assurance vie temporaire' : 'Term Life Insurance'}</option>
                    <option value="whole-life">{locale === 'fr' ? 'Assurance vie entière' : 'Whole Life Insurance'}</option>
                    <option value="non-medical">{locale === 'fr' ? 'Assurance vie sans examen médical' : 'Non-Medical Life Insurance'}</option>
                    <option value="mortgage-life">{locale === 'fr' ? 'Assurance vie hypothécaire' : 'Mortgage Life Insurance'}</option>
                    <option value="senior-life">{locale === 'fr' ? 'Assurance vie pour aînés' : 'Senior Life Insurance'}</option>
                    <option value="travel">{locale === 'fr' ? 'Assurance voyage' : 'Travel Insurance'}</option>
                  </select>
                </div>

                <div>
                  <label style={{ 
                    display: 'block', 
                    fontSize: '14px', 
                    fontWeight: 600, 
                    color: 'var(--text-primary)',
                    marginBottom: '8px'
                  }}>
                    {locale === 'fr' ? 'Dans quelle province êtes‑vous ? *' : 'Which province are you in? *'}
                  </label>
                  <select
                    name="province"
                    value={formData.province}
                    onChange={handleChange}
                    required
                    style={{
                      width: '100%',
                      padding: '14px 16px',
                      border: '2px solid var(--line)',
                      borderRadius: '12px',
                      fontSize: '16px',
                      background: 'var(--surface-1)',
                      color: 'var(--text-primary)',
                      outline: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    <option value="">{locale === 'fr' ? 'Sélectionnez votre province' : 'Select your province'}</option>
                    <option value="Alberta">Alberta</option>
                    <option value="British Columbia">British Columbia</option>
                    <option value="Manitoba">Manitoba</option>
                    <option value="New Brunswick">New Brunswick</option>
                    <option value="Newfoundland and Labrador">Newfoundland and Labrador</option>
                    <option value="Northwest Territories">Northwest Territories</option>
                    <option value="Nova Scotia">Nova Scotia</option>
                    <option value="Nunavut">Nunavut</option>
                    <option value="Ontario">Ontario</option>
                    <option value="Prince Edward Island">Prince Edward Island</option>
                    <option value="Quebec">Quebec</option>
                    <option value="Saskatchewan">Saskatchewan</option>
                    <option value="Yukon">Yukon</option>
                  </select>
                </div>

                <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                  <button
                    type="button"
                    onClick={prevStep}
                    style={{
                      flex: 1,
                      background: 'transparent',
                      color: 'var(--text-primary)',
                      padding: '16px',
                      borderRadius: '12px',
                      border: '2px solid var(--line)',
                      fontSize: '16px',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={nextStep}
                    disabled={!formData.smokingStatus || !formData.insuranceProduct || !formData.province}
                    style={{
                      flex: 2,
                      background: !formData.smokingStatus || !formData.insuranceProduct || !formData.province ? 'var(--line)' : 'rgb(255, 203, 5)',
                      color: '#1E377C',
                      padding: '16px',
                      borderRadius: '12px',
                      border: 'none',
                      fontSize: '16px',
                      fontWeight: '600',
                      cursor: !formData.smokingStatus || !formData.insuranceProduct || !formData.province ? 'not-allowed' : 'pointer'
                    }}
                  >
                    {locale === 'fr' ? 'Étape suivante' : 'Next Step'}
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 3: Contact Information */}
            {currentStep === 3 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                style={{ display: 'grid', gap: '20px' }}
              >
                <div>
                  <label style={{ 
                    display: 'block', 
                    fontSize: '14px', 
                    fontWeight: 600, 
                    color: 'var(--text-primary)',
                    marginBottom: '8px'
                  }}>
                    {locale === 'fr' ? 'Adresse e-mail' : 'Email Address'} <span style={{ color: '#6B7280' }}>({locale === 'fr' ? 'optionnel' : 'optional'})</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    placeholder="your.email@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '14px 16px',
                      border: `2px solid ${validationErrors.email ? '#EF4444' : 'var(--line)'}`,
                      borderRadius: '12px',
                      fontSize: '16px',
                      background: 'var(--surface-1)',
                      color: 'var(--text-primary)',
                      outline: 'none',
                      transition: 'border-color 0.2s'
                    }}
                    onFocus={(e) => e.target.style.borderColor = validationErrors.email ? '#EF4444' : '#22C55E'}
                    onBlur={(e) => e.target.style.borderColor = validationErrors.email ? '#EF4444' : 'var(--line)'}
                  />
                  {validationErrors.email && (
                    <p style={{
                      color: '#EF4444',
                      fontSize: '12px',
                      margin: '4px 0 0 0',
                      fontWeight: '500'
                    }}>
                      {validationErrors.email}
                    </p>
                  )}
                </div>

                <div>
                  <label style={{ 
                    display: 'block', 
                    fontSize: '14px', 
                    fontWeight: 600, 
                    color: 'var(--text-primary)',
                    marginBottom: '8px'
                  }}>
                    {locale === 'fr' ? 'Numéro de téléphone *' : 'Phone Number *'}
                  </label>
                  <p style={{ 
                    fontSize: '12px',
                    color: 'var(--text-secondary)',
                    marginBottom: '12px'
                  }}>
                    {locale === 'fr' ? '📱 Nous vous contacterons à ce numéro' : "📱 We'll contact you at this number"}
                  </p>
                  <div style={{ display: 'flex', gap: '0' }}>
                    <select
                      name="countryCode"
                      value={formData.countryCode}
                      onChange={handleChange}
                      style={{
                        padding: '14px 16px',
                        border: '2px solid var(--line)',
                        borderRight: 'none',
                        borderRadius: '12px 0 0 12px',
                        fontSize: '16px',
                        background: 'var(--surface-1)',
                        color: 'var(--text-primary)',
                        minWidth: '120px',
                        outline: 'none',
                        cursor: 'pointer'
                      }}
                    >
                      <option value="+1">🇨🇦 +1 (Canada)</option>
                      <option value="+91">🇮🇳 +91 (India)</option>
                    </select>
                    <input
                      type="tel"
                      name="phone"
                      placeholder="5551234567"
                      onFocus={(e) => {
                        if (!formData.phone) {
                          e.target.value = ''
                        }
                      }}
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      style={{
                        flex: 1,
                        padding: '14px 16px',
                        border: '2px solid var(--line)',
                        borderLeft: 'none',
                        borderRadius: '0 12px 12px 0',
                        fontSize: '16px',
                        background: 'var(--surface-1)',
                        color: 'var(--text-primary)',
                        outline: 'none'
                      }}
                    />
                  </div>
                </div>

                {/* OTP Section */}
                <div>
                  <label style={{ 
                    display: 'block', 
                    fontSize: '14px', 
                    fontWeight: 600, 
                    color: 'var(--text-primary)',
                    marginBottom: '8px'
                  }}>
                    {locale === 'fr' ? 'Vérification du téléphone *' : 'Phone Verification *'}
                  </label>
                  <p style={{ 
                    fontSize: '12px',
                    color: 'var(--text-secondary)',
                    marginBottom: '16px'
                  }}>
                    {locale === 'fr' ? '🔐 Nous enverrons un code de vérification sur votre téléphone' : "🔐 We'll send a verification code to your phone"}
                  </p>
                  
                  {/* Send OTP Button */}
                  <div style={{ marginBottom: '16px' }}>
                    <button
                      type="button"
                      onClick={sendOTP}
                      disabled={!formData.phone || sendingOtp || otpResendTimer > 0}
                      style={{
                        width: '100%',
                        padding: '16px',
                        border: '2px solid rgb(255, 203, 5)',
                        borderRadius: '12px',
                        background: (!formData.phone || sendingOtp || otpResendTimer > 0) ? 'var(--line)' : 'rgb(255, 203, 5)',
                        color: (!formData.phone || sendingOtp || otpResendTimer > 0) ? 'var(--text-secondary)' : '#1E377C',
                        fontSize: '16px',
                        fontWeight: '600',
                        cursor: (!formData.phone || sendingOtp || otpResendTimer > 0) ? 'not-allowed' : 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      {sendingOtp ? (locale === 'fr' ? 'Envoi…' : 'Sending...') : 
                       otpResendTimer > 0 ? (locale === 'fr' ? `Renvoyer dans ${otpResendTimer}s` : `Resend in ${otpResendTimer}s`) : 
                       (locale === 'fr' ? 'Envoyer le code de vérification' : 'Send Verification Code')}
                    </button>
                    {otpStatus && (
                      <p style={{ marginTop: 8, fontSize: 12, color: '#6B7280' }}>{otpStatus}</p>
                    )}
                  </div>

                  {/* OTP Input - Only show after OTP is sent */}
                  {otpSent && (
                    <div>
                      <label style={{ 
                        display: 'block', 
                        fontSize: '14px', 
                        fontWeight: 600, 
                        color: 'var(--text-primary)',
                        marginBottom: '8px'
                      }}>
                        {locale === 'fr' ? 'Entrez le code de vérification *' : 'Enter Verification Code *'}
                      </label>
                      <p style={{ 
                        fontSize: '12px',
                        color: 'var(--text-secondary)',
                        marginBottom: '12px'
                      }}>
                        {locale === 'fr' ? '📱 Entrez le code à 6 chiffres envoyé à ' : '📱 Enter the 6-digit code sent to '}{formData.countryCode}{formData.phone}
                      </p>
                      <input
                        type="text"
                        name="otp"
                        placeholder="123456"
                        value={formData.otp}
                        onChange={(e) => {
                          // clear OTP-specific and global submit errors while user edits
                          if (submitError) setSubmitError('')
                          if (validationErrors.otp) setValidationErrors(prev => ({ ...prev, otp: '' }))
                          handleChange(e as any)
                        }}
                        maxLength={6}
                        style={{
                          width: '100%',
                          padding: '14px 16px',
                          border: `2px solid ${validationErrors.otp ? '#EF4444' : 'var(--line)'}`,
                          borderRadius: '12px',
                          fontSize: '18px',
                          background: 'var(--surface-1)',
                          color: 'var(--text-primary)',
                          outline: 'none',
                          textAlign: 'center',
                          letterSpacing: '3px',
                          fontFamily: 'monospace'
                        }}
                      />
                      {validationErrors.otp && (
                        <p style={{ color: '#EF4444', fontSize: 12, marginTop: 6 }}>{validationErrors.otp}</p>
                      )}
                    </div>
                  )}
                </div>

                <form onSubmit={handleSubmit} style={{ marginTop: '24px' }}>
                  <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
                    <button
                      type="button"
                      onClick={prevStep}
                      style={{
                        flex: 1,
                        background: 'transparent',
                        color: 'var(--text-primary)',
                        padding: '16px',
                        borderRadius: '12px',
                        border: '2px solid var(--line)',
                        fontSize: '16px',
                        fontWeight: '600',
                        cursor: 'pointer'
                      }}
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={loading || !formData.phone || !otpSent || !formData.otp || !!validationErrors.email || !!validationErrors.dob}
                      style={{
                        flex: 2,
                        background: (loading || !formData.phone || !otpSent || !formData.otp || validationErrors.email || validationErrors.dob) ? 'var(--line)' : 'rgb(255, 203, 5)',
                        color: '#1E377C',
                        padding: '16px',
                        borderRadius: '12px',
                        border: 'none',
                        fontSize: '16px',
                        fontWeight: '600',
                        cursor: (loading || !formData.phone || !otpSent || !formData.otp || validationErrors.email || validationErrors.dob) ? 'not-allowed' : 'pointer'
                      }}
                    >
                      {loading ? (locale === 'fr' ? 'Envoi…' : 'Submitting...') : 
                       !otpSent ? (locale === 'fr' ? 'Envoyez d’abord le code' : 'Send OTP First') : 
                       !formData.otp ? (locale === 'fr' ? 'Entrez le code OTP' : 'Enter OTP Code') : 
                       (locale === 'fr' ? 'Envoyer la demande de devis' : 'Submit Quote Request')}
                    </button>
                  </div>
                  {submitError && (
                    <p style={{ color: '#EF4444', fontSize: 12, marginTop: 6, textAlign: 'center' }}>{submitError}</p>
                  )}
                </form>

                <p style={{ 
                  fontSize: '14px', 
                  color: 'var(--text-secondary)', 
                  textAlign: 'center', 
                  margin: '0',
                  lineHeight: 1.5
                }}>
                  {locale === 'fr' ? 'Vos informations sont sécurisées et confidentielles.' : 'Your information is secure and confidential.'}<br/>
                  {locale === 'fr' ? 'Des conseillers d’assurance canadiens agréés vous répondent sous 24 heures.' : 'Licensed Canadian insurance advisors respond within 24 hours.'}
                </p>
              </motion.div>
            )}
        </div>
      </motion.div>
      {loading && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(255,255,255,0.6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1100
        }}>
          <div style={{
            width: 40,
            height: 40,
            border: '4px solid rgba(30,55,124,0.2)',
            borderTopColor: '#1E377C',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }} />
          <style>{'@keyframes spin { from { transform: rotate(0deg);} to { transform: rotate(360deg);} }'}</style>
        </div>
      )}
    </div>
  )
}