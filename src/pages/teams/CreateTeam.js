// CreateTeam.js
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
    color: '#1E88E5', 
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [logoPreview, setLogoPreview] = useState('');
  const fileInputRef = useRef();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('File size too large. Please choose an image under 5MB.');
        return;
      }
      if (!file.type.startsWith('image/')) {
        setError('Please upload a valid image.');
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
      setError(err.response?.data?.message || err.response?.data?.error || 'Something went wrong.');
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
        width: '100vw',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'radial-gradient(circle at center, #0A0A0A 0%, #000000 100%)',
        backgroundImage: `url('/stadium-texture-dark.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        overflow: 'auto',
        px: { xs: 2, sm: 5 },
      }}
    >
      <Paper
        elevation={12}
        sx={{
          width: '100%',
          maxWidth: 1200,
          display: 'flex',
          flexDirection: 'row',
          p: 5,
          borderRadius: 6,
          background: 'linear-gradient(135deg, #0d1117 0%, #0f2027 100%)',
          boxShadow: '0 0 60px rgba(30, 136, 229, 0.3)',
        }}
      >
        {/* Left Banner */}
        <Box
          sx={{
            flex: 1,
            pr: 5,
            borderRight: '1px solid rgba(255,255,255,0.1)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            color: '#fff',
          }}
        >
          <TeamIcon sx={{ fontSize: 100, color: '#1E88E5', mb: 3 }} />
          <Typography variant="h2" fontWeight="bold" gutterBottom>
            Draft Your Dream Team
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.7 }}>
            Add a new squad to your scouting portfolio. Make it iconic.
          </Typography>
        </Box>

        {/* Right Form */}
        <Box sx={{ flex: 1, pl: 5 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}
          <form onSubmit={handleSubmit}>
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
                        <TeamIcon sx={{ color: '#1E88E5' }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <Box
                  sx={{
                    border: '2px dashed rgba(255,255,255,0.2)',
                    borderRadius: 2,
                    p: 3,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    backgroundColor: 'rgba(255,255,255,0.03)',
                  }}
                >
                  <input
                    accept="image/*"
                    type="file"
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    onChange={handleLogoChange}
                  />
                  {!logoPreview ? (
                    <Button
                      variant="contained"
                      startIcon={<UploadIcon />}
                      onClick={() => fileInputRef.current.click()}
                      sx={{ bgcolor: '#1E88E5' }}
                    >
                      Upload Team Logo
                    </Button>
                  ) : (
                    <Fade in={true}>
                      <Box sx={{ position: 'relative' }}>
                        <img
                          src={logoPreview}
                          alt="Logo"
                          style={{
                            width: 150,
                            height: 150,
                            objectFit: 'cover',
                            borderRadius: 8,
                            border: '3px solid #1E88E5',
                          }}
                        />
                        <Tooltip title="Remove Logo">
                          <IconButton
                            onClick={removeLogo}
                            sx={{
                              position: 'absolute',
                              top: -10,
                              right: -10,
                              bgcolor: '#e53935',
                              color: '#fff',
                              '&:hover': { bgcolor: '#b71c1c' },
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
                />
              </Grid>

              <Grid item xs={12}>
                <Button
                  fullWidth
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={loading}
                  sx={{
                    bgcolor: '#1E88E5',
                    py: 2,
                    fontSize: '1.1rem',
                    fontWeight: 700,
                    letterSpacing: 1,
                    '&:hover': {
                      bgcolor: '#1565C0',
                    },
                  }}
                >
                  {loading ? <CircularProgress size={24} color="inherit" /> : 'Create Team'}
                </Button>
              </Grid>
            </Grid>
          </form>
        </Box>
      </Paper>
    </Box>
  );
};

export default CreateTeam;