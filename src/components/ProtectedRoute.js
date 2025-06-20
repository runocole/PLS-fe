import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import LoadingScreen from './LoadingScreen';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useSelector((state) => state.auth);
  const location = useLocation();
  
  // DEVELOPMENT ONLY
  const searchParams = new URLSearchParams(location.search);
  const bypassAuth = searchParams.get('dev-bypass') === 'true';
  
  // Check for tokens in localStorage
  const hasTokens = !!localStorage.getItem('tokens');
  
  if (loading) {
    return <LoadingScreen message="Authenticating..." />;
  }

  if (!isAuthenticated && !hasTokens && !bypassAuth) {
    // Redirect to login page but save the attempted url
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute; 