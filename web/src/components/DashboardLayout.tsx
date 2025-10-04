import React, { useState } from 'react'
import { Box, Drawer, CssBaseline, AppBar, Toolbar, Typography, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Tabs, Tab } from '@mui/material'
import { Dashboard as DashboardIcon, People as LeadsIcon, Assessment as AnalyticsIcon } from '@mui/icons-material'

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
  { id: 'leads', name: 'Leads Management',<｜tool▁sep｜> name: 'Leads Management', icon: <LeadsIcon /> },
  { id: 'analytics', name: 'Analytics', icon: <AnalyticsIcon /> }
]

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [selectedModule, setSelectedModule] = useState('dashboard')

  const handleModuleChange = (moduleId: string) => {
    setSelectedModule(moduleId)
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
      
      {/* Sidebar */}
      <AppBar
        position="fixed"
        sx={{
          width: `calc(100% - ${drawerWidth}px)`,
          ml: `${drawerWidth}px`,
          backgroundColor: '#ffffff',
          color: '#374151',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}
      >
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: '600' }}>
            {modules.find(m => m.id === selectedModule)?.name || 'Dashboard'}
          </Typography>
          
          {/* Header tabs - only show for leads module */}
          {selectedModule === 'leads' && (
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs value="all" aria-label="leads tabs">
                <Tab label="All Leads" value="all" />
                <Tab label="New" value="new" />
                <Tab label="Contacted" value="contacted" />
                <Tab label="Converted" value="converted" />
                <Tab label="Active" value="active" />
                <Tab label="Closed" value="closed" />
              </Tabs>
            </Box>
          )}
        </Toolbar>
      </AppBar>

      {/* Main Navigation */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
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

      {/* Main Content Area */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          pt: 8,
          px: 3,
          backgroundColor: '#F9FAFB',
          minHeight: '100vh'
        }}
      >
        {children}
      </Box>
    </Box>
  )
}
