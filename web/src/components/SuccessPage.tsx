import { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Box } from '@mui/material'
import { CheckCircle } from '@mui/icons-material'
import NotFound from '../pages/NotFound'

export default function SuccessPage() {
  const navigate = useNavigate()
  const location = useLocation() as { state?: { submitted?: boolean } }

  // Guard: only show when reached after submit
  if (!location.state || !location.state.submitted) {
    return <NotFound />
  }

  useEffect(() => {
    // Set a flag to prevent popup on landing page
    sessionStorage.setItem('fromSuccessPage', 'true')
    
    const timer = setTimeout(() => {
      // Navigate to landing page without any state to prevent popup
      navigate('/', { replace: true })
    }, 5000)

    return () => clearTimeout(timer)
  }, [navigate])

  return (
    <Box sx={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: 'linear-gradient(135deg, #22C55E 0%, #16A34A 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      px: { xs: 2, sm: 3, md: 4 }
    }}>
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          color: 'white',
          width: '100%',
          maxWidth: '600px',
          padding: '0 20px'
        }}
      >
        <CheckCircle sx={{ 
          fontSize: { xs: 80, sm: 100, md: 120 }, 
          mb: { xs: 2, sm: 3 } 
        }} />
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          style={{ 
            fontSize: 'clamp(1.75rem, 5vw, 2.5rem)', 
            fontWeight: 'bold', 
            marginBottom: '1rem', 
            margin: 0,
            lineHeight: 1.2
          }}
        >
          Success!
        </motion.h1>
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          style={{ 
            fontSize: 'clamp(1rem, 3vw, 1.2rem)', 
            marginBottom: '2rem', 
            margin: '0 0 2rem 0', 
            opacity: 0.9,
            lineHeight: 1.5,
            padding: '0 10px'
          }}
        >
          Your insurance quote request has been submitted successfully.
          <br />
          Our licensed professionals will contact you within 24 hours.
        </motion.p>
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          style={{ 
            fontSize: 'clamp(0.875rem, 2.5vw, 1rem)', 
            opacity: 0.8,
            textAlign: 'center'
          }}
        >
          Redirecting to homepage in 5 seconds...
        </motion.div>
      </motion.div>
    </Box>
  )
}
