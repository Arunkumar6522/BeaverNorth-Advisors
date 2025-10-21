import './App.css'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Box, Typography, Button, Container, Grid, Card, CardContent, Avatar, Rating, Chip } from '@mui/material'
import { ArrowForward, CalendarToday, OpenInNew } from '@mui/icons-material'
import Nav from './components/Nav'
import Footer from './components/Footer'
import ContactModal from './components/ContactModal'
import InsuranceCarousel from './components/InsuranceCarousel'
import AsuransiSVG from './assets/Asuransi keluarga 1.svg'
import { useI18n } from './i18n'
import { testimonialsFallbackAPI, type Testimonial } from './services/testimonialsFallbackAPI'
import { useNavigate } from 'react-router-dom'

export default function App() {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false)
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [recentBlogs, setRecentBlogs] = useState<any[]>([])
  const [loadingTestimonials, setLoadingTestimonials] = useState(true)
  const [loadingBlogs, setLoadingBlogs] = useState(true)
  const { t } = useI18n()
  const navigate = useNavigate()

  // Fetch testimonials
  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const response = await testimonialsFallbackAPI.getTestimonials()
        if (response.success && response.data) {
          const activeTestimonials = response.data.filter(t => t.status === 'active').slice(0, 3)
          setTestimonials(activeTestimonials)
        }
      } catch (error) {
        console.error('Error fetching testimonials:', error)
      } finally {
        setLoadingTestimonials(false)
      }
    }
    fetchTestimonials()
  }, [])

  // Fetch recent blogs
  useEffect(() => {
    const fetchRecentBlogs = async () => {
      try {
        const apiUrl = import.meta.env.DEV ? 'http://localhost:3001/api/blog-posts' : '/.netlify/functions/blog-posts'
        const response = await fetch(apiUrl)
        if (response.ok) {
          const data = await response.json()
          if (data.success && data.posts) {
            setRecentBlogs(data.posts.slice(0, 3))
          }
        }
      } catch (error) {
        console.error('Error fetching blogs:', error)
      } finally {
        setLoadingBlogs(false)
      }
    }
    fetchRecentBlogs()
  }, [])

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const stripHtml = (html: string) => {
    const tmp = document.createElement('div')
    tmp.innerHTML = html
    return tmp.textContent || tmp.innerText || ''
  }

  const getExcerpt = (content: string, maxLength: number = 100) => {
    const cleanContent = stripHtml(content)
    return cleanContent.length > maxLength 
      ? cleanContent.substring(0, maxLength) + '...'
      : cleanContent
  }

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#F3F8FF' }}>
      <Nav />
      
      {/* HERO Section - Minimalist Clean Design */}
      <Box sx={{
        minHeight: 'calc(100vh - 100px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        px: { xs: 3, md: 6 },
        py: { xs: 4, md: 6 }
      }}>
        
        <Box sx={{ 
          maxWidth: '1400px',
          width: '100%',
          display: { xs: 'flex', lg: 'grid' },
          gridTemplateColumns: { lg: '1fr 1fr' },
          flexDirection: { xs: 'column-reverse', lg: 'row' },
          alignItems: 'center',
          gap: { xs: 6, lg: 8 }
        }}>
          
          {/* LEFT SIDE - Content */}
          <Box sx={{ 
            textAlign: { xs: 'center', lg: 'left' },
            display: 'flex',
            flexDirection: 'column',
            alignItems: { xs: 'center', lg: 'flex-start' }
          }}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              {/* Title */}
              <Typography 
                variant="h1" 
                sx={{ 
                  fontWeight: 800,
                  fontSize: { xs: '2.5rem', md: '3.5rem', lg: '4.5rem' },
                  lineHeight: 1.1,
                  mb: 3,
                  color: '#1E377C'
                }}
              >
                {t('hero_headline_1')} {t('hero_headline_2')}
              </Typography>

              {/* Subheading */}
              <Typography 
                variant="h5" 
                sx={{ 
                  color: '#417F73', 
                  fontWeight: 400,
                  mb: 6,
                  lineHeight: 1.6,
                  fontSize: { xs: '1.1rem', md: '1.3rem' },
                  maxWidth: '600px'
                }}
              >
                {t('hero_subtitle')}
              </Typography>

              {/* CTA Button */}
              <Button
                onClick={() => setIsContactModalOpen(true)}
                variant="contained"
                size="large"
                endIcon={<ArrowForward />}
                sx={{
                  bgcolor: 'rgb(255, 203, 5)',
                  color: '#1E377C',
                  px: 6,
                  py: 3,
                  fontSize: '1.1rem',
                  fontWeight: 700,
                  borderRadius: 3,
                  textTransform: 'none',
                  boxShadow: '0 8px 24px rgba(255, 203, 5, 0.3)',
                  '&:hover': {
                    bgcolor: 'rgb(255, 193, 0)',
                    color: '#1E377C',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 12px 32px rgba(255, 203, 5, 0.4)'
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                {t('cta_get_quote')}
              </Button>
            </motion.div>
          </Box>

          {/* RIGHT SIDE - Asuransi SVG */}
          <Box sx={{ 
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              style={{ width: '100%', maxWidth: '600px' }}
            >
              <img 
                src={AsuransiSVG} 
                alt="Insurance Family"
                style={{ 
                  width: '100%', 
                  height: 'auto',
                  display: 'block'
                }} 
              />
            </motion.div>
          </Box>
        </Box>
      </Box>

      {/* Insurance Companies Carousel */}
      <InsuranceCarousel />

      {/* Testimonials Section */}
      <Box sx={{ 
        bgcolor: 'white',
        py: { xs: 6, md: 8 },
        borderTop: '1px solid rgba(0,0,0,0.05)'
      }}>
        <Container maxWidth="lg">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Box sx={{ textAlign: 'center', mb: 6 }}>
              <Typography 
                variant="h3" 
                sx={{ 
                  fontWeight: 700, 
                  color: '#1E377C', 
                  mb: 3,
                  fontSize: { xs: '2rem', md: '2.5rem' }
                }}
              >
                What Our Clients Say
              </Typography>
              <Typography 
                variant="h6" 
                sx={{ 
                  color: '#417F73', 
                  fontWeight: 400,
                  maxWidth: 600,
                  margin: '0 auto',
                  fontSize: { xs: '1rem', md: '1.1rem' }
                }}
              >
                Real stories from families who have improved their financial well-being with our guidance
              </Typography>
            </Box>

            {loadingTestimonials ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="body1" color="text.secondary">
                  Loading testimonials...
                </Typography>
              </Box>
            ) : testimonials.length > 0 ? (
              <Grid container spacing={4}>
                {testimonials.map((testimonial, index) => (
                  <Grid size={{ xs: 12, md: 4 }} key={testimonial.id}>
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.2 }}
                    >
                      <Card sx={{ 
                        height: '100%',
                        minHeight: 280, // Fixed minimum height for consistency
                        borderRadius: 4,
                        boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
                        border: '1px solid rgba(0,0,0,0.05)',
                        transition: 'all 0.3s ease',
                        display: 'flex',
                        flexDirection: 'column',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: '0 16px 48px rgba(0,0,0,0.12)'
                        }
                      }}>
                        <CardContent sx={{ 
                          p: 4, 
                          display: 'flex', 
                          flexDirection: 'column', 
                          height: '100%',
                          justifyContent: 'space-between'
                        }}>
                          <Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                              <Avatar 
                                src={testimonial.photo_url || undefined}
                                sx={{ 
                                  bgcolor: testimonial.photo_url ? 'transparent' : '#417F73', 
                                  color: testimonial.photo_url ? 'inherit' : 'white',
                                  width: 48,
                                  height: 48,
                                  mr: 2,
                                  fontSize: '1.1rem',
                                  fontWeight: 600
                                }}
                              >
                                {!testimonial.photo_url && getInitials(testimonial.name)}
                              </Avatar>
                              <Box>
                                <Typography variant="h6" sx={{ fontWeight: 600, color: '#1E377C', mb: 0.5 }}>
                                  {testimonial.name}
                                </Typography>
                                <Typography variant="body2" sx={{ color: '#6B7280' }}>
                                  {testimonial.state}
                                </Typography>
                              </Box>
                            </Box>
                            
                            <Rating 
                              value={5} 
                              readOnly 
                              sx={{ mb: 2, '& .MuiRating-iconFilled': { color: 'rgb(255, 203, 5)' } }} 
                            />
                            
                            <Typography 
                              variant="body2" 
                              sx={{ 
                                color: '#374151',
                                lineHeight: 1.6,
                                fontStyle: 'italic',
                                mb: 2,
                                minHeight: 60, // Fixed height for testimony text
                                display: '-webkit-box',
                                WebkitLineClamp: 3,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden'
                              }}
                            >
                              "{testimonial.testimony}"
                            </Typography>
                          </Box>
                          
                          <Box sx={{ mt: 'auto' }}>
                            <Chip
                              label={testimonial.service}
                              size="small"
                              sx={{
                                bgcolor: 'rgba(255, 203, 5, 0.1)',
                                color: '#1E377C',
                                fontWeight: 500,
                                fontSize: '0.75rem'
                              }}
                            />
                          </Box>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="body1" color="text.secondary">
                  No testimonials available at the moment.
                </Typography>
              </Box>
            )}

            <Box sx={{ textAlign: 'center', mt: 6 }}>
              <Button
                variant="outlined"
                onClick={() => navigate('/testimonial')}
                sx={{
                  borderColor: '#417F73',
                  color: '#417F73',
                  fontWeight: 600,
                  px: 4,
                  py: 1.5,
                  borderRadius: 3,
                  textTransform: 'none',
                  '&:hover': {
                    borderColor: '#1E377C',
                    color: '#1E377C',
                    bgcolor: 'rgba(30, 55, 124, 0.05)'
                  }
                }}
              >
                View All Testimonials
              </Button>
            </Box>
          </motion.div>
        </Container>
      </Box>

      {/* Recent Blogs Section */}
      <Box sx={{ 
        bgcolor: '#f8fafc',
        py: { xs: 6, md: 8 },
        borderTop: '1px solid rgba(0,0,0,0.05)'
      }}>
        <Container maxWidth="lg">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Box sx={{ textAlign: 'center', mb: 6 }}>
              <Typography 
                variant="h3" 
                sx={{ 
                  fontWeight: 700, 
                  color: '#1E377C', 
                  mb: 3,
                  fontSize: { xs: '2rem', md: '2.5rem' }
                }}
              >
                Latest Financial Insights
              </Typography>
              <Typography 
                variant="h6" 
                sx={{ 
                  color: '#417F73', 
                  fontWeight: 400,
                  maxWidth: 600,
                  margin: '0 auto',
                  fontSize: { xs: '1rem', md: '1.1rem' }
                }}
              >
                Stay informed with our latest articles on financial planning, insurance, and wealth building
              </Typography>
            </Box>

            {loadingBlogs ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="body1" color="text.secondary">
                  Loading blog posts...
                </Typography>
              </Box>
            ) : recentBlogs.length > 0 ? (
              <Grid container spacing={4}>
                {recentBlogs.map((blog, index) => (
                  <Grid size={{ xs: 12, md: 4 }} key={blog.link}>
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.2 }}
                    >
                      <Card sx={{ 
                        height: '100%',
                        borderRadius: 4,
                        boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
                        border: '1px solid rgba(0,0,0,0.05)',
                        transition: 'all 0.3s ease',
                        cursor: 'pointer',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: '0 16px 48px rgba(0,0,0,0.12)'
                        }
                      }}
                      onClick={() => {
                        const postId = blog.link.split('/').pop()?.split('.html')[0]
                        navigate(`/blog/${postId}`)
                      }}>
                        <CardContent sx={{ p: 4 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                            <CalendarToday sx={{ fontSize: 16, color: '#6B7280' }} />
                            <Typography variant="caption" color="text.secondary">
                              {formatDate(blog.pubDate)}
                            </Typography>
                          </Box>
                          
                          <Typography 
                            variant="h6" 
                            sx={{ 
                              fontWeight: 600, 
                              color: '#1E377C',
                              mb: 2,
                              lineHeight: 1.3,
                              fontSize: { xs: '1rem', md: '1.1rem' },
                              cursor: 'pointer',
                              '&:hover': { color: '#417F73' }
                            }}
                          >
                            {blog.title}
                          </Typography>
                          
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              color: '#6B7280',
                              lineHeight: 1.6,
                              mb: 3,
                              fontSize: { xs: '0.85rem', md: '0.9rem' }
                            }}
                          >
                            {getExcerpt(blog.content, 120)}
                          </Typography>
                          
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Typography 
                              variant="body2" 
                              sx={{ 
                                color: '#417F73',
                                fontWeight: 500,
                                fontSize: '0.85rem'
                              }}
                            >
                              Read More
                            </Typography>
                            <OpenInNew sx={{ fontSize: 16, color: '#417F73' }} />
                          </Box>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="body1" color="text.secondary">
                  No blog posts available at the moment.
                </Typography>
              </Box>
            )}

            <Box sx={{ textAlign: 'center', mt: 6 }}>
              <Button
                variant="outlined"
                onClick={() => navigate('/blog')}
                sx={{
                  borderColor: '#417F73',
                  color: '#417F73',
                  fontWeight: 600,
                  px: 4,
                  py: 1.5,
                  borderRadius: 3,
                  textTransform: 'none',
                  '&:hover': {
                    borderColor: '#1E377C',
                    color: '#1E377C',
                    bgcolor: 'rgba(30, 55, 124, 0.05)'
                  }
                }}
              >
                View All Blog Posts
              </Button>
            </Box>
          </motion.div>
        </Container>
      </Box>

      <Footer />
      
      {/* Contact Modal */}
      <ContactModal 
        isOpen={isContactModalOpen} 
        onClose={() => setIsContactModalOpen(false)} 
      />
    </Box>
  )
}
