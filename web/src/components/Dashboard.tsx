import React, { useState, useEffect } from 'react'
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

interface ActivityLog {
  id: string
  activity_type: string
  description: string
  created_at: string
  new_value?: string
}

export default function Dashboard() {
  const [timePeriod, setTimePeriod] = useState('month')
  const [recentActivity, setRecentActivity] = useState<ActivityLog[]>([])
  const [leadsData, setLeadsData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const timePeriods = [
    { value: 'today', label: 'Today', icon: CalendarToday },
    { value: 'week', label: 'This Week', icon: CalendarToday },
    { value: 'month', label: 'This Month', icon: CalendarToday },
    { value: 'year', label: 'This Year', icon: CalendarToday }
  ]

  // Fetch leads data from Supabase
  useEffect(() => {
    const fetchLeadsData = async () => {
      try {
        console.log('🔄 Fetching leads data for dashboard...')
        const { supabase } = await import('../lib/supabase')
        
        const { data, error } = await supabase
          .from('leads')
          .select('*')
          .is('deleted_at', null) // Only active leads
          .order('created_at', { ascending: false })

        if (error) {
          console.error('❌ Error fetching leads:', error)
          return
        }

        if (data) {
          console.log('✅ Leads data fetched:', data.length, 'leads')
          setLeadsData(data)
        }
        setLoading(false)
      } catch (error) {
        console.error('❌ Error fetching leads data:', error)
        setLoading(false)
      }
    }

    fetchLeadsData()
  }, [])

  // Calculate stats based on time period and real data
  const getStatsForPeriod = (period: string, leads: any[]) => {
    const now = new Date()
    let filteredLeads = leads

    if (period === 'today') {
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      filteredLeads = leads.filter(lead => new Date(lead.created_at) >= today)
    } else if (period === 'week') {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      filteredLeads = leads.filter(lead => new Date(lead.created_at) >= weekAgo)
    } else if (period === 'month') {
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
      filteredLeads = leads.filter(lead => new Date(lead.created_at) >= monthAgo)
    } else if (period === 'year') {
      const yearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000)
      filteredLeads = leads.filter(lead => new Date(lead.created_at) >= yearAgo)
    }

    const total = filteredLeads.length
    const newLeads = filteredLeads.filter(lead => lead.status === 'new').length
    const contacted = filteredLeads.filter(lead => lead.status === 'contacted').length
    const converted = filteredLeads.filter(lead => lead.status === 'converted').length

    return { total, new: newLeads, contacted, converted }
  }

  const currentStats = getStatsForPeriod(timePeriod, leadsData)

  const stats = [
    {
      title: 'Total Leads',
      value: currentStats.total,
      icon: <People />,
      color: '#1976D2',
      change: '+0%' // Could calculate actual change if needed
    },
    {
      title: 'New Leads',
      value: currentStats.new,
      icon: <TrendingUp />,
      color: '#1976D2',
      change: '+0%'
    },
    {
      title: 'Contacted',
      value: currentStats.contacted,
      icon: <Phone />,
      color: '#1976D2',
      change: '+0%'
    },
    {
      title: 'Converted',
      value: currentStats.converted,
      icon: <CheckCircleOutline />,
      color: '#1976D2',
      change: '+0%'
    }
  ]

  // Calculate smoking status data from real leads
  const smokingData = React.useMemo(() => {
    const smokers = leadsData.filter(lead => lead.smoking_status === 'smoker').length
    const nonSmokers = leadsData.filter(lead => lead.smoking_status === 'non-smoker').length
    
    return [
      { name: 'Smokers', value: smokers, color: '#FF5722' },
      { name: 'Non-Smokers', value: nonSmokers, color: '#1976D2' }
    ]
  }, [leadsData])

  // Calculate gender data from real leads
  const genderData = React.useMemo(() => {
    const male = leadsData.filter(lead => lead.gender === 'male').length
    const female = leadsData.filter(lead => lead.gender === 'female').length
    const others = leadsData.filter(lead => lead.gender === 'others').length
    const preferNotToSay = leadsData.filter(lead => lead.gender === 'prefer-not-to-say').length
    
    return [
      { name: 'Male', value: male, color: '#2196F3' },
      { name: 'Female', value: female, color: '#E91E63' },
      { name: 'Others', value: others, color: '#9C27B0' },
      { name: 'Prefer not to say', value: preferNotToSay, color: '#607D8B' }
    ]
  }, [leadsData])

  // Fetch recent activity from Supabase
  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const { supabase } = await import('../lib/supabase')
        const { data, error } = await supabase
          .from('activity_log')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(10)

        if (error) {
          console.error('❌ Error fetching activity:', error)
          return
        }

        if (data) {
          console.log('✅ Activity fetched:', data)
          setRecentActivity(data)
        }
      } catch (error) {
        console.error('❌ Error fetching activity:', error)
      }
    }

    fetchActivity()
  }, [])

  // Refresh data when time period changes
  useEffect(() => {
    if (leadsData.length > 0) {
      console.log('📊 Time period changed to:', timePeriod)
      console.log('📊 Current stats:', getStatsForPeriod(timePeriod, leadsData))
    }
  }, [timePeriod, leadsData])

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'lead_created':
        return <People sx={{ fontSize: 20 }} />
      case 'status_changed':
        return <TrendingUp sx={{ fontSize: 20 }} />
      case 'lead_deleted':
        return <CheckCircleOutline sx={{ fontSize: 20 }} />
      case 'contact_made':
        return <Phone sx={{ fontSize: 20 }} />
      default:
        return <People sx={{ fontSize: 20 }} />
    }
  }

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'lead_created':
        return '#22C55E'
      case 'status_changed':
        return '#3B82F6'
      case 'lead_deleted':
        return '#EF4444'
      case 'contact_made':
        return '#F59E0B'
      default:
        return '#6B7280'
    }
  }

  const formatTimeAgo = (dateString: string) => {
    const now = new Date()
    const then = new Date(dateString)
    const diffMs = now.getTime() - then.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`
  }

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

  if (loading) {
    return (
      <Box sx={{ height: '100%', overflow: 'auto', px: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography variant="h6" sx={{ color: '#6B7280' }}>
          Loading dashboard data...
        </Typography>
      </Box>
    )
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
            {recentActivity.length === 0 ? (
              <Typography variant="body2" sx={{ color: '#6B7280', textAlign: 'center', py: 4 }}>
                No recent activity yet
              </Typography>
            ) : (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {recentActivity.map((activity) => (
                  <Box key={activity.id} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{ bgcolor: getActivityColor(activity.activity_type), width: 32, height: 32 }}>
                      {getActivityIcon(activity.activity_type)}
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body1" sx={{ fontWeight: '500' }}>
                        {activity.description}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#6B7280' }}>
                        {activity.new_value && `${activity.new_value} - `}{formatTimeAgo(activity.created_at)}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            )}
          </CardContent>
          </Card>
      </Box>
    </Box>
  )
}
