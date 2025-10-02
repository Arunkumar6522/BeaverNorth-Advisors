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
        {/* HERO – rounded visual banner with overlay card and CTAs */}
        <section style={{ marginTop: 8 }}>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            style={{
              position: 'relative',
              borderRadius: 24,
              overflow: 'hidden',
              height: 440,
              border: '1px solid var(--line)',
              background: `url(https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?q=80&w=2000&auto=format&fit=crop) center/cover no-repeat`,
              boxShadow: '0 10px 40px rgba(0,0,0,0.25)'
            }}
          >
            {/* gradient for readability */}
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(10,37,64,0.85) 0%, rgba(10,37,64,0.35) 60%, rgba(10,37,64,0.0) 100%)' }} />

            {/* Headline + CTAs */}
            <div style={{ position: 'absolute', left: 28, top: 28, right: 28 }}>
              <p style={{ margin: 0, color: 'var(--text-secondary)' }}>#1 Canadian insurance advisory partner</p>
              <h1 style={{ fontSize: 64, lineHeight: 1.05, margin: '6px 0 10px 0' }}>
                New Confidence<br />for your Future
              </h1>
              <div style={{ display: 'flex', gap: 16 }}>
                <Link to="/contact" style={{ background: 'var(--brand-green)', color: '#083a1f', padding: '10px 16px', borderRadius: 999, textDecoration: 'none', fontWeight: 700 }}>Get in touch ↗</Link>
                <a href="#services" style={{ color: 'var(--text-primary)', padding: '10px 16px', borderRadius: 999, textDecoration: 'none', border: '1px solid var(--line)' }}>Our services →</a>
              </div>
            </div>

            {/* Glass card on right */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              style={{
                position: 'absolute',
                right: 24,
                top: 90,
                width: 260,
                borderRadius: 16,
                padding: 16,
                backdropFilter: 'blur(10px)',
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid var(--line)'
              }}
            >
              <div style={{
                height: 140,
                borderRadius: 12,
                background: `url(https://images.unsplash.com/photo-1581092772835-8d1600a3b8aa?q=80&w=800&auto=format&fit=crop) center/cover no-repeat`,
                border: '1px solid var(--line)'
              }} />
              <div style={{ marginTop: 10, color: 'var(--text-secondary)' }}>Discover Our Recent Project</div>
            </motion.div>
          </motion.div>

          {/* Metrics strip overlay */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            style={{
              marginTop: -28,
              background: '#fff',
              color: '#0a2540',
              borderRadius: 16,
              border: '1px solid #e5e7eb',
              boxShadow: '0 10px 30px rgba(0,0,0,0.12)',
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 16,
              padding: 20
            }}
          >
            {[
              { value: '6 mil', label: "Annual client savings guided" },
              { value: '315', label: 'Projects completed nationwide' },
              { value: '120K', label: 'Canadians supported to date' },
            ].map((m) => (
              <div key={m.value}>
                <div style={{ fontSize: 36, fontWeight: 700 }}>{m.value}</div>
                <div style={{ color: '#4b5563' }}>{m.label}</div>
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
