import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { customAuth } from '../lib/custom-auth'
import { useNavigate } from 'react-router-dom'

export default function Login() {
  const [username, setUsername] = useState('')
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
      const result = await customAuth.login(username, password)
      
      if (result.success) {
        setMessage('Login successful! Redirecting...')
        setTimeout(() => navigate('/dashboard'), 1000)
      } else {
        setMessage(result.error || 'Login failed')
      }
    } catch (error) {
      console.error('Login error:', error)
      setMessage('Network error. Please try again.')
    }
    setLoading(false)
  }


  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a2540' }}>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{ background: 'white', padding: 24, borderRadius: 12, width: 360, boxShadow: '0 10px 30px rgba(0,0,0,0.15)' }}
      >
        <h2 style={{ marginTop: 0, marginBottom: 16 }}>BeaverNorth Advisors</h2>
        <p style={{ marginTop: 0, color: '#555', marginBottom: 16 }}>Admin Login</p>
        
        <div style={{ 
          background: '#f8fafc', 
          padding: 12, 
          borderRadius: 8, 
          marginBottom: 16,
          fontSize: 12,
          color: '#475569',
          border: '1px solid #e2e8f0'
        }}>
          <strong>Demo Credentials:</strong><br/>
          Username: <code>admin</code><br/>
          Password: <code>admin</code>
        </div>
        
        {message && (
          <div style={{ 
            padding: 10, 
            borderRadius: 6, 
            marginBottom: 16, 
            background: message.includes('Success') ? '#d1fae5' : '#fee2e2',
            color: message.includes('Success') ? '#065f46' : '#dc2626',
            fontSize: 14
          }}>
            {message}
          </div>
        )}

        <form onSubmit={onSubmit}>
          <label style={{ display: 'block', fontSize: 14, color: '#333', marginBottom: 6 }}>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            placeholder="Enter username"
            disabled={loading}
            style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #ccc', marginBottom: 12 }}
          />
          <label style={{ display: 'block', fontSize: 14, color: '#333', marginBottom: 6 }}>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="••••••••"
            disabled={loading}
            style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #ccc', marginBottom: 16 }}
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
        
        <div style={{ marginTop: 16, fontSize: 12, color: '#666', textAlign: 'center' }}>
          <button 
            type="button"
            onClick={() => {
              console.log('Testing admin login...')
              customAuth.login('admin', 'admin').then(result => {
                console.log('Login result:', result)
                if (result.success) {
                  navigate('/dashboard')
                }
              })
            }}
            style={{
              background: 'transparent',
              color: '#0a2540',
              border: '1px solid #0a2540',
              padding: '8px 16px',
              borderRadius: 6,
              cursor: 'pointer',
              fontSize: 12
            }}
          >
            Quick Test Login (admin/admin)
          </button>
        </div>
      </motion.div>
    </div>
  )
}


