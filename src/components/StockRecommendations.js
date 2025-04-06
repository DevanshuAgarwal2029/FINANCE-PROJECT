import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchRecommendedStocks } from '../redux/stockSlice';
import { Box, Card, Typography, Grid, IconButton, Chip, Tooltip, CircularProgress, Link } from '@mui/material';
import { styled } from '@mui/material/styles';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import TrendingFlatIcon from '@mui/icons-material/TrendingFlat';
import InfoIcon from '@mui/icons-material/Info';
import { useNavigate } from 'react-router-dom';

const StyledCard = styled(Card)(({ theme }) => ({
  padding: theme.spacing(2),
  transition: 'transform 0.3s, box-shadow 0.3s',
  cursor: 'pointer',
  height: '100%',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: theme.shadows[10],
  },
}));

const RecommendationChip = styled(Chip)(({ theme, recommendation }) => {
  let color;
  switch (recommendation) {
    case 'Strong Buy':
      color = theme.palette.success.dark;
      break;
    case 'Buy':
      color = theme.palette.success.main;
      break;
    case 'Hold':
      color = theme.palette.warning.main;
      break;
    case 'Sell':
    case 'Strong Sell':
      color = theme.palette.error.main;
      break;
    default:
      color = theme.palette.info.main;
  }
  
  return {
    backgroundColor: color,
    color: theme.palette.common.white,
    fontWeight: 'bold',
  };
});

const AnalysisTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .MuiTooltip-tooltip`]: {
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.text.primary,
    maxWidth: 300,
    border: `1px solid ${theme.palette.divider}`,
    boxShadow: theme.shadows[4],
    padding: theme.spacing(2),
  },
}));

const StockRecommendations = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { recommendedStocks, loading, error } = useSelector((state) => state.stock);
  
  useEffect(() => {
    dispatch(fetchRecommendedStocks());
  }, [dispatch]);
  
  const handleStockClick = (symbol) => {
    navigate(`/stock/${symbol}`);
  };
  
  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'up':
        return <TrendingUpIcon style={{ color: '#4caf50' }} />;
      case 'down':
        return <TrendingDownIcon style={{ color: '#f44336' }} />;
      default:
        return <TrendingFlatIcon style={{ color: '#ff9800' }} />;
    }
  };
  
  const formatPercentage = (value) => {
    return value > 0 ? `+${value}%` : `${value}%`;
  };
  
  const getAnalysisTooltipContent = (analysis) => (
    <Box>
      <Typography variant="subtitle2" gutterBottom>AI Analysis</Typography>
      
      <Box mb={1}>
        <Typography variant="body2" fontWeight="bold">Short Term ({analysis.shortTerm.timeframe})</Typography>
        <Box display="flex" alignItems="center">
          {getTrendIcon(analysis.shortTerm.trend)}
          <Typography variant="body2" ml={1}>{analysis.shortTerm.prediction}</Typography>
        </Box>
        <Typography variant="caption">Confidence: {analysis.shortTerm.confidence}%</Typography>
      </Box>
      
      <Box mb={1}>
        <Typography variant="body2" fontWeight="bold">Long Term ({analysis.longTerm.timeframe})</Typography>
        <Box display="flex" alignItems="center">
          {getTrendIcon(analysis.longTerm.trend)}
          <Typography variant="body2" ml={1}>{analysis.longTerm.prediction}</Typography>
        </Box>
        <Typography variant="caption">Confidence: {analysis.longTerm.confidence}%</Typography>
      </Box>
      
      <Box>
        <Typography variant="body2" fontWeight="bold">Risk: {analysis.riskAssessment.level}</Typography>
        <Typography variant="caption" component="div">Factors:</Typography>
        <ul style={{ margin: 0, paddingLeft: 16 }}>
          {analysis.riskAssessment.factors.map((factor, i) => (
            <li key={i}><Typography variant="caption">{factor}</Typography></li>
          ))}
        </ul>
      </Box>
    </Box>
  );
  
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }
  
  if (error) {
    return (
      <Box>
        <Typography variant="h6" color="error" align="center">
          Error loading recommendations: {error}
        </Typography>
      </Box>
    );
  }
  
  if (!recommendedStocks || recommendedStocks.length === 0) {
    return (
      <Box>
        <Typography variant="h6" align="center">
          No stock recommendations available at the moment.
        </Typography>
      </Box>
    );
  }
  
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        AI-Powered Stock Recommendations
      </Typography>
      <Grid container spacing={2}>
        {recommendedStocks.map((stock) => (
          <Grid item xs={12} sm={6} md={4} key={stock.symbol}>
            <StyledCard onClick={() => handleStockClick(stock.symbol)}>
              <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
                <Box>
                  <Typography variant="h6" component="div">
                    {stock.symbol}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {stock.name}
                  </Typography>
                </Box>
                <Box display="flex" alignItems="flex-start">
                  <RecommendationChip 
                    label={stock.recommendationRating} 
                    size="small" 
                    recommendation={stock.recommendationRating}
                  />
                  <AnalysisTooltip 
                    title={getAnalysisTooltipContent(stock.aiAnalysis)}
                    placement="top"
                  >
                    <IconButton size="small" style={{ marginLeft: 4 }}>
                      <InfoIcon fontSize="small" />
                    </IconButton>
                  </AnalysisTooltip>
                </Box>
              </Box>
              
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                <Typography variant="h6" component="div">
                  ₹{stock.price.toLocaleString()}
                </Typography>
                <Typography 
                  variant="body2" 
                  style={{ 
                    color: stock.changePercent >= 0 ? '#4caf50' : '#f44336',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  {stock.changePercent >= 0 ? <TrendingUpIcon fontSize="small" /> : <TrendingDownIcon fontSize="small" />}
                  {formatPercentage(stock.changePercent)}
                </Typography>
              </Box>
              
              <Box>
                <Typography variant="body2" mb={1}>
                  {stock.recommendationReason}
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  Prediction Accuracy: {stock.predictionAccuracy}%
                </Typography>
              </Box>
            </StyledCard>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default StockRecommendations; 