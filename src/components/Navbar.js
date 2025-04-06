import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  IconButton, 
  Box, 
  Drawer, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText, 
  Divider, 
  Menu, 
  MenuItem, 
  Badge,
  Avatar,
  Autocomplete,
  TextField,
  InputAdornment
} from '@mui/material';
import { 
  Menu as MenuIcon, 
  Search as SearchIcon, 
  Home, 
  TrendingUp, 
  ShowChart, 
  Notifications,
  AccountCircle,
  Favorite,
  BarChart,
  Dashboard
} from '@mui/icons-material';
import { searchStocks, setSearchQuery, addToSearchHistory } from '../redux/stockSlice';
import Logo from '../assets/finance-logo.png';

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Get search results from Redux store
  const { searchResults, searchQuery, watchlist } = useSelector((state) => state.stock);
  
  // Local state
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [searchInput, setSearchInput] = useState('');
  
  // Handle drawer toggle
  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setDrawerOpen(open);
  };
  
  // Handle profile menu
  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  
  // Handle logout
  const handleLogout = () => {
    handleMenuClose();
    
    // Clear user data from Redux store
    try {
      // Reset relevant states in Redux
      localStorage.clear(); 
      sessionStorage.clear();
      
      // Force-close the window using multiple methods
      // Method 1: Change location to blank
      window.location.href = "about:blank";
      
      // Method 2: Close current window
      window.open('', '_self').close();
      
      // Method 3: Close top window
      window.top.close();
      
      // Method 4: Close with opener
      if (window.opener) {
        window.close();
      }
      
      // Method 5: Close immediately with no confirmation
      setTimeout(() => {
        window.location.href = "data:text/html,<script>window.close();</script>";
      }, 100);
      
    } catch (error) {
      console.error("Logout failed:", error);
      // Fallback - redirect to home page
      window.location.href = '/';
    }
  };
  
  // Handle search
  const handleSearchChange = (event) => {
    const query = event.target.value;
    setSearchInput(query);
    
    if (query.length >= 2) {
      dispatch(setSearchQuery(query));
      dispatch(searchStocks({ query }));
    }
  };
  
  // Handle selecting a search result
  const handleSearchSelection = (event, value) => {
    if (!value) return;
    
    // If the user selects a stock
    if (typeof value === 'object' && value.symbol) {
      // Add to search history
      dispatch(addToSearchHistory(value));
      
      // Navigate directly to stock details page
      navigate(`/stock/${value.exchange || 'NSE'}/${value.symbol}`);
    } else if (typeof value === 'string' && value.trim() !== '') {
      // Search query entered as text
      dispatch(searchStocks(value));
      navigate(`/search?q=${encodeURIComponent(value)}`);
    }
    
    // Clear the search input
    setSearchInput('');
  };
  
  // Navigation handlers
  const navigateTo = (path) => {
    navigate(path);
    setDrawerOpen(false);
  };
  
  // Render drawer content
  const drawerContent = (
    <Box
      sx={{ width: 250 }}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <img src={Logo} alt="IndiStockPredictor Logo" style={{ height: 40 }} />
        <Typography variant="h6" sx={{ ml: 1 }}>
          IndiStockPredictor
        </Typography>
      </Box>
      <Divider />
      <List>
        <ListItem button onClick={() => navigateTo('/')}>
          <ListItemIcon>
            <Home />
          </ListItemIcon>
          <ListItemText primary="Home" />
        </ListItem>
        <ListItem button onClick={() => navigateTo('/market')}>
          <ListItemIcon>
            <TrendingUp />
          </ListItemIcon>
          <ListItemText primary="Market Overview" />
        </ListItem>
        <ListItem button onClick={() => navigateTo('/screener')}>
          <ListItemIcon>
            <BarChart />
          </ListItemIcon>
          <ListItemText primary="Stock Screener" />
        </ListItem>
        <ListItem button onClick={() => navigateTo('/portfolio')}>
          <ListItemIcon>
            <Dashboard />
          </ListItemIcon>
          <ListItemText primary="Portfolio" />
        </ListItem>
      </List>
      <Divider />
      <List>
        <ListItem button onClick={() => navigateTo('/watchlist')}>
          <ListItemIcon>
            <Badge badgeContent={watchlist.length} color="primary">
              <Favorite />
            </Badge>
          </ListItemIcon>
          <ListItemText primary="Watchlist" />
        </ListItem>
      </List>
    </Box>
  );
  
  // Render profile menu
  const profileMenu = (
    <Menu
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={handleMenuClose}
      keepMounted
    >
      <MenuItem onClick={() => { handleMenuClose(); navigateTo('/profile'); }}>Profile</MenuItem>
      <MenuItem onClick={() => { handleMenuClose(); navigateTo('/profile/edit'); }}>Edit Profile</MenuItem>
      <Divider />
      <MenuItem onClick={handleLogout}>Logout</MenuItem>
    </Menu>
  );
  
  return (
    <>
      <AppBar position="sticky" color="default" elevation={3} sx={{ bgcolor: 'background.paper' }}>
        <Toolbar>
          {/* Mobile menu icon */}
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={toggleDrawer(true)}
            sx={{ mr: 2, display: { sm: 'flex', md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          
          {/* Logo and title */}
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              cursor: 'pointer',
              mr: 2 
            }}
            onClick={() => navigateTo('/')}
          >
            <img 
              src={Logo} 
              alt="IndiStockPredictor Logo" 
              style={{ 
                height: 36, 
                width: 36, 
                marginRight: 12,
                objectFit: 'contain' 
              }} 
            />
            <Typography
              variant="h6"
              sx={{ 
                display: { xs: 'none', sm: 'block' },
                fontWeight: 700,
                letterSpacing: 0.5,
                color: 'primary.main'
              }}
            >
              IndiStockPredictor
            </Typography>
          </Box>
          
          {/* Navigation links - desktop */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, ml: 1 }}>
            <Button 
              color="inherit" 
              onClick={() => navigateTo('/')}
              sx={{ 
                mx: 0.5, 
                fontWeight: 500,
                '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.04)' } 
              }}
            >
              Home
            </Button>
            <Button 
              color="inherit" 
              onClick={() => navigateTo('/market')}
              sx={{ 
                mx: 0.5, 
                fontWeight: 500,
                '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.04)' } 
              }}
            >
              Market
            </Button>
            <Button 
              color="inherit" 
              onClick={() => navigateTo('/screener')}
              sx={{ 
                mx: 0.5, 
                fontWeight: 500,
                '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.04)' } 
              }}
            >
              Screener
            </Button>
            <Button 
              color="inherit" 
              onClick={() => navigateTo('/portfolio')}
              sx={{ 
                mx: 0.5, 
                fontWeight: 500,
                '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.04)' } 
              }}
            >
              Portfolio
            </Button>
          </Box>
          
          {/* Search bar */}
          <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center', mx: 2 }}>
            <Autocomplete
              freeSolo
              options={searchResults || []}
              getOptionLabel={(option) => 
                typeof option === 'string' ? option : `${option.symbol} - ${option.company_name}`
              }
              onChange={handleSearchSelection}
              sx={{ 
                width: { xs: '100%', sm: 400 },
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  bgcolor: 'rgba(0, 0, 0, 0.03)',
                  '&:hover': {
                    bgcolor: 'rgba(0, 0, 0, 0.05)'
                  }
                }
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  size="small"
                  placeholder="Search stocks..."
                  variant="outlined"
                  value={searchInput}
                  onChange={handleSearchChange}
                  InputProps={{
                    ...params.InputProps,
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon color="action" />
                      </InputAdornment>
                    )
                  }}
                />
              )}
            />
          </Box>
          
          {/* Right side icons */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton 
              color="inherit" 
              onClick={() => navigateTo('/watchlist')}
              sx={{ ml: 0.5 }}
            >
              <Badge badgeContent={watchlist.length} color="primary">
                <Favorite />
              </Badge>
            </IconButton>
            <IconButton 
              color="inherit"
              sx={{ ml: 0.5 }}
            >
              <Badge badgeContent={2} color="error">
                <Notifications />
              </Badge>
            </IconButton>
            <IconButton
              edge="end"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
              sx={{ ml: 0.5 }}
            >
              <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }} />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      
      {/* Mobile drawer */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={toggleDrawer(false)}
      >
        {drawerContent}
      </Drawer>
      
      {/* Profile menu */}
      {profileMenu}
    </>
  );
};

export default Navbar; 