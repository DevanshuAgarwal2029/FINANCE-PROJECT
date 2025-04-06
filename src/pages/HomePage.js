import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Typography,
  Box,
  Paper,
  Button,
  Card,
  CardContent,
  CardMedia,
  Divider,
  TextField,
  InputAdornment,
  IconButton,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Avatar,
  Skeleton
} from '@mui/material';
import {
  Search,
  TrendingUp,
  TrendingDown,
  Timeline,
  Assessment,
  ShowChart,
  Analytics,
  Insights,
  BusinessCenter,
  ArrowForward,
  Notifications
} from '@mui/icons-material';

// Import actions from Redux
import { 
  fetchRecommendedStocks, 
  fetchMarketIndices,
  searchStocks,
  setSearchQuery
} from '../redux/stockSlice';

// Hero Section Component
const HeroSection = ({ onSearch }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { searchQuery } = useSelector((state) => state.stock);
  
  const [searchValue, setSearchValue] = useState('');
  
  const handleSearchChange = (event) => {
    setSearchValue(event.target.value);
  };
  
  const handleSearchSubmit = (event) => {
    event.preventDefault();
    if (searchValue.trim()) {
      dispatch(searchStocks(searchValue.trim()));
      navigate(`/search?q=${encodeURIComponent(searchValue.trim())}`);
    }
  };
  
  return (
    <Box 
      sx={{ 
        position: 'relative',
        height: { xs: 500, md: 400 },
        mb: 6,
        backgroundImage: 'url(/hero-background.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: 'white',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
        }
      }}
    >
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1, height: '100%', display: 'flex', alignItems: 'center' }}>
        <Grid container alignItems="center">
          <Grid item xs={12}>
            <Typography
              component="h1"
              variant="h2"
              color="inherit"
              gutterBottom
              fontWeight="bold"
            >
              Predict India's Stock Market
            </Typography>
            <Typography variant="h5" color="inherit" paragraph fontWeight="light">
              Advanced AI-powered stock predictions for NSE & BSE.
              Make smarter investment decisions with accurate forecasts and fundamental analysis.
            </Typography>
            
            <Box component="form" onSubmit={handleSearchSubmit} mt={4} sx={{ maxWidth: { xs: '100%', md: '70%' } }}>
              <TextField
                fullWidth
                placeholder="Search for stocks (e.g., RELIANCE, TCS, INFY)"
                variant="outlined"
                value={searchValue}
                onChange={handleSearchChange}
                sx={{
                  backgroundColor: 'white',
                  borderRadius: 1,
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': { borderColor: 'transparent' },
                    '&:hover fieldset': { borderColor: 'transparent' },
                    '&.Mui-focused fieldset': { borderColor: 'transparent' }
                  }
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton 
                        edge="end" 
                        color="primary" 
                        type="submit"
                        aria-label="search"
                      >
                        <Search />
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
            </Box>
            
            <Box mt={2} display="flex" flexWrap="wrap" gap={1}>
              <Typography variant="body2" color="inherit">
                Popular searches:
              </Typography>
              {['RELIANCE', 'HDFCBANK', 'TCS', 'INFY', 'TATAMOTORS'].map((stock) => (
                <Chip
                  key={stock}
                  label={stock}
                  variant="outlined"
                  size="small"
                  component={Link}
                  to={`/stock/NSE/${stock}`}
                  sx={{ 
                    color: 'white', 
                    borderColor: 'rgba(255,255,255,0.5)',
                    '&:hover': { 
                      backgroundColor: 'rgba(255,255,255,0.2)',
                      borderColor: 'white'
                    }
                  }}
                  clickable
                />
              ))}
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

// Feature Card Component
const FeatureCard = ({ icon, title, description, link }) => {
  return (
    <Card 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: '0 12px 20px rgba(0, 0, 0, 0.1)'
        }
      }}
    >
      <Box sx={{ p: 2, display: 'flex', justifyContent: 'center' }}>
        <Box 
          sx={{ 
            backgroundColor: 'primary.light', 
            borderRadius: '50%', 
            p: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 1
          }}
        >
          {icon}
        </Box>
      </Box>
      <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
        <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
          {title}
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph sx={{ mb: 3 }}>
          {description}
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          component={Link} 
          to={link}
          sx={{ 
            borderRadius: '25px', 
            px: 3,
            '&:hover': { 
              backgroundColor: 'primary.dark' 
            } 
          }}
        >
          Learn More
        </Button>
      </CardContent>
    </Card>
  );
};

// Features Section Component
const FeaturesSection = () => {
  return (
    <Box sx={{ py: 8, backgroundColor: '#f9f9f9' }}>
      <Container>
        <Typography variant="h3" component="h2" align="center" gutterBottom sx={{ mb: 6, fontWeight: 'bold' }}>
          Powerful Stock Market Tools
        </Typography>
        <Grid container spacing={4} alignItems="stretch">
          <Grid item xs={12} sm={6} md={3}>
            <FeatureCard
              icon={<ShowChart fontSize="large" sx={{ color: 'primary.main' }} />}
              title="AI Predictions"
              description="Get AI-powered predictions for stock price movements based on historical data and market trends."
              link="/prediction"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FeatureCard
              icon={<Assessment fontSize="large" sx={{ color: 'primary.main' }} />}
              title="Fundamental Analysis"
              description="Evaluate stocks based on financial health, growth potential, and valuation metrics."
              link="/stock-screener"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FeatureCard
              icon={<Timeline fontSize="large" sx={{ color: 'primary.main' }} />}
              title="Technical Indicators"
              description="Track moving averages, RSI, MACD and other technical indicators to inform your trading decisions."
              link="/market"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FeatureCard
              icon={<BusinessCenter fontSize="large" sx={{ color: 'primary.main' }} />}
              title="Portfolio Tracking"
              description="Monitor your investment portfolio performance with real-time updates and detailed analytics."
              link="/portfolio"
            />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

// Recommended Stocks Component
const RecommendedStockItem = ({ stock }) => {
  const navigate = useNavigate();
  
  const handleClick = () => {
    navigate(`/stock/${stock.symbol}`);
  };
  
  return (
    <Paper 
      sx={{ 
        p: 2, 
        mb: 2, 
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-3px)',
          boxShadow: 3
        }
      }}
      onClick={handleClick}
    >
      <Grid container alignItems="center" spacing={2}>
        <Grid item>
          {stock.logo ? (
            <Avatar
              src={stock.logo}
              alt={stock.name}
              sx={{ width: 40, height: 40 }}
            />
          ) : (
            <Avatar sx={{ width: 40, height: 40, bgcolor: 'primary.main' }}>
              {stock.symbol.charAt(0)}
            </Avatar>
          )}
        </Grid>
        <Grid item xs>
          <Typography variant="subtitle1" component="div">
            {stock.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {stock.symbol} • {stock.sector || 'N/A'}
          </Typography>
        </Grid>
        <Grid item>
          <Typography variant="h6" component="div" align="right">
            ₹{(stock.currentPrice || stock.price || 0).toLocaleString('en-IN')}
          </Typography>
          <Box display="flex" alignItems="center" justifyContent="flex-end">
            {(stock.change || 0) > 0 ? (
              <TrendingUp fontSize="small" color="success" sx={{ mr: 0.5 }} />
            ) : (
              <TrendingDown fontSize="small" color="error" sx={{ mr: 0.5 }} />
            )}
            <Typography
              variant="body2"
              color={(stock.change || 0) > 0 ? 'success.main' : 'error.main'}
            >
              {(stock.change || 0) > 0 ? '+' : ''}{(stock.change || 0).toFixed(2)} ({(stock.change || 0) > 0 ? '+' : ''}{(stock.changePercent || 0).toFixed(2)}%)
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Box display="flex" mt={1} justifyContent="space-between" alignItems="center">
            <Box>
              {stock.recommendationRating && (
                <Chip
                  label={stock.recommendationRating}
                  size="small"
                  color={
                    stock.recommendationRating.includes('Buy') ? 'success' :
                    stock.recommendationRating.includes('Sell') ? 'error' :
                    'warning'
                  }
                  sx={{ mr: 1 }}
                />
              )}
              {stock.predictionTrend && (
                <Chip
                  icon={stock.predictionTrend === 'up' ? <TrendingUp /> : <TrendingDown />}
                  label={`${(stock.predictionChange || 0) > 0 ? '+' : ''}${(stock.predictionChange || 0).toFixed(2)}% predicted`}
                  size="small"
                  color={stock.predictionTrend === 'up' ? 'success' : 'error'}
                  variant="outlined"
                />
              )}
            </Box>
            <Typography variant="caption" color="text.secondary">
              {stock.recommendationReason || 'Based on AI analysis'}
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
};

// Recommended Stocks Section
const RecommendedStocks = ({ stocks, loading, error }) => {
  return (
    <Box my={6}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" component="h2">
          AI-Powered Stock Recommendations
        </Typography>
        <Button 
          variant="text" 
          color="primary"
          component={Link}
          to="/recommendations"
          endIcon={<ArrowForward />}
        >
          View All
        </Button>
      </Box>
      
      {loading ? (
        Array(4).fill().map((_, index) => (
          <Paper key={index} sx={{ p: 2, mb: 2 }}>
            <Grid container alignItems="center" spacing={2}>
              <Grid item>
                <Skeleton variant="circular" width={40} height={40} />
              </Grid>
              <Grid item xs>
                <Skeleton variant="text" height={24} width="70%" />
                <Skeleton variant="text" height={20} width="40%" />
              </Grid>
              <Grid item>
                <Skeleton variant="text" height={28} width={80} />
                <Skeleton variant="text" height={20} width={60} />
              </Grid>
              <Grid item xs={12}>
                <Box display="flex" mt={1}>
                  <Skeleton variant="rectangular" height={24} width={80} sx={{ mr: 1, borderRadius: 4 }} />
                  <Skeleton variant="rectangular" height={24} width={120} sx={{ borderRadius: 4 }} />
                </Box>
              </Grid>
            </Grid>
          </Paper>
        ))
      ) : error ? (
        <Paper sx={{ p: 3, textAlign: 'center', bgcolor: 'error.lighter' }}>
          <Typography color="error">
            Error loading recommendations: {error}
          </Typography>
        </Paper>
      ) : stocks && stocks.length > 0 ? (
        stocks.slice(0, 4).map((stock) => (
          <RecommendedStockItem key={stock.symbol} stock={stock} />
        ))
      ) : (
        <Paper sx={{ p: 3, textAlign: 'center', bgcolor: 'info.lighter' }}>
          <Typography>
            No stock recommendations available at the moment.
          </Typography>
        </Paper>
      )}
    </Box>
  );
};

// Updates and News Section
const NewsAndUpdates = () => {
  const updates = [
    {
      title: "New AI Model Improves Prediction Accuracy",
      date: "2023-08-15",
      description: "Our latest machine learning model has improved prediction accuracy by 15%."
    },
    {
      title: "Enhanced Fundamental Analysis Features",
      date: "2023-08-10",
      description: "Explore new metrics and ratios for better company evaluation."
    },
    {
      title: "Portfolio Management Tool Launch",
      date: "2023-08-01",
      description: "Track your investments and analyze performance with our new tools."
    }
  ];
  
  return (
    <Box my={6}>
      <Typography variant="h5" component="h2" gutterBottom>
        Latest Updates
      </Typography>
      
      <List>
        {updates.map((update, index) => (
          <React.Fragment key={index}>
            <ListItem alignItems="flex-start">
              <ListItemIcon>
                <Notifications color="primary" />
              </ListItemIcon>
              <ListItemText
                primary={update.title}
                secondary={
                  <>
                    <Typography
                      component="span"
                      variant="body2"
                      color="text.primary"
                      sx={{ display: 'block', mb: 0.5 }}
                    >
                      {new Date(update.date).toLocaleDateString('en-IN', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </Typography>
                    {update.description}
                  </>
                }
              />
            </ListItem>
            {index < updates.length - 1 && <Divider variant="inset" component="li" />}
          </React.Fragment>
        ))}
      </List>
    </Box>
  );
};

// Main Home Page Component
const HomePage = () => {
  const dispatch = useDispatch();
  const { recommendedStocks, indices, loading, error } = useSelector(state => state.stock);
  
  // Add safety fallbacks for potentially undefined values
  const safeRecommendedStocks = recommendedStocks || [];
  const safeIndices = indices || [];

  useEffect(() => {
    dispatch(fetchRecommendedStocks());
    dispatch(fetchMarketIndices());
  }, [dispatch]);

  return (
    <>
      {/* Hero Section with Search */}
      <HeroSection />
      
      {/* Features Section */}
      <FeaturesSection />
      
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Recommended Stocks */}
        <RecommendedStocks 
          stocks={safeRecommendedStocks} 
          loading={loading?.recommendations} 
          error={error?.recommendations}
        />
        
        {/* Latest Updates */}
        <NewsAndUpdates />
      </Container>
    </>
  );
};

export default HomePage; 