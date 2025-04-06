import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  Card,
  CardContent,
  Divider,
  Chip,
  CircularProgress,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Tooltip,
  LinearProgress,
  ListItemIcon
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  Search,
  Info,
  OpenInNew,
  Assessment,
  ShowChart,
  Timeline,
  Star,
  StarBorder,
  ArrowForward,
  FiberManualRecord
} from '@mui/icons-material';
import { searchStocks, fetchStockDetails, fetchStockFundamentals, addToWatchlist, removeFromWatchlist } from '../redux/stockSlice';

const SearchResultsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get query parameter from URL
  const query = new URLSearchParams(location.search).get('q');
  
  // Get search results from Redux store
  const { searchResults, loading, error, watchlist } = useSelector((state) => state.stock);
  
  // Local state for selected stock details
  const [selectedStock, setSelectedStock] = useState(null);
  const [stockDetails, setStockDetails] = useState(null);
  const [stockFundamentals, setStockFundamentals] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  
  // Fetch search results when query changes
  useEffect(() => {
    if (query) {
      dispatch(searchStocks(query));
    }
  }, [dispatch, query]);
  
  // Handle stock selection
  const handleSelectStock = async (stock) => {
    setSelectedStock(stock);
    setLoadingDetails(true);
    
    try {
      // Fetch stock details and fundamentals
      const detailsResult = await dispatch(fetchStockDetails(stock.symbol)).unwrap();
      const fundamentalsResult = await dispatch(fetchStockFundamentals(stock.symbol)).unwrap();
      
      setStockDetails(detailsResult);
      setStockFundamentals(fundamentalsResult);
    } catch (error) {
      console.error('Error fetching stock data:', error);
    } finally {
      setLoadingDetails(false);
    }
  };
  
  // Check if stock is in watchlist
  const isInWatchlist = (symbol) => {
    return watchlist.some(item => item.symbol === symbol);
  };
  
  // Handle watchlist toggle
  const handleWatchlistToggle = (stock) => {
    if (isInWatchlist(stock.symbol)) {
      dispatch(removeFromWatchlist({ symbol: stock.symbol, exchange: stock.exchange }));
    } else {
      dispatch(addToWatchlist(stock));
    }
  };
  
  // Navigate to stock details page
  const handleViewDetails = (stock) => {
    navigate(`/stock/${stock.exchange}/${stock.symbol}`);
  };
  
  // Format large numbers
  const formatNumber = (num) => {
    if (num >= 1000000000) {
      return (num / 1000000000).toFixed(2) + 'B';
    } else if (num >= 1000000) {
      return (num / 1000000).toFixed(2) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(2) + 'K';
    }
    return num;
  };
  
  // Render color based on value
  const getValueColor = (value) => {
    if (value > 0) return 'success.main';
    if (value < 0) return 'error.main';
    return 'text.primary';
  };
  
  // Render icon based on value
  const getValueIcon = (value) => {
    if (value > 0) return <TrendingUp fontSize="small" />;
    if (value < 0) return <TrendingDown fontSize="small" />;
    return null;
  };
  
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Search Results for "{query}"
      </Typography>
      
      {loading.search ? (
        <Box display="flex" justifyContent="center" my={8}>
          <CircularProgress />
        </Box>
      ) : error.search ? (
        <Paper sx={{ p: 3, bgcolor: 'error.lighter' }}>
          <Typography color="error">
            Error: {error.search}
          </Typography>
        </Paper>
      ) : searchResults.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" gutterBottom>
            No results found for "{query}"
          </Typography>
          <Typography color="text.secondary" paragraph>
            Try searching for a different company name or stock symbol.
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={4}>
          {/* Search Results List */}
          <Grid item xs={12} md={5}>
            <Paper sx={{ height: '100%' }}>
              <Box p={2} bgcolor="primary.main" color="white">
                <Typography variant="h6">
                  Found {searchResults.length} stocks
                </Typography>
              </Box>
              
              <List sx={{ maxHeight: 600, overflow: 'auto' }}>
                {searchResults.map((stock) => (
                  <React.Fragment key={stock.symbol}>
                    <ListItem 
                      button 
                      selected={selectedStock?.symbol === stock.symbol}
                      onClick={() => navigate(`/stock/${stock.exchange}/${stock.symbol}`)}
                      secondaryAction={
                        <IconButton 
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent navigation when clicking the star
                            handleWatchlistToggle(stock);
                          }}
                        >
                          {isInWatchlist(stock.symbol) ? 
                            <Star color="warning" /> : 
                            <StarBorder />
                          }
                        </IconButton>
                      }
                    >
                      <Avatar sx={{ mr: 2, bgcolor: 'primary.light' }}>
                        {stock.symbol.charAt(0)}
                      </Avatar>
                      <ListItemText 
                        primary={
                          <Box display="flex" alignItems="center">
                            <Typography variant="subtitle1" fontWeight="bold">
                              {stock.symbol}
                            </Typography>
                            <Chip 
                              label={stock.exchange} 
                              size="small" 
                              sx={{ ml: 1 }}
                              color="primary"
                              variant="outlined"
                            />
                          </Box>
                        }
                        secondary={
                          <>
                            <Typography variant="body2" display="block">
                              {stock.name}
                            </Typography>
                            {stock.sector && (
                              <Chip 
                                label={stock.sector} 
                                size="small" 
                                sx={{ mt: 0.5 }}
                                variant="outlined"
                              />
                            )}
                          </>
                        }
                      />
                    </ListItem>
                    <Divider component="li" />
                  </React.Fragment>
                ))}
              </List>
            </Paper>
          </Grid>
          
          {/* Stock Details */}
          {selectedStock && (
            <Grid item xs={12} md={7}>
              <Paper sx={{ height: '100%' }}>
                {loadingDetails ? (
                  <Box display="flex" justifyContent="center" alignItems="center" height="100%" minHeight="400px">
                    <CircularProgress />
                  </Box>
                ) : stockDetails ? (
                  <>
                    <Box p={2} bgcolor="primary.main" color="white" display="flex" justifyContent="space-between" alignItems="center">
                      <Typography variant="h6">
                        {stockDetails.name} ({stockDetails.symbol})
                      </Typography>
                      <IconButton onClick={() => handleWatchlistToggle(selectedStock)} size="small" sx={{ color: 'white' }}>
                        {isInWatchlist(selectedStock.symbol) ? 
                          <Star sx={{ color: 'warning.light' }} /> : 
                          <StarBorder />
                        }
                      </IconButton>
                    </Box>
                    
                    <Box p={3}>
                      {/* Stock Price and Change */}
                      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                        <Typography variant="h4" fontWeight="bold" component="p">
                          ₹{stockDetails.price?.toLocaleString('en-IN')}
                        </Typography>
                        <Box display="flex" alignItems="center" bgcolor={stockDetails.change > 0 ? 'success.lighter' : 'error.lighter'} px={1.5} py={0.5} borderRadius={1}>
                          {stockDetails.change > 0 ? (
                            <TrendingUp fontSize="small" color="success" sx={{ mr: 0.5 }} />
                          ) : (
                            <TrendingDown fontSize="small" color="error" sx={{ mr: 0.5 }} />
                          )}
                          <Typography 
                            variant="body2" 
                            component="span"
                            fontWeight="medium"
                            color={stockDetails.change > 0 ? 'success.dark' : 'error.dark'}
                          >
                            {stockDetails.change?.toFixed(2)} ({stockDetails.changePercent?.toFixed(2)}%)
                          </Typography>
                        </Box>
                      </Box>
                      
                      {/* Trading Metrics */}
                      <Typography variant="subtitle1" fontWeight="medium" mb={1}>
                        Trading Metrics
                      </Typography>
                      <TableContainer component={Paper} variant="outlined" sx={{ mb: 3 }}>
                        <Table size="small">
                          <TableBody>
                            <TableRow>
                              <TableCell sx={{ fontWeight: 'medium' }}>Open</TableCell>
                              <TableCell align="right">₹{stockDetails.open?.toLocaleString('en-IN')}</TableCell>
                              <TableCell sx={{ fontWeight: 'medium' }}>Previous Close</TableCell>
                              <TableCell align="right">₹{stockDetails.previousClose?.toLocaleString('en-IN')}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell sx={{ fontWeight: 'medium' }}>Day's Range</TableCell>
                              <TableCell align="right">₹{stockDetails.dayLow?.toLocaleString('en-IN')} - ₹{stockDetails.dayHigh?.toLocaleString('en-IN')}</TableCell>
                              <TableCell sx={{ fontWeight: 'medium' }}>52 Week Range</TableCell>
                              <TableCell align="right">₹{stockDetails.yearLow?.toLocaleString('en-IN')} - ₹{stockDetails.yearHigh?.toLocaleString('en-IN')}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell sx={{ fontWeight: 'medium' }}>Volume</TableCell>
                              <TableCell align="right">{stockDetails.volume?.toLocaleString('en-IN')}</TableCell>
                              <TableCell sx={{ fontWeight: 'medium' }}>Avg. Volume</TableCell>
                              <TableCell align="right">{stockDetails.avgVolume?.toLocaleString('en-IN')}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell sx={{ fontWeight: 'medium' }}>Market Cap</TableCell>
                              <TableCell align="right">{formatNumber(stockDetails.marketCap)}</TableCell>
                              <TableCell sx={{ fontWeight: 'medium' }}>P/E Ratio</TableCell>
                              <TableCell align="right">{stockDetails.pe?.toFixed(2)}</TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </TableContainer>
                      
                      {/* Fundamental Data */}
                      {stockFundamentals && (
                        <>
                          <Typography variant="subtitle1" fontWeight="medium" mb={1}>
                            Fundamental Data
                          </Typography>
                          <Grid container spacing={2} mb={3}>
                            <Grid item xs={6} md={3}>
                              <Paper variant="outlined" sx={{ p: 1.5, textAlign: 'center', height: '100%' }}>
                                <Typography variant="caption" color="text.secondary" display="block">
                                  EPS (TTM)
                                </Typography>
                                <Typography variant="h6" fontWeight="medium">
                                  ₹{stockFundamentals.eps?.toFixed(2)}
                                </Typography>
                              </Paper>
                            </Grid>
                            <Grid item xs={6} md={3}>
                              <Paper variant="outlined" sx={{ p: 1.5, textAlign: 'center', height: '100%' }}>
                                <Typography variant="caption" color="text.secondary" display="block">
                                  Dividend Yield
                                </Typography>
                                <Typography variant="h6" fontWeight="medium">
                                  {stockFundamentals.dividendYield?.toFixed(2)}%
                                </Typography>
                              </Paper>
                            </Grid>
                            <Grid item xs={6} md={3}>
                              <Paper variant="outlined" sx={{ p: 1.5, textAlign: 'center', height: '100%' }}>
                                <Typography variant="caption" color="text.secondary" display="block">
                                  52W Return
                                </Typography>
                                <Typography variant="h6" fontWeight="medium" color={stockFundamentals.yearReturn > 0 ? 'success.main' : 'error.main'}>
                                  {stockFundamentals.yearReturn?.toFixed(2)}%
                                </Typography>
                              </Paper>
                            </Grid>
                            <Grid item xs={6} md={3}>
                              <Paper variant="outlined" sx={{ p: 1.5, textAlign: 'center', height: '100%' }}>
                                <Typography variant="caption" color="text.secondary" display="block">
                                  Beta
                                </Typography>
                                <Typography variant="h6" fontWeight="medium">
                                  {stockDetails.beta?.toFixed(2)}
                                </Typography>
                              </Paper>
                            </Grid>
                          </Grid>
                        </>
                      )}
                      
                      {/* Stock Recommendation */}
                      {stockDetails.recommendation && (
                        <Box 
                          bgcolor={
                            stockDetails.recommendation.rating === 'Buy' ? 'success.lighter' : 
                            stockDetails.recommendation.rating === 'Sell' ? 'error.lighter' : 'warning.lighter'
                          }
                          p={2}
                          borderRadius={1}
                          mb={3}
                        >
                          <Box display="flex" justifyContent="space-between" alignItems="center">
                            <Typography variant="subtitle1" fontWeight="medium">
                              Recommendation:
                            </Typography>
                            <Chip 
                              label={stockDetails.recommendation.rating}
                              color={
                                stockDetails.recommendation.rating === 'Buy' ? 'success' : 
                                stockDetails.recommendation.rating === 'Sell' ? 'error' : 'warning'
                              }
                            />
                          </Box>
                          {stockDetails.recommendation.reasons && (
                            <Box mt={1}>
                              {stockDetails.recommendation.reasons.map((reason, index) => (
                                <Typography key={index} variant="body2" display="flex" alignItems="center" mt={0.5}>
                                  <FiberManualRecord sx={{ fontSize: 8, mr: 1 }} />
                                  {reason}
                                </Typography>
                              ))}
                            </Box>
                          )}
                        </Box>
                      )}
                      
                      {/* Action Buttons */}
                      <Box display="flex" gap={2}>
                        <Button 
                          variant="contained" 
                          color="primary" 
                          startIcon={<Assessment />}
                          fullWidth
                          onClick={() => handleViewDetails(selectedStock)}
                        >
                          Full Analysis
                        </Button>
                        <Button 
                          variant="outlined" 
                          color="primary" 
                          startIcon={<Timeline />}
                          fullWidth
                          onClick={() => navigate(`/stock/${selectedStock.exchange}/${selectedStock.symbol}/predict`)}
                        >
                          AI Prediction
                        </Button>
                      </Box>
                    </Box>
                  </>
                ) : (
                  <Box display="flex" justifyContent="center" alignItems="center" height="100%" p={4} textAlign="center" color="text.secondary">
                    <Info sx={{ mb: 1, fontSize: 40, color: 'primary.main' }} />
                    <Typography>
                      Select a stock from the list to view details
                    </Typography>
                  </Box>
                )}
              </Paper>
            </Grid>
          )}
        </Grid>
      )}
    </Container>
  );
};

export default SearchResultsPage; 