import { useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { useI18n } from '../i18n'

export default function Nav() {
  const location = useLocation()
  const { locale, setLocale, t } = useI18n()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const linkStyle: React.CSSProperties = {
    color: 'var(--text-primary)',
    textDecoration: 'none',
    padding: '8px 16px',
    borderRadius: 8,
    display: 'block',
    fontSize: '16px',
    fontWeight: 500,
  }

  const activeStyle: React.CSSProperties = {
    background: 'var(--surface-2)',
  }

  return (
    <header style={{
      position: 'sticky', 
      top: 0, 
      zIndex: 100,
      backdropFilter: 'blur(8px)',
      background: 'var(--surface-1)',
      borderBottom: '1px solid var(--line)',
    }}>
      <div style={{
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        padding: '16px 20px', 
        maxWidth: 1200, 
        margin: '0 auto'
      }}>
        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none' }}>
          <img src="/favicon.png" alt="BeaverNorth Advisors" style={{ height: 40, width: 40, objectFit: 'contain' }} />
          <span style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '18px' }}>BeaverNorth</span>
        </Link>

        {/* Desktop Navigation */}
        <nav style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <div style={{ display: 'none', gap: 8, '@media (min-width: 768px)': { display: 'flex' } }}>
            <NavLink to="/" style={() => ({ ...linkStyle, ...(location.pathname === '/' ? activeStyle : {}), fontSize: '14px' })}>{t('nav_home')}</NavLink>
            <NavLink to="/about" style={() => ({ ...linkStyle, ...(location.pathname.startsWith('/about') ? activeStyle : {}), fontSize: '14px' })}>{t('nav_about')}</NavLink>
            <NavLink to="/services" style={() => ({ ...linkStyle, ...(location.pathname.startsWith('/services') ? activeStyle : {}), fontSize: '14px' })}>{t('nav_services')}</NavLink>
            <NavLink to="/blog" style={() => ({ ...linkStyle, ...(location.pathname.startsWith('/blog') ? activeStyle : {}), fontSize: '14px' })}>{t('nav_blog')}</NavLink>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Link to="/contact" style={{ 
              ...linkStyle, 
              background: 'var(--brand-green)', 
              color: 'white', 
              fontWeight: 600, 
              fontSize: '14px', 
              padding: '8px 16px',
              borderRadius: 20,
              border: 'none'
            }}>
              {t('nav_contact')}
            </Link>
            
            {/* Language Switcher */}
            <div style={{ display: 'flex', gap: 4 }}>
              <button onClick={() => setLocale('en')} style={{ 
                padding: '6px 10px', 
                borderRadius: 6, 
                border: '1px solid var(--line)', 
                background: locale === 'en' ? 'var(--brand-green)' : 'transparent', 
                color: locale === 'en' ? 'white' : 'var(--text-primary)',
                cursor: 'pointer', 
                fontSize: '12px',
                fontWeight: 500
              }}>
                EN
              </button>
              <button onClick={() => setLocale('fr')} style={{ 
                padding: '6px 10px', 
                borderRadius: 6, 
                border: '1px solid var(--line)', 
                background: locale === 'fr' ? 'var(--brand-green)' : 'transparent', 
                color: locale === 'fr' ? 'white' : 'var(--text-primary)',
                cursor: 'pointer', 
                fontSize: '12px',
                fontWeight: 500
              }}>
                FR
              </button>
            </div>

            {/* Mobile Hamburger Menu */}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                gap: 4, 
                padding: 8, 
                background: 'transparent', 
                border: 'none', 
                cursor: 'pointer',
                '@media (min-width: 768px)': { display: 'none' }
              }}
            >
              <span style={{ 
                width: 20, 
                height: 2, 
                background: 'var(--text-primary)', 
                borderRadius: 1,
                transition: 'all 0.3s ease'
              }}></span>
              <span style={{ 
                width: 20, 
                height: 2, 
                background: 'var(--text-primary)', 
                borderRadius: 1,
                transition: 'all 0.3s ease'
              }}></span>
              <span style={{ 
                width: 20, 
                height: 2, 
                background: 'var(--text-primary)', 
                borderRadius: 1,
                transition: 'all 0.3s ease'
              }}></span>
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          zIndex: 99,
          backdropFilter: 'blur(4px)'
        }} onClick={() => setIsMenuOpen(false)}>
          <div style={{
            position: 'absolute',
            top: 0,
            right: 0,
            height: '100vh',
            width: '280px',
            background: 'var(--surface-1)',
            boxShadow: '-4px 0 20px rgba(0,0,0,0.1)',
            padding: '80px 0 20px 0',
            animation: 'slideInRight 0.3s ease-out'
          }} onClick={(e) => e.stopPropagation()}>
            <nav style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              <NavLink 
                to="/" 
                onClick={() => setIsMenuOpen(false)}
                style={() => ({ 
                  ...linkStyle, 
                  borderBottom: '1px solid var(--line)',
                  background: location.pathname === '/' ? 'var(--surface-2)' : 'transparent'
                })}
              >
                {t('nav_home')}
              </NavLink>
              <NavLink 
                to="/about" 
                onClick={() => setIsMenuOpen(false)}
                style={() => ({ 
                  ...linkStyle, 
                  borderBottom: '1px solid var(--line)',
                  background: location.pathname.startsWith('/about') ? 'var(--surface-2)' : 'transparent'
                })}
              >
                {t('nav_about')}
              </NavLink>
              <NavLink 
                to="/services" 
                onClick={() => setIsMenuOpen(false)}
                style={() => ({ 
                  ...linkStyle, 
                  borderBottom: '1px solid var(--line)',
                  background: location.pathname.startsWith('/services') ? 'var(--surface-2)' : 'transparent'
                })}
              >
                {t('nav_services')}
              </NavLink>
              <NavLink 
                to="/blog" 
                onClick={() => setIsMenuOpen(false)}
                style={() => ({ 
                  ...linkStyle, 
                  borderBottom: '1px solid var(--line)',
                  background: location.pathname.startsWith('/blog') ? 'var(--surface-2)' : 'transparent'
                })}
              >
                {t('nav_blog')}
              </NavLink>
              <Link 
                to="/contact" 
                onClick={() => setIsMenuOpen(false)}
                style={{ 
                  ...linkStyle, 
                  background: 'var(--brand-green)', 
                  color: 'white', 
                  fontWeight: 600, 
                  fontSize: '16px', 
                  margin: '20px 16px 0 16px',
                  borderRadius: 12,
                  textAlign: 'center',
                  borderBottom: 'none'
                }}
              >
                {t('nav_contact')}
              </Link>
            </nav>
          </div>
        </div>
      )}
    </header>
  )
}


