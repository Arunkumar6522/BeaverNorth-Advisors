import { Box, Typography, Container } from '@mui/material'
import { Email } from '@mui/icons-material'

export default function EmailMarketing() {
  return (
    <Box sx={{ height: '100%', overflow: 'auto', px: 1 }}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
          <Email sx={{ fontSize: 40, color: '#1E377C' }} />
          <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#111827' }}>
            Email Marketing
          </Typography>
        </Box>
        
        <Box sx={{ 
          bgcolor: 'white', 
          p: 4, 
          borderRadius: 2, 
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <Typography variant="h6" sx={{ color: '#6B7280', mb: 2 }}>
            Email Marketing Module
          </Typography>
          <Typography variant="body1" sx={{ color: '#9CA3AF' }}>
            This module is coming soon. Manage your email campaigns and marketing communications here.
          </Typography>
        </Box>
      </Container>
    </Box>
  )
}

