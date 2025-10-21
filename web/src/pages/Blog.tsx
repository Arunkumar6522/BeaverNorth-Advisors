import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Box, Typography, Card, CardContent, Chip, Button, Container, Grid } from '@mui/material'
import { CalendarToday, Person, ArrowForward, OpenInNew } from '@mui/icons-material'
import PublicLayout from '../components/PublicLayout'
import { useNavigate } from 'react-router-dom'

interface BlogPost {
  title: string
  content: string
  link: string
  pubDate: string
  author?: string
  categories?: string[]
  thumbnail?: string
}

export default function Blog() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  // Helper function to strip HTML tags
  const stripHtml = (html: string) => {
    const tmp = document.createElement('div')
    tmp.innerHTML = html
    return tmp.textContent || tmp.innerText || ''
  }

  // Helper function to format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  // Helper function to extract excerpt
  const getExcerpt = (content: string, maxLength: number = 150) => {
    const cleanContent = stripHtml(content)
    return cleanContent.length > maxLength 
      ? cleanContent.substring(0, maxLength) + '...'
      : cleanContent
  }

  // Helper function to extract first image from content
  const getFirstImage = (content: string): string | undefined => {
    const imgMatch = content.match(/<img[^>]+src="([^"]+)"/i)
    return imgMatch ? imgMatch[1] : undefined
  }

  // Helper function to extract post ID from Blogger URL
  const getPostId = (link: string) => {
    // Extract post ID from Blogger URL
    // Example: https://beavernorth.blogspot.com/2024/01/post-title.html
    const urlParts = link.split('/')
    const lastPart = urlParts[urlParts.length - 1]
    return lastPart.split('.html')[0]
  }

  // Function to handle blog post click
  const handlePostClick = (post: BlogPost) => {
    const postId = getPostId(post.link)
    navigate(`/blog/${postId}`)
  }

  useEffect(() => {
    const fetchBlogPosts = async () => {
      try {
        setLoading(true)
        console.log('🔍 Fetching blog posts...')
        
        // Use Netlify function for production, local server for development
        const apiUrl = window.location.hostname === 'localhost' ? 'http://localhost:3001/api/blog-posts' : '/.netlify/functions/blog-posts'
        const response = await fetch(apiUrl)
        console.log('📡 Response status:', response.status)
        
        if (response.ok) {
          const contentType = response.headers.get('content-type')
          console.log('📊 Content-Type:', contentType)
          
          if (contentType && contentType.includes('application/json')) {
            const data = await response.json()
            console.log('📊 Server response:', data)
            
            if (data.success && data.posts && data.posts.length > 0) {
              console.log('✅ Success with server endpoint:', data.posts.length, 'posts')
              setPosts(data.posts)
            } else {
              console.log('❌ No posts found in server response')
              setError('No blog posts found')
            }
          } else {
            console.log('❌ Server returned non-JSON response')
            setError('Server returned invalid response')
          }
        } else {
          console.log('❌ Server request failed:', response.status)
          setError('Failed to fetch blog posts from server')
        }
        
      } catch (err) {
        console.error('❌ Blog fetch error:', err)
        setError('Failed to load blog posts')
      } finally {
        setLoading(false)
      }
    }

    fetchBlogPosts()
  }, [])

  return (
    <PublicLayout>
      <Box sx={{ minHeight: '100vh', bgcolor: '#f8fafc' }}>
        {/* Hero Section */}
        <Box sx={{ 
          bgcolor: 'white', 
          py: 8,
          borderBottom: '1px solid rgba(105,131,204,0.1)'
        }}>
          <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
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
                  textAlign: 'center'
                }}
              >
                Our Blog
              </Typography>
              <Typography 
                variant="h6" 
                sx={{ 
                  color: '#6B7280', 
                  textAlign: 'center',
                  maxWidth: 600,
                  mx: 'auto',
                  lineHeight: 1.6
                }}
              >
                Insights on insurance, risk management, and financial protection in Canada from BeaverNorth Advisors.
              </Typography>
            </motion.div>
          </Container>
        </Box>

        {/* Blog Posts Section */}
        <Container maxWidth="lg" sx={{ py: { xs: 3, sm: 4, md: 6 }, px: { xs: 1, sm: 2, md: 3 } }}>
          {loading && (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography variant="h6" color="text.secondary">
                Loading blog posts...
              </Typography>
            </Box>
          )}

          {error && (
            <Card sx={{ mb: 4, border: '1px solid #fecaca', bgcolor: '#fee2e2' }}>
              <CardContent>
                <Typography color="error" sx={{ mb: 2 }}>
                  {error}
                </Typography>
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<OpenInNew />}
                  href="https://beavernorth.blogspot.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Visit our blog directly
                </Button>
              </CardContent>
            </Card>
          )}

          {posts.length === 0 && !loading && !error && (
            <Card sx={{ textAlign: 'center', py: 6 }}>
              <CardContent>
                <Typography variant="h5" sx={{ mb: 2, color: '#6B7280' }}>
                  No Blog Posts Yet
                </Typography>
                <Typography variant="body1" sx={{ mb: 3, color: '#6B7280' }}>
                  We're working on creating valuable content for you. Check back soon!
                </Typography>
                <Button
                  variant="outlined"
                  endIcon={<OpenInNew />}
                  href="https://beavernorth.blogspot.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    borderColor: 'rgb(255, 203, 5)',
                    color: '#1E377C',
                    fontWeight: 600,
                    '&:hover': {
                      borderColor: 'rgb(255, 193, 0)',
                      bgcolor: 'rgba(255, 203, 5, 0.05)'
                    }
                  }}
                >
                  Visit Our Blogger Site
                </Button>
              </CardContent>
            </Card>
          )}

          {posts.length > 0 && (
            <Grid container spacing={4}>
              {posts.slice(0, 6).map((post, index) => (
                <Grid size={{ xs: 12, md: 6 }} key={post.link}>
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
                        cursor: 'pointer',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: '0 12px 24px rgba(0,0,0,0.15)'
                        }
                      }}
                      onClick={() => handlePostClick(post)}
                    >
                      {/* Thumbnail Image */}
                      {(post.thumbnail || getFirstImage(post.content)) ? (
                        <Box
                          component="img"
                          src={post.thumbnail || getFirstImage(post.content) || ''}
                          alt={post.title}
                          sx={{
                            width: '100%',
                            height: { xs: 160, sm: 180, md: 200 },
                            objectFit: 'cover',
                            borderRadius: '8px 8px 0 0'
                          }}
                          onError={(e) => {
                            e.currentTarget.style.display = 'none'
                          }}
                        />
                      ) : (
                        <Box
                          sx={{
                            width: '100%',
                            height: { xs: 160, sm: 180, md: 200 },
                            bgcolor: '#f3f4f6',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: '8px 8px 0 0',
                            color: '#6B7280'
                          }}
                        >
                          <Typography variant="body2" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>No Image</Typography>
                        </Box>
                      )}
                      
                      <CardContent sx={{ flexGrow: 1, p: { xs: 2, sm: 3 } }}>
                        {/* Post Meta */}
                        <Box sx={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: { xs: 1, sm: 2 }, 
                          mb: 2,
                          flexWrap: 'wrap'
                        }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <CalendarToday sx={{ fontSize: { xs: 14, sm: 16 }, color: '#6B7280' }} />
                            <Typography variant="caption" color="text.secondary" sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}>
                              {formatDate(post.pubDate)}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <Person sx={{ fontSize: { xs: 14, sm: 16 }, color: '#6B7280' }} />
                            <Typography variant="caption" color="text.secondary" sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}>
                              {post.author}
                            </Typography>
                          </Box>
                        </Box>

                        {/* Post Title */}
                        <Typography 
                          variant="h5" 
                          component="h2" 
                          sx={{ 
                            fontWeight: 600, 
                            color: '#1E377C',
                            mb: 2,
                            lineHeight: 1.3,
                            cursor: 'pointer',
                            fontSize: { xs: '1.1rem', sm: '1.25rem', md: '1.5rem' },
                            '&:hover': { color: 'rgb(255, 203, 5)' }
                          }}
                          onClick={() => handlePostClick(post)}
                        >
                          {post.title}
                        </Typography>

                        {/* Post Excerpt */}
                        <Typography 
                          variant="body2" 
                          color="text.secondary" 
                          sx={{ 
                            mb: { xs: 2, sm: 3 },
                            lineHeight: 1.6,
                            display: '-webkit-box',
                            WebkitLineClamp: { xs: 2, sm: 3 },
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            fontSize: { xs: '0.8rem', sm: '0.875rem' }
                          }}
                        >
                          {getExcerpt(post.content)}
                        </Typography>

                        {/* Categories */}
                        <Box sx={{ display: 'flex', gap: 0.5, mb: { xs: 2, sm: 3 }, flexWrap: 'wrap' }}>
                          {post.categories?.slice(0, 2).map((category) => (
                            <Chip
                              key={category}
                              label={category}
                              size="small"
                              sx={{
                                bgcolor: 'rgba(255, 203, 5, 0.1)',
                                color: '#1E377C',
                                fontWeight: 500,
                                fontSize: { xs: '0.65rem', sm: '0.75rem' },
                                height: { xs: 20, sm: 24 }
                              }}
                            />
                          ))}
                        </Box>

                        {/* Read More Button */}
                        <Button
                          variant="contained"
                          endIcon={<ArrowForward />}
                          sx={{
                            bgcolor: 'rgb(255, 203, 5)',
                            color: '#1E377C',
                            fontWeight: 600,
                            textTransform: 'none',
                            fontSize: { xs: '0.8rem', sm: '0.875rem' },
                            py: { xs: 0.5, sm: 1 },
                            px: { xs: 1.5, sm: 2 },
                            '&:hover': {
                              bgcolor: 'rgb(255, 193, 0)',
                              color: '#1E377C'
                            }
                          }}
                          onClick={() => handlePostClick(post)}
                        >
                          Read More
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          )}

          {/* Visit Full Blog CTA */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            <Box sx={{ textAlign: 'center', mt: 6 }}>
              <Typography variant="h6" sx={{ mb: 3, color: '#6B7280' }}>
                Want to read more articles?
              </Typography>
              <Button
                variant="outlined"
                size="large"
                endIcon={<OpenInNew />}
                href="https://beavernorth.blogspot.com"
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  borderColor: 'rgb(255, 203, 5)',
                  color: '#1E377C',
                  fontWeight: 600,
                  textTransform: 'none',
                  px: 4,
                  py: 1.5,
                  '&:hover': {
                    borderColor: 'rgb(255, 193, 0)',
                    bgcolor: 'rgba(255, 203, 5, 0.05)'
                  }
                }}
              >
                Visit Full Blog
              </Button>
            </Box>
          </motion.div>
        </Container>
      </Box>
    </PublicLayout>
  )
}


