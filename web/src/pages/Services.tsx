import { Box, Typography, Container, Grid, Card, CardContent, Button } from '@mui/material'
import { 
  Security, 
  MedicalServices,
  Accessibility,
  LocalHospital,
  Flight,
  ContactSupport,
  AccountBalance,
  TrendingUp,
  School,
  CreditCard,
  Description,
  Groups
} from '@mui/icons-material'
import { motion } from 'framer-motion'
import PublicLayout from '../components/PublicLayout'

export default function Services() {
  const insuranceServices = [
    {
      icon: <Security sx={{ fontSize: 48, color: '#1E377C' }} />,
      title: 'Life Insurance',
      description: 'Protect your loved ones with comprehensive life insurance coverage tailored to your family\'s needs and financial situation.',
      color: '#1E377C'
    },
    {
      icon: <MedicalServices sx={{ fontSize: 48, color: '#E91E63' }} />,
      title: 'Critical Illness Insurance',
      description: 'Financial protection for serious health conditions, providing a lump-sum benefit to cover medical expenses and lost income.',
      color: '#E91E63'
    },
    {
      icon: <Accessibility sx={{ fontSize: 48, color: '#9C27B0' }} />,
      title: 'Disability Insurance',
      description: 'Income replacement protection if you become unable to work due to illness or injury, ensuring financial stability during difficult times.',
      color: '#9C27B0'
    },
    {
      icon: <LocalHospital sx={{ fontSize: 48, color: '#00BCD4' }} />,
      title: 'Health and Dental Insurance',
      description: 'Comprehensive health and dental coverage options to manage healthcare costs and protect your family\'s wellbeing.',
      color: '#00BCD4'
    },
    {
      icon: <Flight sx={{ fontSize: 48, color: '#4CAF50' }} />,
      title: 'Travel and SuperVisa Insurance',
      description: 'Essential coverage for international travel, including SuperVisa insurance for parents and grandparents visiting Canada.',
      color: '#4CAF50'
    }
  ]

  const investmentServices = [
    {
      icon: <AccountBalance sx={{ fontSize: 48, color: '#417F73' }} />,
      title: 'Retirement Plans',
      description: 'Strategic planning for your golden years with RRSPs, RRIFs, and other retirement savings vehicles to secure your future.',
      color: '#417F73'
    },
    {
      icon: <School sx={{ fontSize: 48, color: '#FF9800' }} />,
      title: 'RESPs',
      description: 'Education savings plans to help you build a fund for your children\'s post-secondary education while receiving government grants.',
      color: '#FF9800'
    },
    {
      icon: <TrendingUp sx={{ fontSize: 48, color: '#2196F3' }} />,
      title: 'TFSAs',
      description: 'Tax-free savings accounts to grow your money without tax on investment returns or withdrawals.',
      color: '#2196F3'
    },
    {
      icon: <AccountBalance sx={{ fontSize: 48, color: '#607D8B' }} />,
      title: 'RRSPs',
      description: 'Registered Retirement Savings Plans to reduce your tax burden while building a nest egg for retirement.',
      color: '#607D8B'
    }
  ]

  const otherServices = [
    {
      icon: <CreditCard sx={{ fontSize: 48, color: '#10B981' }} />,
      title: 'Debt Solutions',
      description: 'Expert advice on debt consolidation, management strategies, and repayment plans to improve your financial health.',
      color: '#10B981'
    },
    {
      icon: <Description sx={{ fontSize: 48, color: '#8B5CF6' }} />,
      title: 'Estate Planning',
      description: 'Comprehensive estate planning services including wills, trusts, and legacy planning to protect your assets and loved ones.',
      color: '#8B5CF6'
    },
    {
      icon: <Groups sx={{ fontSize: 48, color: '#F44336' }} />,
      title: 'Group Benefit Plans',
      description: 'Customizable employee benefit packages including life insurance, health, dental, and disability coverage for businesses.',
      color: '#F44336'
    }
  ]

  return (
    <PublicLayout>
      <Box sx={{ minHeight: '100vh', bgcolor: '#f8fafc' }}>
        {/* Hero Section */}
        <Box sx={{ 
          background: 'linear-gradient(135deg, #1E377C 0%, #417F73 100%)',
          color: 'white',
          py: { xs: 8, md: 12 },
          position: 'relative',
          overflow: 'hidden'
        }}>
          <Box sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: 'radial-gradient(circle at 20% 80%, rgba(255, 203, 5, 0.1) 0%, transparent 50%)',
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
                    color: 'white', 
                    mb: 3,
                    fontSize: { xs: '2.5rem', md: '3.5rem', lg: '4rem' }
                  }}
                >
                  Our Services
                </Typography>
                <Typography 
                  variant="h5" 
                  sx={{ 
                    color: 'rgba(255, 255, 255, 0.9)', 
                    fontWeight: 400,
                    maxWidth: 800,
                    margin: '0 auto',
                    lineHeight: 1.6
                  }}
                >
                  Comprehensive financial solutions tailored to your needs
                </Typography>
              </Box>
            </motion.div>
          </Container>
        </Box>

        <Container maxWidth="lg" sx={{ py: 8 }}>
          {/* Insurance Services */}
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
                  mb: 2,
                  textAlign: 'center',
                  fontSize: { xs: '2rem', md: '2.5rem' }
                }}
              >
                Insurance
              </Typography>
              
              <Grid container spacing={4}>
                {insuranceServices.map((service, index) => (
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
                        <CardContent sx={{ p: 4, textAlign: 'center' }}>
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
                              mb: 2
                            }}
                          >
                            {service.title}
                          </Typography>
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              color: '#6B7280',
                              lineHeight: 1.6
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

          {/* Investment Services */}
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
                  mb: 2,
                  textAlign: 'center',
                  fontSize: { xs: '2rem', md: '2.5rem' }
                }}
              >
                Investments
              </Typography>
              
              <Grid container spacing={4}>
                {investmentServices.map((service, index) => (
                  <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
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
                        <CardContent sx={{ p: 4, textAlign: 'center' }}>
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
                            variant="h6" 
                            sx={{ 
                              fontWeight: 700, 
                              color: service.color, 
                              mb: 2
                            }}
                          >
                            {service.title}
                          </Typography>
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              color: '#6B7280',
                              lineHeight: 1.6
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

          {/* Other Services */}
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
                  mb: 2,
                  textAlign: 'center',
                  fontSize: { xs: '2rem', md: '2.5rem' }
                }}
              >
                Other Services
              </Typography>
              
              <Grid container spacing={4}>
                {otherServices.map((service, index) => (
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
                        <CardContent sx={{ p: 4, textAlign: 'center' }}>
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
                              mb: 2
                            }}
                          >
                            {service.title}
                          </Typography>
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              color: '#6B7280',
                              lineHeight: 1.6
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

          {/* Call to Action */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Box sx={{ 
              background: 'linear-gradient(135deg, #1E377C 0%, #417F73 100%)',
              color: 'white',
              p: 6, 
              borderRadius: 4,
              textAlign: 'center',
              boxShadow: '0 8px 32px rgba(30, 55, 124, 0.3)'
            }}>
              <Typography 
                variant="h4" 
                sx={{ 
                  fontWeight: 700, 
                  mb: 3,
                  fontSize: { xs: '1.5rem', md: '2rem' }
                }}
              >
                Ready to Get Started?
              </Typography>
              <Typography 
                variant="body1" 
                sx={{ 
                  lineHeight: 1.8,
                  maxWidth: 600,
                  margin: '0 auto',
                  mb: 4,
                  opacity: 0.9
                }}
              >
                Schedule your free 30-minute consultation to discuss your financial needs and goals.
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
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
                    textTransform: 'none',
                    '&:hover': {
                      bgcolor: 'rgb(255, 193, 0)'
                    }
                  }}
                >
                  Get Free Consultation
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
