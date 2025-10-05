import { useState, useEffect } from 'react'
import { Box, Card, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Avatar, CircularProgress, Button, Alert } from '@mui/material'
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, Info as InfoIcon, Person as PersonIcon, Refresh as RefreshIcon } from '@mui/icons-material'

interface ActivityLog {
  id: string
  lead_id: string
  activity_type: 'lead_created' | 'status_changed' | 'lead_deleted'
  description: string
  old_value?: string
  new_value?: string
  performed_by: string
  created_at: string
}

export default function Logs() {
  const [logs, setLogs] = useState<ActivityLog[]>([])
  const [loading, setLoading] = useState(true)
  const [dataSource, setDataSource] = useState<'database' | 'localStorage' | 'none'>('none')

  useEffect(() => {
    fetchLogs()
  }, [])

  const handleRefresh = () => {
    fetchLogs()
  }

  const fetchLogs = async () => {
    setLoading(true)
    try {
      const { supabase } = await import('../lib/supabase')
      console.log('🔍 Fetching ALL activity logs from database...')
      
      const { data, error } = await supabase
        .from('activity_log')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('❌ Error fetching logs:', error)
        console.error('❌ Error details:', error.message, error.details, error.hint)
        
        // Fallback to localStorage if table doesn't exist
        if (error.message.includes('relation "activity_log" does not exist')) {
          console.log('📱 Using localStorage fallback for logs - activity_log table does not exist')
          const tempActivities = JSON.parse(localStorage.getItem('temp_activities') || '[]')
          console.log('📱 Found', tempActivities.length, 'activities in localStorage')
          setLogs(tempActivities)
          setDataSource('localStorage')
        } else {
          console.log('❌ Other database error, trying localStorage fallback')
          const tempActivities = JSON.parse(localStorage.getItem('temp_activities') || '[]')
          setLogs(tempActivities)
          setDataSource('localStorage')
        }
      } else if (data) {
        console.log('✅ Successfully fetched', data.length, 'activities from database')
        console.log('📊 Sample activities:', data.slice(0, 3))
        setLogs(data)
        setDataSource('database')
      } else {
        console.log('⚠️ No data returned from database, checking localStorage')
        const tempActivities = JSON.parse(localStorage.getItem('temp_activities') || '[]')
        setLogs(tempActivities)
        setDataSource('localStorage')
      }
    } catch (error) {
      console.error('❌ Unexpected error fetching logs:', error)
      // Fallback to localStorage
      const tempActivities = JSON.parse(localStorage.getItem('temp_activities') || '[]')
      console.log('📱 Using localStorage fallback due to error:', tempActivities.length, 'activities')
      setLogs(tempActivities)
      setDataSource('localStorage')
    } finally {
      setLoading(false)
    }
  }

  const getActivityIcon = (type: ActivityLog['activity_type']) => {
    switch (type) {
      case 'lead_created': return <AddIcon sx={{ fontSize: 16 }} />
      case 'status_changed': return <EditIcon sx={{ fontSize: 16 }} />
      case 'lead_deleted': return <DeleteIcon sx={{ fontSize: 16 }} />
      default: return <InfoIcon sx={{ fontSize: 16 }} />
    }
  }

  const getActivityColor = (type: ActivityLog['activity_type']) => {
    switch (type) {
      case 'lead_created': return '#4CAF50' // Green
      case 'status_changed': return '#2196F3' // Blue
      case 'lead_deleted': return '#F44336' // Red
      default: return '#9E9E9E' // Grey
    }
  }

  const formatTimeAgo = (isoDate: string) => {
    const date = new Date(isoDate)
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
    
    if (diffInSeconds < 60) return 'Just now'
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
    return `${Math.floor(diffInSeconds / 86400)}d ago`
  }

  const formatDateTime = (isoDate: string) => {
    const date = new Date(isoDate)
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    })
  }

  const getActivityTypeLabel = (type: ActivityLog['activity_type']) => {
    switch (type) {
      case 'lead_created': return 'Lead Created'
      case 'status_changed': return 'Status Changed'
      case 'lead_deleted': return 'Lead Deleted'
      default: return 'Activity'
    }
  }

  if (loading) {
    return (
      <Box sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Box sx={{ textAlign: 'center' }}>
          <CircularProgress sx={{ mb: 2 }} />
          <Typography variant="h6" sx={{ color: '#6B7280' }}>
            Loading activity logs...
          </Typography>
        </Box>
      </Box>
    )
  }

  return (
    <Box sx={{ height: '100vh', overflow: 'hidden', display: 'flex', flexDirection: 'column', backgroundColor: '#F8FAFC' }}>
      {/* Header */}
      <Box sx={{ px: 3, py: 2, flexShrink: 0, backgroundColor: '#ffffff', borderBottom: '1px solid #E5E7EB' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#111827', fontSize: '2rem' }}>
            Activity Logs
          </Typography>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={handleRefresh}
            disabled={loading}
            sx={{
              textTransform: 'none',
              fontSize: '1rem',
              fontWeight: '500',
              borderColor: '#D1D5DB',
              color: '#374151',
              '&:hover': {
                borderColor: '#9CA3AF',
                backgroundColor: '#F9FAFB'
              }
            }}
          >
            Refresh
          </Button>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="body1" sx={{ color: '#6B7280', fontSize: '1.1rem' }}>
            Complete audit trail of all system activities ({logs.length} total activities)
          </Typography>
          {dataSource === 'database' && (
            <Chip label="Database" size="small" color="success" sx={{ fontSize: '0.8rem' }} />
          )}
          {dataSource === 'localStorage' && (
            <Chip label="Local Storage" size="small" color="warning" sx={{ fontSize: '0.8rem' }} />
          )}
        </Box>
        {dataSource === 'localStorage' && (
          <Alert severity="warning" sx={{ mt: 2, fontSize: '0.9rem' }}>
            Activity logs are being loaded from local storage. The activity_log table may not exist in the database. 
            Please run the SQL script in Supabase to create the activity_log table for persistent storage.
          </Alert>
        )}
      </Box>

      {/* Logs Table */}
      <Box sx={{ flex: 1, overflow: 'hidden', px: 3, py: 2 }}>
        {logs.length === 0 ? (
          <Card sx={{ borderRadius: 3, backgroundColor: '#ffffff', p: 6, textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <Typography variant="h5" sx={{ color: '#6B7280', mb: 2, fontSize: '1.5rem' }}>
              No activity logs found
            </Typography>
            <Typography variant="body1" sx={{ color: '#9CA3AF', fontSize: '1.1rem' }}>
              Activity logs will appear here as users interact with the system.
            </Typography>
          </Card>
        ) : (
          <Card sx={{ borderRadius: 3, backgroundColor: '#ffffff', height: '100%', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
            <TableContainer sx={{ height: '100%', overflow: 'auto', overflowX: 'auto', '&::-webkit-scrollbar': { width: '8px', height: '8px' }, '&::-webkit-scrollbar-track': { backgroundColor: '#F1F5F9' }, '&::-webkit-scrollbar-thumb': { backgroundColor: '#CBD5E1', borderRadius: '4px' } }}>
              <Table stickyHeader sx={{ minWidth: 1400, width: '100%' }}>
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#F8FAFC' }}>
                    <TableCell sx={{ fontWeight: '700', minWidth: 180, fontSize: '1rem', py: 2, borderBottom: '2px solid #E5E7EB' }}>Activity Type</TableCell>
                    <TableCell sx={{ fontWeight: '700', minWidth: 400, fontSize: '1rem', py: 2, borderBottom: '2px solid #E5E7EB' }}>Description</TableCell>
                    <TableCell sx={{ fontWeight: '700', minWidth: 150, fontSize: '1rem', py: 2, borderBottom: '2px solid #E5E7EB' }}>Performed By</TableCell>
                    <TableCell sx={{ fontWeight: '700', minWidth: 120, fontSize: '1rem', py: 2, borderBottom: '2px solid #E5E7EB' }}>Time Ago</TableCell>
                    <TableCell sx={{ fontWeight: '700', minWidth: 200, fontSize: '1rem', py: 2, borderBottom: '2px solid #E5E7EB' }}>Date & Time</TableCell>
                    <TableCell sx={{ fontWeight: '700', minWidth: 250, fontSize: '1rem', py: 2, borderBottom: '2px solid #E5E7EB' }}>Changes</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {logs.map((log) => (
                    <TableRow key={log.id} hover sx={{ '&:hover': { backgroundColor: '#F8FAFC' } }}>
                      <TableCell sx={{ py: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <Avatar sx={{ bgcolor: getActivityColor(log.activity_type), width: 36, height: 36 }}>
                            {getActivityIcon(log.activity_type)}
                          </Avatar>
                          <Chip
                            label={getActivityTypeLabel(log.activity_type)}
                            size="medium"
                            sx={{
                              bgcolor: getActivityColor(log.activity_type),
                              color: 'white',
                              fontSize: '0.9rem',
                              height: '28px',
                              fontWeight: '600'
                            }}
                          />
                        </Box>
                      </TableCell>
                      <TableCell sx={{ py: 2 }}>
                        <Typography variant="body1" sx={{ fontWeight: '500', lineHeight: 1.5, fontSize: '1rem' }}>
                          {log.description}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ py: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <PersonIcon sx={{ fontSize: 20, color: '#6B7280' }} />
                          <Typography variant="body1" sx={{ color: '#6B7280', fontWeight: '500', fontSize: '1rem' }}>
                            {log.performed_by}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell sx={{ py: 2 }}>
                        <Typography variant="body1" sx={{ color: '#6B7280', fontWeight: '500', fontSize: '1rem' }}>
                          {formatTimeAgo(log.created_at)}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ py: 2 }}>
                        <Typography variant="body1" sx={{ color: '#6B7280', fontSize: '0.95rem' }}>
                          {formatDateTime(log.created_at)}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ py: 2 }}>
                        {log.old_value && log.new_value ? (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <Chip
                              label={log.old_value}
                              size="small"
                              variant="outlined"
                              sx={{ fontSize: '0.85rem', height: '24px', fontWeight: '500' }}
                            />
                            <Typography variant="body1" sx={{ color: '#6B7280', fontWeight: '600' }}>
                              →
                            </Typography>
                            <Chip
                              label={log.new_value}
                              size="small"
                              sx={{ 
                                fontSize: '0.85rem', 
                                height: '24px',
                                bgcolor: '#E3F2FD',
                                color: '#1976D2',
                                fontWeight: '500'
                              }}
                            />
                          </Box>
                        ) : (
                          <Typography variant="body1" sx={{ color: '#9CA3AF', fontSize: '0.95rem' }}>
                            No changes
                          </Typography>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        )}
      </Box>
    </Box>
  )
}
