import { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  Card,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  CircularProgress,
  Chip
} from '@mui/material'
import { Refresh as RefreshIcon } from '@mui/icons-material'

export default function EmailMarketingUnsubscribers() {
  const [unsubscribers, setUnsubscribers] = useState<any[]>([])
  const [loadingUnsubscribers, setLoadingUnsubscribers] = useState(false)

  const fetchUnsubscribers = async () => {
    setLoadingUnsubscribers(true)
    try {
      const response = await fetch('/api/email-marketing/unsubscribers')
      const data = await response.json()
      if (data.success) {
        setUnsubscribers(data.data || [])
      }
    } catch (error) {
      console.error('Error fetching unsubscribers:', error)
    } finally {
      setLoadingUnsubscribers(false)
    }
  }

  useEffect(() => {
    fetchUnsubscribers()
  }, [])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Unsubscribed Contacts ({unsubscribers.length})
        </Typography>
        <Button
          variant="outlined"
          size="small"
          startIcon={<RefreshIcon />}
          onClick={fetchUnsubscribers}
          disabled={loadingUnsubscribers}
        >
          Refresh
        </Button>
      </Box>
      
      {loadingUnsubscribers ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      ) : unsubscribers.length === 0 ? (
        <Card sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" sx={{ color: '#6B7280', mb: 2 }}>
            No Unsubscribers Yet
          </Typography>
          <Typography variant="body2" sx={{ color: '#9CA3AF' }}>
            People who unsubscribe from emails will appear here.
          </Typography>
        </Card>
      ) : (
        <TableContainer component={Card}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: '#F9FAFB' }}>
                <TableCell sx={{ fontWeight: 600 }}>Email</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Unsubscribed At</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Campaign ID</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Reason</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>IP Address</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {unsubscribers.map((unsub) => (
                <TableRow key={unsub.id} hover>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {unsub.email}
                    </Typography>
                  </TableCell>
                  <TableCell>{unsub.name || '-'}</TableCell>
                  <TableCell>
                    <Typography variant="caption" sx={{ color: '#6B7280' }}>
                      {formatDate(unsub.unsubscribed_at)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {unsub.campaign_id ? (
                      <Chip
                        label={unsub.campaign_id.substring(0, 8) + '...'}
                        size="small"
                        sx={{ fontSize: '10px' }}
                      />
                    ) : (
                      '-'
                    )}
                  </TableCell>
                  <TableCell>
                    {unsub.reason ? (
                      <Typography variant="body2" sx={{ color: '#6B7280', fontStyle: 'italic' }}>
                        {unsub.reason}
                      </Typography>
                    ) : (
                      '-'
                    )}
                  </TableCell>
                  <TableCell>
                    <Typography variant="caption" sx={{ color: '#9CA3AF' }}>
                      {unsub.ip_address || '-'}
                    </Typography>
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

