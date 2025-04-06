import React from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  Typography,
  Grid,
  Divider,
  Box,
  Chip,
  LinearProgress,
  Tooltip,
  CircularProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Tabs,
  Tab
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  Info,
  Error,
  CheckCircle,
  Warning,
  HelpOutline,
  Timeline,
  BarChart,
  PieChart,
  AccountBalance,
  Assessment
} from '@mui/icons-material';

const MetricItem = ({ label, value, tooltip, unit = '', good = null, neutralThreshold = 0 }) => {
  // Determine if value is "good" based on the good parameter
  let color = 'text.primary';
  let icon = null;
  
  if (good !== null && value !== null && value !== undefined && !isNaN(value)) {
    if (good === true) {
      color = 'success.main';
      icon = <CheckCircle color="success" fontSize="small" sx={{ ml: 1 }} />;
    } else if (good === false) {
      color = 'error.main';
      icon = <Warning color="error" fontSize="small" sx={{ ml: 1 }} />;
    } else if (typeof good === 'number') {
      // Compare with the good threshold
      if (value > good + neutralThreshold) {
        color = 'success.main';
        icon = <TrendingUp color="success" fontSize="small" sx={{ ml: 1 }} />;
      } else if (value < good - neutralThreshold) {
        color = 'error.main';
        icon = <TrendingDown color="error" fontSize="small" sx={{ ml: 1 }} />;
      }
    }
  }
  
  return (
    <Box sx={{ mb: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
        <Typography variant="body2" color="text.secondary">
          {label}
        </Typography>
        {tooltip && (
          <Tooltip title={tooltip} arrow placement="top">
            <HelpOutline fontSize="small" color="action" sx={{ ml: 0.5, width: 16, height: 16 }} />
          </Tooltip>
        )}
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography variant="body1" fontWeight={500} color={color}>
          {value !== null && value !== undefined 
            ? (typeof value === 'number' ? value.toLocaleString('en-IN') : value) + unit 
            : 'N/A'}
        </Typography>
        {icon}
      </Box>
    </Box>
  );
};

const RatingBar = ({ value, title, max = 100, color = 'primary' }) => {
  // Normalize value to be between 0 and 100
  const normalizedValue = Math.min(Math.max(0, (value / max) * 100), 100);
  
  return (
    <Box sx={{ width: '100%', mb: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
        <Typography variant="body2" color="text.secondary">
          {title}
        </Typography>
        <Typography variant="body2" fontWeight={500}>
          {value !== null && value !== undefined 
            ? (typeof value === 'number' ? value.toLocaleString('en-IN') : value)
            : 'N/A'} / {max}
        </Typography>
      </Box>
      <LinearProgress 
        variant="determinate" 
        value={normalizedValue} 
        color={color}
        sx={{ height: 8, borderRadius: 4 }}
      />
    </Box>
  );
};

// Format Indian number notation (lakhs, crores)
const formatIndianNumber = (value) => {
  if (value === undefined || value === null) return 'N/A';
  
  if (value >= 10000000) {
    return `₹${(value / 10000000).toFixed(2)} Cr`;
  } else if (value >= 100000) {
    return `₹${(value / 100000).toFixed(2)} L`;
  } else {
    return `₹${value.toLocaleString('en-IN')}`;
  }
};

// Format percentage
const formatPercent = (value) => {
  if (value === undefined || value === null) return 'N/A';
  return `${value.toFixed(2)}%`;
};

// Format ratio
const formatRatio = (value) => {
  if (value === undefined || value === null) return 'N/A';
  return value.toFixed(2);
};

// Get color based on value comparison (higher is better for positive metrics, lower is better for negative metrics)
const getValueColor = (value, metric, baseline) => {
  if (value === undefined || value === null) return 'inherit';
  
  // Metrics where higher is better
  const positiveMetrics = ['pe', 'pb', 'ps', 'debtToEquity'];
  
  // For positive metrics, lower is better
  if (positiveMetrics.includes(metric)) {
    return value < baseline ? 'success.main' : 'error.main';
  }
  
  // For other metrics, higher is better
  return value > baseline ? 'success.main' : 'error.main';
};

// Get icon based on trend
const getTrendIcon = (value, metric, baseline) => {
  if (value === undefined || value === null) return null;
  
  const positiveMetrics = ['pe', 'pb', 'ps', 'debtToEquity'];
  const isBetter = positiveMetrics.includes(metric) ? value < baseline : value > baseline;
  
  return isBetter ? 
    <TrendingUp fontSize="small" color="success" /> : 
    <TrendingDown fontSize="small" color="error" />;
};

// Tooltip content for metrics
const getMetricTooltip = (metric) => {
  const tooltips = {
    pe: "Price to Earnings Ratio - A company's share price relative to its earnings per share.",
    pb: "Price to Book Ratio - A company's share price relative to its book value per share.",
    ps: "Price to Sales Ratio - A company's share price relative to its revenue per share.",
    peg: "Price/Earnings to Growth Ratio - P/E ratio divided by earnings growth rate.",
    evToEbitda: "Enterprise Value to EBITDA - Indicates a company's valuation relative to its earnings before interest, taxes, depreciation, and amortization.",
    debtToEquity: "Debt to Equity Ratio - Total liabilities divided by shareholder equity.",
    currentRatio: "Current Ratio - Current assets divided by current liabilities.",
    quickRatio: "Quick Ratio - Liquid assets divided by current liabilities.",
    returnOnEquity: "Return on Equity (ROE) - Net income divided by shareholder equity.",
    returnOnAssets: "Return on Assets (ROA) - Net income divided by total assets.",
    returnOnInvestedCapital: "Return on Invested Capital (ROIC) - Net operating profit after tax divided by invested capital.",
    grossMargin: "Gross Margin - Gross profit divided by revenue.",
    operatingMargin: "Operating Margin - Operating income divided by revenue.",
    netMargin: "Net Margin - Net income divided by revenue.",
    ebitdaMargin: "EBITDA Margin - EBITDA divided by revenue.",
    dividend_yield: "Dividend Yield - Annual dividend per share divided by share price."
  };
  
  return tooltips[metric] || "Financial metric used to evaluate company performance.";
};

const FundamentalAnalysisCard = ({ fundamentals, loading, error }) => {
  const [tabValue, setTabValue] = React.useState(0);
  
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  // Format number to Indian notation
  const formatIndianNumber = (value) => {
    if (value === undefined || value === null) return 'N/A';
    
    if (value >= 10000000) {
      return `₹${(value / 10000000).toFixed(2)} Cr`;
    } else if (value >= 100000) {
      return `₹${(value / 100000).toFixed(2)} L`;
    } else {
      return `₹${value.toLocaleString('en-IN')}`;
    }
  };
  
  // Format percentage value
  const formatPercent = (value) => {
    if (value === undefined || value === null) return 'N/A';
    return `${value.toFixed(2)}%`;
  };
  
  // Get color based on value
  const getValueColor = (value, inverse = false) => {
    if (value === undefined || value === null) return 'text.secondary';
    if (inverse) {
      // For metrics where lower is better (P/E, Debt/Equity, etc.)
      return value > 0 ? (value > 30 ? 'error.main' : 'warning.main') : 'success.main';
    } else {
      // For metrics where higher is better (ROE, EPS, etc.)
      return value > 0 ? 'success.main' : value < 0 ? 'error.main' : 'text.secondary';
    }
  };
  
  // Get icon based on value
  const getValueIcon = (value, inverse = false) => {
    if (value === undefined || value === null) return null;
    
    if ((inverse && value < 0) || (!inverse && value > 0)) {
      return <TrendingUp fontSize="small" color="success" sx={{ ml: 0.5 }} />;
    } else if ((inverse && value > 0) || (!inverse && value < 0)) {
      return <TrendingDown fontSize="small" color="error" sx={{ ml: 0.5 }} />;
    }
    return null;
  };
  
  // Handle loading state
  if (loading) {
    return (
      <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" p={4} minHeight={300}>
        <CircularProgress size={60} thickness={4} />
        <Typography variant="body1" color="text.secondary" mt={2}>
          Loading fundamental data...
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
        Error loading fundamental data: {error}
      </Alert>
    );
  }
  
  // Handle no data case
  if (!fundamentals) {
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
        <Assessment sx={{ fontSize: 80, color: 'primary.light', mb: 2 }} />
        <Typography variant="h5" color="text.secondary" gutterBottom>
          Fundamental Analysis Not Available
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph sx={{ maxWidth: 500 }}>
          We're currently collecting fundamental data for this stock. Fundamental analysis will be available soon.
        </Typography>
      </Box>
    );
  }
  
  // Extract data
  const {
    valuation = {},
    financialHealth = {},
    profitability = {},
    growth = {},
    dividend = {},
    quarterlyResults = [],
    historicalData = [],
    analystRatings = {},
    risks = {}
  } = fundamentals;
  
  return (
    <Card>
      <CardHeader 
        title="Fundamental Analysis" 
        subheader="Key financial metrics and company fundamentals"
      />
      <Divider />
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange} 
          variant="scrollable"
          scrollButtons="auto"
          allowScrollButtonsMobile
        >
          <Tab icon={<BarChart fontSize="small" />} label="Valuation" iconPosition="start" />
          <Tab icon={<AccountBalance fontSize="small" />} label="Financial Health" iconPosition="start" />
          <Tab icon={<PieChart fontSize="small" />} label="Profitability" iconPosition="start" />
          <Tab icon={<TrendingUp fontSize="small" />} label="Growth" iconPosition="start" />
          <Tab icon={<Timeline fontSize="small" />} label="Historical" iconPosition="start" />
        </Tabs>
      </Box>
      
      <CardContent>
        {/* Valuation Metrics Tab */}
        {tabValue === 0 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Valuation Metrics
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TableContainer component={Paper} variant="outlined">
                  <Table size="small">
                    <TableHead>
                      <TableRow sx={{ backgroundColor: 'background.paper' }}>
                        <TableCell>Metric</TableCell>
                        <TableCell align="right">Value</TableCell>
                        <TableCell align="right">Industry Avg</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell>
                          <Box display="flex" alignItems="center">
                            <Typography variant="body2">P/E Ratio</Typography>
                            <Tooltip title={getMetricTooltip('pe')} arrow>
                              <Info fontSize="small" color="action" sx={{ ml: 0.5, opacity: 0.6 }} />
                            </Tooltip>
                          </Box>
                        </TableCell>
                        <TableCell align="right" sx={{ fontWeight: 'medium', color: getValueColor(valuation.pe, true) }}>
                          {valuation.pe ? valuation.pe.toFixed(2) : 'N/A'}
                          {getValueIcon(valuation.pe, true)}
                        </TableCell>
                        <TableCell align="right">20.00</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>
                          <Box display="flex" alignItems="center">
                            <Typography variant="body2">P/B Ratio</Typography>
                            <Tooltip title={getMetricTooltip('pb')} arrow>
                              <Info fontSize="small" color="action" sx={{ ml: 0.5, opacity: 0.6 }} />
                            </Tooltip>
                          </Box>
                        </TableCell>
                        <TableCell align="right" sx={{ fontWeight: 'medium', color: getValueColor(valuation.pb, true) }}>
                          {valuation.pb ? valuation.pb.toFixed(2) : 'N/A'}
                          {getValueIcon(valuation.pb, true)}
                        </TableCell>
                        <TableCell align="right">3.00</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>
                          <Box display="flex" alignItems="center">
                            <Typography variant="body2">P/S Ratio</Typography>
                            <Tooltip title={getMetricTooltip('ps')} arrow>
                              <Info fontSize="small" color="action" sx={{ ml: 0.5, opacity: 0.6 }} />
                            </Tooltip>
                          </Box>
                        </TableCell>
                        <TableCell align="right" sx={{ fontWeight: 'medium', color: getValueColor(valuation.ps, true) }}>
                          {valuation.ps ? valuation.ps.toFixed(2) : 'N/A'}
                          {getValueIcon(valuation.ps, true)}
                        </TableCell>
                        <TableCell align="right">2.00</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>
                          <Box display="flex" alignItems="center">
                            <Typography variant="body2">PEG Ratio</Typography>
                            <Tooltip title={getMetricTooltip('peg')} arrow>
                              <Info fontSize="small" color="action" sx={{ ml: 0.5, opacity: 0.6 }} />
                            </Tooltip>
                          </Box>
                        </TableCell>
                        <TableCell align="right" sx={{ fontWeight: 'medium' }}>
                          {valuation.peg ? valuation.peg.toFixed(2) : 'N/A'}
                        </TableCell>
                        <TableCell align="right">1.50</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>
                          <Box display="flex" alignItems="center">
                            <Typography variant="body2">EV/EBITDA</Typography>
                            <Tooltip title={getMetricTooltip('evToEbitda')} arrow>
                              <Info fontSize="small" color="action" sx={{ ml: 0.5, opacity: 0.6 }} />
                            </Tooltip>
                          </Box>
                        </TableCell>
                        <TableCell align="right" sx={{ fontWeight: 'medium' }}>
                          {valuation.evToEbitda ? valuation.evToEbitda.toFixed(2) : 'N/A'}
                        </TableCell>
                        <TableCell align="right">10.00</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Dividend Yield</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 'medium', color: getValueColor(dividend?.yield, true) }}>
                          {dividend?.yield ? formatPercent(dividend.yield) : 'N/A'}
                          {getValueIcon(dividend?.yield, true)}
                        </TableCell>
                        <TableCell align="right">2.00%</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Market Cap</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 'medium' }}>
                          {formatIndianNumber(valuation.marketCap)}
                        </TableCell>
                        <TableCell align="right">-</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Box mb={3}>
                  <Typography variant="subtitle1" gutterBottom>
                    Analyst Consensus
                  </Typography>
                  <Box display="flex" alignItems="center" mb={2}>
                    <Chip 
                      label={analystRatings.consensus || 'N/A'} 
                      color={
                        analystRatings.consensus === 'Buy' ? 'success' :
                        analystRatings.consensus === 'Sell' ? 'error' : 'warning'
                      }
                      sx={{ fontWeight: 'bold' }}
                    />
                    <Typography variant="body2" color="text.secondary" sx={{ ml: 2 }}>
                      Target Price: {analystRatings.targetPrice ? `₹${analystRatings.targetPrice.toLocaleString('en-IN')}` : 'N/A'}
                    </Typography>
                  </Box>
                  
                  <Grid container spacing={1}>
                    <Grid item xs={4}>
                      <Box p={1} textAlign="center" sx={{ bgcolor: 'success.light', borderRadius: 1 }}>
                        <Typography variant="h6" color="success.dark">{analystRatings.buy || 0}</Typography>
                        <Typography variant="body2">Buy</Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={4}>
                      <Box p={1} textAlign="center" sx={{ bgcolor: 'warning.light', borderRadius: 1 }}>
                        <Typography variant="h6" color="warning.dark">{analystRatings.hold || 0}</Typography>
                        <Typography variant="body2">Hold</Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={4}>
                      <Box p={1} textAlign="center" sx={{ bgcolor: 'error.light', borderRadius: 1 }}>
                        <Typography variant="h6" color="error.dark">{analystRatings.sell || 0}</Typography>
                        <Typography variant="body2">Sell</Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
                
                <Box>
                  <Typography variant="subtitle1" gutterBottom>
                    Risk Metrics
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={4}>
                      <Box p={1} textAlign="center" sx={{ bgcolor: 'background.paper', borderRadius: 1, border: '1px solid', borderColor: 'divider' }}>
                        <Typography variant="body2" color="text.secondary">Beta</Typography>
                        <Typography variant="h6" color={risks.beta && risks.beta > 1 ? 'error.main' : 'success.main'}>
                          {risks.beta ? risks.beta.toFixed(2) : 'N/A'}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={4}>
                      <Box p={1} textAlign="center" sx={{ bgcolor: 'background.paper', borderRadius: 1, border: '1px solid', borderColor: 'divider' }}>
                        <Typography variant="body2" color="text.secondary">Volatility</Typography>
                        <Typography variant="h6">
                          {risks.volatility ? `${risks.volatility.toFixed(1)}%` : 'N/A'}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={4}>
                      <Box p={1} textAlign="center" sx={{ bgcolor: 'background.paper', borderRadius: 1, border: '1px solid', borderColor: 'divider' }}>
                        <Typography variant="body2" color="text.secondary">R-Squared</Typography>
                        <Typography variant="h6">
                          {risks.rsquared ? risks.rsquared.toFixed(2) : 'N/A'}
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              </Grid>
            </Grid>
          </Box>
        )}
        
        {/* Financial Health Tab */}
        {tabValue === 1 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Financial Health
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TableContainer component={Paper} variant="outlined">
                  <Table size="small">
                    <TableHead>
                      <TableRow sx={{ backgroundColor: 'background.paper' }}>
                        <TableCell>Metric</TableCell>
                        <TableCell align="right">Value</TableCell>
                        <TableCell align="right">Industry Avg</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell>
                          <Box display="flex" alignItems="center">
                            <Typography variant="body2">Debt to Equity</Typography>
                            <Tooltip title={getMetricTooltip('debtToEquity')} arrow>
                              <Info fontSize="small" color="action" sx={{ ml: 0.5, opacity: 0.6 }} />
                            </Tooltip>
                          </Box>
                        </TableCell>
                        <TableCell align="right" sx={{ fontWeight: 'medium', color: getValueColor(financialHealth.debtToEquity, true) }}>
                          {financialHealth.debtToEquity ? financialHealth.debtToEquity.toFixed(2) : 'N/A'}
                          {getValueIcon(financialHealth.debtToEquity, true)}
                        </TableCell>
                        <TableCell align="right">1.00</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>
                          <Box display="flex" alignItems="center">
                            <Typography variant="body2">Current Ratio</Typography>
                            <Tooltip title={getMetricTooltip('currentRatio')} arrow>
                              <Info fontSize="small" color="action" sx={{ ml: 0.5, opacity: 0.6 }} />
                            </Tooltip>
                          </Box>
                        </TableCell>
                        <TableCell align="right" sx={{ fontWeight: 'medium', color: getValueColor(financialHealth.currentRatio, true) }}>
                          {financialHealth.currentRatio ? financialHealth.currentRatio.toFixed(2) : 'N/A'}
                          {getValueIcon(financialHealth.currentRatio, true)}
                        </TableCell>
                        <TableCell align="right">1.50</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>
                          <Box display="flex" alignItems="center">
                            <Typography variant="body2">Quick Ratio</Typography>
                            <Tooltip title={getMetricTooltip('quickRatio')} arrow>
                              <Info fontSize="small" color="action" sx={{ ml: 0.5, opacity: 0.6 }} />
                            </Tooltip>
                          </Box>
                        </TableCell>
                        <TableCell align="right" sx={{ fontWeight: 'medium', color: getValueColor(financialHealth.quickRatio, true) }}>
                          {financialHealth.quickRatio ? financialHealth.quickRatio.toFixed(2) : 'N/A'}
                          {getValueIcon(financialHealth.quickRatio, true)}
                        </TableCell>
                        <TableCell align="right">1.00</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Interest Coverage</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 'medium', color: getValueColor(financialHealth.interestCoverage, true) }}>
                          {financialHealth.interestCoverage ? financialHealth.interestCoverage.toFixed(2) : 'N/A'}
                          {getValueIcon(financialHealth.interestCoverage, true)}
                        </TableCell>
                        <TableCell align="right">2.00</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Total Debt</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 'medium' }}>
                          {formatIndianNumber(financialHealth.totalDebt)}
                        </TableCell>
                        <TableCell align="right">-</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Total Cash</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 'medium' }}>
                          {formatIndianNumber(financialHealth.totalCash)}
                        </TableCell>
                        <TableCell align="right">-</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" gutterBottom>
                  Cash Flow Metrics
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Box p={2} textAlign="center" sx={{ bgcolor: 'background.paper', borderRadius: 1, border: '1px solid', borderColor: 'divider' }}>
                      <Typography variant="body2" color="text.secondary">Operating Cash Flow</Typography>
                      <Typography variant="h6" color="text.primary">
                        {formatIndianNumber(financialHealth.operatingCashFlow)}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box p={2} textAlign="center" sx={{ bgcolor: 'background.paper', borderRadius: 1, border: '1px solid', borderColor: 'divider' }}>
                      <Typography variant="body2" color="text.secondary">Free Cash Flow</Typography>
                      <Typography variant="h6" color="text.primary">
                        {formatIndianNumber(financialHealth.freeCashFlow)}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Box>
        )}
        
        {/* Profitability Tab */}
        {tabValue === 2 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Profitability Metrics
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TableContainer component={Paper} variant="outlined">
                  <Table size="small">
                    <TableHead>
                      <TableRow sx={{ backgroundColor: 'background.paper' }}>
                        <TableCell>Metric</TableCell>
                        <TableCell align="right">Value</TableCell>
                        <TableCell align="right">Industry Avg</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell>
                          <Box display="flex" alignItems="center">
                            <Typography variant="body2">Gross Margin</Typography>
                            <Tooltip title={getMetricTooltip('grossMargin')} arrow>
                              <Info fontSize="small" color="action" sx={{ ml: 0.5, opacity: 0.6 }} />
                            </Tooltip>
                          </Box>
                        </TableCell>
                        <TableCell align="right" sx={{ fontWeight: 'medium', color: getValueColor(profitability.grossMargin, true) }}>
                          {profitability.grossMargin ? formatPercent(profitability.grossMargin) : 'N/A'}
                          {getValueIcon(profitability.grossMargin, true)}
                        </TableCell>
                        <TableCell align="right">30.00%</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>
                          <Box display="flex" alignItems="center">
                            <Typography variant="body2">Operating Margin</Typography>
                            <Tooltip title={getMetricTooltip('operatingMargin')} arrow>
                              <Info fontSize="small" color="action" sx={{ ml: 0.5, opacity: 0.6 }} />
                            </Tooltip>
                          </Box>
                        </TableCell>
                        <TableCell align="right" sx={{ fontWeight: 'medium', color: getValueColor(profitability.operatingMargin, true) }}>
                          {profitability.operatingMargin ? formatPercent(profitability.operatingMargin) : 'N/A'}
                          {getValueIcon(profitability.operatingMargin, true)}
                        </TableCell>
                        <TableCell align="right">15.00%</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>
                          <Box display="flex" alignItems="center">
                            <Typography variant="body2">Net Margin</Typography>
                            <Tooltip title={getMetricTooltip('netMargin')} arrow>
                              <Info fontSize="small" color="action" sx={{ ml: 0.5, opacity: 0.6 }} />
                            </Tooltip>
                          </Box>
                        </TableCell>
                        <TableCell align="right" sx={{ fontWeight: 'medium', color: getValueColor(profitability.netMargin, true) }}>
                          {profitability.netMargin ? formatPercent(profitability.netMargin) : 'N/A'}
                          {getValueIcon(profitability.netMargin, true)}
                        </TableCell>
                        <TableCell align="right">10.00%</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>EBITDA Margin</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 'medium', color: getValueColor(profitability.ebitdaMargin, true) }}>
                          {profitability.ebitdaMargin ? formatPercent(profitability.ebitdaMargin) : 'N/A'}
                          {getValueIcon(profitability.ebitdaMargin, true)}
                        </TableCell>
                        <TableCell align="right">20.00%</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TableContainer component={Paper} variant="outlined">
                  <Table size="small">
                    <TableHead>
                      <TableRow sx={{ backgroundColor: 'background.paper' }}>
                        <TableCell>Return Metrics</TableCell>
                        <TableCell align="right">Value</TableCell>
                        <TableCell align="right">Industry Avg</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell>
                          <Box display="flex" alignItems="center">
                            <Typography variant="body2">Return on Equity (ROE)</Typography>
                            <Tooltip title={getMetricTooltip('returnOnEquity')} arrow>
                              <Info fontSize="small" color="action" sx={{ ml: 0.5, opacity: 0.6 }} />
                            </Tooltip>
                          </Box>
                        </TableCell>
                        <TableCell align="right" sx={{ fontWeight: 'medium', color: getValueColor(profitability.returnOnEquity, true) }}>
                          {profitability.returnOnEquity ? formatPercent(profitability.returnOnEquity) : 'N/A'}
                          {getValueIcon(profitability.returnOnEquity, true)}
                        </TableCell>
                        <TableCell align="right">15.00%</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>
                          <Box display="flex" alignItems="center">
                            <Typography variant="body2">Return on Assets (ROA)</Typography>
                            <Tooltip title={getMetricTooltip('returnOnAssets')} arrow>
                              <Info fontSize="small" color="action" sx={{ ml: 0.5, opacity: 0.6 }} />
                            </Tooltip>
                          </Box>
                        </TableCell>
                        <TableCell align="right" sx={{ fontWeight: 'medium', color: getValueColor(profitability.returnOnAssets, true) }}>
                          {profitability.returnOnAssets ? formatPercent(profitability.returnOnAssets) : 'N/A'}
                          {getValueIcon(profitability.returnOnAssets, true)}
                        </TableCell>
                        <TableCell align="right">5.00%</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>
                          <Box display="flex" alignItems="center">
                            <Typography variant="body2">Return on Invested Capital</Typography>
                            <Tooltip title={getMetricTooltip('returnOnInvestedCapital')} arrow>
                              <Info fontSize="small" color="action" sx={{ ml: 0.5, opacity: 0.6 }} />
                            </Tooltip>
                          </Box>
                        </TableCell>
                        <TableCell align="right" sx={{ fontWeight: 'medium', color: getValueColor(profitability.returnOnInvestedCapital, true) }}>
                          {profitability.returnOnInvestedCapital ? formatPercent(profitability.returnOnInvestedCapital) : 'N/A'}
                          {getValueIcon(profitability.returnOnInvestedCapital, true)}
                        </TableCell>
                        <TableCell align="right">12.00%</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
            </Grid>
          </Box>
        )}
        
        {/* Growth Tab */}
        {tabValue === 3 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Growth Metrics
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TableContainer component={Paper} variant="outlined">
                  <Table size="small">
                    <TableHead>
                      <TableRow sx={{ backgroundColor: 'background.paper' }}>
                        <TableCell>Annual Growth</TableCell>
                        <TableCell align="right">Value</TableCell>
                        <TableCell align="right">Industry Avg</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell>Revenue Growth (YoY)</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 'medium', color: getValueColor(growth.revenueGrowth, true) }}>
                          {growth.revenueGrowth ? formatPercent(growth.revenueGrowth) : 'N/A'}
                          {getValueIcon(growth.revenueGrowth, true)}
                        </TableCell>
                        <TableCell align="right">10.00%</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Earnings Growth (YoY)</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 'medium', color: getValueColor(growth.earningsGrowth, true) }}>
                          {growth.earningsGrowth ? formatPercent(growth.earningsGrowth) : 'N/A'}
                          {getValueIcon(growth.earningsGrowth, true)}
                        </TableCell>
                        <TableCell align="right">12.00%</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Dividend Growth</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 'medium', color: getValueColor(growth.dividendGrowth, true) }}>
                          {growth.dividendGrowth ? formatPercent(growth.dividendGrowth) : 'N/A'}
                          {getValueIcon(growth.dividendGrowth, true)}
                        </TableCell>
                        <TableCell align="right">5.00%</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TableContainer component={Paper} variant="outlined">
                  <Table size="small">
                    <TableHead>
                      <TableRow sx={{ backgroundColor: 'background.paper' }}>
                        <TableCell>Long-term Growth</TableCell>
                        <TableCell align="right">Value</TableCell>
                        <TableCell align="right">Industry Avg</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell>5-Yr Revenue CAGR</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 'medium', color: getValueColor(growth['5YrRevenueCAGR'], true) }}>
                          {growth['5YrRevenueCAGR'] ? formatPercent(growth['5YrRevenueCAGR']) : 'N/A'}
                          {getValueIcon(growth['5YrRevenueCAGR'], true)}
                        </TableCell>
                        <TableCell align="right">8.00%</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>5-Yr EPS CAGR</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 'medium', color: getValueColor(growth['5YrEPSCAGR'], true) }}>
                          {growth['5YrEPSCAGR'] ? formatPercent(growth['5YrEPSCAGR']) : 'N/A'}
                          {getValueIcon(growth['5YrEPSCAGR'], true)}
                        </TableCell>
                        <TableCell align="right">10.00%</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Dividend Consistency</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 'medium' }}>
                          {dividend?.years || 'N/A'} years
                        </TableCell>
                        <TableCell align="right">10 years</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
            </Grid>
          </Box>
        )}
        
        {/* Historical Data Tab */}
        {tabValue === 4 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Quarterly Results
            </Typography>
            <TableContainer component={Paper} variant="outlined" sx={{ mb: 4 }}>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ backgroundColor: 'background.paper' }}>
                    <TableCell>Quarter</TableCell>
                    <TableCell align="right">Revenue (Cr)</TableCell>
                    <TableCell align="right">Profit (Cr)</TableCell>
                    <TableCell align="right">EPS (₹)</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {quarterlyResults && quarterlyResults.length > 0 ? (
                    quarterlyResults.map((quarter, index) => (
                      <TableRow key={index}>
                        <TableCell>{quarter.quarter}</TableCell>
                        <TableCell align="right">{formatIndianNumber(quarter.revenue).replace('₹', '')}</TableCell>
                        <TableCell align="right">{formatIndianNumber(quarter.profit).replace('₹', '')}</TableCell>
                        <TableCell align="right">{quarter.eps?.toFixed(2) || 'N/A'}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} align="center">No quarterly data available</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            
            <Typography variant="h6" gutterBottom>
              Annual Financial History
            </Typography>
            <TableContainer component={Paper} variant="outlined">
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ backgroundColor: 'background.paper' }}>
                    <TableCell>Year</TableCell>
                    <TableCell align="right">Revenue (Cr)</TableCell>
                    <TableCell align="right">Profit (Cr)</TableCell>
                    <TableCell align="right">EPS (₹)</TableCell>
                    <TableCell align="right">Dividend (₹)</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {historicalData && historicalData.length > 0 ? (
                    historicalData.map((year, index) => (
                      <TableRow key={index}>
                        <TableCell>{year.year}</TableCell>
                        <TableCell align="right">{formatIndianNumber(year.revenue).replace('₹', '')}</TableCell>
                        <TableCell align="right">{formatIndianNumber(year.profit).replace('₹', '')}</TableCell>
                        <TableCell align="right">{year.eps?.toFixed(2) || 'N/A'}</TableCell>
                        <TableCell align="right">{year.dividend?.toFixed(2) || 'N/A'}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} align="center">No historical data available</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default FundamentalAnalysisCard; 