import { useState, useEffect, useRef } from 'react'
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  Avatar,
  Tooltip,
  Alert,
  Snackbar,
  TablePagination,
  InputAdornment,
  Card,
  CardContent,
  CircularProgress
} from '@mui/material'
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Person as PersonIcon,
  LocationOn as LocationIcon,
  Business as BusinessIcon,
  RateReview as TestimonialIcon,
  CloudUpload as UploadIcon,
  Image as ImageIcon,
  Close as CloseIcon
} from '@mui/icons-material'
import { testimonialsFallbackAPI, type Testimonial } from '../services/testimonialsFallbackAPI'

export default function TestimonialsManagement() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [openDialog, setOpenDialog] = useState(false)
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all')
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' })

  const [formData, setFormData] = useState({
    name: '',
    state: '',
    testimony: '',
    service: '',
    status: 'active' as 'active' | 'inactive',
    photo_url: '' // Optional photo URL
  })

  // Image upload states
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [imageUploadSuccess, setImageUploadSuccess] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetchTestimonials()
  }, [])

  const fetchTestimonials = async () => {
    try {
      setLoading(true)
      console.log('🔍 Fetching testimonials...')
      
      const response = await testimonialsFallbackAPI.getTestimonials()

      if (!response.success) {
        console.error('❌ Error fetching testimonials:', response.error)
        setSnackbar({ open: true, message: `Failed to fetch testimonials: ${response.error}`, severity: 'error' })
        return
      }

      console.log('✅ Testimonials fetched successfully:', response.data)
      setTestimonials(response.data || [])
    } catch (error) {
      console.error('❌ Unexpected error:', error)
      setSnackbar({ open: true, message: `Failed to fetch testimonials: ${error}`, severity: 'error' })
    } finally {
      setLoading(false)
    }
  }

  const handleAddTestimonial = () => {
    setEditingTestimonial(null)
    setFormData({
      name: '',
      state: '',
      testimony: '',
      service: '',
      status: 'active' as 'active' | 'inactive',
      photo_url: ''
    })
    setOpenDialog(true)
  }

  const handleEditTestimonial = (testimonial: Testimonial) => {
    setEditingTestimonial(testimonial)
    setFormData({
      name: testimonial.name,
      state: testimonial.state,
      testimony: testimonial.testimony,
      service: testimonial.service,
      status: testimonial.status,
      photo_url: testimonial.photo_url || ''
    })
    
    // Reset image upload states when editing
    setSelectedImage(null)
    setImagePreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
    
    setOpenDialog(true)
  }

  const handleSaveTestimonial = async () => {
    try {
      console.log('🔍 Saving testimonial with data:', formData)
      
      // Prepare testimonial data
      let testimonialData = { ...formData }
      
      // Handle image upload if image is selected
      if (selectedImage) {
        console.log('📸 Uploading image...')
        const imageUrl = await uploadImageToSupabase(selectedImage)
        if (imageUrl) {
          testimonialData.photo_url = imageUrl
          console.log('✅ Image uploaded successfully:', imageUrl)
        } else {
          setSnackbar({ open: true, message: 'Failed to upload image', severity: 'error' })
          return
        }
      }
      
      if (editingTestimonial) {
        // Update existing testimonial
        console.log('📝 Updating testimonial ID:', editingTestimonial.id)
        const response = await testimonialsFallbackAPI.updateTestimonial(editingTestimonial.id, testimonialData)

        if (!response.success) {
          console.error('❌ Error updating testimonial:', response.error)
          setSnackbar({ open: true, message: `Failed to update testimonial: ${response.error}`, severity: 'error' })
          return
        }

        setSnackbar({ open: true, message: 'Testimonial updated successfully', severity: 'success' })
      } else {
        // Create new testimonial
        console.log('➕ Creating new testimonial')
        const response = await testimonialsFallbackAPI.createTestimonial(testimonialData)

        if (!response.success) {
          console.error('❌ Error creating testimonial:', response.error)
          setSnackbar({ open: true, message: `Failed to create testimonial: ${response.error}`, severity: 'error' })
          return
        }

        console.log('✅ Testimonial created successfully:', response.data)
        setSnackbar({ open: true, message: 'Testimonial created successfully', severity: 'success' })
      }

      // Reset form and close dialog
      setFormData({
        name: '',
        state: '',
        testimony: '',
        service: '',
        status: 'active',
        photo_url: ''
      })
      setSelectedImage(null)
      setImagePreview(null)
      setEditingTestimonial(null)
      setOpenDialog(false)
      
      // Refresh testimonials list
      await fetchTestimonials()
      
    } catch (error) {
      console.error('❌ Unexpected error:', error)
      setSnackbar({ open: true, message: `Failed to save testimonial: ${error}`, severity: 'error' })
    }
  }

  const handleDeleteTestimonial = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this testimonial?')) {
      try {
        const response = await testimonialsFallbackAPI.deleteTestimonial(id)

        if (!response.success) {
          console.error('❌ Error deleting testimonial:', response.error)
          setSnackbar({ open: true, message: `Failed to delete testimonial: ${response.error}`, severity: 'error' })
          return
        }

        setSnackbar({ open: true, message: 'Testimonial deleted successfully', severity: 'success' })
        fetchTestimonials()
      } catch (error) {
        console.error('❌ Unexpected error:', error)
        setSnackbar({ open: true, message: `Failed to delete testimonial: ${error}`, severity: 'error' })
      }
    }
  }

  const handleStatusChange = async (id: number, newStatus: 'active' | 'inactive') => {
    try {
      const response = await testimonialsFallbackAPI.updateTestimonial(id, { status: newStatus })

      if (!response.success) {
        console.error('❌ Error updating status:', response.error)
        setSnackbar({ open: true, message: `Failed to update status: ${response.error}`, severity: 'error' })
        return
      }

      setSnackbar({ open: true, message: 'Status updated successfully', severity: 'success' })
      fetchTestimonials()
    } catch (error) {
      console.error('❌ Unexpected error:', error)
      setSnackbar({ open: true, message: `Failed to update status: ${error}`, severity: 'error' })
    }
  }

  const getFilteredTestimonials = () => {
    let filtered = testimonials

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(testimonial =>
        testimonial.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        testimonial.state.toLowerCase().includes(searchTerm.toLowerCase()) ||
        testimonial.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
        testimonial.testimony.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(testimonial => testimonial.status === statusFilter)
    }

    return filtered
  }

  const filteredTestimonials = getFilteredTestimonials()
  const paginatedTestimonials = filteredTestimonials.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  )

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
      case 'active':
        return 'success'
      case 'inactive':
        return 'default'
      default:
        return 'default'
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  // Image upload functions
  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setSnackbar({
          open: true,
          message: 'Please select a valid image file',
          severity: 'error'
        })
        return
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setSnackbar({
          open: true,
          message: 'Image size must be less than 5MB',
          severity: 'error'
        })
        return
      }

      setSelectedImage(file)
      
      // Create preview
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const uploadImageToSupabase = async (file: File): Promise<string | null> => {
    try {
      setUploadingImage(true)
      
      // Create a unique filename
      const timestamp = Date.now()
      const fileName = `testimonial-${timestamp}-${file.name}`
      
      console.log('📸 Uploading file:', fileName, 'Size:', file.size, 'Type:', file.type)
      
      // Upload to Supabase Storage
      const { supabase } = await import('../lib/supabase')
      
      // Check if user is authenticated
      const { data: { user } } = await supabase.auth.getUser()
      console.log('👤 Current user:', user ? 'Authenticated' : 'Not authenticated')
      
      const { data, error } = await supabase.storage
        .from('testimonials')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (error) {
        console.error('❌ Upload error details:', error)
        console.error('❌ Error message:', error.message)
        console.error('❌ Error status:', error.statusCode)
        
        // Fallback: Convert to base64 for temporary storage
        console.log('🔄 Falling back to base64 storage...')
        const base64Url = await convertToBase64(file)
        
        // Show success toast for base64 fallback
        setImageUploadSuccess(true)
        setTimeout(() => setImageUploadSuccess(false), 3000)
        
        return base64Url
      }

      console.log('✅ Upload successful:', data)

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('testimonials')
        .getPublicUrl(fileName)

      console.log('🔗 Public URL:', publicUrl)
      
      // Show success toast
      setImageUploadSuccess(true)
      setTimeout(() => setImageUploadSuccess(false), 3000)
      
      return publicUrl
    } catch (error) {
      console.error('❌ Upload error:', error)
      
      // Fallback: Convert to base64 for temporary storage
      console.log('🔄 Falling back to base64 storage...')
      const base64Url = await convertToBase64(file)
      
      // Show success toast for base64 fallback
      setImageUploadSuccess(true)
      setTimeout(() => setImageUploadSuccess(false), 3000)
      
      return base64Url
    } finally {
      setUploadingImage(false)
    }
  }

  const convertToBase64 = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }

  const removeSelectedImage = () => {
    setSelectedImage(null)
    setImagePreview(null)
    setFormData({ ...formData, photo_url: '' })
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
    setSnackbar({ 
      open: true, 
      message: 'Photo removed successfully', 
      severity: 'success' 
    })
  }

  if (loading) {
    return (
      <Box sx={{ p: 3, display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <Typography>Loading testimonials...</Typography>
      </Box>
    )
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1E377C' }}>
          Testimonials Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddTestimonial}
          sx={{
            bgcolor: 'rgb(255, 203, 5)',
            color: '#1E377C',
            fontWeight: 600,
            '&:hover': {
              bgcolor: 'rgb(255, 193, 0)'
            }
          }}
        >
          Add Testimonial
        </Button>
      </Box>

      {/* Stats Cards */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 3 }}>
        <Card sx={{ borderRadius: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.1)', flex: '1 1 200px', minWidth: '200px' }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{ bgcolor: 'rgb(255, 203, 5)', color: '#1E377C' }}>
                <TestimonialIcon />
              </Avatar>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1E377C' }}>
                  {testimonials.length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Testimonials
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
        <Card sx={{ borderRadius: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.1)', flex: '1 1 200px', minWidth: '200px' }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{ bgcolor: '#4CAF50', color: 'white' }}>
                <PersonIcon />
              </Avatar>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1E377C' }}>
                  {testimonials.filter(t => t.status === 'active').length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Active Testimonials
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
        <Card sx={{ borderRadius: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.1)', flex: '1 1 200px', minWidth: '200px' }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{ bgcolor: '#FF9800', color: 'white' }}>
                <BusinessIcon />
              </Avatar>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1E377C' }}>
                  {new Set(testimonials.map(t => t.service)).size}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Services Covered
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
        <Card sx={{ borderRadius: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.1)', flex: '1 1 200px', minWidth: '200px' }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{ bgcolor: '#9C27B0', color: 'white' }}>
                <LocationIcon />
              </Avatar>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1E377C' }}>
                  {new Set(testimonials.map(t => t.state)).size}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  States Covered
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* Filters */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <TextField
          placeholder="Search testimonials..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: '#6B7280' }} />
              </InputAdornment>
            )
          }}
          sx={{ minWidth: 250 }}
        />
        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as 'all' | 'active' | 'inactive')}
            label="Status"
          >
            <MenuItem value="all">All Status</MenuItem>
            <MenuItem value="active">Active</MenuItem>
            <MenuItem value="inactive">Inactive</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Table */}
      <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#F8F9FA' }}>
              <TableCell sx={{ fontWeight: 'bold', color: '#1E377C' }}>Client</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: '#1E377C' }}>State</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: '#1E377C' }}>Service</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: '#1E377C' }}>Testimony</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: '#1E377C' }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: '#1E377C' }}>Created</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: '#1E377C' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedTestimonials.map((testimonial) => (
              <TableRow key={testimonial.id} hover>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar 
                      src={testimonial.photo_url || undefined}
                      sx={{ 
                        bgcolor: testimonial.photo_url ? 'transparent' : 'rgb(255, 203, 5)', 
                        color: testimonial.photo_url ? 'inherit' : '#1E377C', 
                        width: 40, 
                        height: 40 
                      }}
                    >
                      {!testimonial.photo_url && getInitials(testimonial.name)}
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#1E377C' }}>
                        {testimonial.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {testimonial.state}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <LocationIcon sx={{ fontSize: 16, color: '#6B7280' }} />
                    <Typography variant="body2">{testimonial.state}</Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip
                    label={testimonial.service}
                    size="small"
                    sx={{
                      bgcolor: 'rgba(255, 203, 5, 0.1)',
                      color: '#1E377C',
                      fontWeight: 500
                    }}
                  />
                </TableCell>
                <TableCell>
                  <Typography
                    variant="body2"
                    sx={{
                      maxWidth: 300,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical'
                    }}
                  >
                    {testimonial.testimony}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={testimonial.status}
                    color={getStatusColor(testimonial.status) as any}
                    size="small"
                    onClick={() => handleStatusChange(testimonial.id, testimonial.status === 'active' ? 'inactive' : 'active')}
                    sx={{ cursor: 'pointer' }}
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="caption" color="text.secondary">
                    {formatDate(testimonial.created_at)}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Stack direction="row" spacing={1}>
                    <Tooltip title="Edit">
                      <IconButton
                        size="small"
                        onClick={() => handleEditTestimonial(testimonial)}
                        sx={{ color: 'rgb(255, 203, 5)' }}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteTestimonial(testimonial.id)}
                        sx={{ color: '#F44336' }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
          <Pagination
            count={Math.max(1, Math.ceil(testimonials.length / rowsPerPage))}
            page={page + 1}
            onChange={(_e, value) => setPage(value - 1)}
            showFirstButton
            showLastButton
            color="primary"
          />
        </Box>
      </TableContainer>

      {/* Add/Edit Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ color: '#1E377C', fontWeight: 'bold' }}>
          {editingTestimonial ? 'Edit Testimonial' : 'Add New Testimonial'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField
              label="Client Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              fullWidth
              required
            />
            {/* Image Upload Section */}
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, color: '#1E377C' }}>
                Client Photo (Optional)
              </Typography>
              
              {/* Image Preview */}
              {imagePreview && (
                <Box sx={{ mb: 2, textAlign: 'center' }}>
                  <Box sx={{ position: 'relative', display: 'inline-block' }}>
                    <img
                      src={imagePreview}
                      alt="Preview"
                      style={{
                        width: 120,
                        height: 120,
                        objectFit: 'cover',
                        borderRadius: '50%',
                        border: '2px solid #e0e0e0'
                      }}
                    />
                    <IconButton
                      size="small"
                      onClick={removeSelectedImage}
                      sx={{
                        position: 'absolute',
                        top: -8,
                        right: -8,
                        bgcolor: 'error.main',
                        color: 'white',
                        '&:hover': { bgcolor: 'error.dark' }
                      }}
                    >
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  </Box>
                  <Box sx={{ mt: 1 }}>
                    <Button
                      size="small"
                      variant="outlined"
                      color="error"
                      startIcon={<CloseIcon />}
                      onClick={removeSelectedImage}
                      sx={{ fontSize: '0.75rem' }}
                    >
                      Remove Photo
                    </Button>
                  </Box>
                </Box>
              )}

              {/* Show existing photo if editing */}
              {editingTestimonial && editingTestimonial.photo_url && !imagePreview && (
                <Box sx={{ mb: 2, textAlign: 'center' }}>
                  <Box sx={{ position: 'relative', display: 'inline-block' }}>
                    <img
                      src={editingTestimonial.photo_url}
                      alt="Current Photo"
                      style={{
                        width: 120,
                        height: 120,
                        objectFit: 'cover',
                        borderRadius: '50%',
                        border: '2px solid #e0e0e0'
                      }}
                    />
                  </Box>
                  <Box sx={{ mt: 1 }}>
                    <Button
                      size="small"
                      variant="outlined"
                      color="error"
                      startIcon={<CloseIcon />}
                      onClick={() => {
                        setFormData({ ...formData, photo_url: '' })
                        setSnackbar({ 
                          open: true, 
                          message: 'Photo will be removed when you save changes', 
                          severity: 'success' 
                        })
                      }}
                      sx={{ fontSize: '0.75rem' }}
                    >
                      Remove Current Photo
                    </Button>
                  </Box>
                </Box>
              )}

              {/* Upload Button */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageSelect}
                  accept="image/*"
                  style={{ display: 'none' }}
                />
                <Button
                  variant="outlined"
                  startIcon={uploadingImage ? <CircularProgress size={20} /> : <UploadIcon />}
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingImage}
                  sx={{
                    borderColor: '#417F73',
                    color: '#417F73',
                    '&:hover': {
                      borderColor: '#1E377C',
                      color: '#1E377C',
                      bgcolor: 'rgba(30, 55, 124, 0.05)'
                    }
                  }}
                >
                  {uploadingImage ? 'Uploading...' : 'Upload Photo'}
                </Button>
                
                {selectedImage && (
                  <Typography variant="caption" color="text.secondary">
                    {selectedImage.name}
                  </Typography>
                )}
              </Box>
              
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                Supported formats: JPG, PNG, GIF. Max size: 5MB. Leave empty to use initials avatar.
              </Typography>
            </Box>
            <FormControl fullWidth>
              <InputLabel>State/Province</InputLabel>
              <Select
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                label="State/Province"
              >
                <MenuItem value="">Select your province</MenuItem>
                <MenuItem value="Alberta">Alberta</MenuItem>
                <MenuItem value="British Columbia">British Columbia</MenuItem>
                <MenuItem value="Manitoba">Manitoba</MenuItem>
                <MenuItem value="New Brunswick">New Brunswick</MenuItem>
                <MenuItem value="Newfoundland and Labrador">Newfoundland and Labrador</MenuItem>
                <MenuItem value="Northwest Territories">Northwest Territories</MenuItem>
                <MenuItem value="Nova Scotia">Nova Scotia</MenuItem>
                <MenuItem value="Nunavut">Nunavut</MenuItem>
                <MenuItem value="Ontario">Ontario</MenuItem>
                <MenuItem value="Prince Edward Island">Prince Edward Island</MenuItem>
                <MenuItem value="Quebec">Quebec</MenuItem>
                <MenuItem value="Saskatchewan">Saskatchewan</MenuItem>
                <MenuItem value="Yukon">Yukon</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Service</InputLabel>
              <Select
                value={formData.service}
                onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                label="Service"
              >
                <MenuItem value="">Select service</MenuItem>
                <MenuItem value="Term Life Insurance">Term Life Insurance</MenuItem>
                <MenuItem value="Whole Life Insurance">Whole Life Insurance</MenuItem>
                <MenuItem value="Non-Medical Life Insurance">Non-Medical Life Insurance</MenuItem>
                <MenuItem value="Mortgage Life Insurance">Mortgage Life Insurance</MenuItem>
                <MenuItem value="Senior Life Insurance">Senior Life Insurance</MenuItem>
                <MenuItem value="Travel Insurance">Travel Insurance</MenuItem>
                <MenuItem value="Health Insurance">Health Insurance</MenuItem>
                <MenuItem value="Auto Insurance">Auto Insurance</MenuItem>
                <MenuItem value="Home Insurance">Home Insurance</MenuItem>
                <MenuItem value="Investment Planning">Investment Planning</MenuItem>
                <MenuItem value="Retirement Planning">Retirement Planning</MenuItem>
                <MenuItem value="Financial Planning">Financial Planning</MenuItem>
                <MenuItem value="Tax Planning">Tax Planning</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Testimony"
              value={formData.testimony}
              onChange={(e) => setFormData({ ...formData, testimony: e.target.value })}
              multiline
              rows={4}
              fullWidth
              required
            />
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'inactive' })}
                label="Status"
              >
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button
            onClick={handleSaveTestimonial}
            variant="contained"
            sx={{
              bgcolor: 'rgb(255, 203, 5)',
              color: '#1E377C',
              '&:hover': { bgcolor: 'rgb(255, 193, 0)' }
            }}
          >
            {editingTestimonial ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* Image Upload Success Toast */}
      <Snackbar
        open={imageUploadSuccess}
        autoHideDuration={3000}
        onClose={() => setImageUploadSuccess(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setImageUploadSuccess(false)}
          severity="success"
          sx={{ width: '100%' }}
          icon={<ImageIcon />}
        >
          🎉 Image uploaded successfully!
        </Alert>
      </Snackbar>
    </Box>
  )
}
