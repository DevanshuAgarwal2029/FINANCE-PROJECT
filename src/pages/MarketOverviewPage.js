import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Button,
  Tabs,
  Tab,
  CircularProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Skeleton
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  Error,
  ShowChart,
  Timeline,
  DonutLarge,
  Assessment,
  ArrowDropUp,
  ArrowDropDown,
  Info
} from '@mui/icons-material';

// Import actions from Redux
import { 
  fetchMarketIndices, 
  fetchTopMovers, 
  fetchSectorPerformance,
  fetchMarketOverview
} from '../redux/marketSlice';

// Market Index Card component
const MarketIndexCard = ({ index, loading }) => {
  if (loading || !index) {
    return (
      <Card sx={{ height: '100%' }}>
        <CardContent>
          <Skeleton variant="text" height={40} width="70%" />
          <Skeleton variant="text" height={60} />
          <Skeleton variant="text" height={24} width="40%" />
        </CardContent>
      </Card>
    );
  }
  
  const isPositive = index.change > 0;
  
  return (
    <Card 
      sx={{ 
        height: '100%',
        borderLeft: 4, 
        borderColor: isPositive ? 'success.main' : 'error.main'
      }}
    >
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {index.name}
        </Typography>
        
        <Box display="flex" alignItems="baseline" mb={1}>
          <Typography variant="h4" component="span" fontWeight="medium">
            {index.price?.toLocaleString('en-IN')}
          </Typography>
          <Box 
            display="flex" 
            alignItems="center" 
            ml={2}
            color={isPositive ? 'success.main' : 'error.main'}
          >
            {isPositive ? <TrendingUp fontSize="small" sx={{ mr: 0.5 }} /> : <TrendingDown fontSize="small" sx={{ mr: 0.5 }} />}
            <Typography 
              variant="body1" 
              component="span" 
              fontWeight="medium"
            >
              {isPositive ? '+' : ''}{index.change?.toFixed(2)} ({isPositive ? '+' : ''}{index.changePercent?.toFixed(2)}%)
            </Typography>
          </Box>
        </Box>
        
        <Typography variant="body2" color="text.secondary">
          {index.lastUpdated ? `Last updated: ${new Date(index.lastUpdated).toLocaleString('en-IN')}` : ''}
        </Typography>
      </CardContent>
    </Card>
  );
};

// Stock Mover component
const StockMover = ({ stock, index }) => {
  const isPositive = stock.changePercent > 0;
  
  return (
    <TableRow 
      hover 
      sx={{ 
        '&:nth-of-type(odd)': { bgcolor: 'action.hover' }
      }}
    >
      <TableCell>
        <Link to={`/stock/${stock.symbol}`} style={{ textDecoration: 'none', color: 'inherit' }}>
          <Typography variant="body2" fontWeight="medium" color="primary">
            {stock.symbol}
          </Typography>
          <Typography variant="caption" color="text.secondary" display="block">
            {stock.name && stock.name.length > 25 ? `${stock.name.substring(0, 25)}...` : stock.name}
          </Typography>
        </Link>
      </TableCell>
      <TableCell align="right">
        <Typography variant="body2">
          ₹{stock.price?.toLocaleString('en-IN')}
        </Typography>
      </TableCell>
      <TableCell align="right">
        <Box display="flex" alignItems="center" justifyContent="flex-end">
          {isPositive ? 
            <ArrowDropUp color="success" /> : 
            <ArrowDropDown color="error" />
          }
          <Typography 
            variant="body2" 
            color={isPositive ? 'success.main' : 'error.main'}
            fontWeight="medium"
          >
            {Math.abs(stock.changePercent || 0).toFixed(2)}%
          </Typography>
        </Box>
      </TableCell>
    </TableRow>
  );
};

// Market Movers component
const MarketMovers = ({ gainers, losers, loading, error }) => {
  const [tabValue, setTabValue] = useState(0);
  
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  if (loading) {
    return (
      <Card>
        <CardHeader title="Market Movers" />
        <Divider />
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Skeleton variant="rectangular" height={48} />
        </Box>
        <CardContent>
          {[1, 2, 3, 4, 5].map((item) => (
            <Box key={item} display="flex" justifyContent="space-between" mb={2}>
              <Skeleton variant="text" width={150} />
              <Skeleton variant="text" width={80} />
            </Box>
          ))}
        </CardContent>
      </Card>
    );
  }
  
  if (error) {
    return (
      <Card>
        <CardHeader title="Market Movers" />
        <Divider />
        <CardContent>
          <Alert severity="error">
            Error loading market movers: {error}
          </Alert>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader 
        title="Market Movers" 
        avatar={
          <Box
            component="img"
            src="/market-movers.png"
            alt="Market Movers"
            sx={{ height: 32, width: 32 }}
          />
        }
      />
      <Divider />
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange}
          variant="fullWidth"
        >
          <Tab 
            icon={<TrendingUp fontSize="small" />} 
            label="Top Gainers" 
            iconPosition="start"
          />
          <Tab 
            icon={<TrendingDown fontSize="small" />} 
            label="Top Losers" 
            iconPosition="start"
          />
        </Tabs>
      </Box>
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Stock</TableCell>
              <TableCell align="right">Price</TableCell>
              <TableCell align="right">Change</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tabValue === 0 ? (
              gainers && gainers.length > 0 ? (
                gainers.slice(0, 10).map((stock, index) => (
                  <StockMover key={stock.symbol} stock={stock} index={index} />
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3}>
                    <Box textAlign="center" p={2}>
                      <Typography variant="body2" color="text.secondary">
                        No data available
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              )
            ) : (
              losers && losers.length > 0 ? (
                losers.slice(0, 10).map((stock, index) => (
                  <StockMover key={stock.symbol} stock={stock} index={index} />
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3}>
                    <Box textAlign="center" p={2}>
                      <Typography variant="body2" color="text.secondary">
                        No data available
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              )
            )}
          </TableBody>
        </Table>
      </TableContainer>
      
      <Box p={2} display="flex" justifyContent="center">
        <Button variant="outlined" size="small" component={Link} to="/market/movers">
          View All Movers
        </Button>
      </Box>
    </Card>
  );
};

// Sector Performance component
const SectorPerformance = ({ sectors, loading, error }) => {
  if (loading) {
    return (
      <Card>
        <CardHeader title="Sector Performance" />
        <Divider />
        <CardContent>
          {[1, 2, 3, 4, 5].map((item) => (
            <Box key={item} mb={2}>
              <Skeleton variant="text" width="60%" height={24} />
              <Skeleton variant="rectangular" height={20} />
            </Box>
          ))}
        </CardContent>
      </Card>
    );
  }
  
  if (error) {
    return (
      <Card>
        <CardHeader title="Sector Performance" />
        <Divider />
        <CardContent>
          <Alert severity="error">
            Error loading sector data: {error}
          </Alert>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader 
        title="Sector Performance" 
        avatar={
          <Box
            component="img"
            src="/sector-performance.png"
            alt="Sector Performance"
            sx={{ height: 32, width: 32 }}
          />
        }
      />
      <Divider />
      <CardContent sx={{ px: 1 }}>
        <List disablePadding>
          {sectors && sectors.length > 0 ? (
            sectors.map((sector) => {
              const isPositive = sector.changePercent > 0;
              
              return (
                <ListItem 
                  key={sector.name}
                  sx={{ 
                    borderLeft: 3, 
                    borderColor: isPositive ? 'success.main' : 'error.main',
                    mb: 1,
                    borderRadius: 1,
                    bgcolor: isPositive ? 'success.lighter' : 'error.lighter'
                  }}
                >
                  <ListItemText
                    primary={
                      <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Typography variant="body2">{sector.name}</Typography>
                        <Box display="flex" alignItems="center">
                          {isPositive ? 
                            <ArrowDropUp color="success" /> : 
                            <ArrowDropDown color="error" />
                          }
                          <Typography 
                            variant="body2" 
                            fontWeight="medium"
                            color={isPositive ? 'success.main' : 'error.main'}
                          >
                            {isPositive ? '+' : ''}{sector.changePercent?.toFixed(2)}%
                          </Typography>
                        </Box>
                      </Box>
                    }
                    secondary={
                      <Box 
                        sx={{ 
                          width: '100%', 
                          bgcolor: 'background.paper',
                          height: 8,
                          borderRadius: 5,
                          mt: 0.5,
                          overflow: 'hidden'
                        }}
                      >
                        <Box
                          sx={{
                            width: `${Math.min(Math.abs(sector.changePercent || 0) * 5, 100)}%`,
                            height: '100%',
                            bgcolor: isPositive ? 'success.main' : 'error.main',
                          }}
                        />
                      </Box>
                    }
                  />
                </ListItem>
              );
            })
          ) : (
            <Box textAlign="center" p={2}>
              <Typography variant="body2" color="text.secondary">
                No sector data available
              </Typography>
            </Box>
          )}
        </List>
      </CardContent>
    </Card>
  );
};

// Market Overview component
const MarketOverview = ({ overview, loading, error }) => {
  if (loading) {
    return (
      <Card>
        <CardHeader title="Market Overview" />
        <Divider />
        <CardContent>
          <Grid container spacing={2}>
            {[1, 2, 3, 4].map((item) => (
              <Grid item xs={12} sm={6} key={item}>
                <Skeleton variant="rectangular" height={100} />
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>
    );
  }
  
  if (error) {
    return (
      <Card>
        <CardHeader title="Market Overview" />
        <Divider />
        <CardContent>
          <Alert severity="error">
            Error loading market overview: {error}
          </Alert>
        </CardContent>
      </Card>
    );
  }
  
  if (!overview) {
    return (
      <Card>
        <CardHeader title="Market Overview" />
        <Divider />
        <CardContent>
          <Alert severity="info">
            Market overview data is not available.
          </Alert>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader 
        title="Market Overview" 
        subheader="Key market statistics"
      />
      <Divider />
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Paper variant="outlined" sx={{ p: 2 }}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Advances vs. Declines
              </Typography>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography variant="h5" color="success.main" gutterBottom>
                    {overview?.advances || 0}
                  </Typography>
                  <Typography variant="body2" color="success.main">
                    Advances
                  </Typography>
                </Box>
                <Box textAlign="center">
                  <Typography variant="h6">vs</Typography>
                </Box>
                <Box textAlign="right">
                  <Typography variant="h5" color="error.main" gutterBottom>
                    {overview?.declines || 0}
                  </Typography>
                  <Typography variant="body2" color="error.main">
                    Declines
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <Paper variant="outlined" sx={{ p: 2 }}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Market Breadth
              </Typography>
              <Box sx={{ position: 'relative', pt: 1 }}>
                <Box
                  sx={{
                    height: 16,
                    display: 'flex',
                    borderRadius: 8,
                    overflow: 'hidden',
                  }}
                >
                  <Box
                    sx={{
                      width: `${(overview?.advances || 0) / ((overview?.advances || 0) + (overview?.declines || 1)) * 100}%`,
                      bgcolor: 'success.main',
                    }}
                  />
                  <Box
                    sx={{
                      width: `${(overview?.declines || 0) / ((overview?.advances || 0) + (overview?.declines || 1)) * 100}%`,
                      bgcolor: 'error.main',
                    }}
                  />
                </Box>
                <Box display="flex" justifyContent="space-between" mt={1.5}>
                  <Typography variant="caption" color="success.main">
                    {((overview?.advances || 0) / ((overview?.advances || 0) + (overview?.declines || 1)) * 100).toFixed(0)}% Advances
                  </Typography>
                  <Typography variant="caption" color="error.main">
                    {((overview?.declines || 0) / ((overview?.advances || 0) + (overview?.declines || 1)) * 100).toFixed(0)}% Declines
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <Paper variant="outlined" sx={{ p: 2 }}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Market Volume
              </Typography>
              <Typography variant="h5" gutterBottom>
                {overview?.volume ? (overview.volume / 10000000).toFixed(2) + ' Cr' : 'N/A'}
              </Typography>
              <Box display="flex" alignItems="center">
                {(overview?.volumeChange || 0) > 0 ? (
                  <ArrowDropUp color="success" fontSize="small" />
                ) : (
                  <ArrowDropDown color="error" fontSize="small" />
                )}
                <Typography 
                  variant="body2" 
                  color={(overview?.volumeChange || 0) > 0 ? 'success.main' : 'error.main'}
                >
                  {Math.abs(overview?.volumeChange || 0).toFixed(2)}% vs previous day
                </Typography>
              </Box>
            </Paper>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <Paper variant="outlined" sx={{ p: 2 }}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Market Sentiment
              </Typography>
              <Box display="flex" justifyContent="center" py={1}>
                <Chip 
                  label={typeof overview?.sentiment === 'object' ? overview?.sentiment?.overall || 'Neutral' : overview?.sentiment || 'Neutral'} 
                  color={
                    (typeof overview?.sentiment === 'object' ? overview?.sentiment?.overall : overview?.sentiment) === 'Bullish' ? 'success' :
                    (typeof overview?.sentiment === 'object' ? overview?.sentiment?.overall : overview?.sentiment) === 'Bearish' ? 'error' :
                    'warning'
                  }
                  sx={{ 
                    fontWeight: 'bold',
                    fontSize: '1rem',
                    py: 2
                  }}
                />
              </Box>
            </Paper>
          </Grid>
        </Grid>
        
        {overview?.marketComment && (
          <Box mt={2}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Market Commentary
            </Typography>
            <Typography variant="body2">
              {overview.marketComment}
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

const MarketOverviewPage = () => {
  const dispatch = useDispatch();
  const { 
    indices = [], 
    topGainers = [], 
    topLosers = [], 
    sectorPerformance: sectors = [], 
    overview: marketOverview = null,
    loading = {
      indices: false,
      topGainers: false,
      topLosers: false,
      movers: false,
      sectorPerformance: false,
      overview: false
    }, 
    error = {
      indices: null,
      topGainers: null,
      topLosers: null,
      movers: null,
      sectorPerformance: null,
      overview: null
    } 
  } = useSelector((state) => state.market || {});
  
  useEffect(() => {
    dispatch(fetchMarketIndices());
    dispatch(fetchTopMovers());
    dispatch(fetchSectorPerformance());
    dispatch(fetchMarketOverview());
  }, [dispatch]);
  
  // Check if indices exist before rendering
  const nifty = indices.find(idx => idx?.name === 'NIFTY 50');
  const sensex = indices.find(idx => idx?.name === 'BSE SENSEX');
  const niftyBank = indices.find(idx => idx?.name === 'NIFTY Bank');
  const niftyIT = indices.find(idx => idx?.name === 'NIFTY IT');
  
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 6 }}>
      <Box mb={4}>
        <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
          Market Overview
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Real-time market data and performance metrics
        </Typography>
      </Box>
      
      {/* Market Indices */}
      <Grid container spacing={3} sx={{ mb: 5 }}>
        <Grid item xs={12} md={3}>
          <MarketIndexCard 
            index={nifty} 
            loading={loading.indices}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <MarketIndexCard 
            index={sensex} 
            loading={loading.indices}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <MarketIndexCard 
            index={niftyBank} 
            loading={loading.indices}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <MarketIndexCard 
            index={niftyIT} 
            loading={loading.indices}
          />
        </Grid>
      </Grid>
      
      {/* Market Overview and Insights */}
      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <MarketOverview 
            overview={marketOverview}
            loading={loading.overview}
            error={error.overview}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <SectorPerformance 
            sectors={sectors}
            loading={loading.sectorPerformance}
            error={error.sectorPerformance}
          />
        </Grid>
      </Grid>
      
      {/* Market Movers */}
      <Box mt={5}>
        <MarketMovers 
          gainers={topGainers}
          losers={topLosers}
          loading={loading.movers}
          error={error.movers}
        />
      </Box>
      
      {/* Disclaimer */}
      <Paper elevation={0} sx={{ p: 3, mt: 5, bgcolor: 'info.lighter', borderRadius: 2 }}>
        <Box display="flex" alignItems="flex-start">
          <Info color="info" sx={{ mr: 1.5, mt: 0.5 }} />
          <Typography variant="body2" color="text.secondary">
            <strong>Disclaimer:</strong> The information provided is for informational purposes only and should not be considered as investment advice. 
            Market data may be delayed. Past performance is not indicative of future results.
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default MarketOverviewPage; 