import React from 'react'
import { Box, Grid, Card, CardContent, Typography, Avatar } from '@mui/material'
import { TrendingUp, People, PhoneIcon, CheckCircleOutline } from '@mui/icons-material'

interface StatCardProps {
  title: string
  value: string | number
  icon: React.ReactNode
  color: string
  change?: string
}

function StatCard({ title, value, icon, color, change }: StatCardProps) {
  return (
    <Card sx={{ borderRadius: 2, backgroundColor: '#ffffff', elevation: 0 }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography color="textSecondary" gutterBottom variant="body2" sx={{ textTransform: 'uppercase', fontWeight: '600' }}>
              {title}
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#111827' }}>
              {value}
            </Typography>
            {change && (
              <Typography variant="body2" sx={{ mt: 1, color: change.includes('+') ? '#22C55E' : '#EF4444' }}>
                {change} from last month
              </Typography>
            )}
          </Box>
          <Avatar sx={{ bgcolor: color, width: 56, height: 56 }}>
            {icon}
          </Avatar>
        </Box>
      </CardContent>
    </Card>
  )
}

export default function Dashboard() {
  const stats = [
    {
      title: 'Total Leads',
      value: 42,
      icon: <People />,
      color: '#22C55E',
      change: '+24%'
    },
    {
      title: 'New This Month',
      value: 12,
      icon: <TrendingUp />,
      color: '#3B82F6',
      change: '+18%'
    },
    {
      title: 'Contacted',
      value: 28,
      icon: <PhoneIcon />,
      color: '#F59E0B',
      change: '+5%'
    },
    {
      title: 'Converted',
      value: 8,
      icon: <CheckCircleOutline />,
      color: '#10B981',
      change: '+2%'
    }
  ]

  return (
    <Box sx={{ px: 2 }}>
      {/* Welcome Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#111827', mb: 1 }}>
          Welcome back! 👋
        </Typography>
        <Typography variant="body1" sx={{ color: '#6B7280' }}>
          Here's what's happening with your insurance leads today.
        </Typography>
      </Box>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <StatCard {...stat} />
          </Grid>
        ))}
      </Grid>

      {/* Recent Activity */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card sx={{ borderRadius: 2, backgroundColor: '#ffffff' }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: '600', mb: 3, color: '#111827' }}>
                Recent Lead Activity
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar sx={{ bgcolor: '#22C55E', width: 32, height: 32 }}>
                    <People sx={{ fontSize: 20 }} />
                  </Avatar>
                  <Box>
                    <Typography variant="body1" sx={{ fontWeight: '500' }}>
                      John Smith submitted a quote request
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#6B7280' }}>
                      Term Life Insurance - 2 minutes ago
                    </Typography>
                  </Box>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar sx={{ bgcolor: '#3B82F6', width: 32, height: 32 }}>
                    <CheckCircleOutline sx={{ fontSize: 20 }} />
                  </Avatar>
                  <Box>
                    <Typography variant="body1" sx={{ fontWeight: '500' }}>
                      Sarah Johnson converted to client
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#6B7280' }}>
                      Whole Life Insurance - 15 minutes ago
                    </Typography>
                  </Box>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar sx={{ bgcolor: '#F59E0B', width: 32, height: 32 }}>
                    <PhoneIcon sx={{ fontSize: 20 }} />
                  </Avatar>
                  <Box>
                    <Typography variant="body1" sx={{ fontWeight: '500' }}>
                      Follow-up call with Michael Brown
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#6B7280' }}>
                      Travel Insurance - 1 hour ago
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 2, backgroundColor: '#ffffff' }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: '600', mb: 3, color: '#111827' }}>
                Quick Actions
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ 
                  p: 2, 
                  borderRadius: 2, 
                  backgroundColor: '#F0FDF4', 
                  border: '1px solid #BBF7D0',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s',
                  '&:hover': { backgroundColor: '#DCFCE7' }
                }}>
                  <Typography variant="body1" sx={{ fontWeight: '500', color: '#166534' }}>
                    View All Leads
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#4B5563' }}>
                    Manage your lead pipeline
                  </Typography>
                </Box>
                
                <Box sx={{ 
                  p: 2, 
                  borderRadius: 2, 
                  backgroundColor: '#EFF6FF', 
                  border: '1px solid #DDD6FE',
                  cursor: 'pointer',
                  '&:hover': { backgroundColor: '#DBEAFE' }
                }}>
                  <Typography variant="body1" sx={{ fontWeight: '500', color: '#1E40AF' }}>
                    Export Leads Data
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#4B5563' }}>
                    Download CSV report
                  </Typography>
                </Box>
                
                <Box sx={{ 
                  p: 2, 
                  borderRadius: 2, 
                  backgroundColor: '#FFFBEB', 
                  border: '1px solid #FEF3C7',
                  cursor: 'pointer',
                  '&:hover': { backgroundColor: '#FEF3C7' }
                }}>
                  <Typography variant="body1" sx={{ fontWeight: '500', color: '#D97706' }}>
                    Setup Auto Follow-ups
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#4B5563' }}>
                    Configure email sequences
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}
