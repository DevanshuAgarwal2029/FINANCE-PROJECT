import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Container, 
  Typography, 
  Paper, 
  Box, 
  TextField, 
  Button, 
  Grid, 
  Avatar, 
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Alert,
  Snackbar
} from '@mui/material';
import { 
  Save, 
  Cancel, 
  PhotoCamera, 
  ArrowBack 
} from '@mui/icons-material';

const EditProfilePage = () => {
  const navigate = useNavigate();
  
  // Mock user data - In a real app, this would come from Redux or API
  const initialUserData = {
    id: "1234",
    name: "Rahul Sharma",
    email: "rahul.sharma@example.com",
    phone: "+91 98765 43210",
    location: "Mumbai, India",
    bio: "Stock market enthusiast with 5+ years of trading experience. Focused on long-term investments and technical analysis.",
    avatar: "", // URL to avatar image or empty for default
    notification_preferences: "email",
    password: "",
    confirmPassword: "",
  };

  const [userData, setUserData] = useState(initialUserData);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [errors, setErrors] = useState({});

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value
    });
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };

  // Handle avatar upload
  const handleAvatarChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatarPreview(URL.createObjectURL(file));
      
      // In a real app, you'd upload the file to your server here
      // and get back a URL to save in the user profile
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    // Validate name
    if (!userData.name.trim()) {
      newErrors.name = "Name is required";
    }
    
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!userData.email.trim() || !emailRegex.test(userData.email)) {
      newErrors.email = "Valid email is required";
    }
    
    // Validate phone (basic)
    if (!userData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    }
    
    // Validate password match if either field is filled
    if (userData.password || userData.confirmPassword) {
      if (userData.password !== userData.confirmPassword) {
        newErrors.confirmPassword = "Passwords don't match";
      } else if (userData.password.length < 8) {
        newErrors.password = "Password must be at least 8 characters";
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      // In a real app, you'd dispatch a Redux action or API call here
      console.log("Updated user data:", userData);
      
      // Show success message
      setOpenSnackbar(true);
      
      // Navigate back to profile page after a delay
      setTimeout(() => {
        navigate('/profile');
      }, 1500);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <IconButton 
          onClick={() => navigate('/profile')} 
          sx={{ mr: 2 }}
          aria-label="back to profile"
        >
          <ArrowBack />
        </IconButton>
        <Typography variant="h4" component="h1" fontWeight="bold">
          Edit Profile
        </Typography>
      </Box>
      
      <Paper component="form" onSubmit={handleSubmit} sx={{ p: 3, borderRadius: 2 }}>
        <Grid container spacing={4}>
          {/* Avatar Upload Section */}
          <Grid item xs={12} md={4} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Avatar 
              src={avatarPreview || userData.avatar}
              alt={userData.name}
              sx={{ 
                width: 150, 
                height: 150, 
                mb: 2,
                bgcolor: 'primary.main',
                fontSize: '4rem'
              }}
            >
              {userData.name.charAt(0)}
            </Avatar>
            
            <input
              accept="image/*"
              style={{ display: 'none' }}
              id="avatar-upload"
              type="file"
              onChange={handleAvatarChange}
            />
            <label htmlFor="avatar-upload">
              <Button
                variant="outlined"
                component="span"
                startIcon={<PhotoCamera />}
                sx={{ mb: 2 }}
              >
                Change Photo
              </Button>
            </label>
            
            <Typography variant="body2" color="text.secondary" align="center">
              Upload a clear photo to help others recognize you. JPG or PNG, max 5MB.
            </Typography>
          </Grid>
          
          {/* Profile Details Section */}
          <Grid item xs={12} md={8}>
            <Typography variant="h6" gutterBottom>
              Personal Information
            </Typography>
            <Divider sx={{ mb: 3 }} />
            
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="Full Name"
                  name="name"
                  value={userData.name}
                  onChange={handleChange}
                  fullWidth
                  required
                  error={!!errors.name}
                  helperText={errors.name}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Email"
                  name="email"
                  type="email"
                  value={userData.email}
                  onChange={handleChange}
                  fullWidth
                  required
                  error={!!errors.email}
                  helperText={errors.email}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Phone"
                  name="phone"
                  value={userData.phone}
                  onChange={handleChange}
                  fullWidth
                  required
                  error={!!errors.phone}
                  helperText={errors.phone}
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  label="Location"
                  name="location"
                  value={userData.location}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  label="Bio"
                  name="bio"
                  value={userData.bio}
                  onChange={handleChange}
                  multiline
                  rows={3}
                  fullWidth
                />
              </Grid>
              
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Notification Preferences</InputLabel>
                  <Select
                    name="notification_preferences"
                    value={userData.notification_preferences}
                    onChange={handleChange}
                    label="Notification Preferences"
                  >
                    <MenuItem value="email">Email</MenuItem>
                    <MenuItem value="push">Push Notifications</MenuItem>
                    <MenuItem value="both">Both</MenuItem>
                    <MenuItem value="none">None</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            
            <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
              Change Password
            </Typography>
            <Divider sx={{ mb: 3 }} />
            
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="New Password"
                  name="password"
                  type="password"
                  value={userData.password}
                  onChange={handleChange}
                  fullWidth
                  error={!!errors.password}
                  helperText={errors.password || "Leave blank to keep current password"}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Confirm New Password"
                  name="confirmPassword"
                  type="password"
                  value={userData.confirmPassword}
                  onChange={handleChange}
                  fullWidth
                  error={!!errors.confirmPassword}
                  helperText={errors.confirmPassword}
                />
              </Grid>
            </Grid>
            
            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
              <Button 
                variant="outlined" 
                startIcon={<Cancel />} 
                onClick={() => navigate('/profile')}
                sx={{ mr: 2 }}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                variant="contained" 
                color="primary" 
                startIcon={<Save />}
              >
                Save Changes
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>
      
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" sx={{ width: '100%' }}>
          Profile updated successfully!
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default EditProfilePage; 