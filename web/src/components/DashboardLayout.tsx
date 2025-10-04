import React, { useState } from 'react'
import { Box, Drawer, CssBaseline, AppBar, Toolbar, Typography, List, ListItem, ListItemButton, ListItemIcon, ListItemText, IconButton, useMediaQuery, useTheme } from '@mui/material'
import { Dashboard as DashboardIcon, People as LeadsIcon, Assessment as AnalyticsIcon, Menu as MenuIcon } from '@mui/icons-material'

interface DashboardLayoutProps {
  children: React.ReactNode
}

const drawerWidth = 240

interface Module {
  id: string
  name: string
  icon: React.ReactNode
}

const modules: Module[] = [
  { id: 'dashboard', name: 'Dashboard', icon: <DashboardIcon /> },
  { id: 'leads', name: 'Leads Management', icon: <LeadsIcon /> },
  { id: 'analytics', name: 'Analytics', icon: <AnalyticsIcon /> }
]

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [selectedModule, setSelectedModule] = useState('dashboard')
  const [mobileOpen, setMobileOpen] = useState(false)
  
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  const handleModuleChange = (moduleId: string) => {
    setSelectedModule(moduleId)
    if (isMobile) {
      setMobileOpen(false)  // Close drawer on mobile after selection
    }
  }

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  const drawer = (
    <Box sx={{ overflow: 'auto' }}>
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#22C55E' }}>
          BeaverNorth Advisors
        </Typography>
      </Box>
      
      <List>
        {modules.map((module) => (
          <ListItem key={module.id} disablePadding>
            <ListItemButton
              selected={selectedModule === module.id}
              onClick={() => handleModuleChange(module.id)}
              sx={{
                m: 1,
                borderRadius: 2,
                '&.Mui-selected': {
                  backgroundColor: '#22C55E',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: '#16A34A',
                  },
                  '& .MuiListItemIcon-root': {
                    color: 'white',
                  },
                },
                '&:hover': {
                  backgroundColor: '#F0FDF4',
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>
                {module.icon}
              </ListItemIcon>
              <ListItemText primary={module.name} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  )

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      
      {/* Top AppBar */}
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
          backgroundColor: '#ffffff',
          color: '#374151',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}
      >
        <Toolbar>
          {/* Hamburger Menu Icon (Mobile Only) */}
          {isMobile && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}
          
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: '600' }}>
            {modules.find(m => m.id === selectedModule)?.name || 'Dashboard'}
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Sidebar Drawer - Responsive */}
      {/* Mobile Drawer (Temporary) */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better mobile performance
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            backgroundColor: '#ffffff',
            borderRight: '1px solid #E5E7EB',
          },
        }}
      >
        {drawer}
      </Drawer>

      {/* Desktop Drawer (Permanent) */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            backgroundColor: '#ffffff',
            borderRight: '1px solid #E5E7EB',
          },
        }}
        open
      >
        {drawer}
      </Drawer>

      {/* Main Content Area */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          pt: 8,
          px: { xs: 2, md: 3 },
          backgroundColor: '#F9FAFB',
          minHeight: '100vh',
          width: { xs: '100%', md: `calc(100% - ${drawerWidth}px)` }
        }}
      >
        {children}
      </Box>
    </Box>
  )
}
