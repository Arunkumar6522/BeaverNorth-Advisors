import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { customAuth } from '../lib/custom-auth'
import { useNavigate } from 'react-router-dom'

export default function Login() {
  const [loginInput, setLoginInput] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    // Check if user is already logged in
    if (customAuth.isAuthenticated()) {
      navigate('/dashboard')
    }
  }, [navigate])

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      const result = await customAuth.login(loginInput, password)
      
      if (result.success) {
        setMessage('Login successful! Redirecting...')
        setTimeout(() => navigate('/dashboard'), 1000)
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
        <h2 style={{ marginTop: 0, marginBottom: 16 }}>BeaverNorth Advisors</h2>
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
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Enter password"
            autoComplete="current-password"
            disabled={loading}
            style={{ 
              width: '100%', 
              padding: '12px 16px', 
              borderRadius: 8, 
              border: '1px solid #ccc', 
              marginBottom: 20,
              fontSize: '16px',
              boxSizing: 'border-box',
              outline: 'none'
            }}
          />
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


