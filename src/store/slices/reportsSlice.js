import { createSlice, createAsyncThunk,createAction } from '@reduxjs/toolkit';
import { reportsAPI } from '../../services/api';

export const setCurrentReport = createAction('reports/setCurrentReport');


export const fetchReports = createAsyncThunk(
  'reports/fetchReports',
  async (_, { rejectWithValue }) => {
    try {
      const response = await reportsAPI.getReports();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch reports');
    }
  }
);

export const fetchReport = createAsyncThunk(
  'reports/fetchReport',
  async (reportId, { rejectWithValue }) => {
    try {
      const response = await reportsAPI.getReport(reportId);
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        return null;
      }
      return rejectWithValue(error.response?.data || 'Failed to fetch report');
    }
  }
);

export const fetchTeamReports = createAsyncThunk(
  'reports/fetchTeamReports',
  async (teamId, { rejectWithValue }) => {
    try {
      const response = await reportsAPI.getTeamReports(teamId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch team reports');
    }
  }
);

export const fetchMyReport = createAsyncThunk(
  'reports/fetchMyReport',
  async (teamId, { rejectWithValue }) => {
    try {
      const response = await reportsAPI.getMyReport(teamId);
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        return null;
      }
      return rejectWithValue(error.response?.data || 'Failed to fetch your report');
    }
  }
);

export const createReport = createAsyncThunk(
  'reports/createReport',
  async (reportData, { rejectWithValue }) => {
    try {
      const response = await reportsAPI.createReport(reportData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to create report');
    }
  }
);

export const updateReport = createAsyncThunk(
  'reports/updateReport',
  async ({ reportId, reportData }, { rejectWithValue }) => {
    try {
      const response = await reportsAPI.updateReport(reportId, reportData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to update report');
    }
  }
);

export const deleteReport = createAsyncThunk(
  'reports/deleteReport',
  async (reportId, { rejectWithValue }) => {
    try {
      await reportsAPI.deleteReport(reportId);
      return reportId;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to delete report');
    }
  }
);

// Initial State

const initialState = {
  reports: [],
  currentReport: null,
  teamReports: [],
  loading: {
    reports: false,
    report: false,
    teamReports: false,
    myReport: false,
    create: false,
    update: false,
    delete: false,
  },
  error: {
    reports: null,
    report: null,
    teamReports: null,
    myReport: null,
    create: null,
    update: null,
    delete: null,
  },
};

// Slice

const reportsSlice = createSlice({
  name: 'reports',
  initialState,
  reducers: {
    clearReportError: (state) => { state.error.report = null; },
    clearCreateError: (state) => { state.error.create = null; },
    clearUpdateError: (state) => { state.error.update = null; },
    clearDeleteError: (state) => { state.error.delete = null; },
    clearCurrentReport: (state) => { state.currentReport = null; },
    clearTeamReports: (state) => { state.teamReports = []; },
    setCurrentReport: (state, action) => { state.currentReport = action.payload; },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Reports
      .addCase(fetchReports.pending, (state) => {
        state.loading.reports = true;
        state.error.reports = null;
      })
      .addCase(fetchReports.fulfilled, (state, action) => {
        state.loading.reports = false;
        state.reports = action.payload || [];
      })
      .addCase(fetchReports.rejected, (state, action) => {
        state.loading.reports = false;
        state.error.reports = action.payload;
        state.reports = [];
      })

      // Fetch Single Report
      .addCase(fetchReport.pending, (state) => {
        state.loading.report = true;
        state.error.report = null;
      })
      .addCase(fetchReport.fulfilled, (state, action) => {
        state.loading.report = false;
        state.currentReport = action.payload;
      })
      .addCase(fetchReport.rejected, (state, action) => {
        state.loading.report = false;
        state.error.report = action.payload;
        state.currentReport = null;
      })
      .addCase(setCurrentReport, (state, action) => {
            state.currentReport = action.payload;
      })

      // Fetch Team Reports (Coach)
      .addCase(fetchTeamReports.pending, (state) => {
        state.loading.teamReports = true;
        state.error.teamReports = null;
      })
      .addCase(fetchTeamReports.fulfilled, (state, action) => {
        state.loading.teamReports = false;
        state.teamReports = action.payload || [];
      })
      .addCase(fetchTeamReports.rejected, (state, action) => {
        state.loading.teamReports = false;
        state.error.teamReports = action.payload;
        state.teamReports = [];
      })

      // Fetch My Report (Analyst)
      .addCase(fetchMyReport.pending, (state) => {
        state.loading.myReport = true;
        state.error.myReport = null;
      })
      .addCase(fetchMyReport.fulfilled, (state, action) => {
        state.loading.myReport = false;
        state.currentReport = action.payload;
      })
      .addCase(fetchMyReport.rejected, (state, action) => {
        state.loading.myReport = false;
        state.error.myReport = action.payload;
        state.currentReport = null;
      })

      // Create Report
      .addCase(createReport.pending, (state) => {
        state.loading.create = true;
        state.error.create = null;
      })
      .addCase(createReport.fulfilled, (state, action) => {
        state.loading.create = false;
        if (action.payload) {
          state.reports.push(action.payload);
          state.currentReport = action.payload;
        }
      })
      .addCase(createReport.rejected, (state, action) => {
        state.loading.create = false;
        state.error.create = action.payload;
      })

      // Update Report
      .addCase(updateReport.pending, (state) => {
        state.loading.update = true;
        state.error.update = null;
      })
      .addCase(updateReport.fulfilled, (state, action) => {
        state.loading.update = false;
        if (action.payload) {
          const index = state.reports.findIndex(report => report.id === action.payload.id);
          if (index !== -1) {
            state.reports[index] = action.payload;
          }
          if (state.currentReport?.id === action.payload.id) {
            state.currentReport = action.payload;
          }
        }
      })
      .addCase(updateReport.rejected, (state, action) => {
        state.loading.update = false;
        state.error.update = action.payload;
      })

      // Delete Report
      .addCase(deleteReport.pending, (state) => {
        state.loading.delete = true;
        state.error.delete = null;
      })
      .addCase(deleteReport.fulfilled, (state, action) => {
        state.loading.delete = false;
        state.reports = state.reports.filter(report => report.id !== action.payload);
        if (state.currentReport?.id === action.payload) {
          state.currentReport = null;
        }
      })
      .addCase(deleteReport.rejected, (state, action) => {
        state.loading.delete = false;
        state.error.delete = action.payload;
      });
  },
});

export const {
  clearReportError,
  clearCreateError,
  clearUpdateError,
  clearDeleteError,
  clearCurrentReport,
  clearTeamReports,
} = reportsSlice.actions;

export default reportsSlice.reducer;
