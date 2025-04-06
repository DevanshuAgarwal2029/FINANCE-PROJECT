import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from 'redux';

// Import slices
import stockReducer from './stockSlice';
import portfolioReducer from './portfolioSlice';
import uiReducer from './uiSlice';
import marketReducer from './marketSlice';

// Configure persist for each reducer
const stockPersistConfig = {
  key: 'stock',
  storage,
  whitelist: ['watchlist', 'searchHistory']
};

const portfolioPersistConfig = {
  key: 'portfolio',
  storage,
  whitelist: ['holdings', 'transactions']
};

const uiPersistConfig = {
  key: 'ui',
  storage,
  whitelist: ['theme', 'preferences']
};

const marketPersistConfig = {
  key: 'market',
  storage,
  whitelist: []
};

// Combine reducers
const rootReducer = combineReducers({
  stock: persistReducer(stockPersistConfig, stockReducer),
  portfolio: persistReducer(portfolioPersistConfig, portfolioReducer),
  ui: persistReducer(uiPersistConfig, uiReducer),
  market: persistReducer(marketPersistConfig, marketReducer)
});

// Create store
export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false
    })
});

// Create persistor
export const persistor = persistStore(store);

export default store; 