import { useEffect, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { Box, Typography, Card, Button, Alert, CircularProgress } from '@mui/material'
import { CheckCircle, Cancel } from '@mui/icons-material'

export default function UnsubscribePage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'already'>('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    const unsubscribe = async () => {
      const email = searchParams.get('email')
      const name = searchParams.get('name')
      const category = searchParams.get('category')

      if (!email) {
        setStatus('error')
        setMessage('Invalid unsubscribe link. Email parameter is missing.')
        return
      }

      try {
        // Use Netlify function or direct API call
        const baseUrl = import.meta.env.VITE_API_URL || window.location.origin
        const apiUrl = `${baseUrl}/.netlify/functions/unsubscribe?email=${encodeURIComponent(email)}${name ? `&name=${encodeURIComponent(name)}` : ''}${category ? `&category=${encodeURIComponent(category)}` : ''}`

        const response = await fetch(apiUrl)
        const data = await response.json()

        if (data.success) {
          if (data.alreadyUnsubscribed) {
            setStatus('already')
            setMessage('You have already been unsubscribed from our mailing list.')
          } else {
            setStatus('success')
            setMessage('You have been successfully unsubscribed from our mailing list. You will no longer receive emails from us.')
          }
        } else {
          setStatus('error')
          setMessage(data.message || 'Failed to unsubscribe. Please try again later.')
        }
      } catch (error) {
        console.error('Unsubscribe error:', error)
        setStatus('error')
        setMessage('An error occurred while processing your unsubscribe request. Please try again later.')
      }
    }

    unsubscribe()
  }, [searchParams])

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: '#F9FAFB',
        p: 2
      }}
    >
      <Card sx={{ maxWidth: 500, width: '100%', p: 4, textAlign: 'center' }}>
        {status === 'loading' && (
          <>
            <CircularProgress sx={{ mb: 2 }} />
            <Typography variant="h6" sx={{ mb: 1 }}>
              Processing your request...
            </Typography>
          </>
        )}

        {status === 'success' && (
          <>
            <CheckCircle sx={{ fontSize: 64, color: '#10B981', mb: 2 }} />
            <Typography variant="h5" sx={{ mb: 2, fontWeight: 600, color: '#111827' }}>
              Successfully Unsubscribed
            </Typography>
            <Alert severity="success" sx={{ mb: 3, textAlign: 'left' }}>
              {message}
            </Alert>
            <Typography variant="body2" sx={{ color: '#6B7280', mb: 3 }}>
              If you change your mind, you can always subscribe again by contacting us.
            </Typography>
            <Button variant="contained" onClick={() => navigate('/')}>
              Return to Homepage
            </Button>
          </>
        )}

        {status === 'already' && (
          <>
            <CheckCircle sx={{ fontSize: 64, color: '#F59E0B', mb: 2 }} />
            <Typography variant="h5" sx={{ mb: 2, fontWeight: 600, color: '#111827' }}>
              Already Unsubscribed
            </Typography>
            <Alert severity="info" sx={{ mb: 3, textAlign: 'left' }}>
              {message}
            </Alert>
            <Button variant="contained" onClick={() => navigate('/')}>
              Return to Homepage
            </Button>
          </>
        )}

        {status === 'error' && (
          <>
            <Cancel sx={{ fontSize: 64, color: '#EF4444', mb: 2 }} />
            <Typography variant="h5" sx={{ mb: 2, fontWeight: 600, color: '#111827' }}>
              Unsubscribe Failed
            </Typography>
            <Alert severity="error" sx={{ mb: 3, textAlign: 'left' }}>
              {message}
            </Alert>
            <Button variant="contained" onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </>
        )}
      </Card>
    </Box>
  )
}

