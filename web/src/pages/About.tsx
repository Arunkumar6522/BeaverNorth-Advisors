import { Box, Typography, Container, Grid, Card, CardContent, Button } from '@mui/material'
import { 
  TrendingUp, 
  AccountBalance, 
  Security, 
  CreditCard, 
  School,
  CheckCircle,
  Schedule,
  Phone,
  Email,
  LocationOn,
  Savings
} from '@mui/icons-material'
import { motion } from 'framer-motion'
import PublicLayout from '../components/PublicLayout'
import shantoshiniPhoto from '../assets/insurance companies/sgini.png'

export default function About() {
  const services = [
    {
      icon: <Security sx={{ fontSize: 48, color: '#1E377C' }} />,
      title: 'Life Insurance',
      description: 'Comprehensive life insurance solutions tailored to your family\'s needs and financial goals.',
      color: '#1E377C'
    },
    {
      icon: <TrendingUp sx={{ fontSize: 48, color: '#417F73' }} />,
      title: 'Investment Planning',
      description: 'Strategic investment planning for long-term wealth building and retirement security.',
      color: '#417F73'
    },
    {
      icon: <AccountBalance sx={{ fontSize: 48, color: '#6983CC' }} />,
      title: 'Budgeting',
      description: 'Personalized budgeting strategies to optimize your finances and track your spending effectively.',
      color: '#6983CC'
    },
    {
      icon: <Savings sx={{ fontSize: 48, color: '#10B981' }} />,
      title: 'Savings',
      description: 'Expert guidance to build emergency funds and achieve your savings goals efficiently.',
      color: '#10B981'
    },
    {
      icon: <CreditCard sx={{ fontSize: 48, color: '#FF6B35' }} />,
      title: 'Debt Management',
      description: 'Effective debt reduction and management solutions to improve your financial health.',
      color: '#FF6B35'
    },
    {
      icon: <School sx={{ fontSize: 48, color: '#8B5CF6' }} />,
      title: 'Financial Education',
      description: 'Comprehensive education and guidance to improve your financial literacy and confidence.',
      color: '#8B5CF6'
    }
  ]

  const stats = [
    { number: '100%', label: 'Complimentary Consultation', icon: <CheckCircle sx={{ fontSize: 32, color: 'rgb(255, 203, 5)' }} /> },
    { number: 'LLQP', label: 'Licensed Professional', icon: <Security sx={{ fontSize: 32, color: 'rgb(255, 203, 5)' }} /> }
  ]

  return (
    <PublicLayout>
      <Box sx={{ minHeight: '100vh', bgcolor: '#f8fafc' }}>
        {/* Hero Section */}
        <Box sx={{ 
          bgcolor: 'rgb(255, 203, 5)',
          color: '#1E377C',
          py: { xs: 8, md: 12 },
          position: 'relative',
          overflow: 'hidden',
          textAlign: 'center'
        }}>
          {/* Background Pattern */}
          <Box sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: 'radial-gradient(circle at 20% 80%, rgba(30, 55, 124, 0.08) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(30, 55, 124, 0.08) 0%, transparent 50%)',
            zIndex: 1
          }} />
          
          <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Box sx={{ textAlign: 'center', mb: 6 }}>
                <Typography 
                  variant="h1" 
                  sx={{ 
                    fontWeight: 800, 
                    color: '#1E377C', 
                    mb: 3,
                    fontSize: { xs: '2.5rem', md: '3.5rem', lg: '4rem' },
                    lineHeight: 1.2
                  }}
                >
                  About BeaverNorth Financials
                </Typography>
                <Typography 
                  variant="h5" 
                  sx={{ 
                    color: '#1E377C', 
                    fontWeight: 400,
                    maxWidth: 800,
                    margin: '0 auto',
                    lineHeight: 1.6,
                    fontSize: { xs: '1.1rem', md: '1.3rem' }
                  }}
                >
                  Your Trusted Partner for Comprehensive Financial Well-being in Canada
                </Typography>
              </Box>
            </motion.div>
          </Container>
        </Box>

        {/* Stats Section */}
        <Box sx={{ 
          bgcolor: 'white',
          py: 6,
          borderBottom: '1px solid rgba(0,0,0,0.05)'
        }}>
          <Container maxWidth="lg">
            <Grid container spacing={4} justifyContent="center">
              {stats.map((stat, index) => (
                <Grid size={{ xs: 6, md: 4 }} key={index}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <Box sx={{ textAlign: 'center', p: 2 }}>
                      <Box sx={{ mb: 2 }}>
                        {stat.icon}
                      </Box>
                      <Typography 
                        variant="h3" 
                        sx={{ 
                          fontWeight: 800, 
                          color: '#1E377C', 
                          mb: 1,
                          fontSize: { xs: '1.8rem', md: '2.5rem' }
                        }}
                      >
                        {stat.number}
                      </Typography>
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          color: '#417F73', 
                          fontWeight: 600,
                          fontSize: { xs: '0.9rem', md: '1rem' }
                        }}
                      >
                        {stat.label}
                      </Typography>
                    </Box>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>

        {/* Main Content */}
        <Container maxWidth="lg" sx={{ py: 8 }}>
          {/* Company Overview */}
          <Box sx={{ mb: 10 }}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Typography 
                variant="h3" 
                sx={{ 
                  fontWeight: 700, 
                  color: '#1E377C', 
                  mb: 6,
                  textAlign: 'center',
                  fontSize: { xs: '2rem', md: '2.5rem' }
                }}
              >
                Who We Are
              </Typography>
              
              <Box sx={{ 
                bgcolor: 'white', 
                p: { xs: 4, md: 6 }, 
                borderRadius: 4,
                boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
                mb: 6,
                border: '1px solid rgba(30, 55, 124, 0.1)',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <Typography 
                  variant="body1" 
                  sx={{ 
                    fontSize: { xs: '1rem', md: '1.2rem' },
                    lineHeight: 1.8,
                    color: '#374151',
                    textAlign: 'center',
                    maxWidth: 900,
                    margin: '0 auto',
                    mb: 3
                  }}
                >
                  Based in Canada, <strong style={{ color: '#1E377C' }}>BeaverNorth Financials</strong> is dedicated to helping families improve their 
                  financial literacy and achieve long-term financial well-being. As <strong style={{ color: '#417F73' }}>LLQP-licensed 
                  financial associate</strong>, we offer a comprehensive range of personal financial services, 
                  including life insurance, investments, budgeting, savings, and debt management, 
                  all under one roof with personalized guidance. We work as independent financial professionals and contracted with Experior Financial Group Inc. (MGA), giving us access to a wide range of top Canadian insurance providers.
                </Typography>
                <Typography 
                  variant="body1" 
                  sx={{ 
                    fontSize: { xs: '1rem', md: '1.2rem' },
                    lineHeight: 1.8,
                    color: '#374151',
                    textAlign: 'center',
                    maxWidth: 900,
                    margin: '0 auto',
                    mb: 3
                  }}
                >
                  Our network includes more than 20 trusted insurers including Manulife, Beneva, iA Financial Group, Foresters Financial, Assumption Life, Travelance, allowing us to source highly competitive offerings.
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    fontSize: { xs: '0.875rem', md: '1rem' },
                    lineHeight: 1.6,
                    color: '#6B7280',
                    textAlign: 'center',
                    maxWidth: 900,
                    margin: '0 auto',
                    mb: 3,
                    fontStyle: 'italic'
                  }}
                >
                  BeaverNorth Financials is a Canadian insurance and financial services firm and is not affiliated with construction, cladding, or building materials companies.
                </Typography>
                <Typography 
                  variant="caption" 
                  sx={{ 
                    fontSize: { xs: '0.7rem', md: '0.75rem' },
                    lineHeight: 1.6,
                    color: '#6B7280',
                    textAlign: 'center',
                    maxWidth: 900,
                    margin: '0 auto',
                    display: 'block',
                    fontStyle: 'italic',
                    mb: 3
                  }}
                >
                  Experior Financial Group Inc. is our contracted Managing General Agency (MGA) and is not an insurer.
                </Typography>

                {/* Shantoshini profile - aligned to the right on desktop */}
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: { xs: 'center', md: 'flex-end' },
                    mt: 2
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box
                      component="img"
                      src={shantoshiniPhoto}
                      alt="Shantoshini Dash, PhD"
                      sx={{
                        width: 72,
                        height: 72,
                        borderRadius: '50%',
                        objectFit: 'cover',
                        border: '2px solid rgba(30,55,124,0.25)',
                        boxShadow: '0 3px 10px rgba(0,0,0,0.18)'
                      }}
                    />
                    <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
                      <Typography
                        variant="subtitle1"
                        sx={{ fontWeight: 700, color: '#1E377C' }}
                      >
                        Shantoshini Dash, PhD
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: '#6B7280' }}
                      >
                        Senior Financial Associate
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>

              <Box sx={{ 
                background: 'linear-gradient(135deg, rgb(255, 203, 5) 0%, rgb(255, 193, 0) 100%)',
                color: '#1E377C',
                p: { xs: 4, md: 6 }, 
                borderRadius: 4,
                textAlign: 'center',
                boxShadow: '0 8px 32px rgba(255, 203, 5, 0.3)'
              }}>
                <Typography 
                  variant="h4" 
                  sx={{ 
                    fontWeight: 700, 
                    mb: 3,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 2,
                    fontSize: { xs: '1.5rem', md: '2rem' }
                  }}
                >
                  <Schedule sx={{ fontSize: { xs: 28, md: 36 } }} />
                  Our Approach
                </Typography>
                <Typography 
                  variant="body1" 
                  sx={{ 
                    fontSize: { xs: '1rem', md: '1.2rem' },
                    lineHeight: 1.8,
                    maxWidth: 800,
                    margin: '0 auto',
                    fontWeight: 500,
                    mb: 2
                  }}
                >
                  We start with a <strong>complimentary financial analysis</strong> to understand your 
                  unique needs before recommending any solutions. Our guidance is personalized, and our 
                  services come with no cost and no obligations.
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    fontSize: { xs: '0.85rem', md: '0.9rem' },
                    lineHeight: 1.6,
                    maxWidth: 800,
                    margin: '0 auto',
                    fontStyle: 'italic',
                    color: '#6B7280'
                  }}
                >
                  You do not pay us. Our compensation is commission-based and is paid by the insurance carrier solely when you elect to secure a policy through our services.
                </Typography>
              </Box>
            </motion.div>
          </Box>

          {/* Services Grid */}
          <Box sx={{ mb: 10 }}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Typography 
                variant="h3" 
                sx={{ 
                  fontWeight: 700, 
                  color: '#1E377C', 
                  mb: 6,
                  textAlign: 'center',
                  fontSize: { xs: '2rem', md: '2.5rem' }
                }}
              >
                Our Services
              </Typography>
              
              <Grid container spacing={4}>
                {services.map((service, index) => (
                  <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                    >
                      <Card sx={{ 
                        height: '100%',
                        borderRadius: 4,
                        boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
                        transition: 'all 0.3s ease',
                        border: '1px solid rgba(0,0,0,0.05)',
                        '&:hover': {
                          transform: 'translateY(-8px)',
                          boxShadow: '0 16px 48px rgba(0,0,0,0.15)',
                          border: `1px solid ${service.color}20`
                        }
                      }}>
                        <CardContent sx={{ p: { xs: 3, md: 4 }, textAlign: 'center' }}>
                          <Box sx={{ 
                            mb: 3,
                            p: 2,
                            borderRadius: 3,
                            bgcolor: `${service.color}10`,
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}>
                            {service.icon}
                          </Box>
                          <Typography 
                            variant="h5" 
                            sx={{ 
                              fontWeight: 700, 
                              color: service.color, 
                              mb: 2,
                              fontSize: { xs: '1.1rem', md: '1.3rem' }
                            }}
                          >
                            {service.title}
                          </Typography>
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              color: '#6B7280',
                              lineHeight: 1.6,
                              fontSize: { xs: '0.9rem', md: '1rem' }
                            }}
                          >
                            {service.description}
                          </Typography>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </Grid>
                ))}
              </Grid>
            </motion.div>
          </Box>

          {/* Why Choose Us */}
          <Box sx={{ mb: 10 }}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Typography 
                variant="h3" 
                sx={{ 
                  fontWeight: 700, 
                  color: '#1E377C', 
                  mb: 6,
                  textAlign: 'center',
                  fontSize: { xs: '2rem', md: '2.5rem' }
                }}
              >
                Why Choose BeaverNorth Financials?
              </Typography>
              
              <Grid container spacing={4}>
                <Grid size={{ xs: 12, md: 4 }}>
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                  >
                    <Box sx={{ 
                      textAlign: 'center', 
                      p: 4,
                      bgcolor: 'white',
                      borderRadius: 4,
                      boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
                      height: '100%',
                      border: '1px solid rgba(0,0,0,0.05)'
                    }}>
                      <Box sx={{ 
                        p: 2,
                        borderRadius: '50%',
                        bgcolor: '#417F7310',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mb: 3
                      }}>
                        <CheckCircle sx={{ fontSize: 48, color: '#417F73' }} />
                      </Box>
                      <Typography variant="h5" sx={{ fontWeight: 700, color: '#1E377C', mb: 2 }}>
                        LLQP Licensed
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#6B7280', lineHeight: 1.6 }}>
                        Fully licensed financial associate with expertise in Canadian financial regulations and compliance standards.
                      </Typography>
                    </Box>
                  </motion.div>
                </Grid>
                
                <Grid size={{ xs: 12, md: 4 }}>
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                  >
                    <Box sx={{ 
                      textAlign: 'center', 
                      p: 4,
                      bgcolor: 'white',
                      borderRadius: 4,
                      boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
                      height: '100%',
                      border: '1px solid rgba(0,0,0,0.05)'
                    }}>
                      <Box sx={{ 
                        p: 2,
                        borderRadius: '50%',
                        bgcolor: 'rgb(255, 203, 5)20',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mb: 3
                      }}>
                        <Schedule sx={{ fontSize: 48, color: 'rgb(255, 203, 5)' }} />
                      </Box>
                      <Typography variant="h5" sx={{ fontWeight: 700, color: '#1E377C', mb: 2 }}>
                        Complimentary Consultation
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#6B7280', lineHeight: 1.6 }}>
                        Complimentary financial analysis to understand your unique situation and goals.
                      </Typography>
                    </Box>
                  </motion.div>
                </Grid>
                
                <Grid size={{ xs: 12, md: 4 }}>
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                  >
                    <Box sx={{ 
                      textAlign: 'center', 
                      p: 4,
                      bgcolor: 'white',
                      borderRadius: 4,
                      boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
                      height: '100%',
                      border: '1px solid rgba(0,0,0,0.05)'
                    }}>
                      <Box sx={{ 
                        p: 2,
                        borderRadius: '50%',
                        bgcolor: '#6983CC10',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mb: 3
                      }}>
                        <TrendingUp sx={{ fontSize: 48, color: '#6983CC' }} />
                      </Box>
                      <Typography variant="h5" sx={{ fontWeight: 700, color: '#1E377C', mb: 2 }}>
                        Comprehensive Solutions
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#6B7280', lineHeight: 1.6 }}>
                        All your financial needs addressed under one roof with personalized guidance and support.
                      </Typography>
                    </Box>
                  </motion.div>
                </Grid>
              </Grid>
            </motion.div>
          </Box>

          {/* Contact Information */}
          <Box sx={{ mb: 12 }}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Typography 
                variant="h3" 
                sx={{ 
                  fontWeight: 700, 
                  color: '#1E377C', 
                  mb: 6,
                  textAlign: 'center',
                  fontSize: { xs: '2rem', md: '2.5rem' }
                }}
              >
                Get In Touch
              </Typography>
              
              <Grid container spacing={4}>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Box sx={{ 
                    textAlign: 'center', 
                    p: 4,
                    bgcolor: 'white',
                    borderRadius: 4,
                    boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
                    height: '100%',
                    border: '1px solid rgba(0,0,0,0.05)'
                  }}>
                    <Phone sx={{ fontSize: 48, color: '#417F73', mb: 2 }} />
                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#1E377C', mb: 1 }}>
                      Call Us
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#6B7280' }}>
                      (438) 763-5120
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid size={{ xs: 12, md: 4 }}>
                  <Box sx={{ 
                    textAlign: 'center', 
                    p: 4,
                    bgcolor: 'white',
                    borderRadius: 4,
                    boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
                    height: '100%',
                    border: '1px solid rgba(0,0,0,0.05)'
                  }}>
                    <Email sx={{ fontSize: 48, color: '#417F73', mb: 2 }} />
                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#1E377C', mb: 1 }}>
                      Email Us
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#6B7280' }}>
                      beavernorthadvisors@gmail.com
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid size={{ xs: 12, md: 4 }}>
                  <Box sx={{ 
                    textAlign: 'center', 
                    p: 4,
                    bgcolor: 'white',
                    borderRadius: 4,
                    boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
                    height: '100%',
                    border: '1px solid rgba(0,0,0,0.05)'
                  }}>
                    <LocationOn sx={{ fontSize: 48, color: '#417F73', mb: 2 }} />
                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#1E377C', mb: 1 }}>
                      Location
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#6B7280' }}>
                      Montreal, Canada
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </motion.div>
          </Box>

          {/* Call to Action */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Box sx={{ 
              bgcolor: '#1E377C',
              color: 'white',
              p: { xs: 4, md: 6 }, 
              borderRadius: 4,
              textAlign: 'center',
              boxShadow: '0 8px 32px rgba(30, 55, 124, 0.3)',
              mt: 8,
              position: 'relative',
              overflow: 'hidden'
            }}>
              <Typography 
                variant="h4" 
                sx={{ 
                  fontWeight: 700, 
                  mb: 3,
                  fontSize: { xs: '1.5rem', md: '2rem' }
                }}
              >
                Ready to Improve Your Financial Well-being?
              </Typography>
              <Typography 
                variant="body1" 
                sx={{ 
                  fontSize: { xs: '1rem', md: '1.2rem' },
                  lineHeight: 1.8,
                  maxWidth: 600,
                  margin: '0 auto',
                  mb: 4,
                  opacity: 0.9
                }}
              >
                Start with our complimentary financial analysis and discover how we can help 
                you achieve your long-term financial goals.
              </Typography>
              <Box sx={{ 
                display: 'flex', 
                gap: 2, 
                justifyContent: 'center',
                flexWrap: 'wrap',
                mb: 4
              }}>
                <Button
                  href="/contact"
                  variant="contained"
                  sx={{ 
                    bgcolor: 'rgb(255, 203, 5)',
                    color: '#1E377C',
                    px: 4,
                    py: 2,
                    borderRadius: 3,
                    fontWeight: 700,
                    fontSize: '1rem',
                    textTransform: 'none',
                    '&:hover': {
                      bgcolor: 'rgb(255, 193, 0)',
                      transform: 'translateY(-2px)'
                    }
                  }}
                >
                  Get in Touch
                </Button>
                <Button
                  href="tel:+14387635120"
                  variant="outlined"
                  sx={{ 
                    border: '2px solid white',
                    color: 'white',
                    px: 4,
                    py: 2,
                    borderRadius: 3,
                    fontWeight: 700,
                    fontSize: '1rem',
                    textTransform: 'none',
                    '&:hover': {
                      bgcolor: 'white',
                      color: '#1E377C'
                    }
                  }}
                >
                  Call (438) 763-5120
                </Button>
              </Box>
            </Box>
          </motion.div>
        </Container>
      </Box>
    </PublicLayout>
  )
}


