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
  Paper,
  Chip,
  Button,
  TextField,
  InputAdornment,
  Menu,
  MenuItem,
  IconButton,
  Select,
  FormControl,
  InputLabel,
  Avatar,
  Stack
} from '@mui/material'
import {
  Search as SearchIcon,
  Search as FilterIcon,
  MoreVert as MoreVertIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  Delete as DeleteIcon
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
}

const sampleLeads: Lead[] = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john@example.com',
    phone: '+15551234567',
    dob: '1985-03-15',
    province: 'Ontario',
    smoking_status: 'non-smoker',
    insurance_product: 'term-life',
    status: 'new',
    created_at: '2025-01-04T10:30:00Z'
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah@example.com',
    phone: '+15551234568',
    dob: '1990-07-22',
    province: 'British Columbia',
    smoking_status: 'smoker',
    insurance_product: 'whole-life',
    status: 'contacted',
    created_at: '2025-01-03T14:20:00Z',
    last_contact_date: '2025-01-04T09:15:00Z'
  },
  {
    id: '3',
    name: 'Michael Brown',
    email: 'michael@example.com',
    phone: '+15551234569',
    dob: '1978-11-08',
    province: 'Quebec',
    smoking_status: 'non-smoker',
    insurance_product: 'mortgage-life',
    status: 'converted',
    created_at: '2025-01-02T11:45:00Z',
    last_contact_date: '2025-01-03T16:30:00Z'
  }
]

export default function LeadsManagement() {
  const [leads, setLeads] = useState<Lead[]>(sampleLeads)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'new' | 'contacted' | 'converted'>('all')
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [selectedLead, setSelectedLead] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [debugInfo, setDebugInfo] = useState<string>('')

  // Force show sample data for testing
  useEffect(() => {
    console.log('🔄 LeadsManagement component mounted')
    console.log('📊 Initial leads state:', leads)
    console.log('🔍 Filtered leads:', filteredLeads)
    setDebugInfo(`Debug: ${leads.length} leads, ${filteredLeads.length} filtered`)
  }, [leads])

  // Fetch leads from Supabase
  useEffect(() => {
    const fetchLeads = async () => {
      console.log('🔄 Starting to fetch leads from Supabase...')
      setLoading(true)
      
      try {
        const { supabase } = await import('../lib/supabase')
        console.log('✅ Supabase client loaded')
        
        const { data, error } = await supabase
          .from('leads')
          .select('*')
          .order('created_at', { ascending: false })

        if (error) {
          console.error('❌ Supabase error:', error)
          setError(`Supabase Error: ${error.message}`)
          console.log('📊 Using sample data as fallback')
          // Keep sample data - don't switch to empty array
          return
        }

        if (data && data.length > 0) {
          console.log('✅ Leads fetched from Supabase:', data.length, 'leads')
          const mappedLeads = data.map(lead => ({
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
            last_contact_date: lead.last_contact_date || undefined
          }))
          
          setLeads(mappedLeads)
          setError(null)
        } else {
          console.log('📊 No leads in Supabase, using sample data')
          setError('No leads found in database, showing sample data')
        }
      } catch (error: any) {
        console.error('❌ Error fetching leads:', error)
        setError(`Connection Error: ${error.message}`)
      } finally {
        setLoading(false)
        console.log('🔄 Fetch complete, loading set to false')
      }
    }

    fetchLeads()
  }, [])

  const handleStatusChange = async (leadId: string, newStatus: Lead['status']) => {
    try {
      const updateData: any = { status: newStatus }
      
      if (newStatus !== 'new') {
        updateData.last_contact_date = new Date().toISOString()
        updateData.contacted_at = newStatus === 'contacted' ? new Date().toISOString() : undefined
        updateData.converted_at = newStatus === 'converted' ? new Date().toISOString() : undefined
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
              last_contact_date: newStatus !== 'new' ? new Date().toISOString() : lead.last_contact_date
            }
          : lead
      ))

      console.log('✅ Lead status updated successfully')
    } catch (error) {
      console.error('❌ Error updating lead:', error)
    }
  }

  const getStatusColor = (status: Lead['status']) => {
    switch (status) {
      case 'new': return '#3B82F6'
      case 'contacted': return '#F59E0B' 
      case 'converted': return '#10B981'
      default: return '#6B7280'
    }
  }

  const getInsuranceProductDisplay = (product: string) => {
    const products: { [key: string]: string } = {
      'term-life': 'Term Life',
      'whole-life': 'Whole Life',
      'non-medical': 'Non-Medical',
      'mortgage-life': 'Mortgage Life',
      'senior-life': 'Senior Life',
      'travel': 'Travel'
    }
    return products[product] || product
  }

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = searchTerm === '' || 
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.phone.includes(searchTerm)
    
    const matchesStatus = statusFilter === 'all' || lead.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, leadId: string) => {
    setAnchorEl(event.currentTarget)
    setSelectedLead(leadId)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
    setSelectedLead(null)
  }

  const handleQuickAction = (action: string) => {
    console.log(`${action} for lead:`, selectedLead)
    handleMenuClose()
  }

  return (
    <Box sx={{ px: 2 }}>
      {/* Debug Panel */}
      <Box sx={{ 
        backgroundColor: '#FEF3C7', 
        p: 2, 
        mb: 3, 
        borderRadius: 2, 
        border: '1px solid #F59E0B' 
      }}>
        <Typography variant="body2" sx={{ color: '#92400E', fontWeight: '600' }}>
          🔧 Debug Info: {debugInfo}
        </Typography>
        <Typography variant="body2" sx={{ color: '#92400E' }}>
          📊 Leads Count: {leads.length} | Filtered: {filteredLeads.length} | Loading: {loading ? 'Yes' : 'No'}
        </Typography>
        {error && (
          <Typography variant="body2" sx={{ color: '#DC2626', fontWeight: '600' }}>
            ❌ Error: {error}
          </Typography>
        )}
      </Box>

      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#111827', mb: 1 }}>
          👥 Leads Management
        </Typography>
        <Typography variant="body1" sx={{ color: '#6B7280' }}>
          Manage and track your insurance leads pipeline
        </Typography>
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
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
              }}
              sx={{ minWidth: 200 }}
            />
            
            <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>Status</InputLabel>
                <Select
                  value={statusFilter}
                  label="Status"
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                >
                  <MenuItem value="all">All Leads</MenuItem>
                  <MenuItem value="new">New</MenuItem>
                  <MenuItem value="contacted">Contacted</MenuItem>
                  <MenuItem value="converted">Converted</MenuItem>
                </Select>
            </FormControl>
            
            <Box sx={{ ml: 'auto' }}>
              <Typography variant="body2" sx={{ color: '#6B7280' }}>
                {filteredLeads.length} of {leads.length} leads
              </Typography>
            </Box>
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
                <TableCell sx={{ fontWeight: '600', textAlign: 'right' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredLeads.map((lead) => (
                <TableRow key={lead.id} hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar sx={{ bgcolor: '#22C55E', width: 40, height: 40 }}>
                        {lead.name.split(' ').map(n => n[0]).join('')}
                      </Avatar>
                      <Box>
                        <Typography variant="body1" sx={{ fontWeight: '500' }}>
                          {lead.name}
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#6B7280' }}>
                          {lead.province}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
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
                    <Typography variant="body2">{getInsuranceProductDisplay(lead.insurance_product)}</Typography>
                    <Typography variant="body2" sx={{ color: '#6B7280', fontSize: '12px' }}>
                      {lead.smoking_status === 'smoker' ? 'Smoker' : 'Non-smoker'}
                    </Typography>
                  </TableCell>
                  
                  <TableCell>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Chip
                        label={lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
                        size="small"
                        sx={{
                          backgroundColor: getStatusColor(lead.status) + '20',
                          color: getStatusColor(lead.status),
                          fontWeight: '500'
                        }}
                      />
                      {lead.status === 'new' && (
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() => handleStatusChange(lead.id, 'contacted')}
                          sx={{ fontSize: '12px', px: 1 }}
                        >
                          Mark Contacted
                        </Button>
                      )}
                    </Stack>
                  </TableCell>
                  
                  <TableCell>
                    <Typography variant="body2">
                      {new Date(lead.created_at).toLocaleDateString()}
                    </Typography>
                    {lead.last_contact_date && (
                      <Typography variant="body2" sx={{ color: '#6B7280', fontSize: '12px' }}>
                        Contacted: {new Date(lead.last_contact_date).toLocaleDateString()}
                      </Typography>
                    )}
                  </TableCell>
                  
                  <TableCell sx={{ textAlign: 'right' }}>
                    <IconButton
                      onClick={(e) => handleMenuOpen(e, lead.id)}
                      size="small"
                    >
                      <MoreVertIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* Actions Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => handleQuickAction('view')}>
          <ViewIcon sx={{ mr: 1 }} fontSize="small" />
          View Details
        </MenuItem>
        <MenuItem onClick={() => handleQuickAction('edit')}>
          <EditIcon sx={{ mr: 1 }} fontSize="small" />
          Edit Lead
        </MenuItem>
        <MenuItem onClick={() => handleQuickAction('contact')}>
          <PhoneIcon sx={{ mr: 1 }} fontSize="small" />
          Contact Now
        </MenuItem>
        <MenuItem onClick={() => handleQuickAction('delete')} sx={{ color: '#EF4444' }}>
          <DeleteIcon sx={{ mr: 1 }} fontSize="small" />
          Delete Lead
        </MenuItem>
      </Menu>
    </Box>
  )
}
