import { motion } from 'framer-motion'
import { useState } from 'react'
import { Box, Container, Typography, Grid, Card, CardContent, Button, TextField, FormControl, InputLabel, Select, MenuItem, TextareaAutosize } from '@mui/material'
import { Phone, Email, LocationOn, Schedule, Business, Support } from '@mui/icons-material'
import PublicLayout from '../components/PublicLayout'
import ContactModal from '../components/ContactModal'

export default function Contact() {
  const [submitted, setSubmitted] = useState(false)
  const [openModal, setOpenModal] = useState(false)

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    console.log('Contact enquiry', Object.fromEntries(form.entries()))
    setSubmitted(true)
    e.currentTarget.reset()
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
                Contact Us
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
                Get in touch with our expert advisors for personalized financial guidance
              </Typography>
            </motion.div>
          </Container>
        </Box>

        <Container maxWidth="lg" sx={{ py: 8 }}>
          <Grid container spacing={6}>
            {/* Contact Information */}
            <Grid item xs={12} md={4}>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1E377C', mb: 4 }}>
                  Get In Touch
                </Typography>
                
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  <Card sx={{ p: 3, borderRadius: 2, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box sx={{ bgcolor: 'rgba(255, 203, 5, 0.1)', p: 1.5, borderRadius: '50%', display: 'flex', color: 'rgb(255, 203, 5)' }}>
                        <Phone />
                      </Box>
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1E377C' }}>Phone</Typography>
                        <Typography variant="body2" color="text.secondary">+1 (555) 123-4567</Typography>
                        <Typography variant="body2" color="text.secondary">+91 98765 43210</Typography>
                      </Box>
                    </Box>
                  </Card>

                  <Card sx={{ p: 3, borderRadius: 2, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box sx={{ bgcolor: 'rgba(255, 203, 5, 0.1)', p: 1.5, borderRadius: '50%', display: 'flex', color: 'rgb(255, 203, 5)' }}>
                        <Email />
                      </Box>
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1E377C' }}>Email</Typography>
                        <Typography variant="body2" color="text.secondary">info@beavernorth.com</Typography>
                        <Typography variant="body2" color="text.secondary">support@beavernorth.com</Typography>
                      </Box>
                    </Box>
                  </Card>

                  <Card sx={{ p: 3, borderRadius: 2, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box sx={{ bgcolor: 'rgba(255, 203, 5, 0.1)', p: 1.5, borderRadius: '50%', display: 'flex', color: 'rgb(255, 203, 5)' }}>
                        <LocationOn />
                      </Box>
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1E377C' }}>Office</Typography>
                        <Typography variant="body2" color="text.secondary">123 Financial District</Typography>
                        <Typography variant="body2" color="text.secondary">Toronto, ON M5H 2N2</Typography>
                      </Box>
                    </Box>
                  </Card>

                  <Card sx={{ p: 3, borderRadius: 2, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box sx={{ bgcolor: 'rgba(255, 203, 5, 0.1)', p: 1.5, borderRadius: '50%', display: 'flex', color: 'rgb(255, 203, 5)' }}>
                        <Schedule />
                      </Box>
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1E377C' }}>Hours</Typography>
                        <Typography variant="body2" color="text.secondary">Mon-Fri: 9:00 AM - 6:00 PM</Typography>
                        <Typography variant="body2" color="text.secondary">Sat: 10:00 AM - 4:00 PM</Typography>
                      </Box>
                    </Box>
                  </Card>
                </Box>
              </motion.div>
            </Grid>

            {/* Contact Form */}
            <Grid item xs={12} md={8}>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Card sx={{ p: 4, borderRadius: 2, boxShadow: '0 8px 24px rgba(0,0,0,0.1)' }}>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1E377C', mb: 3 }}>
                    Send Us a Message
                  </Typography>
                  
                  {submitted ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      style={{
                        background: 'rgba(76, 175, 80, 0.1)',
                        padding: 24,
                        borderRadius: 12,
                        border: '1px solid rgba(76, 175, 80, 0.3)',
                        textAlign: 'center'
                      }}
                    >
                      <Typography variant="h6" sx={{ color: '#4CAF50', fontWeight: 'bold', mb: 1 }}>
                        Thank You!
                      </Typography>
                      <Typography variant="body1" color="text.secondary">
                        Your enquiry was received. We'll get back to you within one business day.
                      </Typography>
                    </motion.div>
                  ) : (
                    <Box component="form" onSubmit={onSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                      <TextField
                        name="name"
                        label="Full Name"
                        required
                        placeholder="Jane Doe"
                        fullWidth
                        variant="outlined"
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2
                          }
                        }}
                      />
                      
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            name="email"
                            type="email"
                            label="Email"
                            required
                            placeholder="you@example.com"
                            fullWidth
                            variant="outlined"
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                borderRadius: 2
                              }
                            }}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            name="phone"
                            label="Phone"
                            placeholder="(555) 123-4567"
                            fullWidth
                            variant="outlined"
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                borderRadius: 2
                              }
                            }}
                          />
                        </Grid>
                      </Grid>

                      <FormControl fullWidth>
                        <InputLabel>Coverage Interest</InputLabel>
                        <Select
                          name="coverage"
                          label="Coverage Interest"
                          sx={{
                            borderRadius: 2
                          }}
                        >
                          <MenuItem value="Life">Life Insurance</MenuItem>
                          <MenuItem value="Health">Health Insurance</MenuItem>
                          <MenuItem value="Home">Home Insurance</MenuItem>
                          <MenuItem value="Auto">Auto Insurance</MenuItem>
                          <MenuItem value="Business">Business Insurance</MenuItem>
                          <MenuItem value="Investment">Investment Planning</MenuItem>
                          <MenuItem value="Retirement">Retirement Planning</MenuItem>
                          <MenuItem value="Financial">Financial Planning</MenuItem>
                        </Select>
                      </FormControl>

                      <TextField
                        name="message"
                        label="Message"
                        multiline
                        rows={5}
                        placeholder="Tell us briefly about your needs"
                        fullWidth
                        variant="outlined"
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2
                          }
                        }}
                      />

                      <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                        <Button
                          type="submit"
                          variant="contained"
                          sx={{
                            bgcolor: 'rgb(255, 203, 5)',
                            color: '#1E377C',
                            fontWeight: 'bold',
                            px: 4,
                            py: 1.5,
                            borderRadius: 2,
                            '&:hover': {
                              bgcolor: 'rgb(255, 193, 0)',
                            }
                          }}
                        >
                          Send Message
                        </Button>
                        
                        <Button
                          variant="outlined"
                          onClick={() => setOpenModal(true)}
                          sx={{
                            borderColor: 'rgb(255, 203, 5)',
                            color: '#1E377C',
                            fontWeight: 'bold',
                            px: 4,
                            py: 1.5,
                            borderRadius: 2,
                            '&:hover': {
                              borderColor: 'rgb(255, 193, 0)',
                              bgcolor: 'rgba(255, 203, 5, 0.1)'
                            }
                          }}
                        >
                          Get Quote
                        </Button>
                      </Box>
                    </Box>
                  )}
                </Card>
              </motion.div>
            </Grid>
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
                Ready to Secure Your Future?
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  color: 'rgba(255,255,255,0.9)',
                  mb: 4,
                  lineHeight: 1.6
                }}
              >
                Our expert advisors are here to help you make informed financial decisions
              </Typography>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="contained"
                  onClick={() => setOpenModal(true)}
                  sx={{
                    bgcolor: 'rgb(255, 203, 5)',
                    color: '#1E377C',
                    px: 4,
                    py: 2,
                    borderRadius: 2,
                    fontWeight: 600,
                    fontSize: '1.1rem',
                    '&:hover': {
                      bgcolor: 'rgb(255, 193, 0)',
                      boxShadow: '0 8px 24px rgba(255, 203, 5, 0.3)'
                    }
                  }}
                >
                  Get Free Quote
                </Button>
              </motion.div>
            </motion.div>
          </Container>
        </Box>
      </Box>

      {/* Contact Modal */}
      <ContactModal open={openModal} onClose={() => setOpenModal(false)} />
    </PublicLayout>
  )
}


