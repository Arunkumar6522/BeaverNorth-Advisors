import { useState } from 'react'
import { motion } from 'framer-motion'
import { sendOTP, verifyOTP, formatPhoneNumber, isValidPhoneNumber } from '../services/twilioService'
import CountryCodeSelector from './CountryCodeSelector'

interface ContactModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function ContactModal({ isOpen, onClose }: ContactModalProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    name: '',
    gender: '' as 'male' | 'female' | 'others' | 'prefer-not-to-say',
    dob: '',
    smokingStatus: '',
    province: '',
    insuranceProduct: '',
    email: '',
    phone: '',
    countryCode: '+1',
    otp: ''
  })

  const [loading, setLoading] = useState(false)
  const [otpSent, setOtpSent] = useState(false)
  const [submitted, setSubmitted] = useState(false)

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

  const sendOTPCode = async () => {
    if (!formData.phone) {
      alert('Please enter your phone number')
      return
    }

    if (!isValidPhoneNumber(formData.phone)) {
      alert('Please enter a valid phone number')
      return
    }

    setLoading(true)
    try {
      const phoneNumber = `${formData.countryCode}${formData.phone.replace(/\D/g, '')}`
      const result = await sendOTP(phoneNumber)
      
      if (result.success) {
        setOtpSent(true)
        // Show friendly success message instead of alert
        console.log(`✅ OTP sent to ${formatPhoneNumber(phoneNumber)}`)
      } else {
        alert(result.message)
      }
    } catch (error) {
      alert('Failed to send OTP. Please try again.')
      console.error('OTP sending error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.otp) {
      alert('Please enter the verification code')
      return
    }

    setLoading(true)
    
    try {
      const phoneNumber = `${formData.countryCode}${formData.phone.replace(/\D/g, '')}`
      const verificationResult = await verifyOTP(phoneNumber, formData.otp)
      
      if (verificationResult.success) {
        // Save lead to Supabase
        await saveLeadToSupabase()
        
        setLoading(false)
        setSubmitted(true)
        setTimeout(() => {
          onClose()
          setSubmitted(false)
          setCurrentStep(1)
          setOtpSent(false)
          setFormData({ name: '', gender: '' as 'male' | 'female' | 'others' | 'prefer-not-to-say', dob: '', smokingStatus: '', province: '', insuranceProduct: '', email: '', phone: '', countryCode: '+1', otp: '' })
        }, 2000)
      } else {
        alert(verificationResult.message)
      }
    } catch (error) {
      alert('Verification failed. Please try again.')
      console.error('OTP verification error:', error)
    } finally {
      setLoading(false)
    }
  }

  const saveLeadToSupabase = async () => {
    try {
      const leadData = {
        name: formData.name,
        email: formData.email,
        phone: `${formData.countryCode}${formData.phone.replace(/\D/g, '')}`,
        dob: formData.dob,
        province: formData.province,
        country_code: formData.countryCode,
        smoking_status: formData.smokingStatus,
        insurance_product: formData.insuranceProduct,
        status: 'new'
      }

      console.log('💾 Saving lead to Supabase:', leadData)
      
      // Real Supabase integration
      const { supabase } = await import('../lib/supabase')
      const { data, error } = await supabase
        .from('leads')
        .insert([leadData])
        .select()
      
      if (error) {
        console.error('❌ Supabase error:', error)
        throw new Error(`Failed to save lead: ${error.message}`)
      }
      
      console.log('✅ Lead saved successfully to Supabase:', data)
      
    } catch (error) {
      console.error('❌ Error saving lead:', error)
      throw error
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
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
          padding: '40px',
          width: '100%',
          maxWidth: '420px',
          maxHeight: '90vh',
          overflow: 'auto',
          boxShadow: '0 32px 64px rgba(0,0,0,0.12)',
          border: '1px solid rgba(0,0,0,0.08)',
          position: 'relative'
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

        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h2 style={{ 
            margin: '0 0 8px 0', 
            color: '#111827', 
            fontSize: '24px',
            fontWeight: '600',
            letterSpacing: '-0.02em'
          }}>
            {currentStep === 1 ? 'Get Started' : 
             currentStep === 2 ? `Hi ${formData.name} 👋` :
             'Almost Done'}
          </h2>
          <p style={{ 
            margin: '0 0 24px 0', 
            color: '#6B7280', 
            fontSize: '15px',
            fontWeight: '400'
          }}>
            {currentStep === 1 ? 'Tell us about yourself' : 
             currentStep === 2 ? 'Help us personalize your quote' :
             'Verify your contact information'}
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
                background: 'var(--brand-green)',
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

        {submitted ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{ textAlign: 'center', padding: '40px 20px' }}
          >
            <div style={{ 
              width: '60px', 
              height: '60px', 
              borderRadius: '50%', 
              background: 'var(--brand-green)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              margin: '0 auto 20px',
              fontSize: '24px',
              color: 'white'
            }}>
              ✓
            </div>
            <h3 style={{ color: 'var(--brand-green)', marginBottom: '12px' }}>
              Quote Request Received!
            </h3>
            <p style={{ color: 'var(--text-secondary)' }}>
              Our licensed advisors will contact you within 24 hours with your personalized insurance quote.
            </p>
          </motion.div>
        ) : (
          <div>
            {/* Step 1: Personal Information */}
            {currentStep === 1 && (
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
                            fontWeight: '500', 
                            color: '#374151',
                            marginBottom: '8px'
                          }}>
                            Full name
                          </label>
                          <input
                            type="text"
                            name="name"
                            placeholder="John Doe"
                            value={formData.name}
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
                            onFocus={(e) => e.target.style.borderColor = '#22C55E'}
                            onBlur={(e) => e.target.style.borderColor = '#D1D5DB'}
                          />
                </div>

                <div>
                  <label style={{ 
                    display: 'block', 
                    fontSize: '14px', 
                    fontWeight: '500', 
                    color: '#374151',
                    marginBottom: '8px'
                  }}>
                    Gender *
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
                    <option value="">Select your gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="others">Others</option>
                    <option value="prefer-not-to-say">Prefer not to say</option>
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
                    When were you born? *
                  </label>
                  <input
                    type="date"
                    name="dob"
                    value={formData.dob}
                    onChange={handleChange}
                    max="2005-12-31"
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
                  />
                </div>

                <button
                  type="button"
                  onClick={nextStep}
                  disabled={!formData.name || !formData.gender || !formData.dob}
                  style={{
                    width: '100%',
                    background: !formData.name || !formData.gender || !formData.dob ? 'var(--line)' : 'var(--brand-green)',
                    color: 'white',
                    padding: '16px',
                    borderRadius: '12px',
                    border: 'none',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: !formData.name || !formData.dob ? 'not-allowed' : 'pointer',
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
                      border: `2px solid ${formData.smokingStatus === 'non-smoker' ? 'var(--brand-green)' : 'var(--line)'}`,
                      borderRadius: '8px',
                      background: formData.smokingStatus === 'non-smoker' ? 'var(--brand-green)' : 'var(--surface-1)',
                      color: formData.smokingStatus === 'non-smoker' ? 'white' : 'var(--text-primary)',
                      transition: 'all 0.2s'
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
                      color: formData.smokingStatus === 'smoker' ? 'white' : 'var(--text-primary)',
                      transition: 'all 0.2s'
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
                      background: !formData.smokingStatus || !formData.insuranceProduct || !formData.province ? 'var(--line)' : 'var(--brand-green)',
                      color: 'white',
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

            {/* Step 3: Contact Verification */}
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
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    placeholder="your.email@example.com"
                    value={formData.email}
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
                      outline: 'none'
                    }}
                  />
                </div>

                <div>
                  <label style={{ 
                    display: 'block', 
                    fontSize: '14px', 
                    fontWeight: 600, 
                    color: 'var(--text-primary)',
                    marginBottom: '8px'
                  }}>
                    Phone Number * (for verification)
                  </label>
                  <p style={{ 
                    fontSize: '12px',
                    color: 'var(--text-secondary)',
                    marginBottom: '12px'
                  }}>
                    📱 We'll send a 6-digit code to verify your number
                  </p>
                  <div style={{ display: 'flex', gap: '0' }}>
                    <CountryCodeSelector
                      value={formData.countryCode}
                      onChange={(code) => setFormData(prev => ({ ...prev, countryCode: code }))}
                    />
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
                  
                  <div style={{ marginTop: '12px', display: 'flex', gap: '12px' }}>
                    {!otpSent ? (
                      <button
                        type="button"
                        onClick={sendOTPCode}
                        disabled={loading || !formData.phone}
                        style={{
                          flex: 1,
                          padding: '14px 16px',
                          background: loading || !formData.phone ? 'var(--line)' : 'var(--brand-green)',
                          color: 'white',
                          border: 'none',
                          borderRadius: '12px',
                          fontSize: '14px',
                          fontWeight: '600',
                          cursor: loading || !formData.phone ? 'not-allowed' : 'pointer'
                        }}
                      >
                        {loading ? 'Sending...' : 'Send OTP'}
                      </button>
                    ) : (
                      <button
                        type="button"
                        disabled
                        style={{
                          flex: 1,
                          padding: '14px 16px',
                          background: 'var(--brand-green)',
                          color: 'white',
                          border: 'none',
                          borderRadius: '12px',
                          fontSize: '14px',
                          fontWeight: '600',
                          opacity: 0.8
                        }}
                      >
                        ✓ SMS Sent
                      </button>
                    )}
                    
                    {otpSent && (
                      <button
                        type="button"
                        onClick={() => {
                          setOtpSent(false)
                          setFormData(prev => ({ ...prev, otp: '' }))
                        }}
                        style={{
                          padding: '14px 16px',
                          background: 'transparent',
                          color: 'var(--text-secondary)',
                          border: '1px solid var(--line)',
                          borderRadius: '12px',
                          fontSize: '14px',
                          fontWeight: '500',
                          cursor: 'pointer'
                        }}
                      >
                        Resend
                      </button>
                    )}
                  </div>
                  
                  {otpSent && (
                    <div style={{
                      marginTop: '12px',
                      padding: '12px 16px',
                      background: 'var(--surface-2)',
                      borderRadius: '8px',
                      border: '1px solid var(--brand-green)',
                      textAlign: 'center'
                    }}>
                      <p style={{ 
                        margin: 0, 
                        color: 'var(--brand-green)', 
                        fontSize: '14px', 
                        fontWeight: 500 
                      }}>
                        📱 SMS sent to {formData.countryCode} {formData.phone}
                      </p>
                      <p style={{ 
                        margin: '4px 0 0 0', 
                        color: 'var(--text-secondary)', 
                        fontSize: '12px' 
                      }}>
                        Check your phone for the 6-digit code
                      </p>
                    </div>
                  )}
                </div>

                {otpSent && (
                  <div>
                    <label style={{ 
                      display: 'block', 
                      fontSize: '14px', 
                      fontWeight: 600, 
                      color: 'var(--text-primary)',
                      marginBottom: '8px'
                    }}>
                      Enter verification code
                    </label>
                    <p style={{ 
                      fontSize: '12px',
                      color: 'var(--text-secondary)',
                      marginBottom: '12px'
                    }}>
                      🔐 Enter the 4-digit code from your SMS
                    </p>
                    <input
                      type="text"
                      name="otp"
                      placeholder="1234"
                      value={formData.otp}
                      onChange={handleChange}
                      maxLength={4}
                      style={{
                        width: '100%',
                        padding: '14px 16px',
                        border: '2px solid var(--line)',
                        borderRadius: '12px',
                        fontSize: '16px',
                        background: 'var(--surface-1)',
                        color: 'var(--text-primary)',
                        outline: 'none',
                        textAlign: 'center',
                        letterSpacing: '8px',
                        fontFamily: 'monospace'
                      }}
                    />
                    <p style={{ 
                      fontSize: '11px',
                      color: 'var(--text-secondary)',
                      margin: '8px 0 0 0',
                      textAlign: 'center'
                    }}>
                      Didn't receive it? Check your SMS inbox
                    </p>
                  </div>
                )}

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
                      disabled={loading || !formData.email || !formData.otp}
                      style={{
                        flex: 2,
                        background: loading || !formData.email || !formData.otp ? 'var(--line)' : 'var(--brand-green)',
                        color: 'white',
                        padding: '16px',
                        borderRadius: '12px',
                        border: 'none',
                        fontSize: '16px',
                        fontWeight: '600',
                        cursor: loading || !formData.email || !formData.otp ? 'not-allowed' : 'pointer'
                      }}
                    >
                        {loading ? 'Verifying...' : 'Complete Quote Request'}
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
        )}
      </motion.div>
    </div>
  )
}