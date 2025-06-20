import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  reports: [],
  currentReport: null,
  loading: false,
  error: null,
  autoSaveStatus: 'idle', // 'idle' | 'saving' | 'saved' | 'error'
};

// Auto-save thunk
export const autoSaveReport = createAsyncThunk(
  'scouting/autoSave',
  async (report, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const currentReport = state.scouting.currentReport;

      if (!currentReport?.id) {
        // Create new report
        const response = await axios.post('/api/reports/', report);
        return response.data;
      } else {
        // Update existing report
        const response = await axios.put(`/api/reports/${currentReport.id}/`, report);
        return response.data;
      }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Auto-save failed');
    }
  }
);

// Fetch reports thunk
export const fetchReports = createAsyncThunk(
  'scouting/fetchReports',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/api/reports/');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch reports');
    }
  }
);

// Fetch single report thunk
export const fetchReport = createAsyncThunk(
  'scouting/fetchReport',
  async (reportId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/reports/${reportId}/`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch report');
    }
  }
);

const scoutingSlice = createSlice({
  name: 'scouting',
  initialState,
  reducers: {
    setCurrentReport: (state, action) => {
      state.currentReport = action.payload;
    },
    updateReportField: (state, action) => {
      if (state.currentReport) {
        const { section, field, value } = action.payload;
        if (section in state.currentReport) {
          state.currentReport[section][field] = value;
        }
      }
    },
    addTag: (state, action) => {
      if (state.currentReport) {
        state.currentReport.tags.push(action.payload);
      }
    },
    removeTag: (state, action) => {
      if (state.currentReport) {
        state.currentReport.tags = state.currentReport.tags.filter(
          (tag) => tag !== action.payload
        );
      }
    },
    clearCurrentReport: (state) => {
      state.currentReport = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Auto-save
      .addCase(autoSaveReport.pending, (state) => {
        state.autoSaveStatus = 'saving';
      })
      .addCase(autoSaveReport.fulfilled, (state, action) => {
        state.autoSaveStatus = 'saved';
        state.currentReport = action.payload;
        // Update in reports list if exists
        const index = state.reports.findIndex((r) => r.id === action.payload.id);
        if (index !== -1) {
          state.reports[index] = action.payload;
        } else {
          state.reports.push(action.payload);
        }
      })
      .addCase(autoSaveReport.rejected, (state) => {
        state.autoSaveStatus = 'error';
      })
      // Fetch reports
      .addCase(fetchReports.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchReports.fulfilled, (state, action) => {
        state.loading = false;
        state.reports = action.payload;
      })
      .addCase(fetchReports.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch single report
      .addCase(fetchReport.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchReport.fulfilled, (state, action) => {
        state.loading = false;
        state.currentReport = action.payload;
      })
      .addCase(fetchReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  setCurrentReport,
  updateReportField,
  addTag,
  removeTag,
  clearCurrentReport,
} = scoutingSlice.actions;

export default scoutingSlice.reducer; 