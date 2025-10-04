import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Box, AppBar, Toolbar, Typography, CssBaseline, IconButton, Drawer, useTheme, useMediaQuery } from '@mui/material'
import { Menu as MenuIcon } from '@mui/icons-material'
import { customAuth, type CustomUser } from '../lib/custom-auth'
import MuiSidebar from '../components/MuiSidebar'
import DashboardOverview from '../components/Dashboard'
import LeadsManagement from '../components/LeadsManagement'
import DeletedLeads from '../components/DeletedLeads'

export default function Dashboard() {
  const [user, setUser] = useState<CustomUser | null>(null)
  const [currentModule, setCurrentModule] = useState('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const currentUser = await customAuth.getCurrentUser()
        setUser(currentUser)
      } catch (error) {
        console.error('❌ Error checking auth:', error)
      }
    }

    checkAuth()
  }, [])

  const handleLogout = async () => {
    try {
      await customAuth.logout()
      setUser(null)
      window.location.href = '/login'
    } catch (error) {
      console.error('❌ Error during logout:', error)
    }
  }

  const handleModuleChange = (moduleId: string) => {
    setCurrentModule(moduleId)
    if (isMobile) {
      setSidebarOpen(false) // Close drawer on mobile when navigating
    }
  }

  const renderModule = () => {
    switch (currentModule) {
      case 'dashboard':
        return <DashboardOverview />
      case 'leads':
        return <LeadsManagement />
      case 'deleted':
        return <DeletedLeads />
      default:
        return <DashboardOverview />
    }
  }

  if (!user) {
    return (
      <Box sx={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}>
        <Typography variant="h6" sx={{ color: 'white' }}>
          Loading...
        </Typography>
      </Box>
    )
  }

  return (
    <Box sx={{ 
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      display: 'flex',
      overflow: 'hidden',
      backgroundColor: '#FAFAFA'
    }}>
      <CssBaseline />
      
      {/* Sidebar - Desktop */}
      {!isMobile && (
        <MuiSidebar
          open={sidebarOpen}
          onToggle={() => setSidebarOpen(!sidebarOpen)}
          selectedModule={currentModule}
          onModuleSelect={handleModuleChange}
          onLogout={handleLogout}
          user={user}
        />
      )}

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={sidebarOpen && isMobile}
        onClose={() => setSidebarOpen(false)}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile
        }}
        sx={{
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: 240,
          },
        }}
      >
        <MuiSidebar
          open={true}
          onToggle={() => setSidebarOpen(false)}
          selectedModule={currentModule}
          onModuleSelect={handleModuleChange}
          onLogout={handleLogout}
          user={user}
          mobile={true}
        />
      </Drawer>

      {/* Main Content Area */}
      <Box sx={{ 
        flex: 1,
        marginLeft: !isMobile ? (sidebarOpen ? '240px' : '64px') : '0px',
        transition: !isMobile ? 'margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1)' : 'none',
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        overflow: 'hidden'
      }}>
        {/* Top Bar */}
        <AppBar 
          position="static" 
          elevation={0}
          sx={{ 
            backgroundColor: '#ffffff',
            color: '#333',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
            borderBottom: '1px solid #e5e7eb',
            zIndex: 1100,
            flexShrink: 0
          }}
        >
          <Toolbar sx={{ 
            justifyContent: 'space-between', 
            px: 3, 
            py: 1,
            minHeight: '64px !important'
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {/* Mobile Hamburger Menu */}
              {isMobile && (
                <IconButton
                  edge="start"
                  color="inherit"
                  onClick={() => setSidebarOpen(true)}
                  sx={{ 
                    mr: 1,
                    color: '#333',
                    backgroundColor: 'transparent',
                    '&:hover': { backgroundColor: 'rgba(0,0,0,0.04)' }
                  }}
                >
                  <MenuIcon />
                </IconButton>
              )}
              
              <Typography variant="h6" sx={{ 
                fontWeight: '600', 
                color: '#333',
                fontSize: '1.25rem !important'
              }}>
                {currentModule === 'dashboard' ? '📊 Dashboard' : 
                 currentModule === 'leads' ? '👥 Leads Management' : 
                 '🗑️ Deleted Leads'}
              </Typography>
            </Box>

            {/* User Info */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{
                background: 'linear-gradient(135deg, #1976D2 0%, #1565C0 100%)',
                color: 'white',
                px: 3,
                py: 1.5,
                borderRadius: 2,
                fontSize: 15,
                fontWeight: 600,
                boxShadow: '0 2px 8px rgba(25,118,210,0.3)'
              }}>
                👋 {user?.full_name || user?.username || 'Admin'}
              </Box>
            </Box>
          </Toolbar>
        </AppBar>

        {/* Main Content */}
        <Box sx={{ 
          flex: 1,
          overflow: 'hidden',
          backgroundColor: '#FAFAFA',
          position: 'relative'
        }}>
          <motion.div
            key={currentModule}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            style={{ 
              height: '100%',
              width: '100%',
              overflow: 'hidden'
            }}
          >
            {renderModule()}
          </motion.div>
        </Box>
      </Box>
    </Box>
  )
}