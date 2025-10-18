import { Box, Typography, Container, Grid, Card, CardContent } from '@mui/material'
import { 
  TrendingUp, 
  AccountBalance, 
  Security, 
  Assessment, 
  CreditCard, 
  School,
  CheckCircle,
  Schedule
} from '@mui/icons-material'

export default function About() {
  const services = [
    {
      icon: <Security sx={{ fontSize: 40, color: 'rgb(255, 203, 5)' }} />,
      title: 'Life Insurance',
      description: 'Comprehensive life insurance solutions tailored to your family\'s needs'
    },
    {
      icon: <TrendingUp sx={{ fontSize: 40, color: 'rgb(255, 203, 5)' }} />,
      title: 'Investments',
      description: 'Strategic investment planning for long-term wealth building'
    },
    {
      icon: <AccountBalance sx={{ fontSize: 40, color: 'rgb(255, 203, 5)' }} />,
      title: 'Budgeting',
      description: 'Personalized budgeting strategies to optimize your finances'
    },
    {
      icon: <Assessment sx={{ fontSize: 40, color: 'rgb(255, 203, 5)' }} />,
      title: 'Tax Reduction',
      description: 'Expert strategies to minimize your tax burden legally'
    },
    {
      icon: <CreditCard sx={{ fontSize: 40, color: 'rgb(255, 203, 5)' }} />,
      title: 'Debt Management',
      description: 'Effective debt reduction and management solutions'
    },
    {
      icon: <School sx={{ fontSize: 40, color: 'rgb(255, 203, 5)' }} />,
      title: 'Financial Literacy',
      description: 'Education and guidance to improve your financial knowledge'
    }
  ]

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f8fafc' }}>
      {/* Hero Section */}
      <Box sx={{ 
        bgcolor: 'white', 
        py: 8,
        borderBottom: '1px solid rgba(105,131,204,0.1)'
      }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography 
              variant="h2" 
              sx={{ 
                fontWeight: 700, 
                color: 'rgb(255, 203, 5)', 
                mb: 3,
                fontSize: { xs: '2.5rem', md: '3.5rem' }
              }}
            >
              About BeaverNorth Advisors
            </Typography>
            <Typography 
              variant="h5" 
              sx={{ 
                color: '#417F73', 
                fontWeight: 500,
                maxWidth: 800,
                margin: '0 auto',
                lineHeight: 1.6
              }}
            >
              Your Trusted Partner for Comprehensive Financial Well-being
            </Typography>
          </Box>
        </Container>
      </Box>

      {/* Main Content */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        {/* Company Overview */}
        <Box sx={{ mb: 8 }}>
          <Typography 
            variant="h4" 
            sx={{ 
              fontWeight: 600, 
              color: 'rgb(255, 203, 5)', 
              mb: 4,
              textAlign: 'center'
            }}
          >
            Who We Are
          </Typography>
          
          <Box sx={{ 
            bgcolor: 'white', 
            p: 6, 
            borderRadius: 3,
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            mb: 4
          }}>
            <Typography 
              variant="body1" 
              sx={{ 
                fontSize: '1.1rem',
                lineHeight: 1.8,
                color: '#333',
                textAlign: 'center',
                maxWidth: 900,
                margin: '0 auto'
              }}
            >
              Based in Canada, BeaverNorth Advisors is dedicated to helping families improve their 
              financial literacy and achieve long-term financial well-being. As a LLQP-licensed 
              financial associate, we offer a comprehensive range of personal financial services, 
              including life insurance, investments, budgeting, tax reduction, and debt management 
              and many more, all under one roof.
            </Typography>
          </Box>

          <Box sx={{ 
            bgcolor: 'rgb(255, 203, 5)', 
            color: 'white',
            p: 6, 
            borderRadius: 3,
            textAlign: 'center'
          }}>
            <Typography 
              variant="h5" 
              sx={{ 
                fontWeight: 600, 
                mb: 3,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 2
              }}
            >
              <Schedule sx={{ fontSize: 32 }} />
              Our Approach
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ 
                fontSize: '1.1rem',
                lineHeight: 1.8,
                maxWidth: 800,
                margin: '0 auto'
              }}
            >
              We start with a <strong>free 30-minute financial analysis</strong> to understand your 
              unique needs before recommending any solutions. Our guidance is personalized, and our 
              service is completely free.
            </Typography>
          </Box>
        </Box>

        {/* Services Grid */}
        <Box sx={{ mb: 8 }}>
          <Typography 
            variant="h4" 
            sx={{ 
              fontWeight: 600, 
              color: 'rgb(255, 203, 5)', 
              mb: 6,
              textAlign: 'center'
            }}
          >
            Our Services
          </Typography>
          
          <Grid container spacing={4}>
            {services.map((service, index) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
                <Card sx={{ 
                  height: '100%',
                  borderRadius: 3,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 30px rgba(0,0,0,0.12)'
                  }
                }}>
                  <CardContent sx={{ p: 4, textAlign: 'center' }}>
                    <Box sx={{ mb: 3 }}>
                      {service.icon}
                    </Box>
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        fontWeight: 600, 
                        color: 'rgb(255, 203, 5)', 
                        mb: 2
                      }}
                    >
                      {service.title}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: '#666',
                        lineHeight: 1.6
                      }}
                    >
                      {service.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Why Choose Us */}
        <Box sx={{ mb: 8 }}>
          <Typography 
            variant="h4" 
            sx={{ 
              fontWeight: 600, 
              color: 'rgb(255, 203, 5)', 
              mb: 6,
              textAlign: 'center'
            }}
          >
            Why Choose BeaverNorth Advisors?
          </Typography>
          
          <Grid container spacing={4}>
            <Grid size={{ xs: 12, md: 4 }}>
              <Box sx={{ textAlign: 'center', p: 3 }}>
                <CheckCircle sx={{ fontSize: 60, color: '#417F73', mb: 2 }} />
                <Typography variant="h6" sx={{ fontWeight: 600, color: 'rgb(255, 203, 5)', mb: 2 }}>
                  LLQP Licensed
                </Typography>
                <Typography variant="body2" sx={{ color: '#666', lineHeight: 1.6 }}>
                  Fully licensed financial associate with expertise in Canadian financial regulations
                </Typography>
              </Box>
            </Grid>
            
            <Grid size={{ xs: 12, md: 4 }}>
              <Box sx={{ textAlign: 'center', p: 3 }}>
                <Schedule sx={{ fontSize: 60, color: '#417F73', mb: 2 }} />
                <Typography variant="h6" sx={{ fontWeight: 600, color: 'rgb(255, 203, 5)', mb: 2 }}>
                  Free Consultation
                </Typography>
                <Typography variant="body2" sx={{ color: '#666', lineHeight: 1.6 }}>
                  No-cost 30-minute financial analysis to understand your unique situation
                </Typography>
              </Box>
            </Grid>
            
            <Grid size={{ xs: 12, md: 4 }}>
              <Box sx={{ textAlign: 'center', p: 3 }}>
                <TrendingUp sx={{ fontSize: 60, color: '#417F73', mb: 2 }} />
                <Typography variant="h6" sx={{ fontWeight: 600, color: 'rgb(255, 203, 5)', mb: 2 }}>
                  Comprehensive Solutions
                </Typography>
                <Typography variant="body2" sx={{ color: '#666', lineHeight: 1.6 }}>
                  All your financial needs addressed under one roof with personalized guidance
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>

        {/* Call to Action */}
        <Box sx={{ 
          bgcolor: 'rgb(255, 203, 5)', 
          color: 'white',
          p: 6, 
          borderRadius: 3,
          textAlign: 'center'
        }}>
          <Typography 
            variant="h5" 
            sx={{ 
              fontWeight: 600, 
              mb: 3
            }}
          >
            Ready to Improve Your Financial Well-being?
          </Typography>
          <Typography 
            variant="body1" 
            sx={{ 
              fontSize: '1.1rem',
              lineHeight: 1.8,
              maxWidth: 600,
              margin: '0 auto',
              mb: 4
            }}
          >
            Start with our free 30-minute financial analysis and discover how we can help 
            you achieve your long-term financial goals.
          </Typography>
          <Box sx={{ 
            display: 'flex', 
            gap: 2, 
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}>
            <Typography 
              component="a" 
              href="/contact" 
              sx={{ 
                bgcolor: 'white',
                color: 'rgb(255, 203, 5)',
                px: 4,
                py: 2,
                borderRadius: 2,
                textDecoration: 'none',
                fontWeight: 600,
                fontSize: '1rem',
                transition: 'all 0.3s ease',
                '&:hover': {
                  bgcolor: '#f0f0f0',
                  transform: 'translateY(-2px)'
                }
              }}
            >
              Get Free Analysis
            </Typography>
            <Typography 
              component="a" 
              href="tel:+14387635120" 
              sx={{ 
                border: '2px solid white',
                color: 'white',
                px: 4,
                py: 2,
                borderRadius: 2,
                textDecoration: 'none',
                fontWeight: 600,
                fontSize: '1rem',
                transition: 'all 0.3s ease',
                '&:hover': {
                  bgcolor: 'white',
                  color: 'rgb(255, 203, 5)'
                }
              }}
            >
              Call (438) 763-5120
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  )
}


