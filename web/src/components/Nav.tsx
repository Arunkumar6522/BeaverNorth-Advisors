import { useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { useI18n } from '../i18n'
import { Box, Typography, IconButton } from '@mui/material'
import { Menu as MenuIcon, Close as CloseIcon, Language } from '@mui/icons-material'

export default function Nav() {
  const location = useLocation()
  const { locale, setLocale } = useI18n()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'Features', path: '/features' },
    { label: 'Services', path: '/services' },
    { label: 'About us', path: '/about' },
    { label: 'Contact us', path: '/contact' },
    { label: 'FAQ', path: '/faq' }
  ]

  return (
    <Box sx={{
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      bgcolor: 'rgba(255,255,255,0.95)',
      backdropFilter: 'blur(10px)',
      borderBottom: '1px solid rgba(139,92,246,0.1)',
      px: { xs: 3, md: 6 },
      py: 2
    }}>
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        maxWidth: '1400px',
        mx: 'auto'
      }}>
        
        {/* Logo */}
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{
            width: 48,
            height: 48,
            borderRadius: 2,
            background: 'linear-gradient(135deg, #8B5CF6 0%, #F59E0B 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(139,92,246,0.3)'
          }}>
            <img 
              src="/favicon.png" 
              alt="BeaverNorth" 
              style={{ 
                height: '28px', 
                width: '28px',
                filter: 'brightness(0) invert(1)'
              }} 
            />
          </Box>
          <Typography variant="h6" sx={{ 
            fontWeight: 800,
            color: '#1E293B',
            fontSize: '1.3rem',
            letterSpacing: '-0.02em'
          }}>
            BeaverNorth
            <Typography component="span" sx={{ 
              color: '#8B5CF6',
              fontWeight: 800
            }}>
              Advisors
            </Typography>
          </Typography>
        </Link>

        {/* Desktop Navigation */}
        <Box sx={{ 
          display: { xs: 'none', lg: 'flex' },
          alignItems: 'center',
          gap: 1
        }}>
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              style={({ isActive }) => ({
                textDecoration: 'none',
                padding: '12px 20px',
                borderRadius: 12,
                fontSize: '15px',
                fontWeight: 600,
                color: isActive ? '#8B5CF6' : '#64748B',
                transition: 'all 0.3s ease',
                position: 'relative'
              })}
              onMouseEnter={(e) => {
                if (location.pathname !== '/') {
                  e.currentTarget.style.color = '#8B5CF6'
                  e.currentTarget.style.backgroundColor = 'rgba(139,92,246,0.08)'
                }
              }}
              onMouseLeave={(e) => {
                if (location.pathname !== '/') {
                  e.currentTarget.style.color = '#64748B'
                  e.currentTarget.style.backgroundColor = 'transparent'
                }
              }}
            >
              {item.label}
            </NavLink>
          ))}
          
          {/* Language Switcher */}
          <Box sx={{
            ml: 3,
            pl: 3,
            borderLeft: '2px solid #E2E8F0',
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}>
            <Language sx={{ fontSize: 20, color: '#64748B' }} />
            <select
              value={locale}
              onChange={(e) => setLocale(e.target.value as 'en' | 'fr')}
              style={{
                border: 'none',
                background: 'transparent',
                fontSize: '14px',
                fontWeight: 600,
                color: '#64748B',
                cursor: 'pointer',
                outline: 'none'
              }}
            >
              <option value="en">🇺🇸 EN</option>
              <option value="fr">🇫🇷 FR</option>
            </select>
          </Box>
        </Box>

        {/* Mobile Menu Button */}
        <Box sx={{ display: { xs: 'block', lg: 'none' } }}>
          <IconButton
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            sx={{
              '&:hover': {
                backgroundColor: 'rgba(139,92,246,0.08)'
              }
            }}
          >
            {isMenuOpen ? <CloseIcon sx={{ color: '#64748B' }} /> : <MenuIcon sx={{ color: '#64748B' }} />}
          </IconButton>
        </Box>
      </Box>

      {/* Mobile Menu */}
      <Box sx={{
        display: { xs: isMenuOpen ? 'block' : 'none', lg: 'none' },
        mt: 3,
        p: 3,
        bgcolor: 'rgba(255,255,255,0.98)',
        borderRadius: 3,
        border: '1px solid rgba(139,92,246,0.1)',
        boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
        backdropFilter: 'blur(20px)'
      }}>
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={() => setIsMenuOpen(false)}
            style={({ isActive }) => ({
              textDecoration: 'none',
              display: 'block',
              padding: '16px 0',
              fontSize: '16px',
              fontWeight: 600,
              color: isActive ? '#8B5CF6' : '#64748B',
              borderBottom: '1px solid rgba(139,92,246,0.1)',
              '&:last-child': {
                borderBottom: 'none'
              }
            })}
          >
            {item.label}
          </NavLink>
        ))}
        
        {/* Mobile Language Switcher */}
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 2, 
          mt: 3, 
          pt: 3,
          borderTop: '1px solid rgba(139,92,246,0.1)'
        }}>
          <Language sx={{ fontSize: 20, color: '#64748B' }} />
          <select
            value={locale}
            onChange={(e) => setLocale(e.target.value as 'en' | 'fr')}
            style={{
              border: 'none',
              background: 'transparent',
              fontSize: '16px',
              fontWeight: 600,
              color: '#64748B',
              cursor: 'pointer',
              outline: 'none'
            }}
          >
            <option value="en">🇺🇸 English</option>
            <option value="fr">🇫🇷 Français</option>
          </select>
        </Box>
      </Box>
    </Box>
  )
}