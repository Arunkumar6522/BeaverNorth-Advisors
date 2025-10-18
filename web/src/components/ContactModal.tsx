import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '../lib/supabase'
import { useI18n } from '../i18n'
import { useNavigate } from 'react-router-dom'
import bnaLogo from '../assets/bna logo.png'

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
    gender: '' as 'male' | 'female' | 'prefer-not-to-say',
    dob: '1920-01-01',
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

  // OTP Timer Effect
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (otpResendTimer > 0) {
      interval = setInterval(() => {
        setOtpResendTimer((prev) => prev - 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [otpResendTimer])

  const sendOTP = async () => {
    if (sendingOtp || otpResendTimer > 0) return
    
    setSendingOtp(true)
    try {
      const phoneNumber = `${formData.countryCode}${formData.phone.replace(/\D/g, '')}`
      console.log('📱 Sending OTP to:', phoneNumber)
      
      const response = await fetch('http://localhost:3001/api/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: phoneNumber
        })
      })
      
      const result = await response.json()
      
      if (result.success) {
        setOtpSent(true)
        setOtpResendTimer(30) // 30 seconds timer
        alert(`✅ OTP sent to ${phoneNumber}`)
      } else {
        alert(`❌ Failed to send OTP: ${result.message}`)
      }
    } catch (error) {
      console.error('OTP send error:', error)
      alert('❌ Failed to send OTP. Please try again.')
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
    
    setLoading(true)
    
    try {
      // First verify OTP before saving to database
      await verifyOTPAndSubmit()
      
      // Redirect to success page
      onClose()
      navigate('/success')
    } catch (error: any) {
      const errorMessage = error?.message || 'Unknown error occurred'
      alert(`❌ Submission Failed\n\nError: ${errorMessage}\n\nPlease check the console for more details or try again.`)
      console.error('🔴 Submission error details:', error)
      setLoading(false)
    }
  }

  const verifyOTPAndSubmit = async () => {
    try {
      // First verify the OTP
      const phoneNumber = `${formData.countryCode}${formData.phone.replace(/\D/g, '')}`
      
      console.log('🔐 Verifying OTP before submission...')
      
      const verifyResponse = await fetch('http://localhost:3001/api/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: phoneNumber,
          code: formData.otp
        })
      })
      
      const verifyResult = await verifyResponse.json()
      
      if (!verifyResult.success) {
        throw new Error(verifyResult.message || 'OTP verification failed')
      }
      
      console.log('✅ OTP verified successfully, proceeding with submission...')
      
      // Only after successful OTP verification, save to database
      await saveLeadToSupabase()
      
    } catch (error: any) {
      console.error('❌ OTP verification error:', error)
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
    
    // Default case for all other fields (gender, dob, province, insuranceProduct, phone, countryCode, otp)
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

        {/* Logo */}
        <div style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <img 
            src={bnaLogo} 
            alt="BeaverNorth Advisors" 
            style={{ 
              height: '32px',
              width: 'auto'
            }} 
            onError={(e) => {
              console.error('Modal logo failed to load:', e.currentTarget.src)
              e.currentTarget.style.display = 'none'
            }}
          />
          <span style={{
            fontSize: '14px',
            fontWeight: 600,
            color: '#1E377C'
          }}>
            BNA
          </span>
        </div>

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
                                padding: '16px',
                                border: `1px solid ${validationErrors.firstName ? '#EF4444' : '#D1D5DB'}`,
                                borderRadius: '8px',
                                fontSize: '16px',
                                background: '#ffffff',
                                color: '#111827',
                                outline: 'none',
                                transition: 'border-color 0.2s'
                              }}
                              onFocus={(e) => e.target.style.borderColor = validationErrors.firstName ? '#EF4444' : '#22C55E'}
                              onBlur={(e) => e.target.style.borderColor = validationErrors.firstName ? '#EF4444' : '#D1D5DB'}
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
                                padding: '16px',
                                border: `1px solid ${validationErrors.lastName ? '#EF4444' : '#D1D5DB'}`,
                                borderRadius: '8px',
                                fontSize: '16px',
                                background: '#ffffff',
                                color: '#111827',
                                outline: 'none',
                                transition: 'border-color 0.2s'
                              }}
                              onFocus={(e) => e.target.style.borderColor = validationErrors.lastName ? '#EF4444' : '#22C55E'}
                              onBlur={(e) => e.target.style.borderColor = validationErrors.lastName ? '#EF4444' : '#D1D5DB'}
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
                    Gender <span style={{ color: '#EF4444' }}>*</span>
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    required
                    style={{
                      width: '100%',
                      padding: '16px',
                      border: '1px solid #D1D5DB',
                      borderRadius: '8px',
                      fontSize: '16px',
                      background: '#ffffff',
                      color: '#111827',
                      outline: 'none',
                      transition: 'border-color 0.2s'
                    }}
                  >
                    <option value="">{locale === 'fr' ? 'Sélectionnez votre genre' : 'Select your gender'}</option>
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
                    When were you born? <span style={{ color: '#EF4444' }}>*</span>
                  </label>
                  <input
                    type="date"
                    name="dob"
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '14px 16px',
                      border: '2px solid var(--line)',
                      borderRadius: '12px',
                      fontSize: '16px',
                      background: 'var(--surface-1)',
                      color: 'var(--text-primary)',
                      outline: 'none'
                    }}
                    onKeyDown={(e) => e.preventDefault()}
                  />
                </div>

                <button
                  type="button"
                  onClick={nextStep}
                  disabled={!formData.firstName || !formData.gender || !formData.dob || !!validationErrors.firstName}
                  style={{
                    width: '100%',
                    background: (!formData.firstName || !formData.gender || !formData.dob || validationErrors.firstName) ? 'var(--line)' : 'rgb(255, 203, 5)',
                    color: '#1E377C',
                    padding: '16px',
                    borderRadius: '12px',
                    border: 'none',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: (!formData.firstName || !formData.gender || !formData.dob || validationErrors.firstName) ? 'not-allowed' : 'pointer',
                    marginTop: '12px'
                  }}
                >
                  Next Step
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
                    Are you a smoker or non-smoker? *
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
                      <span style={{ fontSize: '14px', fontWeight: 500 }}>Non-Smoker</span>
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
                      <span style={{ fontSize: '14px', fontWeight: 500 }}>Smoker</span>
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
                    What type of insurance are you looking for? *
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
                    <option value="">Select insurance type</option>
                    <option value="term-life">Term Life Insurance</option>
                    <option value="whole-life">Whole Life Insurance</option>
                    <option value="non-medical">Non-Medical Life Insurance</option>
                    <option value="mortgage-life">Mortgage Life Insurance</option>
                    <option value="senior-life">Senior Life Insurance</option>
                    <option value="travel">Travel Insurance</option>
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
                    Which province are you in? *
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
                    <option value="">Select your province</option>
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
                    Next Step
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
                    Phone Number *
                  </label>
                  <p style={{ 
                    fontSize: '12px',
                    color: 'var(--text-secondary)',
                    marginBottom: '12px'
                  }}>
                    📱 We'll contact you at this number
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
                    Phone Verification *
                  </label>
                  <p style={{ 
                    fontSize: '12px',
                    color: 'var(--text-secondary)',
                    marginBottom: '16px'
                  }}>
                    🔐 We'll send a verification code to your phone
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
                      {sendingOtp ? 'Sending...' : 
                       otpResendTimer > 0 ? `Resend in ${otpResendTimer}s` : 
                       'Send Verification Code'}
                    </button>
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
                        Enter Verification Code *
                      </label>
                      <p style={{ 
                        fontSize: '12px',
                        color: 'var(--text-secondary)',
                        marginBottom: '12px'
                      }}>
                        📱 Enter the 6-digit code sent to {formData.countryCode}{formData.phone}
                      </p>
                      <input
                        type="text"
                        name="otp"
                        placeholder="123456"
                        value={formData.otp}
                        onChange={handleChange}
                        maxLength={6}
                        style={{
                          width: '100%',
                          padding: '16px',
                          border: '2px solid var(--line)',
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
                      disabled={loading || !formData.email || !formData.phone || !otpSent || !formData.otp || !!validationErrors.email}
                      style={{
                        flex: 2,
                        background: (loading || !formData.email || !formData.phone || !otpSent || !formData.otp || validationErrors.email) ? 'var(--line)' : 'rgb(255, 203, 5)',
                        color: '#1E377C',
                        padding: '16px',
                        borderRadius: '12px',
                        border: 'none',
                        fontSize: '16px',
                        fontWeight: '600',
                        cursor: (loading || !formData.email || !formData.phone || !otpSent || !formData.otp || validationErrors.email) ? 'not-allowed' : 'pointer'
                      }}
                    >
                      {loading ? 'Submitting...' : 
                       !otpSent ? 'Send OTP First' : 
                       !formData.otp ? 'Enter OTP Code' : 
                       'Submit Quote Request'}
                    </button>
                  </div>
                </form>

                <p style={{ 
                  fontSize: '14px', 
                  color: 'var(--text-secondary)', 
                  textAlign: 'center', 
                  margin: '0',
                  lineHeight: 1.5
                }}>
                  Your information is secure and confidential.<br/>
                  Licensed Canadian insurance advisors respond within 24 hours.
                </p>
              </motion.div>
            )}
        </div>
      </motion.div>
    </div>
  )
}