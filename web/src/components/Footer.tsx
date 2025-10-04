import { useI18n } from '../i18n'
import { Box, Typography, Container } from '@mui/material'
import { Phone, Email, LocationOn } from '@mui/icons-material'

export default function Footer() {
  const { t } = useI18n()
  
  return (
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
            <Box sx={{ mb: 2 }}>
              <img 
                src="/src/assets/bna logo.png" 
                alt="BeaverNorth Advisors" 
                style={{ 
                  height: '45px',
                  width: 'auto',
                  marginBottom: '16px'
                }} 
              />
            </Box>
            <Typography variant="body2" sx={{ color: '#417F73', mb: 1 }}>
              Professional insurance guidance for Canadian families.
            </Typography>
            <Typography variant="body2" sx={{ color: '#6983CC', fontSize: '0.85rem' }}>
              © {new Date().getFullYear()} BeaverNorth Advisors
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
              Contact Us
            </Typography>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Phone sx={{ fontSize: 18, color: '#6983CC' }} />
                <Typography variant="body2" sx={{ color: '#417F73', fontSize: '0.9rem' }}>
                  (438) 763-5120
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Email sx={{ fontSize: 18, color: '#6983CC' }} />
                <Typography variant="body2" sx={{ color: '#417F73', fontSize: '0.9rem' }}>
                  beavernorthadvisors@gmail.com
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <LocationOn sx={{ fontSize: 18, color: '#6983CC' }} />
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
              Quick Links
            </Typography>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Typography 
                component="a" 
                href="/" 
                sx={{ 
                  color: '#417F73', 
                  textDecoration: 'none',
                  fontSize: '0.9rem',
                  '&:hover': { color: '#6983CC' },
                  transition: 'color 0.2s'
                }}
              >
                Home
              </Typography>
              <Typography 
                component="a" 
                href="/about" 
                sx={{ 
                  color: '#417F73', 
                  textDecoration: 'none',
                  fontSize: '0.9rem',
                  '&:hover': { color: '#6983CC' },
                  transition: 'color 0.2s'
                }}
              >
                About Us
              </Typography>
              <Typography 
                component="a" 
                href="/services" 
                sx={{ 
                  color: '#417F73', 
                  textDecoration: 'none',
                  fontSize: '0.9rem',
                  '&:hover': { color: '#6983CC' },
                  transition: 'color 0.2s'
                }}
              >
                Services
              </Typography>
              <Typography 
                component="a" 
                href="/contact" 
                sx={{ 
                  color: '#417F73', 
                  textDecoration: 'none',
                  fontSize: '0.9rem',
                  '&:hover': { color: '#6983CC' },
                  transition: 'color 0.2s'
                }}
              >
                Contact
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
          <Typography variant="body2" sx={{ color: '#6983CC', fontSize: '0.85rem' }}>
            {t('footer_tag')}
          </Typography>
        </Box>
      </Container>
    </Box>
  )
}
