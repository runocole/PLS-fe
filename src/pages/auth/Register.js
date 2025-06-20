import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { register } from '../../store/slices/authSlice';
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
  Stepper,
  Step,
  StepLabel,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  useTheme,
  useMediaQuery,
  Fade,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio
} from '@mui/material';
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Lock as LockIcon,
  Visibility,
  VisibilityOff,
  Badge,
  School as SchoolIcon,
  ArrowBack,
  ArrowForward,
  CheckCircleOutline,
  AccountCircle,
  SportsSoccer as CoachIcon,
  Analytics as AnalystIcon,
  Groups,
  SportsSoccer
} from '@mui/icons-material';
import scouter from '../../assets/scouter.png';
import PL from '../../assets/PL.png';

const Register = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const dispatch = useDispatch();

  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    username: '',
    role: '',
    league: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Clear any existing tokens when signup page loads
  useEffect(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }, []);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleNext = () => {
    // Validate current step before proceeding
    if (activeStep === 0) {
      // Validate first step (account information)
      if (!formData.firstName || !formData.lastName || !formData.email || !formData.password || !formData.confirmPassword) {
        setError('Please fill in all required fields');
        return;
      }
      
      // Validate email format
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(formData.email)) {
        setError('Please enter a valid email address');
        return;
      }
      
      // Validate password length
      if (formData.password.length < 8) {
        setError('Password must be at least 8 characters long');
        return;
      }
      
      // Validate password match
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        return;
      }
    }
    
    setError('');
    setActiveStep((prevStep) => prevStep + 1);
  };
  
  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
    setError('');
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Final validation
    if (!formData.league || !formData.role) {
      setError('Please fill in all required fields');
      return;
    }
    
    setError('');
    setLoading(true);
  
    try {
      console.log('Register attempt with:', formData);
      
      console.log('Role value before submit:', formData.role);
      const payload = {
        username: formData.email,
        email: formData.email,
        password: formData.password,
        confirm_password: formData.confirmPassword,
        first_name: formData.firstName,
        last_name: formData.lastName,
        role: formData.role,
        league: formData.league
      };
      console.log('Sending payload:', payload);
      
      const response = await dispatch(register(payload)).unwrap();
      
      console.log('Register successful:', response.data);
      
      // Show success message and advance to success step
      setSuccess('Account created successfully! You can now log in.');
      setActiveStep(3); 
    } catch (err) {
      console.error('Register error:', err);
      
      // Log detailed error information
      if (err.response) {
        console.log('Error status:', err.response.status);
        console.log('Error data:', err.response.data);
      }
      
      if (err.response && err.response.data) {
        console.log(err.response.data);
        // Format error messages if they're in an object
        if (typeof err.response.data === 'object') {
          const errorMessages = [];
          for (const field in err.response.data) {
            if (Array.isArray(err.response.data[field])) {
              errorMessages.push(`${field}: ${err.response.data[field].join(', ')}`);
            } else {
              errorMessages.push(`${field}: ${err.response.data[field]}`);
            }
          }
          setError(errorMessages.join('\n'));
        } else {
          setError(err.response.data);
        }
      } else {
        setError('Failed to create account. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };
  
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const steps = ['Personal Information', 'Scouting Details'];

  // Render appropriate content based on the current step
  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="First Name"
                name="firstName"
                variant="outlined"
                value={formData.firstName}
                onChange={handleChange}
                required
                sx={{ 
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    '&:hover fieldset': {
                      borderColor: theme.palette.primary.main,
                    },
                  },
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon color="primary" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Last Name"
                name="lastName"
                variant="outlined"
                value={formData.lastName}
                onChange={handleChange}
                required
                sx={{ 
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    '&:hover fieldset': {
                      borderColor: theme.palette.primary.main,
                    },
                  },
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon color="primary" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email Address"
                name="email"
                type="email"
                variant="outlined"
                value={formData.email}
                onChange={handleChange}
                required
                sx={{ 
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    '&:hover fieldset': {
                      borderColor: theme.palette.primary.main,
                    },
                  },
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon color="primary" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12}>
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
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    '&:hover fieldset': {
                      borderColor: theme.palette.primary.main,
                    },
                  },
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon color="primary" />
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
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Confirm Password"
                name="confirmPassword"
                type={showPassword ? 'text' : 'password'}
                variant="outlined"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                sx={{ 
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    '&:hover fieldset': {
                      borderColor: theme.palette.primary.main,
                    },
                  },
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon color="primary" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
          </Grid>
        );
      case 1:
        return (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="League"
                name="league"
                variant="outlined"
                value={formData.league}
                onChange={handleChange}
                required
                sx={{ 
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
                      <SportsSoccer sx={{ color: '#4A148C' }} />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl 
                fullWidth 
                required
                sx={{ 
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    '&:hover fieldset': {
                      borderColor: '#4A148C',
                    },
                  },
                }}
              >
                <InputLabel id="role-label">Role</InputLabel>
                <Select
                  labelId="role-label"
                  id="role"
                  name="role"
                  value={formData.role}
                  label="Role"
                  onChange={handleChange}
                  startAdornment={
                    <InputAdornment position="start">
                      <AccountCircle sx={{ color: '#4A148C' }} />
                    </InputAdornment>
                  }
                >
                  <MenuItem value="Analyst">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <AnalystIcon sx={{ color: '#4A148C' }} />
                      <Typography>Analyst</Typography>
                    </Box>
                  </MenuItem>
                  <MenuItem value="Coach">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CoachIcon sx={{ color: '#4A148C' }} />
                      <Typography>Coach</Typography>
                    </Box>
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        );
      case 3: // Success step
        return (
          <Box sx={{ textAlign: 'center', py: 3 }}>
            <CheckCircleOutline sx={{ fontSize: 80, color: '#4A148C', mb: 2 }} />
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              Registration Successful!
            </Typography>
            <Typography variant="body1" sx={{ mb: 3 }}>
              Your account has been created successfully.
            </Typography>
            <Button
              variant="contained"
              onClick={() => navigate('/login')}
              sx={{ 
                mt: 2,
                py: 1.5, 
                px: 4,
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
              Go to Login
            </Button>
          </Box>
        );
      default:
        return null;
    }
  };

  // Render bottom buttons based on current step
  const renderStepActions = () => {
    if (activeStep === 3) return null; // No buttons on success page
    
    return (
      <Box sx={{ display: 'flex', justifyContent: activeStep === 0 ? 'flex-end' : 'space-between', mt: 3 }}>
        {activeStep !== 0 && (
          <Button
            onClick={handleBack}
            variant="outlined"
            size="large"
            sx={{ 
              py: 1.5, 
              px: 3,
              borderRadius: 2,
              textTransform: 'none',
              fontSize: '1rem',
              fontWeight: 'medium',
              borderColor: '#4A148C',
              color: '#4A148C',
              '&:hover': {
                borderColor: '#7B1FA2',
                backgroundColor: 'rgba(74, 20, 140, 0.04)'
              }
            }}
            startIcon={<ArrowBack />}
          >
            Back
          </Button>
        )}
        
        {activeStep === steps.length - 1 ? (
          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={loading}
            sx={{ 
              py: 1.5, 
              px: 4,
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
            endIcon={loading ? null : <ArrowForward />}
          >
            {loading ? <CircularProgress size={24} /> : 'Create Account'}
          </Button>
        ) : (
          <Button
            onClick={handleNext}
            variant="contained"
            size="large"
            sx={{ 
              py: 1.5, 
              px: 4,
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
            endIcon={<ArrowForward />}
          >
            Next
          </Button>
        )}
      </Box>
    );
  };

  return (
    <Box 
      sx={{ 
        minHeight: '100vh', 
        display: 'flex',
        background: 'linear-gradient(135deg, #4A148C 0%, #7B1FA2 100%)',
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
          zIndex: 1,
          py: 4
        }}
      >
        {/* Left Side - Branding (Hidden on Mobile) */}
        {!isMobile && (
          <Fade in={true} timeout={1000}>
            <Box 
              sx={{ 
                width: '45%', 
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
                  alt="Premier League Scouting" 
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
                Join Scouter Today
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
                Create your account to access a streamlined exam queue management system.
                Get real-time updates and seamless check-ins for all your exams.
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
                  Why Sign Up?
                </Typography>
                <Box sx={{ textAlign: 'left', width: '100%' }}>
                  <Typography variant="body1" sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
                    ✓ Manage your exam queue position
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
                    ✓ Get notified when it's your turn
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
                    ✓ View upcoming exams and schedules
                  </Typography>
                  <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center' }}>
                    ✓ Quick check-in with QR codes
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Fade>
        )}
        
        {/* Right Side - Register Form */}
        <Fade in={true} timeout={800}>
          <Paper 
            elevation={24} 
            sx={{ 
              width: isMobile ? '100%' : '55%',
              maxWidth: isMobile ? '450px' : '600px',
              borderRadius: 4,
              overflow: 'hidden',
              boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)'
            }}
          >
            {/* Decorative Top Bar */}
            <Box 
              sx={{ 
                height: '8px', 
                background: 'linear-gradient(90deg, #4A148C, #7B1FA2)'
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
                    alt="PL Logo" 
                    style={{ height: '70px' }} 
                  />
                </Box>
              )}
              
              <Typography 
                variant="h4" 
                component="h1" 
                fontWeight="bold" 
                color="primary" 
                sx={{ mb: 1 }}
              >
                {activeStep === 3 ? 'Success!' : 'Create Account'}
              </Typography>
              
              {activeStep !== 3 && (
                <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                  Sign up for your Scouter account
                </Typography>
              )}
              
              {activeStep !== 3 && (
                <Stepper 
                  activeStep={activeStep} 
                  sx={{ 
                    mb: 4,
                    '& .MuiStepLabel-label': {
                      fontWeight: activeStep === 3 ? 'bold' : 'normal'
                    }
                  }}
                >
                  {steps.map((label) => (
                    <Step key={label}>
                      <StepLabel>{label}</StepLabel>
                    </Step>
                  ))}
                </Stepper>
              )}
              
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
              
              {success && activeStep === 3 && (
                <Alert 
                  severity="success" 
                  sx={{ 
                    mb: 3, 
                    borderRadius: 2,
                    '& .MuiAlert-icon': { alignItems: 'center' }
                  }}
                >
                  {success}
                </Alert>
              )}
              
              <Box component="form" onSubmit={activeStep === steps.length - 1 ? handleSubmit : (e) => e.preventDefault()}>
                {/* Render content based on current step */}
                {renderStepContent(activeStep)}
                
                {/* Render appropriate buttons for current step */}
                {renderStepActions()}
              </Box>
              
              {activeStep !== 3 && (
                <>
                  <Divider sx={{ my: 3 }}>
                    <Typography variant="body2" color="text.secondary">
                      OR
                    </Typography>
                  </Divider>
                  
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="body1" color="text.secondary">
                      Already have an account?{' '}
                      <Link to="/login" style={{ textDecoration: 'none' }}>
                        <Typography component="span" variant="body1" sx={{ color: '#4A148C', fontWeight: 'bold' }}>
                          Sign In
                        </Typography>
                      </Link>
                    </Typography>
                  </Box>
                </>
              )}
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

export default Register;