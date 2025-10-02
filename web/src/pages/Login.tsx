import { useState } from 'react'
import { motion } from 'framer-motion'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    // Placeholder: no backend, just a simple alert for now
    alert(`Logged in as ${email}`)
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
        <form onSubmit={onSubmit}>
          <label style={{ display: 'block', fontSize: 14, color: '#333', marginBottom: 6 }}>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="you@example.com"
            style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #ccc', marginBottom: 12 }}
          />
          <label style={{ display: 'block', fontSize: 14, color: '#333', marginBottom: 6 }}>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="••••••••"
            style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #ccc', marginBottom: 16 }}
          />
          <button type="submit" style={{ width: '100%', background: '#0a2540', color: 'white', padding: '10px 12px', borderRadius: 8, border: 'none', cursor: 'pointer' }}>
            Login
          </button>
        </form>
      </motion.div>
    </div>
  )
}


