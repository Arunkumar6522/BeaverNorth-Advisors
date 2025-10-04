import { Box, Typography } from '@mui/material'
import { Phone, Email, LocationOn } from '@mui/icons-material'

export default function TopBar() {
  return (
    <Box sx={{
      width: '100%',
      background: 'linear-gradient(135deg, #6983CC 0%, #6BA336 100%)',
      py: 1.5,
      display: { xs: 'none', md: 'flex' },
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background Pattern */}
      <Box sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: 'radial-gradient(circle at 30% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)',
        animation: 'shimmer 3s ease-in-out infinite'
      }} />
      
      {/* Content */}
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 4,
        color: 'white',
        position: 'relative',
        zIndex: 2
      }}>
        {/* Trust Badge */}
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          px: 3,
          py: 1,
          borderRadius: 2,
          bgcolor: 'rgba(255,255,255,0.15)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.2)'
        }}>
          <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.85rem' }}>
            🛡️ Licensed Canadian Insurance Advisors
          </Typography>
        </Box>

        {/* Contact Info */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Phone sx={{ fontSize: 16 }} />
            <Typography variant="body2" sx={{ fontWeight: 500, fontSize: '0.85rem' }}>
              (438) 763-5120
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Email sx={{ fontSize: 16 }} />
            <Typography variant="body2" sx={{ fontWeight: 500, fontSize: '0.85rem' }}>
              beavernorthadvisors@gmail.com
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <LocationOn sx={{ fontSize: 16 }} />
            <Typography variant="body2" sx={{ fontWeight: 500, fontSize: '0.85rem' }}>
              Montreal, QC
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Shimmer Animation */}
      <style>
        {`
          @keyframes shimmer {
            0%, 100% { opacity: 0.7; transform: translateX(-100%); }
            50% { opacity: 1; transform: translateX(100%); }
          }
        `}
      </style>
    </Box>
  )
}