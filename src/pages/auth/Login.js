import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login } from '../../store/slices/authSlice';
import api from '../../services/api';
import {
  Box, Container, Paper, Typography, TextField, Button,
  InputAdornment, IconButton, Alert, CircularProgress,
  Checkbox, FormControlLabel, Divider, useTheme,
  useMediaQuery, Fade
} from '@mui/material';
import {
  Lock, Visibility, VisibilityOff, School, Login as LoginIcon
} from '@mui/icons-material';

import scouter from '../../assets/scouter.png';
import PL from '../../assets/PL.png';

const Login = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [formData, setFormData] = useState({ username: '', password: '', role: 'Analyst' });
  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (token) {
      if (user.role === 'analyst') navigate('/analyst-dashboard');
      else if (user.role === 'coach') navigate('/coach-dashboard');
    }
  }, [navigate]);

  const validateForm = () => {
    const errors = {};
    if (!formData.username.trim()) errors.username = 'Username is required';
    if (!formData.password) errors.password = 'Password is required';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (formErrors[name]) setFormErrors(prev => ({ ...prev, [name]: '' }));
  };

  const toggleShowPassword = () => setShowPassword(!showPassword);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!validateForm()) return;
    setLoading(true);

    try {
      const response = await dispatch(login(formData)).unwrap();
      if (!response?.tokens?.access) throw new Error('Token missing');
      localStorage.setItem('tokens', JSON.stringify(response.tokens));
      localStorage.setItem('userRole', formData.role);
      localStorage.setItem('user', JSON.stringify(response.user));
      if (rememberMe) localStorage.setItem('rememberMe', 'true');
      else localStorage.removeItem('rememberMe');

      const role = response.user.role;
      setTimeout(() => {
        if (role === 'analyst') navigate('/analyst-dashboard');
        else if (role === 'coach') navigate('/coach-dashboard');
        else navigate('/dashboard');
      }, 300);
    } catch (err) {
      setError('Login failed. Please check your credentials or connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        background: '#0e001a',
        backgroundImage: `
          radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px),
          radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)
        `,
        backgroundSize: '40px 40px',
        backgroundPosition: '0 0, 20px 20px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Container maxWidth="lg" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1 }}>
        {!isMobile && (
          <Fade in timeout={1000}>
            <Box sx={{ width: '50%', pr: 8, color: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Box sx={{ mb: 4, display: 'flex', gap: 2 }}>
                <img src={scouter} alt="Scouter" style={{ height: 120 }} />
                <img src={PL} alt="PL" style={{ height: 120 }} />
              </Box>
              <Typography variant="h4" fontWeight="bold" mb={2}>SCOUTER</Typography>
              <Typography variant="body1" sx={{ mb: 4, maxWidth: '80%', textAlign: 'center' }}>
                Sign in to access your Scouter account and scout teams efficiently.
              </Typography>
              <Box
                sx={{
                  p: 3,
                  borderRadius: 3,
                  bgcolor: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                }}
              >
                <Typography fontWeight="bold" mb={2}>Key Features</Typography>
                <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
                  <li>✓ Detailed tactical analysis</li>
                  <li>✓ Create and edit scout reports</li>
                  <li>✓ Interactive charts & stats</li>
                  <li>✓ Seamless UX</li>
                </ul>
              </Box>
            </Box>
          </Fade>
        )}

        <Fade in timeout={800}>
          <Paper
            elevation={24}
            sx={{
              width: isMobile ? '100%' : '50%',
              maxWidth: 500,
              borderRadius: 4,
              bgcolor: '#1a002e',
              color: '#fff',
              overflow: 'hidden',
              boxShadow: '0 8px 30px rgba(156, 39, 176, 0.3)',
            }}
          >
            <Box sx={{ height: 8, bgcolor: '#d500f9' }} />
            <Box sx={{ p: isMobile ? 3 : 5 }}>
              {isMobile && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
                  <img src={scouter} alt="Logo" style={{ height: 60, marginRight: 15 }} />
                  <img src={PL} alt="Logo" style={{ height: 70 }} />
                </Box>
              )}
              <Typography variant="h5" fontWeight="bold" mb={1} color="#e1bee7">Welcome Back!</Typography>
              <Typography variant="body2" sx={{ mb: 3 }}>Enter your credentials to continue</Typography>

              {error && (
                <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>
              )}

              <form onSubmit={handleSubmit}>
                <TextField
                  fullWidth
                  name="username"
                  label="Username"
                  value={formData.username}
                  onChange={handleChange}
                  variant="outlined"
                  required
                  sx={{ mb: 3 }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <School sx={{ color: '#0b000d' }} />
                      </InputAdornment>
                    ),
                  }}
                />

                <TextField
                  fullWidth
                  name="password"
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  variant="outlined"
                  required
                  sx={{ mb: 3 }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock sx={{ color: '#00000' }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={toggleShowPassword} edge="end" sx={{ color: '#fff' }}>
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
                        sx={{
                          color: '#d500f9',
                          '&.Mui-checked': { color: '#d500f9' }
                        }}
                      />
                    }
                    label="Remember me"
                  />
                  <Typography variant="body2" sx={{ color: '#e1bee7', cursor: 'pointer' }}>Forgot password?</Typography>
                </Box>

                <Button
                  fullWidth
                  type="submit"
                  variant="contained"
                  sx={{
                    py: 1.5,
                    fontWeight: 'bold',
                    fontSize: '1rem',
                    textTransform: 'none',
                    bgcolor: '#00000',
                    '&:hover': { bgcolor: '#00000' }
                  }}
                  startIcon={<LoginIcon />}
                  disabled={loading}
                >
                  {loading ? <CircularProgress size={24} /> : 'Sign In'}
                </Button>

                <Divider sx={{ my: 3, borderColor: 'rgba(255,255,255,0.1)' }}>
                  <Typography variant="body2" color="text.secondary">OR</Typography>
                </Divider>

                <Typography variant="body2" align="center">
                  Don’t have an account?{' '}
                  <Link to="/register" style={{ color: '#00000', fontWeight: 600, textDecoration: 'none' }}>
                    Create Account
                  </Link>
                </Typography>
              </form>
            </Box>

            <Box sx={{ bgcolor: '#14001f', textAlign: 'center', py: 2, fontSize: '0.75rem', color: '#aaa' }}>
              © {new Date().getFullYear()} All rights reserved.
            </Box>
          </Paper>
        </Fade>
      </Container>
    </Box>
  );
};

export default Login;