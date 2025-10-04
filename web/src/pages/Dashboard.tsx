import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { customAuth, type CustomUser } from '../lib/custom-auth'
import DashboardLayout from '../components/DashboardLayout'
import DashboardOverview from '../components/Dashboard'
import LeadsManagement from '../components/LeadsManagement'

export default function Dashboard() {
  const [user, setUser] = useState<CustomUser | null>(null)
  const [currentModule, setCurrentModule] = useState('dashboard')
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
    <div>
      {/* Custom Layout Wrapper */}
      <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#F9FAFB' }}>
        
        {/* Sidebar */}
        <div style={{ 
          width: 240, 
          backgroundColor: '#ffffff', 
          borderRight: '1px solid #E5E7EB',
          paddingTop: 64 // Account for top bar
        }}>
          <div style={{ padding: 16 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#22C55E', mb: 3 }}>
              BeaverNorth Advisors
            </Typography>
            
            <nav>
              {[
                { id: 'dashboard', name: 'Dashboard', icon: '📊' },
                { id: 'leads', name: 'Leads Management', icon: '👥' },
                { id: 'analytics', name: 'Analytics', icon: '📈' }
              ].map((module) => (
                <div
                  key={module.id}
                  onClick={() => handleModuleChange(module.id)}
                  style={{
                    padding: '12px 16px',
                    borderRadius: module.id === currentModule ? '12px' : '8px',
                    backgroundColor: module.id === currentModule ? '#22C55E' : 'transparent',
                    color: module.id === currentModule ? 'white' : '#374151',
                    cursor: 'pointer',
                    marginBottom: 4,
                    fontWeight: module.id === currentModule ? '600' : '500',
                    transition: 'all 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12
                  }}
                >
                  <span style={{ fontSize: 20 }}>{module.icon}</span>
                  {module.name}
                </div>
              ))}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div style={{ flex: 1, paddingTop: 64 }}>
          
          {/* Top Bar */}
          <div style={{
            position: 'fixed',
            top: 0,
            left: 240,
            right: 0,
            backgroundColor: '#ffffff',
            borderBottom: '1px solid #E5E7EB',
            padding: '16px 24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            zIndex: 1000
          }}>
            <h2 style={{ margin: 0, color: '#111827', fontWeight: '600' }}>
              📊 {currentModule === 'dashboard' ? 'Dashboard' : 
                  currentModule === 'leads' ? 'Leads Management' : 'Analytics'}
            </h2>
            
            {/* Welcome & Logout */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{
                background: '#22C55E',
                color: 'white',
                padding: '8px 16px',
                borderRadius: '20px',
                fontSize: 14,
                fontWeight: 600
              }}>
                👋 {user.full_name || user.username}
              </div>
              
              <button
                onClick={handleLogout}
                style={{
                  background: '#EF4444',
                  color: 'white',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: 14,
                  fontWeight: 600
                }}
              >
                Logout
              </button>
            </div>
          </div>

          {/* Module Content */}
          <div style={{ padding: '32px 24px' }}>
            {renderModule()}
          </div>
        </div>
      </div>
    </div>
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