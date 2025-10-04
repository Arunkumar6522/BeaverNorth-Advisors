import { Box, Typography } from '@mui/material'
import { Phone, Email, LocationOn } from '@mui/icons-material'

export default function TopBar() {
  return (
    <Box sx={{
      width: '100%',
      background: 'white',
      borderBottom: '1px solid rgba(105,131,204,0.1)',
      py: 1.5,
      display: { xs: 'none', md: 'flex' },
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      {/* Contact Info */}
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 4,
        color: '#417F73',
        fontSize: '0.9rem'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Phone sx={{ fontSize: 18, color: '#6983CC' }} />
          <Typography variant="body2" sx={{ fontWeight: 500, fontSize: '0.9rem', color: '#417F73' }}>
            (438) 763-5120
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Email sx={{ fontSize: 18, color: '#6983CC' }} />
          <Typography variant="body2" sx={{ fontWeight: 500, fontSize: '0.9rem', color: '#417F73' }}>
            beavernorthadvisors@gmail.com
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <LocationOn sx={{ fontSize: 18, color: '#6983CC' }} />
          <Typography variant="body2" sx={{ fontWeight: 500, fontSize: '0.9rem', color: '#417F73' }}>
            Montreal, QC
          </Typography>
        </Box>
      </Box>
    </Box>
  )
}
