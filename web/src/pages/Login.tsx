import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { customAuth } from '../lib/custom-auth'
import { useNavigate, useLocation } from 'react-router-dom'

export default function Login() {
  const [loginInput, setLoginInput] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const navigate = useNavigate()
  const location = useLocation()

  // Get the intended destination from location state
  const from = (location.state as any)?.from || '/dashboard'

  useEffect(() => {
    // Check if user is already logged in
    if (customAuth.isAuthenticated()) {
      navigate(from, { replace: true })
    }
  }, [navigate, from])

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      const result = await customAuth.login(loginInput, password)
      
      if (result.success) {
        setMessage('Login successful! Redirecting...')
        setTimeout(() => navigate(from, { replace: true }), 1000)
      } else {
        if (result.errorCode === 'cooldown') {
          setMessage('Too many attempts. Try again in 10 minutes.')
        } else if (result.errorCode === 'no_user') {
          setMessage('No user found')
        } else if (result.errorCode === 'bad_password') {
          setMessage('Invalid password')
        } else {
          setMessage(result.error || 'Login failed')
        }
      }
    } catch (error) {
      console.error('Login error:', error)
      setMessage('Network error. Please try again.')
    }
    setLoading(false)
  }


  return (
    <div style={{ 
      height: '100vh', 
      width: '100vw',
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      background: '#0a2540',
      overflow: 'hidden',
      position: 'fixed',
      top: 0,
      left: 0
    }}>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{ 
          background: 'white', 
          padding: 32, 
          borderRadius: 16, 
          width: 400, 
          maxWidth: '90vw',
          boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
          boxSizing: 'border-box'
        }}
      >
        <h2 style={{ marginTop: 0, marginBottom: 16 }}>BeaverNorth Financials</h2>
        <p style={{ marginTop: 0, color: '#555', marginBottom: 16 }}>Admin Login</p>
        
        
        {message && (
          <div style={{ 
            padding: 10, 
            borderRadius: 6, 
            marginBottom: 16, 
            background: message.includes('successful') || message.includes('Success') ? '#d1fae5' : '#fee2e2',
            color: message.includes('successful') || message.includes('Success') ? '#065f46' : '#dc2626',
            fontSize: 14
          }}>
            {message}
          </div>
        )}

        <form onSubmit={onSubmit}>
          <label style={{ display: 'block', fontSize: 14, color: '#333', marginBottom: 6 }}>Username or Email</label>
          <input
            type="text"
            value={loginInput}
            onChange={(e) => setLoginInput(e.target.value.trimStart())}
            required
            placeholder="Enter username or email"
            autoComplete="username"
            disabled={loading}
            style={{ 
              width: '100%', 
              padding: '12px 16px', 
              borderRadius: 8, 
              border: '1px solid #ccc', 
              marginBottom: 16,
              fontSize: '16px',
              boxSizing: 'border-box',
              outline: 'none'
            }}
          />
          <label style={{ display: 'block', fontSize: 14, color: '#333', marginBottom: 6 }}>Password</label>
          <div style={{ position: 'relative', marginBottom: 20 }}>
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter password"
              autoComplete="current-password"
              disabled={loading}
              style={{ 
                width: '100%', 
                padding: '12px 48px 12px 16px', 
                borderRadius: 8, 
                border: '1px solid #ccc', 
                fontSize: '16px',
                boxSizing: 'border-box',
                outline: 'none'
              }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              disabled={loading}
              style={{
                position: 'absolute',
                right: 12,
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                cursor: loading ? 'not-allowed' : 'pointer',
                padding: 4,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: loading ? 0.5 : 1
              }}
              title={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                  <line x1="1" y1="1" x2="23" y2="23"/>
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
              )}
            </button>
          </div>
          <button 
            type="submit" 
            disabled={loading}
            style={{ 
              width: '100%', 
              background: loading ? '#6b7280' : '#0a2540', 
              color: 'white', 
              padding: '10px 12px', 
              borderRadius: 8, 
              border: 'none', 
              cursor: loading ? 'not-allowed' : 'pointer' 
            }}
          >
            {loading ? 'Signing in...' : 'Login'}
          </button>
        </form>
        
      </motion.div>
    </div>
  )
}


