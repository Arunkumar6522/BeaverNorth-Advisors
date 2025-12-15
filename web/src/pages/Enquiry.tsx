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
  Grid
} from '@mui/material'
import { 
  AccessTime, 
  Security,
  ArrowBack,
  ArrowForward
} from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { useI18n } from '../i18n'
import { gtagEvent } from '../lib/analytics'
import { supabase } from '../lib/supabase'

interface FormData {
  firstName: string
  lastName: string
  gender: 'male' | 'female' | 'prefer-not-to-say' | ''
  dob: string
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
    dob: '',
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
      if (!formData.dob) {
        newErrors.dob = 'Date of birth is required'
      }
    } else if (step === 2) {
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
    } else if (step === 3) {
      if (!formData.smokingStatus) {
        newErrors.smokingStatus = 'Smoking status is required'
      }
      if (!formData.province) {
        newErrors.province = 'Province is required'
      }
      if (!formData.insuranceProduct) {
        newErrors.insuranceProduct = 'Insurance product is required'
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
      if (currentStep === 2 && !otpSent) {
        // Send OTP before moving to step 3
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
      
      const result = await response.json()
      
      if (result.success) {
        setOtpSent(true)
        setOtpResendTimer(30)
        setOtpStatus('Verification code sent successfully!')
        setCurrentStep(3) // Move to step 3 after OTP is sent
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

      // Save to database
      const leadData = {
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        email: formData.email,
        phone: phoneNumber,
        dob: formData.dob,
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
          throw new Error(`Database error: ${dbError.message}`)
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
      
      // Redirect to landing page
      navigate('/', { state: { enquirySubmitted: true } })
      
    } catch (error: any) {
      setSubmitError(error.message || 'Failed to submit form. Please try again.')
      setLoading(false)
      gtagEvent('lead_submit_error', { form_id: 'enquiry', error: error.message })
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
    'Term Life Insurance',
    'Whole Life Insurance',
    'Universal Life Insurance',
    'Critical Illness Insurance',
    'Disability Insurance',
    'Travel Insurance'
  ]

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      bgcolor: '#f8fafc',
      position: 'relative',
      pb: 8
    }}>
      {/* Header */}
      <Box sx={{ 
        bgcolor: '#1E377C', 
        py: 2,
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <Container maxWidth="md">
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 700, 
                color: 'white',
                fontSize: { xs: '1rem', md: '1.25rem' }
              }}
            >
              BeaverNorth Financials
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'white' }}>
              <Security sx={{ fontSize: 18 }} />
              <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
                {locale === 'fr' ? 'Sécurisé' : 'Secure'}
              </Typography>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Main Form Container */}
      <Container maxWidth="md" sx={{ py: { xs: 3, md: 6 } }}>
        <Card sx={{ 
          p: { xs: 3, md: 4 },
          borderRadius: 3,
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          bgcolor: 'white'
        }}>
          {/* Form Header */}
          <Box sx={{ mb: 4 }}>
            <Typography 
              variant="h4" 
              sx={{ 
                fontWeight: 700, 
                color: '#111827',
                mb: 1,
                fontSize: { xs: '1.75rem', md: '2rem' }
              }}
            >
              {locale === 'fr' ? 'Commencer' : 'Get Started'}
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ 
                color: '#6B7280',
                mb: 2
              }}
            >
              {locale === 'fr' ? 'Parlez-nous de vous' : 'Tell us about yourself'}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
              <AccessTime sx={{ fontSize: 18, color: '#22C55E' }} />
              <Typography variant="body2" sx={{ color: '#22C55E', fontWeight: 500 }}>
                {locale === 'fr' ? 'Cela ne prendra que 2 minutes' : 'It will take only 2 minutes'}
              </Typography>
            </Box>

            {/* Progress Indicator */}
            <Box sx={{ position: 'relative', mb: 4 }}>
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                position: 'relative',
                zIndex: 1
              }}>
                {[1, 2, 3, 4].map((step) => (
                  <Box
                    key={step}
                    sx={{
                      width: step === currentStep ? '24px' : '8px',
                      height: '8px',
                      borderRadius: '4px',
                      bgcolor: step <= currentStep ? '#22C55E' : '#E5E7EB',
                      transition: 'all 0.3s ease',
                      position: 'relative'
                    }}
                  />
                ))}
              </Box>
              <Box sx={{
                position: 'absolute',
                top: '4px',
                left: 0,
                height: '8px',
                width: `${((currentStep - 1) / 3) * 100}%`,
                bgcolor: '#22C55E',
                borderRadius: '4px',
                transition: 'width 0.3s ease',
                zIndex: 0
              }} />
            </Box>
          </Box>

          {/* Error Alert */}
          {submitError && (
            <Alert severity="error" sx={{ mb: 3 }} onClose={() => setSubmitError('')}>
              {submitError}
            </Alert>
          )}

          {/* Step 1: Personal Information */}
          {currentStep === 1 && (
            <Box>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label={locale === 'fr' ? 'Prénom' : 'First name'}
                    required
                    value={formData.firstName}
                    onChange={(e) => updateFormData('firstName', e.target.value)}
                    error={!!errors.firstName}
                    helperText={errors.firstName}
                    placeholder={locale === 'fr' ? 'Votre prénom' : 'Your first name'}
                    sx={{ mb: 2 }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label={locale === 'fr' ? 'Nom de famille (optionnel)' : 'Last name (optional)'}
                    value={formData.lastName}
                    onChange={(e) => updateFormData('lastName', e.target.value)}
                    error={!!errors.lastName}
                    helperText={errors.lastName}
                    placeholder={locale === 'fr' ? 'Votre nom de famille' : 'Your last name'}
                    sx={{ mb: 2 }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth error={!!errors.gender} sx={{ mb: 2 }}>
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
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    type="date"
                    label={locale === 'fr' ? 'Date de naissance' : 'Date of Birth'}
                    required
                    value={formData.dob}
                    onChange={(e) => updateFormData('dob', e.target.value)}
                    error={!!errors.dob}
                    helperText={errors.dob}
                    InputLabelProps={{ shrink: true }}
                    inputProps={{ max: new Date().toISOString().split('T')[0] }}
                    sx={{ mb: 2 }}
                  />
                </Grid>
              </Grid>
            </Box>
          )}

          {/* Step 2: Contact Information */}
          {currentStep === 2 && (
            <Box>
              <Typography variant="h6" sx={{ mb: 3, color: '#111827', fontWeight: 600 }}>
                {locale === 'fr' ? 'Informations de contact' : 'Contact Information'}
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12}>
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
                    sx={{ mb: 2 }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <FormControl sx={{ width: '120px' }}>
                      <Select
                        value={formData.countryCode}
                        onChange={(e) => updateFormData('countryCode', e.target.value)}
                      >
                        <MenuItem value="+1">+1</MenuItem>
                        <MenuItem value="+44">+44</MenuItem>
                        <MenuItem value="+33">+33</MenuItem>
                      </Select>
                    </FormControl>
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
                    />
                  </Box>
                </Grid>
                {otpStatus && (
                  <Grid item xs={12}>
                    <Alert severity={otpSent ? 'success' : 'error'} sx={{ mt: 1 }}>
                      {otpStatus}
                    </Alert>
                  </Grid>
                )}
              </Grid>
            </Box>
          )}

          {/* Step 3: Insurance Details */}
          {currentStep === 3 && (
            <Box>
              <Typography variant="h6" sx={{ mb: 3, color: '#111827', fontWeight: 600 }}>
                {locale === 'fr' ? 'Détails de l\'assurance' : 'Insurance Details'}
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <FormControl fullWidth error={!!errors.smokingStatus} sx={{ mb: 2 }}>
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
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth error={!!errors.province} sx={{ mb: 2 }}>
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
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth error={!!errors.insuranceProduct} sx={{ mb: 2 }}>
                    <InputLabel>{locale === 'fr' ? 'Produit d\'assurance' : 'Insurance Product'}</InputLabel>
                    <Select
                      value={formData.insuranceProduct}
                      onChange={(e) => updateFormData('insuranceProduct', e.target.value)}
                      label={locale === 'fr' ? 'Produit d\'assurance' : 'Insurance Product'}
                    >
                      {insuranceProducts.map((product) => (
                        <MenuItem key={product} value={product}>{product}</MenuItem>
                      ))}
                    </Select>
                    {errors.insuranceProduct && (
                      <Typography variant="caption" sx={{ color: 'error.main', mt: 0.5, ml: 1.75 }}>
                        {errors.insuranceProduct}
                      </Typography>
                    )}
                  </FormControl>
                </Grid>
              </Grid>
            </Box>
          )}

          {/* Step 4: OTP Verification */}
          {currentStep === 4 && (
            <Box>
              <Typography variant="h6" sx={{ mb: 3, color: '#111827', fontWeight: 600 }}>
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
                inputProps={{ maxLength: 6, style: { textAlign: 'center', fontSize: '24px', letterSpacing: '8px' } }}
                sx={{ mb: 2 }}
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
                  sx={{ mb: 2 }}
                >
                  {sendingOtp ? <CircularProgress size={20} /> : (locale === 'fr' ? 'Renvoyer le code' : 'Resend Code')}
                </Button>
              )}
            </Box>
          )}

          {/* Navigation Buttons */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4, gap: 2 }}>
            <Button
              variant="outlined"
              onClick={handleBack}
              disabled={currentStep === 1 || loading}
              startIcon={<ArrowBack />}
            >
              {locale === 'fr' ? 'Précédent' : 'Back'}
            </Button>
            {currentStep < 4 ? (
              <Button
                variant="contained"
                onClick={handleNext}
                disabled={loading || (currentStep === 2 && sendingOtp)}
                endIcon={<ArrowForward />}
                sx={{
                  bgcolor: '#1E377C',
                  '&:hover': { bgcolor: '#152A5C' },
                  minWidth: '120px'
                }}
              >
                {currentStep === 2 && sendingOtp ? (
                  <CircularProgress size={20} sx={{ color: 'white' }} />
                ) : (
                  locale === 'fr' ? 'Étape suivante' : 'Next Step'
                )}
              </Button>
            ) : (
              <Button
                variant="contained"
                onClick={handleSubmit}
                disabled={loading}
                sx={{
                  bgcolor: '#22C55E',
                  '&:hover': { bgcolor: '#16A34A' },
                  minWidth: '120px'
                }}
              >
                {loading ? (
                  <CircularProgress size={20} sx={{ color: 'white' }} />
                ) : (
                  locale === 'fr' ? 'Soumettre' : 'Submit'
                )}
              </Button>
            )}
          </Box>
        </Card>
      </Container>
    </Box>
  )
}
