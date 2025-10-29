import { useState, useEffect } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { useI18n } from '../i18n'
import { Box, IconButton, Drawer, List, ListItem, ListItemText } from '@mui/material'
import { Menu as MenuIcon, Close as CloseIcon, Language } from '@mui/icons-material'

export default function Nav() {
  const location = useLocation()
  const { locale, setLocale, t } = useI18n()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down'>('up')
  const [isScrolled, setIsScrolled] = useState(false)

  // Scroll detection
  useEffect(() => {
    let lastScrollY = window.scrollY
    let ticking = false

    const updateScrollDirection = () => {
      const scrollY = window.scrollY
      const direction = scrollY > lastScrollY ? 'down' : 'up'
      
      if (direction !== scrollDirection && Math.abs(scrollY - lastScrollY) > 5) {
        setScrollDirection(direction)
      }
      
      setIsScrolled(scrollY > 30)
      lastScrollY = scrollY > 0 ? scrollY : 0
      ticking = false
    }

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(updateScrollDirection)
        ticking = true
      }
    }

    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [scrollDirection])

  const navItems = [
    { label: t('nav_home'), path: '/' },
    { label: t('nav_about'), path: '/about' },
    { label: t('nav_blog'), path: '/blog' },
    { label: t('nav_testimonials'), path: '/testimonial' },
    { label: t('nav_contact'), path: '/contact' }
  ]

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

  return (
    <>
      {/* Container for proper centering */}
      <Box 
        className="sticky-nav"
        sx={{
          position: 'sticky',
          top: 0,
          zIndex: 1000,
          width: '100%',
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          transform: scrollDirection === 'down' && isScrolled ? 
            { xs: 'scale(1)', md: 'scale(0.95)' } : 
            'scale(1)',
          opacity: scrollDirection === 'down' && isScrolled ? 
            { xs: 1, md: 0.9 } : 
            1
        }}
      >
        {/* Navigation Bar */}
        <Box sx={{
          transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          width: '100%',
          bgcolor: 'rgba(255,255,255,0.98)',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
          borderRadius: 0,
          // Scroll Down: Rounded corners (desktop only)
          ...(scrollDirection === 'down' && isScrolled && {
            borderRadius: { xs: 0, md: '24px' },
            bgcolor: 'rgba(255,255,255,0.95)',
            backdropFilter: 'blur(15px)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
            border: '1px solid rgba(255,255,255,0.2)'
          })
        }}>
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            py: scrollDirection === 'down' && isScrolled ? 
              { xs: 1.5, md: 0.5 } : 
              { xs: 1.5, md: 2.5 },
            transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            px: { xs: 1.5, sm: 2, md: 4, lg: 6 },
            maxWidth: '1400px',
            mx: 'auto'
          }}>
            
            {/* Company Name Only */}
            <Link to="/" style={{ textDecoration: 'none' }}>
              <Box sx={{ 
                fontWeight: 800,
                color: '#1E377C',
                fontSize: scrollDirection === 'down' && isScrolled ? 
                  { xs: '1.2rem', sm: '1.3rem', md: '0.9rem' } : 
                  { xs: '1.2rem', sm: '1.3rem', md: '1.5rem' },
                lineHeight: 1.2,
                letterSpacing: '-0.02em',
                transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                transform: scrollDirection === 'down' && isScrolled ? 
                  { xs: 'scale(1)', md: 'scale(0.85)' } : 
                  'scale(1)'
              }}>
                BeaverNorth Advisors
              </Box>
            </Link>

            {/* Desktop Navigation - Clean & Simple */}
            <Box sx={{ 
              display: { xs: 'none', lg: 'flex' },
              alignItems: 'center',
              gap: { lg: 0.5, xl: 1 },
              flex: 1,
              justifyContent: 'center',
              minWidth: 0
            }}>
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  style={({ isActive }) => ({
                    textDecoration: 'none',
                    padding: scrollDirection === 'down' && isScrolled ? '8px 12px' : '10px 16px',
                    borderRadius: 8,
                    fontSize: scrollDirection === 'down' && isScrolled ? '14px' : '15px',
                    fontWeight: 600,
                    color: isActive ? '#1E377C' : '#417F73',
                    transition: 'all 0.2s ease',
                    backgroundColor: isActive ? 'rgba(105,131,204,0.08)' : 'transparent',
                    whiteSpace: 'nowrap',
                    flexShrink: 0
                  })}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#1E377C'
                    e.currentTarget.style.backgroundColor = 'rgba(105,131,204,0.08)'
                  }}
                  onMouseLeave={(e) => {
                    if (location.pathname !== e.currentTarget.getAttribute('href')) {
                      e.currentTarget.style.color = '#417F73'
                      e.currentTarget.style.backgroundColor = 'transparent'
                    }
                  }}
                >
                  {item.label}
                </NavLink>
              ))}
            </Box>

            {/* Language Switcher - Right Side */}
            <Box sx={{
              display: { xs: 'none', lg: 'flex' },
              alignItems: 'center',
              gap: { lg: 0.5, xl: 0.5 },
              flexShrink: 0
            }}>
                <Language sx={{ fontSize: 18, color: '#6B7280' }} />
                <select
                  value={locale}
                  onChange={(e) => {
                    console.log('Language changed to:', e.target.value)
                    setLocale(e.target.value as 'en' | 'fr')
                  }}
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
                  <option value="en">EN</option>
                  <option value="fr">FR</option>
                </select>
            </Box>

            {/* Mobile Menu Button */}
            <Box sx={{ 
              display: { xs: 'flex', lg: 'none' }, 
              alignItems: 'center', 
              gap: { xs: 1, sm: 1.5 }
            }}>
              {/* Mobile Language Switcher */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Language sx={{ fontSize: { xs: 14, sm: 16 }, color: '#6B7280' }} />
                <select
                  value={locale}
                  onChange={(e) => {
                    console.log('Mobile language changed to:', e.target.value)
                    setLocale(e.target.value as 'en' | 'fr')
                  }}
                  style={{
                    border: 'none',
                    background: 'transparent',
                    fontSize: window.innerWidth < 400 ? '12px' : '13px',
                    fontWeight: 600,
                    color: '#417F73',
                    cursor: 'pointer',
                    outline: 'none'
                  }}
                >
                  <option value="en">EN</option>
                  <option value="fr">FR</option>
                </select>
              </Box>

              <IconButton
                onClick={toggleMenu}
                sx={{
                  color: '#6B7280',
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
      </Box>

      {/* Mobile Drawer - Clean Design */}
      <Drawer
        anchor="right"
        open={isMenuOpen}
        onClose={toggleMenu}
        sx={{
          '& .MuiDrawer-paper': {
            width: { xs: '100vw', sm: '320px' },
            maxWidth: '320px',
            bgcolor: 'white'
          }
        }}
      >
        {/* Drawer Header */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          p: 3,
          borderBottom: '1px solid rgba(105,131,204,0.1)'
        }}>
              <Box sx={{
                fontWeight: 800,
                color: '#1E377C',
                fontSize: '1.2rem',
                lineHeight: 1.2,
                letterSpacing: '-0.02em'
              }}>
                BeaverNorth Advisors
              </Box>
          <IconButton
            onClick={toggleMenu}
            sx={{
              color: '#6B7280',
              '&:hover': {
                backgroundColor: 'rgba(105,131,204,0.08)'
              }
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Navigation Items */}
        <List sx={{ flexGrow: 1, p: 2 }}>
          {navItems.map((item) => (
            <ListItem key={item.path} disablePadding sx={{ mb: 1 }}>
              <NavLink
                to={item.path}
                onClick={toggleMenu}
                style={({ isActive }) => ({
                  textDecoration: 'none',
                  width: '100%',
                  padding: '14px 16px',
                  borderRadius: 8,
                  backgroundColor: isActive ? 'rgba(105,131,204,0.1)' : 'transparent',
                  transition: 'all 0.2s ease',
                  color: isActive ? '#1E377C' : '#417F73',
                  fontWeight: isActive ? 700 : 600,
                  fontSize: '15px',
                  display: 'block'
                })}
              >
                <ListItemText 
                  primary={item.label}
                  primaryTypographyProps={{
                    style: { margin: 0, fontWeight: 'inherit' }
                  }}
                />
              </NavLink>
            </ListItem>
          ))}
        </List>
      </Drawer>
    </>
  )
}