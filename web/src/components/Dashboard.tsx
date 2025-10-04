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
  CalendarToday,
  SmokingRooms,
  Block as NoSmoking,
  Male as MaleIcon,
  Female as FemaleIcon,
  Help as OthersIcon,
  VisibilityOff as PreferNotToSayIcon
} from '@mui/icons-material'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'

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
      color: '#1976D2',
      change: timePeriod === 'today' ? '+8%' : timePeriod === 'week' ? '+12%' : '+24%'
    },
    {
      title: 'New Leads',
      value: currentStats.new,
      icon: <TrendingUp />,
      color: '#1976D2',
      change: timePeriod === 'today' ? '+2%' : timePeriod === 'week' ? '+5%' : '+18%'
    },
    {
      title: 'Contacted',
      value: currentStats.contacted,
      icon: <Phone />,
      color: '#1976D2',
      change: '+5%'
    },
    {
      title: 'Converted',
      value: currentStats.converted,
      icon: <CheckCircleOutline />,
      color: '#1976D2',
      change: timePeriod === 'today' ? '+1%' : timePeriod === 'week' ? '+1.5%' : '+2%'
    }
  ]

  // Smoking status data for donut chart
  const smokingData = [
    { name: 'Smokers', value: 45, color: '#FF5722' },
    { name: 'Non-Smokers', value: 102, color: '#1976D2' }
  ]

  // Gender status data for donut chart
  const genderData = [
    { name: 'Male', value: 68, color: '#2196F3' },
    { name: 'Female', value: 59, color: '#E91E63' },
    { name: 'Others', value: 12, color: '#9C27B0' },
    { name: 'Prefer not to say', value: 8, color: '#607D8B' }
  ]

  const CustomTooltip = ({ active, payload }: any) => {
      if (active && payload && payload.length) {
        return (
          <div style={{ 
            backgroundColor: '#fff', 
            padding: '10px', 
            border: '1px solid #ccc',
            borderRadius: '4px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <p style={{ margin: 0, fontWeight: 'bold' }}>{payload[0].name}</p>
            <p style={{ margin: 0, color: '#666' }}>{`${payload[0].value} leads (${Math.round(payload[0].payload.percentage)}%)`}</p>
        </div>
      )
    }
    return null
  }

  return (
    <Box sx={{ height: '100%', overflow: 'auto', px: 2 }}>
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
                borderColor: '#E0E0E0'
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: '#1976D2'
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: '#1976D2',
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

      {/* Charts Section - Stack on mobile, side-by-side on desktop */}
      <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', md: 'row' }, mb: 3 }}>
        {/* Gender Distribution Chart */}
        <Card sx={{ borderRadius: 2, backgroundColor: '#ffffff', flex: 1, minWidth: { xs: '100%', md: 0 } }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: '600', mb: 2, color: '#111827' }}>
                Gender Distribution
              </Typography>
              <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                <ResponsiveContainer width="100%" height={150}>
                  <PieChart>
                    <Pie
                      data={genderData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={70}
                      paddingAngle={3}
                      dataKey="value"
                      label={false}
                    >
                      {genderData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', pt: 1, borderTop: '1px solid #f0f0f0', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <MaleIcon sx={{ color: '#2196F3', fontSize: 14 }} />
                  <Typography variant="body2" sx={{ fontWeight: '700', color: '#2196F3', fontSize: '0.85rem' }}>
                    {genderData[0].value}M
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <FemaleIcon sx={{ color: '#E91E63', fontSize: 14 }} />
                  <Typography variant="body2" sx={{ fontWeight: '700', color: '#E91E63', fontSize: '0.85rem' }}>
                    {genderData[1].value}F
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <OthersIcon sx={{ color: '#9C27B0', fontSize: 14 }} />
                  <Typography variant="body2" sx={{ fontWeight: '700', color: '#9C27B0', fontSize: '0.85rem' }}>
                    {genderData[2].value}O
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <PreferNotToSayIcon sx={{ color: '#607D8B', fontSize: 14 }} />
                  <Typography variant="body2" sx={{ fontWeight: '700', color: '#607D8B', fontSize: '0.85rem' }}>
                    {genderData[3].value}?
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>

        {/* Smoking Status Chart */}
        <Card sx={{ borderRadius: 2, backgroundColor: '#ffffff', flex: 1, minWidth: { xs: '100%', md: 0 } }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: '600', mb: 2, color: '#111827' }}>
                Smoking Status Distribution
              </Typography>
              <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                <ResponsiveContainer width="100%" height={150}>
                  <PieChart>
                    <Pie
                      data={smokingData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={70}
                      paddingAngle={5}
                      dataKey="value"
                      label={false}
                    >
                      {smokingData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-around', pt: 1, borderTop: '1px solid #f0f0f0' }}>
                <Box sx={{ textAlign: 'center' }}>
                  <SmokingRooms sx={{ color: '#FF5722', fontSize: 18, mb: 0.5 }} />
                  <Typography variant="body2" sx={{ fontWeight: '600', color: '#FF5722', fontSize: '0.8rem' }}>
                    {smokingData[0].value} Smokers
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#6B7280', fontSize: '0.7rem' }}>
                    {(smokingData[0].value / (smokingData[0].value + smokingData[1].value) * 100).toFixed(1)}%
                  </Typography>
                </Box>
                <Box sx={{ textAlign: 'center' }}>
                  <NoSmoking sx={{ color: '#1976D2', fontSize: 18, mb: 0.5 }} />
                  <Typography variant="body2" sx={{ fontWeight: '600', color: '#1976D2', fontSize: '0.8rem' }}>
                    {smokingData[1].value} Non-Smokers
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#6B7280', fontSize: '0.7rem' }}>
                    {(smokingData[1].value / (smokingData[0].value + smokingData[1].value) * 100).toFixed(1)}%
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
      </Box>

      {/* Recent Activity Section */}
      <Box>
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
    </Box>
  )
}
