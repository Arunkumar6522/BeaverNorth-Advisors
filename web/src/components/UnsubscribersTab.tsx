import { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  Button,
  Card,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip
} from '@mui/material'
import {
  Delete as DeleteIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material'

interface Unsubscriber {
  id: string
  email: string
  name?: string
  category_name?: string
  reason?: string
  unsubscribed_at: string
}

interface UnsubscribersTabProps {
  formatDate: (dateString: string) => string
}

export default function UnsubscribersTab({ formatDate }: UnsubscribersTabProps) {
  const [unsubscribers, setUnsubscribers] = useState<Unsubscriber[]>([])
  const [loading, setLoading] = useState(false)

  const fetchUnsubscribers = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/unsubscribers')
      const result = await response.json()
      if (result.success) {
        setUnsubscribers(result.data || [])
      } else {
        console.error('Failed to fetch unsubscribers:', result.message)
      }
    } catch (error) {
      console.error('Error fetching unsubscribers:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUnsubscribers()
  }, [])

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this unsubscriber record?')) {
      return
    }

    try {
      const response = await fetch(`/api/unsubscribers/${id}`, {
        method: 'DELETE'
      })
      const result = await response.json()
      if (result.success) {
        setUnsubscribers(unsubscribers.filter(u => u.id !== id))
        alert('Unsubscriber deleted successfully')
      } else {
        alert('Failed to delete unsubscriber: ' + result.message)
      }
    } catch (error) {
      console.error('Error deleting unsubscriber:', error)
      alert('Failed to delete unsubscriber')
    }
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="body2" sx={{ color: '#6B7280' }}>
          Total Unsubscribers: {unsubscribers.length}
        </Typography>
        <Button
          size="small"
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={fetchUnsubscribers}
          disabled={loading}
        >
          Refresh
        </Button>
      </Box>
      
      {unsubscribers.length === 0 ? (
        <Card sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" sx={{ color: '#6B7280', mb: 2 }}>
            No Unsubscribers
          </Typography>
          <Typography variant="body2" sx={{ color: '#9CA3AF' }}>
            Users who unsubscribe will appear here.
          </Typography>
        </Card>
      ) : (
        <TableContainer component={Card}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: '#F9FAFB' }}>
                <TableCell sx={{ fontWeight: 600 }}>Email</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Category</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Reason</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Unsubscribed At</TableCell>
                <TableCell sx={{ fontWeight: 600 }} align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {unsubscribers.map((unsub) => (
                <TableRow key={unsub.id} hover>
                  <TableCell>{unsub.email}</TableCell>
                  <TableCell>{unsub.name || '-'}</TableCell>
                  <TableCell>
                    {unsub.category_name ? (
                      <Chip 
                        label={unsub.category_name} 
                        size="small"
                        sx={{
                          bgcolor: '#E3F2FD',
                          color: '#1976D2'
                        }}
                      />
                    ) : (
                      '-'
                    )}
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ color: '#6B7280', maxWidth: 200 }}>
                      {unsub.reason || '-'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="caption" sx={{ color: '#6B7280' }}>
                      {formatDate(unsub.unsubscribed_at)}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <IconButton
                      size="small"
                      onClick={() => handleDelete(unsub.id)}
                      sx={{ color: '#EF4444' }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  )
}

