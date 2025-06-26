import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchReport, createReport, updateReport } from '../../store/slices/reportsSlice';
import {useLocation} from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  IconButton,
  Avatar,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Divider,
  Chip,
  Stack,
  useTheme,
  alpha,
  CircularProgress,
  Alert,
  Snackbar,
} from '@mui/material';
import {
  ArrowBack as BackIcon,
  Save as SaveIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  PersonAdd as AddPlayerIcon,
  SportsSoccer as FormationIcon,
  AccessTime as TimeIcon,
  Check as CheckIcon,
  Person as PersonIcon,
} from '@mui/icons-material';

const ReportEditor = () => {
  // const { teamId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const theme = useTheme();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const teamId = queryParams.get('team');
  
  // Get reports and team data from store
  const { currentReport: report, loading, error } = useSelector((state) => state.reports);
  const { teams } = useSelector((state) => state.teams);
  
  // Track if save was successful
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  // Find the current team based on teamId
  const currentTeam = teams?.find(team => team?.id === parseInt(teamId)) || {
    id: parseInt(teamId),
    name: 'Team',
    logo: '/logos/default.png',
    color: theme.palette.primary.main
  };
  
  // Form state
  const [formState, setFormState] = useState({
    key_players: [
      { id: 1, name: '', position: '', rating: '', strengths: '' }
    ],
    match_stats: {
      possession: '',
      shots: '',
      shotsOnTarget: '',
      passes: '',
      passAccuracy: '',
      corners: '',
      fouls: ''
    },
    tactical_summary: {
      formation: '',
      overview: '',
      strengths: '',
      weaknesses: '',
    },
    performance_insights: '',
    status: 'in-progress',
  });
  
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  
const getErrorMessage = (err) => {
  if (!err) return 'Unknown error';
  if (typeof err === 'string') return err;
  if (err.detail) {
    return typeof err.detail === 'string' ? err.detail : JSON.stringify(err.detail);
  }
  if (err.message) return err.message;
  try {
    return JSON.stringify(err);
  } catch {
    return 'An unknown error occurred';
  }
};


  // Populate form with existing report data if available
  useEffect(() => {
    dispatch(fetchReport(teamId));
  }, [dispatch, teamId]);
  
  useEffect(() => {
    if (report && Object.keys(report).length > 0) {
      setFormState(report);
    }
  }, [report]);
  
  // Reset form when team changes
  useEffect(() => {
    if (!report || report.team !== parseInt(teamId)) {
      setFormState({
        key_players: [
          { id: 1, name: '', position: '', rating: '', strengths: '' }
        ],
        match_stats: {
          possession: '',
          shots: '',
          shotsOnTarget: '',
          passes: '',
          passAccuracy: '',
          corners: '',
          fouls: ''
        },
        tactical_summary: {
          formation: '',
          overview: '',
          strengths: '',
          weaknesses: '',
        },
        performance_insights: '',
        status: 'in-progress',
      });
    }
  }, [teamId, report]);
  
  // Snackbar for save success
  useEffect(() => {
    if (saveSuccess) {
      setSnackbar({
        open: true,
        message: 'Report saved successfully!',
        severity: 'success'
      });
    }
  }, [saveSuccess]);

  const [team, setTeam] = useState(null);
  const tokens= useSelector((state) => state.auth.tokens);
  useEffect(() => {
    const fetchTeam = async () => {
      try {
      const res = await fetch(`/api/teams/${teamId}/`,{
        headers : {
          Authorization: 'Bearer ${tokens}',
        },
      });
      const data = await res.json();
      setTeam(data);
    } catch (err) {
      console.error('Failed to fetch team:', err);
    }
  };
    if (teamId) fetchTeam();
  }, [teamId, tokens]);

  
  // Form handlers
  const handleInputChange = (section, field, value) => {
    setFormState((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };
  
  const handlePlayerChange = (index, field, value) => {
    const updatedPlayers = [...formState.key_players];
    updatedPlayers[index] = {
      ...updatedPlayers[index],
      [field]: value
    };
    
    setFormState((prev) => ({
      ...prev,
      key_players: updatedPlayers
    }));
  };
  
  const addPlayer = () => {
    const newId = formState.key_players.length > 0 
      ? Math.max(...formState.key_players.map(p => p.id)) + 1 
      : 1;
    
    setFormState((prev) => ({
      ...prev,
      key_players: [
        ...prev.key_players,
        { id: newId, name: '', position: '', rating: '', strengths: '' }
      ]
    }));
  };
  
  const removePlayer = (index) => {
    const updatedPlayers = [...formState.key_players];
    updatedPlayers.splice(index, 1);
    
    setFormState((prev) => ({
      ...prev,
      key_players: updatedPlayers
    }));
  };
  
  const handleStatusChange = (event) => {
    setFormState((prev) => ({
      ...prev,
      status: event.target.value
    }));
  };
  
  const handleSimpleInputChange = (field, value) => {
    setFormState((prev) => ({
      ...prev,
      [field]: value
    }));
  };
  
  // Handle successful save
  const handleSuccessfulSave = () => {
    setSaveSuccess(true);
    // Refresh the report list in parent component
    dispatch(fetchReport(teamId));
  };
  
  const handleSave = async () => {
    try {
      if (report?.id) {
        console.log("SENDING updateReport:", {
  reportId: report.id,
  reportData: { ...formState, team_id: teamId }
});
        await dispatch(updateReport({ 
          reportId: report.id, 
          reportData: { ...formState, team_id: parseInt(teamId) } 
        })).unwrap();
      } else {
        await dispatch(createReport({ 
          ...formState, 
          team_id: parseInt(teamId) 
        })).unwrap();
      }
      handleSuccessfulSave();
    } catch (err) {
      let errorMessage = getErrorMessage(err);
      if (errorMessage.includes('unique') || errorMessage.includes('already exists')) {
        errorMessage = 'You have already created a report for this team. Please edit your existing report.';
      }
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: 'error',
      });
    }
  };
  
  const handleMarkComplete = async () => {
    const updatedData = { 
      ...formState, 
      status: 'completed'
    };
    
    setFormState(updatedData);
    
    try {
      if (report?.id) {
        await dispatch(updateReport({ 
          reportId: report.id, 
         reportData: { ...updatedData, team_id: parseInt(teamId) }
        })).unwrap();
      } else {
        await dispatch(createReport({ 
          ...updatedData, 
          team_id: teamId 
        })).unwrap();
      }
      handleSuccessfulSave();
    } catch (err) {
      setSnackbar({
        open: true,
        message: getErrorMessage(err),
        severity: 'error',
      });
    }
  };
  
  const handleBackClick = () => {
    navigate('/analyst-dashboard');
  };
  
  const handleSnackbarClose = () => {
    setSnackbar((prev) => ({
      ...prev,
      open: false
    }));
  };
  
  if (loading?.report && !report) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }
  
 if (error?.report && report !== null) {

  return (
    <Box sx={{ p: 3 }}>
      <Alert severity="error" sx={{ mb: 2 }}>
        {typeof error.report === 'string' ? error.report : JSON.stringify(error.report)}
      </Alert>
      <Button variant="contained" onClick={handleBackClick} startIcon={<BackIcon />}>
        Back to Dashboard
      </Button>
    </Box>
  );
}
  
  return (
    <Box sx={{ maxWidth: '1200px', mx: 'auto', p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
  {team ? `${team.name} Scout Report` : 'Loading Team Info...'}
</Typography>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleSnackbarClose} 
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {typeof snackbar.message === 'string' ? snackbar.message : JSON.stringify(snackbar.message)}
        </Alert>
      </Snackbar>
      
      <Paper 
        elevation={0}
        sx={{ 
          p: 3, 
          mb: 3, 
          borderRadius: 2,
          background: `linear-gradient(45deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.primary.main, 0.1)} 100%)`,
          border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`
        }}
      >
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 2, 
          justifyContent: 'space-between',
          flexWrap: 'wrap'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton 
              onClick={handleBackClick}
              sx={{ 
                bgcolor: alpha(theme.palette.primary.main, 0.1),
                '&:hover': {
                  bgcolor: alpha(theme.palette.primary.main, 0.2),
                }
              }}
            >
              <BackIcon />
            </IconButton>
            <Avatar 
              src={currentTeam?.logo} 
              alt={currentTeam?.name}
              sx={{ 
                width: 60, 
                height: 60,
                border: `2px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                bgcolor: 'background.paper'
              }}
            />
            <Box>
              <Typography variant="h4" component="h1" fontWeight="700">
                {currentTeam?.name} Scout Report
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                {formState.status === 'completed' ? 'Completed Report' : 'Draft Report'}
              </Typography>
            </Box>
          </Box>
          
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 2,
            flexWrap: 'wrap'
          }}>
            <FormControl 
              size="small" 
              sx={{ 
                minWidth: 150,
                '& .MuiOutlinedInput-root': {
                  bgcolor: 'background.paper'
                }
              }}
            >
              <InputLabel>Report Status</InputLabel>
              <Select
                value={formState.status}
                label="Report Status"
                onChange={handleStatusChange}
              >
                <MenuItem value="in-progress">
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <TimeIcon fontSize="small" color="warning" />
                    In Progress
                  </Box>
                </MenuItem>
                <MenuItem value="completed">
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CheckIcon fontSize="small" color="success" />
                    Completed
                  </Box>
                </MenuItem>
              </Select>
            </FormControl>
            
            <Button 
              variant="outlined" 
              startIcon={<SaveIcon />} 
              onClick={handleSave}
              disabled={loading?.create || loading?.update}
              sx={{
                bgcolor: 'background.paper',
                '&:hover': {
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                }
              }}
            >
              Save Draft
            </Button>
            
            <Button 
              variant="contained" 
              color="success" 
              onClick={handleMarkComplete}
              disabled={loading?.create || loading?.update}
              startIcon={<CheckIcon />}
              sx={{
                boxShadow: 2,
                '&:hover': {
                  boxShadow: 4,
                }
              }}
            >
              Mark as Complete
            </Button>
          </Box>
        </Box>
      </Paper>
      
      <Grid container spacing={3}>
        {/* Key Players Section */}
        <Grid item xs={12}>
          <Paper 
            sx={{ 
              p: 3,
              borderRadius: 2,
              border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
              bgcolor: 'background.paper'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <Avatar
                sx={{
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                  color: theme.palette.primary.main
                }}
              >
                <PersonIcon />
              </Avatar>
              <Typography variant="h6" fontWeight="600">
                Key Players
              </Typography>
            </Box>
            <Divider sx={{ mb: 3 }} />
            
            {formState.key_players.map((player, index) => (
              <Grid container spacing={2} key={player.id} sx={{ mb: 2 }}>
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    fullWidth
                    label="Player Name"
                    value={player.name}
                    onChange={(e) => handlePlayerChange(index, 'name', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={2}>
                  <TextField
                    fullWidth
                    label="Position"
                    value={player.position}
                    onChange={(e) => handlePlayerChange(index, 'position', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={2}>
                  <TextField
                    fullWidth
                    label="Rating (0-10)"
                    type="number"
                    InputProps={{ inputProps: { min: 0, max: 10, step: 0.1 } }}
                    value={player.rating}
                    onChange={(e) => handlePlayerChange(index, 'rating', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    fullWidth
                    label="Key Strengths"
                    value={player.strengths}
                    onChange={(e) => handlePlayerChange(index, 'strengths', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} md={1} sx={{ display: 'flex', alignItems: 'center' }}>
                  <IconButton 
                    color="error" 
                    onClick={() => removePlayer(index)}
                    disabled={formState.key_players.length <= 1}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Grid>
              </Grid>
            ))}
            
            <Button 
              startIcon={<AddPlayerIcon />} 
              onClick={addPlayer}
              variant="outlined"
              sx={{ mt: 1 }}
            >
              Add Player
            </Button>
          </Paper>
        </Grid>
        
        {/* Match Stats Section */}
        <Grid item xs={12} md={6}>
          <Paper 
            sx={{ 
              p: 3,
              borderRadius: 2,
              border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
              bgcolor: 'background.paper'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <Avatar
                sx={{
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                  color: theme.palette.primary.main
                }}
              >
                <AddIcon />
              </Avatar>
              <Typography variant="h6" fontWeight="600">
                Match Stats
              </Typography>
            </Box>
            <Divider sx={{ mb: 3 }} />
            
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Possession (%)"
                  type="number"
                  InputProps={{ inputProps: { min: 0, max: 100 } }}
                  value={formState.match_stats.possession}
                  onChange={(e) => handleInputChange('match_stats', 'possession', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Shots"
                  type="number"
                  InputProps={{ inputProps: { min: 0 } }}
                  value={formState.match_stats.shots}
                  onChange={(e) => handleInputChange('match_stats', 'shots', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Shots On Target"
                  type="number"
                  InputProps={{ inputProps: { min: 0 } }}
                  value={formState.match_stats.shotsOnTarget}
                  onChange={(e) => handleInputChange('match_stats', 'shotsOnTarget', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Total Passes"
                  type="number"
                  InputProps={{ inputProps: { min: 0 } }}
                  value={formState.match_stats.passes}
                  onChange={(e) => handleInputChange('match_stats', 'passes', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Pass Accuracy (%)"
                  type="number"
                  InputProps={{ inputProps: { min: 0, max: 100 } }}
                  value={formState.match_stats.passAccuracy}
                  onChange={(e) => handleInputChange('match_stats', 'passAccuracy', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Corners"
                  type="number"
                  InputProps={{ inputProps: { min: 0 } }}
                  value={formState.match_stats.corners}
                  onChange={(e) => handleInputChange('match_stats', 'corners', e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Fouls"
                  type="number"
                  InputProps={{ inputProps: { min: 0 } }}
                  value={formState.match_stats.fouls}
                  onChange={(e) => handleInputChange('match_stats', 'fouls', e.target.value)}
                />
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        
        {/* Tactical Summary */}
        <Grid item xs={12} md={6}>
          <Paper 
            sx={{ 
              p: 3,
              borderRadius: 2,
              border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
              bgcolor: 'background.paper'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <Avatar
                sx={{
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                  color: theme.palette.primary.main
                }}
              >
                <FormationIcon />
              </Avatar>
              <Typography variant="h6" fontWeight="600">
                Tactical Summary
              </Typography>
            </Box>
            <Divider sx={{ mb: 3 }} />
            
            <Grid container spacing={2}>
              <Grid item xs={12} sx={{ mb: 1 }}>
                <FormControl fullWidth>
                  <InputLabel>Formation</InputLabel>
                  <Select
                    value={formState.tactical_summary.formation}
                    label="Formation"
                    onChange={(e) => handleInputChange('tactical_summary', 'formation', e.target.value)}
                    startAdornment={<FormationIcon sx={{ ml: 2, mr: 1, color: 'action.active' }} />}
                  >
                    <MenuItem value="4-4-2">4-4-2</MenuItem>
                    <MenuItem value="4-3-3">4-3-3</MenuItem>
                    <MenuItem value="4-2-3-1">4-2-3-1</MenuItem>
                    <MenuItem value="3-5-2">3-5-2</MenuItem>
                    <MenuItem value="3-4-3">3-4-3</MenuItem>
                    <MenuItem value="5-3-2">5-3-2</MenuItem>
                    <MenuItem value="5-4-1">5-4-1</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Tactical Overview"
                  multiline
                  rows={4}
                  value={formState.tactical_summary.overview}
                  onChange={(e) => handleInputChange('tactical_summary', 'overview', e.target.value)}
                  helperText="Describe the team's playing style and tactical approach"
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Strengths"
                  multiline
                  rows={3}
                  value={formState.tactical_summary.strengths}
                  onChange={(e) => handleInputChange('tactical_summary', 'strengths', e.target.value)}
                  helperText="List the team's tactical strengths"
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Weaknesses"
                  multiline
                  rows={3}
                  value={formState.tactical_summary.weaknesses}
                  onChange={(e) => handleInputChange('tactical_summary', 'weaknesses', e.target.value)}
                  helperText="List the team's tactical vulnerabilities"
                />
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        
        {/* Performance Insights */}
        <Grid item xs={12}>
          <Paper 
            sx={{ 
              p: 3,
              borderRadius: 2,
              border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
              bgcolor: 'background.paper'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <Avatar
                sx={{
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                  color: theme.palette.primary.main
                }}
              >
                <PersonIcon />
              </Avatar>
              <Typography variant="h6" fontWeight="600">
                Performance Insights & Recommendations
              </Typography>
            </Box>
            <Divider sx={{ mb: 3 }} />
            
            <TextField
              fullWidth
              label="Performance Analysis & Recommendations"
              multiline
              rows={6}
              value={formState.performance_insights}
              onChange={(e) => handleSimpleInputChange('performance_insights', e.target.value)}
              helperText="Provide detailed insights on the team's performance and specific recommendations for approaching a match against them"
            />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ReportEditor; 