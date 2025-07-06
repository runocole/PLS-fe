import React, {useEffect } from 'react';
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login } from '../../store/slices/authSlice';
import api from '../../services/api';
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  InputAdornment,
  IconButton,
  Alert,
  CircularProgress,
  Checkbox,
  FormControlLabel,
  Divider,
  useTheme,
  useMediaQuery,
  Fade,
  RadioGroup,
  Radio,
  FormControl,
  FormLabel
} from '@mui/material';
import {
  Person as PersonIcon,
  Lock as LockIcon,
  Visibility,
  VisibilityOff,
  School as SchoolIcon,
  Login as LoginIcon,
  SportsSoccer as CoachIcon,
  Analytics as AnalystIcon
} from '@mui/icons-material';
import scouter from "../../assets/scouter.png";
import PL from "../../assets/PL.png";

const Login = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    username: '',
    password: '',
    role: 'Analyst' // Default role
  });
  const [formErrors, setFormErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

   // Validation rules
   const validateForm = () => {
    const errors = {};
    if (!formData.username.trim()) {
      errors.username = 'Username is required';
    }
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    if (!formData.role) {
      errors.role = 'Please select a role';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  // Check if user is already logged in
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      console.log('User from localStorage:', user);
      
      // Check user role and redirect accordingly
      if (user && user.role === 'analyst') {
        console.log('Redirecting to analyst dashboard');
        navigate('/analyst-dashboard');
      } else if (user && user.role === 'coach') {
        console.log('Redirecting to coach dashboard');
        navigate('/coach-dashboard');
      }
    }
  }, [navigate]);
  
    const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
  
    if (!validateForm()) {
      return;
    }
  
    setLoading(true);
  
    try {
      const response = await dispatch(login({
        username: formData.username,
        password: formData.password,
        role: formData.role
      })).unwrap();
  
      console.log('Login response:', response);
  
      if (!response || !response.tokens || !response.tokens.access) {
        throw new Error('No authentication token received');
      }
  
      localStorage.setItem('tokens', JSON.stringify(response.tokens));
      localStorage.setItem('userRole', formData.role);
      localStorage.setItem('user', JSON.stringify(response.user));
  
      if (rememberMe) {
        localStorage.setItem('rememberMe', 'true');
      } else {
        localStorage.removeItem('rememberMe');
      }
  
      const userData = response.user;
  
      setTimeout(() => {
        if (userData.is_staff || userData.is_superuser || response.user.role === 'admin') {
          navigate('/admin-dashboard');
        } else if (userData.role === 'analyst') {
          navigate('/analyst-dashboard');
        } else if (userData.role === 'coach') {
          navigate('/coach-dashboard');
        } else if (userData.role === 'both') {
          navigate('/combined-dashboard');
        } else {
          navigate('/dashboard');
        }
      }, 300);
  
    } catch (err) {
      console.error('Login error:', err);
  
      if (err.response && err.response.data) {
        if (typeof err.response.data === 'object' && err.response.data.non_field_errors) {
          setError(err.response.data.non_field_errors[0]);
        } else if (typeof err.response.data === 'string') {
          setError(err.response.data);
        } else if (err.response.data.error) {
          setError(err.response.data.error);
        } else {
          setError('Invalid credentials. Please try again.');
        }
      } else {
        setError('Login failed. Please check your connection and try again.');
      }
  
    } finally {
      setLoading(false);
    }
  };
  
  
  return (
    <Box 
      sx={{ 
        minHeight: '100vh', 
        display: 'flex',
        background: 'linear-gradient(135deg,rgb(0, 0, 0) 0%,rgb(42, 19, 52) 100%)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Background Pattern */}
      <Box 
        sx={{ 
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.05,
          background: `
            radial-gradient(circle at 20% 30%, white 0%, transparent 10%),
            radial-gradient(circle at 80% 70%, white 0%, transparent 10%),
            radial-gradient(circle at 40% 80%, white 0%, transparent 10%),
            radial-gradient(circle at 70% 20%, white 0%, transparent 10%)
          `,
          backgroundSize: '50px 50px',
          zIndex: 0
        }}
      />
      
      <Container 
        maxWidth="lg" 
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          position: 'relative',
          zIndex: 1
        }}
      >
        {/* Left Side - Branding (Hidden on Mobile) */}
        {!isMobile && (
          <Fade in={true} timeout={1000}>
            <Box 
              sx={{ 
                width: '50%', 
                display: 'flex', 
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                pr: 8,
                textAlign: 'center'
              }}
            >
              <Box sx={{ mb: 4 }}>
                <img 
                  src={scouter} 
                  alt="Scouter Logo" 
                  style={{ 
                    height: '120px', 
                  width:"130px",
                    filter: 'drop-shadow(0px 4px 8px rgba(0,0,0,0.2))'
                  }} 
                />
                <img 
                  src={PL} 
                  alt="PL Logo" 
                  style={{ 
                    height: '120px',
                    filter: 'drop-shadow(0px 4px 8px rgba(0,0,0,0.2))'
                  }} 
                />
              </Box>
              
              <Typography 
                variant="h3" 
                component="h1" 
                fontWeight="bold" 
                sx={{ 
                  mb: 3,
                  textShadow: '0px 2px 4px rgba(0,0,0,0.2)'
                }}
              >
               SCOUTER
              </Typography>
              
              <Typography 
                variant="h6" 
                sx={{ 
                  mb: 4,
                  opacity: 0.9,
                  maxWidth: '80%',
                  lineHeight: 1.6
                }}
              >
                Sign in to access your Scouter account and scout teams efficiently.
              </Typography>
              
              <Box 
                sx={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center',
                  p: 3,
                  borderRadius: 3,
                  bgcolor: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)',
                  maxWidth: '80%'
                }}
              >
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Key Features
                </Typography>
                <Box sx={{ textAlign: 'left', width: '100%' }}>
                  <Typography variant="body1" sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
                    ✓ Detailed tactical analysis
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 1, display: 'flex', alignItems: 'left' }}>
                    ✓ Create and edit your own scout report
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
                    ✓ Interactive charts and statistics
                  </Typography>
                  <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center' }}>
                    ✓ Seamless experience
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Fade>
        )}
        
        {/* Right Side - Login Form */}
        <Fade in={true} timeout={800}>
          <Paper 
            elevation={24} 
            sx={{ 
              width: isMobile ? '100%' : '50%',
              maxWidth: isMobile ? '450px' : '500px',
              borderRadius: 4,
              overflow: 'hidden',
              boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)'
            }}
          >
            {/* Decorative Top Bar */}
            <Box 
              sx={{ 
                height: '8px', 
                background: 'linear-gradient(90deg,rgb(54, 0, 59),rgb(49, 5, 68))'
              }}
            />
            
            {/* Form Content */}
            <Box sx={{ p: isMobile ? 3 : 5 }}>
              {/* Mobile Logo */}
              {isMobile && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
                  <img 
                    src={scouter} 
                    alt="Scouter Logo" 
                    style={{ height: '60px', marginRight: '15px' }} 
                  />
                  <img 
                    src={PL} 
                    alt="PL logo" 
                    style={{ height: '70px' }} 
                  />
                </Box>
              )}
              
              <Typography 
                fontFamily={"sans-serif"}
                component="h1" 
                fontWeight="bold" 
                fontSize={"24px"}
                sx={{ mb: 1, color: '#4A148C' }}
              >
               Welcome Back!
              </Typography>
              
              <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                Enter your credentials to continue
              </Typography>
              
              {error && (
                <Alert 
                  severity="error" 
                  sx={{ 
                    mb: 3, 
                    borderRadius: 2,
                    '& .MuiAlert-icon': { alignItems: 'center' }
                  }}
                >
                  {error}
                </Alert>
              )}
              
              <Box component="form" onSubmit={handleSubmit}>

                <TextField
                  fullWidth
                  label="Username"
                  name="username"
                  variant="outlined"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  sx={{ 
                    mb: 3,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      '&:hover fieldset': {
                        borderColor: '#4A148C',
                      },
                    },
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SchoolIcon sx={{ color: '#4A148C' }} />
                      </InputAdornment>
                    ),
                  }}
                />
                
                <TextField
                  fullWidth
                  label="Password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  variant="outlined"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  sx={{ 
                    mb: 2,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      '&:hover fieldset': {
                        borderColor: '#4A148C',
                      },
                    },
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon sx={{ color: '#4A148C' }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={toggleShowPassword}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <FormControlLabel
                    control={
                      <Checkbox 
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        color="primary"
                        size="small"
                        sx={{ 
                          color: '#4A148C',
                          '&.Mui-checked': {
                            color: '#4A148C',
                          },
                        }}
                      />
                    }
                    label={<Typography variant="body2">Remember me</Typography>}
                  />
                  
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      cursor: 'pointer',
                      fontWeight: 'medium',
                      color: '#4A148C',
                      '&:hover': { textDecoration: 'underline' }
                    }}
                  >
                    Forgot password?
                  </Typography>
                </Box>
                
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  disabled={loading}
                  startIcon={loading ? null : <LoginIcon />}
                  sx={{ 
                    py: 1.5, 
                    borderRadius: 2,
                    textTransform: 'none',
                    fontSize: '1rem',
                    fontWeight: 'bold',
                    bgcolor: '#4A148C',
                    boxShadow: '0 4px 10px rgba(74, 20, 140, 0.3)',
                    '&:hover': {
                      bgcolor: '#7B1FA2',
                      boxShadow: '0 6px 15px rgba(74, 20, 140, 0.4)',
                    }
                  }}
                >
                  {loading ? <CircularProgress size={24} /> : 'Sign In'}
                </Button>
                
                <Divider sx={{ my: 3 }}>
                  <Typography variant="body2" color="text.secondary">
                    OR
                  </Typography>
                </Divider>
                
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="body1" color="text.secondary">
                    Don't have an account?{' '}
                    <Link to="/signup" style={{ textDecoration: 'none' }}>
                      <Typography component="span" variant="body1" sx={{ color: '#4A148C', fontWeight: 'bold' }}>
                        Create Account
                      </Typography>
                    </Link>
                  </Typography>
                </Box>
              </Box>
            </Box>
            
            {/* Footer */}
            <Box 
              sx={{ 
                bgcolor: 'rgba(0, 0, 0, 0.02)', 
                p: 2, 
                borderTop: '1px solid', 
                borderColor: 'divider',
                textAlign: 'center'
              }}
            >
              <Typography variant="body2" color="text.secondary">
                © {new Date().getFullYear()} All rights reserved.
              </Typography>
            </Box>
          </Paper>
        </Fade>
      </Container>
    </Box>
  );
};

export default Login;