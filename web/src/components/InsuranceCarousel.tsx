import { useState, useEffect } from 'react'
import { Box, Typography } from '@mui/material'
import { useI18n } from '../i18n'

interface InsuranceLogo {
  name: string
  src: string
  alt: string
}

const insuranceLogos: InsuranceLogo[] = [
  {
    name: 'Manulife',
    src: '/src/assets/insurance companies/manulife-logo-preview.png',
    alt: 'Manulife Insurance'
  },
  {
    name: 'Beneva',
    src: '/src/assets/insurance companies/beneva-ssq-lacapitale-brand-1536x672.jpg',
    alt: 'Beneva Insurance'
  },
  {
    name: 'Allianz',
    src: '/src/assets/insurance companies/Allianz.svg.png',
    alt: 'Allianz Insurance'
  },
  {
    name: 'Industrial Alliance',
    src: '/src/assets/insurance companies/IA_Financial_Group-Logo.wine.png',
    alt: 'Industrial Alliance Insurance'
  },
  {
    name: 'Travelance',
    src: '/src/assets/insurance companies/travelance-logo.png',
    alt: 'Travelance Insurance'
  },
  {
    name: '2VisitCanada',
    src: '/src/assets/insurance companies/2-visit-canada_logo.svg',
    alt: '2VisitCanada Insurance'
  },
  {
    name: 'Empire Life',
    src: '/src/assets/insurance companies/logo-en.png',
    alt: 'Empire Life Insurance'
  },
  {
    name: 'Foresters Financial',
    src: '/src/assets/insurance companies/PngItem_4618681.png',
    alt: 'Foresters Financial'
  }
]

export default function InsuranceCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const { t } = useI18n()

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % insuranceLogos.length)
    }, 3000) // Change every 3 seconds

    return () => clearInterval(interval)
  }, [])

  return (
    <Box sx={{ 
      bgcolor: 'white', 
      py: 6,
      borderTop: '1px solid rgba(105,131,204,0.1)',
      borderBottom: '1px solid rgba(105,131,204,0.1)',
      overflow: 'hidden'
    }}>
      <Box sx={{ maxWidth: '1400px', mx: 'auto', px: { xs: 3, md: 6 } }}>
        <Typography 
          variant="h6" 
          sx={{ 
            textAlign: 'center', 
            color: '#417F73', 
            mb: 4,
            fontWeight: 600,
            fontSize: '1rem'
          }}
        >
          {t('insurance_partners')}
        </Typography>
        
        {/* Carousel Container */}
        <Box sx={{ 
          position: 'relative',
          height: '120px',
          overflow: 'hidden',
          borderRadius: 2,
          bgcolor: '#F9FAFB',
          border: '1px solid rgba(105,131,204,0.1)'
        }}>
          {/* Sliding Container */}
          <Box sx={{
            display: 'flex',
            height: '100%',
            transition: 'transform 0.8s ease-in-out',
            transform: `translateX(-${currentIndex * (100 / 4)}%)`, // Show 4 logos at a time
            width: `${(insuranceLogos.length * 100) / 4}%` // Adjust width based on number of logos
          }}>
            {insuranceLogos.map((logo, index) => (
              <Box
                key={index}
                sx={{
                  flex: '0 0 25%', // Each logo takes 25% (4 logos visible)
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  px: 2,
                  py: 1
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100%',
                    width: '100%',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'scale(1.05)'
                    }
                  }}
                >
                  <img
                    src={logo.src}
                    alt={logo.alt}
                    style={{
                      maxHeight: '60px',
                      maxWidth: '120px',
                      objectFit: 'contain',
                      filter: 'grayscale(20%)',
                      transition: 'filter 0.3s ease'
                    }}
                    onError={(e) => {
                      console.error(`Failed to load logo: ${logo.name}`, e.currentTarget.src)
                      e.currentTarget.style.display = 'none'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.filter = 'grayscale(0%)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.filter = 'grayscale(20%)'
                    }}
                  />
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      color: '#6B7280', 
                      fontSize: '0.75rem',
                      fontWeight: 500,
                      mt: 0.5,
                      textAlign: 'center'
                    }}
                  >
                    {logo.name}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
          
          {/* Dots Indicator */}
          <Box sx={{
            position: 'absolute',
            bottom: 8,
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: 1
          }}>
            {insuranceLogos.map((_, index) => (
              <Box
                key={index}
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  bgcolor: index === currentIndex ? '#22C55E' : 'rgba(0,0,0,0.2)',
                  transition: 'background-color 0.3s ease',
                  cursor: 'pointer'
                }}
                onClick={() => setCurrentIndex(index)}
              />
            ))}
          </Box>
        </Box>
        
        {/* Static Grid Fallback for Mobile */}
        <Box sx={{ 
          display: { xs: 'flex', md: 'none' },
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: 2,
          mt: 3
        }}>
          {insuranceLogos.slice(0, 6).map((logo, index) => (
            <Box
              key={index}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                px: 2,
                py: 1,
                bgcolor: '#F3F8FF',
                borderRadius: 2,
                border: '1px solid rgba(105,131,204,0.1)',
                minWidth: '100px'
              }}
            >
              <img
                src={logo.src}
                alt={logo.alt}
                style={{
                  height: '30px',
                  width: 'auto',
                  objectFit: 'contain',
                  filter: 'grayscale(20%)'
                }}
                onError={(e) => {
                  console.error(`Failed to load mobile logo: ${logo.name}`, e.currentTarget.src)
                  e.currentTarget.style.display = 'none'
                }}
              />
              <Typography 
                variant="caption" 
                sx={{ 
                  color: '#6B7280', 
                  fontSize: '0.7rem',
                  fontWeight: 500,
                  mt: 0.5,
                  textAlign: 'center'
                }}
              >
                {logo.name}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  )
}
