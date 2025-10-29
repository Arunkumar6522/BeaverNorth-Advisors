import { motion } from 'framer-motion'
import { Box, Container, Typography, Button } from '@mui/material'
import { Home, ArrowBack } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import PublicLayout from '../components/PublicLayout'

export default function NotFound() {
  const navigate = useNavigate()

  return (
    <PublicLayout>
      <Box sx={{ minHeight: '100vh', bgcolor: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Container maxWidth="md">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            style={{ textAlign: 'center' }}
          >
            {/* 404 Animation */}
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Typography
                variant="h1"
                sx={{
                  fontSize: { xs: '6rem', md: '8rem' },
                  fontWeight: 900,
                  color: 'rgb(255, 203, 5)',
                  textShadow: '2px 2px 4px rgba(0,0,0,0.1)',
                  mb: 2
                }}
              >
                404
              </Typography>
            </motion.div>

            <Typography
              variant="h3"
              sx={{
                fontWeight: 700,
                color: '#1E377C',
                mb: 2,
                fontSize: { xs: '1.5rem', md: '2rem' }
              }}
            >
              Page Not Found
            </Typography>

            <Typography
              variant="h6"
              sx={{
                color: '#6B7280',
                mb: 4,
                maxWidth: '500px',
                mx: 'auto',
                lineHeight: 1.6
              }}
            >
              The page you're looking for doesn't exist or you don't have permission to access it.
            </Typography>

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="contained"
                  startIcon={<Home />}
                  onClick={() => navigate('/')}
                  sx={{
                    bgcolor: 'rgb(255, 203, 5)',
                    color: '#1E377C',
                    px: 4,
                    py: 1.5,
                    borderRadius: 2,
                    fontWeight: 600,
                    '&:hover': {
                      bgcolor: 'rgb(255, 193, 0)',
                    }
                  }}
                >
                  Go Home
                </Button>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="outlined"
                  startIcon={<ArrowBack />}
                  onClick={() => navigate(-1)}
                  sx={{
                    borderColor: '#1E377C',
                    color: '#1E377C',
                    px: 4,
                    py: 1.5,
                    borderRadius: 2,
                    fontWeight: 600,
                    '&:hover': {
                      borderColor: '#1E377C',
                      bgcolor: 'rgba(30, 55, 124, 0.1)'
                    }
                  }}
                >
                  Go Back
                </Button>
              </motion.div>
            </Box>

            {/* Additional Help */}
            {/* Removed login link per request */}
          </motion.div>
        </Container>
      </Box>
    </PublicLayout>
  )
}
