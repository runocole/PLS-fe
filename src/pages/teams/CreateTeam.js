import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  CircularProgress,
  Alert,
  InputAdornment,
  useTheme,
  IconButton,
  Tooltip,
  Fade,
} from '@mui/material';
import {
  SportsSoccer as TeamIcon,
  ColorLens as ColorIcon,
  Image as LogoIcon,
  CloudUpload as UploadIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { teamsAPI } from '../../services/api';

const CreateTeam = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    name: '',
    logo: null,
    color: '#6A1B9A',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [logoPreview, setLogoPreview] = useState('');
  const fileInputRef = useRef();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('File size too large. Please choose an image under 5MB.');
        return;
      }
      if (!file.type.startsWith('image/')) {
        setError('Please upload an image file.');
        return;
      }
      setFormData(prev => ({ ...prev, logo: file }));
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('color', formData.color);
      if (formData.logo) {
        data.append('logo', formData.logo);
      }

      await teamsAPI.createTeam(data);
      navigate('/analyst-dashboard');
    } catch (err) {
      console.error('Error creating team:', err);
      setError(err.response?.data?.message || err.response?.data?.error || 'Failed to create team');
    } finally {
      setLoading(false);
    }
  };

  const removeLogo = () => {
    setFormData(prev => ({ ...prev, logo: null }));
    setLogoPreview('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        p: 3,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        backgroundColor: '#121212',
        color: '#fff',
      }}
    >
      <Paper
        elevation={24}
        sx={{
          p: { xs: 3, sm: 5 },
          width: '100%',
          maxWidth: 700,
          borderRadius: 4,
          background: 'linear-gradient(135deg, #1E1E1E 0%, #2D2D2D 100%)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          mt: 4,
          mb: 4,
        }}
      >
        <Box sx={{ mb: 5, textAlign: 'center' }}>
          <TeamIcon 
            sx={{ 
              fontSize: 80, 
              color: '#8E24AA',
              mb: 3,
              filter: 'drop-shadow(0 0 10px rgba(142, 36, 170, 0.3))'
            }} 
          />
          <Typography 
            variant="h3" 
            component="h1" 
            fontWeight="bold"
            sx={{ 
              mb: 2, 
              color: '#fff',
              textShadow: '0 0 20px rgba(142, 36, 170, 0.3)'
            }}
          >
            Create New Team
          </Typography>
          <Typography 
            variant="h6" 
            sx={{ 
              color: 'rgba(255, 255, 255, 0.7)',
              fontWeight: 300
            }}
          >
            Add a new team to your scouting portfolio
          </Typography>
        </Box>

        {error && (
          <Alert 
            severity="error" 
            sx={{ 
              mb: 4,
              backgroundColor: 'rgba(211, 47, 47, 0.1)',
              color: '#ff1744',
              '& .MuiAlert-icon': {
                color: '#ff1744'
              }
            }}
          >
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          <Grid container spacing={4}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Team Name"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <TeamIcon sx={{ color: '#8E24AA' }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.08)',
                    },
                    '& fieldset': {
                      borderColor: 'rgba(255, 255, 255, 0.1)',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: 'rgba(255, 255, 255, 0.7)',
                  },
                  '& .MuiOutlinedInput-input': {
                    color: '#fff',
                  },
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                width: '100%',
                p: 4,
                borderRadius: 2,
                border: '2px dashed rgba(142, 36, 170, 0.5)',
                backgroundColor: 'rgba(255, 255, 255, 0.02)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  borderColor: '#8E24AA',
                }
              }}>
                <input
                  accept="image/*"
                  type="file"
                  style={{ display: 'none' }}
                  ref={fileInputRef}
                  onChange={handleLogoChange}
                />
                {!logoPreview ? (
                  <Button
                    variant="contained"
                    onClick={() => fileInputRef.current.click()}
                    sx={{ 
                      mb: 2, 
                      borderRadius: 2,
                      textTransform: 'none',
                      fontSize: '1.1rem',
                      fontWeight: 500,
                      bgcolor: '#8E24AA',
                      color: '#fff',
                      px: 4,
                      py: 2,
                      '&:hover': { 
                        bgcolor: '#6A1B9A',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 5px 15px rgba(142, 36, 170, 0.4)'
                      }
                    }}
                    startIcon={<UploadIcon />}
                  >
                    Upload Team Logo
                  </Button>
                ) : (
                  <Fade in={true}>
                    <Box sx={{ position: 'relative' }}>
                      <img
                        src={logoPreview}
                        alt="Team Logo Preview"
                        style={{ 
                          width: 150,
                          height: 150,
                          objectFit: 'cover',
                          borderRadius: 16,
                          border: '3px solid #8E24AA',
                          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)'
                        }}
                      />
                      <Tooltip title="Remove Logo" arrow>
                        <IconButton
                          onClick={removeLogo}
                          sx={{
                            position: 'absolute',
                            top: -12,
                            right: -12,
                            bgcolor: '#ff1744',
                            color: '#fff',
                            '&:hover': {
                              bgcolor: '#d50000'
                            }
                          }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Fade>
                )}
              </Box>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Team Color"
                name="color"
                type="color"
                value={formData.color}
                onChange={handleChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <ColorIcon sx={{ color: formData.color }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.08)',
                    },
                    '& fieldset': {
                      borderColor: 'rgba(255, 255, 255, 0.1)',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: 'rgba(255, 255, 255, 0.7)',
                  },
                  '& .MuiOutlinedInput-input': {
                    color: '#fff',
                    height: '50px',
                  },
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={loading}
                sx={{
                  mt: 2,
                  py: 2,
                  borderRadius: 2,
                  textTransform: 'none',
                  fontSize: '1.2rem',
                  fontWeight: 600,
                  letterSpacing: 1,
                  bgcolor: '#8E24AA',
                  color: '#fff',
                  boxShadow: '0 8px 24px rgba(142, 36, 170, 0.3)',
                  '&:hover': {
                    bgcolor: '#6A1B9A',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 12px 30px rgba(142, 36, 170, 0.4)',
                  },
                  '&:active': {
                    transform: 'translateY(0)',
                  }
                }}
              >
                {loading ? (
                  <CircularProgress size={28} color="inherit" />
                ) : (
                  'Create Team'
                )}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};

export default CreateTeam;
