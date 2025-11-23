import { useState, useEffect } from 'react'
import { Box, Container, Typography, Grid, Card } from '@mui/material'
import { Shield, CheckCircle, Phone, Email, LocationOn, Security, VerifiedUser } from '@mui/icons-material'
import ContactModal from '../components/ContactModal'
import { useNavigate } from 'react-router-dom'
import { useI18n } from '../i18n'

export default function Enquiry() {
  const navigate = useNavigate()
  const { locale } = useI18n()
  const [isOpen, setIsOpen] = useState(true)
  const [formSubmitted, setFormSubmitted] = useState(false)

  // Prevent browser back button navigation
  useEffect(() => {
    if (formSubmitted) return

    // Add a history entry to prevent back navigation
    window.history.pushState(null, '', window.location.href)

    const handlePopState = () => {
      // Push state again to prevent navigation
      window.history.pushState(null, '', window.location.href)
    }

    window.addEventListener('popstate', handlePopState)

    // Also prevent page unload with a warning
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault()
      e.returnValue = ''
      return ''
    }

    window.addEventListener('beforeunload', handleBeforeUnload)

    return () => {
      window.removeEventListener('popstate', handlePopState)
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [formSubmitted])

  // Handle successful form submission
  const handleFormSuccess = () => {
    setFormSubmitted(true)
    // Navigate to success page after form is submitted
    navigate('/success', { state: { submitted: true } })
  }

  // Prevent closing the modal unless form is submitted
  const handleClose = () => {
    if (!formSubmitted) {
      // Do nothing - prevent closing
      return
    }
    setIsOpen(false)
  }

  if (!isOpen) {
    return null
  }

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      bgcolor: '#f8fafc',
      position: 'relative'
    }}>
      {/* Professional Header */}
      <Box sx={{ 
        bgcolor: '#1E377C', 
        py: 3,
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
              <Security sx={{ fontSize: 20 }} />
              <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
                {locale === 'fr' ? 'Sécurisé' : 'Secure'}
              </Typography>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Hero Section */}
      <Box sx={{ 
        bgcolor: 'linear-gradient(135deg, rgb(255, 203, 5) 0%, rgb(255, 193, 0) 100%)',
        background: 'linear-gradient(135deg, rgb(255, 203, 5) 0%, rgb(255, 193, 0) 100%)',
        py: { xs: 4, md: 6 }
      }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography 
              variant="h3" 
              sx={{ 
                fontWeight: 700, 
                color: '#1E377C',
                mb: 2,
                fontSize: { xs: '2rem', md: '2.5rem' }
              }}
            >
              {locale === 'fr' ? 'Demandez Votre Devis Gratuit' : 'Get Your Free Insurance Quote'}
            </Typography>
            <Typography 
              variant="h6" 
              sx={{ 
                color: '#1E377C', 
                fontWeight: 400,
                maxWidth: 700,
                mx: 'auto',
                fontSize: { xs: '1rem', md: '1.25rem' }
              }}
            >
              {locale === 'fr' 
                ? 'Obtenez des conseils d\'experts en assurance au Canada. Remplissez le formulaire ci-dessous et nous vous contacterons dans les plus brefs délais.'
                : 'Get expert insurance advice in Canada. Fill out the form below and we\'ll get back to you promptly.'}
            </Typography>
          </Box>

          {/* Trust Indicators */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid size={{ xs: 6, md: 3 }}>
              <Box sx={{ textAlign: 'center' }}>
                <CheckCircle sx={{ fontSize: 40, color: '#22C55E', mb: 1 }} />
                <Typography variant="body2" sx={{ color: '#1E377C', fontWeight: 600 }}>
                  {locale === 'fr' ? 'Gratuit' : 'Free Quote'}
                </Typography>
              </Box>
            </Grid>
            <Grid size={{ xs: 6, md: 3 }}>
              <Box sx={{ textAlign: 'center' }}>
                <VerifiedUser sx={{ fontSize: 40, color: '#22C55E', mb: 1 }} />
                <Typography variant="body2" sx={{ color: '#1E377C', fontWeight: 600 }}>
                  {locale === 'fr' ? 'Expert' : 'Expert Advice'}
                </Typography>
              </Box>
            </Grid>
            <Grid size={{ xs: 6, md: 3 }}>
              <Box sx={{ textAlign: 'center' }}>
                <Shield sx={{ fontSize: 40, color: '#22C55E', mb: 1 }} />
                <Typography variant="body2" sx={{ color: '#1E377C', fontWeight: 600 }}>
                  {locale === 'fr' ? 'Sécurisé' : 'Secure'}
                </Typography>
              </Box>
            </Grid>
            <Grid size={{ xs: 6, md: 3 }}>
              <Box sx={{ textAlign: 'center' }}>
                <Phone sx={{ fontSize: 40, color: '#22C55E', mb: 1 }} />
                <Typography variant="body2" sx={{ color: '#1E377C', fontWeight: 600 }}>
                  {locale === 'fr' ? 'Rapide' : 'Quick Response'}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Main Content with Form */}
      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
        <Grid container spacing={4}>
          {/* Left Side - Benefits/Info */}
          <Grid size={{ xs: 12, md: 5 }}>
            <Card sx={{ p: 4, height: '100%', bgcolor: 'white', borderRadius: 3, boxShadow: '0 4px 16px rgba(0,0,0,0.08)' }}>
              <Typography variant="h5" sx={{ fontWeight: 700, color: '#1E377C', mb: 3 }}>
                {locale === 'fr' ? 'Pourquoi nous choisir ?' : 'Why Choose Us?'}
              </Typography>
              
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                  <CheckCircle sx={{ color: '#22C55E', mt: 0.5 }} />
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#1E377C', mb: 0.5 }}>
                      {locale === 'fr' ? 'Conseil Expert' : 'Expert Guidance'}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#6B7280' }}>
                      {locale === 'fr' 
                        ? 'Nos conseillers expérimentés vous aident à trouver la meilleure couverture.'
                        : 'Our experienced advisors help you find the best coverage.'}
                    </Typography>
                  </Box>
                </Box>
                
                <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                  <CheckCircle sx={{ color: '#22C55E', mt: 0.5 }} />
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#1E377C', mb: 0.5 }}>
                      {locale === 'fr' ? 'Options Personnalisées' : 'Customized Options'}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#6B7280' }}>
                      {locale === 'fr' 
                        ? 'Solutions d\'assurance adaptées à vos besoins spécifiques.'
                        : 'Insurance solutions tailored to your specific needs.'}
                    </Typography>
                  </Box>
                </Box>
                
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <CheckCircle sx={{ color: '#22C55E', mt: 0.5 }} />
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#1E377C', mb: 0.5 }}>
                      {locale === 'fr' ? 'Support Continu' : 'Ongoing Support'}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#6B7280' }}>
                      {locale === 'fr' 
                        ? 'Nous sommes là pour vous aider à chaque étape.'
                        : 'We\'re here to support you every step of the way.'}
                    </Typography>
                  </Box>
                </Box>
              </Box>

              <Box sx={{ 
                bgcolor: '#f3f4f6', 
                p: 3, 
                borderRadius: 2,
                borderLeft: '4px solid rgb(255, 203, 5)'
              }}>
                <Typography variant="body2" sx={{ color: '#374151', fontStyle: 'italic', mb: 2 }}>
                  {locale === 'fr' 
                    ? 'Vos informations sont sécurisées et ne seront jamais partagées avec des tiers.'
                    : 'Your information is secure and will never be shared with third parties.'}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Security sx={{ fontSize: 20, color: '#22C55E' }} />
                  <Typography variant="caption" sx={{ color: '#6B7280' }}>
                    {locale === 'fr' ? 'Connexion sécurisée SSL' : 'SSL Secure Connection'}
                  </Typography>
                </Box>
              </Box>
            </Card>
          </Grid>

          {/* Right Side - Form */}
          <Grid size={{ xs: 12, md: 7 }}>
            <Card sx={{ 
              p: { xs: 3, md: 4 }, 
              bgcolor: 'white', 
              borderRadius: 3, 
              boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
              position: 'relative'
            }}>
              <ContactModal
                isOpen={isOpen}
                showCloseButton={false}
                disableBackdropClose={true}
                onClose={handleClose}
                onFormSuccess={handleFormSuccess}
                embeddedMode={true}
              />
            </Card>
          </Grid>
        </Grid>
      </Container>

      {/* Footer Section */}
      <Box sx={{ 
        bgcolor: '#1E377C', 
        py: 4,
        mt: 6
      }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid size={{ xs: 12, sm: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <Phone sx={{ color: 'rgb(255, 203, 5)' }} />
                <Typography variant="body1" sx={{ color: 'white' }}>
                  +1 (514) 123-4567
                </Typography>
              </Box>
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <Email sx={{ color: 'rgb(255, 203, 5)' }} />
                <Typography variant="body1" sx={{ color: 'white' }}>
                  beavernorthadvisors@gmail.com
                </Typography>
              </Box>
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <LocationOn sx={{ color: 'rgb(255, 203, 5)' }} />
                <Typography variant="body1" sx={{ color: 'white' }}>
                  {locale === 'fr' ? 'Montréal, Canada' : 'Montreal, Canada'}
                </Typography>
              </Box>
            </Grid>
          </Grid>
          <Box sx={{ textAlign: 'center', mt: 3, pt: 3, borderTop: '1px solid rgba(255,255,255,0.2)' }}>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
              © 2024 BeaverNorth Advisors. {locale === 'fr' ? 'Tous droits réservés.' : 'All rights reserved.'}
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  )
}
