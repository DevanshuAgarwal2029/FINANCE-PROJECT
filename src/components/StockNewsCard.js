import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Divider,
  Grid,
  Chip,
  CircularProgress,
  Alert,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Tabs,
  Tab,
  Paper
} from '@mui/material';
import {
  Error,
  TrendingUp,
  TrendingDown,
  OpenInNew,
  KeyboardArrowRight,
  CalendarToday,
  Business,
  TrendingFlat,
  Announcement,
  Assessment,
  BarChart,
  Public
} from '@mui/icons-material';

// Format date to readable format
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
};

// Get icon based on news sentiment
const getSentimentIcon = (sentiment) => {
  if (!sentiment) return <TrendingFlat color="action" fontSize="small" />;
  
  switch(sentiment.toLowerCase()) {
    case 'positive':
      return <TrendingUp color="success" fontSize="small" />;
    case 'negative':
      return <TrendingDown color="error" fontSize="small" />;
    default:
      return <TrendingFlat color="action" fontSize="small" />;
  }
};

// Get color based on news sentiment
const getSentimentColor = (sentiment) => {
  if (!sentiment) return 'default';
  
  switch(sentiment.toLowerCase()) {
    case 'positive':
      return 'success';
    case 'negative':
      return 'error';
    default:
      return 'default';
  }
};

// Get category icon based on news type
const getCategoryIcon = (category) => {
  if (!category) return <Announcement fontSize="small" />;
  
  switch(category.toLowerCase()) {
    case 'earnings':
      return <Assessment fontSize="small" />;
    case 'analyst':
      return <BarChart fontSize="small" />;
    case 'company':
      return <Business fontSize="small" />;
    case 'market':
      return <Public fontSize="small" />;
    default:
      return <Announcement fontSize="small" />;
  }
};

const NewsItem = ({ news }) => {
  const [expanded, setExpanded] = useState(false);
  
  // Truncate description if it's too long
  const truncateDescription = (text, maxLength = 150) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return `${text.substring(0, maxLength)}...`;
  };
  
  return (
    <Paper
      elevation={1}
      sx={{
        p: 2,
        mb: 2,
        borderLeft: 3,
        borderColor: getSentimentColor(news.sentiment) + '.main',
        transition: 'all 0.2s',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: 2
        }
      }}
    >
      <Box display="flex" alignItems="flex-start" mb={1}>
        <Box mr={1}>
          {getCategoryIcon(news.category)}
        </Box>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h6" component="div" gutterBottom>
            {news.title}
          </Typography>
          <Box display="flex" alignItems="center" mb={1}>
            <Chip 
              size="small"
              label={news.source}
              variant="outlined"
              sx={{ mr: 1 }}
            />
            <Box display="flex" alignItems="center" mr={1}>
              <CalendarToday fontSize="small" sx={{ fontSize: 14, mr: 0.5, opacity: 0.7 }} />
              <Typography variant="caption" color="text.secondary">
                {formatDate(news.date)}
              </Typography>
            </Box>
            {news.sentiment && (
              <Chip 
                size="small"
                label={news.sentiment}
                color={getSentimentColor(news.sentiment)}
                icon={getSentimentIcon(news.sentiment)}
                sx={{ mr: 1 }}
              />
            )}
            {news.category && (
              <Chip 
                size="small"
                label={news.category}
                variant="outlined"
              />
            )}
          </Box>
        </Box>
      </Box>
      
      <Typography 
        variant="body2" 
        color="text.secondary" 
        sx={{ mb: expanded ? 2 : 0 }}
      >
        {expanded ? news.description : truncateDescription(news.description)}
      </Typography>
      
      <Box 
        display="flex" 
        justifyContent="space-between" 
        alignItems="center"
        mt={1}
      >
        <Button 
          size="small" 
          onClick={() => setExpanded(!expanded)}
          color="primary"
        >
          {expanded ? 'Show Less' : 'Read More'}
        </Button>
        
        {news.url && (
          <IconButton 
            size="small"
            color="primary"
            component="a"
            href={news.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            <OpenInNew fontSize="small" />
          </IconButton>
        )}
      </Box>
    </Paper>
  );
};

const StockNewsCard = ({ news, loading, error }) => {
  const [tabValue, setTabValue] = useState(0);
  
  // Ensure news is always an array
  const safeNews = Array.isArray(news) ? news : [];
  
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  // Group news by category
  const getNewsByCategory = () => {
    if (!safeNews.length) return {};
    
    return safeNews.reduce((categories, item) => {
      const category = item.category || 'Other';
      if (!categories[category]) {
        categories[category] = [];
      }
      categories[category].push(item);
      return categories;
    }, {});
  };
  
  const newsByCategory = getNewsByCategory();
  const categories = Object.keys(newsByCategory);
  
  if (loading) {
    return (
      <Card>
        <CardContent>
          <Box display="flex" justifyContent="center" alignItems="center" py={4}>
            <CircularProgress />
          </Box>
        </CardContent>
      </Card>
    );
  }
  
  if (error) {
    return (
      <Card>
        <CardContent>
          <Alert severity="error" icon={<Error fontSize="inherit" />}>
            {error || "Error loading news data."}
          </Alert>
        </CardContent>
      </Card>
    );
  }
  
  if (!safeNews.length) {
    return (
      <Card>
        <CardContent>
          <Box textAlign="center" py={3}>
            <Typography variant="body1" color="text.secondary">
              No news available for this stock.
            </Typography>
          </Box>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <Box p={2} display="flex" flexDirection="column">
        <Typography variant="h5" component="div">
          News & Reports
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Latest news, analyst reports, and company announcements
        </Typography>
      </Box>
      
      <Divider />
      
      {categories.length > 1 && (
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange} 
            variant="scrollable"
            scrollButtons="auto"
            allowScrollButtonsMobile
          >
            <Tab label="All News" />
            {categories.map((category, index) => (
              <Tab key={index} label={category} />
            ))}
          </Tabs>
        </Box>
      )}
      
      <CardContent>
        <Box>
          {tabValue === 0 ? (
            // Show all news
            safeNews.map((item, index) => (
              <NewsItem key={index} news={item} />
            ))
          ) : (
            // Show news by selected category
            newsByCategory[categories[tabValue - 1]]?.map((item, index) => (
              <NewsItem key={index} news={item} />
            ))
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default StockNewsCard; 