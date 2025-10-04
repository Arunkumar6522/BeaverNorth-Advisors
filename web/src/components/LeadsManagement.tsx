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
  DialogContentText
} from '@mui/material'
import {
  Search as SearchIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Phone as PhoneIcon,
  Email as EmailIcon
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
}

// Sample leads data
const sampleLeads: Lead[] = [
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
    phone: '+15551234570',
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
]

export default function LeadsManagement() {
  const [leads, setLeads] = useState<Lead[]>(sampleLeads)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setFilter] = useState<'all' | 'new' | 'contacted' | 'converted'>('all')
  const [currentTab, setCurrentTab] = useState<'active' | 'closed'>(0)
  const [loading, setLoading] = useState(true)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [editLeadId, setEditLeadId] = useState<string | null>(null)
  const [editStatus, setEditStatus] = useState<'new' | 'contacted' | 'converted'>('new')
  const [editNotes, setEditNotes] = useState('')
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deleteLeadId, setDeleteLeadId] = useState<string | null>(null)

  // Tab change handler
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue === 0 ? 'active' : 'closed')
  }

  // Fetch leads from Supabase
  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const { supabase } = await import('../lib/supabase')
        const { data, error } = await supabase
          .from('leads')
          .select('*')
          .order('created_at', { ascending: false })

        if (error) {
          console.error('❌ Error fetching leads:', error)
          return
        }

        if (data && data.length > 0) {
          console.log('✅ Leads fetched from Supabase:', data)
          setLeads(data.map(lead => ({
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
            last_contact_date: lead.last_contact_date || undefined,
            notes: lead.notes || ''
          })))
        }
      } catch (error: any) {
        console.error('❌ Error fetching leads:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchLeads()
  }, [])

  // Filter leads based on active/closed status
  const getFilteredLeads = () => {
    let filtered = leads

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

  // Handle status update
  const handleStatusUpdate = async (leadId: string, newStatus: Lead['status'], notes?: string) => {
    try {
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

  // Handle edit modal
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

  // Handle delete
  const openDeleteDialog = (leadId: string) => {
    setDeleteLeadId(leadId)
    setDeleteDialogOpen(true)
  }

  const closeDeleteDialog = () => {
    setDeleteDialogOpen(false)
    setDeleteLeadId(null)
  }

  const confirmDelete = () => {
    if (deleteLeadId) {
      // In real implementation, you'd update Supabase to mark as deleted
      setLeads(leads.filter(lead => lead.id !== deleteLeadId))
      closeDeleteDialog()
    }
  }

  // View details handler
  const viewLeadDetails = (leadId: string) => {
    const lead = leads.find(l => l.id === leadId)
    if (lead) {
      alert(`Lead Details:\n\nName: ${lead.name}\nEmail: ${lead.email}\nPhone: ${lead.phone}\nDOB: ${lead.dob}\nProvince: ${lead.province}\nSmoking Status: ${lead.smoking_status}\nInsurance Product: ${lead.insurance_product}\nStatus: ${lead.status}\nNotes: ${lead.notes || 'No notes'}`)
    }
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

  return (
    <Box sx={{ px: 2 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#111827', mb: 1 }}>
          👥 Leads Management
        </Typography>
        <Typography variant="body1" sx={{ color: '#6B7280' }}>
          Manage and track your insurance leads pipeline
        </Typography>
      </Box>

      {/* Tabs */}
      <Box sx={{ mb: 3, borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={currentTab === 'active' ? 0 : 1} onChange={handleTabChange}>
          <Tab 
            label={
              <Stack direction="row" alignItems="center" spacing={1}>
                <Typography>Active Leads</Typography>
                <Chip 
                  label={leads.filter(l => l.status !== 'converted').length} 
                  size="small" 
                  sx={{ backgroundColor: '#1976D2', color: 'white', fontSize: '0.75rem' }}
                />
              </Stack>
            }
          />
          <Tab 
            label={
              <Stack direction="row" alignItems="center" spacing={1}>
                <Typography>Closed Leads</Typography>
                <Chip 
                  label={leads.filter(l => l.status === 'converted').length} 
                  size="small" 
                  sx={{ backgroundColor: '#10B981', color: 'white', fontSize: '0.75rem' }}
                />
              </Stack>
            }
          />
        </Tabs>
      </Box>

      {/* Filters */}
      <Card sx={{ borderRadius: 2, mb: 3, backgroundColor: '#ffffff' }}>
        <CardContent>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
            <TextField
              size="small"
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
              sx={{ minWidth: 250 }}
            />
            
            <FormControl size="small" sx={{ minWidth: 150 }}>
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

      {/* Leads Table */}
      <Card sx={{ borderRadius: 2, backgroundColor: '#ffffff' }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#F9FAFB' }}>
                <TableCell sx={{ fontWeight: '600' }}>Lead</TableCell>
                <TableCell sx={{ fontWeight: '600' }}>Contact</TableCell>
                <TableCell sx={{ fontWeight: '600' }}>Product</TableCell>
                <TableCell sx={{ fontWeight: '600' }}>Status</TableCell>
                <TableCell sx={{ fontWeight: '600' }}>Created</TableCell>
                <TableCell sx={{ fontWeight: '600', textAlign: 'center' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredLeads.map((lead, index) => (
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
                          {lead.province} • {lead.dob}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  
                  <TableCell>
                    <Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                        <EmailIcon sx={{ fontSize: 16, color: '#6B7280' }} />
                        <Typography variant="body2">{lead.email}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <PhoneIcon sx={{ fontSize: 16, color: '#6B7280' }} />
                        <Typography variant="body2">{lead.phone}</Typography>
                      </Box>
                    </Box>
                  </TableCell>

                  <TableCell>
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

                  <TableCell>
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
                        onClick={() => viewLeadDetails(lead.id)}
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
      </Card>

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
      <Dialog open={deleteDialogOpen} onClose={closeDeleteDialog}>
        <DialogTitle>Delete Lead</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this lead? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDeleteDialog}>Cancel</Button>
          <Button onClick={confirmDelete} color="error">Delete</Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}