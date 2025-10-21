import { Box, Typography, Container, Card, CardContent, Grid, Avatar, Rating } from '@mui/material'
import { motion } from 'framer-motion'
import PublicLayout from '../components/PublicLayout'

interface Testimonial {
  id: number
  name: string
  role: string
  company: string
  content: string
  rating: number
  avatar?: string
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Small Business Owner",
    company: "Johnson & Associates",
    content: "BeaverNorth Advisors helped us secure comprehensive insurance coverage that perfectly fits our business needs. Their personalized approach and deep understanding of our industry made all the difference.",
    rating: 5,
    avatar: "SJ"
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Family Man",
    company: "Tech Professional",
    content: "The financial planning services provided by BeaverNorth Advisors have given our family peace of mind. They took the time to understand our goals and created a plan that works for our unique situation.",
    rating: 5,
    avatar: "MC"
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    role: "Retiree",
    company: "Former Teacher",
    content: "After retirement, I was overwhelmed with managing my finances. BeaverNorth Advisors simplified everything and helped me maximize my retirement income while protecting my assets.",
    rating: 5,
    avatar: "ER"
  },
  {
    id: 4,
    name: "David Thompson",
    role: "Entrepreneur",
    company: "Thompson Industries",
    content: "The investment advice from BeaverNorth Advisors has been invaluable. They helped diversify my portfolio and achieve steady growth while managing risk appropriately.",
    rating: 5,
    avatar: "DT"
  },
  {
    id: 5,
    name: "Lisa Wang",
    role: "New Parent",
    company: "Healthcare Professional",
    content: "When we had our first child, we knew we needed life insurance but didn't know where to start. BeaverNorth Advisors made the process simple and found us the perfect policy.",
    rating: 5,
    avatar: "LW"
  },
  {
    id: 6,
    name: "Robert Martinez",
    role: "Senior Executive",
    company: "Manufacturing Corp",
    content: "The tax reduction strategies recommended by BeaverNorth Advisors have saved us thousands of dollars annually. Their expertise in tax planning is exceptional.",
    rating: 5,
    avatar: "RM"
  }
]

export default function Testimonials() {
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
                Client Testimonials
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
          <Grid container spacing={4}>
            {testimonials.map((testimonial, index) => (
              <Grid size={{ xs: 12, md: 6 }} key={testimonial.id}>
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
                          value={testimonial.rating} 
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
                        "{testimonial.content}"
                      </Typography>

                      {/* Client Info */}
                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        gap: 2
                      }}>
                        <Avatar 
                          sx={{ 
                            bgcolor: 'rgb(255, 203, 5)', 
                            color: '#1E377C',
                            fontWeight: 600,
                            width: 56,
                            height: 56
                          }}
                        >
                          {testimonial.avatar}
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
                            {testimonial.role}
                          </Typography>
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              color: '#6B7280',
                              fontSize: '0.875rem'
                            }}
                          >
                            {testimonial.company}
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
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
                Ready to Join Our Success Stories?
              </Typography>
              <Typography 
                variant="h6" 
                sx={{ 
                  color: 'rgba(255,255,255,0.9)',
                  mb: 4,
                  lineHeight: 1.6
                }}
              >
                Let us help you achieve your financial goals with personalized advice and expert guidance
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
                  Get Started Today
                </Box>
              </motion.div>
            </motion.div>
          </Container>
        </Box>
      </Box>
    </PublicLayout>
  )
}
