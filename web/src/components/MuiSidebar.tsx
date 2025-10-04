import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  Box,
  Typography,
  useTheme,
  useMediaQuery,
  IconButton,
  Tooltip
} from '@mui/material'
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  DeleteForever as DeletedLeadsIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Logout as LogoutIcon
} from '@mui/icons-material'

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
    { id: 'dashboard', name: 'Dashboard', icon: DashboardIcon, tooltip: 'Dashboard Overview' },
    { id: 'leads', name: 'Leads Management', icon: PeopleIcon, tooltip: 'Manage Leads' },
    { id: 'deleted', name: 'Deleted Leads', icon: DeletedLeadsIcon, tooltip: 'View Deleted Leads' }
  ]

  const drawerContent = (
    <Box sx={{ 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      backgroundColor: '#ffffff',
      overflow: 'hidden',
      borderRight: '1px solid #E0E0E0'
    }}>
      
      {/* Header */}
      <Box sx={{ 
        p: 2,
        background: 'linear-gradient(135deg, #1976D2 0%, #1565C0 100%)',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        minHeight: 64,
        cursor: 'pointer'
      }} onClick={() => {
        console.log('🎯 Sidebar header clicked! Current state:', open);
        onToggle();
      }}>
        {open ? (
          <>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                BeaverNorth
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.9 }}>
                Insurance Advisors
              </Typography>
            </Box>
            <IconButton 
              size="small"
              sx={{ 
                color: 'inherit',
                backgroundColor: 'rgba(255,255,255,0.15)',
                '&:hover': { backgroundColor: 'rgba(255,255,255,0.25)' }
              }}
            >
              <ChevronLeftIcon />
            </IconButton>
          </>
        ) : (
          <>
            <Typography variant="h6" sx={{ fontWeight: 'bold', fontSize: 16 }}>
              BN
            </Typography>
            <IconButton 
              size="small"
              sx={{ 
                color: 'inherit',
                backgroundColor: 'rgba(255,255,255,0.15)',
                '&:hover': { backgroundColor: 'rgba(255,255,255,0.25)' }
              }}
            >
              <ChevronRightIcon />
            </IconButton>
          </>
        )}
      </Box>

      {/* Navigation */}
      <Box sx={{ flexGrow: 1, py: 1 }}>
        <List sx={{ px: 1 }}>
          {modules.map((module) => {
            const Icon = module.icon
            const isSelected = selectedModule === module.id
            
            const buttonContent = (
              <ListItemButton
                selected={isSelected}
                onClick={() => onModuleSelect(module.id)}
                sx={{
                  borderRadius: 1.5,
                  mx: open ? 1 : 0.5,
                  my: 0.25,
                  backgroundColor: isSelected ? '#E3F2FD' : 'transparent',
                  color: isSelected ? '#1976D2' : '#666666',
                  border: isSelected ? '1px solid #1976D2' : '1px solid transparent',
                  minHeight: 44,
                  justifyContent: open ? 'flex-start' : 'center',
                  '&:hover': {
                    backgroundColor: isSelected ? '#E3F2FD' : '#F5F5F5',
                    transform: 'scale(1.02)',
                    boxShadow: '0 2px 8px rgba(25,118,210,0.15)'
                  },
                  '&.Mui-selected': {
                    backgroundColor: '#E3F2FD',
                    color: '#1976D2',
                    '&:hover': { backgroundColor: '#E3F2FD' }
                  },
                  transition: 'all 0.2s ease'
                }}
              >
                <ListItemIcon sx={{ 
                  color: 'inherit',
                  minWidth: open ? 40 : 0,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}>
                  <Icon sx={{ fontSize: 22 }} />
                </ListItemIcon>
                {open && (
                  <ListItemText 
                    primary={module.name}
                    primaryTypographyProps={{
                      fontWeight: isSelected ? 600 : 500,
                      fontSize: 14
                    }}
                    sx={{ ml: 1 }}
                  />
                )}
              </ListItemButton>
            )

            return (
              <ListItem key={module.id} disablePadding>
                {open ? (
                  buttonContent
                ) : (
                  <Tooltip title={module.tooltip} placement="right" arrow>
                    <span>{buttonContent}</span>
                  </Tooltip>
                )}
              </ListItem>
            )
          })}
        </List>
      </Box>

      {/* Logout Section */}
      <Box sx={{ 
        p: 1.5, 
        backgroundColor: '#FAFAFA',
        borderTop: '1px solid #E0E0E0'
      }}>
        {open ? (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flex: 1 }}>
              <Box sx={{ 
                width: 32, 
                height: 32, 
                borderRadius: '50%',
                backgroundColor: '#1976D2',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: 14,
                fontWeight: 'bold'
              }}>
                {(user.full_name || user.username || 'A').charAt(0).toUpperCase()}
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: '600', color: '#333333', fontSize: 13 }}>
                  {user.full_name || user.username || 'Admin'}
                </Typography>
                <Typography variant="caption" sx={{ color: '#666666', fontSize: 11 }}>
                  Advisor
                </Typography>
              </Box>
            </Box>
            
            <IconButton 
              onClick={onLogout}
              size="small"
              sx={{ 
                backgroundColor: '#F44336',
                color: 'white',
                width: 30,
                height: 30,
                '&:hover': { backgroundColor: '#D32F2F' }
              }}
            >
              <LogoutIcon sx={{ fontSize: 16 }} />
            </IconButton>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Tooltip title="Logout" placement="right" arrow>
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
            </Tooltip>
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
        width: open ? 240 : 64,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: open ? 240 : 64,
          boxSizing: 'border-box',
          transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
          overflowX: 'hidden'
        },
      }}
    >
      {drawerContent}
    </Drawer>
  )
}