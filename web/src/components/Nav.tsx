import { useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { useI18n } from '../i18n'
import { Box, IconButton, Drawer, List, ListItem, ListItemText } from '@mui/material'
import { Menu as MenuIcon, Close as CloseIcon, Language } from '@mui/icons-material'
import bnaLogo from '../assets/bna logo.png'

export default function Nav() {
  const location = useLocation()
  const { locale, setLocale, t } = useI18n()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const navItems = [
    { label: t('nav_home'), path: '/' },
    { label: t('nav_about'), path: '/about' },
    { label: t('nav_services'), path: '/services' },
    { label: t('nav_contact'), path: '/contact' }
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
        width: '100%',
        left: 0,
        right: 0
      }}>
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          maxWidth: '1400px',
          mx: 'auto',
          px: { xs: 3, md: 6 },
          py: 2.5
        }}>
          
          {/* Logo - Bigger with Company Name */}
          <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <img 
              src={bnaLogo} 
              alt="BeaverNorth Advisors" 
              style={{ 
                height: '70px',
                width: 'auto'
              }} 
              onError={(e) => {
                console.error('Logo failed to load:', e.currentTarget.src)
                e.currentTarget.style.display = 'none'
              }}
            />
            <Box sx={{ display: { xs: 'none', md: 'block' } }}>
              <Box sx={{ 
                fontWeight: 800,
                color: '#1E377C',
                fontSize: '1.5rem',
                lineHeight: 1.2,
                letterSpacing: '-0.02em'
              }}>
                BeaverNorth <Box component="span" sx={{ 
                  color: 'rgb(255, 203, 5)',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  letterSpacing: '0.5px',
                  textTransform: 'uppercase'
                }}>ADVISORS</Box>
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
                  color: isActive ? 'rgb(255, 203, 5)' : '#417F73',
                  transition: 'all 0.2s ease',
                  backgroundColor: isActive ? 'rgba(105,131,204,0.08)' : 'transparent'
                })}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = 'rgb(255, 203, 5)'
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
              <Language sx={{ fontSize: 18, color: 'rgb(255, 203, 5)' }} />
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
          </Box>

          {/* Mobile Menu Button */}
          <Box sx={{ display: { xs: 'flex', lg: 'none' }, alignItems: 'center', gap: 2 }}>
            {/* Mobile Language Switcher */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Language sx={{ fontSize: 16, color: 'rgb(255, 203, 5)' }} />
              <select
                value={locale}
                onChange={(e) => {
                  console.log('Mobile language changed to:', e.target.value)
                  setLocale(e.target.value as 'en' | 'fr')
                }}
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
                color: 'rgb(255, 203, 5)',
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
          <img 
            src={bnaLogo} 
            alt="BeaverNorth Advisors" 
            style={{ 
              height: '40px',
              width: 'auto'
            }} 
            onError={(e) => {
              console.error('Mobile logo failed to load:', e.currentTarget.src)
              e.currentTarget.style.display = 'none'
            }}
          />
          <IconButton
            onClick={toggleMenu}
            sx={{
              color: 'rgb(255, 203, 5)',
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
                  color: isActive ? 'rgb(255, 203, 5)' : '#417F73',
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
