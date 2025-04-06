import React, { useEffect, useState } from 'react';
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  Grid, 
  Divider,
  Chip,
  CircularProgress,
  useTheme,
  Paper,
  Alert,
  Button
} from '@mui/material';
import { 
  TrendingUp, 
  TrendingDown, 
  TrendingFlat,
  ArrowUpward,
  ArrowDownward,
  Error,
  Timeline
} from '@mui/icons-material';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { 
  LineChart, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  ResponsiveContainer,
  ReferenceLine,
  Area,
  ComposedChart
} from 'recharts';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const StockPredictionChart = ({ 
  historicalData, 
  prediction, 
  loading, 
  error 
}) => {
  const theme = useTheme();
  const [chartData, setChartData] = useState(null);
  const [rechartsData, setRechartsData] = useState([]);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(0);
  const [lastHistoricalDate, setLastHistoricalDate] = useState(null);
  const [hasPredictionData, setHasPredictionData] = useState(false);
  const [hasHistoricalData, setHasHistoricalData] = useState(false);

  // Colors
  const historicalColor = '#1976d2';
  const predictionColor = '#2e7d32';
  const predictionAreaColor = 'rgba(46, 125, 50, 0.1)';

  // Get trend icon based on prediction
  const getTrendIcon = () => {
    if (!prediction || !prediction.analysis) return <TrendingFlat />;

    const summary = prediction.analysis.summary || '';
    if (summary.includes('bullish') || summary.includes('positive') || summary.includes('uptrend')) {
      return <TrendingUp style={{ color: '#2e7d32' }} />;
    } else if (summary.includes('bearish') || summary.includes('negative') || summary.includes('downtrend')) {
      return <TrendingDown style={{ color: '#d32f2f' }} />;
    } else {
      return <TrendingFlat style={{ color: '#ed6c02' }} />;
    }
  };

  // Get recommendation chip based on prediction
  const getRecommendationChip = () => {
    if (!prediction || !prediction.analysis || !prediction.analysis.technicalFactors) return null;

    const movingAvg = prediction.analysis.technicalFactors.movingAverages;
    
    if (movingAvg === 'Bullish') {
      return (
        <Chip 
          icon={<ArrowUpward />} 
          label="Buy"
          color="success"
          variant="outlined"
        />
      );
    } else if (movingAvg === 'Bearish') {
      return (
        <Chip 
          icon={<ArrowDownward />} 
          label="Sell"
          color="error"
          variant="outlined"
        />
      );
    } else {
      return (
        <Chip 
          icon={<TrendingFlat />} 
          label="Hold"
          color="warning"
          variant="outlined"
        />
      );
    }
  };

  // Prepare chart data when historical and prediction data are available
  useEffect(() => {
    setHasHistoricalData(historicalData && historicalData.length > 0);
    setHasPredictionData(prediction && prediction.predictions && prediction.predictions.length > 0);
    
    if (historicalData && historicalData.length > 0 && prediction && prediction.predictions) {
      prepareChartData(historicalData, prediction);
    }
  }, [historicalData, prediction]);

  // Prepare chart data
  const prepareChartData = (historical, prediction) => {
    // Sort historical data by date
    const sortedHistorical = [...historical].sort((a, b) => 
      new Date(a.date) - new Date(b.date)
    );

    // Get the last 90 days of historical data if available
    const recentHistorical = sortedHistorical.slice(-90);
    
    // Set the last historical date for the reference line
    if (recentHistorical.length > 0) {
      setLastHistoricalDate(recentHistorical[recentHistorical.length - 1].date);
    }

    // Create Recharts compatible data structure
    const historicalDataPoints = recentHistorical.map(item => ({
      date: item.date,
      price: item.close || item.price,
      isHistorical: true
    }));

    // Add prediction data points
    const predictionDataPoints = prediction.predictions.map(item => ({
      date: item.date,
      price: item.predictedPrice,
      upper: item.upperBound,
      lower: item.lowerBound,
      isPrediction: true
    }));

    // Combine the data
    const combinedData = [...historicalDataPoints, ...predictionDataPoints];
    
    // Calculate min and max prices for y-axis scaling
    const allPrices = combinedData.flatMap(item => [
      item.price,
      item.upper || item.price,
      item.lower || item.price
    ]).filter(val => val !== undefined && val !== null);
    
    const min = Math.min(...allPrices);
    const max = Math.max(...allPrices);
    
    // Add 5% padding to min and max
    setMinPrice(min * 0.95);
    setMaxPrice(max * 1.05);
    
    setRechartsData(combinedData);
    
    // Also prepare Chart.js data format for potential use
    const labels = combinedData.map(item => item.date);
    
    const historicalPrices = combinedData.map(item => 
      item.isHistorical ? item.price : null
    );
    
    const predictionPrices = combinedData.map(item => 
      item.isPrediction ? item.price : null
    );

    // Create datasets for Chart.js
    const datasets = [
      {
        label: 'Historical',
        data: historicalPrices,
        borderColor: historicalColor,
        backgroundColor: historicalColor,
        pointRadius: 0,
        borderWidth: 2,
        tension: 0.1
      },
      {
        label: 'Prediction',
        data: predictionPrices,
        borderColor: predictionColor,
        backgroundColor: predictionColor,
        pointRadius: 0,
        borderWidth: 2,
        fill: true,
        backgroundColor: predictionAreaColor,
        tension: 0.1
      }
    ];

    setChartData({
      labels,
      datasets
    });
  };

  // Chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (context.parsed.y !== null) {
              label += ': ₹' + context.parsed.y.toLocaleString('en-IN');
            }
            return label;
          }
        }
      }
    },
    scales: {
      x: {
        ticks: {
          maxTicksLimit: 10
        },
        grid: {
          display: false
        }
      },
      y: {
        position: 'right',
        ticks: {
          callback: function(value) {
            return '₹' + value.toLocaleString('en-IN');
          }
        }
      }
    }
  };

  const formatPrice = (value) => `₹${value.toLocaleString('en-IN')}`;

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
  };

  // Handle loading state
  if (loading) {
    return (
      <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" p={4} minHeight={400}>
        <CircularProgress size={60} thickness={4} />
        <Typography variant="body1" color="text.secondary" mt={2}>
          Loading price prediction data...
        </Typography>
      </Box>
    );
  }
  
  // Handle error state
  if (error) {
    return (
      <Box p={4}>
        <Alert severity="error">
          Error loading prediction data: {error}
        </Alert>
      </Box>
    );
  }
  
  // Handle no data case
  if (!hasHistoricalData && !hasPredictionData) {
    return (
      <Box 
        display="flex" 
        flexDirection="column" 
        alignItems="center" 
        justifyContent="center" 
        p={6} 
        minHeight={400}
        textAlign="center"
      >
        <Timeline sx={{ fontSize: 80, color: 'primary.light', mb: 2 }} />
        <Typography variant="h5" color="text.secondary" gutterBottom>
          No prediction data available
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph sx={{ maxWidth: 500 }}>
          We're working on generating AI predictions for this stock. Please check back later for detailed price forecasts.
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          startIcon={<TrendingUp />}
          onClick={() => window.location.reload()}
        >
          Generate Prediction
        </Button>
      </Box>
    );
  }

  return (
    <Paper sx={{ p: 0 }}>
      <Box p={2} borderBottom={1} borderColor="divider">
        <Typography variant="h6" component="h3">
          Stock Price Chart with AI Prediction
        </Typography>
        
        {hasPredictionData && prediction && (
          <Box display="flex" flexDirection="column" mt={1}>
            <Box display="flex" alignItems="center" mb={1}>
              {getTrendIcon()}
              <Typography 
                variant="body2" 
                ml={1}
                fontWeight="medium"
              >
                {prediction.analysis && prediction.analysis.summary}
              </Typography>
            </Box>
            
            <Grid container spacing={2}>
              <Grid item>
                <Typography variant="caption" color="text.secondary">Model Accuracy:</Typography>
                <Typography variant="body2" fontWeight="bold">{prediction.modelAccuracy}%</Typography>
              </Grid>
              
              {prediction.analysis && prediction.analysis.technicalFactors && (
                <>
                  <Grid item>
                    <Typography variant="caption" color="text.secondary">RSI:</Typography>
                    <Typography variant="body2" fontWeight="bold">{prediction.analysis.technicalFactors.rsi}</Typography>
                  </Grid>
                  
                  <Grid item>
                    <Typography variant="caption" color="text.secondary">MACD:</Typography>
                    <Typography variant="body2" fontWeight="bold">{prediction.analysis.technicalFactors.macd}</Typography>
                  </Grid>
                </>
              )}
              
              <Grid item>
                {getRecommendationChip()}
              </Grid>
            </Grid>
          </Box>
        )}
      </Box>
      
      <Box sx={{ width: '100%', height: 400, p: 1 }}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={rechartsData}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 10,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" opacity={0.4} />
            <XAxis 
              dataKey="date" 
              scale="auto" 
              tick={{ fontSize: 12 }} 
              tickFormatter={formatDate}
              minTickGap={30}
            />
            <YAxis 
              domain={[minPrice, maxPrice]} 
              tick={{ fontSize: 12 }} 
              tickFormatter={formatPrice}
              width={80}
            />
            <Tooltip
              formatter={(value) => [`₹${value.toLocaleString('en-IN')}`, 'Price']}
              labelFormatter={(label) => {
                const date = new Date(label);
                return date.toLocaleDateString('en-IN', { 
                  year: 'numeric', 
                  month: 'short', 
                  day: 'numeric' 
                });
              }}
            />
            <Legend />
            
            {/* Historical data line */}
            <Line
              name="Historical Price"
              type="monotone"
              dataKey={(dataPoint) => dataPoint.isHistorical ? dataPoint.price : null}
              stroke="#1976d2"
              strokeWidth={2}
              dot={{ r: 1 }}
              activeDot={{ r: 5 }}
              connectNulls
            />
            
            {/* Prediction line and area */}
            {hasPredictionData && (
              <>
                <Line
                  name="Predicted Price"
                  type="monotone"
                  dataKey={(dataPoint) => dataPoint.isPrediction ? dataPoint.price : null}
                  stroke="#ff5722"
                  strokeWidth={2}
                  dot={{ r: 1 }}
                  activeDot={{ r: 5 }}
                  connectNulls
                />
                <Area
                  name="Prediction Range"
                  type="monotone"
                  dataKey={(dataPoint) => dataPoint.isPrediction ? dataPoint.upper : null}
                  stroke="transparent"
                  fill="#ff57221a"
                  activeDot={false}
                />
                <Area
                  type="monotone"
                  dataKey={(dataPoint) => dataPoint.isPrediction ? dataPoint.lower : null}
                  stroke="transparent"
                  fill="#ff57221a"
                  activeDot={false}
                />
                
                {/* Reference line at last historical date */}
                {lastHistoricalDate && (
                  <ReferenceLine
                    x={lastHistoricalDate}
                    stroke="#666"
                    strokeDasharray="3 3"
                    label={{ 
                      value: 'Today', 
                      position: 'top',
                      fill: '#666',
                      fontSize: 12
                    }}
                  />
                )}
              </>
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
};

export default StockPredictionChart; 