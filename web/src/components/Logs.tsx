import { useState, useEffect } from 'react'
import { Box, Card, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Avatar } from '@mui/material'
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, Info as InfoIcon } from '@mui/icons-material'

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

  useEffect(() => {
    fetchLogs()
  }, [])

  const fetchLogs = async () => {
    try {
      const { supabase } = await import('../lib/supabase')
      const { data, error } = await supabase
        .from('activity_log')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100)

      if (error) {
        console.error('❌ Error fetching logs:', error)
        // Fallback to localStorage if table doesn't exist
        if (error.message.includes('relation "activity_log" does not exist')) {
          console.log('📱 Using localStorage fallback for logs')
          const tempActivities = JSON.parse(localStorage.getItem('temp_activities') || '[]')
          setLogs(tempActivities)
        }
      } else if (data) {
        setLogs(data)
      }
    } catch (error) {
      console.error('❌ Error fetching logs:', error)
      // Fallback to localStorage
      const tempActivities = JSON.parse(localStorage.getItem('temp_activities') || '[]')
      setLogs(tempActivities)
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
        <Typography>Loading logs...</Typography>
      </Box>
    )
  }

  return (
    <Box sx={{ height: '100%', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Box sx={{ px: 1, py: 2, flexShrink: 0 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#111827', mb: 1 }}>
          Activity Logs
        </Typography>
        <Typography variant="body1" sx={{ color: '#6B7280' }}>
          Complete audit trail of all system activities
        </Typography>
      </Box>

      {/* Logs Table */}
      <Box sx={{ flex: 1, overflow: 'hidden', px: 1 }}>
        {logs.length === 0 ? (
          <Card sx={{ borderRadius: 2, backgroundColor: '#ffffff', p: 4, textAlign: 'center' }}>
            <Typography variant="h6" sx={{ color: '#6B7280', mb: 2 }}>
              No activity logs found
            </Typography>
            <Typography variant="body2" sx={{ color: '#9CA3AF' }}>
              Activity logs will appear here as users interact with the system.
            </Typography>
          </Card>
        ) : (
          <Card sx={{ borderRadius: 2, backgroundColor: '#ffffff', height: '100%' }}>
            <TableContainer sx={{ height: '100%', overflow: 'auto', overflowX: 'auto', '&::-webkit-scrollbar': { height: '6px' } }}>
              <Table stickyHeader sx={{ minWidth: 800, width: '100%' }}>
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#F9FAFB' }}>
                    <TableCell sx={{ fontWeight: '600', minWidth: { xs: 120, sm: 150 } }}>Activity</TableCell>
                    <TableCell sx={{ fontWeight: '600', minWidth: { xs: 200, sm: 300 } }}>Description</TableCell>
                    <TableCell sx={{ fontWeight: '600', minWidth: { xs: 100, sm: 120 } }}>Performed By</TableCell>
                    <TableCell sx={{ fontWeight: '600', minWidth: { xs: 100, sm: 120 } }}>Time</TableCell>
                    <TableCell sx={{ fontWeight: '600', display: { xs: 'none', sm: 'table-cell' }, minWidth: 150 }}>Details</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {logs.map((log) => (
                    <TableRow key={log.id} hover>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Avatar sx={{ bgcolor: getActivityColor(log.activity_type), width: 24, height: 24 }}>
                            {getActivityIcon(log.activity_type)}
                          </Avatar>
                          <Chip
                            label={getActivityTypeLabel(log.activity_type)}
                            size="small"
                            sx={{
                              bgcolor: getActivityColor(log.activity_type),
                              color: 'white',
                              fontSize: '11px',
                              height: '20px'
                            }}
                          />
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: '500' }}>
                          {log.description}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ color: '#6B7280' }}>
                          {log.performed_by}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ color: '#6B7280' }}>
                          {formatTimeAgo(log.created_at)}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>
                        {log.old_value && log.new_value && (
                          <Typography variant="caption" sx={{ color: '#9CA3AF' }}>
                            {log.old_value} → {log.new_value}
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
