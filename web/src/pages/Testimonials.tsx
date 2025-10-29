import { useState, useEffect } from 'react'
import { Box, Typography, Container, Card, CardContent, Avatar, Rating, CircularProgress, Alert } from '@mui/material'
import { motion } from 'framer-motion'
import PublicLayout from '../components/PublicLayout'
import { testimonialsFallbackAPI, type Testimonial } from '../services/testimonialsFallbackAPI'
import { useI18n } from '../i18n'

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { t } = useI18n()

  useEffect(() => {
    fetchTestimonials()
  }, [])

  const fetchTestimonials = async () => {
    try {
      setLoading(true)
      console.log('🔍 Fetching active testimonials...')
      
      const response = await testimonialsFallbackAPI.getTestimonials()

      if (!response.success) {
        console.error('❌ Error fetching testimonials:', response.error)
        setError(`Failed to load testimonials: ${response.error}`)
        return
      }

      // Filter for active testimonials only
      const activeTestimonials = (response.data || []).filter(t => t.status === 'active')
      console.log('✅ Active testimonials fetched:', activeTestimonials)
      setTestimonials(activeTestimonials)
    } catch (error) {
      console.error('❌ Unexpected error:', error)
      setError(`Failed to load testimonials: ${error}`)
    } finally {
      setLoading(false)
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

  if (loading) {
    return (
      <PublicLayout>
        <Box sx={{ minHeight: '100vh', bgcolor: '#f8fafc', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Box sx={{ textAlign: 'center' }}>
            <CircularProgress sx={{ color: 'rgb(255, 203, 5)', mb: 2 }} />
            <Typography variant="h6" color="text.secondary">{t('testimonials_loading')}</Typography>
          </Box>
        </Box>
      </PublicLayout>
    )
  }

  if (error) {
    return (
      <PublicLayout>
        <Box sx={{ minHeight: '100vh', bgcolor: '#f8fafc', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Alert severity="error" sx={{ maxWidth: 500 }}>
            {error}
          </Alert>
        </Box>
      </PublicLayout>
    )
  }

  return (
    <PublicLayout>
      <Box sx={{ minHeight: '100vh', bgcolor: '#f8fafc' }}>
        {/* Hero Section */}
        <Box sx={{ 
          bgcolor: 'rgb(255, 203, 5)', 
          py: { xs: 6, md: 8 },
          textAlign: 'center'
        }}>
          <Container maxWidth="lg">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Typography 
                variant="h2" 
                component="h1" 
                sx={{ 
                  fontWeight: 700, 
                  color: '#1E377C',
                  mb: 2,
                  fontSize: { xs: '2.5rem', md: '3.5rem' }
                }}
              >
                {t('testimonials_title')}
              </Typography>
              <Typography 
                variant="h5" 
                sx={{ 
                  color: '#1E377C',
                  fontWeight: 400,
                  maxWidth: '600px',
                  mx: 'auto',
                  lineHeight: 1.6
                }}
              >
                Hear from our satisfied clients who have achieved their financial goals with our expert guidance
              </Typography>
            </motion.div>
          </Container>
        </Box>

        {/* Testimonials Grid */}
        <Container maxWidth="lg" sx={{ py: 8 }}>
          {testimonials.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
                No testimonials available at the moment
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Check back soon for client testimonials
              </Typography>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
              {testimonials.map((testimonial, index) => (
                <Box sx={{ flex: '1 1 300px', minWidth: '300px' }} key={testimonial.id}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.6 }}
                  >
                    <Card 
                      sx={{ 
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: '0 12px 24px rgba(0,0,0,0.15)'
                        }
                      }}
                    >
                      <CardContent sx={{ flexGrow: 1, p: 4 }}>
                        {/* Rating */}
                        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'center' }}>
                          <Rating 
                            value={5} 
                            readOnly 
                            sx={{ 
                              '& .MuiRating-iconFilled': {
                                color: 'rgb(255, 203, 5)'
                              }
                            }}
                          />
                        </Box>

                        {/* Testimonial Content */}
                        <Typography 
                          variant="body1" 
                          sx={{ 
                            mb: 3,
                            lineHeight: 1.7,
                            color: '#374151',
                            fontStyle: 'italic',
                            fontSize: '1.1rem'
                          }}
                        >
                          "{testimonial.testimony}"
                        </Typography>

                        {/* Client Info */}
                        <Box sx={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center',
                          gap: 2
                        }}>
                          <Avatar 
                            src={testimonial.photo_url || undefined}
                            sx={{ 
                              bgcolor: testimonial.photo_url ? 'transparent' : 'rgb(255, 203, 5)', 
                              color: testimonial.photo_url ? 'inherit' : '#1E377C',
                              fontWeight: 600,
                              width: 56,
                              height: 56
                            }}
                          >
                            {!testimonial.photo_url && getInitials(testimonial.name)}
                          </Avatar>
                          <Box sx={{ textAlign: 'center' }}>
                            <Typography 
                              variant="h6" 
                              sx={{ 
                                fontWeight: 600, 
                                color: '#1E377C',
                                mb: 0.5
                              }}
                            >
                              {testimonial.name}
                            </Typography>
                            <Typography 
                              variant="body2" 
                              sx={{ 
                                color: '#6B7280',
                                fontWeight: 500
                              }}
                            >
                              {testimonial.state}
                            </Typography>
                            <Typography 
                              variant="body2" 
                              sx={{ 
                                color: '#6B7280',
                                fontSize: '0.875rem'
                              }}
                            >
                              {testimonial.service}
                            </Typography>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  </motion.div>
                </Box>
              ))}
            </Box>
          )}
        </Container>

        {/* Call to Action */}
        <Box sx={{ 
          bgcolor: '#1E377C', 
          py: 8,
          textAlign: 'center'
        }}>
          <Container maxWidth="md">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Typography 
                variant="h3" 
                sx={{ 
                  fontWeight: 700, 
                  color: 'white',
                  mb: 3
                }}
              >
                {t('testimonials_cta_title')}
              </Typography>
              <Typography 
                variant="h6" 
                sx={{ 
                  color: 'rgba(255,255,255,0.9)',
                  mb: 4,
                  lineHeight: 1.6
                }}
              >
                {t('testimonials_cta_sub')}
              </Typography>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Box
                  component="a"
                  href="/contact"
                  sx={{
                    display: 'inline-block',
                    bgcolor: 'rgb(255, 203, 5)',
                    color: '#1E377C',
                    px: 4,
                    py: 2,
                    borderRadius: 2,
                    textDecoration: 'none',
                    fontWeight: 600,
                    fontSize: '1.1rem',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      bgcolor: 'rgb(255, 193, 0)',
                      boxShadow: '0 8px 24px rgba(255, 203, 5, 0.3)'
                    }
                  }}
                >
                  {t('testimonials_cta_button')}
                </Box>
              </motion.div>
            </motion.div>
          </Container>
        </Box>
      </Box>
    </PublicLayout>
  )
}