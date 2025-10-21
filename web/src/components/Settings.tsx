import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  Chip,
  Switch,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Save as SaveIcon,
  Cancel as CancelIcon
} from '@mui/icons-material';
import { supabase } from '../lib/supabase';

interface NotificationSetting {
  id: number;
  type: 'email' | 'phone';
  value: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export default function Settings() {
  const [settings, setSettings] = useState<NotificationSetting[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingSetting, setEditingSetting] = useState<NotificationSetting | null>(null);
  const [formData, setFormData] = useState({
    type: 'email' as 'email' | 'phone',
    value: '',
    countryCode: '+1',
    phoneNumber: '',
    is_active: true
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error' | 'warning' | 'info'
  });

  // Fetch notification settings
  const fetchSettings = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('notification_settings')
        .select('*')
        .order('type', { ascending: true })
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching settings:', error);
        setSnackbar({
          open: true,
          message: `Failed to fetch settings: ${error.message}`,
          severity: 'error'
        });
        return;
      }

      setSettings(data || []);
    } catch (error) {
      console.error('Error fetching settings:', error);
      setSnackbar({
        open: true,
        message: 'Failed to fetch settings',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  // Handle add new email
  const handleAddEmail = () => {
    setEditingSetting(null);
    setFormData({
      type: 'email',
      value: '',
      countryCode: '+1',
      phoneNumber: '',
      is_active: true
    });
    setOpenDialog(true);
  };

  // Handle add new phone
  const handleAddPhone = () => {
    setEditingSetting(null);
    setFormData({
      type: 'phone',
      value: '',
      countryCode: '+1',
      phoneNumber: '',
      is_active: true
    });
    setOpenDialog(true);
  };

  // Handle edit setting
  const handleEditSetting = (setting: NotificationSetting) => {
    setEditingSetting(setting);
    
    console.log('🔍 Editing setting:', setting);
    
    // Parse phone number if it's a phone setting
    if (setting.type === 'phone' && setting.value.startsWith('+')) {
      // Try different regex patterns to match country codes
      const patterns = [
        /^(\+\d{1,4})(\d+)$/,  // Standard pattern
        /^(\+\d{1,3})(\d+)$/,  // Shorter country codes
        /^(\+\d{2})(\d+)$/     // 2-digit country codes
      ];
      
      let parsed = false;
      for (const pattern of patterns) {
        const match = setting.value.match(pattern);
        if (match) {
          console.log('📱 Parsed phone:', { countryCode: match[1], phoneNumber: match[2] });
          setFormData({
            type: setting.type,
            value: setting.value,
            countryCode: match[1],
            phoneNumber: match[2],
            is_active: setting.is_active
          });
          parsed = true;
          break;
        }
      }
      
      if (!parsed) {
        console.log('⚠️ Could not parse phone number, using default');
        setFormData({
          type: setting.type,
          value: setting.value,
          countryCode: '+1',
          phoneNumber: setting.value.replace(/^\+/, ''),
          is_active: setting.is_active
        });
      }
    } else {
      setFormData({
        type: setting.type,
        value: setting.value,
        countryCode: '+1',
        phoneNumber: '',
        is_active: setting.is_active
      });
    }
    setOpenDialog(true);
  };

  // Handle save setting
  const handleSaveSetting = async () => {
    try {
      console.log('💾 Saving setting with formData:', formData);
      
      // Prepare the final value based on type
      let finalValue = '';
      
      if (formData.type === 'email') {
        finalValue = formData.value.trim();
        if (!finalValue) {
          setSnackbar({
            open: true,
            message: 'Please enter a valid email address',
            severity: 'error'
          });
          return;
        }
        
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(finalValue)) {
          setSnackbar({
            open: true,
            message: 'Please enter a valid email address',
            severity: 'error'
          });
          return;
        }
      } else {
        // Phone number
        if (!formData.phoneNumber.trim()) {
          setSnackbar({
            open: true,
            message: 'Please enter a phone number',
            severity: 'error'
          });
          return;
        }
        
        // Combine country code and phone number
        finalValue = `${formData.countryCode}${formData.phoneNumber.replace(/\D/g, '')}`;
        console.log('📱 Final phone value:', finalValue);
        
        // Validate phone format
        const phoneRegex = /^\+[1-9]\d{1,14}$/;
        if (!phoneRegex.test(finalValue)) {
          setSnackbar({
            open: true,
            message: 'Please enter a valid phone number',
            severity: 'error'
          });
          return;
        }
      }

      console.log('✅ Final value to save:', finalValue);

      if (editingSetting) {
        // Update existing setting
        const { error } = await supabase
          .from('notification_settings')
          .update({
            type: formData.type,
            value: finalValue,
            is_active: formData.is_active
          })
          .eq('id', editingSetting.id);

        if (error) {
          console.error('Error updating setting:', error);
          setSnackbar({
            open: true,
            message: `Failed to update setting: ${error.message}`,
            severity: 'error'
          });
          return;
        }

        setSnackbar({
          open: true,
          message: 'Setting updated successfully',
          severity: 'success'
        });
      } else {
        // Create new setting
        const { error } = await supabase
          .from('notification_settings')
          .insert([{
            type: formData.type,
            value: finalValue,
            is_active: formData.is_active
          }]);

        if (error) {
          console.error('Error creating setting:', error);
          setSnackbar({
            open: true,
            message: `Failed to create setting: ${error.message}`,
            severity: 'error'
          });
          return;
        }

        setSnackbar({
          open: true,
          message: 'Setting created successfully',
          severity: 'success'
        });
      }

      setOpenDialog(false);
      fetchSettings();
    } catch (error) {
      console.error('Error saving setting:', error);
      setSnackbar({
        open: true,
        message: 'Failed to save setting',
        severity: 'error'
      });
    }
  };

  // Handle delete setting
  const handleDeleteSetting = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this notification setting?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('notification_settings')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting setting:', error);
        setSnackbar({
          open: true,
          message: `Failed to delete setting: ${error.message}`,
          severity: 'error'
        });
        return;
      }

      setSnackbar({
        open: true,
        message: 'Setting deleted successfully',
        severity: 'success'
      });
      fetchSettings();
    } catch (error) {
      console.error('Error deleting setting:', error);
      setSnackbar({
        open: true,
        message: 'Failed to delete setting',
        severity: 'error'
      });
    }
  };

  // Handle toggle active status
  const handleToggleActive = async (id: number, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from('notification_settings')
        .update({ is_active: !isActive })
        .eq('id', id);

      if (error) {
        console.error('Error toggling setting:', error);
        setSnackbar({
          open: true,
          message: `Failed to update setting: ${error.message}`,
          severity: 'error'
        });
        return;
      }

      setSnackbar({
        open: true,
        message: `Setting ${!isActive ? 'activated' : 'deactivated'} successfully`,
        severity: 'success'
      });
      fetchSettings();
    } catch (error) {
      console.error('Error toggling setting:', error);
      setSnackbar({
        open: true,
        message: 'Failed to update setting',
        severity: 'error'
      });
    }
  };

  const emailSettings = settings.filter(s => s.type === 'email');
  const phoneSettings = settings.filter(s => s.type === 'phone');

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Settings
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Manage notification recipients for lead alerts
      </Typography>

      {/* Email Settings */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <EmailIcon color="primary" />
              Email Notifications
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleAddEmail}
              size="small"
            >
              Add Email
            </Button>
          </Box>

          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Email Address</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Created</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {emailSettings.map((setting) => (
                  <TableRow key={setting.id}>
                    <TableCell>{setting.value}</TableCell>
                    <TableCell>
                      <Chip
                        label={setting.is_active ? 'Active' : 'Inactive'}
                        color={setting.is_active ? 'success' : 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      {new Date(setting.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell align="right">
                      <Switch
                        checked={setting.is_active}
                        onChange={() => handleToggleActive(setting.id, setting.is_active)}
                        size="small"
                      />
                      <IconButton
                        onClick={() => handleEditSetting(setting)}
                        size="small"
                        sx={{ ml: 1 }}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        onClick={() => handleDeleteSetting(setting.id)}
                        size="small"
                        color="error"
                        sx={{ ml: 1 }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
                {emailSettings.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      No email settings configured
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Phone Settings */}
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <PhoneIcon color="primary" />
              Phone Notifications
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleAddPhone}
              size="small"
            >
              Add Phone
            </Button>
          </Box>

          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Phone Number</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Created</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {phoneSettings.map((setting) => (
                  <TableRow key={setting.id}>
                    <TableCell>{setting.value}</TableCell>
                    <TableCell>
                      <Chip
                        label={setting.is_active ? 'Active' : 'Inactive'}
                        color={setting.is_active ? 'success' : 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      {new Date(setting.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell align="right">
                      <Switch
                        checked={setting.is_active}
                        onChange={() => handleToggleActive(setting.id, setting.is_active)}
                        size="small"
                      />
                      <IconButton
                        onClick={() => handleEditSetting(setting)}
                        size="small"
                        sx={{ ml: 1 }}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        onClick={() => handleDeleteSetting(setting.id)}
                        size="small"
                        color="error"
                        sx={{ ml: 1 }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
                {phoneSettings.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      No phone settings configured
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingSetting ? `Edit ${formData.type === 'email' ? 'Email' : 'Phone'} Setting` : `Add ${formData.type === 'email' ? 'Email' : 'Phone'} Address`}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            {formData.type === 'email' ? (
              <TextField
                fullWidth
                label="Email Address"
                value={formData.value}
                onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                placeholder="example@gmail.com"
                sx={{ mb: 2 }}
              />
            ) : (
              <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <FormControl sx={{ minWidth: 120 }}>
                  <InputLabel>Country Code</InputLabel>
                  <Select
                    value={formData.countryCode}
                    label="Country Code"
                    onChange={(e) => setFormData({ ...formData, countryCode: e.target.value })}
                  >
                    <MenuItem value="+1">🇺🇸 +1</MenuItem>
                    <MenuItem value="+91">🇮🇳 +91</MenuItem>
                    <MenuItem value="+44">🇬🇧 +44</MenuItem>
                    <MenuItem value="+33">🇫🇷 +33</MenuItem>
                    <MenuItem value="+49">🇩🇪 +49</MenuItem>
                    <MenuItem value="+81">🇯🇵 +81</MenuItem>
                    <MenuItem value="+86">🇨🇳 +86</MenuItem>
                    <MenuItem value="+61">🇦🇺 +61</MenuItem>
                    <MenuItem value="+55">🇧🇷 +55</MenuItem>
                    <MenuItem value="+52">🇲🇽 +52</MenuItem>
                  </Select>
                </FormControl>
                <TextField
                  fullWidth
                  label="Phone Number"
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                  placeholder="1234567890"
                />
              </Box>
            )}

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Switch
                checked={formData.is_active}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
              />
              <Typography>Active</Typography>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} startIcon={<CancelIcon />}>
            Cancel
          </Button>
          <Button onClick={handleSaveSetting} variant="contained" startIcon={<SaveIcon />}>
            {editingSetting ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
