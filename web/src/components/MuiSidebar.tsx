import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Box,
  IconButton,
  useTheme,
  useMediaQuery
} from '@mui/material'
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Analytics as AnalyticsIcon,
  ChevronLeft as ChevronLeftIcon,
  Logout as LogoutIcon,
  AccountCircle as AccountIcon
} from '@mui/icons-material'

const drawerWidth = 240
const mobileDrawerWidth = 280

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
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Toolbar sx={{ 
        background: 'linear-gradient(135deg, #22C55E 0%, #16A34A 100%)',
        color: 'white',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        px: 2
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <AccountIcon sx={{ fontSize: 32 }} />
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 'bold', fontSize: 16 }}>
              BeaverNorth
            </Typography>
            <Typography variant="caption" sx={{ fontSize: 12, opacity: 0.9 }}>
              Insurance Advisors
            </Typography>
          </Box>
        </Box>
        
        {open && (
          <IconButton 
            onClick={onToggle}
            sx={{ 
              color: 'inherit',
              backgroundColor: 'rgba(255,255,255,0.1)',
              '&:hover': { backgroundColor: 'rgba(255,255,255,0.2)' }
            }}
          >
            <ChevronLeftIcon />
          </IconButton>
        )}
      </Toolbar>

      {/* User Info */}
      <Box sx={{ 
        p: 2, 
        backgroundColor: '#F8FAFC',
        borderBottom: '1px solid #E2E8F0'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar sx={{ 
            backgroundColor: '#22C55E', 
            width: 40, 
            height: 40,
            fontSize: 16,
            fontWeight: 'bold'
          }}>
            {(user.full_name || user.username || 'A').charAt(0).toUpperCase()}
          </Avatar>
          <Box>
            <Typography variant="body2" sx={{ fontWeight: '600', color: '#1E293B' }}>
              {user.full_name || user.username || 'Admin'}
            </Typography>
            <Typography variant="caption" sx={{ color: '#64748B' }}>
              Insurance Advisor
            </Typography>
          </Box>
        </Box>
        
        {/* Quick Logout Button */}
        <IconButton 
          onClick={onLogout}
          sx={{ 
            position: 'absolute',
            top: 8,
            right: 8,
            backgroundColor: '#EF4444',
            color: 'white',
            width: 32,
            height: 32,
            '&:hover': { backgroundColor: '#DC2626' }
          }}
        >
          <LogoutIcon sx={{ fontSize: 18 }} />
        </IconButton>
      </Box>

      {/* Navigation */}
      <List sx={{ flexGrow: 1, py: 1 }}>
        {modules.map((module) => {
          const Icon = module.icon
          const isSelected = selectedModule === module.id
          
          return (
            <ListItem key={module.id} disablePadding sx={{ px: 1, mb: 0.5 }}>
              <ListItemButton
                selected={isSelected}
                onClick={() => onModuleSelect(module.id)}
                sx={{
                  borderRadius: 2,
                  backgroundColor: isSelected ? '#22C55E' : 'transparent',
                  color: isSelected ? 'white' : '#374151',
                  '&:hover': {
                    backgroundColor: isSelected ? '#16A34A' : '#F3F4F6'
                  },
                  '&.Mui-selected': {
                    backgroundColor: '#22C55E',
                    '&:hover': { backgroundColor: '#16A34A' }
                  }
                }}
              >
                <ListItemIcon sx={{ 
                  color: 'inherit',
                  minWidth: 40
                }}>
                  <Icon />
                </ListItemIcon>
                <ListItemText 
                  primary={module.name}
                  primaryTypographyProps={{
                    fontWeight: isSelected ? 600 : 500,
                    fontSize: 14
                  }}
                />
              </ListItemButton>
            </ListItem>
          )
        })}
      </List>

      {/* Footer */}
      <Box sx={{ p: 2, backgroundColor: '#F8FAFC', borderTop: '1px solid #E2E8F0' }}>
        <Typography variant="caption" sx={{ color: '#64748B', fontSize: 11 }}>
          © 2025 BeaverNorth Advisors
        </Typography>
      </Box>
    </Box>
  )

  return (
    <Drawer
      variant={isMobile ? 'temporary' : 'permanent'}
      open={open}
      onClose={onToggle}
      sx={{
        width: open ? (isMobile ? mobileDrawerWidth : drawerWidth) : (isMobile ? 0 : 64),
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: open ? (isMobile ? mobileDrawerWidth : drawerWidth) : (isMobile ? 0 : 64),
          boxSizing: 'border-box',
          backgroundColor: '#FFFFFF',
          borderRight: '1px solid #E2E8F0',
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

// Avatar component for consistent styling
const Avatar = ({ children, sx, ...props }: any) => (
  <Box 
    sx={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      borderRadius: '50%',
      width: 40,
      height: 40,
      backgroundColor: '#22C55E',
      color: 'white',
      fontSize: 16,
      fontWeight: 'bold',
      ...sx
    }} 
    {...props}
  >
    {children}
  </Box>
)
