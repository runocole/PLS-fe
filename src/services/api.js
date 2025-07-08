import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth tokens
api.interceptors.request.use(
  (config) => {
    const tokenString = localStorage.getItem('tokens');
    if (tokenString) {
      const tokens = JSON.parse(tokenString);
      if (tokens.access) {
        config.headers.Authorization = `Bearer ${tokens.access}`;
      }
    }
    // If sending FormData, let the browser set the Content-Type
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 errors (unauthorized)
    if (error.response?.status === 401 && !originalRequest._retry) {
      const tokenString = localStorage.getItem('tokens');
      if (tokenString) {
        const tokens = JSON.parse(tokenString);
        if (tokens.refresh) {
          try {
            // Try to refresh the token
            const response = await axios.post(`${API_BASE_URL}/auth/token/refresh/`, {
              refresh: tokens.refresh
            });
            
            if (response.data.access) {
              const newTokens = {
                ...tokens,
                access: response.data.access
              };
              localStorage.setItem('tokens', JSON.stringify(newTokens));
              
              // Retry the original request
              originalRequest.headers.Authorization = `Bearer ${response.data.access}`;
              return axios(originalRequest);
            }
          } catch (refreshError) {
            // If refresh fails, logout
            localStorage.removeItem('tokens');
            localStorage.removeItem('user');
            window.location.href = '/login';
            return Promise.reject(refreshError);
          }
        }
      }
      
      // No refresh token or refresh failed
      localStorage.removeItem('tokens');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: async (credentials) => {
    const response = await api.post('/auth/login/', credentials);
    if (response.data) {
    const { tokens, user } = response.data;
    if (tokens) {
        localStorage.setItem('tokens', JSON.stringify(tokens));
    }
    if (user) {
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('userRole', user.role);  // Update this too
    }
}
    return response;
  },

  register: async (userData) => {
    const response = await api.post('/auth/register/', userData);
    if (response.data && response.data.tokens?.access) {
      localStorage.setItem('tokens', JSON.stringify(response.data.tokens));
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response;
  },

  logout: () => {
    localStorage.removeItem('tokens');
    localStorage.removeItem('user');
  },

  getCurrentUser: async () => {
    return await api.get('/auth/user/');
  },
};

// Teams API
export const teamsAPI = {
  getTeams: () => api.get('/teams/'),
  getTeam: (id) => api.get(`/teams/${id}/`),
  createTeam: (data) => {
    const config = {
      headers: {
        'Content-Type': data instanceof FormData ? 'multipart/form-data' : 'application/json',
      },
    };
    return api.post('/teams/', data, config);
  },
  updateTeam: (id, data) => {
    const config = {
      headers: {
        'Content-Type': data instanceof FormData ? 'multipart/form-data' : 'application/json',
      },
    };
    return api.put(`/teams/${id}/`, data, config);
  },
  deleteTeam: (id) => api.delete(`/teams/${id}/`),
  getLeagues: () => api.get('/leagues/'),
};

// Reports API
export const reportsAPI = {
  getReports: async () => {
    console.log('Fetching reports...');
    try {
      const response = await api.get('/reports/');
      console.log('Reports fetched:', response.data);
      return response;
    } catch (error) {
      console.error('Error fetching reports:', error.response || error);
      throw error;
    }
  },
  getReport: async (id) => {
    console.log('Fetching report:', id);
    try {
      const response = await api.get(`/reports/${id}/`);
      console.log('Report fetched:', response.data);
      return response;
    } catch (error) {
      console.error('Error fetching report:', error.response || error);
      throw error;
    }
  },
  createReport: (data) => api.post('/reports/', data),
  updateReport: (id, data) => api.put(`/reports/${id}/`, data),
  deleteReport: (id) => api.delete(`/reports/${id}/`),
  getTeamReports: (teamId) => api.get(`/reports/team/${teamId}/`),
  updateReportStatus: (id, status) => api.put(`/reports/${id}/status/`, { status }),
  getTeamReports: (teamId) => api.get(`/reports/team/${teamId}/`),
  getMyReport: (teamId) => api.get(`/reports/my-report/team/${teamId}/`), 
  getMyDraftReport: (teamId) => api.get(`/reports/my-draft/team/${teamId}/`),

};

// Players API
export const playersAPI = {
  getPlayers: () => api.get('/players'),
  getPlayer: (playerId) => api.get(`/players/${playerId}`),
  getPlayerStats: (playerId) => api.get(`/players/${playerId}/stats`),
  getPlayerReports: (playerId) => api.get(`/players/${playerId}/reports`),
};

// Matches API
export const matchesAPI = {
  getMatches: () => api.get('/matches'),
  getMatch: (matchId) => api.get(`/matches/${matchId}`),
  getMatchReport: (matchId) => api.get(`/matches/${matchId}/report`),
  getUpcomingMatches: () => api.get('/matches/upcoming'),
  getPastMatches: () => api.get('/matches/past'),
};

export default api;