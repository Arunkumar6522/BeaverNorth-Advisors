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
  CalendarToday
} from '@mui/icons-material'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import { customAuth } from '../lib/custom-auth'

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
  const [leadsData, setLeadsData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const timePeriods = [
    { value: 'today', label: 'Today', icon: CalendarToday },
    { value: 'week', label: 'This Week', icon: CalendarToday },
    { value: 'month', label: 'This Month', icon: CalendarToday },
  ]

  // Fetch leads data
  useEffect(() => {
    const fetchLeadsData = async () => {
      try {
        const { supabase } = await import('../lib/supabase')
        const { data, error } = await supabase
          .from('leads')
          .select('*')
          .is('deleted_at', null)

        if (error) {
          console.error('❌ Error fetching leads:', error)
          return
        }

        if (data) {
          console.log('✅ Leads fetched:', data)
          setLeadsData(data)
        }
      } catch (error) {
        console.error('❌ Error fetching leads:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchLeadsData()
  }, [])

  const getStatsForPeriod = (period: string) => {
    const now = new Date()
    let startDate: Date

    switch (period) {
      case 'today':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate())
        break
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        break
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1)
        break
      default:
        startDate = new Date(now.getFullYear(), now.getMonth(), 1)
    }

    const filteredLeads = leadsData.filter(lead => {
      const leadDate = new Date(lead.created_at)
      return leadDate >= startDate
    })

    const total = filteredLeads.length
    const newLeads = filteredLeads.filter(lead => lead.status === 'new').length
    const contacted = filteredLeads.filter(lead => lead.status === 'contacted').length
    const converted = filteredLeads.filter(lead => lead.status === 'converted').length

    return { total, newLeads, contacted, converted }
  }

  const stats = getStatsForPeriod(timePeriod)

  const smokingData = React.useMemo(() => {
    const smokers = leadsData.filter(lead => lead.smoking_status === 'smoker').length
    const nonSmokers = leadsData.filter(lead => lead.smoking_status === 'non-smoker').length
    
    return [
      { name: 'Smokers', value: smokers, color: '#EF4444' },
      { name: 'Non-Smokers', value: nonSmokers, color: '#22C55E' }
    ]
  }, [leadsData])

  const genderData = React.useMemo(() => {
    const male = leadsData.filter(lead => lead.gender === 'male').length
    const female = leadsData.filter(lead => lead.gender === 'female').length
    const others = leadsData.filter(lead => lead.gender === 'others').length
    const preferNotToSay = leadsData.filter(lead => lead.gender === 'prefer-not-to-say').length
    
    return [
      { name: 'Male', value: male, color: '#3B82F6' },
      { name: 'Female', value: female, color: '#EC4899' },
      { name: 'Others', value: others, color: '#9C27B0' },
      { name: 'Prefer not to say', value: preferNotToSay, color: '#607D8B' }
    ]
  }, [leadsData])

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <Box sx={{ 
          bgcolor: 'white', 
          p: 2, 
          borderRadius: 1, 
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          border: '1px solid #E5E7EB'
        }}>
          <Typography variant="body2" sx={{ fontWeight: '600', color: '#111827' }}>
            {payload[0].name}: {payload[0].value}
          </Typography>
        </Box>
      )
    }
    return null
  }

  if (loading) {
    return (
      <Box sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography>Loading dashboard...</Typography>
      </Box>
    )
  }

  return (
    <Box sx={{ height: '100%', overflow: 'auto', px: 1 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#111827', mb: 1 }}>
          Welcome back, {customAuth.getCurrentUser()?.username || 'Admin'}! 👋
        </Typography>
        <Typography variant="body1" sx={{ color: '#6B7280' }}>
          Here's what's happening with your leads today
        </Typography>
      </Box>

      {/* Time Period Selector */}
      <Box sx={{ mb: 4 }}>
        <FormControl size="small" sx={{ minWidth: 200 }}>
          <Select
            value={timePeriod}
            onChange={(e) => setTimePeriod(e.target.value)}
            sx={{ 
              bgcolor: 'white',
              borderRadius: 2,
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: '#E5E7EB'
              }
            }}
          >
            {timePeriods.map((period) => (
              <MenuItem key={period.value} value={period.value}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <period.icon sx={{ fontSize: 18, color: '#6B7280' }} />
                  {period.label}
                </Box>
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Stats Cards */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 3, mb: 4 }}>
        <StatCard
          title="Total Leads"
          value={stats.total}
          icon={<People sx={{ fontSize: 28 }} />}
          color="#3B82F6"
        />
        <StatCard
          title="New Leads"
          value={stats.newLeads}
          icon={<TrendingUp sx={{ fontSize: 28 }} />}
          color="#22C55E"
        />
        <StatCard
          title="Contacted"
          value={stats.contacted}
          icon={<Phone sx={{ fontSize: 28 }} />}
          color="#F59E0B"
        />
        <StatCard
          title="Converted"
          value={stats.converted}
          icon={<CheckCircleOutline sx={{ fontSize: 28 }} />}
          color="#8B5CF6"
        />
      </Box>

      {/* Charts Row */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 3, mb: 4 }}>
        {/* Smoking Status Chart */}
        <Card sx={{ borderRadius: 2, backgroundColor: '#ffffff' }}>
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: '600', mb: 3, color: '#111827' }}>
              Smoking Status Distribution
            </Typography>
            <Box sx={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={smokingData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {smokingData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 2 }}>
              {smokingData.map((item, index) => {
                const total = smokingData.reduce((sum, d) => sum + d.value, 0)
                const percentage = total > 0 ? Math.round((item.value / total) * 100) : 0
                return (
                  <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ width: 12, height: 12, bgcolor: item.color, borderRadius: '50%' }} />
                    <Typography variant="body2" sx={{ fontSize: '0.85rem' }}>
                      {item.name}: {item.value} ({percentage}%)
                    </Typography>
                  </Box>
                )
              })}
            </Box>
          </CardContent>
        </Card>

        {/* Gender Distribution Chart */}
        <Card sx={{ borderRadius: 2, backgroundColor: '#ffffff' }}>
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: '600', mb: 3, color: '#111827' }}>
              Gender Distribution
            </Typography>
            <Box sx={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={genderData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {genderData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mt: 2, flexWrap: 'wrap' }}>
              {genderData.map((item, index) => {
                const total = genderData.reduce((sum, d) => sum + d.value, 0)
                const percentage = total > 0 ? Math.round((item.value / total) * 100) : 0
                return (
                  <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Box sx={{ width: 10, height: 10, bgcolor: item.color, borderRadius: '50%' }} />
                    <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>
                      {item.name}: {item.value} ({percentage}%)
                    </Typography>
                  </Box>
                )
              })}
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  )
}