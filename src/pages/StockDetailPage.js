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
  CardHeader,
  Avatar,
  TableContainer,
  Table,
  TableBody,
  TableCell,
  TableRow
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
  OpenInNew
} from '@mui/icons-material';
import { FiberManualRecord } from '@mui/icons-material';

// Import components
import StockPredictionChart from '../components/StockPredictionChart';
import FundamentalAnalysisCard from '../components/FundamentalAnalysisCard';
import CompanyInfoCard from '../components/CompanyInfoCard';
import StockNewsCard from '../components/StockNewsCard';

// Import actions from Redux
import { 
  fetchStockData, 
  fetchStockPrediction, 
  fetchFundamentalData,
  fetchStockNews,
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

// FundamentalsCard Component
const FundamentalsCard = ({ fundamentals, loading, error, symbol }) => {
  // ... existing code ...
  
  return (
    <Card sx={{ height: '100%', overflow: 'auto' }}>
      <CardHeader 
        title="Fundamental Analysis" 
        subheader={`Key metrics for ${symbol}`}
        avatar={
          <Box
            component="img"
            src="/fundamentals.png"
            alt="Fundamentals"
            sx={{ height: 32, width: 32 }}
          />
        }
      />
      {/* ... rest of component ... */}
    </Card>
  );
};

// PredictionCard Component
const PredictionCard = ({ prediction, loading, error, symbol }) => {
  // ... existing code ...
  
  return (
    <Card>
      <CardHeader 
        title="AI Price Prediction" 
        subheader={`30-day forecast for ${symbol}`}
        avatar={
          <Box
            component="img"
            src="/stock-prediction.png"
            alt="Stock Prediction"
            sx={{ height: 32, width: 32 }}
          />
        }
      />
      {/* ... rest of component ... */}
    </Card>
  );
};

const StockDetailPage = () => {
  const { symbol } = useParams();
  const dispatch = useDispatch();
  const [tabValue, setTabValue] = useState(0);
  
  // Get data from Redux store
  const { 
    currentStock,
    prediction,
    fundamentals,
    news,
    watchlist,
    loading,
    error
  } = useSelector((state) => state.stock);

  // Check if stock is in watchlist
  const isInWatchlist = watchlist.some(item => item.symbol === symbol);

  // Fetch data on component mount
  useEffect(() => {
    if (symbol) {
      dispatch(fetchStockData(symbol));
      dispatch(fetchStockPrediction(symbol));
      dispatch(fetchFundamentalData(symbol));
      dispatch(fetchStockNews(symbol));
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
          {/* Stock header section */}
          <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={7}>
                <Box display="flex" alignItems="center">
                  <Avatar 
                    sx={{ 
                      bgcolor: 'primary.main', 
                      width: 56, 
                      height: 56,
                      mr: 2 
                    }}
                  >
                    {symbol[0]}
                  </Avatar>
                  <Box>
                    <Box display="flex" alignItems="center">
                      <Typography variant="h4" component="h1">
                        {currentStock.name} ({symbol})
                      </Typography>
                      <Chip 
                        label={currentStock.exchange} 
                        sx={{ ml: 2 }}
                        color="primary"
                        size="small"
                      />
                    </Box>
                    <Typography variant="subtitle1" color="text.secondary">
                      {currentStock.sector} • {currentStock.industry}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
              
              <Grid item xs={12} md={5}>
                <Box display="flex" justifyContent="flex-end" alignItems="center">
                  <Box mr={3} textAlign="right">
                    <Typography variant="h4" component="p">
                      ₹{currentStock.currentPrice?.toLocaleString('en-IN')}
                    </Typography>
                    <Box display="flex" alignItems="center" justifyContent="flex-end">
                      {currentStock.change > 0 ? (
                        <TrendingUp sx={{ color: 'success.main', mr: 0.5 }} />
                      ) : (
                        <TrendingDown sx={{ color: 'error.main', mr: 0.5 }} />
                      )}
                      <Typography 
                        variant="subtitle1" 
                        component="span"
                        color={currentStock.change > 0 ? 'success.main' : 'error.main'}
                      >
                        {currentStock.change.toFixed(2)} ({currentStock.changePercent.toFixed(2)}%)
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Button
                    variant="outlined"
                    startIcon={isInWatchlist ? <Favorite /> : <FavoriteBorder />}
                    onClick={toggleWatchlist}
                    color={isInWatchlist ? "error" : "primary"}
                  >
                    {isInWatchlist ? "Remove from Watchlist" : "Add to Watchlist"}
                  </Button>
                </Box>
              </Grid>
            </Grid>
            
            <Divider sx={{ my: 2 }} />
            
            <Grid container spacing={2}>
              <Grid item xs={6} sm={3}>
                <Typography variant="body2" color="text.secondary">Open</Typography>
                <Typography variant="body1" fontWeight="medium">₹{currentStock.open?.toLocaleString('en-IN')}</Typography>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Typography variant="body2" color="text.secondary">Previous Close</Typography>
                <Typography variant="body1" fontWeight="medium">₹{currentStock.previousClose?.toLocaleString('en-IN')}</Typography>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Typography variant="body2" color="text.secondary">Day's Range</Typography>
                <Typography variant="body1" fontWeight="medium">₹{currentStock.dayLow?.toLocaleString('en-IN')} - ₹{currentStock.dayHigh?.toLocaleString('en-IN')}</Typography>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Typography variant="body2" color="text.secondary">52 Week Range</Typography>
                <Typography variant="body1" fontWeight="medium">₹{currentStock.yearLow?.toLocaleString('en-IN')} - ₹{currentStock.yearHigh?.toLocaleString('en-IN')}</Typography>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Typography variant="body2" color="text.secondary">Volume</Typography>
                <Typography variant="body1" fontWeight="medium">{currentStock.volume?.toLocaleString('en-IN')}</Typography>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Typography variant="body2" color="text.secondary">Avg. Volume</Typography>
                <Typography variant="body1" fontWeight="medium">{currentStock.avgVolume?.toLocaleString('en-IN')}</Typography>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Typography variant="body2" color="text.secondary">Market Cap</Typography>
                <Typography variant="body1" fontWeight="medium">{formatIndianLakhs(currentStock.marketCap)}</Typography>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Typography variant="body2" color="text.secondary">P/E Ratio</Typography>
                <Typography variant="body1" fontWeight="medium">{currentStock.pe?.toFixed(2)}</Typography>
              </Grid>
            </Grid>
          </Paper>
          
          {/* Clear Buy/Sell/Hold Recommendation Banner */}
          {currentStock.recommendation && (
            <Paper 
              elevation={3} 
              sx={{ 
                p: 3, 
                mb: 4, 
                bgcolor: 
                  currentStock.recommendation.rating === 'Buy' ? 'success.light' : 
                  currentStock.recommendation.rating === 'Sell' ? 'error.light' : 'warning.light'
              }}
            >
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} md={8}>
                  <Box display="flex" alignItems="center">
                    <Assessment sx={{ fontSize: 40, mr: 2 }} />
                    <Box>
                      <Typography variant="h5" fontWeight="bold">
                        {currentStock.recommendation.rating} {currentStock.name}
                      </Typography>
                      <Typography variant="subtitle1">
                        Our AI model recommends to {currentStock.recommendation.rating.toUpperCase()} with {currentStock.recommendation.strength}% confidence
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Box position="relative" display="flex" justifyContent="center" alignItems="center">
                    <CircularProgress 
                      variant="determinate" 
                      value={currentStock.recommendation.strength} 
                      size={80}
                      thickness={5}
                      color={
                        currentStock.recommendation.rating === 'Buy' ? 'success' : 
                        currentStock.recommendation.rating === 'Sell' ? 'error' : 'warning'
                      }
                      sx={{ mr: 2 }}
                    />
                    <Box
                      sx={{
                        top: 0,
                        left: 0,
                        bottom: 0,
                        right: 0,
                        position: 'absolute',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Typography variant="h6" component="div" fontWeight="bold">
                        {currentStock.recommendation.strength}%
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
              
              <Divider sx={{ my: 2 }} />
              
              <Typography variant="subtitle1" fontWeight="bold" mb={1}>Key Factors:</Typography>
              <Grid container spacing={2}>
                {currentStock.recommendation.reasons.map((reason, index) => (
                  <Grid item xs={12} sm={4} key={index}>
                    <Paper 
                      elevation={1} 
                      sx={{ 
                        p: 1.5, 
                        display: 'flex', 
                        alignItems: 'center',
                        bgcolor: 'rgba(255, 255, 255, 0.7)'
                      }}
                    >
                      <FiberManualRecord sx={{ fontSize: 8, mr: 1 }} />
                      <Typography variant="body2">{reason}</Typography>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </Paper>
          )}
          
          {/* Tabs for different sections */}
          <Paper elevation={3}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              variant="fullWidth"
              sx={{ borderBottom: 1, borderColor: 'divider' }}
            >
              <Tab label="Charts & Prediction" icon={<Timeline />} iconPosition="start" />
              <Tab label="Fundamental Analysis" icon={<Assessment />} iconPosition="start" />
              <Tab label="Company Info" icon={<BusinessCenter />} iconPosition="start" />
              <Tab label="News & Events" icon={<Description />} iconPosition="start" />
            </Tabs>
            
            {/* Chart & Prediction Tab */}
            <TabPanel value={tabValue} index={0}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Paper elevation={2} sx={{ p: 2, mb: 2 }}>
                    <Typography variant="h6" gutterBottom>
                      AI Price Prediction
                    </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      Our advanced AI model analyzes historical data, market trends, and fundamental metrics to predict future stock movements.
                    </Typography>
                    
                    {loading.prediction ? (
                      <Box display="flex" justifyContent="center" p={4}>
                        <CircularProgress />
                      </Box>
                    ) : error.prediction ? (
                      <Alert severity="error" sx={{ mt: 2 }}>
                        Error loading prediction data: {error.prediction}
                      </Alert>
                    ) : prediction ? (
                      <Box>
                        <StockPredictionChart
                          historicalData={prediction.historical}
                          predictedData={prediction.forecast}
                          symbol={symbol}
                        />
                        
                        <Box mt={3}>
                          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                            Price Forecast
                          </Typography>
                          <Grid container spacing={2}>
                            <Grid item xs={12} sm={4}>
                              <Paper 
                                variant="outlined" 
                                sx={{ 
                                  p: 2, 
                                  textAlign: 'center',
                                  bgcolor: 'primary.lighter'
                                }}
                              >
                                <Typography variant="body2" color="text.secondary">
                                  7-Day Forecast
                                </Typography>
                                <Typography variant="h6" fontWeight="bold">
                                  ₹{prediction.priceTargets.oneWeek.toLocaleString('en-IN')}
                                </Typography>
                                <Box display="flex" alignItems="center" justifyContent="center">
                                  {prediction.priceTargets.oneWeek > currentStock.currentPrice ? (
                                    <TrendingUp fontSize="small" color="success" sx={{ mr: 0.5 }} />
                                  ) : (
                                    <TrendingDown fontSize="small" color="error" sx={{ mr: 0.5 }} />
                                  )}
                                  <Typography 
                                    variant="body2" 
                                    color={prediction.priceTargets.oneWeek > currentStock.currentPrice ? 'success.main' : 'error.main'}
                                  >
                                    {(((prediction.priceTargets.oneWeek - currentStock.currentPrice) / currentStock.currentPrice) * 100).toFixed(2)}%
                                  </Typography>
                                </Box>
                              </Paper>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                              <Paper 
                                variant="outlined" 
                                sx={{ 
                                  p: 2, 
                                  textAlign: 'center',
                                  bgcolor: 'primary.lighter'
                                }}
                              >
                                <Typography variant="body2" color="text.secondary">
                                  15-Day Forecast
                                </Typography>
                                <Typography variant="h6" fontWeight="bold">
                                  ₹{prediction.priceTargets.twoWeeks.toLocaleString('en-IN')}
                                </Typography>
                                <Box display="flex" alignItems="center" justifyContent="center">
                                  {prediction.priceTargets.twoWeeks > currentStock.currentPrice ? (
                                    <TrendingUp fontSize="small" color="success" sx={{ mr: 0.5 }} />
                                  ) : (
                                    <TrendingDown fontSize="small" color="error" sx={{ mr: 0.5 }} />
                                  )}
                                  <Typography 
                                    variant="body2" 
                                    color={prediction.priceTargets.twoWeeks > currentStock.currentPrice ? 'success.main' : 'error.main'}
                                  >
                                    {(((prediction.priceTargets.twoWeeks - currentStock.currentPrice) / currentStock.currentPrice) * 100).toFixed(2)}%
                                  </Typography>
                                </Box>
                              </Paper>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                              <Paper 
                                variant="outlined" 
                                sx={{ 
                                  p: 2, 
                                  textAlign: 'center',
                                  bgcolor: 'primary.lighter'
                                }}
                              >
                                <Typography variant="body2" color="text.secondary">
                                  30-Day Forecast
                                </Typography>
                                <Typography variant="h6" fontWeight="bold">
                                  ₹{prediction.priceTargets.oneMonth.toLocaleString('en-IN')}
                                </Typography>
                                <Box display="flex" alignItems="center" justifyContent="center">
                                  {prediction.priceTargets.oneMonth > currentStock.currentPrice ? (
                                    <TrendingUp fontSize="small" color="success" sx={{ mr: 0.5 }} />
                                  ) : (
                                    <TrendingDown fontSize="small" color="error" sx={{ mr: 0.5 }} />
                                  )}
                                  <Typography 
                                    variant="body2" 
                                    color={prediction.priceTargets.oneMonth > currentStock.currentPrice ? 'success.main' : 'error.main'}
                                  >
                                    {(((prediction.priceTargets.oneMonth - currentStock.currentPrice) / currentStock.currentPrice) * 100).toFixed(2)}%
                                  </Typography>
                                </Box>
                              </Paper>
                            </Grid>
                          </Grid>
                        </Box>
                      </Box>
                    ) : (
                      <Alert severity="info" sx={{ mt: 2 }}>
                        No prediction data available for this stock.
                      </Alert>
                    )}
                  </Paper>
                </Grid>
              </Grid>
            </TabPanel>
            
            {/* Fundamental Analysis Tab */}
            <TabPanel value={tabValue} index={1}>
              {loading.fundamentals ? (
                <Box display="flex" justifyContent="center" p={4}>
                  <CircularProgress />
                </Box>
              ) : error.fundamentals ? (
                <Alert severity="error" sx={{ mt: 2 }}>
                  Error loading fundamental data: {error.fundamentals}
                </Alert>
              ) : fundamentals ? (
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Paper elevation={2} sx={{ p: 2 }}>
                      <Typography variant="h6" gutterBottom>
                        Financial Overview
                      </Typography>
                      <TableContainer>
                        <Table size="small">
                          <TableBody>
                            {[
                              { label: 'Revenue (TTM)', value: `₹${formatIndianLakhs(fundamentals.financials.revenue)}` },
                              { label: 'Net Income (TTM)', value: `₹${formatIndianLakhs(fundamentals.financials.netIncome)}` },
                              { label: 'EPS (TTM)', value: `₹${fundamentals.financials.eps.toFixed(2)}` },
                              { label: 'EBITDA', value: `₹${formatIndianLakhs(fundamentals.financials.ebitda)}` },
                              { label: 'Gross Margin', value: `${fundamentals.profitability.grossMargin.toFixed(2)}%` },
                              { label: 'Net Margin', value: `${fundamentals.profitability.netMargin.toFixed(2)}%` },
                              { label: 'ROE', value: `${fundamentals.profitability.roe.toFixed(2)}%` },
                              { label: 'ROA', value: `${fundamentals.profitability.roa.toFixed(2)}%` }
                            ].map((item, index) => (
                              <TableRow key={index}>
                                <TableCell sx={{ fontWeight: 'medium' }}>{item.label}</TableCell>
                                <TableCell align="right">{item.value}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </Paper>
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <Paper elevation={2} sx={{ p: 2 }}>
                      <Typography variant="h6" gutterBottom>
                        Growth & Valuations
                      </Typography>
                      <TableContainer>
                        <Table size="small">
                          <TableBody>
                            {[
                              { 
                                label: 'Revenue Growth (YoY)', 
                                value: `${fundamentals.growth.revenueGrowth.toFixed(2)}%`,
                                positive: fundamentals.growth.revenueGrowth > 0
                              },
                              { 
                                label: 'Earnings Growth (YoY)', 
                                value: `${fundamentals.growth.earningsGrowth.toFixed(2)}%`,
                                positive: fundamentals.growth.earningsGrowth > 0
                              },
                              { label: 'P/E Ratio', value: `${fundamentals.valuations.peRatio.toFixed(2)}` },
                              { label: 'P/B Ratio', value: `${fundamentals.valuations.pbRatio.toFixed(2)}` },
                              { label: 'P/S Ratio', value: `${fundamentals.valuations.psRatio.toFixed(2)}` },
                              { label: 'EV/EBITDA', value: `${fundamentals.valuations.evToEbitda.toFixed(2)}` },
                              { 
                                label: 'PEG Ratio', 
                                value: `${fundamentals.valuations.pegRatio.toFixed(2)}`,
                                note: fundamentals.valuations.pegRatio < 1 ? '(Potentially Undervalued)' : ''
                              }
                            ].map((item, index) => (
                              <TableRow key={index}>
                                <TableCell sx={{ fontWeight: 'medium' }}>{item.label}</TableCell>
                                <TableCell align="right">
                                  <Box display="flex" alignItems="center" justifyContent="flex-end">
                                    {item.hasOwnProperty('positive') && (
                                      item.positive ? (
                                        <TrendingUp fontSize="small" color="success" sx={{ mr: 0.5 }} />
                                      ) : (
                                        <TrendingDown fontSize="small" color="error" sx={{ mr: 0.5 }} />
                                      )
                                    )}
                                    <Typography 
                                      variant="body2" 
                                      component="span"
                                      color={item.hasOwnProperty('positive') ? (item.positive ? 'success.main' : 'error.main') : 'text.primary'}
                                    >
                                      {item.value}
                                    </Typography>
                                    {item.note && (
                                      <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                                        {item.note}
                                      </Typography>
                                    )}
                                  </Box>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </Paper>
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <Paper elevation={2} sx={{ p: 2 }}>
                      <Typography variant="h6" gutterBottom>
                        Financial Health
                      </Typography>
                      <TableContainer>
                        <Table size="small">
                          <TableBody>
                            {[
                              { label: 'Current Ratio', value: fundamentals.financialHealth.currentRatio.toFixed(2) },
                              { label: 'Debt to Equity', value: fundamentals.financialHealth.debtToEquity.toFixed(2) },
                              { label: 'Interest Coverage', value: fundamentals.financialHealth.interestCoverage.toFixed(2) },
                              { label: 'Quick Ratio', value: fundamentals.financialHealth.quickRatio.toFixed(2) },
                              { label: 'Total Debt', value: `₹${formatIndianLakhs(fundamentals.financialHealth.totalDebt)}` },
                              { label: 'Cash & Equivalents', value: `₹${formatIndianLakhs(fundamentals.financialHealth.cashAndEquivalents)}` }
                            ].map((item, index) => (
                              <TableRow key={index}>
                                <TableCell sx={{ fontWeight: 'medium' }}>{item.label}</TableCell>
                                <TableCell align="right">{item.value}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </Paper>
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <Paper elevation={2} sx={{ p: 2 }}>
                      <Typography variant="h6" gutterBottom>
                        Dividend Information
                      </Typography>
                      <TableContainer>
                        <Table size="small">
                          <TableBody>
                            {[
                              { label: 'Dividend Yield', value: `${fundamentals.dividends.dividendYield.toFixed(2)}%` },
                              { label: 'Dividend Payout Ratio', value: `${fundamentals.dividends.payoutRatio.toFixed(2)}%` },
                              { label: 'Dividend Per Share', value: `₹${fundamentals.dividends.dividendPerShare.toFixed(2)}` },
                              { label: 'Dividend Growth (5Y)', value: `${fundamentals.dividends.dividendGrowth.toFixed(2)}%` }
                            ].map((item, index) => (
                              <TableRow key={index}>
                                <TableCell sx={{ fontWeight: 'medium' }}>{item.label}</TableCell>
                                <TableCell align="right">{item.value}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                      
                      <Box mt={2}>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                          Risk Factors
                        </Typography>
                        <Box display="flex" flexWrap="wrap" gap={1}>
                          {fundamentals.risks.map((risk, index) => (
                            <Chip 
                              key={index} 
                              label={risk} 
                              size="small" 
                              color="default"
                              variant="outlined"
                              icon={<Warning fontSize="small" />}
                            />
                          ))}
                        </Box>
                      </Box>
                    </Paper>
                  </Grid>
                </Grid>
              ) : (
                <Alert severity="info" sx={{ mt: 2 }}>
                  No fundamental data available for this stock.
                </Alert>
              )}
            </TabPanel>
            
            {/* Company Info Tab */}
            <TabPanel value={tabValue} index={2}>
              <Paper elevation={2} sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  About {currentStock.name}
                </Typography>
                <Typography variant="body1" paragraph>
                  {currentStock.description || `${currentStock.name} is a leading company in the ${currentStock.sector} sector, listed on the ${currentStock.exchange} exchange.`}
                </Typography>
                
                <Divider sx={{ my: 2 }} />
                
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                      Company Details
                    </Typography>
                    <TableContainer>
                      <Table size="small">
                        <TableBody>
                          {[
                            { label: 'Exchange', value: currentStock.exchange },
                            { label: 'Sector', value: currentStock.sector },
                            { label: 'Industry', value: currentStock.industry },
                            { label: 'Market Cap', value: formatIndianLakhs(currentStock.marketCap) },
                            { label: 'Beta', value: currentStock.beta?.toFixed(2) }
                          ].map((item, index) => (
                            <TableRow key={index}>
                              <TableCell sx={{ fontWeight: 'medium', width: '40%' }}>{item.label}</TableCell>
                              <TableCell>{item.value}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                      Key Statistics
                    </Typography>
                    <TableContainer>
                      <Table size="small">
                        <TableBody>
                          {[
                            { label: 'P/E Ratio', value: currentStock.pe?.toFixed(2) },
                            { label: 'EPS', value: `₹${currentStock.eps?.toFixed(2)}` },
                            { label: 'Dividend Yield', value: `${currentStock.dividend_yield?.toFixed(2)}%` },
                            { label: '52 Week High', value: `₹${currentStock.yearHigh?.toLocaleString('en-IN')}` },
                            { label: '52 Week Low', value: `₹${currentStock.yearLow?.toLocaleString('en-IN')}` }
                          ].map((item, index) => (
                            <TableRow key={index}>
                              <TableCell sx={{ fontWeight: 'medium', width: '40%' }}>{item.label}</TableCell>
                              <TableCell>{item.value}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Grid>
                </Grid>
              </Paper>
            </TabPanel>
            
            {/* News Tab */}
            <TabPanel value={tabValue} index={3}>
              {loading.news ? (
                <Box display="flex" justifyContent="center" p={4}>
                  <CircularProgress />
                </Box>
              ) : error.news ? (
                <Alert severity="error" sx={{ mt: 2 }}>
                  Error loading news data: {error.news}
                </Alert>
              ) : news && news.length > 0 ? (
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Latest News for {currentStock.name}
                  </Typography>
                  
                  {news.map((item, index) => (
                    <Paper 
                      key={index} 
                      elevation={1} 
                      sx={{ 
                        p: 2, 
                        mb: 2,
                        borderLeft: '4px solid',
                        borderColor: 
                          item.sentiment === 'positive' ? 'success.main' : 
                          item.sentiment === 'negative' ? 'error.main' : 
                          'grey.400'
                      }}
                    >
                      <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                        <Box>
                          <Typography variant="subtitle1" fontWeight="bold">
                            {item.title}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" paragraph>
                            {item.description}
                          </Typography>
                        </Box>
                        <Chip 
                          label={item.sentiment} 
                          size="small"
                          color={
                            item.sentiment === 'positive' ? 'success' : 
                            item.sentiment === 'negative' ? 'error' : 
                            'default'
                          }
                          sx={{ ml: 1 }}
                        />
                      </Box>
                      <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Typography variant="caption" color="text.secondary">
                          Source: {item.source} | {new Date(item.date).toLocaleDateString()}
                        </Typography>
                        <Button 
                          variant="text" 
                          size="small" 
                          endIcon={<OpenInNew fontSize="small" />}
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Read more
                        </Button>
                      </Box>
                    </Paper>
                  ))}
                </Box>
              ) : (
                <Alert severity="info" sx={{ mt: 2 }}>
                  No news available for this stock.
                </Alert>
              )}
            </TabPanel>
          </Paper>
        </>
      )}
    </Container>
  );
};

export default StockDetailPage; 