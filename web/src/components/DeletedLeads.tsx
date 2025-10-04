import React, { useState, useEffect } from 'react'
import {
  Box,
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Avatar,
  Chip,
  Paper,
  Button
} from '@mui/material'
import {
  DeleteForever,
  RestoreFromTrash,
  Refresh as RestoreIcon,
  Undo as UndoIcon
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
  const [selectedLead, setSelectedLead] = useState<string | null>(null)

  // Fetch deleted leads from Supabase
  useEffect(() => {
    const fetchDeletedLeads = async () => {
      try {
        const { supabase } = await import('../lib/supabase')
        const { data, error } = await supabase
          .from('leads')
          .select('*')
          .eq('deleted', true) // Assuming we add a deleted field
          .order('deleted_at', { ascending: false })

        if (error) {
          console.error('❌ Error fetching deleted leads:', error)
          return
        }

        if (data && data.length > 0) {
          setDeletedLeads(data)
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
 being       }
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
    <Box sx={{ px: 2 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#111827', mb: 1 }}>
          🗑️ Deleted Leads
        </Typography>
        <Typography variant="body1" sx={{ color: '#6B9280' }}>
          View and manage deleted leads. You can restore them or permanently delete them.
        </Typography>
      </Box>

      {/* Actions */}
      <Box sx={{ mb: 3 }}>
        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          sx={{
            borderColor: '#1976D2',
            color: '#1976D2',
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

      {/* Deleted Leads List */}
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
        <Card sx={{ borderRadius: 2, backgroundColor: '#ffffff' }}>
          <CardContent sx={{ p: 0 }}>
            <List sx={{ py: 1 }}>
              {deletedLeads.map((lead, index) => (
                <ListItem
                  key={lead.id}
                  divider={index < deletedLeads.length - 1}
                  sx={{ px: 3, py: 2 }}
                >
                  <ListItemButton
                    selected={selectedLead === lead.id}
                    onClick={() => setSelectedLead(selectedLead === lead.id ? null : lead.id)}
                    sx={{
                      borderRadius: 1.5,
                      backgroundColor: selectedLead === lead.id ? '#f0f4ff' : 'transparent',
                      '&:hover': {
                        backgroundColor: selectedLead === lead.id ? '#e3f2fd' : '#f9f9f9'
                      },
                      '&.Mui-selected': {
                        backgroundColor: '#f0f4ff'
                      }
                    }}
                  >
                    <Avatar sx={{ 
                      bgcolor: '#FF5722', 
                      width: 48, 
                      height: 48,
                      fontSize: 16,
                      fontWeight: 'bold',
                      mr: 2
                    }}>
                      {(lead.name.split(' ').map(n => n[0]).join('')).substring(0, 2)}
                    </Avatar>
                    
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 0.5 }}>
                          <Typography variant="body1" sx={{ fontWeight: '600', color: '#333' }}>
                            {lead.name}
                          </Typography>
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
                        </Box>
                      }
                      secondary={
                        <Box sx={{ mt: 1 }}>
                          <Typography variant="body2" sx={{ color: '#666', mb: 0.5 }}>
                            📧 {lead.email} • 📱 {lead.phone}
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#666', mb: 0.5 }}>
                            📅 DOB: {lead.dob} • 🌍 {lead.province} • 🚭 {lead.smoking_status}
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#666', mb: 1 }}>
                            🏥 {lead.insurance_product}
                          </Typography>
                          <Typography variant="caption" sx={{ color: '#999' }}>
                            Deleted on: {formatDate(lead.deleted_at)}
                          </Typography>
                        </Box>
                      }
                    />
                    
                    <ListItemSecondaryAction sx={{ gap: 1 }}>
                      <IconButton
                        onClick={(e) => {
                          e.stopPropagation()
                          handleRestoreLead(lead.id)
                        }}
                        sx={{
                          color: '#1976D2',
                          backgroundColor: '#f0f4ff',
                          '&:hover': {
                            backgroundColor: '#e3f2fd'
                          }
                        }}
                        title="Restore Lead"
                      >
                        <RestoreFromTrash />
                      </IconButton>
                      
                      <IconButton
                        onClick={(e) => {
                          e.stopPropagation()
                          handlePermanentDelete(lead.id)
                        }}
                        sx={{
                          color: '#F44336',
                          backgroundColor: '#fff5f5',
                          '&:hover': {
                            backgroundColor: '#ffebee'
                          }
                        }}
                        title="Permanently Delete"
                      >
                        <DeleteForever />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      )}
    </Box>
  )
}
