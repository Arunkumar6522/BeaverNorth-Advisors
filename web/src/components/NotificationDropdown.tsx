import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Box, 
  IconButton, 
  Popover, 
  Typography, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemIcon,
  Avatar,
  Divider,
  Chip,
  Button
} from '@mui/material'
import { 
  Notifications as NotificationsIcon,
  PersonAdd as PersonAddIcon,
  Update as UpdateIcon,
  Delete as DeleteIcon,
  CheckCircle as CheckCircleIcon,
  OpenInNew as MaximizeIcon
} from '@mui/icons-material'

interface ActivityLog {
  id: string
  activity_type: string
  description: string
  old_value?: string
  new_value?: string
  performed_by: string
  created_at: string
}

interface NotificationDropdownProps {
  isAuthenticated?: boolean
  color?: string
}

export default function NotificationDropdown({ isAuthenticated = false, color = '#6983CC' }: NotificationDropdownProps) {
  const navigate = useNavigate()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [recentActivity, setRecentActivity] = useState<ActivityLog[]>([])
  const [loading, setLoading] = useState(false)

  const open = Boolean(anchorEl)

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
    if (isAuthenticated) {
      fetchRecentActivity()
    }
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const fetchRecentActivity = async () => {
    if (loading) return
    setLoading(true)
    
    try {
      // Try to fetch from Supabase first
      const { supabase } = await import('../lib/supabase')
      const { data, error } = await supabase
        .from('activity_log')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5)

      if (error) {
        console.error('❌ Error fetching activity:', error)
        
        // Fallback to localStorage
        if (error.message.includes('relation "activity_log" does not exist')) {
          const tempActivities = JSON.parse(localStorage.getItem('temp_activities') || '[]')
          setRecentActivity(tempActivities.slice(0, 5))
        }
      } else if (data) {
        setRecentActivity(data)
      } else {
        // Fallback to localStorage
        const tempActivities = JSON.parse(localStorage.getItem('temp_activities') || '[]')
        setRecentActivity(tempActivities.slice(0, 5))
      }
    } catch (error) {
      console.error('❌ Error fetching activity:', error)
      // Fallback to localStorage
      const tempActivities = JSON.parse(localStorage.getItem('temp_activities') || '[]')
      setRecentActivity(tempActivities.slice(0, 5))
    }
    
    setLoading(false)
  }

  const getActivityIcon = (activityType: string) => {
    switch (activityType) {
      case 'lead_created':
        return <PersonAddIcon sx={{ fontSize: 16, color: '#22C55E' }} />
      case 'status_changed':
        return <UpdateIcon sx={{ fontSize: 16, color: '#3B82F6' }} />
      case 'lead_deleted':
        return <DeleteIcon sx={{ fontSize: 16, color: '#EF4444' }} />
      default:
        return <CheckCircleIcon sx={{ fontSize: 16, color: '#6B7280' }} />
    }
  }

  const getActivityColor = (activityType: string) => {
    switch (activityType) {
      case 'lead_created':
        return '#22C55E'
      case 'status_changed':
        return '#3B82F6'
      case 'lead_deleted':
        return '#EF4444'
      default:
        return '#6B7280'
    }
  }

  const formatTimeAgo = (dateString: string) => {
    const now = new Date()
    const date = new Date(dateString)
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
    
    if (diffInSeconds < 60) return 'Just now'
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
    return `${Math.floor(diffInSeconds / 86400)}d ago`
  }

  return (
    <>
      <IconButton
        onClick={handleClick}
        sx={{
          color: color,
          '&:hover': {
            backgroundColor: 'rgba(0,0,0,0.1)'
          }
        }}
      >
        <NotificationsIcon />
        {isAuthenticated && recentActivity.length > 0 && (
          <Chip
            label={recentActivity.length}
            size="small"
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              height: 16,
              minWidth: 16,
              fontSize: '0.7rem',
              backgroundColor: '#EF4444',
              color: 'white'
            }}
          />
        )}
      </IconButton>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        sx={{
          '& .MuiPopover-paper': {
            width: 320,
            maxHeight: 400,
            borderRadius: 2,
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
          }
        }}
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
            Recent Activity
          </Typography>
          
          {!isAuthenticated ? (
            <Typography variant="body2" sx={{ color: '#6B7280', textAlign: 'center', py: 2 }}>
              Please log in to view notifications
            </Typography>
          ) : loading ? (
            <Typography variant="body2" sx={{ color: '#6B7280', textAlign: 'center', py: 2 }}>
              Loading...
            </Typography>
          ) : recentActivity.length === 0 ? (
            <Typography variant="body2" sx={{ color: '#6B7280', textAlign: 'center', py: 2 }}>
              No recent activity
            </Typography>
          ) : (
            <List sx={{ p: 0 }}>
              {recentActivity.map((activity, index) => (
                <Box key={activity.id}>
                  <ListItem sx={{ px: 0, py: 1 }}>
                    <ListItemIcon sx={{ minWidth: 32 }}>
                      <Avatar 
                        sx={{ 
                          width: 24, 
                          height: 24, 
                          bgcolor: getActivityColor(activity.activity_type),
                          fontSize: '0.7rem'
                        }}
                      >
                        {getActivityIcon(activity.activity_type)}
                      </Avatar>
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography variant="body2" sx={{ fontWeight: 500, fontSize: '0.85rem' }}>
                          {activity.description}
                        </Typography>
                      }
                      secondary={
                        <Typography variant="caption" sx={{ color: '#6B7280' }}>
                          {formatTimeAgo(activity.created_at)}
                        </Typography>
                      }
                    />
                  </ListItem>
                  {index < recentActivity.length - 1 && <Divider />}
                </Box>
              ))}
            </List>
          )}
          
          {/* Maximize Button */}
          {isAuthenticated && recentActivity.length > 0 && (
            <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid #E5E7EB' }}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<MaximizeIcon />}
                onClick={() => {
                  handleClose()
                  navigate('/logs')
                }}
                sx={{
                  textTransform: 'none',
                  fontSize: '0.85rem',
                  fontWeight: 500,
                  borderColor: '#D1D5DB',
                  color: '#374151',
                  '&:hover': {
                    borderColor: '#9CA3AF',
                    backgroundColor: '#F9FAFB'
                  }
                }}
              >
                View All Logs
              </Button>
            </Box>
          )}
        </Box>
      </Popover>
    </>
  )
}
