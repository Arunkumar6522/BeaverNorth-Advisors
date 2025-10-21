import { useEffect, useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { Box, CircularProgress, Typography } from '@mui/material'
import { customAuth } from '../lib/custom-auth'

interface ProtectedRouteProps {
  children: React.ReactNode
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const location = useLocation()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check if user is authenticated
        const authStatus = customAuth.isAuthenticated()
        setIsAuthenticated(authStatus)
        
        // If authenticated, verify the session is still valid
        if (authStatus) {
          const user = customAuth.getCurrentUser()
          if (!user) {
            // Session expired or invalid
            customAuth.logout()
            setIsAuthenticated(false)
          }
        }
      } catch (error) {
        console.error('Auth check failed:', error)
        setIsAuthenticated(false)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          bgcolor: '#f8fafc',
          gap: 2
        }}
      >
        <CircularProgress
          sx={{
            color: 'rgb(255, 203, 5)',
            width: 48,
            height: 48
          }}
        />
        <Typography variant="h6" sx={{ color: '#6B7280' }}>
          Verifying access...
        </Typography>
      </Box>
    )
  }

  // If not authenticated, redirect to login with return URL
  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        state={{ from: location.pathname }}
        replace
      />
    )
  }

  // If authenticated, render the protected component
  return <>{children}</>
}
