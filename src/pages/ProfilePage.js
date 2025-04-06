import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Container, 
  Typography, 
  Paper, 
  Box, 
  Avatar, 
  Grid, 
  Divider, 
  Button, 
  Card, 
  CardContent, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemIcon,
  Chip
} from '@mui/material';
import { 
  Person, 
  Email, 
  Phone, 
  LocationOn, 
  CalendarToday, 
  Edit, 
  Security, 
  Notifications, 
  AccountBalance 
} from '@mui/icons-material';

const ProfilePage = () => {
  // Mock user data - In a real app, this would come from a Redux store or API call
  const user = {
    id: "1234",
    name: "Rahul Sharma",
    email: "rahul.sharma@example.com",
    phone: "+91 98765 43210",
    location: "Mumbai, India",
    joinDate: "January 2023",
    avatar: "", // URL to avatar image or empty for default
    accountType: "Premium",
    portfolioValue: "₹4,85,750",
    watchlistCount: 12,
    recentActivity: [
      { id: 1, action: "Added INFY to watchlist", date: "2 days ago" },
      { id: 2, action: "Updated portfolio", date: "5 days ago" },
      { id: 3, action: "Viewed RELIANCE prediction", date: "1 week ago" }
    ]
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
        My Profile
      </Typography>
      
      <Grid container spacing={3}>
        {/* Profile Summary Card */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, borderRadius: 2, height: '100%' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
              <Avatar 
                src={user.avatar}
                alt={user.name}
                sx={{ 
                  width: 120, 
                  height: 120, 
                  mb: 2,
                  bgcolor: 'primary.main',
                  fontSize: '3rem'
                }}
              >
                {user.name.charAt(0)}
              </Avatar>
              <Typography variant="h5" gutterBottom fontWeight="medium">
                {user.name}
              </Typography>
              <Chip 
                label={user.accountType} 
                color="primary" 
                variant="outlined"
                sx={{ fontWeight: 'medium' }}
              />
            </Box>
            
            <Divider sx={{ my: 2 }} />
            
            <List disablePadding>
              <ListItem>
                <ListItemIcon>
                  <Email fontSize="small" color="action" />
                </ListItemIcon>
                <ListItemText 
                  primary="Email" 
                  secondary={user.email}
                  primaryTypographyProps={{ variant: 'body2', color: 'text.secondary' }}
                  secondaryTypographyProps={{ variant: 'body1' }}
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <Phone fontSize="small" color="action" />
                </ListItemIcon>
                <ListItemText 
                  primary="Phone" 
                  secondary={user.phone}
                  primaryTypographyProps={{ variant: 'body2', color: 'text.secondary' }}
                  secondaryTypographyProps={{ variant: 'body1' }}
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <LocationOn fontSize="small" color="action" />
                </ListItemIcon>
                <ListItemText 
                  primary="Location" 
                  secondary={user.location}
                  primaryTypographyProps={{ variant: 'body2', color: 'text.secondary' }}
                  secondaryTypographyProps={{ variant: 'body1' }}
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CalendarToday fontSize="small" color="action" />
                </ListItemIcon>
                <ListItemText 
                  primary="Member Since" 
                  secondary={user.joinDate}
                  primaryTypographyProps={{ variant: 'body2', color: 'text.secondary' }}
                  secondaryTypographyProps={{ variant: 'body1' }}
                />
              </ListItem>
            </List>
            
            <Box sx={{ mt: 3 }}>
              <Button 
                variant="contained" 
                color="primary" 
                fullWidth 
                startIcon={<Edit />}
                component={Link}
                to="/profile/edit"
                sx={{ py: 1, fontWeight: 'medium' }}
              >
                Edit Profile
              </Button>
            </Box>
          </Paper>
        </Grid>
        
        {/* Account Information */}
        <Grid item xs={12} md={8}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Paper sx={{ p: 3, borderRadius: 2 }}>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                  <AccountBalance sx={{ mr: 1 }} /> Account Information
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} md={4}>
                    <Card sx={{ height: '100%', boxShadow: 'none', bgcolor: 'background.default' }}>
                      <CardContent>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          Portfolio Value
                        </Typography>
                        <Typography variant="h5" fontWeight="bold">
                          {user.portfolioValue}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <Card sx={{ height: '100%', boxShadow: 'none', bgcolor: 'background.default' }}>
                      <CardContent>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          Watchlist Items
                        </Typography>
                        <Typography variant="h5" fontWeight="bold">
                          {user.watchlistCount}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <Card sx={{ height: '100%', boxShadow: 'none', bgcolor: 'background.default' }}>
                      <CardContent>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          Account Type
                        </Typography>
                        <Typography variant="h5" fontWeight="bold">
                          {user.accountType}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>

            <Grid item xs={12}>
              <Paper sx={{ p: 3, borderRadius: 2 }}>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                  <Notifications sx={{ mr: 1 }} /> Recent Activity
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <List>
                  {user.recentActivity.map(activity => (
                    <ListItem key={activity.id} divider>
                      <ListItemText 
                        primary={activity.action}
                        secondary={activity.date}
                        primaryTypographyProps={{ fontWeight: 'medium' }}
                      />
                    </ListItem>
                  ))}
                </List>
              </Paper>
            </Grid>

            <Grid item xs={12}>
              <Paper sx={{ p: 3, borderRadius: 2 }}>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                  <Security sx={{ mr: 1 }} /> Account Security
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Password
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body1">
                      ••••••••••
                    </Typography>
                    <Button size="small" variant="outlined" component={Link} to="/profile/edit">
                      Change
                    </Button>
                  </Box>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Two-Factor Authentication
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="body1">
                      Not enabled
                    </Typography>
                    <Button size="small" variant="outlined" component={Link} to="/profile/edit">
                      Enable
                    </Button>
                  </Box>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ProfilePage; 