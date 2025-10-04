import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Box, AppBar, Toolbar, Typography, IconButton } from '@mui/material'
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
    <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: '#F9FAFB' }}>
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
      <Box sx={{ 
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
        ml: sidebarOpen ? { xs: 0, lg: '240px' } : { xs: 0, lg: '64px' },
        transition: 'margin-left 0.3s ease'
      }}>
        {/* Top App Bar */}
        <AppBar 
          position="sticky"
          sx={{ 
            backgroundColor: '#ffffff',
            color: '#111827',
            borderBottom: '1px solid #E2E8F0',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            ml: sidebarOpen ? { xs: 0, lg: '-240px' } : { xs: 0, lg: '-64px' },
            transition: 'margin-left 0.3s ease'
          }}
        >
          <Toolbar sx={{ justifyContent: 'space-between', px: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <IconButton
                edge="start"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                sx={{ 
                  color: '#6B7280',
                  backgroundColor: '#F3F4F6',
                  '&:hover': { backgroundColor: '#E5E7EB' }
                }}
              >
                <MenuIcon />
              </IconButton>
              
              <Typography variant="h6" sx={{ fontWeight: '600', color: '#111827' }}>
                {currentModule === 'dashboard' ? '📊 Dashboard' : 
                 currentModule === 'leads' ? '👥 Leads Management' : 
                 '📈 Analytics'}
              </Typography>
            </Box>

            {/* User Info */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{
                background: 'linear-gradient(135deg, #22C55E 0%, #16A34A 100%)',
                color: 'white',
                px: 2,
                py: 1,
                borderRadius: 6,
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
          p: 3,
          ml: sidebarOpen ? { xs: 0, lg: '240px' } : { xs: 0, lg: '64px' },
          transition: 'margin-left 0.3s ease'
        }}>
          {renderModule()}
        </Box>
      </Box>
    </Box>
  )
}

// Typography component for inline styling
const Typography = ({ variant, children, ...props }: any) => {
  const getStyle = () => {
    switch (variant) {
      case 'h6':
        return { fontSize: '18px', fontWeight: '600' }
      default:
        return {}
    }
  }

  return <div style={getStyle()} {...props}>{children}</div>
}