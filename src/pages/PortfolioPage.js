import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Grid,
  Typography,
  Box,
  Paper,
  Card,
  CardContent,
  Button,
  Divider,
  Tabs,
  Tab,
  TextField,
  InputAdornment,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  CircularProgress,
  Alert,
  Tooltip,
  Autocomplete
} from '@mui/material';
import {
  Add,
  Delete,
  Edit,
  TrendingUp,
  TrendingDown,
  Visibility,
  VisibilityOff,
  Search,
  Info,
  PieChart,
  BarChart,
  Timeline,
  ShowChart,
  Warning,
  ArrowDropUp,
  ArrowDropDown
} from '@mui/icons-material';
import { Line, Pie, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
  ArcElement,
  BarElement
} from 'chart.js';
import {
  fetchPortfolio,
  addHolding,
  updateHolding,
  deleteHolding,
  fetchPortfolioPerformance
} from '../redux/portfolioSlice';
import { searchStocks } from '../redux/stockSlice';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  ChartTooltip,
  Legend,
  ArcElement,
  BarElement
);

// Portfolio Summary Component
const PortfolioSummary = ({ portfolio, loading, error }) => {
  const [showValue, setShowValue] = useState(true);
  
  if (loading) {
    return (
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
              <CircularProgress />
            </Box>
          </Grid>
        </Grid>
      </Paper>
    );
  }
  
  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 3 }}>
        Error loading portfolio: {error}
      </Alert>
    );
  }
  
  if (!portfolio || !portfolio.summary) {
    return (
      <Alert severity="info" sx={{ mb: 3 }}>
        No portfolio data available. Add holdings to get started.
      </Alert>
    );
  }
  
  const { 
    totalValue, 
    totalInvestment, 
    dayChange, 
    dayChangePercent, 
    overallGain, 
    overallGainPercent 
  } = portfolio.summary;
  
  const toggleValueVisibility = () => {
    setShowValue(!showValue);
  };
  
  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h5" component="h1">
              Portfolio Summary
            </Typography>
            <IconButton onClick={toggleValueVisibility} size="small">
              {showValue ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </Box>
          <Divider sx={{ my: 2 }} />
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Box>
            <Typography variant="body2" color="text.secondary">
              Current Value
            </Typography>
            <Typography variant="h4" fontWeight="medium">
              {showValue ? `₹${totalValue.toLocaleString('en-IN')}` : '******'}
            </Typography>
          </Box>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Box>
            <Typography variant="body2" color="text.secondary">
              Total Investment
            </Typography>
            <Typography variant="h4" fontWeight="medium">
              {showValue ? `₹${totalInvestment.toLocaleString('en-IN')}` : '******'}
            </Typography>
          </Box>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Box>
            <Typography variant="body2" color="text.secondary">
              Day's Change
            </Typography>
            <Box display="flex" alignItems="center">
              <Typography 
                variant="h4" 
                fontWeight="medium"
                color={dayChange >= 0 ? 'success.main' : 'error.main'}
              >
                {showValue ? `₹${Math.abs(dayChange).toLocaleString('en-IN')}` : '******'}
              </Typography>
              {dayChange >= 0 ? (
                <ArrowDropUp color="success" sx={{ fontSize: 30 }} />
              ) : (
                <ArrowDropDown color="error" sx={{ fontSize: 30 }} />
              )}
            </Box>
            <Typography 
              variant="body2"
              color={dayChange >= 0 ? 'success.main' : 'error.main'}
            >
              {dayChange >= 0 ? '+' : '-'}{Math.abs(dayChangePercent).toFixed(2)}%
            </Typography>
          </Box>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Box>
            <Typography variant="body2" color="text.secondary">
              Overall Gain/Loss
            </Typography>
            <Box display="flex" alignItems="center">
              <Typography 
                variant="h4" 
                fontWeight="medium"
                color={overallGain >= 0 ? 'success.main' : 'error.main'}
              >
                {showValue ? `₹${Math.abs(overallGain).toLocaleString('en-IN')}` : '******'}
              </Typography>
              {overallGain >= 0 ? (
                <ArrowDropUp color="success" sx={{ fontSize: 30 }} />
              ) : (
                <ArrowDropDown color="error" sx={{ fontSize: 30 }} />
              )}
            </Box>
            <Typography 
              variant="body2"
              color={overallGain >= 0 ? 'success.main' : 'error.main'}
            >
              {overallGain >= 0 ? '+' : '-'}{Math.abs(overallGainPercent).toFixed(2)}%
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
};

// Portfolio Allocation Chart Component
const PortfolioAllocation = ({ portfolio, loading }) => {
  if (loading || !portfolio || !portfolio.holdings || portfolio.holdings.length === 0) {
    return (
      <Card sx={{ height: '100%' }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Sector Allocation
          </Typography>
          <Box display="flex" justifyContent="center" alignItems="center" minHeight={250}>
            {loading ? (
              <CircularProgress />
            ) : (
              <Typography color="text.secondary">
                No holdings data available
              </Typography>
            )}
          </Box>
        </CardContent>
      </Card>
    );
  }
  
  // Group holdings by sector
  const sectorData = portfolio.holdings.reduce((acc, holding) => {
    const sector = holding.sector || 'Unknown';
    if (!acc[sector]) {
      acc[sector] = 0;
    }
    acc[sector] += holding.currentValue;
    return acc;
  }, {});
  
  // Prepare data for chart
  const chartData = {
    labels: Object.keys(sectorData),
    datasets: [
      {
        label: 'Sector Allocation',
        data: Object.values(sectorData),
        backgroundColor: [
          'rgba(54, 162, 235, 0.7)',
          'rgba(255, 99, 132, 0.7)',
          'rgba(75, 192, 192, 0.7)',
          'rgba(255, 159, 64, 0.7)',
          'rgba(153, 102, 255, 0.7)',
          'rgba(255, 206, 86, 0.7)',
          'rgba(54, 162, 235, 0.7)',
          'rgba(255, 99, 132, 0.7)',
          'rgba(75, 192, 192, 0.7)',
        ],
        borderWidth: 1,
      },
    ],
  };
  
  const chartOptions = {
    plugins: {
      legend: {
        position: 'right',
        labels: {
          boxWidth: 15,
          font: {
            size: 11
          }
        }
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const value = context.parsed;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(2);
            return `₹${value.toLocaleString('en-IN')} (${percentage}%)`;
          }
        }
      }
    },
    maintainAspectRatio: false
  };
  
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Sector Allocation
        </Typography>
        <Box height={250}>
          <Pie data={chartData} options={chartOptions} />
        </Box>
      </CardContent>
    </Card>
  );
};

// Portfolio Performance Chart Component
const PortfolioPerformance = ({ performance, loading }) => {
  const [timeRange, setTimeRange] = useState('1M');
  
  const handleTimeRangeChange = (event, newValue) => {
    if (newValue !== null) {
      setTimeRange(newValue);
    }
  };
  
  if (loading || !performance || !performance.historicalValue) {
    return (
      <Card sx={{ height: '100%' }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Portfolio Performance
          </Typography>
          <Box display="flex" justifyContent="center" alignItems="center" minHeight={250}>
            {loading ? (
              <CircularProgress />
            ) : (
              <Typography color="text.secondary">
                No performance data available
              </Typography>
            )}
          </Box>
        </CardContent>
      </Card>
    );
  }
  
  // Filter data based on selected time range
  const timeRangeFilter = (data) => {
    const now = new Date();
    let filterDate = new Date();
    
    switch (timeRange) {
      case '1W':
        filterDate.setDate(now.getDate() - 7);
        break;
      case '1M':
        filterDate.setMonth(now.getMonth() - 1);
        break;
      case '3M':
        filterDate.setMonth(now.getMonth() - 3);
        break;
      case '6M':
        filterDate.setMonth(now.getMonth() - 6);
        break;
      case '1Y':
        filterDate.setFullYear(now.getFullYear() - 1);
        break;
      case 'YTD':
        filterDate = new Date(now.getFullYear(), 0, 1);
        break;
      case 'ALL':
      default:
        return data;
    }
    
    return data.filter(item => new Date(item.date) >= filterDate);
  };
  
  const filteredData = timeRangeFilter(performance.historicalValue);
  
  // Calculate performance metrics
  const startValue = filteredData.length > 0 ? filteredData[0].value : 0;
  const endValue = filteredData.length > 0 ? filteredData[filteredData.length - 1].value : 0;
  const absoluteChange = endValue - startValue;
  const percentChange = startValue !== 0 ? (absoluteChange / startValue) * 100 : 0;
  
  // Prepare data for chart
  const chartData = {
    labels: filteredData.map(item => {
      const date = new Date(item.date);
      return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
    }),
    datasets: [
      {
        label: 'Portfolio Value',
        data: filteredData.map(item => item.value),
        fill: false,
        borderColor: percentChange >= 0 ? 'rgba(75, 192, 192, 1)' : 'rgba(255, 99, 132, 1)',
        backgroundColor: percentChange >= 0 ? 'rgba(75, 192, 192, 0.2)' : 'rgba(255, 99, 132, 0.2)',
        tension: 0.1,
        pointRadius: 1,
        pointHoverRadius: 5,
      },
    ],
  };
  
  const chartOptions = {
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            return `₹${context.parsed.y.toLocaleString('en-IN')}`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        }
      },
      y: {
        beginAtZero: false,
        ticks: {
          callback: value => `₹${value.toLocaleString('en-IN')}`
        }
      }
    },
    maintainAspectRatio: false
  };
  
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
          <Typography variant="h6">
            Portfolio Performance
          </Typography>
          <Box display="flex" alignItems="center">
            <Typography 
              variant="body2" 
              color={percentChange >= 0 ? 'success.main' : 'error.main'}
              fontWeight="medium"
              sx={{ mr: 1 }}
            >
              {percentChange >= 0 ? '+' : ''}{percentChange.toFixed(2)}%
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {timeRange}
            </Typography>
          </Box>
        </Box>
        
        <Tabs
          value={timeRange}
          onChange={handleTimeRangeChange}
          variant="scrollable"
          scrollButtons="auto"
          allowScrollButtonsMobile
          sx={{ mb: 2 }}
        >
          <Tab label="1W" value="1W" />
          <Tab label="1M" value="1M" />
          <Tab label="3M" value="3M" />
          <Tab label="6M" value="6M" />
          <Tab label="1Y" value="1Y" />
          <Tab label="YTD" value="YTD" />
          <Tab label="ALL" value="ALL" />
        </Tabs>
        
        <Box height={200}>
          <Line data={chartData} options={chartOptions} />
        </Box>
      </CardContent>
    </Card>
  );
};

// Holdings Table Component
const HoldingsTable = ({ holdings, loading, onEditHolding, onDeleteHolding }) => {
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
        <CircularProgress />
      </Box>
    );
  }
  
  if (!holdings || holdings.length === 0) {
    return (
      <Box textAlign="center" py={3}>
        <Typography variant="body1" color="text.secondary">
          No holdings found. Add stocks to your portfolio to get started.
        </Typography>
      </Box>
    );
  }
  
  return (
    <TableContainer component={Paper} sx={{ mb: 3 }}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Stock</TableCell>
            <TableCell align="right">Qty</TableCell>
            <TableCell align="right">Avg. Cost</TableCell>
            <TableCell align="right">Current Price</TableCell>
            <TableCell align="right">Current Value</TableCell>
            <TableCell align="right">Day Change</TableCell>
            <TableCell align="right">Overall P/L</TableCell>
            <TableCell align="center">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {holdings.map((holding) => {
            const overallProfit = holding.currentValue - holding.investedAmount;
            const overallProfitPercent = (overallProfit / holding.investedAmount) * 100;
            
            return (
              <TableRow key={holding.id} hover>
                <TableCell>
                  <Box>
                    <Typography variant="body2" fontWeight="medium">
                      {holding.symbol}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {holding.name}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell align="right">
                  {holding.quantity}
                </TableCell>
                <TableCell align="right">
                  ₹{holding.avgCost.toFixed(2)}
                </TableCell>
                <TableCell align="right">
                  ₹{holding.currentPrice.toFixed(2)}
                </TableCell>
                <TableCell align="right">
                  ₹{holding.currentValue.toLocaleString('en-IN')}
                </TableCell>
                <TableCell align="right">
                  <Box display="flex" alignItems="center" justifyContent="flex-end">
                    {holding.dayChange >= 0 ? (
                      <TrendingUp fontSize="small" color="success" sx={{ mr: 0.5 }} />
                    ) : (
                      <TrendingDown fontSize="small" color="error" sx={{ mr: 0.5 }} />
                    )}
                    <Typography
                      variant="body2"
                      color={holding.dayChange >= 0 ? 'success.main' : 'error.main'}
                    >
                      {holding.dayChange >= 0 ? '+' : ''}{holding.dayChangePercent.toFixed(2)}%
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell align="right">
                  <Box>
                    <Typography
                      variant="body2"
                      color={overallProfit >= 0 ? 'success.main' : 'error.main'}
                      fontWeight="medium"
                    >
                      ₹{overallProfit.toLocaleString('en-IN')}
                    </Typography>
                    <Typography
                      variant="caption"
                      color={overallProfit >= 0 ? 'success.main' : 'error.main'}
                    >
                      {overallProfit >= 0 ? '+' : ''}{overallProfitPercent.toFixed(2)}%
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell align="center">
                  <Tooltip title="Edit">
                    <IconButton 
                      size="small"
                      onClick={() => onEditHolding(holding)}
                    >
                      <Edit fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton 
                      size="small"
                      onClick={() => onDeleteHolding(holding.id)}
                      color="error"
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

// Holding Form Dialog Component
const HoldingFormDialog = ({ open, onClose, onSubmit, initialData, mode }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    symbol: '',
    name: '',
    quantity: 0,
    avgCost: 0,
    exchange: 'NSE'
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStock, setSelectedStock] = useState(null);
  
  const { searchResults, loading } = useSelector((state) => ({
    searchResults: state.stock.searchResults,
    loading: state.stock.loading.search
  }));
  
  useEffect(() => {
    // Initialize form with initial data if editing
    if (initialData && mode === 'edit') {
      setFormData({
        symbol: initialData.symbol,
        name: initialData.name,
        quantity: initialData.quantity,
        avgCost: initialData.avgCost,
        exchange: initialData.exchange || 'NSE'
      });
      setSelectedStock({
        symbol: initialData.symbol,
        name: initialData.name,
        exchange: initialData.exchange || 'NSE'
      });
    } else {
      // Reset form for adding new holding
      setFormData({
        symbol: '',
        name: '',
        quantity: 0,
        avgCost: 0,
        exchange: 'NSE'
      });
      setSelectedStock(null);
    }
  }, [initialData, mode, open]);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'quantity' || name === 'avgCost' ? parseFloat(value) : value
    });
  };
  
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    if (query.length >= 2) {
      dispatch(searchStocks(query));
    }
  };
  
  const handleStockSelection = (event, stock) => {
    if (stock) {
      setSelectedStock(stock);
      setFormData({
        ...formData,
        symbol: stock.symbol,
        name: stock.name,
        exchange: stock.exchange || 'NSE'
      });
    }
  };
  
  const handleSubmit = () => {
    const holdingData = {
      ...formData,
      id: initialData?.id
    };
    
    onSubmit(holdingData);
    onClose();
  };
  
  const isFormValid = () => {
    return (
      formData.symbol &&
      formData.name &&
      formData.quantity > 0 &&
      formData.avgCost > 0
    );
  };
  
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {mode === 'edit' ? 'Edit Holding' : 'Add New Holding'}
      </DialogTitle>
      <DialogContent>
        <Box p={1}>
          {mode === 'add' && (
            <Autocomplete
              id="stock-search"
              options={searchResults || []}
              getOptionLabel={(option) => `${option.symbol} - ${option.name} (${option.exchange || 'NSE'})`}
              value={selectedStock}
              onChange={handleStockSelection}
              loading={loading}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Search Stock"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {loading ? <CircularProgress color="inherit" size={20} /> : null}
                        {params.InputProps.endAdornment}
                      </>
                    )
                  }}
                />
              )}
            />
          )}
          
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Symbol"
                name="symbol"
                value={formData.symbol}
                onChange={handleInputChange}
                fullWidth
                disabled={mode === 'edit' || !!selectedStock}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Company Name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                fullWidth
                disabled={mode === 'edit' || !!selectedStock}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Quantity"
                name="quantity"
                type="number"
                value={formData.quantity}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
                inputProps={{ min: 0, step: 1 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Average Cost (₹)"
                name="avgCost"
                type="number"
                value={formData.avgCost}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
                inputProps={{ min: 0, step: 0.01 }}
                InputProps={{
                  startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Exchange</InputLabel>
                <Select
                  name="exchange"
                  value={formData.exchange}
                  onChange={handleInputChange}
                  label="Exchange"
                >
                  <MenuItem value="NSE">NSE</MenuItem>
                  <MenuItem value="BSE">BSE</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">Cancel</Button>
        <Button 
          onClick={handleSubmit} 
          color="primary" 
          variant="contained"
          disabled={!isFormValid()}
        >
          {mode === 'edit' ? 'Update' : 'Add'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// Main Portfolio Page Component
const PortfolioPage = () => {
  const dispatch = useDispatch();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState('add');
  const [selectedHolding, setSelectedHolding] = useState(null);
  
  const { portfolio, performance, loading, error } = useSelector((state) => state.portfolio);
  
  useEffect(() => {
    dispatch(fetchPortfolio());
    dispatch(fetchPortfolioPerformance());
  }, [dispatch]);
  
  const handleAddHolding = () => {
    setDialogMode('add');
    setSelectedHolding(null);
    setDialogOpen(true);
  };
  
  const handleEditHolding = (holding) => {
    setDialogMode('edit');
    setSelectedHolding(holding);
    setDialogOpen(true);
  };
  
  const handleDeleteHolding = (holdingId) => {
    if (window.confirm('Are you sure you want to delete this holding?')) {
      dispatch(deleteHolding(holdingId));
    }
  };
  
  const handleDialogClose = () => {
    setDialogOpen(false);
  };
  
  const handleHoldingSubmit = (holdingData) => {
    if (dialogMode === 'edit') {
      dispatch(updateHolding(holdingData));
    } else {
      dispatch(addHolding(holdingData));
    }
  };
  
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          My Portfolio
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Add />}
          onClick={handleAddHolding}
        >
          Add Holding
        </Button>
      </Box>
      
      <PortfolioSummary 
        portfolio={portfolio} 
        loading={loading.portfolio}
        error={error.portfolio}
      />
      
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={8}>
          <PortfolioPerformance 
            performance={performance}
            loading={loading.performance}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <PortfolioAllocation 
            portfolio={portfolio}
            loading={loading.portfolio}
          />
        </Grid>
      </Grid>
      
      <Box mb={2} display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h5" component="h2">
          Holdings
        </Typography>
      </Box>
      
      <HoldingsTable 
        holdings={portfolio?.holdings || []}
        loading={loading.portfolio}
        onEditHolding={handleEditHolding}
        onDeleteHolding={handleDeleteHolding}
      />
      
      <HoldingFormDialog
        open={dialogOpen}
        onClose={handleDialogClose}
        onSubmit={handleHoldingSubmit}
        initialData={selectedHolding}
        mode={dialogMode}
      />
      
      <Paper elevation={0} sx={{ p: 2, mt: 4, bgcolor: 'info.lighter' }}>
        <Box display="flex" alignItems="flex-start">
          <Info color="info" sx={{ mr: 1, mt: 0.5 }} />
          <Typography variant="body2" color="text.secondary">
            <strong>Note:</strong> This portfolio is for tracking purposes only and does not reflect actual trades.
            The data shown here is based on your manual inputs and current market prices.
            Historical performance is simulated based on available price data.
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default PortfolioPage; 