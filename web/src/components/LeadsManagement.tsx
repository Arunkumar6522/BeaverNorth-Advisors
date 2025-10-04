import React, { useState, useEffect } from 'react'
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  TextField,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Avatar,
  Stack,
  Tabs,
  Tab,
  Modal,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  TablePagination
} from '@mui/material'
import {
  Search as SearchIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Close as CloseIcon
} from '@mui/icons-material'

interface Lead {
  id: string
  name: string
  email: string
  phone: string
  dob: string
  province: string
  smoking_status: string
  insurance_product: string
  status: 'new' | 'contacted' | 'converted'
  created_at: string
  last_contact_date?: string
  notes?: string
  deleted_at?: string
}

// Sample leads data (not used - kept for reference)
/* const sampleLeads: Lead[] = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john@example.com',
    phone: '+15551234567',
    dob: '1985-03-15',
    province: 'Ontario',
    smoking_status: 'Non-smoker',
    insurance_product: 'Term Life Insurance',
    status: 'new',
    created_at: '2025-01-04T10:30:00Z',
    notes: 'Interested in term life insurance for family protection.'
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah@example.com',
    phone: '+15551234568',
    dob: '1990-07-22',
    province: 'British Columbia',
    smoking_status: 'Smoker',
    insurance_product: 'Whole Life Insurance',
    status: 'contacted',
    created_at: '2025-01-03T14:20:00Z',
    last_contact_date: '2025-01-04T09:15:00Z',
    notes: 'Spoke about whole life benefits. Follow up next week.'
  },
  {
    id: '3',
    name: 'Michael Brown',
    email: 'michael@example.com',
    phone: '+15551234569',
    dob: '1978-11-08',
    province: 'Quebec',
    smoking_status: 'Non-smoker',
    insurance_product: 'Mortgage Life Insurance',
    status: 'converted',
    created_at: '2025-01-02T16:30:00Z',
    last_contact_date: '2025-01-03T16:30:00Z',
    notes: 'Successfully converted to mortgage life insurance policy.'
  },
  {
    id: '4',
    name: 'Emily Davis',
    email: 'emily@example.com',
    phone: '+15591234570',
    dob: '1992-05-14',
    province: 'Alberta',
    smoking_status: 'Non-smoker',
    insurance_product: 'Travel Insurance',
    status: 'contacted',
    created_at: '2025-01-01T11:00:00Z',
    last_contact_date: '2025-01-03T11:00:00Z',
    notes: 'Interested in travel insurance coverage.'
  },
  {
    id: '5',
    name: 'David Wilson',
    email: 'david@example.com',
    phone: '+15551234571',
    dob: '1988-09-30',
    province: 'Manitoba',
    smoking_status: 'Non-smoker',
    insurance_product: 'Senior Life Insurance',
    status: 'new',
    created_at: '2025-01-05T13:45:00Z',
    notes: 'New lead, needs evaluation.'
  }
] */

const DELETE_REASONS = [
  { value: 'duplicate', label: 'Duplicate Lead' },
  { value: 'no_response', label: 'No Response' },
  { value: 'not_qualified', label: 'Not Qualified' },
  { value: 'wrong_number', label: 'Wrong Phone Number' },
  { value: 'spam', label: 'Spam/Invalid' },
  { value: 'other', label: 'Other' }
]

export default function LeadsManagement() {
  const [leads, setLeads] = useState<Lead[]>([])  // Start with empty array, will load from Supabase
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setFilter] = useState<'all' | 'new' | 'contacted' | 'converted'>('all')
  const [currentTab, setCurrentTab] = useState<'active' | 'closed'>('active')
  
  // Modal states
  const [viewModalOpen, setViewModalOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  
  // Edit modal states
  const [editLeadId, setEditLeadId] = useState<string | null>(null)
  const [editStatus, setEditStatus] = useState<'new' | 'contacted' | 'converted'>('new')
  const [editNotes, setEditNotes] = useState('')
  
  // Delete modal states
  const [deleteLeadId, setDeleteLeadId] = useState<string | null>(null)
  const [deleteReason, setDeleteReason] = useState('')
  const [deleteComment, setDeleteComment] = useState('')
  
  // Pagination
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  // Tab change handler
  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue === 0 ? 'active' : 'closed')
    setPage(0) // Reset to first page when switching tabs
  }

  // Fetch leads from Supabase
  useEffect(() => {
    const fetchLeads = async () => {
      try {
        console.log('🔄 Fetching leads from Supabase...')
        const { supabase } = await import('../lib/supabase')
        
        // First, let's get ALL leads to see what's in the database
        const { data, error } = await supabase
          .from('leads')
          .select('*')
          .order('created_at', { ascending: false })

        console.log('📊 Raw data from Supabase (ALL leads):', data)
        console.log('📊 Error (if any):', error)

        if (error) {
          console.error('❌ Error fetching leads:', error)
          console.error('❌ Error code:', error.code)
          console.error('❌ Error message:', error.message)
          console.error('❌ Error details:', error.details)
          console.error('❌ Error hint:', error.hint)
          return
        }

        if (data) {
          if (data.length === 0) {
            console.log('⚠️ No leads found in database')
            setLeads([])
          } else {
            console.log(`✅ ${data.length} leads fetched from Supabase`)
            console.log('📋 First lead sample:', data[0])
            
            // Filter out deleted leads in JavaScript (not SQL)
            const activeLeads = data.filter(lead => !lead.deleted_at)
            console.log(`📊 Active leads (deleted_at is null): ${activeLeads.length}`)
            
            setLeads(activeLeads.map(lead => ({
              id: lead.id ? lead.id.toString() : String(Math.random()),
              name: lead.name || 'Unknown',
              email: lead.email || '',
              phone: lead.phone || '',
              dob: lead.dob || '1985-01-01',
              province: lead.province || 'Ontario',
              smoking_status: lead.smoking_status || 'unknown',
              insurance_product: lead.insurance_product || 'term-life',
              status: (lead.status || 'new') as 'new' | 'contacted' | 'converted',
              created_at: lead.created_at || new Date().toISOString(),
              last_contact_date: lead.last_contact_date || undefined,
              notes: lead.notes || '',
              deleted_at: lead.deleted_at || undefined
            })))
            
            console.log('✅ Leads state updated successfully')
          }
        } else {
          console.log('⚠️ Data is null or undefined')
        }
      } catch (error: any) {
        console.error('❌ Caught error in fetchLeads:', error)
        console.error('❌ Error stack:', error.stack)
      }
    }

    console.log('🚀 LeadsManagement component mounted, fetching leads...')
    fetchLeads()
  }, [])

  // Filter leads based on active/closed status
  const getFilteredLeads = () => {
    let filtered = leads.filter(lead => !lead.deleted_at) // Only show non-deleted leads

    // Filter by active/closed
    if (currentTab === 'active') {
      filtered = filtered.filter(lead => lead.status !== 'converted')
    } else {
      filtered = filtered.filter(lead => lead.status === 'converted')
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(lead =>
        lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.phone.includes(searchTerm) ||
        lead.province.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.insurance_product.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filter by status if not 'all'
    if (statusFilter !== 'all') {
      filtered = filtered.filter(lead => lead.status === statusFilter)
    }

    return filtered
  }

  const filteredLeads = getFilteredLeads()

  // Pagination
  const paginatedLeads = filteredLeads.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  )

  // Handle status update
  const handleStatusUpdate = async (leadId: string, newStatus: Lead['status'], notes?: string) => {
    try {
      // Get current lead for logging
      const currentLead = leads.find(lead => lead.id === leadId)
      const leadName = currentLead?.name || 'Unknown Lead'
      const oldStatus = currentLead?.status || 'new'
      
      const updateData: any = { status: newStatus }
      
      if (newStatus !== 'new') {
        updateData.last_contact_date = new Date().toISOString()
        updateData.contacted_at = newStatus === 'contacted' ? new Date().toISOString() : undefined
        updateData.converted_at = newStatus === 'converted' ? new Date().toISOString() : undefined
      }

      if (notes) {
        updateData.notes = notes
      }

      // Update in Supabase
      const { supabase } = await import('../lib/supabase')
      const { error } = await supabase
        .from('leads')
        .update(updateData)
        .eq('id', leadId)

      if (error) {
        console.error('❌ Error updating lead status:', error)
        return
      }

      // Log the status change activity
      if (oldStatus !== newStatus) {
        await logActivity(
          leadId,
          'status_changed',
          `Status changed for ${leadName}: ${oldStatus} → ${newStatus}`,
          oldStatus,
          newStatus
        )
      }

      // Update local state
      setLeads(leads.map(lead => 
        lead.id === leadId 
          ? { 
              ...lead, 
              status: newStatus,
              notes: notes || lead.notes,
              last_contact_date: newStatus !== 'new' ? new Date().toISOString() : lead.last_contact_date
            }
          : lead
      ))

      console.log('✅ Lead status updated successfully')
    } catch (error) {
      console.error('❌ Error updating lead:', error)
    }
  }

  // View modal handlers
  const openViewModal = (leadId: string) => {
    setEditLeadId(leadId)
    setViewModalOpen(true)
  }

  const closeViewModal = () => {
    setViewModalOpen(false)
    setEditLeadId(null)
  }

  // Edit modal handlers
  const openEditModal = (leadId: string) => {
    const lead = leads.find(l => l.id === leadId)
    if (lead) {
      setEditLeadId(leadId)
      setEditStatus(lead.status)
      setEditNotes(lead.notes || '')
      setEditModalOpen(true)
    }
  }

  const closeEditModal = () => {
    setEditModalOpen(false)
    setEditLeadId(null)
    setEditStatus('new')
    setEditNotes('')
  }

  const saveEditChanges = () => {
    if (editLeadId) {
      handleStatusUpdate(editLeadId, editStatus, editNotes)
      closeEditModal()
    }
  }

  // Delete handlers
  const openDeleteDialog = (leadId: string) => {
    setDeleteLeadId(leadId)
    setDeleteReason('')
    setDeleteComment('')
    setDeleteDialogOpen(true)
  }

  const closeDeleteDialog = () => {
    setDeleteDialogOpen(false)
    setDeleteLeadId(null)
    setDeleteReason('')
    setDeleteComment('')
  }

  // Function to log activities manually
  const logActivity = async (leadId: string, activityType: string, description: string, oldValue?: string, newValue?: string) => {
    try {
      const { supabase } = await import('../lib/supabase')
      const username = localStorage.getItem('username') || 'Admin'
      
      const { error } = await supabase
        .from('activity_log')
        .insert({
          lead_id: leadId,
          activity_type: activityType,
          description: description,
          old_value: oldValue,
          new_value: newValue,
          performed_by: username
        })

      if (error) {
        console.error('❌ Error logging activity:', error)
      } else {
        console.log('✅ Activity logged:', activityType)
      }
    } catch (error) {
      console.error('❌ Error logging activity:', error)
    }
  }

  const confirmDelete = async () => {
    if (!deleteLeadId || !deleteReason || !deleteComment) {
      alert('Please provide both reason and comment')
      return
    }

    try {
      console.log('🗑️ Deleting lead:', deleteLeadId)
      
      // Get current user
      const username = localStorage.getItem('username') || 'Admin'
      
      // Get lead name for logging
      const leadToDelete = leads.find(lead => lead.id === deleteLeadId)
      const leadName = leadToDelete?.name || 'Unknown Lead'
      
      // Soft delete in Supabase
      const { supabase } = await import('../lib/supabase')
      const { error } = await supabase
        .from('leads')
        .update({
          deleted_at: new Date().toISOString(),
          delete_reason: deleteReason,
          delete_comment: deleteComment,
          deleted_by: username
        })
        .eq('id', deleteLeadId)

      if (error) {
        console.error('❌ Error deleting lead:', error)
        alert(`Failed to delete lead: ${error.message}`)
        return
      }

      // Log the deletion activity
      await logActivity(
        deleteLeadId,
        'lead_deleted',
        `Lead deleted: ${leadName}`,
        'active',
        'deleted'
      )

      // Remove from local state
      setLeads(leads.filter(lead => lead.id !== deleteLeadId))
      console.log('✅ Lead soft deleted successfully')
      alert('Lead moved to Deleted Leads successfully!')
      
      // Refresh leads to get updated data
      window.location.reload()
    } catch (error: any) {
      console.error('❌ Error deleting lead:', error)
      alert(`Error: ${error.message}`)
    }

    closeDeleteDialog()
  }

  const getSelectedLead = () => {
    return leads.find(lead => lead.id === editLeadId)
  }

  const getStatusColor = (status: Lead['status']) => {
    switch (status) {
      case 'new': return '#1976D2'
      case 'contacted': return '#F59E0B'
      case 'converted': return '#10B981'
      default: return '#6B7280'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
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

  const canDelete = () => {
    return deleteLeadId && deleteReason && deleteComment.trim().length > 0
  }

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

  return (
    <Box sx={{ height: '100%', overflow: 'hidden', display: 'flex', flexDirection: 'column', width: '100%' }}>
      {/* Header */}
      <Box sx={{ px: 1, py: 2, flexShrink: 0 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#111827', mb: 1, fontSize: '2rem' }}>
          👥 Leads Management
        </Typography>
        <Typography variant="body1" sx={{ color: '#6B7280', fontSize: '1.1rem' }}>
          Manage and track your insurance leads pipeline
        </Typography>
      </Box>

      {/* Tabs */}
      <Box sx={{ px: 1, borderBottom: 1, borderColor: 'divider', flexShrink: 0 }}>
        <Tabs value={currentTab === 'active' ? 0 : 1} onChange={handleTabChange}>
          <Tab 
            label={
              <Stack direction="row" alignItems="center" spacing={1}>
                <Typography sx={{ fontSize: '1rem' }}>Active Leads</Typography>
                <Chip 
                  label={leads.filter(l => l.status !== 'converted' && !l.deleted_at).length} 
                  size="small" 
                  sx={{ backgroundColor: '#1976D2', color: 'white', fontSize: '0.75rem' }} />
              </Stack>
            }
          />
          <Tab 
            label={
              <Stack direction="row" alignItems="center" spacing={1}>
                <Typography sx={{ fontSize: '1rem' }}>Closed Leads</Typography>
                <Chip 
                  label={leads.filter(l => l.status === 'converted' && !l.deleted_at).length} 
                  size="small" 
                  sx={{ backgroundColor: '#10B981', color: 'white', fontSize: '0.75rem' }} />
              </Stack>
            }
          />
        </Tabs>
      </Box>

      {/* Filters */}
      <Box sx={{ px: 1, py: 1, flexShrink: 0 }}>
        <Card sx={{ borderRadius: 2, backgroundColor: '#ffffff' }}>
          <CardContent sx={{ py: 2 }}>
            <Box sx={{ 
              display: 'flex', 
              gap: { xs: 2, sm: 2 }, 
              flexWrap: 'wrap', 
              alignItems: 'center',
              flexDirection: { xs: 'column', sm: 'row' }
            }}>
              <TextField
                size="medium"
                placeholder="Search leads..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: '#6B7280' }} />
                    </InputAdornment>
                  ),
                }}
                sx={{ minWidth: { xs: '100%', sm: 300 }, width: { xs: '100%', sm: 'auto' } }}
              />
              
              <FormControl size="medium" sx={{ minWidth: { xs: '100%', sm: 180 }, width: { xs: '100%', sm: 'auto' } }}>
                <InputLabel>Status Filter</InputLabel>
                <Select
                  value={statusFilter}
                  label="Status Filter"
                  onChange={(e) => setFilter(e.target.value)}
                >
                  <MenuItem value="all">All Status</MenuItem>
                  <MenuItem value="new">New</MenuItem>
                  <MenuItem value="contacted">Contacted</MenuItem>
                  <MenuItem value="converted">Converted</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* Full Screen Table */}
      <Box sx={{ flex: 1, overflow: 'hidden', px: 1 }}>
        <Card sx={{ borderRadius: 2, backgroundColor: '#ffffff', height: '100%', display: 'flex', flexDirection: 'column' }}>
          <TableContainer sx={{ flex: 1, overflow: 'auto', '&::-webkit-scrollbar': { height: '6px' }, overflowX: 'auto' }}>
            <Table stickyHeader sx={{ minWidth: 800, width: '100%' }}>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#F9FAFB' }}>
                  <TableCell sx={{ fontWeight: '600', minWidth: { xs: 120, sm: 150 } }}>Lead</TableCell>
                  <TableCell sx={{ fontWeight: '600', minWidth: { xs: 150, sm: 180 } }}>Contact</TableCell>
                  <TableCell sx={{ fontWeight: '600', display: { xs: 'none', sm: 'table-cell' }, minWidth: 150 }}>Product</TableCell>
                  <TableCell sx={{ fontWeight: '600', minWidth: { xs: 80, sm: 100 } }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: '600', display: { xs: 'none', md: 'table-cell' }, minWidth: 130 }}>Created</TableCell>
                  <TableCell sx={{ fontWeight: '600', textAlign: 'center', minWidth: { xs: 120, sm: 150 } }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedLeads.map((lead, _index) => (
                  <TableRow key={lead.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar sx={{ bgcolor: '#1976D2', width: 40, height: 40 }}>
                          {lead.name.split(' ').map(n => n[0]).join('')}
                        </Avatar>
                        <Box>
                          <Typography variant="body1" sx={{ fontWeight: '500' }}>
                            {lead.name}
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#6B7280' }}>
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
                          px: 1,
                          borderRadius: 1,
                          '&:hover': { backgroundColor: '#f5f5f5' }
                        }}
                        onClick={() => handleEmailClick(lead.email)}
                        >
                          <EmailIcon sx={{ fontSize: 16, color: '#1976D2' }} />
                          <Typography 
                            variant="body2"
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
                          px: 1,
                          borderRadius: 1,
                          '&:hover': { backgroundColor: '#f5f5f5' }
                        }}
                        onClick={() => handlePhoneClick(lead.phone)}
                        >
                          <PhoneIcon sx={{ fontSize: 16, color: '#1976D2' }} />
                          <Typography 
                            variant="body2"
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
                      <Typography variant="body2" sx={{ fontWeight: '500' }}>
                        {lead.insurance_product}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#6B7280', fontSize: '0.75rem' }}>
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
                          fontSize: '0.75rem'
                        }}
                      />
                    </TableCell>

                    <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>
                      <Typography variant="body2" sx={{ fontWeight: '500' }}>
                        {formatDate(lead.created_at)}
                      </Typography>
                      {lead.last_contact_date && (
                        <Typography variant="caption" sx={{ color: '#6B7280', fontSize: '0.7rem' }}>
                          Last: {formatDate(lead.last_contact_date)}
                        </Typography>
                      )}
                    </TableCell>

                    <TableCell align="center">
                      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                        <IconButton
                          size="small"
                          onClick={() => openViewModal(lead.id)}
                          sx={{
                            color: '#1976D2',
                            backgroundColor: '#f0f4ff',
                            '&:hover': { backgroundColor: '#e3f2fd' }
                          }}
                          title="View Details"
                        >
                          <ViewIcon />
                        </IconButton>
                        
                        <IconButton
                          size="small"
                          onClick={() => openEditModal(lead.id)}
                          sx={{
                            color: '#F59E0B',
                            backgroundColor: '#fff8f0',
                            '&:hover': { backgroundColor: '#ffebd6' }
                          }}
                          title="Edit Lead"
                        >
                          <EditIcon />
                        </IconButton>
                        
                        <IconButton
                          size="small"
                          onClick={() => openDeleteDialog(lead.id)}
                          sx={{
                            color: '#F44336',
                            backgroundColor: '#fff5f5',
                            '&:hover': { backgroundColor: '#ffebee' }
                          }}
                          title="Delete Lead"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          
          {/* Pagination */}
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredLeads.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={(_event, newPage) => setPage(newPage)}
            onRowsPerPageChange={(event) => {
              setRowsPerPage(parseInt(event.target.value, 10))
              setPage(0)
            }}
          />
        </Card>
      </Box>

      {/* View Details Modal */}
      <Modal open={viewModalOpen} onClose={closeViewModal}>
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
              Lead Details
            </Typography>
            <IconButton onClick={closeViewModal} sx={{ color: '#6B7280' }}>
              <CloseIcon />
            </IconButton>
          </Box>
          
          {getSelectedLead() && (
            <Box sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <Avatar sx={{ bgcolor: '#1976D2', width: 60, height: 60 }}>
                  {getSelectedLead()!.name.split(' ').map(n => n[0]).join('')}
                </Avatar>
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: '600', mb: 0.5 }}>
                    {getSelectedLead()!.name}
                  </Typography>
                  <Chip
                    label={getSelectedLead()!.status.charAt(0).toUpperCase() + getSelectedLead()!.status.slice(1)}
                    sx={{
                      backgroundColor: `${getStatusColor(getSelectedLead()!.status)}20`,
                      color: getStatusColor(getSelectedLead()!.status),
                      fontWeight: '600'
                    }}
                  />
                </Box>
              </Box>

              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3, mb: 3 }}>
                <Box>
                  <Typography variant="body2" sx={{ color: '#6B7280', mb: 1 }}>Contact Information</Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    📧 <strong>Email:</strong> 
                    <Typography 
                      component="span" 
                      sx={{ 
                        color: '#1976D2', 
                        textDecoration: 'underline',
                        cursor: 'pointer',
                        ml: 1,
                        '&:hover': { fontWeight: 'bold' }
                      }}
                      onClick={() => handleEmailClick(getSelectedLead()!.email)}
                    >
                      {getSelectedLead()!.email}
                    </Typography>
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    📱 <strong>Phone:</strong> 
                    <Typography 
                      component="span" 
                      sx={{ 
                        color: '#1976D2', 
                        textDecoration: 'underline',
                        cursor: 'pointer',
                        ml: 1,
                        '&:hover': { fontWeight: 'bold' }
                      }}
                      onClick={() => handlePhoneClick(getSelectedLead()!.phone)}
                    >
                      {getSelectedLead()!.phone}
                    </Typography>
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    📅 <strong>DOB:</strong> {getSelectedLead()!.dob}
                  </Typography>
                  <Typography variant="body1">
                    🌍 <strong>Province:</strong> {getSelectedLead()!.province}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="body2" sx={{ color: '#6B7280', mb: 1 }}>Insurance Information</Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    🏥 <strong>Product:</strong> {getSelectedLead()!.insurance_product}
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    🚭 <strong>Smoking Status:</strong> {getSelectedLead()!.smoking_status}
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    📅 <strong>Created:</strong> {formatDate(getSelectedLead()!.created_at)}
                  </Typography>
                  {getSelectedLead()!.last_contact_date && (
                    <Typography variant="body1">
                      📅 <strong>Last Contacted:</strong> {formatDate(getSelectedLead()!.last_contact_date || getSelectedLead()!.created_at)}
                    </Typography>
                  )}
                </Box>
              </Box>

              {getSelectedLead()!.notes && (
                <Box>
                  <Typography variant="body2" sx={{ color: '#6B7280', mb: 1 }}>Notes</Typography>
                  <Typography variant="body1" sx={{ 
                    backgroundColor: '#F9FAFB', 
                    p: 2, 
                    borderRadius: 1,
                    fontStyle: 'italic'
                  }}>
                    "{getSelectedLead()!.notes}"
                  </Typography>
                </Box>
              )}
            </Box>
          )}
        </Box>
      </Modal>

      {/* Edit Modal */}
      <Dialog open={editModalOpen} onClose={closeEditModal} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Lead Status</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel>Status</InputLabel>
              <Select
                value={editStatus}
                label="Status"
                onChange={(e) => setEditStatus(e.target.value)}
              >
                <MenuItem value="new">New</MenuItem>
                <MenuItem value="contacted">Contacted</MenuItem>
                <MenuItem value="converted">Converted</MenuItem>
              </Select>
            </FormControl>
            
            <TextField
              fullWidth
              multiline
              rows={4}
              placeholder="Add notes or comments..."
              value={editNotes}
              onChange={(e) => setEditNotes(e.target.value)}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeEditModal}>Cancel</Button>
          <Button onClick={saveEditChanges} variant="contained">Save Changes</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={closeDeleteDialog} maxWidth="md" fullWidth>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <DeleteIcon sx={{ color: '#F44336' }} />
          Delete Lead
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <DialogContentText sx={{ mb: 3 }}>
              Are you sure you want to delete this lead? Please provide a reason and comment. 
              This will move the lead to the Deleted Leads module.
            </DialogContentText>
            
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel>Delete Reason *</InputLabel>
              <Select
                value={deleteReason}
                label="Delete Reason *"
                onChange={(e) => setDeleteReason(e.target.value)}
              >
                {DELETE_REASONS.map(reason => (
                  <MenuItem key={reason.value} value={reason.value}>
                    {reason.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <TextField
              fullWidth
              multiline
              rows={3}
              placeholder="Please provide additional comments about why you're deleting this lead..."
              value={deleteComment}
              onChange={(e) => setDeleteComment(e.target.value)}
              helperText={!deleteComment && "Comment is required to delete the lead"}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDeleteDialog}>Cancel</Button>
          <Button 
            onClick={confirmDelete} 
            color="error" 
            variant="contained"
            disabled={!canDelete()}
          >
            Delete Lead
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}