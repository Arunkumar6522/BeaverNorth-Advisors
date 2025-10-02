import { Link, NavLink, useLocation } from 'react-router-dom'

export default function Nav() {
  const location = useLocation()

  const linkStyle: React.CSSProperties = {
    color: 'var(--text-primary)',
    textDecoration: 'none',
    padding: '8px 10px',
    borderRadius: 8,
  }

  const activeStyle: React.CSSProperties = {
    background: 'var(--surface-2)',
  }

  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 10,
      backdropFilter: 'blur(8px)',
      borderBottom: '1px solid var(--line)',
      background: 'var(--surface-1)',
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '12px 24px', maxWidth: 1200, margin: '0 auto'
      }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <img src="/favicon.png" alt="BeaverNorth Advisors" style={{ height: 32, width: 32, objectFit: 'contain' }} />
          <span style={{ fontWeight: 700, letterSpacing: 0.4, color: 'var(--text-primary)' }}>BeaverNorth Advisors</span>
        </Link>
        <nav style={{ display: 'flex', gap: 6 }}>
          <NavLink to="/" style={() => ({ ...linkStyle, ...(location.pathname === '/' ? activeStyle : {}) })}>Home</NavLink>
          <a href="#about" style={linkStyle}>About</a>
          <a href="#capabilities" style={linkStyle}>Capabilities</a>
          <a href="#services" style={linkStyle}>Services</a>
          <Link to="/contact" style={{ ...linkStyle, background: 'var(--brand-green)', color: 'white', fontWeight: 700 }}>Get in touch</Link>
        </nav>
      </div>
    </header>
  )
}


