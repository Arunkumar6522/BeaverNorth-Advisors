import './App.css'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Box, Typography, Button, Card, Avatar } from '@mui/material'
import { ArrowForward, PlayArrow, Campaign, Person, Security, Business, LocalHospital } from '@mui/icons-material'
import Nav from './components/Nav'
import TopBar from './components/TopBar'
import Footer from './components/Footer'
import ContactModal from './components/ContactModal'

export default function App() {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false)
  
  const services = [
    { 
      title: "Life Insurance", 
      desc: "Protect your family's future with comprehensive life insurance policies tailored to your needs and budget.",
      iconComponent: <Security sx={{ fontSize: 48, color: '#8B5CF6' }} />
    },
    { 
      title: "Business Insurance", 
      desc: "Secure your business operations with specialized coverage designed for Canadian entrepreneurs and companies.",
      iconComponent: <Business sx={{ fontSize: 48, color: '#F59E0B' }} />
    },
    { 
      title: "Health Insurance", 
      desc: "Comprehensive health coverage including dental, vision, and extended care for all family members.",
      iconComponent: <LocalHospital sx={{ fontSize: 48, color: '#EF4444' }} />
    }
  ]

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#FFFFFF' }}>
      <TopBar />
      <Nav />
      
      {/* HERO Section - Smart Life Style */}
      <Box sx={{
        minHeight: '100vh',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        backgroundColor: '#F8FAFC'
      }}>
        
        <Box sx={{ 
          width: '100%', 
          maxWidth: '1400px', 
          mx: 'auto', 
          px: { xs: 4, md: 6 },
          py: 8
        }}>
          <Box sx={{ 
            display: { xs: 'block', lg: 'flex' },
            alignItems: 'center',
            gap: 8,
            minHeight: '80vh'
          }}>
            
            {/* LEFT SIDE - Content */}
            <Box sx={{ 
              flex: 1, 
              textAlign: { xs: 'center', lg: 'left' },
              pr: { xs: 0, lg: 4 }
            }}>
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}>
                
                {/* Main Headline */}
                <Typography variant="h1" sx={{ 
                  fontWeight: 800,
                  fontSize: { xs: '3rem', md: '4rem', lg: '4.5rem' },
                  lineHeight: 1.1,
                  mb: 4,
                  color: '#1E293B'
                }}>
                  Smart Insurance for your{' '}
                  <span style={{ 
                    color: '#F59E0B',
                    position: 'relative'
                  }}>
                    better family life
                    <Box sx={{
                      position: 'absolute',
                      bottom: '8px',
                      left: 0,
                      right: 0,
                      height: '4px',
                      background: 'linear-gradient(90deg, #F59E0B, #EF4444)',
                      opacity: 0.7
                    }} />
                  </span>
                </Typography>

                {/* Description */}
                <Typography variant="h5" sx={{ 
                  color: '#64748B', 
                  fontWeight: 400,
                  mb: 6,
                  lineHeight: 1.6,
                  fontSize: { xs: '1.1rem', md: '1.3rem' },
                  maxWidth: { xs: '100%', lg: '600px' }
                }}>
                  Only BeaverNorth Advisors gives you professional insurance guidance with guaranteed safety 
                  and comprehensive coverage options for your Canadian family.
                </Typography>

                {/* Primary CTA Buttons */}
                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: { xs: 'column', sm: 'row' }, 
                  gap: 3,
                  mb: 8,
                  justifyContent: { xs: 'center', lg: 'flex-start' },
                  alignItems: 'center'
                }}>
                  <Button
                    onClick={() => setIsContactModalOpen(true)}
                    variant="contained"
                    size="large"
                    endIcon={<ArrowForward />}
                    sx={{
                      bgcolor: '#8B5CF6',
                      color: 'white',
                      px: 6,
                      py: 3,
                      fontSize: '1.1rem',
                      fontWeight: 700,
                      borderRadius: 3,
                      textTransform: 'none',
                      minWidth: '240px',
                      boxShadow: '0 8px 25px rgba(139,92,246,0.3)',
                          '&:hover': {
                            bgcolor: '#7C3AED',
                                  transform: 'translateY(-2px)',
                            boxShadow: '0 12px 35px rgba(139,92,246,0.4)'
                          },
                          transition: 'all 0.3s ease'
                    }}
                  >
                    Get Started
                  </Button>
                  
                  <Button
                    variant="outlined"
                    size="large"
                    startIcon={<PlayArrow />}
                    sx={{
                      borderColor: '#8B5CF6',
                      color: '#8B5CF6',
                      px: 5,
                      py: 3,
                      fontSize: '1rem',
                      fontWeight: 600,
                      borderRadius: 3,
                      textTransform: 'none',
                      minWidth: '200px',
                      borderWidth: 2,
                      '&:hover': {
                        bgcolor: '#8B5CF620',
                        borderWidth: 2
                      },
                      transition: 'all 0.3s ease'
                          }}
                  >
                    Watch Video
                  </Button>
                </Box>

                {/* Quick Action Cards */}
                <Box sx={{ 
                  display: 'flex',
                  gap: 3,
                  justifyContent: { xs: 'center', lg: 'flex-start' },
                  flexWrap: 'wrap'
                }}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <Box sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                      p: 3,
                      borderRadius: 3,
                      bgcolor: 'white',
                      border: '2px solid #E2E8F0',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      minWidth: '180px',
                      '&:hover': {
                        borderColor: '#8B5CF6',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 8px 25px rgba(139,92,246,0.15)'
                      }
                    }}>
                      <Campaign sx={{ color: '#8B5CF6', fontSize: 28 }} />
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 700, color: '#1E293B', mb: 0.5 }}>
                          Make a claim
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#64748B', fontSize: '0.8rem' }}>
                          Quick & easy process
                        </Typography>
                      </Box>
                    </Box>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <Box sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                      p: 3,
                      borderRadius: 3,
                      bgcolor: 'white',
                      border: '2px solid #E2E8F0',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      minWidth: '180px',
                      '&:hover': {
                        borderColor: '#F59E0B',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 8px 25px rgba(245,158,11,0.15)'
                      }
                    }}>
                      <Person sx={{ color: '#F59E0B', fontSize: 28 }} />
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 700, color: '#1E293B', mb: 0.5 }}>
                          Find an Agent
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#64748B', fontSize: '0.8rem' }}>
                          Local Canadian experts
                        </Typography>
                      </Box>
                    </Box>
                  </motion.div>
                </Box>
              </motion.div>
            </Box>

            {/* RIGHT SIDE - Family Image with Stats Overlay */}
            <Box sx={{ 
              flex: 1,
              position: 'relative',
              display: 'flex',
              justifyContent: 'center'
            }}>
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <Box sx={{
                  position: 'relative',
                  maxWidth: '600px',
                  width: '100%',
                  aspectRatio: '4/5',
                  borderRadius: 4,
                  overflow: 'hidden',
                  boxShadow: '0 25px 50px rgba(0,0,0,0.15)'
                }}>
                  {/* Main Family Image Background */}
                  <Box sx={{
                    width: '100%',
                    height: '100%',
                    background: `
                      linear-gradient(135deg, rgba(139,92,246,0.1) 0%, rgba(245,158,11,0.1) 100%),
                      url('https://images.unsplash.com/photo-1511895426328-dc8714191300?q=80&w=1000&auto=format&fit=crop') center/cover no-repeat
                    `,
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    
                    {/* Abstract Shapes */}
                    <Box sx={{
                      position: 'absolute',
                      top: '20%',
                      left: '10%',
                      width: 120,
                      height: 120,
                      borderRadius: '50%',
                      background: 'linear-gradient(45deg, rgba(139,92,246,0.3), rgba(245,158,11,0.2))',
                      filter: 'blur(20px)'
                    }} />
                    <Box sx={{
                      position: 'absolute',
                      bottom: '30%',
                      right: '15%',
                      width: 80,
                      height: 80,
                      borderRadius: '30%',
                      background: 'linear-gradient(45deg, rgba(245,158,11,0.3), rgba(239,68,68,0.2))',
                      filter: 'blur(15px)'
                    }} />
                    <Box sx={{
                      position: 'absolute',
                      top: '60%',
                      left: '5%',
                      width: 60,
                      height: 60,
                      background: 'linear-gradient(45deg, rgba(249,250,251,0.8), rgba(255,255,255,0.9))',
                      borderRadius: 3,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255,255,255,0.3)'
                    }}>
                      <img 
                        src="/favicon.png" 
                        alt="BeaverNorth" 
                        style={{ 
                          height: '32px', 
                          width: '32px',
                          filter: 'brightness(0) saturate(100%)'
                        }} 
                      />
                    </Box>

                    {/* Customer Stats Overlay */}
                    <Box sx={{
                      position: 'absolute',
                      bottom: '15%',
                      right: '10%',
                      bgcolor: 'rgba(255,255,255,0.95)',
                      borderRadius: 4,
                      p: 3,
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255,255,255,0.3)',
                      boxShadow: '0 15px 35px rgba(0,0,0,0.1)',
                      maxWidth: '280px'
                    }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                        <Typography variant="h4" sx={{ fontWeight: 800, color: '#8B5CF6' }}>
                          26K+
                        </Typography>
                        <Typography variant="h4" sx={{ fontWeight: 700, color: '#1E293B' }}>
                          Happy Customers
                        </Typography>
                      </Box>
                      
                      {/* Customer Avatars */}
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        {[1,2,3,4,5,6].map((i) => (
                          <Avatar
                            key={i}
                            sx={{ 
                              width: 36, 
                              height: 36,
                              bgcolor: ['#8B5CF6', '#F59E0B', '#EF4444', '#22C55E', '#3B82F6', '#A855F7'][i-1]
                            }}
                          >
                            <Typography variant="caption" sx={{ color: 'white', fontWeight: 700 }}>
                              {['J','S','M','L','A','T'][i-1]}
                            </Typography>
                          </Avatar>
                        ))}
                        <Avatar sx={{ width: 36, height: 36, bgcolor: '#64748B' }}>
                          <Typography variant="caption" sx={{ color: 'white', fontWeight: 700 }}>
                            +
                          </Typography>
                        </Avatar>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </motion.div>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* OUR SERVICES Section */}
      <Box sx={{ py: { xs: 16, md: 20 }, bgcolor: '#F8FAFC' }}>
        <Box sx={{ maxWidth: '1400px', mx: 'auto', px: { xs: 4, md: 6 } }}>
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <Box sx={{ textAlign: 'center', mb: 16 }}>
              <Typography variant="h3" sx={{ 
                color: '#F59E0B',
                fontWeight: 700,
                fontSize: '0.9rem',
                letterSpacing: '2px',
                textTransform: 'uppercase',
                mb: 2
              }}>
                OUR SERVICES
              </Typography>
              
              <Typography variant="h2" sx={{ 
                fontWeight: 800, 
                mb: 4,
                color: '#1E293B',
                fontSize: { xs: '2rem', md: '3rem' }
              }}>
                Insurance that rewarding you & your family.
              </Typography>
              
              <Typography variant="h6" sx={{ 
                color: '#64748B', 
                fontWeight: 400,
                maxWidth: '600px',
                mx: 'auto',
                lineHeight: 1.6
              }}>
                Valuable assistance to the Canadian community and particularly to the families we serve 
                with comprehensive protection and peace of mind.
              </Typography>
            </Box>

            <Box sx={{ 
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', lg: 'repeat(3, 1fr)' },
              gap: 6,
              maxWidth: '1200px',
              mx: 'auto'
            }}>
              {services.map((service, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2, duration: 0.6 }}
                >
                  <Card sx={{
                    borderRadius: 4,
                    overflow: 'hidden',
                    bgcolor: 'white',
                    border: '1px solid #E2E8F0',
                    transition: 'all 0.4s ease',
                    cursor: 'pointer',
                    height: '100%',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 25px 50px rgba(0,0,0,0.1)',
                      borderColor: '#8B5CF6'
                    }
                  }}>
                    {/* Service Image Header */}
                    <Box sx={{
                      height: '220px',
                      background: `
                        linear-gradient(135deg, rgba(139,92,246,0.1) 0%, rgba(245,158,11,0.1) 100%),
                        url('https://images.unsplash.com/photo-${index === 0 ? '1582750433449-648ed127bb54' : index === 1 ? '1596394516099-e8d9d9c7f1b5' : '1559757178-0f49fe82d9b9'}?q=80&w=800&auto=format&fit=crop') center/cover no-repeat
                      `,
                      position: 'relative',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <Box sx={{
                        position: 'absolute',
                        top: '20px',
                        right: '20px',
                        bgcolor: 'rgba(255,255,255,0.9)',
                        borderRadius: 3,
                        p: 2,
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255,255,255,0.3)'
                      }}>
                        {service.iconComponent}
                      </Box>
                    </Box>

                    {/* Service Content */}
                    <Box sx={{ p: 5 }}>
                      <Typography variant="h4" sx={{ 
                        fontWeight: 700, 
                        mb: 3,
                        color: '#1E293B',
                        fontSize: { xs: '1.3rem', md: '1.5rem' }
                      }}>
                        {service.title}
                      </Typography>
                      <Typography variant="body1" sx={{ 
                        color: '#64748B', 
                        lineHeight: 1.6,
                        fontSize: '1rem',
                        mb: 4
                      }}>
                        {service.desc}
                      </Typography>
                      
                      <Button
                        variant="outlined"
                        size="large"
                        sx={{
                          borderColor: '#8B5CF6',
                          color: '#8B5CF6',
                          fontWeight: 600,
                          px: 4,
                          py: 2,
                          borderRadius: 3,
                          textTransform: 'none',
                          fontSize: '1rem',
                          borderWidth: 2,
                          width: '100%',
                          '&:hover': {
                            bgcolor: '#8B5CF6',
                            color: 'white',
                            borderWidth: 2
                          },
                          transition: 'all 0.3s ease'
                        }}
                      >
                        Learn More →
                      </Button>
                    </Box>
                  </Card>
                </motion.div>
              ))}
            </Box>
          </motion.div>
        </Box>
      </Box>

      {/* FINAL CTA Section */}
      <Box sx={{ 
        bgcolor: '#8B5CF6', 
        py: { xs: 16, md: 20 },
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Background Elements */}
        <Box sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `
            radial-gradient(circle at 30% 20%, rgba(245,158,11,0.2) 0%, transparent 60%),
            radial-gradient(circle at 70% 80%, rgba(255,255,255,0.1) 0%, transparent 60%)
          `,
          backgroundSize: '800px 800px, 600px 600px'
        }} />

        <Box sx={{ maxWidth: '1000px', mx: 'auto', px: { xs: 4, md: 6 }, position: 'relative', zIndex: 2 }}>
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h2" sx={{ 
                color: 'white', 
                fontWeight: 800, 
                mb: 4,
                fontSize: { xs: '2.2rem', md: '3rem' }
              }}>
                Ready to Protect Your Canadian Family?
              </Typography>
              <Typography variant="h6" sx={{ 
                color: 'rgba(255,255,255,0.9)', 
                mb: 8,
                fontWeight: 400,
                lineHeight: 1.6,
                maxWidth: '700px',
                mx: 'auto'
              }}>
                Get personalized insurance advice from licensed Canadian advisors. 
                No obligation, no pressure - just expert guidance tailored to your family's needs.
              </Typography>
              
              <Box sx={{ 
                display: 'flex', 
                flexDirection: { xs: 'column', md: 'row' }, 
                gap: 4, 
                justifyContent: 'center',
                alignItems: 'center'
              }}>
                <Button
                  onClick={() => setIsContactModalOpen(true)}
                  variant="contained"
                  size="large"
                  endIcon={<ArrowForward />}
                  sx={{
                    bgcolor: '#F59E0B',
                    color: 'white',
                    px: 8,
                    py: 4,
                    fontSize: '1.2rem',
                    fontWeight: 800,
                    borderRadius: 4,
                    textTransform: 'none',
                    minWidth: '300px',
                    boxShadow: '0 12px 40px rgba(245,158,11,0.4)',
                    '&:hover': {
                      bgcolor: '#D97706',
                      transform: 'translateY(-4px)',
                      boxShadow: '0 20px 60px rgba(245,158,11,0.5)'
                    },
                    transition: 'all 0.4s ease'
                  }}
                >
                  Get Free Insurance Quote
                </Button>
              </Box>
            </Box>
          </motion.div>
        </Box>
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