import { useState } from 'react'
import { motion } from 'framer-motion'

interface ContactModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function ContactModal({ isOpen, onClose }: ContactModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    dob: '',
    smokingStatus: '',
    province: '',
    insuranceProduct: '',
    email: '',
    phone: ''
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
          setFormData({ name: '', dob: '', smokingStatus: '', province: '', insuranceProduct: '', email: '', phone: '' })
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
            Get Your Insurance Quote
          </h2>
          <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '16px' }}>
            Licensed Canadian insurance advisors ready to help
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
              Quote Request Received!
            </h3>
            <p style={{ color: 'var(--text-secondary)' }}>
              Our licensed advisors will contact you within 24 hours with your personalized insurance quote.
            </p>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '16px' }}>
            <div style={{ display: 'grid', gap: '16px' }}>
              {/* Full Name */}
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

              {/* Date of Birth */}
              <input
                type="date"
                name="dob"
                placeholder="Date of Birth *"
                value={formData.dob}
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

              {/* Smoking Status */}
              <div style={{ display: 'grid', gap: '8px' }}>
                <label style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>
                  Smoking Status *
                </label>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <input
                      type="radio"
                      name="smokingStatus"
                      value="non-smoker"
                      checked={formData.smokingStatus === 'non-smoker'}
                      onChange={handleChange}
                      required
                      style={{ width: '18px', height: '18px' }}
                    />
                    <span style={{ fontSize: '14px', color: 'var(--text-primary)' }}>Non-Smoker</span>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <input
                      type="radio"
                      name="smokingStatus"
                      value="smoker"
                      checked={formData.smokingStatus === 'smoker'}
                      onChange={handleChange}
                      required
                      style={{ width: '18px', height: '18px' }}
                    />
                    <span style={{ fontSize: '14px', color: 'var(--text-primary)' }}>Smoker</span>
                  </label>
                </div>
              </div>

              {/* Province */}
              <select
                name="province"
                value={formData.province}
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
                <option value="">Select Province *</option>
                <option value="Alberta">Alberta</option>
                <option value="British Columbia">British Columbia</option>
                <option value="Manitoba">Manitoba</option>
                <option value="New Brunswick">New Brunswick</option>
                <option value="Newfoundland and Labrador">Newfoundland and Labrador</option>
                <option value="Northwest Territories">Northwest Territories</option>
                <option value="Nova Scotia">Nova Scotia</option>
                <option value="Nunavut">Nunavut</option>
                <option value="Ontario">Ontario</option>
                <option value="Prince Edward Island">Prince Edward Island</option>
                <option value="Quebec">Quebec</option>
                <option value="Saskatchewan">Saskatchewan</option>
                <option value="Yukon">Yukon</option>
              </select>

              {/* Insurance Product */}
              <select
                name="insuranceProduct"
                value={formData.insuranceProduct}
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
                <option value="">What type of life insurance are you looking for? *</option>
                <option value="term-life">Term Life Insurance</option>
                <option value="whole-life">Whole Life Insurance</option>
                <option value="non-medical">Non-Medical Life Insurance</option>
                <option value="mortgage-life">Mortgage Life Insurance</option>
                <option value="senior-life">Senior Life Insurance</option>
                <option value="travel">Travel Insurance</option>
              </select>
              
              {/* Email */}
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

              {/* Phone */}
              <input
                type="tel"
                name="phone"
                placeholder="Phone Number *"
                value={formData.phone}
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
              {loading ? 'Getting Quote...' : 'Get My Quote'}
            </button>

            <p style={{ 
              fontSize: '14px', 
              color: 'var(--text-secondary)', 
              textAlign: 'center', 
              margin: '16px 0 0 0',
              lineHeight: 1.5
            }}>
              Your information is secure and confidential.<br/>
              Licensed Canadian insurance advisors respond within 24 hours.
            </p>
          </form>
        )}
      </motion.div>
    </div>
  )
}
