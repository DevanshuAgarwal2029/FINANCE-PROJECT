import React from 'react';
import { 
  Card, 
  CardHeader, 
  CardContent, 
  Typography, 
  Box, 
  Grid, 
  Chip,
  Divider,
  LinearProgress,
  Alert,
  Skeleton
} from '@mui/material';
import { 
  ShowChart, 
  TrendingUp, 
  TrendingDown,
  TrendingFlat
} from '@mui/icons-material';

const TechnicalIndicatorsCard = ({ data, loading, error }) => {
  // Helper to determine color based on status
  const getStatusColor = (status) => {
    switch (status) {
      case 'BUY':
      case 'STRONG BUY':
        return 'success';
      case 'SELL':
      case 'STRONG SELL':
        return 'error';
      default:
        return 'warning';
    }
  };
  
  // Helper to determine icon based on status
  const getStatusIcon = (status) => {
    switch (status) {
      case 'BUY':
      case 'STRONG BUY':
        return <TrendingUp />;
      case 'SELL':
      case 'STRONG SELL':
        return <TrendingDown />;
      default:
        return <TrendingFlat />;
    }
  };
  
  // Mock data
  const mockData = {
    summary: {
      status: 'BUY',
      score: 7.5
    },
    movingAverages: {
      status: 'BUY',
      buy: 8,
      sell: 2,
      neutral: 2,
      simple: [
        { period: 5, value: 1580, status: 'BUY' },
        { period: 10, value: 1550, status: 'BUY' },
        { period: 20, value: 1525, status: 'BUY' },
        { period: 50, value: 1500, status: 'BUY' },
        { period: 100, value: 1450, status: 'BUY' },
        { period: 200, value: 1400, status: 'BUY' }
      ],
      exponential: [
        { period: 5, value: 1585, status: 'BUY' },
        { period: 10, value: 1565, status: 'BUY' },
        { period: 20, value: 1540, status: 'NEUTRAL' },
        { period: 50, value: 1510, status: 'NEUTRAL' },
        { period: 100, value: 1470, status: 'SELL' },
        { period: 200, value: 1420, status: 'SELL' }
      ]
    },
    oscillators: {
      status: 'NEUTRAL',
      buy: 3,
      sell: 2,
      neutral: 6,
      indicators: [
        { name: 'RSI(14)', value: 56.5, status: 'NEUTRAL' },
        { name: 'STOCH(9,6)', value: 42.3, status: 'NEUTRAL' },
        { name: 'STOCHRSI(14)', value: 80.5, status: 'OVERBOUGHT' },
        { name: 'MACD(12,26)', value: 15.2, status: 'BUY' },
        { name: 'ADX(14)', value: 30.5, status: 'BUY' },
        { name: 'Williams %R', value: -20.5, status: 'SELL' },
        { name: 'CCI(14)', value: 125.3, status: 'BUY' },
        { name: 'ATR(14)', value: 25.4, status: 'NEUTRAL' },
        { name: 'Highs/Lows(14)', value: 0.5, status: 'NEUTRAL' },
        { name: 'Ultimate Oscillator', value: 60.4, status: 'NEUTRAL' },
        { name: 'ROC', value: -15.2, status: 'SELL' }
      ]
    },
    pivotPoints: {
      classic: [
        { name: 'S3', value: 1430 },
        { name: 'S2', value: 1450 },
        { name: 'S1', value: 1470 },
        { name: 'P', value: 1490 },
        { name: 'R1', value: 1510 },
        { name: 'R2', value: 1530 },
        { name: 'R3', value: 1550 }
      ],
      fibonacci: [
        { name: 'S3', value: 1435 },
        { name: 'S2', value: 1455 },
        { name: 'S1', value: 1475 },
        { name: 'P', value: 1490 },
        { name: 'R1', value: 1505 },
        { name: 'R2', value: 1525 },
        { name: 'R3', value: 1545 }
      ],
      camarilla: [
        { name: 'S3', value: 1440 },
        { name: 'S2', value: 1460 },
        { name: 'S1', value: 1480 },
        { name: 'P', value: 1490 },
        { name: 'R1', value: 1500 },
        { name: 'R2', value: 1520 },
        { name: 'R3', value: 1540 }
      ],
      woodie: [
        { name: 'S3', value: 1445 },
        { name: 'S2', value: 1465 },
        { name: 'S1', value: 1485 },
        { name: 'P', value: 1495 },
        { name: 'R1', value: 1515 },
        { name: 'R2', value: 1535 },
        { name: 'R3', value: 1555 }
      ]
    }
  };
  
  const technicalData = data || mockData;
  
  if (loading) {
    return (
      <Card elevation={3}>
        <CardHeader 
          title={<Skeleton width="60%" />}
        />
        <CardContent>
          <Box mb={3}>
            <Skeleton variant="rectangular" height={100} />
          </Box>
          <Skeleton variant="rectangular" height={200} />
        </CardContent>
      </Card>
    );
  }
  
  if (error) {
    return (
      <Card elevation={3}>
        <CardHeader title="Technical Indicators" />
        <CardContent>
          <Alert severity="error">{error}</Alert>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card elevation={3}>
      <CardHeader 
        title="Technical Indicators" 
        subheader="Based on common technical analysis methods"
        avatar={<ShowChart color="primary" />}
      />
      <CardContent>
        {/* Summary */}
        <Box mb={3}>
          <Typography variant="h6" gutterBottom>
            Summary
          </Typography>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={4}>
              <Box textAlign="center">
                <Chip 
                  label={technicalData.summary.status}
                  color={getStatusColor(technicalData.summary.status)}
                  icon={getStatusIcon(technicalData.summary.status)}
                  sx={{ fontWeight: 'bold', py: 2, px: 1 }}
                />
              </Box>
            </Grid>
            <Grid item xs={12} sm={8}>
              <Typography variant="body2" gutterBottom>
                Technical Score: {technicalData.summary.score}/10
              </Typography>
              <LinearProgress 
                variant="determinate" 
                value={technicalData.summary.score * 10} 
                color={getStatusColor(technicalData.summary.status)}
                sx={{ height: 10, borderRadius: 5 }}
              />
            </Grid>
          </Grid>
        </Box>
        
        <Divider sx={{ my: 3 }} />
        
        {/* Moving Averages */}
        <Box mb={3}>
          <Typography variant="h6" gutterBottom>
            Moving Averages
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <Box display="flex" justifyContent="space-between" mb={1}>
                <Typography variant="body2">Buy:</Typography>
                <Typography variant="body2" color="success.main" fontWeight="bold">
                  {technicalData.movingAverages.buy}
                </Typography>
              </Box>
              <Box display="flex" justifyContent="space-between" mb={1}>
                <Typography variant="body2">Neutral:</Typography>
                <Typography variant="body2" color="warning.main" fontWeight="bold">
                  {technicalData.movingAverages.neutral}
                </Typography>
              </Box>
              <Box display="flex" justifyContent="space-between" mb={1}>
                <Typography variant="body2">Sell:</Typography>
                <Typography variant="body2" color="error.main" fontWeight="bold">
                  {technicalData.movingAverages.sell}
                </Typography>
              </Box>
              <Box mt={2}>
                <Chip 
                  label={technicalData.movingAverages.status}
                  color={getStatusColor(technicalData.movingAverages.status)}
                  size="small"
                  sx={{ fontWeight: 'bold' }}
                />
              </Box>
            </Grid>
            <Grid item xs={12} md={8}>
              <Typography variant="body2" fontWeight="bold" gutterBottom>
                Simple Moving Averages
              </Typography>
              <Grid container spacing={1}>
                {technicalData.movingAverages.simple.map((ma) => (
                  <Grid item xs={4} key={`sma-${ma.period}`}>
                    <Box 
                      p={1} 
                      bgcolor="background.paper" 
                      borderRadius={1}
                      border={1}
                      borderColor="divider"
                    >
                      <Typography variant="caption" display="block">
                        SMA({ma.period})
                      </Typography>
                      <Typography variant="body2" fontWeight="bold">
                        ₹{ma.value}
                      </Typography>
                      <Chip 
                        label={ma.status} 
                        size="small" 
                        color={getStatusColor(ma.status)}
                        sx={{ mt: 0.5, height: 20, fontSize: '0.7rem' }}
                      />
                    </Box>
                  </Grid>
                ))}
              </Grid>
              
              <Typography variant="body2" fontWeight="bold" gutterBottom mt={2}>
                Exponential Moving Averages
              </Typography>
              <Grid container spacing={1}>
                {technicalData.movingAverages.exponential.map((ma) => (
                  <Grid item xs={4} key={`ema-${ma.period}`}>
                    <Box 
                      p={1} 
                      bgcolor="background.paper" 
                      borderRadius={1}
                      border={1}
                      borderColor="divider"
                    >
                      <Typography variant="caption" display="block">
                        EMA({ma.period})
                      </Typography>
                      <Typography variant="body2" fontWeight="bold">
                        ₹{ma.value}
                      </Typography>
                      <Chip 
                        label={ma.status} 
                        size="small" 
                        color={getStatusColor(ma.status)}
                        sx={{ mt: 0.5, height: 20, fontSize: '0.7rem' }}
                      />
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>
        </Box>
        
        <Divider sx={{ my: 3 }} />
        
        {/* Oscillators */}
        <Box mb={3}>
          <Typography variant="h6" gutterBottom>
            Oscillators
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <Box display="flex" justifyContent="space-between" mb={1}>
                <Typography variant="body2">Buy:</Typography>
                <Typography variant="body2" color="success.main" fontWeight="bold">
                  {technicalData.oscillators.buy}
                </Typography>
              </Box>
              <Box display="flex" justifyContent="space-between" mb={1}>
                <Typography variant="body2">Neutral:</Typography>
                <Typography variant="body2" color="warning.main" fontWeight="bold">
                  {technicalData.oscillators.neutral}
                </Typography>
              </Box>
              <Box display="flex" justifyContent="space-between" mb={1}>
                <Typography variant="body2">Sell:</Typography>
                <Typography variant="body2" color="error.main" fontWeight="bold">
                  {technicalData.oscillators.sell}
                </Typography>
              </Box>
              <Box mt={2}>
                <Chip 
                  label={technicalData.oscillators.status}
                  color={getStatusColor(technicalData.oscillators.status)}
                  size="small"
                  sx={{ fontWeight: 'bold' }}
                />
              </Box>
            </Grid>
            <Grid item xs={12} md={8}>
              <Typography variant="body2" fontWeight="bold" gutterBottom>
                Technical Oscillators
              </Typography>
              <Grid container spacing={1}>
                {technicalData.oscillators.indicators.map((indicator) => (
                  <Grid item xs={6} key={indicator.name}>
                    <Box 
                      p={1} 
                      bgcolor="background.paper" 
                      borderRadius={1}
                      border={1}
                      borderColor="divider"
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Box>
                        <Typography variant="caption" display="block">
                          {indicator.name}
                        </Typography>
                        <Typography variant="body2" fontWeight="bold">
                          {indicator.value}
                        </Typography>
                      </Box>
                      <Chip 
                        label={indicator.status} 
                        size="small" 
                        color={getStatusColor(indicator.status)}
                        sx={{ height: 20, fontSize: '0.7rem' }}
                      />
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>
        </Box>
        
        <Divider sx={{ my: 3 }} />
        
        {/* Pivot Points */}
        <Box>
          <Typography variant="h6" gutterBottom>
            Pivot Points
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="body2" fontWeight="bold" gutterBottom>
                Classic
              </Typography>
              {technicalData.pivotPoints.classic.map((point) => (
                <Box 
                  key={`classic-${point.name}`}
                  display="flex" 
                  justifyContent="space-between"
                  py={0.5}
                  borderBottom={1}
                  borderColor="divider"
                >
                  <Typography variant="body2">{point.name}:</Typography>
                  <Typography 
                    variant="body2" 
                    fontWeight="bold"
                    color={point.name === 'P' ? 'primary.main' : (
                      point.name.startsWith('S') ? 'error.main' : 'success.main'
                    )}
                  >
                    ₹{point.value}
                  </Typography>
                </Box>
              ))}
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="body2" fontWeight="bold" gutterBottom>
                Fibonacci
              </Typography>
              {technicalData.pivotPoints.fibonacci.map((point) => (
                <Box 
                  key={`fibonacci-${point.name}`}
                  display="flex" 
                  justifyContent="space-between"
                  py={0.5}
                  borderBottom={1}
                  borderColor="divider"
                >
                  <Typography variant="body2">{point.name}:</Typography>
                  <Typography 
                    variant="body2" 
                    fontWeight="bold"
                    color={point.name === 'P' ? 'primary.main' : (
                      point.name.startsWith('S') ? 'error.main' : 'success.main'
                    )}
                  >
                    ₹{point.value}
                  </Typography>
                </Box>
              ))}
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="body2" fontWeight="bold" gutterBottom>
                Camarilla
              </Typography>
              {technicalData.pivotPoints.camarilla.map((point) => (
                <Box 
                  key={`camarilla-${point.name}`}
                  display="flex" 
                  justifyContent="space-between"
                  py={0.5}
                  borderBottom={1}
                  borderColor="divider"
                >
                  <Typography variant="body2">{point.name}:</Typography>
                  <Typography 
                    variant="body2" 
                    fontWeight="bold"
                    color={point.name === 'P' ? 'primary.main' : (
                      point.name.startsWith('S') ? 'error.main' : 'success.main'
                    )}
                  >
                    ₹{point.value}
                  </Typography>
                </Box>
              ))}
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="body2" fontWeight="bold" gutterBottom>
                Woodie
              </Typography>
              {technicalData.pivotPoints.woodie.map((point) => (
                <Box 
                  key={`woodie-${point.name}`}
                  display="flex" 
                  justifyContent="space-between"
                  py={0.5}
                  borderBottom={1}
                  borderColor="divider"
                >
                  <Typography variant="body2">{point.name}:</Typography>
                  <Typography 
                    variant="body2" 
                    fontWeight="bold"
                    color={point.name === 'P' ? 'primary.main' : (
                      point.name.startsWith('S') ? 'error.main' : 'success.main'
                    )}
                  >
                    ₹{point.value}
                  </Typography>
                </Box>
              ))}
            </Grid>
          </Grid>
        </Box>
        
        <Box mt={3}>
          <Typography variant="caption" color="text.secondary">
            * Technical indicators are based on historical price data. Past performance is not indicative of future results.
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default TechnicalIndicatorsCard; 