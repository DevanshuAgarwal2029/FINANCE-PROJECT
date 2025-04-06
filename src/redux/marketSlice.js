import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// API base URL
const API_BASE_URL = 'http://localhost:5000/api';

// Async thunk actions
export const fetchMarketOverview = createAsyncThunk(
  'market/fetchMarketOverview',
  async (_, { rejectWithValue }) => {
    try {
      console.log('Fetching market overview from:', `${API_BASE_URL}/market/overview`);
      const response = await axios.get(`${API_BASE_URL}/market/overview`);
      console.log('Market overview response:', response.data);
      
      // Transform the data to ensure it matches what the frontend components expect
      const transformedData = {
        // Extract data from the nested structure or provide defaults
        advances: response.data?.breadth?.overall?.advances || 0,
        declines: response.data?.breadth?.overall?.declines || 0,
        unchanged: response.data?.breadth?.overall?.unchanged || 0,
        volume: response.data?.breadth?.volume?.totalVolume || 0,
        volumeChange: response.data?.breadth?.volume?.volumeGrowth || 0,
        // Handle sentiment correctly - if it's an object extract overall, otherwise use as is
        sentiment: typeof response.data?.sentiment === 'object' ? response.data?.sentiment?.overall || 'Neutral' : response.data?.sentiment || 'Neutral',
        // Keep the full sentiment object for detailed views
        sentimentDetails: response.data?.sentiment || {},
        marketComment: response.data?.summary || '',
        // Include all the original data too
        ...response.data
      };
      
      return transformedData;
    } catch (error) {
      console.error('Error fetching market overview:', error);
      return rejectWithValue(error.response?.data?.error || 'Error fetching market overview');
    }
  }
);

export const fetchMarketIndices = createAsyncThunk(
  'market/fetchMarketIndices',
  async (_, { rejectWithValue }) => {
    try {
      console.log('Fetching market indices from:', `${API_BASE_URL}/market/indices`);
      const response = await axios.get(`${API_BASE_URL}/market/indices`);
      console.log('Market indices response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching market indices:', error);
      return rejectWithValue(error.response?.data?.error || 'Error fetching market indices');
    }
  }
);

export const fetchTopMovers = createAsyncThunk(
  'market/fetchTopMovers',
  async (_, { rejectWithValue, dispatch }) => {
    try {
      console.log('Fetching top movers');
      // We'll fetch both top gainers and losers, since they're typically needed together
      await dispatch(fetchTopGainers());
      await dispatch(fetchTopLosers());
      return true;
    } catch (error) {
      console.error('Error fetching top movers:', error);
      return rejectWithValue(error.response?.data?.error || 'Error fetching top movers');
    }
  }
);

export const fetchTopGainers = createAsyncThunk(
  'market/fetchTopGainers',
  async ({ limit = 5 } = {}, { rejectWithValue }) => {
    try {
      console.log('Fetching top gainers from:', `${API_BASE_URL}/market/top-gainers?limit=${limit}`);
      const response = await axios.get(`${API_BASE_URL}/market/top-gainers?limit=${limit}`);
      console.log('Top gainers response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching top gainers:', error);
      return rejectWithValue(error.response?.data?.error || 'Error fetching top gainers');
    }
  }
);

export const fetchTopLosers = createAsyncThunk(
  'market/fetchTopLosers',
  async ({ limit = 5 } = {}, { rejectWithValue }) => {
    try {
      console.log('Fetching top losers from:', `${API_BASE_URL}/market/top-losers?limit=${limit}`);
      const response = await axios.get(`${API_BASE_URL}/market/top-losers?limit=${limit}`);
      console.log('Top losers response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching top losers:', error);
      return rejectWithValue(error.response?.data?.error || 'Error fetching top losers');
    }
  }
);

export const fetchSectorPerformance = createAsyncThunk(
  'market/fetchSectorPerformance',
  async (_, { rejectWithValue }) => {
    try {
      console.log('Fetching sector performance from:', `${API_BASE_URL}/market/sector-performance`);
      const response = await axios.get(`${API_BASE_URL}/market/sector-performance`);
      console.log('Sector performance response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching sector performance:', error);
      return rejectWithValue(error.response?.data?.error || 'Error fetching sector performance');
    }
  }
);

// Initial state
const initialState = {
  overview: null,
  indices: [],
  topGainers: [],
  topLosers: [],
  sectorPerformance: [],
  loading: {
    overview: false,
    indices: false,
    topGainers: false,
    topLosers: false,
    movers: false,
    sectorPerformance: false
  },
  error: {
    overview: null,
    indices: null,
    topGainers: null,
    topLosers: null,
    movers: null,
    sectorPerformance: null
  }
};

// Slice
const marketSlice = createSlice({
  name: 'market',
  initialState,
  reducers: {
    clearMarketData: (state) => {
      state.overview = null;
      state.indices = [];
      state.topGainers = [];
      state.topLosers = [];
      state.sectorPerformance = [];
    }
  },
  extraReducers: (builder) => {
    // Market Overview
    builder
      .addCase(fetchMarketOverview.pending, (state) => {
        state.loading.overview = true;
        state.error.overview = null;
      })
      .addCase(fetchMarketOverview.fulfilled, (state, action) => {
        state.loading.overview = false;
        state.overview = action.payload;
      })
      .addCase(fetchMarketOverview.rejected, (state, action) => {
        state.loading.overview = false;
        state.error.overview = action.payload;
      });
    
    // Market Indices
    builder
      .addCase(fetchMarketIndices.pending, (state) => {
        state.loading.indices = true;
        state.error.indices = null;
      })
      .addCase(fetchMarketIndices.fulfilled, (state, action) => {
        state.loading.indices = false;
        state.indices = action.payload;
      })
      .addCase(fetchMarketIndices.rejected, (state, action) => {
        state.loading.indices = false;
        state.error.indices = action.payload;
      });
    
    // Top Movers
    builder
      .addCase(fetchTopMovers.pending, (state) => {
        state.loading.movers = true;
        state.error.movers = null;
      })
      .addCase(fetchTopMovers.fulfilled, (state) => {
        state.loading.movers = false;
      })
      .addCase(fetchTopMovers.rejected, (state, action) => {
        state.loading.movers = false;
        state.error.movers = action.payload;
      });
    
    // Top Gainers
    builder
      .addCase(fetchTopGainers.pending, (state) => {
        state.loading.topGainers = true;
        state.error.topGainers = null;
      })
      .addCase(fetchTopGainers.fulfilled, (state, action) => {
        state.loading.topGainers = false;
        state.topGainers = action.payload;
      })
      .addCase(fetchTopGainers.rejected, (state, action) => {
        state.loading.topGainers = false;
        state.error.topGainers = action.payload;
      });
    
    // Top Losers
    builder
      .addCase(fetchTopLosers.pending, (state) => {
        state.loading.topLosers = true;
        state.error.topLosers = null;
      })
      .addCase(fetchTopLosers.fulfilled, (state, action) => {
        state.loading.topLosers = false;
        state.topLosers = action.payload;
      })
      .addCase(fetchTopLosers.rejected, (state, action) => {
        state.loading.topLosers = false;
        state.error.topLosers = action.payload;
      });
    
    // Sector Performance
    builder
      .addCase(fetchSectorPerformance.pending, (state) => {
        state.loading.sectorPerformance = true;
        state.error.sectorPerformance = null;
      })
      .addCase(fetchSectorPerformance.fulfilled, (state, action) => {
        state.loading.sectorPerformance = false;
        state.sectorPerformance = action.payload;
      })
      .addCase(fetchSectorPerformance.rejected, (state, action) => {
        state.loading.sectorPerformance = false;
        state.error.sectorPerformance = action.payload;
      });
  }
});

export const { clearMarketData } = marketSlice.actions;

export default marketSlice.reducer; 