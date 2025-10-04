import React, { useState, useEffect } from 'react'
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
  IconButton,
  Avatar,
  Button
} from '@mui/material'
import {
  DeleteForever,
  RestoreFromTrash,
  Refresh as RestoreIcon,
  Email as EmailIcon,
  Phone as PhoneIcon
} from '@mui/icons-material'

interface DeletedLead {
  id: string
  name: string
  email: string
  phone: string
  dob: string
  province: string
  smoking_status: string
  insurance_product: string
  status: string
  created_at: string
  deleted_at: string
}

// Sample deleted leads data
const sampleDeletedLeads: DeletedLead[] = [
  {
    id: 'd1',
    name: 'Sarah Wilson',
    email: 'sarah.wilson@example.com',
    phone: '+1 (555) 123-4567',
    dob: '1985-03-15',
    province: 'Ontario',
    smoking_status: 'Non-smoker',
    insurance_product: 'Term Life Insurance',
    status: 'converted',
    created_at: '2025-01-01T10:00:00Z',
    deleted_at: '2025-01-05T14:30:00Z'
  },
  {
    id: 'd2',
    name: 'Robert Chen',
    email: 'robert.chen@example.com',
    phone: '+1 (555) 987-6543',
    dob: '1978-11-08',
    province: 'British Columbia',
    smoking_status: 'Smoker',
    insurance_product: 'Whole Life Insurance',
    status: 'contacted',
    created_at: '2025-01-02T16:45:00Z',
    deleted_at: '2025-01-04T09:20:00Z'
  },
  {
    id: 'd3',
    name: 'Maria Garcia',
    email: 'maria.garcia@example.com',
    phone: '+1 (555) 456-7890',
    dob: '1992-07-22',
    province: 'Quebec',
    smoking_status: 'Non-smoker',
    insurance_product: 'Travel Insurance',
    status: 'new',
    created_at: '2025-01-03T12:15:00Z',
    deleted_at: '2025-01-06T11:45:00Z'
  }
]

export default function DeletedLeads() {
  const [deletedLeads, setDeletedLeads] = useState<DeletedLead[]>(sampleDeletedLeads)

  // Fetch deleted leads from Supabase
  useEffect(() => {
    const fetchDeletedLeads = async () => {
      try {
        const { supabase } = await import('../lib/supabase')
        const { data, error } = await supabase
          .from('leads')
          .select('*')
          .eq('deleted', true)
          .order('deleted_at', { ascending: false })

        if (error) {
          console.error('❌ Error fetching deleted leads:', error)
          return
        }

        if (data && data.length > 0) {
          setDeletedLeads(data.map(lead => ({
            id: lead.id.toString(),
            name: lead.name || 'Unknown',
            email: lead.email || '',
            phone: lead.phone || '',
            dob: lead.dob || '1985-01-01',
            province: lead.province || 'Ontario',
            smoking_status: lead.smoking_status || 'unknown',
            insurance_product: lead.insurance_product || 'term-life',
            status: (lead.status || 'new') as 'new' | 'contacted' | 'converted',
            created_at: lead.created_at || new Date().toISOString(),
            deleted_at: lead.deleted_at || new Date().toISOString()
          })))
        }
      } catch (error) {
        console.error('❌ Error fetching deleted leads:', error)
      }
    }

    fetchDeletedLeads()
  }, [])

  const handleRestoreLead = async (leadId: string) => {
    try {
      const { supabase } = await import('../lib/supabase')
      const { error } = await supabase
        .from('leads')
        .update({ deleted: false, deleted_at: null })
        .eq('id', leadId)

      if (error) {
        console.error('❌ Error restoring lead:', error)
        return
      }

      // Remove from local state
      setDeletedLeads(deletedLeads.filter(lead => lead.id !== leadId))
      console.log('✅ Lead restored successfully')
    } catch (error) {
      console.error('❌ Error restoring lead:', error)
    }

    // Update local state for demo
    setDeletedLeads(deletedLeads.filter(lead => lead.id !== leadId))
  }

  const handlePermanentDelete = async (leadId: string) => {
    if (!confirm('Are you sure you want to permanently delete this lead? This action cannot be undone.')) {
      return
    }

    try {
      const { supabase } = await import('../lib/supabase')
      const { error } = await supabase
        .from('leads')
        .delete()
        .eq('id', leadId)

      if (error) {
        console.error('❌ Error permanently deleting lead:', error)
        return
      }

      // Remove from local state
      setDeletedLeads(deletedLeads.filter(lead => lead.id !== leadId))
      console.log('✅ Lead permanently deleted')
    } catch (error) {
      console.error('❌ Error permanently deleting lead:', error)
    }

    // Update local state for demo
    setDeletedLeads(deletedLeads.filter(lead => lead.id !== leadId))
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return '#1976D2'
      case 'contacted': return '#F59E0B'
      case 'converted': return '#10B981'
      default: return '#6B7280'
    }
  }

  return (
    <Box sx={{ height: '100%', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Box sx={{ px: 2, py: 3, flexShrink: 0 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#111827', mb: 1, fontSize: '2rem' }}>
          🗑️ Deleted Leads
        </Typography>
        <Typography variant="body1" sx={{ color: '#6B7280', fontSize: '1.1rem' }}>
          View and manage deleted leads. You can restore them or permanently delete them.
        </Typography>
      </Box>

      {/* Actions */}
      <Box sx={{ px: 2, py: 2, flexShrink: 0 }}>
        <Button
          variant="outlined"
          size="medium"
          startIcon={<RestoreIcon />}
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
          onClick={() => window.location.reload()}
        >
          Refresh
        </Button>
      </Box>

      {/* Deleted Leads Table */}
      <Box sx={{ flex: 1, overflow: 'hidden', mx: 2 }}>
        {deletedLeads.length === 0 ? (
          <Card sx={{ borderRadius: 2, backgroundColor: '#ffffff', p: 4, textAlign: 'center' }}>
            <Typography variant="h6" sx={{ color: '#666666', mb: 2 }}>
              No Deleted Leads
            </Typography>
            <Typography variant="body2" sx={{ color: '#999999' }}>
              All your deleted leads will appear here. You can restore them or permanently delete them.
            </Typography>
          </Card>
        ) : (
          <Card sx={{ borderRadius: 2, backgroundColor: '#ffffff', height: '100%' }}>
            <TableContainer sx={{ height: '100%', overflow: 'auto' }}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#F9FAFB' }}>
                    <TableCell sx={{ fontWeight: '600', minWidth: 200 }}>Lead</TableCell>
                    <TableCell sx={{ fontWeight: '600', minWidth: 180 }}>Contact</TableCell>
                    <TableCell sx={{ fontWeight: '600', minWidth: 150 }}>Product</TableCell>
                    <TableCell sx={{ fontWeight: '600', minWidth: 120 }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: '600', minWidth: 130 }}>Deleted On</TableCell>
                    <TableCell sx={{ fontWeight: '600', textAlign: 'center', minWidth: 140 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {deletedLeads.map((lead, index) => (
                  <TableRow key={lead.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar sx={{ bgcolor: '#FF5722', width: 40, height: 40 }}>
                          {lead.name.split(' ').map(n => n[0]).join('')}
                        </Avatar>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: '500' }}>
                            {lead.name}
                          </Typography>
                          <Typography variant="caption" sx={{ color: '#6B7280' }}>
                            {lead.province} • {lead.dob}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    
                    <TableCell>
                      <Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                          <EmailIcon sx={{ fontSize: 14, color: '#6B7280' }} />
                          <Typography variant="caption">{lead.email}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <PhoneIcon sx={{ fontSize: 14, color: '#6B7280' }} />
                          <Typography variant="caption">{lead.phone}</Typography>
                        </Box>
                      </Box>
                    </TableCell>

                    <TableCell>
                      <Typography variant="caption" sx={{ fontWeight: '500' }}>
                        {lead.insurance_product}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#6B7280', fontSize: '0.7rem' }}>
                        {lead.smoking_status}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Chip
                        label={lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
                        size="small"
                        sx={{
                          backgroundColor: `${getStatusColor(lead.status)}20`,
                          color: getStatusColor(lead.status),
                          fontWeight: '600',
                          fontSize: '0.7rem'
                        }}
                      />
                    </TableCell>

                    <TableCell>
                      <Typography variant="caption" sx={{ fontWeight: '500' }}>
                        {formatDate(lead.deleted_at)}
                      </Typography>
                    </TableCell>

                    <TableCell align="center">
                      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.5 }}>
                        <IconButton
                          size="small"
                          onClick={() => handleRestoreLead(lead.id)}
                          sx={{
                            color: '#1976D2',
                            backgroundColor: '#f0f4ff',
                            '&:hover': { backgroundColor: '#e3f2fd' },
                            width: 32,
                            height: 32
                          }}
                          title="Restore Lead"
                        >
                          <RestoreFromTrash sx={{ fontSize: 16 }} />
                        </IconButton>
                        
                        <IconButton
                          size="small"
                          onClick={() => handlePermanentDelete(lead.id)}
                          sx={{
                            color: '#F44336',
                            backgroundColor: '#fff5f5',
                            '&:hover': { backgroundColor: '#ffebee' },
                            width: 32,
                            height: 32
                          }}
                          title="Permanently Delete"
                        >
                          <DeleteForever sx={{ fontSize: 16 }} />
                        </IconButton>
                      </Box>
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