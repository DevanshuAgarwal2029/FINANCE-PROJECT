import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  theme: 'light',
  preferences: {
    showNotifications: true,
    autoRefresh: true,
    refreshInterval: 30000,
  },
  snackbar: {
    open: false,
    message: '',
    severity: 'info', // 'error', 'warning', 'info', 'success'
  }
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
    },
    setTheme: (state, action) => {
      state.theme = action.payload;
    },
    updatePreferences: (state, action) => {
      state.preferences = { ...state.preferences, ...action.payload };
    },
    showSnackbar: (state, action) => {
      state.snackbar = {
        open: true,
        message: action.payload.message,
        severity: action.payload.severity || 'info'
      };
    },
    hideSnackbar: (state) => {
      state.snackbar.open = false;
    }
  }
});

export const { toggleTheme, setTheme, updatePreferences, showSnackbar, hideSnackbar } = uiSlice.actions;

export default uiSlice.reducer; 