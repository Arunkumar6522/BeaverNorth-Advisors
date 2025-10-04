import React, { useState } from 'react'
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  Avatar,
  FormControl,
  Select,
  MenuItem
} from '@mui/material'
import { 
  TrendingUp, 
  People, 
  Phone, 
  CheckCircleOutline,
  CalendarToday
} from '@mui/icons-material'

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
  const [timePeriod, setTimePeriod] = useState('month')

  const timePeriods = [
    { value: 'today', label: 'Today', icon: CalendarToday },
    { value: 'week', label: 'This Week', icon: CalendarToday },
    { value: 'month', label: 'This Month', icon: CalendarToday },
    { value: 'year', label: 'This Year', icon: CalendarToday }
  ]

  // Dynamic stats based on time period
  const getStatsForPeriod = (period: string) => {
    const baseStats = {
      today: { total: 8, new: 2, contacted: 3, converted: 1 },
      week: { total: 24, new: 6, contacted: 12, converted: 3 },
      month: { total: 42, new: 12, contacted: 28, converted: 8 },
      year: { total: 512, new: 156, contacted: 267, converted: 89 }
    }
    
    return baseStats[period as keyof typeof baseStats] || baseStats.month
  }

  const currentStats = getStatsForPeriod(timePeriod)

  const stats = [
    {
      title: 'Total Leads',
      value: currentStats.total,
      icon: <People />,
      color: '#22C55E',
      change: timePeriod === 'today' ? '+8%' : timePeriod === 'week' ? '+12%' : '+24%'
    },
    {
      title: 'New Leads',
      value: currentStats.new,
      icon: <TrendingUp />,
      color: '#3B82F6',
      change: timePeriod === 'today' ? '+2%' : timePeriod === 'week' ? '+5%' : '+18%'
    },
    {
      title: 'Contacted',
      value: currentStats.contacted,
      icon: <Phone />,
      color: '#F59E0B',
      change: '+5%'
    },
    {
      title: 'Converted',
      value: currentStats.converted,
      icon: <CheckCircleOutline />,
      color: '#10B981',
      change: timePeriod === 'today' ? '+1%' : timePeriod === 'week' ? '+1.5%' : '+2%'
    }
  ]

  return (
    <Box sx={{ px: 2 }}>
      {/* Header with Time Period Selector */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#111827', mb: 1 }}>
            Welcome back! 👋
          </Typography>
          <Typography variant="body1" sx={{ color: '#6B7280' }}>
            Here's your insurance leads performance.
          </Typography>
        </Box>
        
        {/* Time Period Selector */}
        <FormControl size="small" sx={{ minWidth: 160 }}>
          <Select
            value={timePeriod}
            onChange={(e) => setTimePeriod(e.target.value)}
            sx={{
              backgroundColor: '#ffffff',
              borderRadius: 2,
              boxShadow: 1,
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: '#E2E8F0'
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: '#22C55E'
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: '#22C55E',
                borderWidth: 2
              }
            }}
          >
            {timePeriods.map((period) => {
              const Icon = period.icon
              return (
                <MenuItem key={period.value} value={period.value}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Icon sx={{ fontSize: 18, color: '#6B7280' }} />
                    <Typography variant="body2">{period.label}</Typography>
                  </Box>
                </MenuItem>
              )
            })}
          </Select>
        </FormControl>
      </Box>

      {/* Statistics Cards */}
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
        gap: 3, 
        mb: 4 
      }}>
        {stats.map((stat, index) => (
          <StatCard {...stat} key={index} />
        ))}
      </Box>

      {/* Recent Activity */}
      <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', md: 'row' } }}>
        <Box sx={{ flex: { xs: '1', md: '2' } }}>
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
                    <Phone sx={{ fontSize: 20 }} />
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
        </Box>
        
        <Box sx={{ flex: '1' }}>
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
        </Box>
      </Box>
    </Box>
  )
}
