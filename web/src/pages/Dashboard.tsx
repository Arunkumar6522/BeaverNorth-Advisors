import { motion } from 'framer-motion'
import { customAuth, type CustomUser } from '../lib/custom-auth'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Dashboard() {
  const [user, setUser] = useState<CustomUser | null>(null)
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

  if (!user) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f6f7fb', color: 'var(--text-primary)' }}>
      {/* Header */}
      <header style={{
        background: 'var(--surface-1)',
        borderBottom: '1px solid var(--line)',
        padding: '16px 24px',
        position: 'sticky',
        top: 0,
        zIndex: 10,
        backdropFilter: 'blur(8px)'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          maxWidth: 1200,
          margin: '0 auto'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <img src="/favicon.png" alt="BeaverNorth Advisors" style={{ height: 32, width: 32, objectFit: 'contain' }} />
            <h1 style={{ margin: 0, fontSize: 24 }}>Dashboard</h1>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              style={{
                background: 'var(--brand-green)',
                color: 'white',
                padding: '8px 16px',
                borderRadius: 20,
                fontSize: 14,
                fontWeight: 600
              }}
            >
              Welcome, {user.full_name || user.username}
            </motion.div>
            
            <button
              onClick={handleLogout}
              style={{
                background: 'var(--brand-orange)',
                color: 'white',
                padding: '8px 16px',
                borderRadius: 8,
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
      </header>

      {/* Main Content */}
      <main style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 24px' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          style={{
            background: 'var(--surface-1)',
            borderRadius: 16,
            padding: 32,
            border: '1px solid var(--line)',
            marginBottom: 24
          }}
        >
          <h2 style={{ marginTop: 0 }}>Dashboard Overview</h2>
          <p style={{ color: 'var(--text-secondary)' }}>
            Welcome to your BeaverNorth Advisors dashboard, {user.full_name || user.username}! 
            Here you can manage your insurance advisory business.
          </p>
        </motion.div>

        {/* Stats Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 20 }}>
          {[
            { title: 'Total Clients', value: '245', color: 'var(--brand-green)' },
            { title: 'Active Policies', value: '189', color: 'var(--brand-yellow)' },
            { title: 'New Quotes', value: '12', color: 'var(--brand-orange)' },
            { title: 'Revenue (MTD)', value: '$12,450', color: '#22c55e' }
          ].map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1, duration: 0.6 }}
              style={{
                background: 'var(--surface-1)',
                borderRadius: 12,
                padding: 24,
                border: '1px solid var(--line)',
                cursor: 'pointer'
              }}
              whileHover={{ y: -4 }}
            >
              <h3 style={{ marginTop: 0, marginBottom: 8, color: stat.color }}>{stat.value}</h3>
              <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: 14 }}>{stat.title}</p>
            </motion.div>
          ))}
        </div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          style={{
            background: 'var(--surface-1)',
            borderRadius: 12,
            padding: 24,
            border: '1px solid var(--line)',
            marginTop: 24
          }}
        >
          <h3 style={{ marginTop: 0 }}>Recent Activity</h3>
          <div style={{ display: 'grid', gap: 12 }}>
            {[
              { action: 'New client registration', time: '2 hours ago', client: 'Sarah Johnson' },
              { action: 'Policy renewal processed', time: '4 hours ago', client: 'Mike Chen' },
              { action: 'Quote generated', time: '6 hours ago', client: 'Emily Davis' },
              { action: 'Claim submitted', time: '1 day ago', client: 'Robert Wilson' }
            ].map((item, index) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '12px 0',
                  borderBottom: index === 3 ? 'none' : '1px solid var(--line)'
                }}
              >
                <div>
                  <p style={{ margin: '4px 0', fontSize: 14 }}>{item.action}</p>
                  <p style={{ margin: '4px 0', fontSize: 12, color: 'var(--text-secondary)' }}>
                    Client: {item.client}
                  </p>
                </div>
                <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{item.time}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </main>
    </div>
  )
}
