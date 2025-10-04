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
  Phone as PhoneIcon,
  Visibility as ViewIcon,
  ContentCopy,
  Close as CloseIcon
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
  deleted_by?: string
  delete_reason?: string
  delete_comment?: string
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
    deleted_at: '2025-01-05T14:30:00Z',
    deleted_by: 'admin',
    delete_reason: 'no_response',
    delete_comment: 'No response after multiple attempts'
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
    deleted_at: '2025-01-04T09:20:00Z',
    deleted_by: 'admin',
    delete_reason: 'not_qualified',
    delete_comment: 'Does not meet qualification criteria'
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
    deleted_at: '2025-01-06T11:45:00Z',
    deleted_by: 'admin',
    delete_reason: 'spam',
    delete_comment: 'Invalid contact information provided'
  }
]

export default function DeletedLeads() {
  const [deletedLeads, setDeletedLeads] = useState<DeletedLead[]>(sampleDeletedLeads)
  const [viewModalOpen, setViewModalOpen] = useState(false)
  const [selectedLead, setSelectedLead] = useState<DeletedLead | null>(null)

  // Clickable contact functions
  const handleEmailClick = async (email: string) => {
    try {
      // Copy email to clipboard
      await navigator.clipboard.writeText(email)
      alert(`📧 Email copied to clipboard: ${email}`)
      
      // Also try to open default email client
      window.location.href = `mailto:${email}`
    } catch (error) {
      // Fallback: just copy to clipboard
      navigator.clipboard.writeText(email).then(() => {
        alert(`📧 Email copied to clipboard: ${email}`)
      })
    }
  }

  const handlePhoneClick = async (phone: string) => {
    try {
      // Copy phone to clipboard
      await navigator.clipboard.writeText(phone)
      alert(`📱 Phone copied to clipboard: ${phone}`)
      
      // Also try to open phone dialer
      window.location.href = `tel:${phone}`
    } catch (error) {
      // Fallback: just copy to clipboard
      navigator.clipboard.writeText(phone).then(() => {
        alert(`📱 Phone copied to clipboard: ${phone}`)
      })
    }
  }

  const openViewModal = (lead: DeletedLead) => {
    setSelectedLead(lead)
    setViewModalOpen(true)
  }

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
                    <TableCell sx={{ fontWeight: '600', minWidth: 120 }}>Deleted By</TableCell>
                    <TableCell sx={{ fontWeight: '600', textAlign: 'center', minWidth: 100 }}>Actions</TableCell>
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
                          <Box sx={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: 1, 
                            mb: 0.5,
                            cursor: 'pointer',
                            '&:hover': { backgroundColor: '#f5f5f5', borderRadius: 1 }
                          }}
                          onClick={() => handleEmailClick(lead.email)}
                          >
                            <EmailIcon sx={{ fontSize: 14, color: '#1976D2' }} />
                            <Typography 
                              variant="caption" 
                              sx={{ 
                                color: '#1976D2',
                                textDecoration: 'underline',
                                '&:hover': { fontWeight: 'bold' }
                              }}
                            >
                              {lead.email}
                            </Typography>
                          </Box>
                          <Box sx={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: 1,
                            cursor: 'pointer',
                            '&:hover': { backgroundColor: '#f5f5f5', borderRadius: 1 }
                          }}
                          onClick={() => handlePhoneClick(lead.phone)}
                          >
                            <PhoneIcon sx={{ fontSize: 14, color: '#1976D2' }} />
                            <Typography 
                              variant="caption" 
                              sx={{ 
                                color: '#1976D2',
                                textDecoration: 'underline',
                                '&:hover': { fontWeight: 'bold' }
                              }}
                            >
                              {lead.phone}
                            </Typography>
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

                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Avatar sx={{ 
                          bgcolor: '#FF9800', 
                          width: 24, 
                          height: 24,
                          fontSize: 12,
                          fontWeight: 'bold'
                        }}>
                          {(lead.deleted_by || 'Admin').substring(0, 2).toUpperCase()}
                        </Avatar>
                        <Typography variant="caption" sx={{ fontWeight: '500', color: '#FF9800' }}>
                          {lead.deleted_by || 'Admin'}
                        </Typography>
                      </Box>
                    </TableCell>

                    <TableCell align="center">
                      <IconButton
                        size="small"
                        onClick={() => openViewModal(lead)}
                        sx={{
                          color: '#1976D2',
                          backgroundColor: '#f0f4ff',
                          '&:hover': { backgroundColor: '#e3f2fd' },
                          width: 40,
                          height: 40
                        }}
                        title="View Lead Details"
                      >
                        <ViewIcon sx={{ fontSize: 20 }} />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          </Card>
        )}
      </Box>

      {/* View Details Modal */}
      <Modal open={viewModalOpen} onClose={() => setViewModalOpen(false)}>
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: { xs: '90%', sm: 600 },
          maxHeight: '80vh',
          overflow: 'auto',
          bgcolor: 'background.paper',
          borderRadius: 2,
          boxShadow: 24,
          p: 0
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 3, borderBottom: 1, borderColor: 'divider' }}>
            <Typography variant="h5" sx={{ fontWeight: '600' }}>
              Deleted Lead Details
            </Typography>
            <IconButton onClick={() => setViewModalOpen(false)} sx={{ color: '#6B7280' }}>
              <CloseIcon />
            </IconButton>
          </Box>
          
          {selectedLead && (
            <Box sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <Avatar sx={{ bgcolor: '#FF5722', width: 60, height: 60 }}>
                  {selectedLead.name.split(' ').map(n => n[0]).join('')}
                </Avatar>
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: '600', mb: 0.5 }}>
                    {selectedLead.name}
                  </Typography>
                  <Chip
                    label={selectedLead.status.charAt(0).toUpperCase() + selectedLead.status.slice(1)}
                    sx={{
                      backgroundColor: `${getStatusColor(selectedLead.status)}20`,
                      color: getStatusColor(selectedLead.status),
                      fontWeight: '600'
                    }}
                  />
                </Box>
              </Box>

              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3, mb: 3 }}>
                <Box>
                  <Typography variant="body2" sx={{ color: '#6B7280', mb: 1 }}>Contact Information</Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    📧 <strong>Email:</strong> {selectedLead.email}
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    📱 <strong>Phone:</strong> {selectedLead.phone}
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    📅 <strong>DOB:</strong> {selectedLead.dob}
                  </Typography>
                  <Typography variant="body1">
                    🌍 <strong>Province:</strong> {selectedLead.province}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="body2" sx={{ color: '#6B7280', mb: 1 }}>Deletion Information</Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    🗑️ <strong>Deleted By:</strong> {selectedLead.deleted_by || 'Admin'}
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    📅 <strong>Deleted On:</strong> {formatDate(selectedLead.deleted_at)}
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    🏥 <strong>Product:</strong> {selectedLead.insurance_product}
                  </Typography>
                  <Typography variant="body1">
                    🚭 <strong>Smoking Status:</strong> {selectedLead.smoking_status}
                  </Typography>
                </Box>
              </Box>

              <Box>
                <Typography variant="body2" sx={{ color: '#6B7280', mb: 1 }}>Deletion Reason & Comment</Typography>
                <Box sx={{ backgroundColor: '#fff5f5', p: 2, borderRadius: 1 }}>
                  <Typography variant="body2" sx={{ color: '#d32f2f', fontWeight: '600', mb: 1 }}>
                    Reason: {selectedLead.delete_reason || 'Not specified'}
                  </Typography>
                  <Typography variant="body1" sx={{ fontStyle: selectedLead.delete_comment ? 'italic' : 'normal', color: selectedLead.delete_comment ? '#333' : '#999' }}>
                    {selectedLead.delete_comment || 'No comment provided'}
                  </Typography>
                </Box>
              </Box>
            </Box>
          )}
        </Box>
      </Modal>
    </Box>
  )
}