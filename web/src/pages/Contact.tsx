import { motion } from 'framer-motion'
import { Box, Container, Typography, Card, Button } from '@mui/material'
import { Phone, Email, LocationOn, Schedule } from '@mui/icons-material'
import PublicLayout from '../components/PublicLayout'

export default function Contact() {
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
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 4 }}>
                <Card sx={{ p: 4, borderRadius: 3, boxShadow: '0 8px 32px rgba(0,0,0,0.08)', border: '1px solid rgba(0,0,0,0.05)' }}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 3 }}>
                    <Box sx={{ bgcolor: 'rgba(255, 203, 5, 0.1)', p: 2, borderRadius: '50%', display: 'flex', color: 'rgb(255, 203, 5)' }}>
                      <Phone sx={{ fontSize: 32 }} />
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1E377C', mb: 1 }}>Phone</Typography>
                      <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
                        (438) 763-5120
                      </Typography>
                    </Box>
                  </Box>
                </Card>

                <Card sx={{ p: 4, borderRadius: 3, boxShadow: '0 8px 32px rgba(0,0,0,0.08)', border: '1px solid rgba(0,0,0,0.05)' }}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 3 }}>
                    <Box sx={{ bgcolor: 'rgba(255, 203, 5, 0.1)', p: 2, borderRadius: '50%', display: 'flex', color: 'rgb(255, 203, 5)' }}>
                      <Email sx={{ fontSize: 32 }} />
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1E377C', mb: 1 }}>Email</Typography>
                      <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
                        beavernorthadvisors@gmail.com
                      </Typography>
                    </Box>
                  </Box>
                </Card>

                <Card sx={{ p: 4, borderRadius: 3, boxShadow: '0 8px 32px rgba(0,0,0,0.08)', border: '1px solid rgba(0,0,0,0.05)' }}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 3 }}>
                    <Box sx={{ bgcolor: 'rgba(255, 203, 5, 0.1)', p: 2, borderRadius: '50%', display: 'flex', color: 'rgb(255, 203, 5)' }}>
                      <LocationOn sx={{ fontSize: 32 }} />
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1E377C', mb: 1 }}>Location</Typography>
                      <Typography variant="body1" color="text.secondary" sx={{ mb: 0.5 }}>
                        Montreal, Canada
                      </Typography>
                    </Box>
                  </Box>
                </Card>

                <Card sx={{ p: 4, borderRadius: 3, boxShadow: '0 8px 32px rgba(0,0,0,0.08)', border: '1px solid rgba(0,0,0,0.05)' }}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 3 }}>
                    <Box sx={{ bgcolor: 'rgba(255, 203, 5, 0.1)', p: 2, borderRadius: '50%', display: 'flex', color: 'rgb(255, 203, 5)' }}>
                      <Schedule sx={{ fontSize: 32 }} />
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1E377C', mb: 1 }}>Business Hours</Typography>
                      <Typography variant="body1" color="text.secondary" sx={{ mb: 0.5 }}>
                        Mon-Fri: 9:00 AM - 6:00 PM EST
                      </Typography>
                      <Typography variant="body1" color="text.secondary">
                        Sat: 10:00 AM - 4:00 PM EST
                      </Typography>
                    </Box>
                  </Box>
                </Card>
              </Box>
            </motion.div>

            {/* Map Embed */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card sx={{ borderRadius: 3, boxShadow: '0 8px 32px rgba(0,0,0,0.08)', border: '1px solid rgba(0,0,0,0.05)', overflow: 'hidden' }}>
                <Box sx={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden' }}>
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2795.305629668466!2d-73.5707!3d45.5017!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDXCsDMwJzA2LjEiTiA3M8KwMzQnMTQuNyJX!5e0!3m2!1sen!2sca!4v1234567890&hl=en&q=Montreal+Canada"
                    width="100%"
                    height="100%"
                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </Box>
              </Card>
            </motion.div>
          </Box>
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
                  mb: 3,
                  fontSize: { xs: '2rem', md: '2.5rem' }
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
                  href="tel:+14387635120"
                  sx={{
                    bgcolor: 'rgb(255, 203, 5)',
                    color: '#1E377C',
                    px: 4,
                    py: 2,
                    borderRadius: 3,
                    fontWeight: 700,
                    fontSize: '1.1rem',
                    textTransform: 'none',
                    '&:hover': {
                      bgcolor: 'rgb(255, 193, 0)',
                      boxShadow: '0 8px 24px rgba(255, 203, 5, 0.3)'
                    }
                  }}
                >
                  Call (438) 763-5120
                </Button>
              </motion.div>
            </motion.div>
          </Container>
        </Box>
      </Box>
    </PublicLayout>
  )
}
