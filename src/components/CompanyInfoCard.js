import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Divider,
  Chip,
  CircularProgress,
  Alert,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar
} from '@mui/material';
import {
  Language,
  Business,
  LocationOn,
  Phone,
  Mail,
  People,
  Person,
  CalendarToday,
  Info
} from '@mui/icons-material';

const CompanyInfoCard = ({ companyInfo, loading, error }) => {
  // Handle loading state
  if (loading) {
    return (
      <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" p={4} minHeight={300}>
        <CircularProgress size={60} thickness={4} />
        <Typography variant="body1" color="text.secondary" mt={2}>
          Loading company information...
        </Typography>
      </Box>
    );
  }
  
  // Handle error state
  if (error) {
    return (
      <Alert 
        severity="error"
        sx={{ my: 2 }}
        action={
          <Chip 
            label="Retry" 
            variant="outlined" 
            size="small" 
            clickable
          />
        }
      >
        Error loading company information: {error}
      </Alert>
    );
  }
  
  // Handle no data case
  if (!companyInfo || Object.keys(companyInfo).length === 0) {
    return (
      <Box 
        display="flex" 
        flexDirection="column" 
        alignItems="center" 
        justifyContent="center" 
        p={6} 
        minHeight={300}
        textAlign="center"
      >
        <Info sx={{ fontSize: 80, color: 'primary.light', mb: 2 }} />
        <Typography variant="h5" color="text.secondary" gutterBottom>
          Company information is not available for this stock.
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph sx={{ maxWidth: 500 }}>
          We're currently collecting more information about this company. Please check back later for detailed company information.
        </Typography>
      </Box>
    );
  }
  
  return (
    <Box>
      {/* Company Header */}
      <Paper variant="outlined" sx={{ p: 3, mb: 4 }}>
        <Grid container spacing={3} alignItems="center">
          {companyInfo.logo && (
            <Grid item xs={12} sm={2} md={1}>
              <Avatar 
                src={companyInfo.logo} 
                alt={companyInfo.name || 'Company Logo'} 
                variant="rounded"
                sx={{ width: 80, height: 80, borderRadius: 2 }}
              />
            </Grid>
          )}
          
          <Grid item xs={12} sm={companyInfo.logo ? 10 : 12} md={companyInfo.logo ? 11 : 12}>
            <Typography variant="h5" gutterBottom>
              {companyInfo.name || 'N/A'}
            </Typography>
            
            <Box display="flex" flexWrap="wrap" gap={1} mb={1}>
              {companyInfo.sector && (
                <Chip 
                  label={companyInfo.sector} 
                  color="primary" 
                  variant="outlined" 
                  size="small"
                />
              )}
              
              {companyInfo.industry && (
                <Chip 
                  label={companyInfo.industry} 
                  variant="outlined" 
                  size="small"
                />
              )}
              
              {companyInfo.founded && (
                <Chip 
                  icon={<CalendarToday fontSize="small" />}
                  label={`Est. ${companyInfo.founded}`} 
                  variant="outlined" 
                  size="small"
                />
              )}
            </Box>
            
            <Typography variant="body2" color="text.secondary">
              {companyInfo.description || 'No company description available.'}
            </Typography>
          </Grid>
        </Grid>
      </Paper>
      
      {/* Contact Information */}
      <Grid container spacing={4}>
        {/* Company Details */}
        <Grid item xs={12} md={6}>
          <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
            Company Details
          </Typography>
          
          <Paper variant="outlined" sx={{ p: 0 }}>
            <List>
              {companyInfo.headquarters && (
                <ListItem>
                  <ListItemIcon>
                    <LocationOn color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Headquarters" 
                    secondary={companyInfo.headquarters} 
                  />
                </ListItem>
              )}
              
              {companyInfo.website && (
                <ListItem>
                  <ListItemIcon>
                    <Language color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Website" 
                    secondary={
                      <Typography 
                        component="a" 
                        href={companyInfo.website.startsWith('http') ? companyInfo.website : `https://${companyInfo.website}`} 
                        target="_blank"
                        rel="noopener noreferrer"
                        color="primary"
                      >
                        {companyInfo.website}
                      </Typography>
                    } 
                  />
                </ListItem>
              )}
              
              {companyInfo.phoneNumber && (
                <ListItem>
                  <ListItemIcon>
                    <Phone color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Phone" 
                    secondary={companyInfo.phoneNumber} 
                  />
                </ListItem>
              )}
              
              {companyInfo.email && (
                <ListItem>
                  <ListItemIcon>
                    <Mail color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Email" 
                    secondary={
                      <Typography 
                        component="a" 
                        href={`mailto:${companyInfo.email}`}
                        color="primary"
                      >
                        {companyInfo.email}
                      </Typography>
                    } 
                  />
                </ListItem>
              )}
              
              {companyInfo.employees && (
                <ListItem>
                  <ListItemIcon>
                    <People color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Employees" 
                    secondary={companyInfo.employees.toLocaleString()} 
                  />
                </ListItem>
              )}
              
              {companyInfo.ceo && (
                <ListItem>
                  <ListItemIcon>
                    <Person color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="CEO" 
                    secondary={companyInfo.ceo} 
                  />
                </ListItem>
              )}
              
              {companyInfo.incorporation && (
                <ListItem>
                  <ListItemIcon>
                    <Business color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Incorporation" 
                    secondary={companyInfo.incorporation} 
                  />
                </ListItem>
              )}
            </List>
          </Paper>
        </Grid>
        
        {/* Business Summary */}
        <Grid item xs={12} md={6}>
          <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
            Business Summary
          </Typography>
          
          <Paper variant="outlined" sx={{ p: 3, height: '100%' }}>
            {companyInfo.businessSummary ? (
              <Typography variant="body2">
                {companyInfo.businessSummary}
              </Typography>
            ) : (
              <Typography variant="body2" color="text.secondary">
                Detailed business summary is not available for this company.
              </Typography>
            )}
          </Paper>
        </Grid>
      </Grid>
      
      {/* Products and Services */}
      {companyInfo.products && companyInfo.products.length > 0 && (
        <Box mt={4}>
          <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
            Key Products and Services
          </Typography>
          
          <Paper variant="outlined" sx={{ p: 2 }}>
            <Grid container spacing={2}>
              {companyInfo.products.map((product, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Box p={2} borderRadius={1} bgcolor="action.hover">
                    <Typography variant="subtitle2">{product.name}</Typography>
                    <Typography variant="body2" color="text.secondary">{product.description}</Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Box>
      )}
      
      {/* Disclaimer */}
      <Box mt={4}>
        <Divider sx={{ mb: 2 }} />
        <Typography variant="caption" color="text.secondary">
          Company information is sourced from public data and may not be complete or up-to-date. 
          Last updated: {companyInfo.lastUpdated ? new Date(companyInfo.lastUpdated).toLocaleDateString() : 'Not available'}
        </Typography>
      </Box>
    </Box>
  );
};

export default CompanyInfoCard; 