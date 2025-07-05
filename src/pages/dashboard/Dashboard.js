import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTeams } from '../../store/slices/teamsSlice';
import { useSearch } from '../../context/SearchContext';
import { TextField } from '@mui/material';
import { useNotifications } from '../../context/NotificationContext'; 
import { Badge, IconButton, Menu, MenuItem, List, ListItem, ListItemText } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';

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
} from '@mui/material';
import {
  SportsSoccer as SoccerIcon,
  Launch as LaunchIcon,
  Check as CheckIcon,
} from '@mui/icons-material';

// Status chip component
const StatusChip = () => {
  return (
    <Chip 
      icon={<CheckIcon />}
      label="Completed"
      size="small"
      color="success"
      variant="filled"
    />
  );
};
// Team card component
const TeamCard = ({ team, onScout }) => {
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
          <StatusChip />
        </Box>
        
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          All scouting reports are complete
        </Typography>
        
        <Box sx={{ mt: 'auto' }}>
          <Button 
            variant="contained" 
            fullWidth 
            startIcon={<SoccerIcon />}
            endIcon={<LaunchIcon />}
            onClick={() => onScout(team.id)}
            sx={{ 
              background: `linear-gradient(45deg, ${team.color} 30%, ${alpha(team.color, 0.8)} 90%)`,
              boxShadow: `0px 3px 10px ${alpha(team.color, 0.5)}`,
            }}
          >
            Scout Team
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

// Main Dashboard component
const Dashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { teams, loading } = useSelector((state) => state.teams);
  const { searchTerm, setSearchTerm } = useSearch();
  const { notifications, loading: notificationsLoading } = useNotifications();
  const [anchorEl, setAnchorEl] = useState(null);
  const user = useSelector((state) => state.auth.user);


  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  // Fetch teams data on component mount
  useEffect(() => {
    dispatch(fetchTeams());
  }, [dispatch]);
  
  // Navigation handler for scouting teams
 const handleScoutTeam = (teamId) => {
    if (user?.role !== 'coach') {
        alert("Only coaches can scout teams.");
        return;
    }
    navigate(`/reports/${teamId}`);
};

  
  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" component="h1" fontWeight="700">
          Premier League Teams
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" sx={{ mt: 0.5 }}>
          Select a team to view scouting reports
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
  <IconButton onClick={handleOpenMenu}>
    <Badge badgeContent={notifications.length} color="error">
      <NotificationsIcon />
    </Badge>
  </IconButton>
  <Menu
    anchorEl={anchorEl}
    open={Boolean(anchorEl)}
    onClose={handleCloseMenu}
    PaperProps={{ sx: { width: 300 } }}
  >
    {notifications.length === 0 ? (
      <MenuItem disabled>No notifications</MenuItem>
    ) : (
      <List dense>
        {notifications.map((n) => (
          <ListItem key={n.id} divider>
            <ListItemText
              primary={`${n.action} ${n.resource_type} #${n.resource_id}`}
              secondary={new Date(n.timestamp).toLocaleString()}
            />
          </ListItem>
        ))}
      </List>
    )}
  </Menu>
</Box>

      <TextField
  fullWidth
  label="Search teams"
  variant="outlined"
  value={searchTerm}
  onChange={(e) => setSearchTerm(e.target.value)}
  sx={{ mb: 3 }}
/>

      
      <Paper sx={{ p: 4 }}>
        <Grid container spacing={4}>
        {/* Team Cards */}
        {teams && teams.length > 0 ? (
          teams.map((team) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={team.id}>
              <TeamCard team={team} onScout={handleScoutTeam} />
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

export default Dashboard;