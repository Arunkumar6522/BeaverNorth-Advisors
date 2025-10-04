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
  IconButton,
  Avatar,
  Button,
  Modal
} from '@mui/material'
import {
  Refresh as RestoreIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Visibility as ViewIcon,
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

// Sample deleted leads data (removed - now loads from Supabase)

export default function DeletedLeads() {
  const [deletedLeads, setDeletedLeads] = useState<DeletedLead[]>([])
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
        console.log('🔄 Fetching deleted leads from Supabase...')
        const { supabase } = await import('../lib/supabase')
        const { data, error } = await supabase
          .from('leads')
          .select('*')
          .not('deleted_at', 'is', null)  // Get leads where deleted_at is NOT NULL
          .order('deleted_at', { ascending: false })

        console.log('📊 Deleted leads data:', data)
        console.log('📊 Deleted leads error:', error)

        if (error) {
          console.error('❌ Error fetching deleted leads:', error)
          console.error('Error details:', error.message, error.details, error.hint)
          return
        }

        if (data && data.length > 0) {
          console.log(`✅ ${data.length} deleted leads fetched`)
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
            deleted_at: lead.deleted_at || new Date().toISOString(),
            deleted_by: lead.deleted_by || 'Unknown',
            delete_reason: lead.delete_reason || 'No reason provided',
            delete_comment: lead.delete_comment || 'No comment'
          })))
        } else {
          console.log('⚠️ No deleted leads found')
          setDeletedLeads([])
        }
      } catch (error: any) {
        console.error('❌ Error fetching deleted leads:', error)
        console.error('Stack:', error.stack)
      }
    }

    fetchDeletedLeads()
  }, [])

  /* DISABLED: Restore functionality removed per requirement
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
  */

  /* DISAB LED: Delete functionality removed per requirement  
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
  */

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const calculateAge = (dobString: string) => {
    const birthDate = new Date(dobString)
    const today = new Date()
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    
    return age
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
      <Box sx={{ px: 1, py: 2, flexShrink: 0 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#111827', mb: 1, fontSize: '2rem' }}>
          🗑️ Deleted Leads
        </Typography>
        <Typography variant="body1" sx={{ color: '#6B7280', fontSize: '1.1rem' }}>
          View and manage deleted leads. You can restore them or permanently delete them.
        </Typography>
      </Box>

      {/* Actions */}
      <Box sx={{ px: 1, py: 1, flexShrink: 0 }}>
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
      <Box sx={{ flex: 1, overflow: 'hidden', mx: 0 }}>
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
          <Card sx={{ borderRadius: 2, backgroundColor: '#ffffff', height: '100%', mx: 0 }}>
            <TableContainer sx={{ height: '100%', overflow: 'auto', overflowX: 'auto', '&::-webkit-scrollbar': { height: '6px' } }}>
              <Table stickyHeader sx={{ minWidth: 600 }}>
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#F9FAFB' }}>
                    <TableCell sx={{ fontWeight: '600', minWidth: { xs: 120, sm: 200 } }}>Lead</TableCell>
                    <TableCell sx={{ fontWeight: '600', minWidth: { xs: 120, sm: 180 } }}>Contact</TableCell>
                    <TableCell sx={{ fontWeight: '600', display: { xs: 'none', sm: 'table-cell' }, minWidth: 150 }}>Product</TableCell>
                    <TableCell sx={{ fontWeight: '600', minWidth: { xs: 80, sm: 120 } }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: '600', display: { xs: 'none', md: 'table-cell' }, minWidth: 130 }}>Deleted On</TableCell>
                    <TableCell sx={{ fontWeight: '600', display: { xs: 'none', sm: 'table-cell' }, minWidth: 120 }}>Deleted By</TableCell>
                    <TableCell sx={{ fontWeight: '600', textAlign: 'center', minWidth: { xs: 80, sm: 100 } }}>Actions</TableCell>
                  </TableRow>
              </TableHead>
              <TableBody>
                {deletedLeads.map((lead, _index) => (
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
                            {lead.province} • {calculateAge(lead.dob)} years old
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

                    <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>
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

                    <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>
                      <Typography variant="caption" sx={{ fontWeight: '500' }}>
                        {formatDate(lead.deleted_at)}
                      </Typography>
                    </TableCell>

                    <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>
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