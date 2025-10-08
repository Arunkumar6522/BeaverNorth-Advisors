import { Box, Typography } from '@mui/material'
import { useI18n } from '../i18n'

// Import logos
import manulifeLogo from '../assets/insurance companies/manulife-logo-preview.png'
import benevaLogo from '../assets/insurance companies/beneva-ssq-lacapitale-brand-1536x672.jpg'
import allianzLogo from '../assets/insurance companies/Allianz.svg.png'
import iaLogo from '../assets/insurance companies/IA_Financial_Group-Logo.wine.png'
import travelanceLogo from '../assets/insurance companies/travelance-logo.png'
import visitCanadaLogo from '../assets/insurance companies/2-visit-canada_logo.svg'
import empireLifeLogo from '../assets/insurance companies/logo-en.png'

interface InsuranceLogo {
  name: string
  src: string
  alt: string
}

const insuranceLogos: InsuranceLogo[] = [
  {
    name: 'Manulife',
    src: manulifeLogo,
    alt: 'Manulife Insurance'
  },
  {
    name: 'Beneva',
    src: benevaLogo,
    alt: 'Beneva Insurance'
  },
  {
    name: 'Allianz',
    src: allianzLogo,
    alt: 'Allianz Insurance'
  },
  {
    name: 'Industrial Alliance',
    src: iaLogo,
    alt: 'Industrial Alliance Insurance'
  },
  {
    name: 'Travelance',
    src: travelanceLogo,
    alt: 'Travelance Insurance'
  },
  {
    name: '2VisitCanada',
    src: visitCanadaLogo,
    alt: '2VisitCanada Insurance'
  },
  {
    name: 'Empire Life',
    src: empireLifeLogo,
    alt: 'Empire Life Insurance'
  }
]

export default function InsuranceCarousel() {
  const { t } = useI18n()

  // Create a continuous loop by duplicating the logos array
  const continuousLogos = [...insuranceLogos, ...insuranceLogos]

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
        
        {/* Continuous Scrolling Container */}
        <Box sx={{ 
          position: 'relative',
          height: '120px',
          overflow: 'hidden',
          borderRadius: 2,
          bgcolor: '#F9FAFB',
          border: '1px solid rgba(105,131,204,0.1)'
        }}>
          {/* Scrolling Animation */}
          <Box sx={{
            display: 'flex',
            height: '100%',
            width: 'fit-content',
            animation: 'scroll 30s linear infinite',
            '@keyframes scroll': {
              '0%': {
                transform: 'translateX(0)'
              },
              '100%': {
                transform: `translateX(-${(insuranceLogos.length * 200)}px)`
              }
            }
          }}>
            {continuousLogos.map((logo, index) => (
              <Box
                key={`${logo.name}-${index}`}
                sx={{
                  flex: '0 0 200px', // Fixed width for each logo
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
                      maxHeight: logo.name === 'Manulife' ? '120px' : '60px',
                      maxWidth: logo.name === 'Manulife' ? '240px' : '120px',
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
                </Box>
              </Box>
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
                  height: logo.name === 'Manulife' ? '60px' : '30px',
                  width: 'auto',
                  objectFit: 'contain',
                  filter: 'grayscale(20%)'
                }}
                onError={(e) => {
                  console.error(`Failed to load mobile logo: ${logo.name}`, e.currentTarget.src)
                  e.currentTarget.style.display = 'none'
                }}
              />
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  )
}
