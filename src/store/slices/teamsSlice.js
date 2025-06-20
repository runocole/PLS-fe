import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { teamsAPI } from '../../services/api';

// Async thunks
export const fetchTeams = createAsyncThunk(
  'teams/fetchTeams',
  async (_, { rejectWithValue }) => {
    try {
      const response = await teamsAPI.getTeams();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch teams');
    }
  }
);

export const fetchTeam = createAsyncThunk(
  'teams/fetchTeam',
  async (teamId, { rejectWithValue }) => {
    try {
      const response = await teamsAPI.getTeam(teamId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch team');
    }
  }
);

export const fetchTeamOfficialReport = createAsyncThunk(
  'teams/fetchTeamOfficialReport',
  async (teamId, { rejectWithValue }) => {
    try {
      const response = await teamsAPI.getTeamOfficialReport(teamId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch team report');
    }
  }
);

const initialState = {
  teams: [],
  currentTeam: null,
  currentReport: null,
  loading: {
    teams: false,
    team: false,
    report: false,
  },
  error: {
    teams: null,
    team: null,
    report: null,
  },
};

const teamsSlice = createSlice({
  name: 'teams',
  initialState,
  reducers: {
    clearTeamError: (state) => {
      state.error.team = null;
    },
    clearReportError: (state) => {
      state.error.report = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Teams
      .addCase(fetchTeams.pending, (state) => {
        state.loading.teams = true;
        state.error.teams = null;
      })
      .addCase(fetchTeams.fulfilled, (state, action) => {
        state.loading.teams = false;
        state.teams = action.payload;
      })
      .addCase(fetchTeams.rejected, (state, action) => {
        state.loading.teams = false;
        state.error.teams = action.payload;
      })
      // Fetch Team
      .addCase(fetchTeam.pending, (state) => {
        state.loading.team = true;
        state.error.team = null;
      })
      .addCase(fetchTeam.fulfilled, (state, action) => {
        state.loading.team = false;
        state.currentTeam = action.payload;
      })
      .addCase(fetchTeam.rejected, (state, action) => {
        state.loading.team = false;
        state.error.team = action.payload;
      })
      // Fetch Team Report
      .addCase(fetchTeamOfficialReport.pending, (state) => {
        state.loading.report = true;
        state.error.report = null;
      })
      .addCase(fetchTeamOfficialReport.fulfilled, (state, action) => {
        state.loading.report = false;
        state.currentReport = action.payload;
      })
      .addCase(fetchTeamOfficialReport.rejected, (state, action) => {
        state.loading.report = false;
        state.error.report = action.payload;
      });
  },
});

export const { clearTeamError, clearReportError } = teamsSlice.actions;
export default teamsSlice.reducer; 