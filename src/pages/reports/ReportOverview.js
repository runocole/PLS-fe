import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchReport } from '../../store/slices/reportsSlice';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Chip,
  Divider,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Card,
  CardContent,
  LinearProgress,
  IconButton,
  useTheme,
  alpha,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Person as PlayerIcon,
  AutoGraph as StatsIcon,
  EmojiEvents as PerformanceIcon,
  Schema as TacticalIcon,
  ArrowBack as BackIcon,
  BarChart as BarChartIcon,
  TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const ReportOverview = () => {
  const { teamId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const theme = useTheme();
  
  // Get reports and team data from store
  const { currentReport: report, loading, error } = useSelector((state) => state.reports);
  const { teams } = useSelector((state) => state.teams);
  
  // Find the current team based on teamId
  const currentTeam = teams?.find(team => team?.id === parseInt(teamId)) || {
    id: parseInt(teamId),
    name: 'Unknown Team',
    logo: '/logos/default.png',
    color: theme.palette.primary.main
  };
  
  // Prepare chart data from real report data
  const prepareChartData = () => {
    if (!report || !report.match_stats) return null;

    const stats = report.match_stats;
    
    const barData = {
      labels: ['Possession', 'Shots', 'Passes', 'Pass Accuracy', 'Corners', 'Fouls'],
      datasets: [
        {
          label: currentTeam?.name || 'Team',
          data: [
            stats.possession,
            stats.shots,
            stats.passes,
            stats.passAccuracy,
            stats.corners,
            stats.fouls
          ],
          backgroundColor: alpha(currentTeam?.color || theme.palette.primary.main, 0.8),
        }
      ],
    };

    const pieData = {
      labels: ['Successful Passes', 'Failed Passes'],
      datasets: [
        {
          data: [
            stats.passAccuracy,
            100 - stats.passAccuracy,
          ],
          backgroundColor: [theme.palette.success.main, theme.palette.error.main],
          borderColor: [theme.palette.success.light, theme.palette.error.light],
          borderWidth: 1,
        },
      ],
    };

    return { barData, pieData };
  };

  const chartData = prepareChartData();
  
  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
      }
    },
    plugins: {
      legend: {
        position: 'top',
      },
    },
  };
  
  // Fetch team report on component mount
  useEffect(() => {
  dispatch(fetchReports()).then((action) => {
    if (action.payload) {
      const reportForTeam = action.payload.find(r => r.team === parseInt(teamId));
      if (reportForTeam) {
        dispatch(fetchReport(reportForTeam.id));
      }
    }
  });
}, [dispatch, teamId]);
  
  const handleBackClick = () => {
    navigate('/dashboard');
  };
  
  if (loading?.report) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }
  
  if (error?.report) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error.report}
        </Alert>
        <Button variant="contained" onClick={handleBackClick} startIcon={<BackIcon />}>
          Back to Dashboard
        </Button>
      </Box>
    );
  }
  
  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
        <IconButton onClick={handleBackClick} sx={{ mr: 1 }}>
          <BackIcon />
        </IconButton>
        <Avatar 
          src={currentTeam?.logo} 
          alt={currentTeam?.name}
          sx={{ width: 50, height: 50 }}
        />
        <Typography variant="h4" component="h1" fontWeight="700">
          {currentTeam.name} Scouting Report
        </Typography>
      </Box>
      
      <Grid container spacing={3}>
        {/* Key Players Section */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <PlayerIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
              <Typography variant="h6" fontWeight="600">
                Key Players
              </Typography>
            </Box>
            <Divider sx={{ mb: 2 }} />
            
            <List>
              {report?.key_players?.map((player) => (
                <ListItem key={player.id}>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: alpha(currentTeam.color, 0.8) }}>
                      <PlayerIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="subtitle1" fontWeight="medium">
                          {player.name}
                        </Typography>
                        <Chip 
                          label={`Rating: ${player.rating}`} 
                          size="small" 
                          color={player.rating > 8 ? "success" : "primary"} 
                          variant="outlined" 
                        />
                      </Box>
                    }
                    secondary={
                      <>
                        <Typography variant="body2" color="text.secondary">
                          {player.position}
                        </Typography>
                        <Typography variant="body2">
                          <strong>Strengths:</strong> {player.strengths}
                        </Typography>
                      </>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
        
        {/* Match Stats Section */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <StatsIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
              <Typography variant="h6" fontWeight="600">
                Match Stats
              </Typography>
            </Box>
            <Divider sx={{ mb: 2 }} />
            
            <Box sx={{ height: 300 }}>
              {chartData && <Bar data={chartData.barData} options={barOptions} />}
            </Box>
          </Paper>
        </Grid>
        
        {/* Tactical Summary */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <TacticalIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
              <Typography variant="h6" fontWeight="600">
                Tactical Summary
              </Typography>
            </Box>
            <Divider sx={{ mb: 2 }} />
            
            <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
              Formation: {report?.tactical_summary?.formation || 'Not specified'}
            </Typography>
            
            <Typography variant="body1" paragraph>
              {report?.tactical_summary?.overview || 'No tactical overview available.'}
            </Typography>
            
            <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
              Strengths
            </Typography>
            
            <Typography variant="body1" paragraph>
              {report?.tactical_summary?.strengths || 'No strengths specified.'}
            </Typography>
            
            <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
              Weaknesses
            </Typography>
            
            <Typography variant="body1">
              {report?.tactical_summary?.weaknesses || 'No weaknesses specified.'}
            </Typography>
          </Paper>
        </Grid>
        
        {/* Performance Insights */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <PerformanceIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
              <Typography variant="h6" fontWeight="600">
                Performance Insights
              </Typography>
            </Box>
            <Divider sx={{ mb: 2 }} />
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="subtitle2" color="text.secondary">
                      Passing Accuracy
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="h5" fontWeight="bold">
                        {report?.match_stats?.passAccuracy || 0}%
                      </Typography>
                      <Chip label="+5% vs League Avg" size="small" color="success" />
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={report?.match_stats?.passAccuracy || 0} 
                      sx={{ height: 8, borderRadius: 5 }} 
                      color="success"
                    />
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="subtitle2" color="text.secondary">
                      Shot Conversion
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="h5" fontWeight="bold">
                        {report?.match_stats?.shotsOnTarget ? 
                          Math.round((report.match_stats.shotsOnTarget / report.match_stats.shots) * 100) : 0}%
                      </Typography>
                      <Chip label="+2% vs League Avg" size="small" color="success" />
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={report?.match_stats?.shotsOnTarget ? 
                        Math.round((report.match_stats.shotsOnTarget / report.match_stats.shots) * 100) : 0} 
                      sx={{ height: 8, borderRadius: 5 }} 
                      color="warning"
                    />
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12}>
                <Box sx={{ height: 200, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  {chartData && <Pie data={chartData.pieData} />}
                </Box>
              </Grid>
              
              <Grid item xs={12}>
                <Typography variant="subtitle1" fontWeight="medium">
                  Key Recommendations:
                </Typography>
                <Typography variant="body1">
                  {report?.performance_insights || 'No performance insights available.'}
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ReportOverview; 