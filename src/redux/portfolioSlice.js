import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// API Base URL
const API_BASE_URL = 'http://localhost:5000/api';

// Async thunk actions
export const fetchPortfolio = createAsyncThunk(
  'portfolio/fetchPortfolio',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/portfolio`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Error fetching portfolio data');
    }
  }
);

export const fetchPortfolioPerformance = createAsyncThunk(
  'portfolio/fetchPortfolioPerformance',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/portfolio/performance`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Error fetching portfolio performance');
    }
  }
);

export const addHolding = createAsyncThunk(
  'portfolio/addHolding',
  async (holdingData, { rejectWithValue }) => {
    try {
      // In a real app, this would be a POST request
      // For now, we just return the data and handle it in the reducer
      return {
        ...holdingData,
        id: Date.now(), // Generate a temporary ID
        currentPrice: holdingData.avgCost * (1 + Math.random() * 0.2 - 0.1),
        dayChange: (Math.random() * 4 - 2), // Random day change percentage between -2% and 2%
        dayChangePercent: (Math.random() * 4 - 2)
      };
    } catch (error) {
      return rejectWithValue(error.message || 'Error adding holding');
    }
  }
);

export const updateHolding = createAsyncThunk(
  'portfolio/updateHolding',
  async (holdingData, { rejectWithValue }) => {
    try {
      // In a real app, this would be a PUT request
      // For now, we just return the data and handle it in the reducer
      return holdingData;
    } catch (error) {
      return rejectWithValue(error.message || 'Error updating holding');
    }
  }
);

export const deleteHolding = createAsyncThunk(
  'portfolio/deleteHolding',
  async (holdingId, { rejectWithValue }) => {
    try {
      // In a real app, this would be a DELETE request
      // For now, we just return the ID and handle it in the reducer
      return holdingId;
    } catch (error) {
      return rejectWithValue(error.message || 'Error deleting holding');
    }
  }
);

// Initial state
const initialState = {
  portfolio: null,
  performance: null,
  loading: {
    portfolio: false,
    performance: false,
    addHolding: false,
    updateHolding: false,
    deleteHolding: false
  },
  error: {
    portfolio: null,
    performance: null,
    addHolding: null,
    updateHolding: null,
    deleteHolding: null
  }
};

// Slice
const portfolioSlice = createSlice({
  name: 'portfolio',
  initialState,
  reducers: {
    clearPortfolioErrors: (state) => {
      state.error = {
        ...state.error,
        addHolding: null,
        updateHolding: null,
        deleteHolding: null
      };
    }
  },
  extraReducers: (builder) => {
    // Fetch Portfolio
    builder
      .addCase(fetchPortfolio.pending, (state) => {
        state.loading.portfolio = true;
        state.error.portfolio = null;
      })
      .addCase(fetchPortfolio.fulfilled, (state, action) => {
        state.loading.portfolio = false;
        state.portfolio = action.payload;
      })
      .addCase(fetchPortfolio.rejected, (state, action) => {
        state.loading.portfolio = false;
        state.error.portfolio = action.payload;
      });
    
    // Fetch Portfolio Performance
    builder
      .addCase(fetchPortfolioPerformance.pending, (state) => {
        state.loading.performance = true;
        state.error.performance = null;
      })
      .addCase(fetchPortfolioPerformance.fulfilled, (state, action) => {
        state.loading.performance = false;
        state.performance = action.payload;
      })
      .addCase(fetchPortfolioPerformance.rejected, (state, action) => {
        state.loading.performance = false;
        state.error.performance = action.payload;
      });
    
    // Add Holding
    builder
      .addCase(addHolding.pending, (state) => {
        state.loading.addHolding = true;
        state.error.addHolding = null;
      })
      .addCase(addHolding.fulfilled, (state, action) => {
        state.loading.addHolding = false;
        
        if (state.portfolio) {
          // Calculate the current value
          const currentValue = action.payload.quantity * action.payload.currentPrice;
          const investedAmount = action.payload.quantity * action.payload.avgCost;
          
          // Add the new holding to the portfolio
          const newHolding = {
            ...action.payload,
            currentValue,
            investedAmount
          };
          
          state.portfolio.holdings = [...state.portfolio.holdings, newHolding];
          
          // Update portfolio summary
          const summary = state.portfolio.summary;
          summary.totalValue += currentValue;
          summary.totalInvestment += investedAmount;
          summary.overallGain = summary.totalValue - summary.totalInvestment;
          summary.overallGainPercent = (summary.overallGain / summary.totalInvestment) * 100;
        }
      })
      .addCase(addHolding.rejected, (state, action) => {
        state.loading.addHolding = false;
        state.error.addHolding = action.payload;
      });
    
    // Update Holding
    builder
      .addCase(updateHolding.pending, (state) => {
        state.loading.updateHolding = true;
        state.error.updateHolding = null;
      })
      .addCase(updateHolding.fulfilled, (state, action) => {
        state.loading.updateHolding = false;
        
        if (state.portfolio && state.portfolio.holdings) {
          // Find the holding to update
          const holdingIndex = state.portfolio.holdings.findIndex(h => h.id === action.payload.id);
          
          if (holdingIndex !== -1) {
            const oldHolding = state.portfolio.holdings[holdingIndex];
            const newInvestedAmount = action.payload.quantity * action.payload.avgCost;
            const newCurrentValue = action.payload.quantity * oldHolding.currentPrice;
            
            // Calculate differences for summary updates
            const investedDiff = newInvestedAmount - oldHolding.investedAmount;
            const valueDiff = newCurrentValue - oldHolding.currentValue;
            
            // Update the holding
            state.portfolio.holdings[holdingIndex] = {
              ...oldHolding,
              ...action.payload,
              currentValue: newCurrentValue,
              investedAmount: newInvestedAmount
            };
            
            // Update portfolio summary
            const summary = state.portfolio.summary;
            summary.totalValue += valueDiff;
            summary.totalInvestment += investedDiff;
            summary.overallGain = summary.totalValue - summary.totalInvestment;
            summary.overallGainPercent = (summary.overallGain / summary.totalInvestment) * 100;
          }
        }
      })
      .addCase(updateHolding.rejected, (state, action) => {
        state.loading.updateHolding = false;
        state.error.updateHolding = action.payload;
      });
    
    // Delete Holding
    builder
      .addCase(deleteHolding.pending, (state) => {
        state.loading.deleteHolding = true;
        state.error.deleteHolding = null;
      })
      .addCase(deleteHolding.fulfilled, (state, action) => {
        state.loading.deleteHolding = false;
        
        if (state.portfolio && state.portfolio.holdings) {
          // Find the holding to delete
          const holdingToDelete = state.portfolio.holdings.find(h => h.id === action.payload);
          
          if (holdingToDelete) {
            // Update portfolio summary
            const summary = state.portfolio.summary;
            summary.totalValue -= holdingToDelete.currentValue;
            summary.totalInvestment -= holdingToDelete.investedAmount;
            summary.overallGain = summary.totalValue - summary.totalInvestment;
            summary.overallGainPercent = (summary.totalInvestment === 0) ? 0 : 
              (summary.overallGain / summary.totalInvestment) * 100;
            
            // Remove the holding
            state.portfolio.holdings = state.portfolio.holdings.filter(h => h.id !== action.payload);
          }
        }
      })
      .addCase(deleteHolding.rejected, (state, action) => {
        state.loading.deleteHolding = false;
        state.error.deleteHolding = action.payload;
      });
  }
});

export const { clearPortfolioErrors } = portfolioSlice.actions;

export default portfolioSlice.reducer; 