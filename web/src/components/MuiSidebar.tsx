import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Typography,
  useTheme,
  useMediaQuery,
  IconButton
} from '@mui/material'
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Analytics as AnalyticsIcon,
  ChevronLeft as ChevronLeftIcon,
  Logout as LogoutIcon
} from '@mui/icons-material'

const drawerWidth = 240

interface MuiSidebarProps {
  open: boolean
  onToggle: () => void
  selectedModule: string
  onModuleSelect: (module: string) => void
  onLogout: () => void
  user: { username?: string; full_name?: string }
}

export default function MuiSidebar({
  open,
  onToggle,
  selectedModule,
  onModuleSelect,
  onLogout,
  user
}: MuiSidebarProps) {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'))

  const modules = [
    { id: 'dashboard', name: 'Dashboard', icon: DashboardIcon },
    { id: 'leads', name: 'Leads Management', icon: PeopleIcon },
    { id: 'analytics', name: 'Analytics', icon: AnalyticsIcon }
  ]

  const drawerContent = (
    <Box sx={{ 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      backgroundColor: '#ffffff',
      overflow: 'hidden'
    }}>
      {/* Header with Logo */}
      <Box sx={{ 
        p: 3,
        background: 'linear-gradient(135deg, #1976D2 0%, #1565C0 100%)',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        minHeight: 80
      }}>
        {open ? (
          <>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                BeaverNorth
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.9 }}>
                Insurance Advisors
              </Typography>
            </Box>
            <IconButton 
              onClick={onToggle}
              size="small"
              sx={{ 
                color: 'inherit',
                backgroundColor: 'rgba(255,255,255,0.1)',
                '&:hover': { backgroundColor: 'rgba(255,255,255,0.2)' }
              }}
            >
              <ChevronLeftIcon />
            </IconButton>
          </>
        ) : (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer' }} onClick={onToggle}>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              BN
            </Typography>
          </Box>
        )}
      </Box>

      {/* Navigation */}
      <Box sx={{ flexGrow: 1, overflowY: 'auto', py: 2 }}>
        <List sx={{ px: 1 }}>
          {modules.map((module) => {
            const Icon = module.icon
            const isSelected = selectedModule === module.id
            
            return (
              <ListItem key={module.id} disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton
                  selected={isSelected}
                  onClick={() => onModuleSelect(module.id)}
                  sx={{
                    borderRadius: 2,
                    mx: 1,
                    backgroundColor: isSelected ? '#E3F2FD' : 'transparent',
                    color: isSelected ? '#1976D2' : '#666666',
                    border: isSelected ? '1px solid #1976D2' : '1px solid transparent',
                    '&:hover': {
                      backgroundColor: isSelected ? '#E3F2FD' : '#F5F5F5'
                    },
                    '&.Mui-selected': {
                      backgroundColor: '#E3F2FD',
                      color: '#1976D2',
                      '&:hover': { backgroundColor: '#E3F2FD' }
                    }
                  }}
                >
                  <ListItemIcon sx={{ 
                    color: isSelected ? '#1976D2' : '#666666',
                    minWidth: 44
                  }}>
                    <Icon />
                  </ListItemIcon>
                  {open && (
                    <ListItemText 
                      primary={module.name}
                      primaryTypographyProps={{
                        fontWeight: isSelected ? 600 : 500,
                        fontSize: 14,
                        color: isSelected ? '#1976D2' : '#666666'
                      }}
                    />
                  )}
                </ListItemButton>
              </ListItem>
            )
          })}
        </List>
      </Box>

      {/* Logout Section at Bottom */}
      <Box sx={{ 
        p: 2, 
        backgroundColor: '#FAFAFA',
        borderTop: '1px solid #E0E0E0'
      }}>
        {open ? (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ 
                width: 40, 
                height: 40, 
                borderRadius: '50%',
                backgroundColor: '#1976D2',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: 16,
                fontWeight: 'bold'
              }}>
                {(user.full_name || user.username || 'A').charAt(0).toUpperCase()}
              </Box>
              <Box>
                <Typography variant="body2" sx={{ fontWeight: '600', color: '#333333' }}>
                  {user.full_name || user.username || 'Admin'}
                </Typography>
                <Typography variant="caption" sx={{ color: '#666666' }}>
                  Insurance Advisor
                </Typography>
              </Box>
            </Box>
            
            <IconButton 
              onClick={onLogout}
              size="small"
              sx={{ 
                backgroundColor: '#F44336',
                color: 'white',
                width: 32,
                height: 32,
                '&:hover': { backgroundColor: '#D32F2F' }
              }}
            >
              <LogoutIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <IconButton 
              onClick={onLogout}
              size="small"
              sx={{ 
                backgroundColor: '#F44336',
                color: 'white',
                width: 32,
                height: 32,
                '&:hover': { backgroundColor: '#D32F2F' }
              }}
            >
              <LogoutIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </Box>
        )}
      </Box>
    </Box>
  )

  return (
    <Drawer
      variant={isMobile ? 'temporary' : 'permanent'}
      open={open}
      onClose={onToggle}
      sx={{
        width: open ? drawerWidth : (isMobile ? 0 : 64),
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: open ? drawerWidth : (isMobile ? 57 : 64),
          boxSizing: 'border-box',
          borderRight: '1px solid #E0E0E0',
          transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
          overflowX: 'hidden',
          position: 'relative'
        },
      }}
    >
      {drawerContent}
    </Drawer>
  )
}