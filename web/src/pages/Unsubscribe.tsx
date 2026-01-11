import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CircularProgress,
  Alert
} from '@mui/material'
import { CheckCircle, Cancel } from '@mui/icons-material'

export default function Unsubscribe() {
  const [searchParams] = useSearchParams()
  const email = searchParams.get('email')
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (!email) {
      setStatus('error')
      setMessage('Email address is required')
      return
    }

    const unsubscribe = async () => {
      try {
        const response = await fetch('/.netlify/functions/unsubscribe', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email: decodeURIComponent(email)
          })
        })

        const data = await response.json()

        if (data.success) {
          setStatus('success')
          setMessage('You have been successfully unsubscribed from our email list.')
        } else {
          setStatus('error')
          setMessage(data.message || 'Failed to unsubscribe. Please try again.')
        }
      } catch (error: any) {
        setStatus('error')
        setMessage('An error occurred. Please try again later.')
        console.error('Unsubscribe error:', error)
      }
    }

    unsubscribe()
  }, [email])

  return (
    <Container maxWidth="sm" sx={{ mt: 8, mb: 8 }}>
      <Card sx={{ p: 4, textAlign: 'center' }}>
        {status === 'loading' && (
          <Box>
            <CircularProgress sx={{ mb: 2 }} />
            <Typography variant="h6">Processing your request...</Typography>
          </Box>
        )}

        {status === 'success' && (
          <Box>
            <CheckCircle sx={{ fontSize: 64, color: '#10B981', mb: 2 }} />
            <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
              Unsubscribed Successfully
            </Typography>
            <Typography variant="body1" sx={{ mb: 3, color: '#6B7280' }}>
              {message}
            </Typography>
            <Typography variant="body2" sx={{ color: '#9CA3AF' }}>
              You will no longer receive marketing emails from BeaverNorth Advisors.
            </Typography>
          </Box>
        )}

        {status === 'error' && (
          <Box>
            <Cancel sx={{ fontSize: 64, color: '#EF4444', mb: 2 }} />
            <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
              Unsubscribe Failed
            </Typography>
            <Alert severity="error" sx={{ mb: 2 }}>
              {message}
            </Alert>
            <Button
              variant="contained"
              onClick={() => window.location.reload()}
              sx={{ mt: 2 }}
            >
              Try Again
            </Button>
          </Box>
        )}
      </Card>
    </Container>
  )
}

