import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Container, 
  Typography, 
  Paper, 
  Grid, 
  Button, 
  Box, 
  Chip,
  TextField, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem,
  Slider, 
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TableSortLabel,
  Tooltip,
  CircularProgress
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  FilterList,
  Search,
  Sort,
  ArrowUpward,
  ArrowDownward
} from '@mui/icons-material';

const StockScreenerPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    exchange: 'all',
    sector: 'all',
    marketCap: [0, 500000],
    priceRange: [0, 10000],
    pe: [0, 100],
    dividend: [0, 10],
  });
  const [sortBy, setSortBy] = useState('marketCap');
  const [sortDirection, setSortDirection] = useState('desc');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const filtersRef = useRef(null);
  
  // Mock data for demonstration
  const sectors = [
    'All Sectors', 'Technology', 'Banking', 'Pharma', 'Auto', 'FMCG', 
    'Energy', 'Metals', 'Infrastructure', 'Telecom', 'Media'
  ];
  
  const exchanges = ['All Exchanges', 'NSE', 'BSE'];
  
  // Generate mock data if it doesn't exist
  const generateMockData = () => {
    const predefinedStocks = [
      { symbol: "RELIANCE", name: "Reliance Industries Ltd.", exchange: "NSE", sector: "Energy" },
      { symbol: "TCS", name: "Tata Consultancy Services Ltd.", exchange: "NSE", sector: "Technology" },
      { symbol: "HDFCBANK", name: "HDFC Bank Ltd.", exchange: "NSE", sector: "Banking" },
      { symbol: "INFY", name: "Infosys Ltd.", exchange: "NSE", sector: "Technology" },
      { symbol: "SBIN", name: "State Bank of India", exchange: "NSE", sector: "Banking" },
      { symbol: "BHARTIARTL", name: "Bharti Airtel Ltd.", exchange: "NSE", sector: "Telecom" },
      { symbol: "TATAMOTORS", name: "Tata Motors Ltd.", exchange: "BSE", sector: "Auto" },
      { symbol: "MARUTI", name: "Maruti Suzuki India Ltd.", exchange: "BSE", sector: "Auto" },
      { symbol: "SUNPHARMA", name: "Sun Pharmaceutical Industries Ltd.", exchange: "NSE", sector: "Pharma" },
      { symbol: "DRREDDY", name: "Dr. Reddy's Laboratories Ltd.", exchange: "BSE", sector: "Pharma" }
    ];
    
    return predefinedStocks.concat(
      Array(40).fill().map((_, index) => ({
        id: index + predefinedStocks.length,
        symbol: `STOCK${index + 1}`,
        name: `Company ${index + 1}`,
        exchange: index % 2 === 0 ? 'NSE' : 'BSE',
        sector: sectors[Math.floor(Math.random() * (sectors.length - 1)) + 1],
        price: Math.floor(Math.random() * 9000) + 100,
        change: (Math.random() * 10 - 5).toFixed(2),
        changePercent: (Math.random() * 10 - 5).toFixed(2),
        marketCap: Math.floor(Math.random() * 500000),
        pe: Math.floor(Math.random() * 100),
        dividend: (Math.random() * 10).toFixed(2)
      }))
    ).map(stock => {
      // Ensure all stocks have all required properties
      const symbolHash = stock.symbol.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
      return {
        id: stock.id || symbolHash,
        symbol: stock.symbol,
        name: stock.name,
        exchange: stock.exchange,
        sector: stock.sector,
        price: stock.price || Math.floor(symbolHash % 3000) + 500,
        change: stock.change || (symbolHash % 10 - 5).toFixed(2),
        changePercent: stock.changePercent || (symbolHash % 10 - 5).toFixed(2),
        marketCap: stock.marketCap || (symbolHash % 500000) + 5000,
        pe: stock.pe || (symbolHash % 80) + 5,
        dividend: stock.dividend || (symbolHash % 10).toFixed(2)
      };
    });
  };
  
  const mockData = generateMockData();
  
  // Handle filter changes
  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters({
      ...filters,
      [name]: value
    });
  };
  
  // Handle range filter changes
  const handleRangeChange = (name, newValue) => {
    setFilters({
      ...filters,
      [name]: newValue
    });
  };
  
  // Handle sort changes
  const handleSortRequest = (property) => {
    const isAsc = sortBy === property && sortDirection === 'asc';
    setSortDirection(isAsc ? 'desc' : 'asc');
    setSortBy(property);
  };
  
  // Handle pagination
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  
  // Reset filters
  const handleResetFilters = () => {
    setFilters({
      exchange: 'all',
      sector: 'all',
      marketCap: [0, 500000],
      priceRange: [0, 10000],
      pe: [0, 100],
      dividend: [0, 10],
    });
  };
  
  // Apply filters and sorting
  const getFilteredData = () => {
    // Ensure we have initial data
    if (mockData.length === 0) {
      return mockData;
    }
    
    // Apply filters
    let filteredData = mockData.filter(stock => {
      if (filters.exchange !== 'all' && stock.exchange !== filters.exchange) return false;
      if (filters.sector !== 'all' && stock.sector !== filters.sector) return false;
      if (stock.marketCap < filters.marketCap[0] || stock.marketCap > filters.marketCap[1]) return false;
      if (stock.price < filters.priceRange[0] || stock.price > filters.priceRange[1]) return false;
      if (stock.pe < filters.pe[0] || stock.pe > filters.pe[1]) return false;
      if (stock.dividend < filters.dividend[0] || stock.dividend > filters.dividend[1]) return false;
      return true;
    });
    
    // Apply sorting
    filteredData.sort((a, b) => {
      const valueA = a[sortBy];
      const valueB = b[sortBy];
      
      if (sortDirection === 'asc') {
        return valueA < valueB ? -1 : 1;
      } else {
        return valueA > valueB ? -1 : 1;
      }
    });
    
    // Log the filtered data for debugging
    console.log(`Filtered data: ${filteredData.length} items`);
    
    return filteredData;
  };
  
  const filteredData = getFilteredData();
  
  // Generate unique filter ID
  const generateFilterId = () => {
    return `filter_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
  };

  // Format market cap value for display
  const formatMarketCap = (value) => {
    if (value >= 100000) {
      return `${(value / 100000).toFixed(2)} Lakh Cr`;
    } else if (value >= 1000) {
      return `${(value / 1000).toFixed(2)} Thousand Cr`;
    }
    return `${value} Cr`;
  };
  
  return (
    <Container maxWidth="lg">
      <Box mt={4} mb={2}>
        <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
          Stock Screener - Fundamental Analysis
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" paragraph>
          Find the best investment opportunities based on financial health, valuation metrics, and growth potential.
        </Typography>
      </Box>
      
      {/* Main content section with information about fundamental analysis */}
      {(filteredData.length === 0 || !loading) && (
        <Box my={6}>
          <Paper sx={{ p: 4, mb: 4 }}>
            <Typography variant="h5" gutterBottom>
              Understanding Fundamental Analysis
            </Typography>
            <Typography variant="body1" paragraph>
              Fundamental analysis is a method of evaluating securities by attempting to measure their intrinsic value. 
              Analysts study everything from the overall economy and industry conditions to the financial strength and 
              management of companies.
            </Typography>
            
            <Grid container spacing={4} sx={{ mt: 2 }}>
              <Grid item xs={12} md={4}>
                <Box textAlign="center" p={2}>
                  <Box component="svg" 
                    width={80}
                    height={80}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#1976d2"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    mb={2}
                  >
                    <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
                  </Box>
                  <Typography variant="h6" gutterBottom>Financial Health</Typography>
                  <Typography variant="body2">
                    Analyze balance sheets, income statements, and cash flow statements to assess a company's financial stability.
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box textAlign="center" p={2}>
                  <Box component="svg" 
                    width={80}
                    height={80}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#1976d2"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    mb={2}
                  >
                    <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                    <line x1="8" y1="21" x2="16" y2="21"></line>
                    <line x1="12" y1="17" x2="12" y2="21"></line>
                  </Box>
                  <Typography variant="h6" gutterBottom>Valuation Metrics</Typography>
                  <Typography variant="body2">
                    Evaluate P/E ratios, PEG ratios, P/B values, and dividend yields to determine if a stock is undervalued.
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box textAlign="center" p={2}>
                  <Box component="svg" 
                    width={80}
                    height={80}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#1976d2"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    mb={2}
                  >
                    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
                    <polyline points="17 6 23 6 23 12"></polyline>
                  </Box>
                  <Typography variant="h6" gutterBottom>Growth Potential</Typography>
                  <Typography variant="body2">
                    Examine revenue growth, earnings trends, and industry positioning to forecast future performance.
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>Key Financial Ratios</Typography>
                <Typography variant="body2" paragraph>
                  Financial ratios help investors evaluate a company's performance and compare it to competitors.
                </Typography>
                <Box component="ul" sx={{ pl: 2 }}>
                  <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                    <strong>P/E Ratio:</strong> Price-to-Earnings ratio compares a stock's price to its earnings per share
                  </Typography>
                  <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                    <strong>Debt-to-Equity:</strong> Measures a company's financial leverage
                  </Typography>
                  <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                    <strong>ROE:</strong> Return on Equity shows how efficiently a company uses its assets
                  </Typography>
                  <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                    <strong>Dividend Yield:</strong> Annual dividend payments relative to stock price
                  </Typography>
                </Box>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>Industry Analysis</Typography>
                <Typography variant="body2" paragraph>
                  Understanding industry trends and competitive positioning is crucial for fundamental analysis.
                </Typography>
                <Box component="ul" sx={{ pl: 2 }}>
                  <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                    <strong>Market Share:</strong> A company's sales relative to total industry sales
                  </Typography>
                  <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                    <strong>Industry Growth:</strong> The overall growth rate of the industry
                  </Typography>
                  <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                    <strong>Competitive Advantage:</strong> Unique strengths that give a company an edge
                  </Typography>
                  <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                    <strong>Regulatory Environment:</strong> Legal and regulatory factors affecting the industry
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          </Grid>
          
          <Box mt={4} textAlign="center">
            <Typography variant="h6" gutterBottom>
              Ready to find investment opportunities?
            </Typography>
            <Typography variant="body1" paragraph>
              Use the filters below to screen stocks based on your investment criteria.
            </Typography>
            <Button 
              variant="contained" 
              color="primary" 
              size="large"
              onClick={() => {
                window.scrollTo({
                  top: filtersRef.current.offsetTop - 20,
                  behavior: 'smooth'
                });
              }}
            >
              Start Screening
            </Button>
          </Box>
        </Box>
      )}
      
      {/* Filters Section */}
      <Paper ref={filtersRef} sx={{ p: 3, mb: 4 }}>
        <Box display="flex" alignItems="center" mb={2}>
          <FilterList sx={{ mr: 1 }} />
          <Typography variant="h6">Filters</Typography>
          <Box flexGrow={1} />
          <Button 
            variant="outlined" 
            size="small" 
            onClick={handleResetFilters}
          >
            Reset Filters
          </Button>
        </Box>
        
        <Grid container spacing={3}>
          {/* Exchange Filter */}
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth>
              <InputLabel>Exchange</InputLabel>
              <Select
                name="exchange"
                value={filters.exchange}
                label="Exchange"
                onChange={handleFilterChange}
              >
                <MenuItem value="all">All Exchanges</MenuItem>
                <MenuItem value="NSE">NSE</MenuItem>
                <MenuItem value="BSE">BSE</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          {/* Sector Filter */}
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth>
              <InputLabel>Sector</InputLabel>
              <Select
                name="sector"
                value={filters.sector}
                label="Sector"
                onChange={handleFilterChange}
              >
                <MenuItem value="all">All Sectors</MenuItem>
                {sectors.slice(1).map((sector) => (
                  <MenuItem key={sector} value={sector}>
                    {sector}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          {/* Search Box */}
          <Grid item xs={12} sm={6} md={6}>
            <TextField
              fullWidth
              placeholder="Search by company name or symbol"
              InputProps={{
                startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />
              }}
            />
          </Grid>
          
          {/* Market Cap Range */}
          <Grid item xs={12} sm={6}>
            <Typography gutterBottom>Market Cap (in Crores)</Typography>
            <Slider
              value={filters.marketCap}
              onChange={(e, newValue) => handleRangeChange('marketCap', newValue)}
              valueLabelDisplay="auto"
              min={0}
              max={500000}
              valueLabelFormat={(value) => formatMarketCap(value)}
            />
            <Box display="flex" justifyContent="space-between">
              <Typography variant="body2" color="text.secondary">
                ₹0
              </Typography>
              <Typography variant="body2" color="text.secondary">
                ₹5L Cr
              </Typography>
            </Box>
          </Grid>
          
          {/* Price Range */}
          <Grid item xs={12} sm={6}>
            <Typography gutterBottom>Price Range (₹)</Typography>
            <Slider
              value={filters.priceRange}
              onChange={(e, newValue) => handleRangeChange('priceRange', newValue)}
              valueLabelDisplay="auto"
              min={0}
              max={10000}
              valueLabelFormat={(value) => `₹${value}`}
            />
            <Box display="flex" justifyContent="space-between">
              <Typography variant="body2" color="text.secondary">
                ₹0
              </Typography>
              <Typography variant="body2" color="text.secondary">
                ₹10,000
              </Typography>
            </Box>
          </Grid>
          
          {/* P/E Ratio */}
          <Grid item xs={12} sm={6}>
            <Typography gutterBottom>P/E Ratio</Typography>
            <Slider
              value={filters.pe}
              onChange={(e, newValue) => handleRangeChange('pe', newValue)}
              valueLabelDisplay="auto"
              min={0}
              max={100}
            />
            <Box display="flex" justifyContent="space-between">
              <Typography variant="body2" color="text.secondary">
                0
              </Typography>
              <Typography variant="body2" color="text.secondary">
                100
              </Typography>
            </Box>
          </Grid>
          
          {/* Dividend Yield */}
          <Grid item xs={12} sm={6}>
            <Typography gutterBottom>Dividend Yield (%)</Typography>
            <Slider
              value={filters.dividend}
              onChange={(e, newValue) => handleRangeChange('dividend', newValue)}
              valueLabelDisplay="auto"
              min={0}
              max={10}
              step={0.1}
            />
            <Box display="flex" justifyContent="space-between">
              <Typography variant="body2" color="text.secondary">
                0%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                10%
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>
      
      {/* Results Section */}
      <Paper elevation={3}>
        <Box px={3} py={2} display="flex" alignItems="center">
          <Typography variant="h6">Results ({filteredData.length} stocks)</Typography>
          <Box flexGrow={1} />
          <FormControl variant="outlined" size="small" sx={{ minWidth: 150, mr: 2 }}>
            <InputLabel>Sort By</InputLabel>
            <Select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              label="Sort By"
            >
              <MenuItem value="marketCap">Market Cap</MenuItem>
              <MenuItem value="price">Price</MenuItem>
              <MenuItem value="changePercent">% Change</MenuItem>
              <MenuItem value="pe">P/E Ratio</MenuItem>
              <MenuItem value="dividend">Dividend</MenuItem>
            </Select>
          </FormControl>
          <Button 
            startIcon={sortDirection === 'asc' ? <ArrowUpward /> : <ArrowDownward />}
            variant="outlined"
            onClick={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}
          >
            {sortDirection === 'asc' ? 'Ascending' : 'Descending'}
          </Button>
        </Box>
        
        <Divider />
        
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" p={4}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <TableSortLabel
                        active={sortBy === 'symbol'}
                        direction={sortBy === 'symbol' ? sortDirection : 'asc'}
                        onClick={() => handleSortRequest('symbol')}
                      >
                        Symbol
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={sortBy === 'name'}
                        direction={sortBy === 'name' ? sortDirection : 'asc'}
                        onClick={() => handleSortRequest('name')}
                      >
                        Company Name
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>Exchange</TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={sortBy === 'price'}
                        direction={sortBy === 'price' ? sortDirection : 'asc'}
                        onClick={() => handleSortRequest('price')}
                      >
                        Price (₹)
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={sortBy === 'changePercent'}
                        direction={sortBy === 'changePercent' ? sortDirection : 'asc'}
                        onClick={() => handleSortRequest('changePercent')}
                      >
                        Change (%)
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={sortBy === 'marketCap'}
                        direction={sortBy === 'marketCap' ? sortDirection : 'asc'}
                        onClick={() => handleSortRequest('marketCap')}
                      >
                        Market Cap
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={sortBy === 'pe'}
                        direction={sortBy === 'pe' ? sortDirection : 'asc'}
                        onClick={() => handleSortRequest('pe')}
                      >
                        P/E
                      </TableSortLabel>
                    </TableCell>
                    <TableCell>
                      <TableSortLabel
                        active={sortBy === 'dividend'}
                        direction={sortBy === 'dividend' ? sortDirection : 'asc'}
                        onClick={() => handleSortRequest('dividend')}
                      >
                        Dividend (%)
                      </TableSortLabel>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredData
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((stock) => (
                      <TableRow 
                        key={stock.id} 
                        hover 
                        onClick={() => navigate(`/stock/${stock.exchange}/${stock.symbol}`)}
                        sx={{ cursor: 'pointer' }}
                      >
                        <TableCell component="th" scope="row">
                          <Typography variant="body2" fontWeight="bold">
                            {stock.symbol}
                          </Typography>
                        </TableCell>
                        <TableCell>{stock.name}</TableCell>
                        <TableCell>
                          <Chip 
                            label={stock.exchange} 
                            size="small" 
                            color="primary" 
                            variant="outlined" 
                          />
                        </TableCell>
                        <TableCell>₹{stock.price.toLocaleString()}</TableCell>
                        <TableCell>
                          <Box 
                            display="flex" 
                            alignItems="center" 
                            color={stock.changePercent > 0 ? 'success.main' : 'error.main'}
                          >
                            {stock.changePercent > 0 ? 
                              <TrendingUp fontSize="small" sx={{ mr: 0.5 }} /> : 
                              <TrendingDown fontSize="small" sx={{ mr: 0.5 }} />
                            }
                            {stock.changePercent}%
                          </Box>
                        </TableCell>
                        <TableCell>{formatMarketCap(stock.marketCap)}</TableCell>
                        <TableCell>{stock.pe.toFixed(2)}</TableCell>
                        <TableCell>{stock.dividend}%</TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
            
            <TablePagination
              rowsPerPageOptions={[10, 25, 50]}
              component="div"
              count={filteredData.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </>
        )}
      </Paper>
      
      <Box mt={4}>
        <Typography variant="body2" color="textSecondary" align="center">
          Disclaimer: All data shown is for demonstration purposes only. Please do your own research before making any investment decisions.
        </Typography>
      </Box>
    </Container>
  );
};

export default StockScreenerPage; 