import './App.css'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useState } from 'react'

export default function App() {
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    // In real app, send to backend or service
    console.log('Enquiry', Object.fromEntries(form.entries()))
    setSubmitted(true)
    e.currentTarget.reset()
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(180deg, #0a2540 0%, #0f3a67 100%)', color: 'white' }}>
      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 24px' }}>
        <div style={{ fontWeight: 700, letterSpacing: 0.5 }}>BeaverNorth Advisors</div>
        {/* Hidden login: no nav link; still accessible at /login. Keeping a tiny, subtle link for you while developing. */}
        <Link to="/login" style={{ opacity: 0, pointerEvents: 'none' }}>Login</Link>
      </header>

      <main style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 24px' }}>
        <section style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 32, alignItems: 'center' }}>
          <div>
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              style={{ fontSize: 48, lineHeight: 1.1, margin: 0 }}
            >
              Canada‑Focused Insurance Solutions
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.7 }}
              style={{ color: 'rgba(255,255,255,0.85)', marginTop: 14, fontSize: 18 }}
            >
              Trusted advisory for families and businesses across Canada. Protect your future with tailored coverage and clear advice.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.6 }}
              style={{ display: 'flex', gap: 12, marginTop: 18 }}
            >
              <a href="#enquiry" style={{ background: '#f2a900', color: '#0a2540', padding: '10px 16px', borderRadius: 8, textDecoration: 'none', fontWeight: 600 }}>Get a Quote</a>
              <a href="#why" style={{ border: '1px solid rgba(255,255,255,0.5)', color: 'white', padding: '10px 16px', borderRadius: 8, textDecoration: 'none' }}>Why BeaverNorth</a>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7 }}
            style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 16, padding: 24, backdropFilter: 'blur(6px)' }}
          >
            <h3 id="enquiry" style={{ marginTop: 0, marginBottom: 12 }}>Enquiry Form</h3>
            {submitted ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <p>Thank you! We will reach out shortly.</p>
                <button onClick={() => setSubmitted(false)} style={{ background: 'white', color: '#0a2540', padding: '8px 12px', borderRadius: 8, border: 'none', cursor: 'pointer' }}>Submit another</button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 14, marginBottom: 6 }}>Full Name</label>
                  <input name="name" required placeholder="Jane Doe" style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.3)', background: 'rgba(255,255,255,0.1)', color: 'white' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 14, marginBottom: 6 }}>Email</label>
                  <input type="email" name="email" required placeholder="you@example.com" style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.3)', background: 'rgba(255,255,255,0.1)', color: 'white' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 14, marginBottom: 6 }}>Phone</label>
                  <input name="phone" placeholder="(555) 123‑4567" style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.3)', background: 'rgba(255,255,255,0.1)', color: 'white' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 14, marginBottom: 6 }}>Coverage Interest</label>
                  <select name="coverage" style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.3)', background: 'rgba(255,255,255,0.1)', color: 'white' }}>
                    <option value="Life">Life Insurance</option>
                    <option value="Health">Health Insurance</option>
                    <option value="Home">Home Insurance</option>
                    <option value="Auto">Auto Insurance</option>
                    <option value="Business">Business Insurance</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 14, marginBottom: 6 }}>Message</label>
                  <textarea name="message" rows={4} placeholder="Tell us briefly about your needs" style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.3)', background: 'rgba(255,255,255,0.1)', color: 'white' }} />
                </div>
                <button type="submit" style={{ background: '#f2a900', color: '#0a2540', padding: '10px 12px', borderRadius: 8, border: 'none', cursor: 'pointer', fontWeight: 700 }}>Send Enquiry</button>
              </form>
            )}
          </motion.div>
        </section>

        <section id="why" style={{ marginTop: 56 }}>
          <motion.h2 initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>Why Choose BeaverNorth</motion.h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
            {[
              { title: 'Canada‑Based Expertise', desc: 'Advisors who understand the Canadian market, regulations, and benefits.' },
              { title: 'Tailored Coverage', desc: 'We recommend plans that match your life stage and goals.' },
              { title: 'Trusted Support', desc: 'Clear guidance from enquiry to claim, every step of the way.' },
            ].map((card, i) => (
              <motion.div key={card.title} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', padding: 16, borderRadius: 12 }}>
                <h3 style={{ marginTop: 0 }}>{card.title}</h3>
                <p style={{ color: 'rgba(255,255,255,0.85)' }}>{card.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>
      </main>

      <footer style={{ marginTop: 48, padding: '16px 24px', borderTop: '1px solid rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.8)' }}>
        © {new Date().getFullYear()} BeaverNorth Advisors. All rights reserved.
      </footer>
    </div>
  )
}
