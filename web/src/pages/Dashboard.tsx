import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Box, AppBar, Toolbar, IconButton, Typography, CssBaseline } from '@mui/material'
import { Menu as MenuIcon } from '@mui/icons-material'
import { customAuth, type CustomUser } from '../lib/custom-auth'
import MuiSidebar from '../components/MuiSidebar'
import DashboardOverview from '../components/Dashboard'
import LeadsManagement from '../components/LeadsManagement'

export default function Dashboard() {
  const [user, setUser] = useState<CustomUser | null>(null)
  const [currentModule, setCurrentModule] = useState('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const currentUser = customAuth.getCurrentUser()
    if (!currentUser) {
      navigate('/login')
      return
    }
    setUser(currentUser)
  }, [navigate])

  const handleLogout = () => {
    customAuth.logout()
    navigate('/login')
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
      case 'analytics':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            style={{ padding: '40px', textAlign: 'center' }}
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
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <>
      <CssBaseline />
      <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: '#FAFAFA' }}>
        {/* MUI Sidebar */}
        <MuiSidebar
          open={sidebarOpen}
          onToggle={() => setSidebarOpen(!sidebarOpen)}
          selectedModule={currentModule}
          onModuleSelect={handleModuleChange}
          onLogout={handleLogout}
          user={user || { username: 'Admin' }}
        />

        {/* Main Content Area */}
        <Box 
          component="main" 
          sx={{ 
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
            width: { xs: '100%', sm: `calc(100% - ${sidebarOpen ? '240px' : '64px'})` },
            ml: sidebarOpen ? { xs: 0, sm: '240px' } : { xs: 0, sm: '64px' },
            transition: 'all 0.3s ease'
          }}
        >
          {/* Top App Bar */}
          <AppBar 
            position="fixed"
            sx={{ 
              backgroundColor: '#ffffff',
              color: '#333',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              zIndex: theme => theme.zIndex.drawer + 1,
              width: { xs: '100%', sm: `calc(100% - ${sidebarOpen ? '240px' : '64px'})` }
            }}
          >
            <Toolbar sx={{ justifyContent: 'space-between', px: 3, py: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <IconButton
                  edge="start"
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  sx={{ 
                    color: '#1976D2',
                    backgroundColor: '#F0F4FF',
                    '&:hover': { backgroundColor: '#E3F2FD' }
                  }}
                >
                  <MenuIcon />
                </IconButton>
                
                <Typography variant="h6" sx={{ fontWeight: '600', color: '#333' }}>
                  {currentModule === 'dashboard' ? '📊 Dashboard' : 
                   currentModule === 'leads' ? '👥 Leads Management' : 
                   '📈 Analytics'}
                </Typography>
              </Box>

              {/* User Info */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{
                  background: 'linear-gradient(135deg, #1976D2 0%, #1565C0 100%)',
                  color: 'white',
                  px: 2,
                  py: 1,
                  borderRadius: 2,
                  fontSize: 14,
                  fontWeight: 600
                }}>
                  👋 {user?.full_name || user?.username || 'Admin'}
                </Box>
              </Box>
            </Toolbar>
          </AppBar>

          {/* Content */}
          <Box sx={{ 
            flexGrow: 1, 
            mt: 8, // Account for fixed AppBar
            p: { xs: 2, sm: 3 },
            backgroundColor: '#FAFAFA',
            overflow: 'auto',
            minHeight: 'calc(100vh - 64px)'
          }}>
            {renderModule()}
          </Box>
        </Box>
      </Box>
    </>
  )
}