import React from 'react';
import { 
  Box, 
  Container, 
  Grid, 
  Typography, 
  Link, 
  Divider, 
  Paper,
  List,
  ListItem,
  ListItemText,
  Button
} from '@mui/material';
import { 
  Facebook, 
  Twitter, 
  LinkedIn, 
  Instagram,
  YouTube
} from '@mui/icons-material';

const Footer = () => {
  const year = new Date().getFullYear();
  
  return (
    <Paper 
      component="footer" 
      square 
      variant="outlined" 
      sx={{ 
        mt: 'auto',
        py: 3,
        backgroundColor: 'background.paper'
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              IndiStockPredictor
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Accurate predictions. Informed decisions. Indian markets.
            </Typography>
            <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
              <Link href="#" color="inherit">
                <Facebook />
              </Link>
              <Link href="#" color="inherit">
                <Twitter />
              </Link>
              <Link href="#" color="inherit">
                <LinkedIn />
              </Link>
              <Link href="#" color="inherit">
                <Instagram />
              </Link>
              <Link href="#" color="inherit">
                <YouTube />
              </Link>
            </Box>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              Markets
            </Typography>
            <List dense disablePadding>
              <ListItem disableGutters>
                <ListItemText primary={<Link href="#" color="inherit" underline="hover">NSE</Link>} />
              </ListItem>
              <ListItem disableGutters>
                <ListItemText primary={<Link href="#" color="inherit" underline="hover">BSE</Link>} />
              </ListItem>
              <ListItem disableGutters>
                <ListItemText primary={<Link href="#" color="inherit" underline="hover">Market Indices</Link>} />
              </ListItem>
              <ListItem disableGutters>
                <ListItemText primary={<Link href="#" color="inherit" underline="hover">Top Gainers/Losers</Link>} />
              </ListItem>
              <ListItem disableGutters>
                <ListItemText primary={<Link href="#" color="inherit" underline="hover">Market News</Link>} />
              </ListItem>
            </List>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              Tools
            </Typography>
            <List dense disablePadding>
              <ListItem disableGutters>
                <ListItemText primary={<Link href="#" color="inherit" underline="hover">Stock Screener</Link>} />
              </ListItem>
              <ListItem disableGutters>
                <ListItemText primary={<Link href="#" color="inherit" underline="hover">Price Prediction</Link>} />
              </ListItem>
              <ListItem disableGutters>
                <ListItemText primary={<Link href="#" color="inherit" underline="hover">Fundamental Analysis</Link>} />
              </ListItem>
              <ListItem disableGutters>
                <ListItemText primary={<Link href="#" color="inherit" underline="hover">Technical Analysis</Link>} />
              </ListItem>
              <ListItem disableGutters>
                <ListItemText primary={<Link href="#" color="inherit" underline="hover">Portfolio Tracker</Link>} />
              </ListItem>
            </List>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              Company
            </Typography>
            <List dense disablePadding>
              <ListItem disableGutters>
                <ListItemText primary={<Link href="#" color="inherit" underline="hover">About Us</Link>} />
              </ListItem>
              <ListItem disableGutters>
                <ListItemText primary={<Link href="#" color="inherit" underline="hover">Contact</Link>} />
              </ListItem>
              <ListItem disableGutters>
                <ListItemText primary={<Link href="#" color="inherit" underline="hover">Careers</Link>} />
              </ListItem>
              <ListItem disableGutters>
                <ListItemText primary={<Link href="#" color="inherit" underline="hover">Terms of Service</Link>} />
              </ListItem>
              <ListItem disableGutters>
                <ListItemText primary={<Link href="#" color="inherit" underline="hover">Privacy Policy</Link>} />
              </ListItem>
            </List>
          </Grid>
        </Grid>
        
        <Divider sx={{ my: 3 }} />
        
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            © {year} IndiStockPredictor. All rights reserved.
          </Typography>
          
          <Box sx={{ mt: { xs: 2, sm: 0 } }}>
            <Button size="small" color="inherit">Terms</Button>
            <Button size="small" color="inherit">Privacy</Button>
            <Button size="small" color="inherit">Cookies</Button>
          </Box>
        </Box>
        
        <Box mt={2}>
          <Typography variant="caption" color="text.secondary" align="center" display="block">
            Disclaimer: IndiStockPredictor provides investment information and recommendations based on data analysis and prediction models.
            These are not definitive investment advice. Investments in securities market are subject to market risks.
            Please read all the related documents carefully before investing.
          </Typography>
        </Box>
      </Container>
    </Paper>
  );
};

export default Footer; 