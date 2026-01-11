import { useState, useEffect } from 'react'
import { 
  Box, 
  Container, 
  Typography, 
  TextField, 
  Button, 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel,
  CircularProgress,
  Alert,
  Card,
  Fade
} from '@mui/material'
import { 
  Security,
  ArrowBack,
  ArrowForward,
  CheckCircle,
  VerifiedUser,
  Lock,
  Phone,
  Email,
  Star
} from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { useI18n } from '../i18n'
import { gtagEvent, trackLeadSubmitError, trackLeadSubmitSuccess } from '../lib/analytics'
import { supabase } from '../lib/supabase'

interface FormData {
  firstName: string
  lastName: string
  gender: 'male' | 'female' | 'prefer-not-to-say' | ''
  ageRange: string
  email: string
  phone: string
  countryCode: string
  otp: string
  smokingStatus: string
  province: string
  insuranceProduct: string
}

export default function Enquiry() {
  const navigate = useNavigate()
  const { locale } = useI18n()
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [sendingOtp, setSendingOtp] = useState(false)
  const [otpSent, setOtpSent] = useState(false)
  const [otpResendTimer, setOtpResendTimer] = useState(0)
  const [errors, setErrors] = useState<{[key: string]: string}>({})
  const [submitError, setSubmitError] = useState('')
  const [otpStatus, setOtpStatus] = useState('')

  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    gender: '',
    ageRange: '26-35', // Default to age 30 (middle of 26-35 range)
    email: '',
    phone: '',
    countryCode: '+1',
    otp: '',
    smokingStatus: '',
    province: '',
    insuranceProduct: ''
  })

  // OTP Resend Timer
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>
    if (otpResendTimer > 0) {
      interval = setInterval(() => {
        setOtpResendTimer((prev) => prev - 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [otpResendTimer])

  const validateStep = (step: number): boolean => {
    const newErrors: {[key: string]: string} = {}
    
    if (step === 1) {
      if (!formData.firstName.trim()) {
        newErrors.firstName = 'First name is required'
      }
      if (!formData.gender) {
        newErrors.gender = 'Gender is required'
      }
      if (!formData.ageRange) {
        newErrors.ageRange = 'Age range is required'
      }
    } else if (step === 2) {
      if (!formData.smokingStatus) {
        newErrors.smokingStatus = 'Smoking status is required'
      }
      if (!formData.province) {
        newErrors.province = 'Province is required'
      }
      if (!formData.insuranceProduct) {
        newErrors.insuranceProduct = 'Insurance product is required'
      }
    } else if (step === 3) {
      if (!formData.email.trim()) {
        newErrors.email = 'Email is required'
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = 'Please enter a valid email'
      }
      if (!formData.phone.trim()) {
        newErrors.phone = 'Phone number is required'
      } else if (formData.phone.replace(/\D/g, '').length < 10) {
        newErrors.phone = 'Please enter a valid phone number'
      }
    } else if (step === 4) {
      if (!formData.otp.trim()) {
        newErrors.otp = 'OTP is required'
      } else if (formData.otp.length !== 6) {
        newErrors.otp = 'OTP must be 6 digits'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep === 3 && !otpSent) {
        // Send OTP before moving to step 4
        sendOTP()
        return
      }
      if (currentStep < 4) {
        setCurrentStep(currentStep + 1)
        gtagEvent('form_step', { form_id: 'enquiry', step: currentStep + 1 })
      }
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const sendOTP = async () => {
    if (sendingOtp || otpResendTimer > 0) return
    
    if (!validateStep(2)) {
      return
    }

    setSendingOtp(true)
    setOtpStatus('')
    
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
      
      let result
      try {
        result = await response.json()
      } catch (parseError) {
        // If response is not JSON, create error result
        const text = await response.text()
        throw new Error(`Server error (${response.status}): ${text || response.statusText}`)
      }
      
      if (!response.ok) {
        throw new Error(result.message || result.error || `Server error: ${response.status} ${response.statusText}`)
      }
      
      if (result.success) {
        setOtpSent(true)
        setOtpResendTimer(30)
        setOtpStatus('Verification code sent successfully!')
        setCurrentStep(4) // Move to step 4 after OTP is sent
        gtagEvent('otp_sent', { form_id: 'enquiry' })
      } else {
        setOtpStatus(result.message || result.error || 'Failed to send verification code. Please try again.')
      }
    } catch (error: any) {
      console.error('OTP send error:', error)
      const errorMessage = error.message || 'Failed to send verification code. Please try again.'
      setOtpStatus(errorMessage)
    } finally {
      setSendingOtp(false)
    }
  }

  const handleSubmit = async () => {
    if (!validateStep(4)) {
      return
    }

    setLoading(true)
    setSubmitError('')

    try {
      // Verify OTP
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
        setErrors({ ...errors, otp: verifyResult.message || 'Invalid OTP. Please try again.' })
        setLoading(false)
        return
      }

      gtagEvent('otp_verified', { form_id: 'enquiry' })

      // Convert age range to approximate DOB for database (using middle of range)
      const getApproximateDOB = (ageRange: string): string => {
        const today = new Date()
        let age: number
        if (ageRange === '18-25') age = 21
        else if (ageRange === '26-35') age = 30
        else if (ageRange === '36-45') age = 40
        else if (ageRange === '46-55') age = 50
        else if (ageRange === '56-65') age = 60
        else if (ageRange === '65+') age = 70
        else age = 35 // default
        
        const year = today.getFullYear() - age
        const month = String(today.getMonth() + 1).padStart(2, '0')
        const day = String(today.getDate()).padStart(2, '0')
        return `${year}-${month}-${day}`
      }

      // Save to database
      const leadData = {
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        email: formData.email,
        phone: phoneNumber,
        dob: getApproximateDOB(formData.ageRange),
        province: formData.province,
        country_code: formData.countryCode,
        smoking_status: formData.smokingStatus,
        insurance_product: formData.insuranceProduct,
        status: 'new',
        gender: formData.gender || null
      }

      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://demo-project.supabase.co'
      const isMockClient = supabaseUrl === 'https://demo-project.supabase.co'

      if (!isMockClient && supabase) {
        const { error: dbError } = await supabase
          .from('leads')
          .insert([leadData])
          .select()

        if (dbError) {
          // Provide user-friendly error messages
          let errorMessage = 'Failed to submit form. Please try again.'
          if (dbError.message.includes('insurance_product_check')) {
            errorMessage = 'Invalid insurance product selected. Please select a valid option and try again.'
          } else if (dbError.message.includes('smoking_status')) {
            errorMessage = 'Invalid smoking status selected. Please select a valid option and try again.'
          } else if (dbError.message.includes('violates check constraint')) {
            errorMessage = 'Invalid form data. Please check all fields and try again.'
          } else {
            errorMessage = `Database error: ${dbError.message}`
          }
          throw new Error(errorMessage)
        }
      }

      // Send notifications
      try {
        const notifyUrl = window.location.hostname === 'localhost' 
          ? 'http://localhost:3001/api/send-lead-notification'
          : '/.netlify/functions/send-lead-notification'
        
        await fetch(notifyUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ leadData })
        })
      } catch (notifyError) {
        console.error('Notification error:', notifyError)
        // Don't fail the form submission if notification fails
      }

      gtagEvent('lead_submit_success', { form_id: 'enquiry' })
      
      // Track Lead event to Facebook Pixel and Conversions API
      trackLeadSubmitSuccess({
        name: leadData.name,
        email: leadData.email,
        phone: leadData.phone,
        insuranceProduct: leadData.insurance_product
      })
      
      // Redirect to success page
      navigate('/success', { state: { submitted: true } })
      
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to submit form. Please try again.'
      setSubmitError(errorMessage)
      setLoading(false)
      
      // Track error with lead data for analytics
      const leadDataForTracking = {
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        email: formData.email,
        phone: `${formData.countryCode}${formData.phone.replace(/\D/g, '')}`,
        insuranceProduct: formData.insuranceProduct
      }
      gtagEvent('lead_submit_error', { form_id: 'enquiry', error: errorMessage })
      trackLeadSubmitError(errorMessage, leadDataForTracking)
    }
  }

  const updateFormData = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  const provinces = [
    'Alberta', 'British Columbia', 'Manitoba', 'New Brunswick', 
    'Newfoundland and Labrador', 'Northwest Territories', 'Nova Scotia', 
    'Nunavut', 'Ontario', 'Prince Edward Island', 'Quebec', 'Saskatchewan', 'Yukon'
  ]

  const insuranceProducts = [
    { label: 'Term Life Insurance', value: 'term-life' },
    { label: 'Whole Life Insurance', value: 'whole-life' },
    { label: 'Non-Medical Insurance', value: 'non-medical' },
    { label: 'Mortgage Life Insurance', value: 'mortgage-life' },
    { label: 'Senior Life Insurance', value: 'senior-life' },
    { label: 'Travel Insurance', value: 'travel' }
  ]

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      backgroundColor: '#F3F8FF',
      pb: 8
    }}>
      {/* Header */}
      <Box sx={{ 
        bgcolor: '#1E377C', 
        py: 2,
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography 
              variant="h5" 
              sx={{ 
                fontWeight: 700, 
                color: 'white',
                fontSize: { xs: '1.25rem', md: '1.5rem' }
              }}
            >
              BeaverNorth Financials
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'white' }}>
              <Security sx={{ fontSize: 18, color: 'white' }} />
              <Typography variant="body2" sx={{ fontSize: '0.875rem', color: 'white' }}>
                {locale === 'fr' ? 'Sécurisé' : 'Secure'}
              </Typography>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Main Content */}
      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', lg: 'row' }, gap: 4 }}>
          
          {/* Left Side - Trust Indicators & Benefits */}
          <Box sx={{ 
            flex: { lg: '0 0 350px' },
            display: { xs: 'none', lg: 'flex' },
            flexDirection: 'column',
            gap: 3
          }}>
            <Card sx={{ 
              p: 3,
              borderRadius: 3,
              bgcolor: 'white',
              boxShadow: '0 4px 16px rgba(0,0,0,0.08)'
            }}>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#1E377C', mb: 2 }}>
                {locale === 'fr' ? 'Pourquoi nous choisir ?' : 'Why Choose Us?'}
              </Typography>
              {[
                { icon: <VerifiedUser sx={{ fontSize: 24 }} />, title: locale === 'fr' ? 'Conseil Expert' : 'Expert Guidance', desc: locale === 'fr' ? 'Professionnels expérimentés' : 'Experienced professionals' },
                { icon: <Lock sx={{ fontSize: 24 }} />, title: locale === 'fr' ? 'Sécurisé' : 'Secure & Protected', desc: locale === 'fr' ? 'Données cryptées SSL' : 'SSL encrypted data' },
                { icon: <CheckCircle sx={{ fontSize: 24 }} />, title: locale === 'fr' ? 'Rapide' : 'Quick Response', desc: locale === 'fr' ? 'Réponse sous 24h' : 'Response within 24h' },
                { icon: <Star sx={{ fontSize: 24 }} />, title: locale === 'fr' ? 'Service Client' : 'Customer Service', desc: locale === 'fr' ? 'Support dédié' : 'Dedicated support' }
              ].map((item, idx) => (
                <Box key={idx} sx={{ display: 'flex', gap: 2, mb: 2 }}>
                  <Box sx={{ color: '#22C55E', mt: 0.5, display: 'flex', alignItems: 'flex-start' }}>{item.icon}</Box>
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#1E377C', mb: 0.5 }}>
                      {item.title}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#6B7280' }}>
                      {item.desc}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Card>

            {/* Trust Badge */}
            <Card sx={{ 
              p: 3,
              borderRadius: 3,
              bgcolor: '#F3F8FF',
              border: '2px solid #417F73',
              textAlign: 'center'
            }}>
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
                <Lock sx={{ fontSize: 56, color: '#1E377C', display: 'block' }} />
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#1E377C', mb: 1 }}>
                {locale === 'fr' ? '100% Sécurisé' : '100% Secure'}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#6B7280' }}>
                      {locale === 'fr' 
                  ? 'Vos informations sont protégées et ne seront jamais partagées.'
                  : 'Your information is protected and never shared.'}
              </Typography>
            </Card>
          </Box>

          {/* Right Side - Form */}
          <Box sx={{ flex: 1, order: { xs: 1, lg: 2 } }}>
            <Fade in={true} timeout={500}>
              <Card sx={{ 
                p: { xs: 3, md: 4 },
                borderRadius: 3,
                bgcolor: 'white',
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
              }}>
                {/* Form Header */}
                <Box sx={{ mb: 4, textAlign: 'center' }}>
                  <Typography 
                    variant="h4" 
                    sx={{ 
                      fontWeight: 700, 
                      color: '#1E377C',
                      mb: 1,
                      fontSize: { xs: '1.75rem', md: '2rem' }
                    }}
                  >
                    {locale === 'fr' ? 'Obtenez Votre Devis' : 'Get Started'}
                  </Typography>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      color: '#417F73',
                      fontWeight: 400,
                      mb: 3
                    }}
                  >
                    {locale === 'fr' ? 'Parlez-nous de vous' : 'Tell us about yourself'}
                  </Typography>

                  {/* Enhanced Stepper Component */}
                  <Box sx={{ mb: 4, px: { xs: 0, sm: 2 } }}>
                    <Box sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      position: 'relative',
                      maxWidth: { xs: '100%', sm: 500 },
                      mx: 'auto',
                      px: { xs: 1, sm: 0 }
                    }}>
                      {/* Progress Line */}
                      <Box sx={{
                        position: 'absolute',
                        top: { xs: '18px', sm: '20px' },
                        left: { xs: '15px', sm: '20px' },
                        right: { xs: '15px', sm: '20px' },
                        height: '2px',
                        bgcolor: '#E5E7EB',
                        zIndex: 0
                      }} />
                      <Box sx={{
                        position: 'absolute',
                        top: { xs: '18px', sm: '20px' },
                        left: { xs: '15px', sm: '20px' },
                        width: `${((currentStep - 1) / 3) * 100}%`,
                        height: '2px',
                        bgcolor: 'rgb(255, 203, 5)',
                        transition: 'width 0.4s ease',
                        zIndex: 1
                      }} />

                      {[1, 2, 3, 4].map((step) => (
                        <Box key={step} sx={{ position: 'relative', zIndex: 2, flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                          <Box
                            sx={{
                              width: { xs: '32px', sm: '40px' },
                              height: { xs: '32px', sm: '40px' },
                              borderRadius: '50%',
                              bgcolor: step <= currentStep ? 'rgb(255, 203, 5)' : '#E5E7EB',
                              color: step <= currentStep ? '#1E377C' : '#9CA3AF',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontWeight: 700,
                              fontSize: { xs: '14px', sm: '16px' },
                              boxShadow: step === currentStep ? '0 0 0 4px rgba(30, 55, 124, 0.1)' : 'none',
                              transition: 'all 0.3s ease',
                              cursor: 'default'
                            }}
                          >
                            {step < currentStep ? (
                              <CheckCircle sx={{ fontSize: { xs: 20, sm: 24 }, color: '#1E377C' }} />
                            ) : (
                              step
                            )}
                          </Box>
                          <Typography 
                            variant="caption" 
                            sx={{ 
                              display: { xs: 'none', sm: 'block' },
                              mt: 1,
                              color: step <= currentStep ? '#1E377C' : '#9CA3AF',
                              fontWeight: step === currentStep ? 600 : 400,
                              fontSize: '11px',
                              textAlign: 'center',
                              maxWidth: '60px',
                              mx: 'auto'
                            }}
                          >
                            {step === 1 ? (locale === 'fr' ? 'Info' : 'Info') :
                             step === 2 ? (locale === 'fr' ? 'Assurance' : 'Insurance') :
                             step === 3 ? (locale === 'fr' ? 'Contact' : 'Contact') :
                             (locale === 'fr' ? 'Vérifier' : 'Verify')}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  </Box>
                </Box>
                
                {/* Error Alert */}
                {submitError && (
                  <Alert severity="error" sx={{ mb: 3 }} onClose={() => setSubmitError('')}>
                    {submitError}
                  </Alert>
                )}

                {/* Step 1: Personal Information */}
                <Fade in={currentStep === 1} timeout={300}>
                  <Box sx={{ display: currentStep === 1 ? 'block' : 'none' }}>
                    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, mb: 2 }}>
                      <TextField
                        fullWidth
                        label={locale === 'fr' ? 'Prénom' : 'First name'}
                        required
                        value={formData.firstName}
                        onChange={(e) => updateFormData('firstName', e.target.value)}
                        error={!!errors.firstName}
                        helperText={errors.firstName}
                        placeholder={locale === 'fr' ? 'Votre prénom' : 'Your first name'}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                            '&:hover fieldset': { borderColor: '#417F73' },
                            '&.Mui-focused fieldset': { borderColor: '#1E377C' }
                          }
                        }}
                      />
                      <TextField
                        fullWidth
                        label={locale === 'fr' ? 'Nom de famille (optionnel)' : 'Last name (optional)'}
                        value={formData.lastName}
                        onChange={(e) => updateFormData('lastName', e.target.value)}
                        error={!!errors.lastName}
                        helperText={errors.lastName}
                        placeholder={locale === 'fr' ? 'Votre nom de famille' : 'Your last name'}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                            '&:hover fieldset': { borderColor: '#417F73' },
                            '&.Mui-focused fieldset': { borderColor: '#1E377C' }
                          }
                        }}
                      />
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2 }}>
                      <FormControl fullWidth error={!!errors.gender} sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          '&:hover fieldset': { borderColor: '#417F73' },
                          '&.Mui-focused fieldset': { borderColor: '#1E377C' }
                        }
                      }}>
                        <InputLabel>{locale === 'fr' ? 'Genre' : 'Gender'}</InputLabel>
                        <Select
                          value={formData.gender}
                          onChange={(e) => updateFormData('gender', e.target.value)}
                          label={locale === 'fr' ? 'Genre' : 'Gender'}
                        >
                          <MenuItem value="male">{locale === 'fr' ? 'Homme' : 'Male'}</MenuItem>
                          <MenuItem value="female">{locale === 'fr' ? 'Femme' : 'Female'}</MenuItem>
                          <MenuItem value="prefer-not-to-say">
                            {locale === 'fr' ? 'Je préfère ne pas le dire' : 'Prefer not to say'}
                          </MenuItem>
                        </Select>
                        {errors.gender && (
                          <Typography variant="caption" sx={{ color: 'error.main', mt: 0.5, ml: 1.75 }}>
                            {errors.gender}
                          </Typography>
                        )}
                      </FormControl>
                      <FormControl fullWidth error={!!errors.ageRange} sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          '&:hover fieldset': { borderColor: '#417F73' },
                          '&.Mui-focused fieldset': { borderColor: '#1E377C' }
                        }
                      }}>
                        <InputLabel>{locale === 'fr' ? 'Tranche d\'âge' : 'Age Range'}</InputLabel>
                        <Select
                          value={formData.ageRange}
                          onChange={(e) => updateFormData('ageRange', e.target.value)}
                          label={locale === 'fr' ? 'Tranche d\'âge' : 'Age Range'}
                          displayEmpty={false}
                        >
                          <MenuItem value="18-25">18-25</MenuItem>
                          <MenuItem value="26-35">26-35 {locale === 'fr' ? '(par défaut)' : '(default)'}</MenuItem>
                          <MenuItem value="36-45">36-45</MenuItem>
                          <MenuItem value="46-55">46-55</MenuItem>
                          <MenuItem value="56-65">56-65</MenuItem>
                          <MenuItem value="65+">65+</MenuItem>
                        </Select>
                        {errors.ageRange && (
                          <Typography variant="caption" sx={{ color: 'error.main', mt: 0.5, ml: 1.75 }}>
                            {errors.ageRange}
                          </Typography>
                        )}
                      </FormControl>
                    </Box>
                  </Box>
                </Fade>

                {/* Step 2: Insurance Details */}
                <Fade in={currentStep === 2} timeout={300}>
                  <Box sx={{ display: currentStep === 2 ? 'block' : 'none' }}>
                    <Typography variant="h6" sx={{ mb: 3, color: '#1E377C', fontWeight: 600 }}>
                      {locale === 'fr' ? 'Détails de l\'assurance' : 'Insurance Details'}
                    </Typography>
                    <FormControl fullWidth error={!!errors.smokingStatus} sx={{ mb: 2,
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        '&:hover fieldset': { borderColor: '#417F73' },
                        '&.Mui-focused fieldset': { borderColor: '#1E377C' }
                      }
                    }}>
                      <InputLabel>{locale === 'fr' ? 'Statut de tabagisme' : 'Smoking Status'}</InputLabel>
                      <Select
                        value={formData.smokingStatus}
                        onChange={(e) => updateFormData('smokingStatus', e.target.value)}
                        label={locale === 'fr' ? 'Statut de tabagisme' : 'Smoking Status'}
                      >
                        <MenuItem value="non-smoker">{locale === 'fr' ? 'Non-fumeur' : 'Non-smoker'}</MenuItem>
                        <MenuItem value="smoker">{locale === 'fr' ? 'Fumeur' : 'Smoker'}</MenuItem>
                      </Select>
                      {errors.smokingStatus && (
                        <Typography variant="caption" sx={{ color: 'error.main', mt: 0.5, ml: 1.75 }}>
                          {errors.smokingStatus}
                        </Typography>
                      )}
                    </FormControl>
                    <FormControl fullWidth error={!!errors.province} sx={{ mb: 2,
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        '&:hover fieldset': { borderColor: '#417F73' },
                        '&.Mui-focused fieldset': { borderColor: '#1E377C' }
                      }
                    }}>
                      <InputLabel>{locale === 'fr' ? 'Province' : 'Province'}</InputLabel>
                      <Select
                        value={formData.province}
                        onChange={(e) => updateFormData('province', e.target.value)}
                        label={locale === 'fr' ? 'Province' : 'Province'}
                      >
                        {provinces.map((province) => (
                          <MenuItem key={province} value={province}>{province}</MenuItem>
                        ))}
                      </Select>
                      {errors.province && (
                        <Typography variant="caption" sx={{ color: 'error.main', mt: 0.5, ml: 1.75 }}>
                          {errors.province}
                        </Typography>
                      )}
                    </FormControl>
                    <FormControl fullWidth error={!!errors.insuranceProduct} sx={{ mb: 2,
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        '&:hover fieldset': { borderColor: '#417F73' },
                        '&.Mui-focused fieldset': { borderColor: '#1E377C' }
                      }
                    }}>
                      <InputLabel>{locale === 'fr' ? 'Produit d\'assurance' : 'Insurance Product'}</InputLabel>
                      <Select
                        value={formData.insuranceProduct}
                        onChange={(e) => updateFormData('insuranceProduct', e.target.value)}
                        label={locale === 'fr' ? 'Produit d\'assurance' : 'Insurance Product'}
                      >
                        {insuranceProducts.map((product) => (
                          <MenuItem key={product.value} value={product.value}>{product.label}</MenuItem>
                        ))}
                      </Select>
                      {errors.insuranceProduct && (
                        <Typography variant="caption" sx={{ color: 'error.main', mt: 0.5, ml: 1.75 }}>
                          {errors.insuranceProduct}
                        </Typography>
                      )}
                    </FormControl>
                  </Box>
                </Fade>

                {/* Step 3: Contact Information */}
                <Fade in={currentStep === 3} timeout={300}>
                  <Box sx={{ display: currentStep === 3 ? 'block' : 'none' }}>
                    <Typography variant="h6" sx={{ mb: 3, color: '#1E377C', fontWeight: 600 }}>
                      {locale === 'fr' ? 'Informations de contact' : 'Contact Information'}
                    </Typography>
                    <TextField
                      fullWidth
                      type="email"
                      label={locale === 'fr' ? 'Email' : 'Email'}
                      required
                      value={formData.email}
                      onChange={(e) => updateFormData('email', e.target.value)}
                      error={!!errors.email}
                      helperText={errors.email}
                      placeholder="your.email@example.com"
                      sx={{ mb: 2,
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          '&:hover fieldset': { borderColor: '#417F73' },
                          '&.Mui-focused fieldset': { borderColor: '#1E377C' }
                        }
                      }}
                      InputProps={{
                        startAdornment: <Email sx={{ mr: 1, color: '#417F73' }} />
                      }}
                    />
                    <Box sx={{ display: 'flex', gap: 1, mb: 2, alignItems: 'flex-start' }}>
                      <Box sx={{ 
                        width: '80px',
                        height: '56px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        bgcolor: '#F3F8FF',
                        borderRadius: 2,
                        border: '1px solid #E5E7EB',
                        mt: '1px'
                      }}>
                        <Typography sx={{ color: '#1E377C', fontWeight: 600 }}>+1</Typography>
                      </Box>
                      <TextField
                        fullWidth
                        type="tel"
                        label={locale === 'fr' ? 'Numéro de téléphone' : 'Phone Number'}
                        required
                        value={formData.phone}
                        onChange={(e) => updateFormData('phone', e.target.value.replace(/\D/g, ''))}
                        error={!!errors.phone}
                        helperText={errors.phone}
                        placeholder="1234567890"
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                            '&:hover fieldset': { borderColor: '#417F73' },
                            '&.Mui-focused fieldset': { borderColor: '#1E377C' }
                          }
                        }}
                        InputProps={{
                          startAdornment: <Phone sx={{ mr: 1, color: '#417F73' }} />
                        }}
                      />
                    </Box>
                    {otpStatus && (
                      <Alert severity={otpSent ? 'success' : 'error'} sx={{ mt: 1 }}>
                        {otpStatus}
                      </Alert>
                    )}
                  </Box>
                </Fade>

                {/* Step 4: OTP Verification */}
                <Fade in={currentStep === 4} timeout={300}>
                  <Box sx={{ display: currentStep === 4 ? 'block' : 'none' }}>
                    <Typography variant="h6" sx={{ mb: 2, color: '#1E377C', fontWeight: 600 }}>
                      {locale === 'fr' ? 'Vérification OTP' : 'OTP Verification'}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 3, color: '#6B7280' }}>
                      {locale === 'fr' 
                        ? 'Nous avons envoyé un code de vérification à votre numéro de téléphone. Veuillez l\'entrer ci-dessous.'
                        : 'We\'ve sent a verification code to your phone number. Please enter it below.'}
                    </Typography>
                    <TextField
                      fullWidth
                      label={locale === 'fr' ? 'Code de vérification' : 'Verification Code'}
                      required
                      value={formData.otp}
                      onChange={(e) => updateFormData('otp', e.target.value.replace(/\D/g, '').slice(0, 6))}
                      error={!!errors.otp}
                      helperText={errors.otp}
                      placeholder="000000"
                      inputProps={{ maxLength: 6, style: { textAlign: 'center', fontSize: '28px', letterSpacing: '10px', fontWeight: 600 } }}
                      sx={{ mb: 2,
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          '&:hover fieldset': { borderColor: '#417F73' },
                          '&.Mui-focused fieldset': { borderColor: '#1E377C' }
                        }
                      }}
                    />
                    {otpResendTimer > 0 && (
                      <Typography variant="body2" sx={{ color: '#6B7280', textAlign: 'center', mb: 2 }}>
                        {locale === 'fr' 
                          ? `Renvoyer le code dans ${otpResendTimer}s`
                          : `Resend code in ${otpResendTimer}s`}
                      </Typography>
                    )}
                    {otpResendTimer === 0 && otpSent && (
                      <Button
                        fullWidth
                        variant="outlined"
                        onClick={sendOTP}
                        disabled={sendingOtp}
                        sx={{ mb: 2, borderRadius: 2, borderColor: '#417F73', color: '#417F73',
                          '&:hover': { borderColor: '#1E377C', bgcolor: '#F3F8FF' }
                        }}
                      >
                        {sendingOtp ? <CircularProgress size={20} /> : (locale === 'fr' ? 'Renvoyer le code' : 'Resend Code')}
                      </Button>
                    )}
                  </Box>
                </Fade>

                {/* Navigation Buttons */}
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column-reverse', sm: 'row' }, justifyContent: 'space-between', mt: 4, gap: 2 }}>
                  <Button
                    variant="outlined"
                    onClick={handleBack}
                    disabled={currentStep === 1 || loading}
                    startIcon={<ArrowBack />}
                    fullWidth
                    sx={{ 
                      borderRadius: 2, 
                      px: { xs: 2, sm: 3 }, 
                      py: { xs: 1.5, sm: 1.5 },
                      borderColor: '#417F73', 
                      color: '#417F73',
                      '&:hover': { borderColor: '#1E377C', bgcolor: '#F3F8FF' }
                    }}
                  >
                    {locale === 'fr' ? 'Précédent' : 'Back'}
                  </Button>
                  {currentStep < 4 ? (
                    <Button
                      variant="contained"
                      onClick={handleNext}
                      disabled={loading || (currentStep === 3 && sendingOtp)}
                      endIcon={<ArrowForward />}
                      fullWidth
                      sx={{
                        bgcolor: 'rgb(255, 203, 5)',
                        color: '#1E377C',
                        '&:hover': { bgcolor: 'rgb(255, 193, 0)' },
                        borderRadius: 2,
                        px: { xs: 2, sm: 3 },
                        py: { xs: 1.5, sm: 1.5 },
                        fontWeight: 700,
                        boxShadow: '0 4px 12px rgba(255, 203, 5, 0.3)'
                      }}
                    >
                      {currentStep === 3 && sendingOtp ? (
                        <CircularProgress size={20} sx={{ color: '#1E377C' }} />
                      ) : (
                        locale === 'fr' ? 'Étape suivante' : 'Next Step'
                      )}
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      onClick={handleSubmit}
                      disabled={loading}
                      fullWidth
                      sx={{
                        bgcolor: 'rgb(255, 203, 5)',
                        color: '#1E377C',
                        '&:hover': { bgcolor: 'rgb(255, 193, 0)' },
                        borderRadius: 2,
                        px: { xs: 2, sm: 3 },
                        py: { xs: 1.5, sm: 1.5 },
                        fontWeight: 700,
                        boxShadow: '0 4px 12px rgba(255, 203, 5, 0.3)'
                      }}
                    >
                      {loading ? (
                        <CircularProgress size={20} sx={{ color: '#1E377C' }} />
                      ) : (
                        locale === 'fr' ? 'Soumettre' : 'Submit'
                      )}
                    </Button>
                  )}
                </Box>
            </Card>
            </Fade>
          </Box>
          </Box>
        </Container>
    </Box>
  )
}
