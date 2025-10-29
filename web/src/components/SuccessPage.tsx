import { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
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
    const timer = setTimeout(() => {
      navigate('/')
    }, 5000)

    return () => clearTimeout(timer)
  }, [navigate])

  return (
    <div style={{
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
      zIndex: 9999
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
          color: 'white'
        }}
      >
        <CheckCircle sx={{ fontSize: 120, mb: 3 }} />
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '1rem', margin: 0 }}
        >
          Success!
        </motion.h1>
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          style={{ fontSize: '1.2rem', marginBottom: '2rem', margin: '0 0 2rem 0', opacity: 0.9 }}
        >
          Your insurance quote request has been submitted successfully.
          <br />
          Our licensed advisors will contact you within 24 hours.
        </motion.p>
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          style={{ fontSize: '1rem', opacity: 0.8 }}
        >
          Redirecting to homepage in 5 seconds...
        </motion.div>
      </motion.div>
    </div>
  )
}
