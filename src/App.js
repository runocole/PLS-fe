import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { Provider, useDispatch } from 'react-redux';
import { store } from './store';
import { useEffect } from 'react';
import { checkAuthState } from './store/slices/authSlice';
import theme from './theme';
import ProtectedRoute from './components/ProtectedRoute';
import { SearchProvider } from './context/SearchContext';
import { NotificationProvider } from './context/NotificationContext';
// Layouts
import DashboardLayout from './layouts/DashboardLayout';

// Pages
import Landing from './pages/Landing';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import RegistrationSuccess from './pages/auth/RegistrationSuccess';
import Dashboard from './pages/dashboard/Dashboard';
import AnalystDashboard from './pages/dashboard/AnalystDashboard';
import ReportEditor from './pages/reports/ReportEditor';
import ReportOverview from './pages/reports/ReportOverview';
import ReportsOverview from './pages/reports/ReportsOverview';
import CreateTeam from './pages/teams/CreateTeam';

// AuthCheck component to validate authentication state on load
const AuthCheck = ({ children }) => {
  const dispatch = useDispatch();
  
  useEffect(() => {
    dispatch(checkAuthState());
  }, [dispatch]);
  
  return children;
};

// Role-based redirect component
const RoleBasedRedirect = () => {
  const role = localStorage.getItem('userRole');
  
  switch(role) {
    case 'analyst':
      return <Navigate to="/analyst-dashboard" replace />;
    case 'admin':
      return <Navigate to="/admin-dashboard" replace />;
    case 'coach':
      return <Navigate to="/coach-dashboard" replace />;
    default:
      return <Navigate to="/login" replace />;
  }
};

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <AuthCheck> 
          <SearchProvider>
          <NotificationProvider>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/registration-success" element={<RegistrationSuccess />} />
              
              {/* Protected Routes */}
              <Route
                element={
                  <ProtectedRoute>
                    <DashboardLayout />
                  </ProtectedRoute>
                }
              >
                {/* Redirect /dashboard to role-specific dashboard */}
                <Route path="/dashboard" element={<RoleBasedRedirect />} />
                
                {/* Coach Routes */}
                <Route path="/coach-dashboard" element={<Dashboard />} />
                <Route path="/reports/view" element={<ReportsOverview />} />
                <Route path="/reports/:teamId" element={<ReportOverview />} />
                
                {/* Analyst Routes */}
                <Route path="/analyst-dashboard" element={<AnalystDashboard />} />
                <Route path="/reports/editor/:reportId" element={<ReportEditor />} />
                <Route path="/reports/editor/new" element={<ReportEditor />} />
                <Route path="/teams/create" element={<CreateTeam />} />
                
                {/* Shared Routes */}
                <Route path="/reports" element={<ReportsOverview />} />
              </Route>

              {/* Catch all route - redirect to landing */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
            </NotificationProvider> 
            </SearchProvider>
          </AuthCheck>
        </Router>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
