import React from 'react';
import {
  Box,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Typography,
  Grid,
  Divider,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from '@mui/material';
import {
  ArrowUpward,
  ArrowDownward,
  ShowChart,
  TrendingUp,
  TrendingDown,
  TrendingFlat,
  Timeline,
} from '@mui/icons-material';

// Format currency values with $ sign and 2 decimal places
const formatCurrency = (value) => {
  return `$${parseFloat(value).toFixed(2)}`;
};

// Helper function to format Bollinger Bands data
const formatBollingerBands = (bollingerBands) => {
  if (!bollingerBands || typeof bollingerBands !== 'object') {
    return "N/A";
  }
  
  return (
    <Typography variant="body1">
      Upper: {bollingerBands.upper?.toFixed(2) || "N/A"}, 
      Middle: {bollingerBands.middle?.toFixed(2) || "N/A"}, 
      Lower: {bollingerBands.lower?.toFixed(2) || "N/A"}
      {bollingerBands.width ? `, Width: ${bollingerBands.width.toFixed(2)}` : ''}
    </Typography>
  );
};

// Helper function to format MACD data
const formatMacd = (macd) => {
  if (!macd || typeof macd !== 'object') {
    return "N/A";
  }
  
  return (
    <Typography variant="body1">
      Value: {macd.value?.toFixed(2) || "N/A"}, 
      Signal: {macd.signal?.toFixed(2) || "N/A"}, 
      Hist: {macd.histogram?.toFixed(2) || "N/A"}
      {macd.trend ? `, ${macd.trend}` : ''}
    </Typography>
  );
};

const TechnicalAnalysisCard = ({ technicalData, loading, error }) => {
  // Handle loading state
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
        <CircularProgress />
      </Box>
    );
  }

  // Handle error state
  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    );
  }

  // Handle if no data is available
  if (!technicalData) {
    return (
      <Alert severity="info" sx={{ mb: 2 }}>
        Technical analysis data is not available for this stock at the moment.
      </Alert>
    );
  }

  // Extract necessary data
  const {
    indicators = {},
    signals = {},
    summary = {},
    chartPatterns = [],
    support = [],
    resistance = []
  } = technicalData;

  // Display appropriate icon based on trend
  const getTrendIcon = (value) => {
    if (value === null || value === undefined || typeof value === 'object') {
      return null;
    }
    
    if (typeof value === 'string') {
      if (value.toLowerCase().includes('bullish') || value.toLowerCase().includes('buy')) {
        return <TrendingUp sx={{ color: 'success.main' }} />;
      } else if (value.toLowerCase().includes('bearish') || value.toLowerCase().includes('sell')) {
        return <TrendingDown sx={{ color: 'error.main' }} />;
      } else {
        return <TrendingFlat sx={{ color: 'text.secondary' }} />;
      }
    }
    
    // Handle numeric values
    if (value > 0) {
      return <TrendingUp sx={{ color: 'success.main' }} />;
    } else if (value < 0) {
      return <TrendingDown sx={{ color: 'error.main' }} />;
    } else {
      return <TrendingFlat sx={{ color: 'text.secondary' }} />;
    }
  };

  // Get color based on trend
  const getTrendColor = (value) => {
    if (value === null || value === undefined || typeof value === 'object') {
      return 'text.primary';
    }
    
    if (typeof value === 'string') {
      if (value.toLowerCase().includes('bullish') || value.toLowerCase().includes('buy')) {
        return 'success.main';
      } else if (value.toLowerCase().includes('bearish') || value.toLowerCase().includes('sell')) {
        return 'error.main';
      } else {
        return 'text.secondary';
      }
    }
    
    // Handle numeric values
    if (value > 0) {
      return 'success.main';
    } else if (value < 0) {
      return 'error.main';
    } else {
      return 'text.secondary';
    }
  };

  return (
    <Box>
      {/* Summary Card */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Technical Summary
          </Typography>
          <Typography variant="body1" paragraph>
            {summary.text || 'No summary available'}
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="subtitle2" color="text.secondary">
                    Overall Rating
                  </Typography>
                  <Box display="flex" alignItems="center" mt={1}>
                    {getTrendIcon(summary.rating)}
                    <Typography 
                      variant="h6" 
                      sx={{ ml: 1, color: getTrendColor(summary.rating) }}
                    >
                      {summary.rating || 'Neutral'}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="subtitle2" color="text.secondary">
                    Recommendation
                  </Typography>
                  <Typography variant="h6" sx={{ mt: 1 }}>
                    {summary.recommendation || 'Hold'}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Technical Indicators Card */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Technical Indicators
          </Typography>
          <Grid container spacing={3}>
            {/* Indicators */}
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" gutterBottom>
                Key Indicators
              </Typography>
              <List>
                {Object.entries(indicators).map(([key, value]) => (
                  <ListItem key={key} divider>
                    <ListItemText 
                      primary={key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())} 
                    />
                    <Box display="flex" alignItems="center">
                      {key === 'bollingerBands' ? (
                        formatBollingerBands(value)
                      ) : key === 'macd' ? (
                        formatMacd(value)
                      ) : key === 'rsi' && typeof value === 'object' ? (
                        <Typography variant="body1">
                          {value.value || "N/A"} ({value.interpretation || ""})
                        </Typography>
                      ) : key === 'volume' && typeof value === 'object' ? (
                        <Typography variant="body1">
                          {value.trend || "Stable"} ({value.change > 0 ? '+' : ''}{value.change?.toFixed(2) || "0"}%)
                        </Typography>
                      ) : key === 'movingAverages' && typeof value === 'object' ? (
                        <Typography variant="body1">
                          {value.overall || "Neutral"}
                        </Typography>
                      ) : key === 'supportResistance' || key === 'patterns' ? (
                        <Typography variant="body1">
                          {Array.isArray(value) ? value.length : (typeof value === 'object' ? 'View details' : value)}
                        </Typography>
                      ) : (
                        <>
                          {getTrendIcon(value)}
                          <Typography 
                            variant="body1" 
                            sx={{ ml: 1, color: getTrendColor(value) }}
                          >
                            {typeof value === 'number' ? value.toFixed(2) : value}
                          </Typography>
                        </>
                      )}
                    </Box>
                  </ListItem>
                ))}
              </List>
            </Grid>

            {/* Signals */}
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" gutterBottom>
                Trading Signals
              </Typography>
              <List>
                {Object.entries(signals).map(([key, value]) => (
                  <ListItem key={key} divider>
                    <ListItemText 
                      primary={key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())} 
                    />
                    <Chip 
                      label={value} 
                      color={
                        value.toLowerCase().includes('buy') ? 'success' : 
                        value.toLowerCase().includes('sell') ? 'error' : 
                        'default'
                      }
                      size="small"
                    />
                  </ListItem>
                ))}
              </List>
            </Grid>
          </Grid>

          {/* Chart Patterns */}
          {chartPatterns.length > 0 && (
            <>
              <Divider sx={{ my: 3 }} />
              <Typography variant="subtitle1" gutterBottom>
                Chart Patterns
              </Typography>
              <Grid container spacing={1}>
                {chartPatterns.map((pattern, index) => (
                  <Grid item key={index}>
                    <Chip 
                      icon={<Timeline />}
                      label={pattern}
                      sx={{ 
                        m: 0.5,
                        bgcolor: pattern.toLowerCase().includes('bullish') ? 'success.light' : 
                                pattern.toLowerCase().includes('bearish') ? 'error.light' : 'info.light'
                      }}
                    />
                  </Grid>
                ))}
              </Grid>
            </>
          )}
        </CardContent>
      </Card>

      {/* Support and Resistance Levels */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Support & Resistance Levels
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" gutterBottom>
                Support Levels
              </Typography>
              <List>
                {support.map((level, index) => (
                  <ListItem key={index}>
                    <ListItemIcon>
                      <TrendingDown color="info" />
                    </ListItemIcon>
                    <ListItemText 
                      primary={`₹${parseFloat(level).toLocaleString('en-IN', { maximumFractionDigits: 2 })}`}
                      secondary={`Level ${index + 1}`}
                    />
                  </ListItem>
                ))}
              </List>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" gutterBottom>
                Resistance Levels
              </Typography>
              <List>
                {resistance.map((level, index) => (
                  <ListItem key={index}>
                    <ListItemIcon>
                      <TrendingUp color="info" />
                    </ListItemIcon>
                    <ListItemText 
                      primary={`₹${parseFloat(level).toLocaleString('en-IN', { maximumFractionDigits: 2 })}`}
                      secondary={`Level ${index + 1}`}
                    />
                  </ListItem>
                ))}
              </List>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

export default TechnicalAnalysisCard; 