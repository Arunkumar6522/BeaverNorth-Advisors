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
        padding: '12px 16px', maxWidth: 1200, margin: '0 auto'
      }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none' }}>
          <img src="/favicon.png" alt="BeaverNorth Advisors" style={{ height: 36, width: 36, objectFit: 'contain' }} />
          <span style={{ fontWeight: 700, letterSpacing: 0.4, color: 'var(--text-primary)', fontSize: '16px', display: 'none' }}>BeaverNorth Advisors</span>
        </Link>
        <nav style={{ display: 'flex', gap: 4, flexWrap: 'wrap', fontSize: '14px' }}>
          <NavLink to="/" style={() => ({ ...linkStyle, ...(location.pathname === '/' ? activeStyle : {}) })}>{t('nav_home')}</NavLink>
          <NavLink to="/about" style={() => ({ ...linkStyle, ...(location.pathname.startsWith('/about') ? activeStyle : {}) })}>{t('nav_about')}</NavLink>
          <NavLink to="/services" style={() => ({ ...linkStyle, ...(location.pathname.startsWith('/services') ? activeStyle : {}) })}>{t('nav_services')}</NavLink>
          <NavLink to="/blog" style={() => ({ ...linkStyle, ...(location.pathname.startsWith('/blog') ? activeStyle : {}) })}>{t('nav_blog')}</NavLink>
          <Link to="/contact" style={{ ...linkStyle, background: 'var(--brand-green)', color: 'white', fontWeight: 700, fontSize: '13px', padding: '6px 8px' }}>{t('nav_contact')}</Link>
        </nav>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <button onClick={() => setLocale('en')} style={{ padding: '4px 6px', borderRadius: 6, border: '1px solid var(--line)', background: locale === 'en' ? 'var(--surface-2)' : 'transparent', cursor: 'pointer', fontSize: '12px' }}>EN</button>
          <button onClick={() => setLocale('fr')} style={{ padding: '4px 6px', borderRadius: 6, border: '1px solid var(--line)', background: locale === 'fr' ? 'var(--surface-2)' : 'transparent', cursor: 'pointer', fontSize: '12px' }}>FR</button>
        </div>
      </div>
    </header>
  )
}


