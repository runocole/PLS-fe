import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTeams } from '../../store/slices/teamsSlice';
import { fetchReport } from '../../store/slices/reportsSlice';
import {
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Rating,
  FormHelperText,
  Tabs,
  Tab,
  Divider,
  Avatar,
  Chip,
  IconButton,
  Card,
  CardContent,
  CardHeader,
  useTheme,
  alpha,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  Save as SaveIcon,
  Upload as UploadIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  SportsSoccer,
  BarChart,
  ImageOutlined,
  TextFields,
  FormatListBulleted,
  PieChart,
} from '@mui/icons-material';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const ScoutingReport = () => {
  const { teamId, reportId } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState(0);
  const [activeStep, setActiveStep] = useState(0);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState(null);
  
  const dispatch = useDispatch();
  const { teams, loading: teamsLoading } = useSelector((state) => state.teams);
  const { currentReport, loading: reportLoading } = useSelector((state) => state.reports);
  
  // Form data for different analysis sections
  const [basicInfo, setBasicInfo] = useState({
    date: new Date().toISOString().split('T')[0],
    competition: 'Premier League',
    venue: '',
    formation: '4-3-3',
    overallRating: 0,
  });
  
  const [inPossession, setInPossession] = useState({
    content: '',
    buildUpPlay: '',
    finalThird: '',
    setPlays: '',
    stats: {
      possession: 0,
      passAccuracy: 0,
      shotsOnTarget: 0,
      goals: 0,
    }
  });
  
  const [outOfPossession, setOutOfPossession] = useState({
    content: '',
    defensiveShape: '',
    pressing: '',
    transition: '',
    stats: {
      tackles: 0,
      interceptions: 0,
      clearances: 0,
      saves: 0,
    }
  });
  
  const [pressingSystem, setPressingSystem] = useState({
    content: '',
    triggerPoints: '',
    coverShadows: '',
    intensity: '',
    stats: {
      pressureApplied: 0,
      ballRecoveries: 0,
      counterAttacks: 0,
      pressSuccess: 0,
    }
  });
  
  // Load teams and report data
  useEffect(() => {
    const loadData = async () => {
      try {
        if (!teams || teams.length === 0) {
          await dispatch(fetchTeams()).unwrap();
        }
        if (reportId) {
          await dispatch(fetchReport(reportId)).unwrap();
        }
      } catch (error) {
        console.error('Failed to load data:', error);
        setError('Failed to load report data. Please try again.');
      }
    };
    loadData();
  }, [dispatch, teams, reportId]);
  
  // Set initial form data when report loads
  useEffect(() => {
    if (currentReport) {
      const { basic_info, in_possession, out_of_possession, pressing_system } = currentReport;
      
      if (basic_info) {
        setBasicInfo(prev => ({
          ...prev,
          ...basic_info
        }));
      }
      
      if (in_possession) {
        setInPossession(prev => ({
          ...prev,
          ...in_possession
        }));
      }
      
      if (out_of_possession) {
        setOutOfPossession(prev => ({
          ...prev,
          ...out_of_possession
        }));
      }
      
      if (pressing_system) {
        setPressingSystem(prev => ({
          ...prev,
          ...pressing_system
        }));
      }
    }
  }, [currentReport]);
  
  // Find selected team when teams are loaded
  useEffect(() => {
    if (teamId && teams?.length > 0) {
      const team = teams.find(team => team.id === parseInt(teamId));
      if (team) {
        setSelectedTeam(team);
      } else {
        setError('Team not found');
        // Don't navigate away immediately to allow error to be shown
      }
    }
  }, [teamId, teams]);
  
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };
  
  const handleBasicInfoChange = (e) => {
    const { name, value } = e.target;
    setBasicInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleRichTextChange = (section, value) => {
    switch(section) {
      case 'inPossession':
        setInPossession(prev => ({ ...prev, content: value }));
        break;
      case 'outOfPossession':
        setOutOfPossession(prev => ({ ...prev, content: value }));
        break;
      case 'pressingSystem':
        setPressingSystem(prev => ({ ...prev, content: value }));
        break;
      default:
        break;
    }
  };
  
  const handleStatChange = (section, stat, value) => {
    const numValue = parseFloat(value);
    switch(section) {
      case 'inPossession':
        setInPossession(prev => ({
          ...prev,
          stats: { ...prev.stats, [stat]: numValue }
        }));
        break;
      case 'outOfPossession':
        setOutOfPossession(prev => ({
          ...prev,
          stats: { ...prev.stats, [stat]: numValue }
        }));
        break;
      case 'pressingSystem':
        setPressingSystem(prev => ({
          ...prev,
          stats: { ...prev.stats, [stat]: numValue }
        }));
        break;
      default:
        break;
    }
  };
  
  const handleNextStep = () => {
    setActiveStep((prevStep) => prevStep + 1);
    setActiveTab((prevTab) => prevTab + 1);
  };
  
  const handleBackStep = () => {
    setActiveStep((prevStep) => prevStep - 1);
    setActiveTab((prevTab) => prevTab - 1);
  };
  
  const handleSaveReport = async () => {
    setIsSaving(true);
    setError(null);
    
    try {
      const reportData = {
        team: selectedTeam?.id,
        basic_info: basicInfo,
        in_possession: inPossession,
        out_of_possession: outOfPossession,
        pressing_system: pressingSystem
      };
      
      if (reportId) {
        await dispatch(updateReport({ reportId, reportData })).unwrap();
      } else {
        await dispatch(createReport(reportData)).unwrap();
      }
      
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error('Failed to save report:', error);
      setError('Failed to save report. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };
  
  // Create data for possession chart
  const possessionData = {
    labels: ['Your Team', 'Opposition'],
    datasets: [
      {
        data: [inPossession.stats.possession, 100 - inPossession.stats.possession],
        backgroundColor: [selectedTeam?.color || '#3f51b5', '#e0e0e0'],
        borderWidth: 0,
      },
    ],
  };
  
  // Create data for defensive stats chart
  const defensiveData = {
    labels: ['Tackles', 'Interceptions', 'Clearances', 'Saves'],
    datasets: [
      {
        label: 'Defensive Actions',
        data: [
          outOfPossession.stats.tackles, 
          outOfPossession.stats.interceptions,
          outOfPossession.stats.clearances,
          outOfPossession.stats.saves
        ],
        backgroundColor: selectedTeam?.color || '#3f51b5',
      },
    ],
  };
  
  const defensiveOptions = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };
  
  // Rich text editor modules
  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['link', 'image'],
      ['clean']
    ],
  };
  
  // Render team header
  const renderTeamHeader = () => {
    if (!selectedTeam) return null;
    
    return (
      <Paper 
        sx={{ 
          p: 3, 
          mb: 3, 
          display: 'flex', 
          alignItems: 'center',
          background: `linear-gradient(90deg, ${alpha(selectedTeam.color, 0.1)} 0%, rgba(0,0,0,0) 100%)`,
          borderLeft: `6px solid ${selectedTeam.color}`,
        }}
      >
        <Avatar 
          src={selectedTeam.logo} 
          alt={selectedTeam.name}
          sx={{ width: 80, height: 80, mr: 3 }}
        />
        <Box>
          <Typography variant="h4" fontWeight="bold">
            {selectedTeam.name} Scouting Report
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Create a comprehensive tactical analysis for {selectedTeam.name}
          </Typography>
        </Box>
        <Button 
          variant="contained"
          startIcon={<SaveIcon />}
          sx={{ 
            ml: 'auto',
            background: selectedTeam.color,
            '&:hover': {
              background: alpha(selectedTeam.color, 0.8),
            }
          }}
          onClick={handleSaveReport}
          disabled={isSaving}
        >
          {isSaving ? 'Saving...' : 'Save Report'}
        </Button>
      </Paper>
    );
  };
  
  // Render stepper
  const renderStepper = () => (
    <Stepper activeStep={activeStep} orientation="horizontal" sx={{ mb: 4 }}>
      <Step>
        <StepLabel>Basic Information</StepLabel>
      </Step>
      <Step>
        <StepLabel>In Possession Analysis</StepLabel>
      </Step>
      <Step>
        <StepLabel>Out of Possession Analysis</StepLabel>
      </Step>
      <Step>
        <StepLabel>Pressing System Analysis</StepLabel>
      </Step>
    </Stepper>
  );
  
  if (teamsLoading || reportLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3}>
        <Alert severity="error">{error}</Alert>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/reports')}
          sx={{ mt: 2 }}
        >
          Back to Reports
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      {renderTeamHeader()}
      
      {saveSuccess && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Report saved successfully!
        </Alert>
      )}
      
      {renderStepper()}
      
      <Paper sx={{ mb: 3 }}>
        <Tabs 
          value={activeTab} 
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ 
            borderBottom: 1, 
            borderColor: 'divider',
            '& .MuiTab-root': {
              minHeight: 64,
            }
          }}
        >
          <Tab 
            label="Basic Information" 
            icon={<SportsSoccer />} 
            iconPosition="start"
          />
          <Tab 
            label="In Possession" 
            icon={<BarChart />} 
            iconPosition="start"
          />
          <Tab 
            label="Out of Possession" 
            icon={<FormatListBulleted />} 
            iconPosition="start"
          />
          <Tab 
            label="Pressing System" 
            icon={<PieChart />} 
            iconPosition="start"
          />
        </Tabs>
        
        {/* Basic Information Tab */}
        {activeTab === 0 && (
          <Box sx={{ p: 3 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="date"
                  label="Date"
                  name="date"
                  value={basicInfo.date}
                  onChange={handleBasicInfoChange}
                  InputLabelProps={{ shrink: true }}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Competition"
                  name="competition"
                  value={basicInfo.competition}
                  onChange={handleBasicInfoChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Venue"
                  name="venue"
                  value={basicInfo.venue}
                  onChange={handleBasicInfoChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel>Formation</InputLabel>
                  <Select
                    name="formation"
                    value={basicInfo.formation}
                    onChange={handleBasicInfoChange}
                    label="Formation"
                  >
                    <MenuItem value="4-4-2">4-4-2</MenuItem>
                    <MenuItem value="4-3-3">4-3-3</MenuItem>
                    <MenuItem value="3-5-2">3-5-2</MenuItem>
                    <MenuItem value="4-2-3-1">4-2-3-1</MenuItem>
                    <MenuItem value="5-3-2">5-3-2</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <Box>
                  <Typography component="legend">Overall Team Rating</Typography>
                  <Rating
                    name="overallRating"
                    value={basicInfo.overallRating}
                    onChange={(event, newValue) => {
                      setBasicInfo(prev => ({
                        ...prev,
                        overallRating: newValue,
                      }));
                    }}
                    size="large"
                    max={10}
                  />
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    {basicInfo.overallRating === 0 ? 'Not rated yet' : `${basicInfo.overallRating}/10`}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                <Button 
                  variant="contained" 
                  onClick={handleNextStep}
                  sx={{ 
                    background: selectedTeam?.color || theme.palette.primary.main,
                    '&:hover': {
                      background: selectedTeam ? alpha(selectedTeam.color, 0.8) : theme.palette.primary.dark,
                    }
                  }}
                >
                  Next: In Possession Analysis
                </Button>
              </Grid>
            </Grid>
          </Box>
        )}
        
        {/* In Possession Tab */}
        {activeTab === 1 && (
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>In Possession Analysis</Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Analyze how the team plays when they have the ball, including build-up play, attacking patterns, and final third actions.
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Card variant="outlined" sx={{ mb: 3 }}>
                  <CardHeader title="Tactical Analysis" />
                  <CardContent>
                    <ReactQuill
                      theme="snow"
                      value={inPossession.content}
                      onChange={(value) => handleRichTextChange('inPossession', value)}
                      modules={modules}
                      placeholder="Enter your tactical analysis of the team's in-possession play..."
                      style={{ height: '200px', marginBottom: '50px' }}
                    />
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Card variant="outlined">
                  <CardHeader title="Key Statistics" />
                  <CardContent>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <TextField
                          fullWidth
                          label="Possession %"
                          type="number"
                          InputProps={{ inputProps: { min: 0, max: 100 } }}
                          value={inPossession.stats.possession}
                          onChange={(e) => handleStatChange('inPossession', 'possession', e.target.value)}
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <TextField
                          fullWidth
                          label="Pass Accuracy %"
                          type="number"
                          InputProps={{ inputProps: { min: 0, max: 100 } }}
                          value={inPossession.stats.passAccuracy}
                          onChange={(e) => handleStatChange('inPossession', 'passAccuracy', e.target.value)}
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <TextField
                          fullWidth
                          label="Shots on Target"
                          type="number"
                          InputProps={{ inputProps: { min: 0 } }}
                          value={inPossession.stats.shotsOnTarget}
                          onChange={(e) => handleStatChange('inPossession', 'shotsOnTarget', e.target.value)}
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <TextField
                          fullWidth
                          label="Goals"
                          type="number"
                          InputProps={{ inputProps: { min: 0 } }}
                          value={inPossession.stats.goals}
                          onChange={(e) => handleStatChange('inPossession', 'goals', e.target.value)}
                        />
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Card variant="outlined" sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardHeader title="Possession Visualization" />
                  <CardContent sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Box sx={{ height: 200, width: 200 }}>
                      <Pie data={possessionData} />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
                <Button 
                  variant="outlined" 
                  onClick={handleBackStep}
                >
                  Back: Basic Information
                </Button>
                <Button 
                  variant="contained" 
                  onClick={handleNextStep}
                  sx={{ 
                    background: selectedTeam?.color || theme.palette.primary.main,
                    '&:hover': {
                      background: selectedTeam ? alpha(selectedTeam.color, 0.8) : theme.palette.primary.dark,
                    }
                  }}
                >
                  Next: Out of Possession Analysis
                </Button>
              </Grid>
            </Grid>
          </Box>
        )}
        
        {/* Out of Possession Tab */}
        {activeTab === 2 && (
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Out of Possession Analysis</Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Analyze the team's defensive shape, pressing triggers, and transition to defense.
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Card variant="outlined" sx={{ mb: 3 }}>
                  <CardHeader title="Defensive Analysis" />
                  <CardContent>
                    <ReactQuill
                      theme="snow"
                      value={outOfPossession.content}
                      onChange={(value) => handleRichTextChange('outOfPossession', value)}
                      modules={modules}
                      placeholder="Enter your tactical analysis of the team's defensive play..."
                      style={{ height: '200px', marginBottom: '50px' }}
                    />
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Card variant="outlined">
                  <CardHeader title="Defensive Statistics" />
                  <CardContent>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <TextField
                          fullWidth
                          label="Tackles"
                          type="number"
                          InputProps={{ inputProps: { min: 0 } }}
                          value={outOfPossession.stats.tackles}
                          onChange={(e) => handleStatChange('outOfPossession', 'tackles', e.target.value)}
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <TextField
                          fullWidth
                          label="Interceptions"
                          type="number"
                          InputProps={{ inputProps: { min: 0 } }}
                          value={outOfPossession.stats.interceptions}
                          onChange={(e) => handleStatChange('outOfPossession', 'interceptions', e.target.value)}
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <TextField
                          fullWidth
                          label="Clearances"
                          type="number"
                          InputProps={{ inputProps: { min: 0 } }}
                          value={outOfPossession.stats.clearances}
                          onChange={(e) => handleStatChange('outOfPossession', 'clearances', e.target.value)}
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <TextField
                          fullWidth
                          label="Saves"
                          type="number"
                          InputProps={{ inputProps: { min: 0 } }}
                          value={outOfPossession.stats.saves}
                          onChange={(e) => handleStatChange('outOfPossession', 'saves', e.target.value)}
                        />
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Card variant="outlined" sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardHeader title="Defensive Actions" />
                  <CardContent sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Box sx={{ height: 200, width: '100%' }}>
                      <Bar data={defensiveData} options={defensiveOptions} />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
                <Button 
                  variant="outlined" 
                  onClick={handleBackStep}
                >
                  Back: In Possession Analysis
                </Button>
                <Button 
                  variant="contained" 
                  onClick={handleNextStep}
                  sx={{ 
                    background: selectedTeam?.color || theme.palette.primary.main,
                    '&:hover': {
                      background: selectedTeam ? alpha(selectedTeam.color, 0.8) : theme.palette.primary.dark,
                    }
                  }}
                >
                  Next: Pressing System Analysis
                </Button>
              </Grid>
            </Grid>
          </Box>
        )}
        
        {/* Pressing System Tab */}
        {activeTab === 3 && (
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Pressing System Analysis</Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Analyze the team's pressing triggers, intensity, and effectiveness in winning the ball back.
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Card variant="outlined" sx={{ mb: 3 }}>
                  <CardHeader title="Pressing Analysis" />
                  <CardContent>
                    <ReactQuill
                      theme="snow"
                      value={pressingSystem.content}
                      onChange={(value) => handleRichTextChange('pressingSystem', value)}
                      modules={modules}
                      placeholder="Enter your tactical analysis of the team's pressing system..."
                      style={{ height: '200px', marginBottom: '50px' }}
                    />
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Card variant="outlined">
                  <CardHeader title="Pressing Statistics" />
                  <CardContent>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <TextField
                          fullWidth
                          label="Pressure Applied"
                          type="number"
                          InputProps={{ inputProps: { min: 0 } }}
                          value={pressingSystem.stats.pressureApplied}
                          onChange={(e) => handleStatChange('pressingSystem', 'pressureApplied', e.target.value)}
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <TextField
                          fullWidth
                          label="Ball Recoveries"
                          type="number"
                          InputProps={{ inputProps: { min: 0 } }}
                          value={pressingSystem.stats.ballRecoveries}
                          onChange={(e) => handleStatChange('pressingSystem', 'ballRecoveries', e.target.value)}
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <TextField
                          fullWidth
                          label="Counter Attacks"
                          type="number"
                          InputProps={{ inputProps: { min: 0 } }}
                          value={pressingSystem.stats.counterAttacks}
                          onChange={(e) => handleStatChange('pressingSystem', 'counterAttacks', e.target.value)}
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <TextField
                          fullWidth
                          label="Press Success %"
                          type="number"
                          InputProps={{ inputProps: { min: 0, max: 100 } }}
                          value={pressingSystem.stats.pressSuccess}
                          onChange={(e) => handleStatChange('pressingSystem', 'pressSuccess', e.target.value)}
                        />
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Card variant="outlined">
                  <CardHeader title="Upload Tactical Images" />
                  <CardContent>
                    <Box sx={{ 
                      border: '2px dashed #ccc', 
                      borderRadius: 2, 
                      p: 3, 
                      textAlign: 'center',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                      <ImageOutlined sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                      <Typography variant="body1" gutterBottom>
                        Drop tactical diagrams here or click to upload
                      </Typography>
                      <Button 
                        variant="outlined" 
                        startIcon={<UploadIcon />}
                        sx={{ mt: 2 }}
                      >
                        Upload Images
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
                <Button 
                  variant="outlined" 
                  onClick={handleBackStep}
                >
                  Back: Out of Possession Analysis
                </Button>
                <Button 
                  variant="contained"
                  startIcon={<SaveIcon />}
                  onClick={handleSaveReport}
                  disabled={isSaving}
                  sx={{ 
                    background: selectedTeam?.color || theme.palette.primary.main,
                    '&:hover': {
                      background: selectedTeam ? alpha(selectedTeam.color, 0.8) : theme.palette.primary.dark,
                    }
                  }}
                >
                  {isSaving ? 'Saving Report...' : 'Save Complete Report'}
                </Button>
              </Grid>
            </Grid>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default ScoutingReport;