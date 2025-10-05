import React, { useState, useEffect } from 'react'
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  Avatar,
  FormControl,
  Select,
  MenuItem,
  IconButton,
  Tooltip as MuiTooltip
} from '@mui/material'
import { 
  TrendingUp, 
  People, 
  Phone, 
  CheckCircleOutline,
  CalendarToday
} from '@mui/icons-material'
import { Handshake } from '@mui/icons-material'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { customAuth } from '../lib/custom-auth'

interface StatCardProps {
  title: string
  value: string | number
  icon: React.ReactNode
  color: string
  change?: string
  onClick?: () => void
}

function StatCard({ title, value, icon, color, change, onClick }: StatCardProps) {
  return (
    <Card 
      sx={{ 
        borderRadius: 2, 
        backgroundColor: '#ffffff', 
        elevation: 0,
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.2s ease',
        '&:hover': onClick ? {
          transform: 'translateY(-2px)',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
        } : {}
      }}
      onClick={onClick}
    >
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
  const navigate = useNavigate()
  const [timePeriod, setTimePeriod] = useState('month')
  const [leadsData, setLeadsData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [inactiveGender, setInactiveGender] = useState<Set<string>>(new Set())
  // For smoking chart: keep a single active category; others are dimmed
  const [activeSmoking, setActiveSmoking] = useState<string | null>(null)

  const timePeriods = [
    { value: 'today', label: 'Today', icon: CalendarToday },
    { value: 'week', label: 'This Week', icon: CalendarToday },
    { value: 'month', label: 'This Month', icon: CalendarToday },
  ]

  // Fetch leads data
  useEffect(() => {
    const fetchLeadsData = async () => {
      try {
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
      {/* Header row: Welcome on left, period dropdown on right */}
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#111827' }}>
            Welcome, {customAuth.getCurrentUser()?.username || 'Admin'}
          </Typography>
          <MuiTooltip title="Welcome">
            <IconButton size="large" sx={{ color: '#1E377C' }}>
              <Handshake />
            </IconButton>
          </MuiTooltip>
        </Box>
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
          onClick={() => navigate('/leads')}
        />
        <StatCard
          title="New Leads"
          value={stats.newLeads}
          icon={<TrendingUp sx={{ fontSize: 28 }} />}
          color="#22C55E"
          onClick={() => navigate('/leads?filter=new')}
        />
        <StatCard
          title="Contacted"
          value={stats.contacted}
          icon={<Phone sx={{ fontSize: 28 }} />}
          color="#F59E0B"
          onClick={() => navigate('/leads?filter=contacted')}
        />
        <StatCard
          title="Converted"
          value={stats.converted}
          icon={<CheckCircleOutline sx={{ fontSize: 28 }} />}
          color="#8B5CF6"
          onClick={() => navigate('/leads?tab=closed')}
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
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.color}
                        fillOpacity={activeSmoking === null || activeSmoking === entry.name ? 1 : 0.25}
                        onClick={() => {
                          setActiveSmoking(curr => (curr === entry.name ? null : entry.name))
                        }}
                        style={{ cursor: 'pointer' }}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    content={({ active, payload }) => {
                      if (!active || !payload || (payload as any[]).length === 0) return null
                      const name = (payload as any[])[0]?.name as string
                      if (activeSmoking !== null && name !== activeSmoking) return null
                      return <CustomTooltip />
                    }}
                  />
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
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.color}
                        fillOpacity={inactiveGender.has(entry.name) ? 0.25 : 1}
                        onClick={() => {
                          setInactiveGender(prev => {
                            const next = new Set(Array.from(prev))
                            if (next.has(entry.name)) {
                              next.delete(entry.name)
                            } else {
                              next.add(entry.name)
                            }
                            return next
                          })
                        }}
                        style={{ cursor: 'pointer' }}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    content={({ active, payload }) => {
                      if (!active || !payload || (payload as any[]).length === 0) return null
                      const name = (payload as any[])[0]?.name as string
                      if (inactiveGender.has(name)) return null
                      return <CustomTooltip />
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mt: 2, flexWrap: 'wrap' }}>
              {genderData.map((item, index) => {
                const total = genderData.reduce((sum, d) => sum + d.value, 0)
                const percentage = total > 0 ? Math.round((item.value / total) * 100) : 0
                return (
                  <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 0.5, opacity: inactiveGender.has(item.name) ? 0.5 : 1 }}>
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