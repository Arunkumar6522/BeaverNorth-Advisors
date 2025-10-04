import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
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
      case 'deleted':
        return <DeletedLeads />
      case 'analytics':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            style={{ padding: '40px', paddingTop: '70px', textAlign: 'center' }}
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
        p: 4,
        backgroundColor: '#FAFAFA'
      }}>
        <Typography variant="h6" sx={{ color: '#666' }}>Loading...</Typography>
      </Box>
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
            ml: sidebarOpen ? '240px' : '64px',
            transition: 'margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            maxWidth: sidebarOpen ? 'calc(100% - 240px)' : 'calc(100% - 64px)'
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
              ml: sidebarOpen ? '240px' : '64px',
              width: sidebarOpen ? 'calc(100% - 240px)' : 'calc(100% - 64px)',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
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
                    '&:hover': { 
                      backgroundColor: '#E3F2FD',
                      transform: 'scale(1.05)'
                    },
                    transition: 'all 0.2s ease'
                  }}
                >
                  <MenuIcon />
                </IconButton>
                
                <Typography variant="h6" sx={{ 
                  fontWeight: '600', 
                  color: '#333',
                  fontSize: { xs: '1rem', sm: '1.25rem' }
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
                  px: 2,
                  py: 1,
                  borderRadius: 2,
                  fontSize: 14,
                  fontWeight: 600,
                  boxShadow: '0 2px 4px rgba(25,118,210,0.3)'
                }}>
                  👋 {user?.full_name || user?.username || 'Admin'}
                </Box>
              </Box>
            </Toolbar>
          </AppBar>

          {/* Content */}
          <Box sx={{ 
            flexGrow: 1, 
            mt: 8.5, // Account for fixed AppBar
            p: { xs: 2, md: 3 },
            backgroundColor: '#FAFAFA',
            minHeight: 'calc(100vh - 68px)',
            overflow: 'auto'
          }}>
            <motion.div
              key={currentModule}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              style={{ width: '100%' }}
            >
              {renderModule()}
            </motion.div>
          </Box>
        </Box>
      </Box>
    </>
  )
}