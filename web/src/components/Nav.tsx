import { Link, NavLink, useLocation } from 'react-router-dom'
import { useI18n } from '../i18n'

export default function Nav() {
  const location = useLocation()
  const { locale, setLocale, t } = useI18n()

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
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none' }}>
          <img src="/favicon.png" alt="BeaverNorth Advisors" style={{ height: 44, width: 44, objectFit: 'contain' }} />
          <span style={{ fontWeight: 700, letterSpacing: 0.4, color: 'var(--text-primary)', fontSize: 18 }}>BeaverNorth Advisors</span>
        </Link>
        <nav style={{ display: 'flex', gap: 6 }}>
          <NavLink to="/" style={() => ({ ...linkStyle, ...(location.pathname === '/' ? activeStyle : {}) })}>{t('nav_home')}</NavLink>
          <NavLink to="/about" style={() => ({ ...linkStyle, ...(location.pathname.startsWith('/about') ? activeStyle : {}) })}>{t('nav_about')}</NavLink>
          <NavLink to="/services" style={() => ({ ...linkStyle, ...(location.pathname.startsWith('/services') ? activeStyle : {}) })}>{t('nav_services')}</NavLink>
          <NavLink to="/blog" style={() => ({ ...linkStyle, ...(location.pathname.startsWith('/blog') ? activeStyle : {}) })}>{t('nav_blog')}</NavLink>
          <Link to="/contact" style={{ ...linkStyle, background: 'var(--brand-green)', color: 'white', fontWeight: 700 }}>{t('nav_contact')}</Link>
        </nav>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button onClick={() => setLocale('en')} style={{ padding: '6px 8px', borderRadius: 8, border: '1px solid var(--line)', background: locale === 'en' ? 'var(--surface-2)' : 'transparent', cursor: 'pointer' }}>EN</button>
          <button onClick={() => setLocale('fr')} style={{ padding: '6px 8px', borderRadius: 8, border: '1px solid var(--line)', background: locale === 'fr' ? 'var(--surface-2)' : 'transparent', cursor: 'pointer' }}>FR</button>
        </div>
      </div>
    </header>
  )
}


