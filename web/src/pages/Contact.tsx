import { motion } from 'framer-motion'
import { useState } from 'react'

export default function Contact() {
  const [submitted, setSubmitted] = useState(false)

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    console.log('Contact enquiry', Object.fromEntries(form.entries()))
    setSubmitted(true)
    e.currentTarget.reset()
  }

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '32px 24px' }}>
      <motion.h1 initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>Contact Us</motion.h1>
      <p style={{ color: 'var(--text-secondary)' }}>We’ll get back within one business day.</p>
      {submitted ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ background: 'var(--surface-2)', padding: 16, borderRadius: 12 }}>
          Thank you! Your enquiry was received.
        </motion.div>
      ) : (
        <form onSubmit={onSubmit} style={{ display: 'grid', gap: 14, marginTop: 12 }}>
          <div>
            <label style={{ display: 'block', fontSize: 14, marginBottom: 6 }}>Full Name</label>
            <input name="name" required placeholder="Jane Doe" style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid var(--line)' }} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={{ display: 'block', fontSize: 14, marginBottom: 6 }}>Email</label>
              <input type="email" name="email" required placeholder="you@example.com" style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid var(--line)' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 14, marginBottom: 6 }}>Phone</label>
              <input name="phone" placeholder="(555) 123‑4567" style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid var(--line)' }} />
            </div>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 14, marginBottom: 6 }}>Coverage Interest</label>
            <select name="coverage" style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid var(--line)' }}>
              <option value="Life">Life Insurance</option>
              <option value="Health">Health Insurance</option>
              <option value="Home">Home Insurance</option>
              <option value="Auto">Auto Insurance</option>
              <option value="Business">Business Insurance</option>
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 14, marginBottom: 6 }}>Message</label>
            <textarea name="message" rows={5} placeholder="Tell us briefly about your needs" style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid var(--line)' }} />
          </div>
          <button type="submit" style={{ background: 'var(--brand-yellow)', color: '#0a2540', padding: '10px 12px', borderRadius: 8, border: 'none', cursor: 'pointer', fontWeight: 700, width: 160 }}>Send</button>
        </form>
      )}
    </div>
  )
}


