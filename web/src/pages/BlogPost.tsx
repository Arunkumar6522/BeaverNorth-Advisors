import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Button, 
  Container, 
  Chip,
  Breadcrumbs,
  Link as MuiLink,
  CircularProgress,
  Alert
} from '@mui/material'
import { 
  CalendarToday, 
  Person, 
  ArrowBack,
  Home
} from '@mui/icons-material'
import PublicLayout from '../components/PublicLayout'

interface BlogPost {
  title: string
  content: string
  link: string
  pubDate: string
  author?: string
  categories?: string[]
  thumbnail?: string
}

export default function BlogPost() {
  const { postId } = useParams<{ postId: string }>()
  const navigate = useNavigate()
  const [post, setPost] = useState<BlogPost | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Helper function to format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  useEffect(() => {
    const fetchBlogPost = async () => {
      try {
        setLoading(true)
        console.log('🔍 Fetching blog post...')
        
        // Use Netlify function for production, local server for development
        const apiUrl = import.meta.env.DEV ? 'http://localhost:3001/api/blog-posts' : '/.netlify/functions/blog-posts'
        const response = await fetch(apiUrl)
        console.log('📡 Response status:', response.status)
        
        if (response.ok) {
          const contentType = response.headers.get('content-type')
          console.log('📊 Content-Type:', contentType)
          
          if (contentType && contentType.includes('application/json')) {
            const data = await response.json()
            console.log('📊 Server response:', data)
            
            if (data.success && data.posts) {
              // Find the specific post by ID
              const foundPost = data.posts.find((item: any) => {
                const postLinkId = item.link.split('/').pop()?.split('.html')[0]
                return postLinkId === postId
              })
              
              if (foundPost) {
                console.log('✅ Found blog post:', foundPost.title)
                setPost(foundPost)
              } else {
                console.log('❌ Blog post not found for ID:', postId)
                setError('Blog post not found')
              }
            } else {
              setError('Unable to fetch blog posts')
            }
          } else {
            console.log('❌ Server returned non-JSON response')
            setError('Server returned invalid response')
          }
        } else {
          console.log('❌ Server request failed:', response.status)
          setError('Failed to fetch blog post from server')
        }
      } catch (err) {
        console.error('❌ Blog post fetch error:', err)
        setError('Failed to load blog post')
      } finally {
        setLoading(false)
      }
    }

    if (postId) {
      fetchBlogPost()
    }
  }, [postId])

  if (loading) {
    return (
      <PublicLayout>
        <Container maxWidth="lg" sx={{ py: 8 }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
            <CircularProgress size={60} sx={{ color: 'rgb(255, 203, 5)' }} />
          </Box>
        </Container>
      </PublicLayout>
    )
  }

  if (error || !post) {
    return (
      <PublicLayout>
        <Container maxWidth="lg" sx={{ py: 8 }}>
          <Alert severity="error" sx={{ mb: 4 }}>
            {error || 'Blog post not found'}
          </Alert>
          <Button
            variant="contained"
            startIcon={<ArrowBack />}
            onClick={() => navigate('/blog')}
            sx={{
              bgcolor: 'rgb(255, 203, 5)',
              color: '#1E377C',
              fontWeight: 600,
              '&:hover': {
                bgcolor: 'rgb(255, 193, 0)',
                color: '#1E377C'
              }
            }}
          >
            Back to Blog
          </Button>
        </Container>
      </PublicLayout>
    )
  }

  return (
    <PublicLayout>
      <Box sx={{ minHeight: '100vh', bgcolor: '#f8fafc' }}>
        {/* Breadcrumbs */}
        <Container maxWidth="lg" sx={{ pt: 4 }}>
          <Breadcrumbs sx={{ mb: 2 }}>
            <MuiLink
              component="button"
              variant="body2"
              onClick={() => navigate('/')}
              sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
            >
              <Home sx={{ fontSize: 16 }} />
              Home
            </MuiLink>
            <MuiLink
              component="button"
              variant="body2"
              onClick={() => navigate('/blog')}
            >
              Blog
            </MuiLink>
            <Typography variant="body2" color="text.secondary">
              {post.title.length > 50 ? post.title.substring(0, 50) + '...' : post.title}
            </Typography>
          </Breadcrumbs>
        </Container>

        {/* Blog Post Content */}
        <Container maxWidth="md" sx={{ py: 4 }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Card sx={{ mb: 4 }}>
              <CardContent sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
                {/* Back Button */}
                <Button
                  variant="outlined"
                  startIcon={<ArrowBack />}
                  onClick={() => navigate('/blog')}
                  sx={{ mb: 3 }}
                >
                  Back to Blog
                </Button>

                {/* Post Meta */}
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: { xs: 2, sm: 3 }, 
                  mb: 3,
                  flexWrap: 'wrap'
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <CalendarToday sx={{ fontSize: { xs: 16, sm: 18 }, color: '#6B7280' }} />
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
                      {formatDate(post.pubDate)}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Person sx={{ fontSize: { xs: 16, sm: 18 }, color: '#6B7280' }} />
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
                      {post.author}
                    </Typography>
                  </Box>
                </Box>

                {/* Post Title */}
                <Typography 
                  variant="h3" 
                  component="h1" 
                  sx={{ 
                    fontWeight: 700, 
                    color: '#1E377C',
                    mb: 3,
                    lineHeight: 1.2,
                    fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' }
                  }}
                >
                  {post.title}
                </Typography>

                {/* Categories */}
                <Box sx={{ display: 'flex', gap: 1, mb: 4, flexWrap: 'wrap' }}>
                  {post.categories?.map((category) => (
                    <Chip
                      key={category}
                      label={category}
                      sx={{
                        bgcolor: 'rgba(255, 203, 5, 0.1)',
                        color: '#1E377C',
                        fontWeight: 500
                      }}
                    />
                  ))}
                </Box>

                {/* Post Content */}
                <Box
                  sx={{
                    '& h1, & h2, & h3, & h4, & h5, & h6': {
                      color: '#1E377C',
                      fontWeight: 600,
                      mb: 2,
                      mt: 3
                    },
                    '& p': {
                      mb: 2,
                      lineHeight: 1.7,
                      color: '#374151'
                    },
                    '& ul, & ol': {
                      mb: 2,
                      pl: 3
                    },
                    '& li': {
                      mb: 1,
                      lineHeight: 1.6
                    },
                    '& blockquote': {
                      borderLeft: '4px solid rgb(255, 203, 5)',
                      pl: 2,
                      ml: 0,
                      fontStyle: 'italic',
                      bgcolor: 'rgba(255, 203, 5, 0.05)',
                      py: 1,
                      borderRadius: '0 4px 4px 0'
                    },
                    '& a': {
                      color: 'rgb(255, 203, 5)',
                      textDecoration: 'none',
                      '&:hover': {
                        textDecoration: 'underline'
                      }
                    },
                    '& img': {
                      maxWidth: '100%',
                      height: 'auto',
                      borderRadius: 1,
                      my: 2
                    }
                  }}
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />

              </CardContent>
            </Card>
          </motion.div>
        </Container>
      </Box>
    </PublicLayout>
  )
}
