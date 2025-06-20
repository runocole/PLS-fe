import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTeams } from '../../store/slices/teamsSlice';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Chip,
  Paper,
  alpha,
  useTheme,
  Avatar,
  AppBar,
  Toolbar,
  IconButton,
  Badge,
  Menu,
  MenuItem,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
} from '@mui/material';
import {
  Edit as EditIcon,
  AddCircle as AddIcon,
  SportsSoccer as SoccerIcon,
  Notifications as NotificationIcon,
  AccountCircle as ProfileIcon,
  AccessTime as InProgressIcon,
  Check as CompletedIcon,
  MoreHoriz as NotStartedIcon,
} from '@mui/icons-material';


// Mock recent activities data
const recentActivities = [
  { id: 1, message: "Updated Manchester City scouting report", time: "2 hours ago" },
  { id: 2, message: "Created new Liverpool performance analysis", time: "Yesterday" },
  { id: 3, message: "Marked Arsenal report as complete", time: "2 days ago" },
  { id: 4, message: "Added Chelsea tactical overview", time: "3 days ago" },
];


// Status chip component
const StatusChip = ({ status }) => {
  let color, label, icon;
  
  switch(status) {
    case 'completed':
      color = 'success';
      label = 'Completed';
      icon = <CompletedIcon />;
      break;
    case 'in-progress':
      color = 'warning';
      label = 'In Progress';
      icon = <InProgressIcon />;
      break;
    default:
      color = 'error';
      label = 'Not Started';
      icon = <NotStartedIcon />;
  }
  
  return (
    <Chip 
      icon={icon}
      label={label}
      size="small"
      color={color}
      variant="filled"
    />
  );
};

// Team card component
const TeamCard = ({ team, status, onCreateReport }) => {
  const theme = useTheme();

  return (
    <Card 
      sx={{ 
        height: '100%',
        display: 'flex', 
        flexDirection: 'column',
        transition: 'transform 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: `0 8px 20px ${alpha(team.color, 0.3)}`,
        },
      }}
    >
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center',
        alignItems: 'center',
        p: 2,
        pt: 3
      }}>
        <Avatar 
          src={team.logo} 
          alt={team.name} 
          sx={{ 
            width: 60, 
            height: 60,
            boxShadow: 1
          }} 
        />
      </Box>
      
      <CardContent sx={{ pt: 1, pb: 2, flexGrow: 1, textAlign: 'center' }}>
        <Typography variant="h6" component="div" sx={{ fontWeight: 700, mb: 1 }}>
          {team.name}
        </Typography>
        
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
          <StatusChip status={status} />
        </Box>
        
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {status === 'completed' 
            ? 'All scouting reports are complete' 
            : status === 'in-progress' 
              ? 'Scouting report in progress'
              : 'No scouting reports started'}
        </Typography>
        
        <Box sx={{ mt: 'auto' }}>
          <Button 
            variant="contained" 
            fullWidth 
            startIcon={status === 'not-started' ? <AddIcon /> : <EditIcon />}
            onClick={() => onCreateReport(team.id)}
            sx={{ 
              background: `linear-gradient(45deg, ${team.color} 30%, ${alpha(team.color, 0.8)} 90%)`,
              boxShadow: `0px 3px 10px ${alpha(team.color, 0.5)}`,
            }}
          >
            {status === 'not-started' ? 'Create Report' : 'Edit Report'}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};


// Main AnalystDashboard component
const AnalystDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { teams, loading } = useSelector((state) => state.teams);
  
  // State for notification and profile menus
  const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);
  const [profileAnchorEl, setProfileAnchorEl] = useState(null);

  const [teamStatuses, setTeamStatuses] = useState({});
  const tokens = useSelector((state) => state.auth.tokens);

  // Fetch teams data on component mount
  useEffect(() => {
    dispatch(fetchTeams());
  }, [dispatch]);

  useEffect(() => {
    const fetchStatuses = async () => {
      if (!teams || teams.length === 0) return;
      const results = {};
      for (const team of teams) {
        try {
          const res = await fetch(`/api/reports/team/${team.id}/`, {
            headers: {
              Authorization: `Bearer ${tokens}`,
            },
          });
          const data = await res.json();
          if (Array.isArray(data)) {
            if (data.length === 0) {
              results[team.id] = 'not-started';
            } else if (data.some(r => r.status !== 'completed')) {
              results[team.id] = 'in-progress';
            } else {
              results[team.id] = 'completed';
            }
          } else {
            results[team.id] = 'not-started';
          }
        } catch (e) {
          results[team.id] = 'not-started';
        }
      }
      setTeamStatuses(results);
    };
    fetchStatuses();
  }, [teams, tokens]);

  // Navigation handler for creating/editing reports
  const handleCreateReport = (teamId) => {
    navigate(`/report-editor/${teamId}`);
  };
  
  // Handlers for notification menu
  const handleNotificationMenuOpen = (event) => {
    setNotificationAnchorEl(event.currentTarget);
  };

  const handleNotificationMenuClose = () => {
    setNotificationAnchorEl(null);
  };

  // Handlers for profile menu
  const handleProfileMenuOpen = (event) => {
    setProfileAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setProfileAnchorEl(null);
  };

  const user = useSelector((state) => state.auth.user);

  return (
    <Box>

      {/* Notification Menu */}
      <Menu
        id="notification-menu"
        anchorEl={notificationAnchorEl}
        keepMounted
        open={Boolean(notificationAnchorEl)}
        onClose={handleNotificationMenuClose}
        PaperProps={{
          style: {
            maxHeight: 400,
            width: '350px',
          },
        }}
      >
        <Typography variant="subtitle1" sx={{ p: 2, fontWeight: 'bold' }}>
          Recent Activities
        </Typography>
        <Divider />
        <List sx={{ width: '100%', p: 0 }}>
          {recentActivities.map((activity) => (
            <ListItem key={activity.id}>
              <ListItemAvatar>
                <Avatar sx={{ bgcolor: 'primary.main' }}>
                  <NotificationIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText 
                primary={activity.message} 
                secondary={activity.time} 
              />
            </ListItem>
          ))}
        </List>
      </Menu>

      {/* Profile Menu */}
      <Menu
        id="profile-menu"
        anchorEl={profileAnchorEl}
        keepMounted
        open={Boolean(profileAnchorEl)}
        onClose={handleProfileMenuClose}
        PaperProps={{
          style: {
            width: '300px',
          },
        }}
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="h6">Profile</Typography>
          <Typography variant="body1">
            {user ? `${user.first_name} ${user.last_name}` : 'Loading...'}
          </Typography>
          <Typography variant="body2" color="text.secondary">Analyst</Typography>
          <Divider sx={{ my: 1 }} />
          <Typography variant="body2" sx={{ mt: 1 }}>
            <strong>Current Team:</strong> Manchester United
          </Typography>
        </Box>
      </Menu>
      
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" component="h1" fontWeight="700">
          Premier League Teams
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" sx={{ mt: 0.5 }}>
          Select a team to create or edit scouting reports
        </Typography>
      </Box>
      
      <Paper sx={{ p: 4 }}>
        <Grid container spacing={4}>
          {/* Team Cards */}
          {teams && teams.length > 0 ? (
            teams.map((team) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={team.id}>
                <TeamCard 
                  team={team} 
                  status={teamStatuses[team.id] || 'not-started'}
                  onCreateReport={handleCreateReport}
                />
              </Grid>
            ))
          ) : (
            <Grid item xs={12}>
              <Typography variant="body1">No teams found.</Typography>
            </Grid>
          )}
        </Grid>
      </Paper>
    </Box>
  );
};

export default AnalystDashboard; 