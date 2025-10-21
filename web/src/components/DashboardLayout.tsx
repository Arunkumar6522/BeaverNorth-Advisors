import { useState, useEffect } from 'react'
import { Box, Drawer, CssBaseline, AppBar, Toolbar, Typography, List, ListItem, ListItemButton, ListItemIcon, ListItemText, IconButton, useMediaQuery, useTheme, Avatar, Divider, Button } from '@mui/material'
import { Dashboard as DashboardIcon, People as LeadsIcon, Delete as DeletedIcon, Menu as MenuIcon, ChevronLeft as ChevronLeftIcon, ChevronRight as ChevronRightIcon, Logout as LogoutIcon, History as LogsIcon, RateReview as TestimonialsIcon, Settings as SettingsIcon } from '@mui/icons-material'
import { useNavigate, useLocation } from 'react-router-dom'
import { customAuth } from '../lib/custom-auth'
import { useSessionRefresh } from '../hooks/useSessionRefresh'
import bnaLogo from '../assets/bna logo.png'
import DashboardOverview from './Dashboard'
import LeadsManagement from './LeadsManagement'
import TestimonialsManagement from './TestimonialsManagement'
import Settings from './Settings'
import DeletedLeads from './DeletedLeads'
import Logs from './Logs'
import NotificationDropdown from './NotificationDropdown'

const drawerWidth = 240
const miniDrawerWidth = 73

interface Module {
  id: string
  name: string
  icon: React.ReactNode
}

const modules: Module[] = [
  { id: 'dashboard', name: 'Dashboard', icon: <DashboardIcon /> },
  { id: 'leads', name: 'Leads Management', icon: <LeadsIcon /> },
  { id: 'testimonials', name: 'Testimonials', icon: <TestimonialsIcon /> },
  { id: 'settings', name: 'Settings', icon: <SettingsIcon /> },
  { id: 'deleted', name: 'Deleted Leads', icon: <DeletedIcon /> },
  { id: 'logs', name: 'Logs', icon: <LogsIcon /> }
]

export default function DashboardLayout() {
  const location = useLocation()
  const [selectedModule, setSelectedModule] = useState('dashboard')
  const [mobileOpen, setMobileOpen] = useState(false)
  const [desktopOpen, setDesktopOpen] = useState(true)  // Desktop sidebar state
  
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const navigate = useNavigate()

  // Keep session active while user is in dashboard
  useSessionRefresh()

  // Set module based on current route
  useEffect(() => {
    const path = location.pathname
    if (path === '/leads') {
      setSelectedModule('leads')
    } else if (path === '/testimonials') {
      setSelectedModule('testimonials')
    } else if (path === '/settings') {
      setSelectedModule('settings')
    } else if (path === '/deleted') {
      setSelectedModule('deleted')
    } else if (path === '/logs') {
      setSelectedModule('logs')
    } else {
      setSelectedModule('dashboard')
    }
  }, [location])

  const handleModuleChange = (moduleId: string) => {
    setSelectedModule(moduleId)
    
    // Navigate to the appropriate route
    if (moduleId === 'leads') {
      navigate('/leads')
    } else if (moduleId === 'testimonials') {
      navigate('/testimonials')
    } else if (moduleId === 'settings') {
      navigate('/settings')
    } else if (moduleId === 'deleted') {
      navigate('/deleted')
    } else if (moduleId === 'logs') {
      navigate('/logs')
    } else {
      navigate('/dashboard')
    }
    
    if (isMobile) {
      setMobileOpen(false)  // Close drawer on mobile after selection
    }
  }

  const handleDrawerToggle = () => {
    if (isMobile) {
      setMobileOpen(!mobileOpen)
    } else {
      setDesktopOpen(!desktopOpen)  // Toggle collapse on desktop
    }
  }

  const handleLogout = () => {
    // Use the custom auth library's logout method
    customAuth.logout()
    
    // Also clear any additional localStorage items
    localStorage.removeItem('isAuthenticated')
    localStorage.removeItem('username')
    localStorage.removeItem('temp_activities') // Clear temporary activities
    
    // Navigate to login page
    navigate('/login')
  }

  const renderModule = () => {
    switch (selectedModule) {
      case 'dashboard':
        return <DashboardOverview />
      case 'leads':
        return <LeadsManagement />
      case 'testimonials':
        return <TestimonialsManagement />
      case 'settings':
        return <Settings />
      case 'deleted':
        return <DeletedLeads />
      case 'logs':
        return <Logs />
      default:
        return <DashboardOverview />
    }
  }

  const drawer = (open: boolean) => (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      {/* Logo + Collapse Toggle Section */}
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: open ? 'space-between' : 'center', minHeight: 64 }}>
        {open ? (
          <>
            <Avatar 
              src={bnaLogo} 
              alt="BNA" 
              sx={{ width: 40, height: 40, mr: 1 }}
            />
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
              BNA
            </Typography>
            <IconButton onClick={handleDrawerToggle} sx={{ ml: 'auto' }} aria-label="Collapse sidebar">
              <ChevronLeftIcon />
            </IconButton>
          </>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
            <Avatar 
              src={bnaLogo} 
              alt="BNA" 
              sx={{ width: 40, height: 40 }}
            />
            <IconButton onClick={handleDrawerToggle} aria-label="Expand sidebar">
              <ChevronRightIcon />
            </IconButton>
          </Box>
        )}
      </Box>
      
      <Divider />
      
      {/* Navigation Menu */}
      <List sx={{ flexGrow: 1, pt: 2 }}>
        {modules.map((module) => (
          <ListItem key={module.id} disablePadding sx={{ display: 'block' }}>
            <ListItemButton
              selected={selectedModule === module.id}
              onClick={() => handleModuleChange(module.id)}
              sx={{
                minHeight: 48,
                justifyContent: open ? 'initial' : 'center',
                px: 2.5,
                mx: 1,
                mb: 0.5,
                borderRadius: 2,
                '&.Mui-selected': {
                  backgroundColor: '#1976d2',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: '#1565c0',
                  },
                  '& .MuiListItemIcon-root': {
                    color: 'white',
                  },
                },
                '&:hover': {
                  backgroundColor: open ? '#E3F2FD' : '#f5f5f5',
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 3 : 'auto',
                  justifyContent: 'center',
                }}
              >
                {module.icon}
              </ListItemIcon>
              <ListItemText 
                primary={module.name} 
                sx={{ opacity: open ? 1 : 0, display: open ? 'block' : 'none' }} 
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      
      <Divider />
      
      {/* Logout Button at Bottom */}
      <Box sx={{ p: 2 }}>
        <Button
          fullWidth
          variant="outlined"
          color="error"
          startIcon={open ? <LogoutIcon /> : undefined}
          onClick={handleLogout}
          sx={{
            justifyContent: open ? 'flex-start' : 'center',
            minWidth: open ? 'auto' : 48,
            px: open ? 2 : 1
          }}
        >
          {open ? 'Logout' : <LogoutIcon />}
        </Button>
      </Box>
    </Box>
  )

  const currentDrawerWidth = !isMobile && !desktopOpen ? miniDrawerWidth : drawerWidth

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      
      {/* Top AppBar */}
      <AppBar
        position="fixed"
        sx={{
          width: { 
            xs: '100%',
            md: `calc(100% - ${currentDrawerWidth}px)` 
          },
          ml: { md: `${currentDrawerWidth}px` },
          backgroundColor: '#ffffff',
          color: '#374151',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }}
      >
        <Toolbar>
          {/* Mobile menu button only */}
          {isMobile && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}
          
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: '600' }}>
            {modules.find(m => m.id === selectedModule)?.name || 'Dashboard'}
          </Typography>
          
          {/* Notification Icon */}
          <NotificationDropdown isAuthenticated={customAuth.isAuthenticated()} color="#000000" />
        </Toolbar>
      </AppBar>

      {/* Sidebar Drawer - Responsive */}
      {/* Mobile Drawer (Temporary) */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better mobile performance
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            backgroundColor: '#ffffff',
            borderRight: '1px solid #E5E7EB',
          },
        }}
      >
        {drawer(true)}
      </Drawer>

      {/* Desktop Drawer (Permanent - Collapsible) */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          width: currentDrawerWidth,
          flexShrink: 0,
          whiteSpace: 'nowrap',
          transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
          '& .MuiDrawer-paper': {
            width: currentDrawerWidth,
            boxSizing: 'border-box',
            backgroundColor: '#ffffff',
            borderRight: '1px solid #E5E7EB',
            transition: theme.transitions.create('width', {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
            overflowX: 'hidden',
          },
        }}
        open={desktopOpen}
      >
        {drawer(desktopOpen)}
      </Drawer>

      {/* Main Content Area */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          pt: 8,
          px: 0,
          backgroundColor: '#F9FAFB',
          minHeight: '100vh',
          width: { 
            xs: '100%', 
            md: `calc(100% - ${currentDrawerWidth}px)` 
          },
          ml: { md: 0 },
          transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }}
      >
        {renderModule()}
      </Box>
    </Box>
  )
}
