import { useState, useEffect } from 'react'
import {
  Box,
  Card,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Avatar,
  Button,
  Pagination
} from '@mui/material'
import {
  Refresh as RefreshIcon,
  Person as PersonIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon
} from '@mui/icons-material'
import { supabase } from '../lib/supabase'

interface ActivityLog {
  id: string
  activity_type: string
  description: string
  performed_by: string
  created_at: string
  old_value?: string
  new_value?: string
}

export default function Logs() {
  const [logs, setLogs] = useState<ActivityLog[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1) // 1-based for MUI Pagination
  const [rowsPerPage] = useState(10)
  // data source indicator removed from UI; no state needed

  const fetchLogs = async () => {
    setLoading(true)
    try {
      console.log('🔄 Fetching activity logs from Supabase...')
      const { data, error } = await supabase
        .from('activity_log')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('❌ Error fetching activity logs:', error)
        // Fallback to localStorage
        const localLogs = JSON.parse(localStorage.getItem('temp_activities') || '[]')
        setLogs(localLogs)
        // no UI indicator
      } else {
        console.log('📊 Activity logs data:', data)
        setLogs(data || [])
      }
    } catch (error) {
      console.error('❌ Error fetching activity logs:', error)
      // Fallback to localStorage
      const localLogs = JSON.parse(localStorage.getItem('temp_activities') || '[]')
      setLogs(localLogs)
      // no UI indicator
    } finally {
      setLoading(false)
    }
  }

  const handleRefresh = () => {
    fetchLogs()
  }

  useEffect(() => {
    fetchLogs()
  }, [])

  const getActivityIcon = (activityType: string) => {
    switch (activityType) {
      case 'lead_created': return <AddIcon />
      case 'lead_updated': return <EditIcon />
      case 'lead_deleted': return <DeleteIcon />
      case 'lead_viewed': return <ViewIcon />
      default: return <PersonIcon />
    }
  }

  const getActivityColor = (activityType: string) => {
    switch (activityType) {
      case 'lead_created': return '#10B981'
      case 'lead_updated': return '#F59E0B'
      case 'lead_deleted': return '#EF4444'
      case 'lead_viewed': return '#3B82F6'
      default: return '#6B7280'
    }
  }

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (diffInSeconds < 60) return 'Just now'
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
    return `${Math.floor(diffInSeconds / 86400)}d ago`
  }

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getActivityTypeLabel = (activityType: string) => {
    switch (activityType) {
      case 'lead_created': return 'Created'
      case 'lead_updated': return 'Updated'
      case 'lead_deleted': return 'Deleted'
      case 'lead_viewed': return 'Viewed'
      default: return 'Activity'
    }
  }

  return (
    <Box sx={{ height: '100%', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      {/* Actions */}
      <Box sx={{ px: 1, py: 1, flexShrink: 0 }}>
        <Button
          variant="outlined"
          size="medium"
          startIcon={<RefreshIcon />}
          sx={{
            borderColor: '#1976D2',
            color: '#1976D2',
            fontSize: '1rem',
            py: 1.5,
            px: 3,
            '&:hover': {
              borderColor: '#1976D2',
              backgroundColor: '#f0f4ff'
            }
          }}
          onClick={handleRefresh}
          disabled={loading}
        >
          Refresh
        </Button>
        {/* Data source chips removed as requested */}
      </Box>

      {/* Logs Table */}
      <Box sx={{ flex: 1, overflow: 'hidden', px: 1 }}>
        {logs.length === 0 ? (
          <Card sx={{ borderRadius: 2, backgroundColor: '#ffffff', p: 4, textAlign: 'center' }}>
            <Typography variant="h6" sx={{ color: '#666666', mb: 2 }}>
              No Activity Logs
            </Typography>
            <Typography variant="body2" sx={{ color: '#999999' }}>
              All system activities will appear here once they start occurring.
            </Typography>
          </Card>
        ) : (
          <Card sx={{ borderRadius: 2, backgroundColor: '#ffffff', height: '100%' }}>
            <TableContainer sx={{ height: '100%', overflow: 'auto', overflowX: 'auto', '&::-webkit-scrollbar': { height: '6px' } }}>
              <Table stickyHeader sx={{ minWidth: 1000, width: '100%' }}>
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#F9FAFB' }}>
                    <TableCell sx={{ fontWeight: '600', minWidth: 180 }}>Activity Type</TableCell>
                    <TableCell sx={{ fontWeight: '600', minWidth: 400 }}>Description</TableCell>
                    <TableCell sx={{ fontWeight: '600', minWidth: 150 }}>Performed By</TableCell>
                    <TableCell sx={{ fontWeight: '600', minWidth: 120 }}>Time Ago</TableCell>
                    <TableCell sx={{ fontWeight: '600', display: { xs: 'none', md: 'table-cell' }, minWidth: 200 }}>Date & Time</TableCell>
                    <TableCell sx={{ fontWeight: '600', display: { xs: 'none', sm: 'table-cell' }, minWidth: 250 }}>Changes</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {logs
                    .slice((page - 1) * rowsPerPage, (page - 1) * rowsPerPage + rowsPerPage)
                    .map((log) => (
                    <TableRow key={log.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                      <TableCell>
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
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: '500', lineHeight: 1.5 }}>
                          {log.description}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <PersonIcon sx={{ fontSize: 20, color: '#6B7280' }} />
                          <Typography variant="body2" sx={{ color: '#6B7280', fontWeight: '500' }}>
                            {log.performed_by}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ color: '#6B7280', fontWeight: '500' }}>
                          {formatTimeAgo(log.created_at)}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>
                        <Typography variant="body2" sx={{ color: '#6B7280', fontSize: '0.95rem' }}>
                          {formatDateTime(log.created_at)}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>
                        {log.old_value && log.new_value ? (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <Chip
                              label={log.old_value}
                              size="small"
                              variant="outlined"
                              sx={{ fontSize: '0.85rem', height: '24px', fontWeight: '500' }}
                            />
                            <Typography variant="body2" sx={{ color: '#6B7280', fontWeight: '600' }}>
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
                          <Typography variant="body2" sx={{ color: '#9CA3AF', fontSize: '0.95rem' }}>
                            No changes
                          </Typography>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            {/* Pagination Controls */}
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
              <Pagination
                count={Math.max(1, Math.ceil(logs.length / rowsPerPage))}
                page={page}
                onChange={(_e, value) => setPage(value)}
                showFirstButton
                showLastButton
                color="primary"
              />
            </Box>
          </Card>
        )}
      </Box>
    </Box>
  )
}