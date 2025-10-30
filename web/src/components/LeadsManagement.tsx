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
  Pagination
} from '@mui/material'
import {
  Search as SearchIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Close as CloseIcon,
  Add as AddIcon
} from '@mui/icons-material'
import { useLocation } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { customAuth } from '../lib/custom-auth'

interface Lead {
  id: string
  firstName: string
  lastName: string
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
  contacted_by?: string
  converted_by?: string
  created_by?: string
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
  const location = useLocation()
  
  // Helper functions for date range calculations (commented out as date filtering is disabled)
  // const getDateRange = () => {
  //   const now = new Date()
  //   const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  //   
  //   if (dateRangeType === 'custom') {
  //     return {
  //       start: customStartDate ? new Date(customStartDate) : null,
  //       end: customEndDate ? new Date(customEndDate) : null
  //     }
  //   }
  //   
  //   switch (presetDateRange) {
  //     case 'today':
  //       return { start: today, end: new Date(today.getTime() + 24 * 60 * 60 * 1000 - 1) }
  //     case 'yesterday':
  //       const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000)
  //       return { start: yesterday, end: new Date(yesterday.getTime() + 24 * 60 * 60 * 1000 - 1) }
  //     case 'thisWeek':
  //       const startOfWeek = new Date(today)
  //       startOfWeek.setDate(today.getDate() - today.getDay())
  //       return { start: startOfWeek, end: new Date(today.getTime() + 24 * 60 * 60 * 1000 - 1) }
  //     case 'thisMonth':
  //       const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  //       return { start: startOfMonth, end: new Date(today.getTime() + 24 * 60 * 60 * 1000 - 1) }
  //     default:
  //       return { start: null, end: null }
  //   }
  // }
  const [leads, setLeads] = useState<Lead[]>([])  // Start with empty array, will load from Supabase
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setFilter] = useState<'all' | 'new' | 'contacted' | 'converted' | 'overall'>('all')
  const [currentTab, setCurrentTab] = useState<'active' | 'closed'>('active')
  
  // Date range filter states (commented out as date filtering is disabled)
  // const [dateRangeType, setDateRangeType] = useState<'preset' | 'custom'>('preset')
  // const [presetDateRange, setPresetDateRange] = useState<'today' | 'yesterday' | 'thisWeek' | 'thisMonth'>('today')
  // const [customStartDate, setCustomStartDate] = useState<string>('')
  // const [customEndDate, setCustomEndDate] = useState<string>('')
  
  // Modal states
  const [viewModalOpen, setViewModalOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [addLeadModalOpen, setAddLeadModalOpen] = useState(false)
  
  // Edit modal states
  const [editLeadId, setEditLeadId] = useState<string | null>(null)
  const [editStatus, setEditStatus] = useState<'new' | 'contacted' | 'converted'>('new')
  const [editNotes, setEditNotes] = useState('')
  const [editDateOption, setEditDateOption] = useState<'today' | 'yesterday' | 'custom'>('today')
  const [editCustomDate, setEditCustomDate] = useState<string>('')
  
  // Delete modal states
  const [deleteLeadId, setDeleteLeadId] = useState<string | null>(null)
  const [deleteReason, setDeleteReason] = useState('')
  const [deleteComment, setDeleteComment] = useState('')
  
  // Add lead modal states
  const [addLeadForm, setAddLeadForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dob: '',
    province: '',
    smokingStatus: '' as '' | 'smoker' | 'non-smoker',
    insuranceProduct: '' as '' | 'term-life' | 'whole-life' | 'non-medical' | 'mortgage-life' | 'senior-life' | 'travel',
    notes: ''
  })
  
  // Pagination
  const [page, setPage] = useState(0)
  const [rowsPerPage] = useState(10)
  
  // Sorting
  const [sortField, setSortField] = useState<'created_at' | 'last_contact_date'>('created_at')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')

  // Tab change handler
  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue === 0 ? 'active' : 'closed')
    setPage(0) // Reset to first page when switching tabs
  }

  // Handle URL parameters
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search)
    const filter = searchParams.get('filter')
    const tab = searchParams.get('tab')
    
    if (filter && ['new', 'contacted', 'converted'].includes(filter)) {
      setFilter(filter as 'new' | 'contacted' | 'converted')
    }
    
    if (tab === 'closed') {
      setCurrentTab('closed')
    }
  }, [location.search])

  // Fetch leads from Supabase
  useEffect(() => {
    const fetchLeads = async () => {
      try {
        console.log('🔄 Fetching leads from Supabase...')
        
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
            const activeLeads = data.filter((lead: any) => !lead.deleted_at)
            console.log(`📊 Active leads (deleted_at is null): ${activeLeads.length}`)
            
            setLeads(activeLeads.map((lead: any) => ({
              id: lead.id ? lead.id.toString() : String(Math.random()),
              firstName: lead.name ? lead.name.split(' ')[0] : '',
              lastName: lead.name ? lead.name.split(' ').slice(1).join(' ') : '',
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
              deleted_at: lead.deleted_at || undefined,
              contacted_by: lead.contacted_by || undefined,
              converted_by: lead.converted_by || undefined,
              created_by: lead.created_by || undefined
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
    if (statusFilter !== 'all' && statusFilter !== 'overall') {
      filtered = filtered.filter(lead => lead.status === statusFilter)
    }

    // Filter by date range - DISABLED to show all leads
    // const dateRange = getDateRange()
    // if (dateRange.start && dateRange.end) {
    //   filtered = filtered.filter(lead => {
    //     const leadDate = new Date(lead.created_at)
    //     return leadDate >= dateRange.start! && leadDate <= dateRange.end!
    //   })
    // }

    // Sort by date
    filtered.sort((a, b) => {
      let dateA: Date
      let dateB: Date
      
      if (sortField === 'created_at') {
        dateA = new Date(a.created_at)
        dateB = new Date(b.created_at)
      } else {
        // Use last_contact_date if available, otherwise fallback to created_at
        dateA = new Date(a.last_contact_date || a.created_at)
        dateB = new Date(b.last_contact_date || b.created_at)
      }
      
      if (sortDirection === 'asc') {
        return dateA.getTime() - dateB.getTime()
      } else {
        return dateB.getTime() - dateA.getTime()
      }
    })

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
      const target = leads.find(l => l.id === leadId)
      if (!target) return
      const oldStatus = target.status
      // Guard: prevent reopening/changing status for closed (converted) leads
      if (oldStatus === 'converted' && newStatus !== 'converted') {
        alert('This lead is closed and its status cannot be changed.')
        return
      }

      const leadName = target.name
      const updateData: Partial<Lead> = { status: newStatus }
      if (notes !== undefined) {
        updateData.notes = notes as any
      }

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
              notes: updateData.notes || notes || lead.notes,
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
      const username = customAuth.getCurrentUser()?.username || 'Admin'
      
      console.log('📝 Attempting to log activity:', { leadId, activityType, description })
      
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
        console.error('❌ Error details:', error.message, error.details, error.hint)
        
        // Show user-friendly error
        if (error.message.includes('relation "activity_log" does not exist')) {
          console.error('🚨 ACTIVITY_LOG TABLE DOES NOT EXIST!')
          console.error('📋 Please run the SQL script in Supabase SQL Editor first!')
          alert('⚠️ Activity logging not set up yet. Please run the SQL script in Supabase first.')
          
          // TEMPORARY: Store in localStorage as fallback
          const tempActivity = {
            id: Date.now().toString(),
            lead_id: leadId,
            activity_type: activityType,
            description: description,
            old_value: oldValue,
            new_value: newValue,
            performed_by: username,
            created_at: new Date().toISOString()
          }
          
          const existingActivities = JSON.parse(localStorage.getItem('temp_activities') || '[]')
          existingActivities.unshift(tempActivity)
          localStorage.setItem('temp_activities', JSON.stringify(existingActivities.slice(0, 20))) // Keep last 20
          
          console.log('💾 Activity saved to localStorage as fallback')
        }
      } else {
        console.log('✅ Activity logged successfully:', activityType)
      }
    } catch (error) {
      console.error('❌ Error logging activity:', error)
    }
  }

  // Function to add a new lead manually
  const handleAddLead = async () => {
    try {
      const { supabase } = await import('../lib/supabase')
      const username = customAuth.getCurrentUser()?.username || 'Admin'
      
      const leadData: any = {
        name: `${addLeadForm.firstName} ${addLeadForm.lastName}`.trim(),
        email: addLeadForm.email,
        phone: addLeadForm.phone,
        dob: addLeadForm.dob,
        province: addLeadForm.province,
        country_code: '+1',
        smoking_status: addLeadForm.smokingStatus,
        insurance_product: addLeadForm.insuranceProduct,
        status: 'new',
        notes: addLeadForm.notes
      }

      // Add created_by info to notes until SQL script is run
      if (addLeadForm.notes) {
        leadData.notes = `${addLeadForm.notes}\n\nCreated by: ${username}`
      } else {
        leadData.notes = `Created by: ${username}`
      }

      console.log('💾 Adding new lead:', leadData)

      const { data, error } = await supabase
        .from('leads')
        .insert([leadData])
        .select()

      if (error) {
        console.error('❌ Error adding lead:', error)
        alert('Failed to add lead. Please try again.')
        return
      }

      if (data && data.length > 0) {
        console.log('✅ Lead added successfully:', data[0])
        
        // Add to local state
        const newLead = {
          id: data[0].id.toString(),
          firstName: addLeadForm.firstName,
          lastName: addLeadForm.lastName,
          name: leadData.name,
          email: addLeadForm.email,
          phone: addLeadForm.phone,
          dob: addLeadForm.dob,
          province: addLeadForm.province,
          smoking_status: addLeadForm.smokingStatus,
          insurance_product: addLeadForm.insuranceProduct,
          status: 'new' as const,
          created_at: data[0].created_at,
          notes: leadData.notes
        }
        
        setLeads([newLead, ...leads])
        
        // Log activity
        await logActivity(
          data[0].id.toString(),
          'lead_created',
          `Manual lead created: ${leadData.name}`,
          undefined,
          'new'
        )
        
        // Send email notification
        try {
          // Use Netlify function in production, local server in development
          const emailApiUrl = window.location.hostname === 'localhost' 
            ? 'http://localhost:3001/api/send-lead-notification'
            : '/.netlify/functions/send-lead-notification'
          
          const emailResponse = await fetch(emailApiUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              leadData: {
                name: leadData.name,
                email: addLeadForm.email,
                phone: addLeadForm.phone,
                dob: addLeadForm.dob,
                province: addLeadForm.province,
                smokingStatus: addLeadForm.smokingStatus,
                insuranceProduct: addLeadForm.insuranceProduct,
                notes: addLeadForm.notes
              }
            })
          })
          
          if (emailResponse.ok) {
            const emailResult = await emailResponse.json()
            console.log('✅ Lead notification email sent:', emailResult.message)
          } else {
            console.log('⚠️ Failed to send lead notification email')
          }
        } catch (emailError) {
          console.error('❌ Email notification error:', emailError)
        }

        // Send SMS notification
        try {
          // Use Netlify function in production, local server in development
          const smsApiUrl = window.location.hostname === 'localhost' 
            ? 'http://localhost:3001/api/send-lead-sms'
            : '/.netlify/functions/send-lead-sms'
          
          const smsResponse = await fetch(smsApiUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              leadData: {
                name: leadData.name,
                email: addLeadForm.email,
                phone: addLeadForm.phone,
                dob: addLeadForm.dob,
                province: addLeadForm.province,
                smokingStatus: addLeadForm.smokingStatus,
                insuranceProduct: addLeadForm.insuranceProduct,
                notes: addLeadForm.notes
              }
            })
          })
          
          if (smsResponse.ok) {
            const smsResult = await smsResponse.json()
            console.log('✅ Lead notification SMS sent:', smsResult.message)
          } else {
            console.log('⚠️ Failed to send lead notification SMS')
          }
        } catch (smsError) {
          console.error('❌ SMS notification error:', smsError)
        }
        
        // Reset form and close modal
        setAddLeadForm({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          dob: '',
          province: '',
          smokingStatus: '',
          insuranceProduct: '',
          notes: ''
        })
        setAddLeadModalOpen(false)
        
        alert('Lead added successfully!')
      }
    } catch (error) {
      console.error('❌ Error adding lead:', error)
      alert('Failed to add lead. Please try again.')
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
      const username = customAuth.getCurrentUser()?.username || 'Admin'
      
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
      case 'new': return '#1E377C' // Professional Blue
      case 'contacted': return '#417F73' // Trust Green
      case 'converted': return 'rgb(255, 203, 5)' // Confidence Gold
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
      {/* Header removed (Top bar already shows module name) */}

      {/* Tabs and Search Bar */}
      <Box sx={{ px: 1, borderBottom: 1, borderColor: 'divider', flexShrink: 0 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
          <Tabs value={currentTab === 'active' ? 0 : 1} onChange={handleTabChange}>
            <Tab 
              label={
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Typography sx={{ fontSize: '1rem' }}>Active Leads</Typography>
                  <Chip 
                    label={leads.filter(l => l.status !== 'converted' && !l.deleted_at).length} 
                    size="small" 
                    sx={{ backgroundColor: 'rgb(255, 203, 5)', color: '#1E377C', fontSize: '0.75rem' }} />
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
          
          {/* Filters Container - Responsive Layout */}
          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', md: 'row' }, 
            alignItems: { xs: 'stretch', md: 'center' }, 
            gap: 2,
            flexWrap: 'wrap'
          }}>
            {/* Top Row - Main Actions */}
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 2,
              flexWrap: 'wrap',
              minWidth: 0
            }}>
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                onClick={() => setAddLeadModalOpen(true)}
                sx={{ 
                  backgroundColor: 'rgb(255, 203, 5)',
                  '&:hover': { backgroundColor: 'rgb(255, 193, 0)' },
                  textTransform: 'none',
                  fontWeight: 600,
                  flexShrink: 0
                }}
              >
                Add Lead
              </Button>
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
                sx={{ minWidth: 200, width: { xs: '100%', sm: 200 } }}
              />
            </Box>

            {/* Bottom Row - Filters */}
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 2,
              flexWrap: 'wrap',
              minWidth: 0
            }}>
              {/* Status filter for Active Leads tab */}
              {currentTab === 'active' && (
                <FormControl size="small" sx={{ minWidth: 120 }}>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={statusFilter}
                    label="Status"
                    onChange={(e) => setFilter(e.target.value)}
                  >
                    <MenuItem value="all">All</MenuItem>
                    <MenuItem value="new">New</MenuItem>
                    <MenuItem value="contacted">Contacted</MenuItem>
                    <MenuItem value="overall">Overall</MenuItem>
                  </Select>
                </FormControl>
              )}

              {/* Sort by Date */}
              <FormControl size="small" sx={{ minWidth: 140 }}>
                <InputLabel>Sort By</InputLabel>
                <Select
                  value={sortField}
                  label="Sort By"
                  onChange={(e) => setSortField(e.target.value as 'created_at' | 'last_contact_date')}
                >
                  <MenuItem value="created_at">Created Date</MenuItem>
                  <MenuItem value="last_contact_date">Last Contact</MenuItem>
                </Select>
              </FormControl>

              {/* Sort Direction */}
              <FormControl size="small" sx={{ minWidth: 100 }}>
                <InputLabel>Order</InputLabel>
                <Select
                  value={sortDirection}
                  label="Order"
                  onChange={(e) => setSortDirection(e.target.value as 'asc' | 'desc')}
                >
                  <MenuItem value="desc">Newest First</MenuItem>
                  <MenuItem value="asc">Oldest First</MenuItem>
                </Select>
              </FormControl>

              {/* Date Range Filter - HIDDEN as requested */}
              {/* <FormControl size="small" sx={{ minWidth: 140 }}>
                <InputLabel>Date Range</InputLabel>
                <Select
                  value={dateRangeType}
                  label="Date Range"
                  onChange={(e) => setDateRangeType(e.target.value)}
                >
                  <MenuItem value="preset">Preset</MenuItem>
                  <MenuItem value="custom">Custom</MenuItem>
                </Select>
              </FormControl>

              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>Period</InputLabel>
                <Select
                  value={presetDateRange}
                  label="Period"
                  onChange={(e) => setPresetDateRange(e.target.value)}
                >
                  <MenuItem value="today">Today</MenuItem>
                  <MenuItem value="yesterday">Yesterday</MenuItem>
                  <MenuItem value="thisWeek">This Week</MenuItem>
                  <MenuItem value="thisMonth">This Month</MenuItem>
                </Select>
              </FormControl>

              <TextField
                size="small"
                type="date"
                label="Start Date"
                value={customStartDate}
                onChange={(e) => setCustomStartDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
                sx={{ minWidth: 140 }}
              />
              <TextField
                size="small"
                type="date"
                label="End Date"
                value={customEndDate}
                onChange={(e) => setCustomEndDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
                sx={{ minWidth: 140 }}
              /> */}
            </Box>
          </Box>
        </Box>
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
                        <Avatar sx={{ bgcolor: 'rgb(255, 203, 5)', width: 40, height: 40 }}>
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
                          <EmailIcon sx={{ fontSize: 16, color: '#1E377C' }} />
                          <Typography 
                            variant="body2"
                            sx={{ 
                              color: '#1E377C',
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
                          <PhoneIcon sx={{ fontSize: 16, color: '#1E377C' }} />
                          <Typography 
                            variant="body2"
                            sx={{ 
                              color: '#1E377C',
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
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
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
                        {lead.status === 'contacted' && lead.notes && lead.notes.includes('Contacted by:') && (
                          <Typography variant="caption" sx={{ color: '#6B7280', fontSize: '0.7rem' }}>
                            {lead.notes.split('\n').find(line => line.includes('Contacted by:'))}
                          </Typography>
                        )}
                        {lead.status === 'converted' && lead.notes && lead.notes.includes('Converted by:') && (
                          <Typography variant="caption" sx={{ color: '#6B7280', fontSize: '0.7rem' }}>
                            {lead.notes.split('\n').find(line => line.includes('Converted by:'))}
                          </Typography>
                        )}
                        {lead.status === 'new' && lead.notes && lead.notes.includes('Created by:') && (
                          <Typography variant="caption" sx={{ color: '#6B7280', fontSize: '0.7rem' }}>
                            {lead.notes.split('\n').find(line => line.includes('Created by:'))}
                          </Typography>
                        )}
                      </Box>
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
                            color: 'rgb(255, 203, 5)',
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
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
            <Pagination
              count={Math.max(1, Math.ceil(filteredLeads.length / rowsPerPage))}
              page={page + 1}
              onChange={(_e, value) => setPage(value - 1)}
              showFirstButton
              showLastButton
              color="primary"
            />
          </Box>
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
                <Avatar sx={{ bgcolor: 'rgb(255, 203, 5)', width: 60, height: 60 }}>
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
                        color: '#1E377C', 
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
                        color: '#1E377C', 
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

            {/* Date Selection for Status Change */}
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel>Date</InputLabel>
              <Select
                value={editDateOption}
                label="Date"
                onChange={(e) => setEditDateOption(e.target.value)}
              >
                <MenuItem value="today">Today</MenuItem>
                <MenuItem value="yesterday">Yesterday</MenuItem>
                <MenuItem value="custom">Custom Date</MenuItem>
              </Select>
            </FormControl>

            {/* Custom Date Input */}
            {editDateOption === 'custom' && (
              <TextField
                fullWidth
                type="date"
                label="Select Date"
                value={editCustomDate}
                onChange={(e) => setEditCustomDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
                sx={{ mb: 3 }}
              />
            )}
            
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

      {/* Add Lead Modal */}
      <Dialog open={addLeadModalOpen} onClose={() => setAddLeadModalOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Add New Lead</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
              <TextField
                fullWidth
                label="First Name"
                required
                InputLabelProps={{ sx: { '& .MuiFormLabel-asterisk': { color: '#EF4444' } } }}
                value={addLeadForm.firstName}
                onChange={(e) => setAddLeadForm({...addLeadForm, firstName: e.target.value})}
                placeholder="Enter first name"
              />
              <TextField
                fullWidth
                label="Last Name"
                value={addLeadForm.lastName}
                onChange={(e) => setAddLeadForm({...addLeadForm, lastName: e.target.value})}
                placeholder="Enter last name (optional)"
              />
            </Box>

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
              <TextField
                fullWidth
                label="Phone"
                required
                InputLabelProps={{ sx: { '& .MuiFormLabel-asterisk': { color: '#EF4444' } } }}
                value={addLeadForm.phone}
                onChange={(e) => setAddLeadForm({...addLeadForm, phone: e.target.value})}
                placeholder="e.g., +1 555 123 4567"
              />
              <TextField
                fullWidth
                label="Date of Birth"
                required
                InputLabelProps={{ sx: { '& .MuiFormLabel-asterisk': { color: '#EF4444' } } }}
                value={addLeadForm.dob}
                onChange={(e) => setAddLeadForm({...addLeadForm, dob: e.target.value})}
                placeholder="YYYY-MM-DD"
              />
            </Box>

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
              <FormControl fullWidth required>
                <InputLabel sx={{ '& .MuiFormLabel-asterisk': { color: '#EF4444' } }}>Smoking Status</InputLabel>
                <Select
                  value={addLeadForm.smokingStatus}
                  label="Smoking Status"
                  onChange={(e) => setAddLeadForm({...addLeadForm, smokingStatus: e.target.value as 'smoker' | 'non-smoker' | ''})}
                  displayEmpty
                  sx={{
                    '& .MuiSelect-select': {
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }
                  }}
                  renderValue={(selected) => {
                    if (!selected) {
                      return <em style={{ color: '#9CA3AF' }}>Select smoking status</em>
                    }
                    return selected as string
                  }}
                >
                  <MenuItem value="">
                    <em>Select smoking status</em>
                  </MenuItem>
                  <MenuItem value="non-smoker">Non-smoker</MenuItem>
                  <MenuItem value="smoker">Smoker</MenuItem>
                </Select>
              </FormControl>
              
              <FormControl fullWidth required>
                <InputLabel sx={{ '& .MuiFormLabel-asterisk': { color: '#EF4444' } }}>Insurance Product</InputLabel>
                <Select
                  value={addLeadForm.insuranceProduct}
                  label="Insurance Product"
                  onChange={(e) => setAddLeadForm({...addLeadForm, insuranceProduct: e.target.value as any})}
                  displayEmpty
                  sx={{
                    '& .MuiSelect-select': {
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }
                  }}
                  renderValue={(selected) => {
                    if (!selected) {
                      return <em style={{ color: '#9CA3AF' }}>Select insurance product</em>
                    }
                    return (
                      {
                        'term-life': 'Term Life Insurance',
                        'whole-life': 'Whole Life Insurance',
                        'non-medical': 'Non-Medical Insurance',
                        'mortgage-life': 'Mortgage Life Insurance',
                        'senior-life': 'Senior Life Insurance',
                        'travel': 'Travel Insurance'
                      } as Record<string, string>
                    )[selected as string] || (selected as string)
                  }}
                >
                  <MenuItem value="">
                    <em>Select insurance product</em>
                  </MenuItem>
                  <MenuItem value="term-life">Term Life Insurance</MenuItem>
                  <MenuItem value="whole-life">Whole Life Insurance</MenuItem>
                  <MenuItem value="non-medical">Non-Medical Insurance</MenuItem>
                  <MenuItem value="mortgage-life">Mortgage Life Insurance</MenuItem>
                  <MenuItem value="senior-life">Senior Life Insurance</MenuItem>
                  <MenuItem value="travel">Travel Insurance</MenuItem>
                </Select>
              </FormControl>
            </Box>

            <TextField
              fullWidth
              label="Province"
              required
              InputLabelProps={{ sx: { '& .MuiFormLabel-asterisk': { color: '#EF4444' } } }}
              value={addLeadForm.province}
              onChange={(e) => setAddLeadForm({...addLeadForm, province: e.target.value})}
              placeholder="Enter province"
            />
            
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={addLeadForm.email}
              onChange={(e) => setAddLeadForm({...addLeadForm, email: e.target.value})}
              required
            />
            
            <TextField
              fullWidth
              label="Notes"
              multiline
              rows={3}
              value={addLeadForm.notes}
              onChange={(e) => setAddLeadForm({...addLeadForm, notes: e.target.value})}
              placeholder="Additional notes about this lead..."
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddLeadModalOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleAddLead} 
            color="primary" 
            variant="contained"
            disabled={!addLeadForm.firstName || !addLeadForm.lastName || !addLeadForm.email || !addLeadForm.phone || !addLeadForm.province}
          >
            Add Lead
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}