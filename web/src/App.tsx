import './App.css'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import Nav from './components/Nav'
import Footer from './components/Footer'

export default function App() {
  return (
    <div style={{ minHeight: '100vh', color: 'var(--text-primary)' }}>
      <Nav />
      <main style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 24px' }}>
        <section style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 32, alignItems: 'center', paddingTop: 24 }}>
          <div>
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              style={{ fontSize: 48, lineHeight: 1.1, margin: 0 }}
            >
              Canada‑Focused Insurance Advisory
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.7 }}
              style={{ color: 'var(--text-secondary)', marginTop: 14, fontSize: 18 }}
            >
              We help families and businesses across Canada protect what matters with clear advice and tailored coverage.
            </motion.p>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35, duration: 0.6 }} style={{ display: 'flex', gap: 12, marginTop: 18 }}>
              <a href="#capabilities" style={{ background: 'var(--brand-yellow)', color: '#0a2540', padding: '10px 16px', borderRadius: 8, textDecoration: 'none', fontWeight: 700 }}>Explore Capabilities</a>
              <Link to="/contact" style={{ border: '1px solid var(--line)', color: 'var(--text-primary)', padding: '10px 16px', borderRadius: 8, textDecoration: 'none' }}>Contact Us</Link>
            </motion.div>
          </div>
          <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7 }} style={{ background: 'var(--surface-2)', border: '1px solid var(--line)', borderRadius: 16, padding: 24, backdropFilter: 'blur(6px)' }}>
            <div style={{ display: 'grid', gap: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ height: 10, width: 10, borderRadius: 20, background: 'var(--brand-green)' }} />
                <span>Licensed advisors across provinces</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ height: 10, width: 10, borderRadius: 20, background: 'var(--brand-yellow)' }} />
                <span>Life, Health, Auto, Home, and Business coverage</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ height: 10, width: 10, borderRadius: 20, background: 'var(--brand-orange)' }} />
                <span>Personalized plans and ongoing support</span>
              </div>
            </div>
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
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
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
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
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

        <section style={{ marginTop: 48, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, background: 'var(--surface-2)', border: '1px solid var(--line)', borderRadius: 16, padding: 20 }}>
          <div>
            <h3 style={{ marginTop: 0 }}>Ready to protect what matters?</h3>
            <p style={{ color: 'var(--text-secondary)', margin: 0 }}>Talk to a licensed advisor today.</p>
          </div>
          <Link to="/contact" style={{ background: 'var(--brand-yellow)', color: '#0a2540', padding: '10px 16px', borderRadius: 8, textDecoration: 'none', fontWeight: 700 }}>Contact Us</Link>
        </section>
      </main>
      <Footer />
    </div>
  )
}
