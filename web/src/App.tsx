import './App.css'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useI18n } from './i18n'
import Nav from './components/Nav'
import TopBar from './components/TopBar'
import Footer from './components/Footer'
import ContactModal from './components/ContactModal'

export default function App() {
  const { t } = useI18n()
  const [isContactModalOpen, setIsContactModalOpen] = useState(false)
  
  return (
    <div style={{ minHeight: '100vh', color: 'var(--text-primary)' }}>
      <TopBar />
      <Nav />
      <main style={{ padding: '20px' }}>
        {/* HERO Section - Mobile First Design */}
        <section style={{ marginBottom: '40px' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            style={{
              position: 'relative',
              borderRadius: '24px',
              overflow: 'hidden',
              minHeight: '500px',
              background: `
                linear-gradient(135deg, 
                  rgba(10,37,64,0.9) 0%, 
                  rgba(34,197,94,0.8) 50%,
                  rgba(242,169,0,0.7) 100%
                ),
                url(https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?q=80&w=2000&auto=format&fit=crop) 
                center/cover no-repeat`
            }}
          >
            {/* Content Container */}
            <div style={{ 
              position: 'absolute', 
              inset: 0, 
              display: 'flex', 
              flexDirection: 'column', 
              justifyContent: 'center', 
              padding: '40px 24px',
              textAlign: 'center'
            }}>
              {/* Logo and Brand */}
              <div style={{ marginBottom: '24px' }}>
                <img 
                  src="/favicon.png" 
                  alt="BeaverNorth Advisors" 
                  style={{ 
                    height: '48px', 
                    width: '48px', 
                    marginBottom: '12px',
                    filter: 'brightness(0) invert(1)'
                  }} 
                />
                <p style={{ 
                  margin: 0, 
                  color: 'white', 
                  fontSize: '14px', 
                  opacity: 0.9,
                  fontWeight: 500,
                  letterSpacing: '0.5px'
                }}>
                  {t('hero_tag')}
                </p>
              </div>

              {/* Main Headline */}
              <h1 style={{ 
                color: 'white', 
                fontSize: '32px', 
                lineHeight: 1.2, 
                margin: '0 0 16px 0',
                fontWeight: 800,
                textShadow: '0 2px 10px rgba(0,0,0,0.3)'
              }}>
                {t('hero_headline_1')}<br />{t('hero_headline_2')}
              </h1>

              {/* Subheading */}
              <p style={{ 
                color: 'rgba(255,255,255,0.95)', 
                fontSize: '18px', 
                marginBottom: '32px',
                fontWeight: 400,
                maxWidth: '300px',
                margin: '0 auto 32px'
              }}>
                Expert insurance guidance for Canadian families and businesses
              </p>

              {/* CTA Buttons */}
              <div style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                gap: '12px',
                alignItems: 'center'
              }}>
                <button
                  onClick={() => setIsContactModalOpen(true)}
                  style={{ 
                    background: 'white', 
                    color: 'var(--brand-green)', 
                    padding: '16px 32px', 
                    borderRadius: '999px', 
                    border: 'none',
                    fontWeight: 700, 
                    fontSize: '16px',
                    cursor: 'pointer',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
                    transition: 'all 0.3s ease',
                    minWidth: '200px'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)'
                    e.currentTarget.style.boxShadow = '0 6px 25px rgba(0,0,0,0.3)'
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.2)'
                  }}
                >
                  {t('cta_get_in_touch')} ↗
                </button>
                
                <button
                  onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
                  style={{ 
                    color: 'white', 
                    background: 'transparent',
                    padding: '12px 24px', 
                    borderRadius: '999px', 
                    textDecoration: 'none', 
                    border: '2px solid rgba(255,255,255,0.6)',
                    fontWeight: 500,
                    fontSize: '14px',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    minWidth: '150px'
                  }}
                >
                  {t('cta_our_services')} →
                </button>
              </div>
            </div>

          </motion.div>

          {/* Trust Badge & Partners */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            style={{
              marginTop: '24px',
              background: 'var(--surface-1)',
              borderRadius: '16px',
              padding: '24px',
              border: '1px solid var(--line)',
              textAlign: 'center'
            }}
          >
            <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', color: 'var(--text-primary)' }}>
              Trusted by Leading Canadian Insurers
            </h3>
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              flexWrap: 'wrap',
              gap: '16px',
              alignItems: 'center'
            }}>
              {['Manulife', 'Sun Life', 'Canada Life', 'Desjardins', 'iA Financial', 'RBC Insurance'].map((insurer) => (
                <div key={insurer} style={{
                  padding: '8px 16px',
                  background: 'var(--surface-2)',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: 600,
                  color: 'var(--text-secondary)',
                  border: '1px solid var(--line)'
                }}>
                  {insurer}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Key Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            style={{
              marginTop: '24px',
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '16px'
            }}
          >
            {[
              { value: '6M+', label: 'Coverage Managed', color: 'var(--brand-green)' },
              { value: '315', label: 'Families Protected', color: 'var(--brand-yellow)' },
              { value: '120K+', label: 'Claims Processed', color: 'var(--brand-orange)' },
            ].map((stat) => (
              <div key={stat.value} style={{
                textAlign: 'center',
                padding: '20px 12px',
                background: 'var(--surface-1)',
                borderRadius: '12px',
                border: '1px solid var(--line)'
              }}>
                <div style={{ 
                  fontSize: '24px', 
                  fontWeight: 800, 
                  color: stat.color,
                  marginBottom: '4px'
                }}>
                  {stat.value}
                </div>
                <div style={{ 
                  fontSize: '12px',
                  color: 'var(--text-secondary)',
                  fontWeight: 500
                }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>
        </section>

        <section id="about" style={{ marginTop: 56 }}>
          <motion.h2 initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>About BeaverNorth</motion.h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: 800 }}>
            We are a Canada‑based insurance advisory focused on clarity and trust. Our mission is to simplify insurance decisions with transparent guidance and tailored recommendations.
          </p>
        </section>

        <section id="capabilities" style={{ marginTop: 40 }}>
          <motion.h2 initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>Capabilities</motion.h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(1, 1fr)', gap: 16 }}>
            {[
              { title: 'Advisory & Needs Analysis', desc: 'We evaluate your life stage and risk profile to recommend the right coverage.' },
              { title: 'Policy Procurement', desc: 'We compare options and manage applications with major Canadian insurers.' },
              { title: 'Ongoing Support', desc: 'Annual reviews, claims assistance, and policy updates whenever life changes.' },
            ].map((card, i) => (
              <motion.div key={card.title} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} style={{ background: 'var(--surface-2)', border: '1px solid var(--line)', padding: 16, borderRadius: 12 }}>
                <h3 style={{ marginTop: 0 }}>{card.title}</h3>
                <p style={{ color: 'var(--text-secondary)' }}>{card.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        <section id="services" style={{ marginTop: 40 }}>
          <motion.h2 initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>Services</motion.h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(1, 1fr)', gap: 16 }}>
            {[
              { title: 'Life', color: 'var(--brand-yellow)', desc: 'Protect your family with term or whole life.' },
              { title: 'Health', color: 'var(--brand-green)', desc: 'Extended health, dental, and critical illness coverage.' },
              { title: 'Home', color: 'var(--brand-orange)', desc: 'Homeowners, condo, and renters insurance guidance.' },
              { title: 'Auto', color: '#51b3ff', desc: 'Auto insurance options for your needs and budget.' },
            ].map((svc, i) => (
              <motion.div key={svc.title} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} style={{ background: 'var(--surface-2)', border: '1px solid var(--line)', padding: 16, borderRadius: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <div style={{ height: 10, width: 10, borderRadius: 20, background: svc.color }} />
                  <h3 style={{ margin: 0 }}>{svc.title}</h3>
                </div>
                <p style={{ color: 'var(--text-secondary)' }}>{svc.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Final CTA Section */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ 
            marginTop: '48px', 
            display: 'flex', 
            alignItems: 'center', 
            flexDirection: 'column', 
            textAlign: 'center', 
            gap: '24px', 
            background: 'var(--surface-1)', 
            border: '1px solid var(--line)', 
            borderRadius: '20px', 
            padding: '40px 24px' 
          }}
        >
          <div>
            <h3 style={{ marginTop: 0, fontSize: '24px', fontWeight: 700 }}>Ready to protect what matters most?</h3>
            <p style={{ color: 'var(--text-secondary)', margin: '8px 0 0 0', fontSize: '16px' }}>
              Get personalized insurance advice from licensed Canadian advisors.
            </p>
          </div>
          <button
            onClick={() => setIsContactModalOpen(true)}
            style={{ 
              background: 'var(--brand-green)', 
              color: 'white', 
              padding: '16px 32px', 
              borderRadius: '999px', 
              border: 'none',
              fontWeight: 700, 
              fontSize: '16px',
              cursor: 'pointer',
              boxShadow: '0 4px 20px rgba(34,197,94,0.3)',
              transition: 'all 0.3s ease'
            }}
          >
            Get Free Quote Today
          </button>
        </motion.section>
      </main>
      
      <Footer />
      
      {/* Contact Modal */}
      <ContactModal 
        isOpen={isContactModalOpen} 
        onClose={() => setIsContactModalOpen(false)} 
      />
    </div>
  )
}
