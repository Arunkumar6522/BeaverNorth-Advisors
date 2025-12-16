import { useI18n } from '../i18n'
import { Box, Typography, Container } from '@mui/material'
import { Phone, Email, LocationOn } from '@mui/icons-material'
import { useState } from 'react'
import PrivacyPolicyModal from './PrivacyPolicyModal'

export default function Footer() {
  const { t } = useI18n()
  const [privacyModalOpen, setPrivacyModalOpen] = useState(false)
  
  return (
    <>
      <Box sx={{
        bgcolor: 'white',
        borderTop: '1px solid rgba(105,131,204,0.1)',
        py: 6,
        mt: 8
      }}>
        <Container maxWidth="lg">
          <Box sx={{ 
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
            gap: 4
          }}>
            {/* Logo and Copyright */}
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#1E377C', mb: 1 }}>
                BeaverNorth Financials
              </Typography>
              <Typography variant="body2" sx={{ color: '#417F73', mb: 1 }}>
                {t('footer_description')}
              </Typography>
              <Typography variant="body2" sx={{ color: '#6B7280', fontSize: '0.85rem' }}>
                © {new Date().getFullYear()} BeaverNorth Financials
              </Typography>
            </Box>

            {/* Contact Information */}
            <Box>
              <Typography variant="h6" sx={{ 
                fontWeight: 700, 
                color: '#1E377C', 
                mb: 2,
                fontSize: '1rem'
              }}>
                {t('contact_title')}
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Phone sx={{ fontSize: 18, color: '#6B7280' }} />
                  <Typography variant="body2" sx={{ color: '#417F73', fontSize: '0.9rem' }}>
                    (438) 763-5120
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Email sx={{ fontSize: 18, color: '#6B7280' }} />
                  <Typography variant="body2" sx={{ color: '#417F73', fontSize: '0.9rem' }}>
                    beavernorthadvisors@gmail.com
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <LocationOn sx={{ fontSize: 18, color: '#6B7280' }} />
                  <Typography variant="body2" sx={{ color: '#417F73', fontSize: '0.9rem' }}>
                    Montreal, Quebec, Canada
                  </Typography>
                </Box>
              </Box>
            </Box>

            {/* Quick Links */}
            <Box>
              <Typography variant="h6" sx={{ 
                fontWeight: 700, 
                color: '#1E377C', 
                mb: 2,
                fontSize: '1rem'
              }}>
                {t('footer_quick_links')}
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Typography 
                  component="a" 
                  href="/" 
                  sx={{ 
                    color: '#417F73', 
                    textDecoration: 'none',
                    fontSize: '0.9rem',
                    '&:hover': { color: '#1E377C' },
                    transition: 'color 0.2s'
                  }}
                >
                  {t('nav_home')}
                </Typography>
                <Typography 
                  component="a" 
                  href="/about" 
                  sx={{ 
                    color: '#417F73', 
                    textDecoration: 'none',
                    fontSize: '0.9rem',
                    '&:hover': { color: '#1E377C' },
                    transition: 'color 0.2s'
                  }}
                >
                  {t('nav_about')}
                </Typography>
                <Typography 
                  component="a" 
                  href="/services" 
                  sx={{ 
                    color: '#417F73', 
                    textDecoration: 'none',
                    fontSize: '0.9rem',
                    '&:hover': { color: '#1E377C' },
                    transition: 'color 0.2s'
                  }}
                >
                  {t('nav_services')}
                </Typography>
                <Typography 
                  component="a" 
                  href="/contact" 
                  sx={{ 
                    color: '#417F73', 
                    textDecoration: 'none',
                    fontSize: '0.9rem',
                    '&:hover': { color: '#1E377C' },
                    transition: 'color 0.2s'
                  }}
                >
                  {t('nav_contact')}
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Bottom Bar */}
          <Box sx={{ 
            mt: 4, 
            pt: 3, 
            borderTop: '1px solid rgba(105,131,204,0.1)',
            textAlign: 'center'
          }}>
            <Typography variant="body2" sx={{ color: '#6B7280', fontSize: '0.85rem', mb: 1 }}>
              {t('footer_tag')}
            </Typography>
            <Typography 
              component="button"
              onClick={() => setPrivacyModalOpen(true)}
              sx={{ 
                color: '#6B7280', 
                fontSize: '0.85rem',
                textDecoration: 'underline',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                '&:hover': { color: '#1E377C' },
                transition: 'color 0.2s'
              }}
            >
              {t('privacy_policy')}
            </Typography>
          </Box>
        </Container>
      </Box>

      <PrivacyPolicyModal 
        open={privacyModalOpen} 
        onClose={() => setPrivacyModalOpen(false)} 
      />
    </>
  )
}
