import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Box, AppBar, Toolbar, IconButton, Typography, CssBaseline } from '@mui/material'
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
  }

  const renderModule = () => {
    switch (currentModule) {
      case 'dashboard':
        return <DashboardOverview />
      case 'leads':
        return <LeadsManagement />
      case 'deleted':
        return <DeletedLeads />
      case 'analytics':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            style={{ padding: '40px', paddingTop: '70px', textAlign: 'center', height: '100%' }}
          >
            <h2>Analytics Coming Soon</h2>
            <p style={{ color: '#6B7280', marginTop: '16px' }}>
              Advanced reporting and insights will be available here.
            </p>
          </motion.div>
        )
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
      
      {/* Sidebar */}
      <MuiSidebar
        isOpen={sidebarOpen}
        onSidebarToggle={() => setSidebarOpen(!sidebarOpen)}
        currentModule={currentModule}
        onModuleChange={handleModuleChange}
        user={user}
      />

      {/* Main Content Area */}
      <Box sx={{ 
        flex: 1,
        marginLeft: sidebarOpen ? '240px' : '64px',
        transition: 'margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
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
              <IconButton
                edge="start"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                sx={{ 
                  color: '#1976D2',
                  backgroundColor: '#F0F4FF',
                  '&:hover': { 
                    backgroundColor: '#E3F2FD',
                    transform: 'scale(1.05)'
                  },
                  transition: 'all 0.2s ease',
                  width: 40,
                  height: 40
                }}
              >
                <MenuIcon sx={{ fontSize: 20 }} />
              </IconButton>
              
              <Typography variant="h6" sx={{ 
                fontWeight: '600', 
                color: '#333',
                fontSize: '1.25rem !important'
              }}>
                {currentModule === 'dashboard' ? '📊 Dashboard' : 
                 currentModule === 'leads' ? '👥 Leads Management' : 
                 currentModule === 'deleted' ? '🗑️ Deleted Leads' :
                 '📈 Analytics'}
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