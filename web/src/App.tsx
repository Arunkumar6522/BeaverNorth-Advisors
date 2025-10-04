import './App.css'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useI18n } from './i18n'
import Nav from './components/Nav'
import TopBar from './components/TopBar'
import Footer from './components/Footer'

export default function App() {
  const { t } = useI18n()
  return (
    <div style={{ minHeight: '100vh', color: 'var(--text-primary)' }}>
      <TopBar />
      <Nav />
      <main style={{ maxWidth: 1200, margin: '0 auto', padding: '16px 12px' }}>
        {/* HERO – rounded visual banner with overlay card and CTAs */}
        <section style={{ marginTop: 8 }}>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            style={{
              position: 'relative',
              borderRadius: 16,
              overflow: 'hidden',
              height: '320px',
              border: '1px solid var(--line)',
              background: `url(https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?q=80&w=2000&auto=format&fit=crop) center/cover no-repeat`,
              boxShadow: '0 10px 40px rgba(0,0,0,0.25)'
            }}
          >
            {/* gradient for readability */}
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(10,37,64,0.65) 0%, rgba(10,37,64,0.25) 60%, rgba(10,37,64,0.0) 100%)' }} />

            {/* Headline + CTAs */}
            <div style={{ position: 'absolute', left: '16px', top: '16px', right: '16px' }}>
              <p style={{ margin: 0, color: 'white', fontSize: '14px', opacity: 0.9 }}>{t('hero_tag')}</p>
              <h1 style={{ color: 'white', fontSize: '28px', lineHeight: 1.1, margin: '6px 0 12px 0' }}>
                {t('hero_headline_1')}<br />{t('hero_headline_2')}
              </h1>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxWidth: '400px' }}>
                <Link to="/contact" style={{ background: 'var(--brand-green)', color: 'white', padding: '12px 16px', borderRadius: 999, textDecoration: 'none', fontWeight: 700, textAlign: 'center' }}>{t('cta_get_in_touch')} ↗</Link>
                <a href="#services" style={{ color: 'white', padding: '12px 16px', borderRadius: 999, textDecoration: 'none', border: '1px solid rgba(255,255,255,0.6)', textAlign: 'center' }}>{t('cta_our_services')} →</a>
              </div>
            </div>

            {/* Glass card on right - hidden on mobile */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              style={{
                position: 'absolute',
                right: '16px',
                top: '80px',
                width: '220px',
                borderRadius: 16,
                padding: 16,
                backdropFilter: 'blur(10px)',
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid var(--line)',
                display: 'none'
              }}
            >
              <div style={{
                height: 120,
                borderRadius: 12,
                background: `url(https://images.unsplash.com/photo-1581092772835-8d1600a3b8aa?q=80&w=800&auto=format&fit=crop) center/cover no-repeat`,
                border: '1px solid var(--line)'
              }} />
              <div style={{ marginTop: 10, color: 'white', fontSize: '12px', opacity: 0.9 }}>Discover Our Recent Project</div>
            </motion.div>
          </motion.div>

          {/* Partner insurers carousel placeholder */}
          <div style={{
            marginTop: 16,
            display: 'flex',
            gap: 16,
            padding: '12px 16px',
            alignItems: 'center',
            overflowX: 'auto',
            scrollbarWidth: 'none',
            color: '#6b7280',
            background: 'var(--surface-1)',
            border: '1px solid var(--line)',
            borderRadius: 12,
            fontSize: '14px'
          }}>
            {['Manulife','Sun Life','Canada Life','Desjardins','iA Financial','RBC Insurance'].map((n) => (
              <div key={n} style={{ whiteSpace: 'nowrap', fontWeight: 600, fontSize: '12px' }}>{n}</div>
            ))}
          </div>

          {/* Metrics strip overlay */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            style={{
              marginTop: -20,
              background: 'var(--surface-1)',
              color: 'var(--text-primary)',
              borderRadius: 16,
              border: '1px solid var(--line)',
              boxShadow: '0 10px 30px rgba(0,0,0,0.12)',
              display: 'grid',
              gridTemplateColumns: 'repeat(1, 1fr)',
              gap: 16,
              padding: 20
            }}
          >
            {[
              { value: '6 mil', label: t('metrics_1_label') },
              { value: '315', label: t('metrics_2_label') },
              { value: '120K', label: t('metrics_3_label') },
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

        <section style={{ marginTop: 32, display: 'flex', alignItems: 'center', flexDirection: 'column', textAlign: 'center', gap: 16, background: 'var(--surface-2)', border: '1px solid var(--line)', borderRadius: 16, padding: 20 }}>
          <div>
            <h3 style={{ marginTop: 0, fontSize: '20px' }}>Ready to protect what matters?</h3>
            <p style={{ color: 'var(--text-secondary)', margin: 0 }}>Talk to a licensed advisor today.</p>
          </div>
          <Link to="/contact" style={{ background: 'var(--brand-yellow)', color: '#0a2540', padding: '12px 24px', borderRadius: 8, textDecoration: 'none', fontWeight: 700 }}>Contact Us</Link>
        </section>
      </main>
      <Footer />
    </div>
  )
}
