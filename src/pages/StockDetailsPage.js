import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Grid,
  Typography,
  Box,
  Paper,
  Tabs,
  Tab,
  Divider,
  Chip,
  Button,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  LinearProgress
} from '@mui/material';
import {
  Favorite,
  FavoriteBorder,
  TrendingUp,
  TrendingDown,
  Timeline,
  Assessment,
  BusinessCenter,
  Description,
  Warning,
  ArrowUpward,
  ArrowDownward,
  RemoveOutlined,
  FiberManualRecord
} from '@mui/icons-material';

// Import components
import StockPredictionChart from '../components/StockPredictionChart';
import FundamentalAnalysisCard from '../components/FundamentalAnalysisCard';
import CompanyInfoCard from '../components/CompanyInfoCard';
import StockNewsCard from '../components/StockNewsCard';
import TechnicalAnalysisCard from '../components/TechnicalAnalysisCard';

// Import actions from Redux
import { 
  fetchStockData, 
  fetchStockPrediction, 
  fetchStockFundamentals,
  fetchStockNews,
  fetchStockTechnical,
  addToWatchlist, 
  removeFromWatchlist 
} from '../redux/stockSlice';

// TabPanel component for displaying tab content
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`stock-tabpanel-${index}`}
      aria-labelledby={`stock-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

// Recommendation Card Component
const RecommendationCard = ({ recommendation }) => {
  if (!recommendation) return null;
  
  const { rating, reasons, strength } = recommendation;
  
  const getRatingColor = () => {
    switch (rating) {
      case 'Strong Buy':
      case 'Buy':
        return 'success.main';
      case 'Sell':
      case 'Reduce':
        return 'error.main';
      default:
        return 'warning.main';
    }
  };
  
  const getIconByRating = () => {
    switch (rating) {
      case 'Strong Buy':
        return <TrendingUp fontSize="large" />;
      case 'Buy':
        return <ArrowUpward fontSize="large" />;
      case 'Sell':
        return <TrendingDown fontSize="large" />;
      case 'Reduce':
        return <ArrowDownward fontSize="large" />;
      default:
        return <RemoveOutlined fontSize="large" />;
    }
  };
  
  return (
    <Card sx={{ mb: 4, position: 'relative', overflow: 'visible' }}>
      <Box
        sx={{
          position: 'absolute',
          top: -20,
          left: 20,
          bgcolor: getRatingColor(),
          color: 'white',
          borderRadius: 2,
          py: 1,
          px: 2,
          fontWeight: 'bold',
          boxShadow: 3,
        }}
      >
        Recommendation
      </Box>
      <CardContent sx={{ pt: 4 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <Box 
              display="flex" 
              flexDirection="column" 
              alignItems="center" 
              justifyContent="center"
              p={2}
              sx={{
                bgcolor: 'background.paper',
                borderRadius: 2,
                border: `2px solid ${getRatingColor()}`
              }}
            >
              <Box color={getRatingColor()}>
                {getIconByRating()}
              </Box>
              <Typography variant="h4" align="center" fontWeight="bold" color={getRatingColor()}>
                {rating}
              </Typography>
              <Box 
                display="flex" 
                alignItems="center" 
                justifyContent="center" 
                width="100%" 
                mt={2}
              >
                <Typography variant="body2" mr={1}>Confidence:</Typography>
                <LinearProgress
                  variant="determinate"
                  value={strength}
                  color={rating.includes('Buy') ? 'success' : rating.includes('Sell') ? 'error' : 'warning'}
                  sx={{ 
                    width: '70%', 
                    height: 8, 
                    borderRadius: 4 
                  }}
                />
                <Typography variant="body2" ml={1}>{strength}%</Typography>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} md={8}>
            <Typography variant="h6" gutterBottom>
              Analysis Summary
            </Typography>
            <List>
              {reasons.map((reason, index) => (
                <ListItem key={index} disablePadding>
                  <ListItemIcon>
                    <FiberManualRecord sx={{ fontSize: 10, color: getRatingColor() }} />
                  </ListItemIcon>
                  <ListItemText primary={reason} />
                </ListItem>
              ))}
            </List>
            <Typography variant="caption" color="text.secondary" display="block" mt={1}>
              Last updated: {new Date(recommendation.updated).toLocaleString()}
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

const StockDetailsPage = () => {
  const { symbol } = useParams();
  const dispatch = useDispatch();
  const [tabValue, setTabValue] = useState(0);
  
  // Get data from Redux store
  const { 
    currentStock,
    prediction,
    fundamentals,
    news,
    technical,
    watchlist,
    loading,
    error
  } = useSelector((state) => state.stock);

  // Check if stock is in watchlist
  const isInWatchlist = watchlist.some(item => item.symbol === symbol);

  // Fetch data on component mount
  useEffect(() => {
    if (symbol) {
      console.log("Fetching data for symbol:", symbol);
      dispatch(fetchStockData(symbol));
      dispatch(fetchStockPrediction(symbol));
      dispatch(fetchStockFundamentals(symbol));
      dispatch(fetchStockNews(symbol));
      dispatch(fetchStockTechnical(symbol));
    }
  }, [dispatch, symbol]);

  // Handler for tab changes
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Handler for watchlist toggle
  const toggleWatchlist = () => {
    if (isInWatchlist) {
      dispatch(removeFromWatchlist(symbol));
    } else {
      dispatch(addToWatchlist({
        symbol,
        name: currentStock?.name || '',
        price: currentStock?.currentPrice || 0,
        change: currentStock?.change || 0,
        changePercent: currentStock?.changePercent || 0
      }));
    }
  };

  // Format large numbers (e.g., market cap) to readable format with Indian notation (crores)
  const formatIndianLakhs = (value) => {
    if (!value) return "N/A";
    
    // Convert to crores (1 crore = 10 million)
    const inCrores = value / 10000000;
    
    if (inCrores >= 1000) {
      return `${(inCrores / 100).toFixed(2)} Hundred Cr`;
    } else {
      return `${inCrores.toFixed(2)} Cr`;
    }
  };

  if (loading.stockData && !currentStock) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error.stockData) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="error">
          Error loading stock data: {error.stockData}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {currentStock && (
        <>
          {/* Stock Header Section */}
          <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={8}>
                <Box display="flex" alignItems="center">
                  {currentStock.logo && (
                    <Box 
                      component="img" 
                      src={currentStock.logo} 
                      alt={currentStock.name}
                      sx={{ 
                        width: 50, 
                        height: 50, 
                        mr: 2, 
                        borderRadius: '8px',
                        objectFit: 'contain' 
                      }}
                    />
                  )}
                  <Box>
                    <Typography variant="h4" component="h1">
                      {currentStock.name} ({symbol})
                    </Typography>
                    <Box display="flex" alignItems="center" mt={0.5}>
                      <Chip 
                        label={currentStock.exchange || "NSE/BSE"} 
                        size="small" 
                        sx={{ mr: 1 }} 
                      />
                      <Typography variant="body2" color="text.secondary">
                        {currentStock.sector || "Sector N/A"} • {currentStock.industry || "Industry N/A"}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Box display="flex" flexDirection="column" alignItems="flex-end">
                  <Typography variant="h4" component="p">
                    ₹{currentStock.currentPrice?.toLocaleString('en-IN') || 'N/A'}
                  </Typography>
                  
                  <Box display="flex" alignItems="center">
                    {currentStock.change && (
                      <>
                        {currentStock.change > 0 ? (
                          <TrendingUp color="success" sx={{ mr: 0.5 }} />
                        ) : (
                          <TrendingDown color="error" sx={{ mr: 0.5 }} />
                        )}
                        <Typography 
                          variant="body1" 
                          component="span" 
                          color={currentStock.change > 0 ? 'success.main' : 'error.main'}
                          fontWeight="bold"
                          mr={1}
                        >
                          ₹{Math.abs(currentStock.change).toFixed(2)}
                        </Typography>
                        <Typography 
                          variant="body1" 
                          component="span" 
                          color={currentStock.changePercent > 0 ? 'success.main' : 'error.main'}
                          fontWeight="bold"
                        >
                          ({Math.abs(currentStock.changePercent).toFixed(2)}%)
                        </Typography>
                      </>
                    )}
                  </Box>
                </Box>
              </Grid>
            </Grid>
            
            {/* Quick Stats Row */}
            <Grid container spacing={3} sx={{ mt: 2 }}>
              <Grid item xs={6} sm={3}>
                <Typography variant="body2" color="text.secondary">
                  Open
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  ₹{currentStock.open?.toLocaleString('en-IN') || 'N/A'}
                </Typography>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Typography variant="body2" color="text.secondary">
                  Previous Close
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  ₹{currentStock.previousClose?.toLocaleString('en-IN') || 'N/A'}
                </Typography>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Typography variant="body2" color="text.secondary">
                  Day Range
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  ₹{currentStock.dayLow?.toLocaleString('en-IN') || 'N/A'} - ₹{currentStock.dayHigh?.toLocaleString('en-IN') || 'N/A'}
                </Typography>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Typography variant="body2" color="text.secondary">
                  52 Week Range
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  ₹{currentStock.yearLow?.toLocaleString('en-IN') || 'N/A'} - ₹{currentStock.yearHigh?.toLocaleString('en-IN') || 'N/A'}
                </Typography>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Typography variant="body2" color="text.secondary">
                  Volume
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {currentStock.volume?.toLocaleString('en-IN') || 'N/A'}
                </Typography>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Typography variant="body2" color="text.secondary">
                  Avg. Volume
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {currentStock.avgVolume?.toLocaleString('en-IN') || 'N/A'}
                </Typography>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Typography variant="body2" color="text.secondary">
                  Market Cap
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {currentStock.marketCap ? formatIndianLakhs(currentStock.marketCap) : 'N/A'}
                </Typography>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Typography variant="body2" color="text.secondary">
                  P/E Ratio
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {currentStock.pe || 'N/A'}
                </Typography>
              </Grid>
            </Grid>
            
            <Box display="flex" justifyContent="flex-end" mt={2}>
              <Button 
                variant="outlined" 
                startIcon={isInWatchlist ? <Favorite /> : <FavoriteBorder />}
                onClick={toggleWatchlist}
                sx={{ mr: 2 }}
              >
                {isInWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}
              </Button>
              <Button 
                variant="contained" 
                startIcon={<BusinessCenter />}
              >
                Add to Portfolio
              </Button>
            </Box>
          </Paper>
          
          {/* Recommendation Section */}
          {currentStock && currentStock.recommendation && (
            <RecommendationCard recommendation={currentStock.recommendation} />
          )}
          
          {/* Chart Section */}
          <Paper elevation={2} sx={{ p: 0, mb: 3 }}>
            <StockPredictionChart 
              historicalData={currentStock.historicalData || []}
              prediction={prediction}
              loading={loading.prediction}
              error={error.prediction}
            />
          </Paper>
          
          {/* Tabs Section */}
          <Paper elevation={2} sx={{ mb: 3 }}>
            <Tabs 
              value={tabValue} 
              onChange={handleTabChange} 
              variant="scrollable"
              scrollButtons="auto"
              allowScrollButtonsMobile
              sx={{ 
                borderBottom: 1, 
                borderColor: 'divider',
                '& .MuiTab-root': {
                  minWidth: { xs: 'auto', sm: 160 }
                }
              }}
            >
              <Tab icon={<Assessment />} label="Fundamentals" iconPosition="start" />
              <Tab icon={<Description />} label="Company Info" iconPosition="start" />
              <Tab icon={<Timeline />} label="Technical Analysis" iconPosition="start" />
              <Tab icon={<Description />} label="News" iconPosition="start" />
            </Tabs>
            
            <TabPanel value={tabValue} index={0}>
              <FundamentalAnalysisCard 
                fundamentals={fundamentals}
                loading={loading.fundamentals}
                error={error.fundamentals}
              />
            </TabPanel>
            
            <TabPanel value={tabValue} index={1}>
              <CompanyInfoCard 
                companyInfo={currentStock.companyInfo || {}}
                loading={loading.stockData}
                error={error.stockData}
              />
            </TabPanel>
            
            <TabPanel value={tabValue} index={2}>
              <TechnicalAnalysisCard 
                technicalData={technical}
                loading={loading.technical}
                error={error.technical}
              />
            </TabPanel>
            
            <TabPanel value={tabValue} index={3}>
              <StockNewsCard 
                news={news}
                symbol={symbol}
                loading={loading.news}
                error={error.news}
              />
            </TabPanel>
          </Paper>
          
          {/* Disclaimer */}
          <Paper elevation={1} sx={{ p: 2, mb: 3, bgcolor: 'warning.lighter' }}>
            <Box display="flex" alignItems="flex-start">
              <Warning color="warning" sx={{ mr: 1, mt: 0.5 }} />
              <Typography variant="body2" color="text.secondary">
                <strong>Disclaimer:</strong> The information provided is for informational purposes only and should not be considered as investment advice. 
                Stock market investments are subject to market risks. Past performance is not indicative of future results. 
                Always consult with a qualified financial advisor before making any investment decisions.
              </Typography>
            </Box>
          </Paper>
        </>
      )}
    </Container>
  );
};

export default StockDetailsPage; 