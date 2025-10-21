import './App.css'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Box, Typography, Button } from '@mui/material'
import { ArrowForward } from '@mui/icons-material'
import Nav from './components/Nav'
import Footer from './components/Footer'
import ContactModal from './components/ContactModal'
import InsuranceCarousel from './components/InsuranceCarousel'
import AsuransiSVG from './assets/Asuransi keluarga 1.svg'
import { useI18n } from './i18n'

export default function App() {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false)
  const { t } = useI18n()

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#F3F8FF' }}>
      <Nav />
      
      {/* HERO Section - Minimalist Clean Design */}
      <Box sx={{
        minHeight: 'calc(100vh - 100px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        px: { xs: 3, md: 6 },
        py: { xs: 4, md: 6 }
      }}>
        
        <Box sx={{ 
          maxWidth: '1400px',
          width: '100%',
          display: { xs: 'flex', lg: 'grid' },
          gridTemplateColumns: { lg: '1fr 1fr' },
          flexDirection: { xs: 'column-reverse', lg: 'row' },
          alignItems: 'center',
          gap: { xs: 6, lg: 8 }
        }}>
          
          {/* LEFT SIDE - Content */}
          <Box sx={{ 
            textAlign: { xs: 'center', lg: 'left' },
            display: 'flex',
            flexDirection: 'column',
            alignItems: { xs: 'center', lg: 'flex-start' }
          }}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              {/* Title */}
              <Typography 
                variant="h1" 
                sx={{ 
                  fontWeight: 800,
                  fontSize: { xs: '2.5rem', md: '3.5rem', lg: '4.5rem' },
                  lineHeight: 1.1,
                  mb: 3,
                  color: '#1E377C'
                }}
              >
                {t('hero_headline_1')} {t('hero_headline_2')}
              </Typography>

              {/* Subheading */}
              <Typography 
                variant="h5" 
                sx={{ 
                  color: '#417F73', 
                  fontWeight: 400,
                  mb: 6,
                  lineHeight: 1.6,
                  fontSize: { xs: '1.1rem', md: '1.3rem' },
                  maxWidth: '600px'
                }}
              >
                {t('hero_subtitle')}
              </Typography>

              {/* CTA Button */}
              <Button
                onClick={() => setIsContactModalOpen(true)}
                variant="contained"
                size="large"
                endIcon={<ArrowForward />}
                sx={{
                  bgcolor: 'rgb(255, 203, 5)',
                  color: '#1E377C',
                  px: 6,
                  py: 3,
                  fontSize: '1.1rem',
                  fontWeight: 700,
                  borderRadius: 3,
                  textTransform: 'none',
                  boxShadow: '0 8px 24px rgba(255, 203, 5, 0.3)',
                  '&:hover': {
                    bgcolor: 'rgb(255, 193, 0)',
                    color: '#1E377C',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 12px 32px rgba(255, 203, 5, 0.4)'
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                {t('cta_get_quote')}
              </Button>
            </motion.div>
          </Box>

          {/* RIGHT SIDE - Asuransi SVG */}
          <Box sx={{ 
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              style={{ width: '100%', maxWidth: '600px' }}
            >
              <img 
                src={AsuransiSVG} 
                alt="Insurance Family"
                style={{ 
                  width: '100%', 
                  height: 'auto',
                  display: 'block'
                }} 
              />
            </motion.div>
          </Box>
        </Box>
      </Box>

      {/* Insurance Companies Carousel */}
      <InsuranceCarousel />

      <Footer />
      
      {/* Contact Modal */}
      <ContactModal 
        isOpen={isContactModalOpen} 
        onClose={() => setIsContactModalOpen(false)} 
      />
    </Box>
  )
}
