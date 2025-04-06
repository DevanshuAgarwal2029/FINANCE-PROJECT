import React from 'react';
import { Container, Typography, Box, Paper, Grid, Link } from '@mui/material';

const AboutPage = () => {
  return (
    <Container maxWidth="lg">
      <Box my={4}>
        <Typography variant="h3" component="h1" gutterBottom>
          About IndiStockPredictor
        </Typography>
        
        <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
          <Typography variant="h5" gutterBottom>
            Our Mission
          </Typography>
          <Typography variant="body1" paragraph>
            IndiStockPredictor is dedicated to revolutionizing stock market analysis for Indian investors through
            advanced AI-driven predictions and data analytics. We aim to democratize financial information and
            empower investors with accurate, timely insights to make informed investment decisions.
          </Typography>
          
          <Typography variant="h5" gutterBottom>
            What We Offer
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Box>
                <Typography variant="h6" gutterBottom>
                  AI-Powered Predictions
                </Typography>
                <Typography variant="body2">
                  Our machine learning models analyze vast amounts of historical data, market trends, and company 
                  fundamentals to generate predictive insights for stock price movements.
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box>
                <Typography variant="h6" gutterBottom>
                  Comprehensive Analysis
                </Typography>
                <Typography variant="body2">
                  Access detailed fundamental analysis, technical indicators, and market sentiment for stocks 
                  across all major Indian exchanges.
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box>
                <Typography variant="h6" gutterBottom>
                  Portfolio Management
                </Typography>
                <Typography variant="body2">
                  Track your investments, monitor performance, and receive personalized recommendations to 
                  optimize your portfolio.
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>
        
        <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
          <Typography variant="h5" gutterBottom>
            Our Technology
          </Typography>
          <Typography variant="body1" paragraph>
            IndiStockPredictor employs cutting-edge technologies including:
          </Typography>
          <Box component="ul">
            <Box component="li">
              <Typography variant="body1">
                Advanced machine learning algorithms trained on decades of market data
              </Typography>
            </Box>
            <Box component="li">
              <Typography variant="body1">
                Natural language processing to analyze news and social media sentiment
              </Typography>
            </Box>
            <Box component="li">
              <Typography variant="body1">
                Real-time data processing infrastructure for timely market insights
              </Typography>
            </Box>
            <Box component="li">
              <Typography variant="body1">
                Intuitive, responsive user interfaces built with React and Material-UI
              </Typography>
            </Box>
          </Box>
        </Paper>
        
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h5" gutterBottom>
            Disclaimer
          </Typography>
          <Typography variant="body2" color="text.secondary">
            IndiStockPredictor provides information for educational purposes only. The information presented on this 
            website should not be construed as financial or investment advice. Stock market investments are subject to 
            market risks. Past performance is not indicative of future returns. Please consult with a certified financial 
            advisor before making any investment decisions.
          </Typography>
          <Box mt={3}>
            <Typography variant="body2">
              For any inquiries, please contact us at <Link href="mailto:support@indistockpredictor.com">support@indistockpredictor.com</Link>
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default AboutPage; 