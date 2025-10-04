import { useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { useI18n } from '../i18n'
import { Box, Typography, IconButton, Drawer, List, ListItem, ListItemText, Divider } from '@mui/material'
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

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

  return (
    <>
      <Box sx={{
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        bgcolor: 'rgba(255,255,255,0.95)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(139,184,237,0.1)',
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
              background: 'linear-gradient(135deg, #6983CC 0%, #6BA336 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(105,131,204,0.3)'
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
              color: '#1E377C',
              fontSize: '1.3rem',
              letterSpacing: '-0.02em'
            }}>
              BeaverNorth
              <Typography component="span" sx={{ 
                color: '#EF7F18',
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
                  color: isActive ? '#6983CC' : '#417F73',
                  transition: 'all 0.3s ease',
                  position: 'relative'
                })}
                onMouseEnter={(e) => {
                  if (location.pathname !== '/') {
                    e.currentTarget.style.color = '#6983CC'
                    e.currentTarget.style.backgroundColor = 'rgba(105,131,204,0.08)'
                  }
                }}
                onMouseLeave={(e) => {
                  if (location.pathname !== '/') {
                    e.currentTarget.style.color = '#417F73'
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
              borderLeft: '2px solid #8CB8ED',
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}>
              <Language sx={{ fontSize: 20, color: '#417F73' }} />
              <select
                value={locale}
                onChange={(e) => setLocale(e.target.value as 'en' | 'fr')}
                style={{
                  border: 'none',
                  background: 'transparent',
                  fontSize: '14px',
                  fontWeight: 600,
                  color: '#417F73',
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
          <Box sx={{ display: { xs: 'flex', lg: 'none' } }}>
            <IconButton
              onClick={toggleMenu}
              sx={{
                color: '#417F73',
                '&:hover': {
                  backgroundColor: 'rgba(105,131,204,0.08)'
                }
              }}
            >
              <MenuIcon />
            </IconButton>
          </Box>
        </Box>
      </Box>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={isMenuOpen}
        onClose={toggleMenu}
        sx={{
          '& .MuiDrawer-paper': {
            width: { xs: '100vw', sm: '320px' },
            maxWidth: '320px',
            py: 3,
            px: 2
          }
        }}
      >
        {/* Drawer Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{
              width: 40,
              height: 40,
              borderRadius: 2,
              background: 'linear-gradient(135deg, #6983CC 0%, #6BA336 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <img 
                src="/favicon.png" 
                alt="BeaverNorth" 
                style={{ 
                  height: '22px', 
                  width: '22px',
                  filter: 'brightness(0) invert(1)'
                }} 
              />
            </Box>
            <Box>
              <Typography variant="h6" sx={{ 
                fontWeight: 800,
                color: '#1E377C',
                fontSize: '1.1rem'
              }}>
                BeaverNorth
              </Typography>
              <Typography variant="subtitle2" sx={{ 
                color: '#EF7F18',
                fontWeight: 700,
                fontSize: '0.9rem'
              }}>
                Advisors
              </Typography>
            </Box>
          </Box>
          <IconButton
            onClick={toggleMenu}
            sx={{
              color: '#417F73',
              '&:hover': {
                backgroundColor: 'rgba(105,131,204,0.08)'
              }
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Navigation Items */}
        <List sx={{ flexGrow: 1 }}>
          {navItems.map((item) => (
            <ListItem key={item.path} disablePadding sx={{ mb: 1 }}>
              <NavLink
                to={item.path}
                onClick={toggleMenu}
                style={({ isActive }) => ({
                  textDecoration: 'none',
                  width: '100%',
                  padding: '16px 20px',
                  borderRadius: 12,
                  backgroundColor: isActive ? 'rgba(105,131,204,0.1)' : 'transparent',
                  transition: 'all 0.3s ease',
                  color: isActive ? '#6983CC' : '#417F73',
                  fontWeight: isActive ? 700 : 600,
                  fontSize: '16px',
                  border: isActive ? '2px solid rgba(105,131,204,0.3)' : '2px solid transparent'
                })}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(105,131,204,0.05)'
                  e.currentTarget.style.color = '#6983CC'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent'
                  e.currentTarget.style.color = location.pathname === item.path ? '#6983CC' : '#417F73'
                }}
              >
                <ListItemText 
                  primary={item.label}
                  primaryTypographyProps={{
                    style: { margin: 0 }
                  }}
                />
              </NavLink>
            </ListItem>
          ))}
        </List>

        {/* Mobile Language Switcher */}
        <Box sx={{ mt: 'auto', pt: 3 }}>
          <Divider sx={{ mb: 3, borderColor: '#8CB8ED' }} />
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 2,
            p: 2,
            borderRadius: 2,
            bgcolor: 'rgba(139,184,237,0.05)',
            border: '1px solid rgba(139,184,237,0.1)'
          }}>
            <Language sx={{ fontSize: 24, color: '#417F73' }} />
            <Box>
              <Typography variant="subtitle2" sx={{ 
                color: '#417F73',
                fontWeight: 600,
                fontSize: '0.9rem',
                mb: 0.5
              }}>
                Language
            </Typography>
            <select
              value={locale}
              onChange={(e) => setLocale(e.target.value as 'en' | 'fr')}
              style={{
                border: 'none',
                background: 'transparent',
                fontSize: '16px',
                fontWeight: 600,
                color: '#6983CC',
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
    </Drawer>

    {/* Shimmer Animation */}
    <style>
      {`
        @keyframes shimmer {
          0%, 100% { opacity: 0.7; transform: translateX(-100%); }
          50% { opacity: 1; transform: translateX(100%); }
        }
      `}
    </style>
    </>
  )
}