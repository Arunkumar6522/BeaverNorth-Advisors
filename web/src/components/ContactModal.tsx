import { useState } from 'react'
import { motion } from 'framer-motion'

interface ContactModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function ContactModal({ isOpen, onClose }: ContactModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    inquiry: '',
    message: ''
  })

  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    // Simulate form submission
    setTimeout(() => {
      setLoading(false)
      setSubmitted(true)
      setTimeout(() => {
        onClose()
        setSubmitted(false)
        setFormData({ name: '', email: '', phone: '', inquiry: '', message: '' })
      }, 2000)
    }, 1000)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  if (!isOpen) return null

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.6)',
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      backdropFilter: 'blur(4px)'
    }} onClick={onClose}>
      
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ duration: 0.3 }}
        style={{
          background: 'var(--surface-1)',
          borderRadius: '20px',
          padding: '32px',
          width: '100%',
          maxWidth: '500px',
          maxHeight: '90vh',
          overflow: 'auto',
          boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
          position: 'relative'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'transparent',
            border: 'none',
            fontSize: '24px',
            cursor: 'pointer',
            color: 'var(--text-secondary)',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '50%',
            background: 'var(--surface-2)'
          }}
        >
          ×
        </button>

        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <img 
            src="/favicon.png" 
            alt="BeaverNorth Advisors" 
            style={{ height: '40px', width: '40px', marginBottom: '12px' }}
          />
          <h2 style={{ margin: '0 0 8px 0', color: 'var(--text-primary)' }}>
            Contact BeaverNorth Advisors
          </h2>
          <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '16px' }}>
            Get your insurance quote and expert advice
          </p>
        </div>

        {submitted ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{ textAlign: 'center', padding: '40px 20px' }}
          >
            <div style={{ 
              width: '60px', 
              height: '60px', 
              borderRadius: '50%', 
              background: 'var(--brand-green)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              margin: '0 auto 20px',
              fontSize: '24px',
              color: 'white'
            }}>
              ✓
            </div>
            <h3 style={{ color: 'var(--brand-green)', marginBottom: '12px' }}>
              Thank You!
            </h3>
            <p style={{ color: 'var(--text-secondary)' }}>
              We've received your inquiry and will contact you within 24 hours.
            </p>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '20px' }}>
            <div style={{ display: 'grid', gap: '12px' }}>
              <input
                type="text"
                name="name"
                placeholder="Full Name *"
                value={formData.name}
                onChange={handleChange}
                required
                style={{
                  padding: '14px 16px',
                  border: '2px solid var(--line)',
                  borderRadius: '12px',
                  fontSize: '16px',
                  background: 'var(--surface-1)',
                  color: 'var(--text-primary)',
                  outline: 'none',
                  transition: 'border-color 0.2s'
                }}
              />
              
              <input
                type="email"
                name="email"
                placeholder="Email Address *"
                value={formData.email}
                onChange={handleChange}
                required
                style={{
                  padding: '14px 16px',
                  border: '2px solid var(--line)',
                  borderRadius: '12px',
                  fontSize: '16px',
                  background: 'var(--surface-1)',
                  color: 'var(--text-primary)',
                  outline: 'none'
                }}
              />

              <input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleChange}
                style={{
                  padding: '14px 16px',
                  border: '2px solid var(--line)',
                  borderRadius: '12px',
                  fontSize: '16px',
                  background: 'var(--surface-1)',
                  color: 'var(--text-primary)',
                  outline: 'none'
                }}
              />

              <select
                name="inquiry"
                value={formData.inquiry}
                onChange={handleChange}
                required
                style={{
                  padding: '14px 16px',
                  border: '2px solid var(--line)',
                  borderRadius: '12px',
                  fontSize: '16px',
                  background: 'var(--surface-1)',
                  color: 'var(--text-primary)',
                  outline: 'none',
                  cursor: 'pointer'
                }}
              >
                <option value="">Select Inquiry Type *</option>
                <option value="life">Life Insurance</option>
                <option value="health">Health Insurance</option>
                <option value="home">Home Insurance</option>
                <option value="auto">Auto Insurance</option>
                <option value="business">Business Insurance</option>
                <option value="general">General Inquiry</option>
              </select>

              <textarea
                name="message"
                placeholder="Tell us about your insurance needs... *"
                value={formData.message}
                onChange={handleChange}
                required
                rows={4}
                style={{
                  padding: '14px 16px',
                  border: '2px solid var(--line)',
                  borderRadius: '12px',
                  fontSize: '16px',
                  background: 'var(--surface-1)',
                  color: 'var(--text-primary)',
                  outline: 'none',
                  resize: 'vertical',
                  minHeight: '120px'
                }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                background: loading ? 'var(--text-secondary)' : 'var(--brand-green)',
                color: 'white',
                padding: '16px 24px',
                borderRadius: '12px',
                border: 'none',
                fontSize: '16px',
                fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s',
                marginTop: '8px'
              }}
            >
              {loading ? 'Submitting...' : 'Send Inquiry'}
            </button>

            <p style={{ 
              fontSize: '14px', 
              color: 'var(--text-secondary)', 
              textAlign: 'center', 
              margin: '16px 0 0 0',
              lineHeight: 1.5
            }}>
              By submitting this form, you agree to our privacy policy.<br/>
              We respond within 24 hours to all inquiries.
            </p>
          </form>
        )}
      </motion.div>
    </div>
  )
}
