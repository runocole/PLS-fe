import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authAPI } from '../../services/api';

// Async thunks
export const login = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
    const response = await authAPI.login(credentials);
      return response.data;
    }
     catch (error) {
      return rejectWithValue(
        error.response?.data || { detail: 'Login failed. Please check your connection.' }
      );
    }
  }
);

export const register = createAsyncThunk(
  '/api/auth/register/',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await authAPI.register(userData);
      // Token is already stored in localStorage by the API service
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { detail: 'Registration failed. Please check your connection.' }
      );
    }
  }
);

export const logout = createAsyncThunk('/api/auth/logout', async () => {
  try {
    await authAPI.logout();
  } finally {
    localStorage.removeItem('tokens');
  }
});

export const getCurrentUser = createAsyncThunk(
  'auth/getCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authAPI.getCurrentUser();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to get user data');
    }
  }
);

const initialState = {
  user: JSON.parse(localStorage.getItem('user') || 'null'),
  tokens: localStorage.getItem('tokens'),
  isAuthenticated: !!localStorage.getItem('tokens'),
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    checkAuthState: (state) => {
      const tokens = localStorage.getItem('tokens');
      const user = localStorage.getItem('user');
      state.tokens = tokens;
      state.user = user ? JSON.parse(user) : null;
      state.isAuthenticated = !!tokens;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.tokens = action.payload.tokens; 
        localStorage.setItem('tokens', JSON.stringify(action.payload.tokens));
        localStorage.setItem('user', JSON.stringify(action.payload.user));
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Register
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.tokens = action.payload.tokens;
        localStorage.setItem('tokens', JSON.stringify(action.payload.tokens));

      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Logout
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.tokens = null;
        state.isAuthenticated = false;
      })
      // Get Current User
      .addCase(getCurrentUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(getCurrentUser.rejected, (state) => {
        state.loading = false;
        state.user = null;
        state.tokens = null;
        state.isAuthenticated = false;
      });
  },
});

export const { clearError, checkAuthState } = authSlice.actions;
export default authSlice.reducer;