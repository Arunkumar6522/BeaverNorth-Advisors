import { useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { useI18n } from '../i18n'
import { Box, Typography, IconButton, Drawer, List, ListItem, ListItemText } from '@mui/material'
import { Menu as MenuIcon, Close as CloseIcon, Language } from '@mui/icons-material'

export default function Nav() {
  const location = useLocation()
  const { locale, setLocale } = useI18n()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'About', path: '/about' },
    { label: 'Services', path: '/services' },
    { label: 'Contact', path: '/contact' }
  ]

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

  return (
    <>
      <Box sx={{
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        bgcolor: 'rgba(255,255,255,0.98)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(105,131,204,0.1)',
        boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
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
          
          {/* Logo - Professional & Clean */}
          <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5
            }}>
              <Box sx={{
                width: 42,
                height: 42,
                borderRadius: 2,
                background: '#6983CC',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <img 
                  src="/favicon.png" 
                  alt="BeaverNorth" 
                  style={{ 
                    height: '24px', 
                    width: '24px',
                    filter: 'brightness(0) invert(1)'
                  }} 
                />
              </Box>
              <Box>
                <Typography sx={{ 
                  fontWeight: 800,
                  color: '#1E377C',
                  fontSize: '1.3rem',
                  lineHeight: 1,
                  letterSpacing: '-0.02em'
                }}>
                  BeaverNorth
                </Typography>
                <Typography sx={{ 
                  color: '#6983CC',
                  fontWeight: 600,
                  fontSize: '0.75rem',
                  letterSpacing: '0.5px',
                  textTransform: 'uppercase'
                }}>
                  Advisors
                </Typography>
              </Box>
            </Box>
          </Link>

          {/* Desktop Navigation - Clean & Simple */}
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
                  padding: '10px 20px',
                  borderRadius: 8,
                  fontSize: '15px',
                  fontWeight: 600,
                  color: isActive ? '#6983CC' : '#417F73',
                  transition: 'all 0.2s ease',
                  backgroundColor: isActive ? 'rgba(105,131,204,0.08)' : 'transparent'
                })}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#6983CC'
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
            
            {/* Language Switcher - Minimal */}
            <Box sx={{
              ml: 2,
              pl: 2,
              borderLeft: '1px solid rgba(105,131,204,0.2)',
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}>
              <Language sx={{ fontSize: 18, color: '#6983CC' }} />
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
                <option value="en">EN</option>
                <option value="fr">FR</option>
              </select>
            </Box>
          </Box>

          {/* Mobile Menu Button */}
          <Box sx={{ display: { xs: 'flex', lg: 'none' }, alignItems: 'center', gap: 2 }}>
            {/* Mobile Language Switcher */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Language sx={{ fontSize: 16, color: '#6983CC' }} />
              <select
                value={locale}
                onChange={(e) => setLocale(e.target.value as 'en' | 'fr')}
                style={{
                  border: 'none',
                  background: 'transparent',
                  fontSize: '13px',
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
                color: '#6983CC',
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
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box sx={{
              width: 36,
              height: 36,
              borderRadius: 2,
              background: '#6983CC',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <img 
                src="/favicon.png" 
                alt="BeaverNorth" 
                style={{ 
                  height: '20px', 
                  width: '20px',
                  filter: 'brightness(0) invert(1)'
                }} 
              />
            </Box>
            <Box>
              <Typography sx={{ 
                fontWeight: 800,
                color: '#1E377C',
                fontSize: '1.1rem',
                lineHeight: 1
              }}>
                BeaverNorth
              </Typography>
              <Typography sx={{ 
                color: '#6983CC',
                fontWeight: 600,
                fontSize: '0.7rem',
                letterSpacing: '0.5px',
                textTransform: 'uppercase'
              }}>
                Advisors
              </Typography>
            </Box>
          </Box>
          <IconButton
            onClick={toggleMenu}
            sx={{
              color: '#6983CC',
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
                  color: isActive ? '#6983CC' : '#417F73',
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
