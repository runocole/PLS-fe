import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useNotifications } from '../context/NotificationContext';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  Badge,
  Tooltip,
  useTheme,
  alpha,
  styled,
  Menu,
  MenuItem,
  Popover,
  Paper,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Assessment as AssessmentIcon,
  SportsSoccer as ScoutingIcon,
  Logout as LogoutIcon,
  SearchRounded as SearchIcon,
  NotificationsRounded as NotificationsIcon,
  AccountCircleRounded as ProfileIcon,
  SettingsRounded as SettingsIcon,
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/slices/authSlice';

const drawerWidth = 240;

// Custom styled components
const StyledAppBar = styled(AppBar)(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 1,
  boxShadow: 'none',
  backdropFilter: 'blur(8px)',
  borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
  background: 'linear-gradient(90deg, #000000, #121212)',
}));

const StyledDrawer = styled(Drawer)(({ theme }) => ({
  width: drawerWidth,
  flexShrink: 0,
  '& .MuiDrawer-paper': {
    width: drawerWidth,
    boxSizing: 'border-box',
    background: theme.palette.background.dark,
    borderRight: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
  },
}));

const StyledListItem = styled(ListItem)(({ theme, active }) => ({
  margin: '8px 12px',
  borderRadius: 8,
  fontWeight: 600,
  backgroundColor: active ? alpha(theme.palette.primary.main, 0.15) : 'transparent',
  color: active ? theme.palette.primary.main : theme.palette.text.primary,
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.main, 0.1),
  },
  '& .MuiListItemIcon-root': {
    color: active ? theme.palette.primary.main : theme.palette.text.secondary,
  },
}));

const StyledToolbarIcon = styled(IconButton)(({ theme }) => ({
  backgroundColor: alpha(theme.palette.primary.main, 0.1),
  marginLeft: 1,
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.main, 0.2),
  },
}));

const DashboardLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activePath, setActivePath] = useState(window.location.pathname);
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector(state => state.auth.user);
  
  // State for controlling menus and popovers
  const [searchAnchorEl, setSearchAnchorEl] = useState(null);
  const [notificationsAnchorEl, setNotificationsAnchorEl] = useState(null);
  const [settingsAnchorEl, setSettingsAnchorEl] = useState(null);
  const [profileAnchorEl, setProfileAnchorEl] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { notifications, loading } = useNotifications();

  // Get menu items based on user role
  const getMenuItems = () => {
    const role = user?.role || localStorage.getItem('userRole');
    
    if (role === 'analyst') {
      return [
        { text: 'Dashboard', icon: <DashboardIcon />, path: '/analyst-dashboard' },
        { text: 'Reports Overview', icon: <AssessmentIcon />, path: '/reports' },
        { text: 'Create Scout Report', icon: <ScoutingIcon />, path: '/reports/editor/new' },
        { text: 'Create Team', icon: <ScoutingIcon />, path: '/teams/create' },
      ];
    } else if (role === 'admin') {
      return [
        { text: 'Admin Dashboard', icon: <DashboardIcon />, path: '/admin-dashboard' },
        { text: 'Reports Overview', icon: <AssessmentIcon />, path: '/reports' },
        { text: 'Manage Teams', icon: <ScoutingIcon />, path: '/manage-teams' },
      ];
    } else {
      // Default coach menu
      return [
        { text: 'Coach Dashboard', icon: <DashboardIcon />, path: '/coach-dashboard' },
        { text: 'Reports Overview', icon: <AssessmentIcon />, path: '/reports' },
        { text: 'View Scout Reports', icon: <ScoutingIcon />, path: '/reports/view' },
      ];
    }
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleNavigation = (path) => {
    setActivePath(path);
    navigate(path);
    setMobileOpen(false);
  };

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem('userRole');
    navigate('/login');
  };

  // Handle icon clicks
  const handleSearchClick = (event) => {
    setSearchAnchorEl(event.currentTarget);
  };

  const handleNotificationsClick = (event) => {
    setNotificationsAnchorEl(event.currentTarget);
  };

  const handleSettingsClick = (event) => {
    setSettingsAnchorEl(event.currentTarget);
  };

  const handleProfileClick = (event) => {
    setProfileAnchorEl(event.currentTarget);
  };

  // Handle menu closes
  const handleSearchClose = () => {
    setSearchAnchorEl(null);
  };

  const handleNotificationsClose = () => {
    setNotificationsAnchorEl(null);
  };

  const handleSettingsClose = () => {
    setSettingsAnchorEl(null);
  };

  const handleProfileClose = () => {
    setProfileAnchorEl(null);
  };

  // Handle profile actions
  const handleViewProfile = () => {
    navigate('/profile');
    handleProfileClose();
  };

  const handleEditProfile = () => {
    navigate('/profile/edit');
    handleProfileClose();
  };

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ p: 2, textAlign: 'center', mt: 2 }}>
        <img src="/logo.svg" alt="Logo" height={40} />
      </Box>
      <Divider sx={{ mt: 2, mb: 2, opacity: 0.1 }} />
      
      <Box sx={{ px: 2, mb: 2 }}>
        <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1, pl: 2 }}>
          MAIN MENU
        </Typography>
        <List disablePadding>
          {getMenuItems().map((item) => (
            <StyledListItem
              button
              key={item.text}
              onClick={() => handleNavigation(item.path)}
              active={activePath === item.path ? 1 : 0}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </StyledListItem>
          ))}
        </List>
      </Box>
      
      <Box sx={{ flexGrow: 1 }} />
      
      <Box 
        sx={{
          p: 2,
          borderRadius: 2,
          bgcolor: 'background.paper',
          display: 'flex',
          alignItems: 'center',
          boxShadow: 1,
        }}
      >
        <Avatar 
          alt={user?.name || 'User'}
          src={user?.avatar || ''}
          sx={{ width: 40, height: 40, mr: 2 }}
        />
        <Box>
          <Typography variant="subtitle2" noWrap>
            {user ? `${user.first_name} ${user.last_name}` : 'User'}
          </Typography>
          <Typography variant="body2" color="text.secondary" noWrap>
            {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1) || 'Role'}
          </Typography>
        </Box>
      </Box>
      <StyledListItem
        button
        onClick={handleLogout}
        sx={{ mt: 2, justifyContent: 'center' }}
      >
        <ListItemIcon>
          <LogoutIcon />
        </ListItemIcon>
        <ListItemText primary="Logout" />
      </StyledListItem>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <StyledAppBar position="fixed">
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          
          <Box sx={{ flexGrow: 1 }}>
            <Typography 
              variant="h4" 
              sx={{ 
                fontWeight: 800,
                color: '#fff',
                textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
                mb: 0.5,
              }}
            >
              Welcome, {user?.first_name || 'User'}!
            </Typography>
            <Typography 
              variant="subtitle1"
              sx={{ 
                color: alpha('#fff', 0.7),
                textTransform: 'capitalize',
                display: { xs: 'none', sm: 'block' },
              }}
            >
              {user?.role || 'User'} Dashboard
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex' }}>
            <Tooltip title="Search">
              <StyledToolbarIcon 
                size="large" 
                color="inherit"
                onClick={handleSearchClick}
              >
                <SearchIcon />
              </StyledToolbarIcon>
            </Tooltip>
            
            <Tooltip title="Notifications">
              <StyledToolbarIcon 
                size="large" 
                color="inherit" 
                sx={{ ml: 1 }}
                onClick={handleNotificationsClick}
              >
                <Badge badgeContent={3} color="error">
                  <NotificationsIcon />
                </Badge>
              </StyledToolbarIcon>
            </Tooltip>
            
            <Tooltip title="Settings">
              <StyledToolbarIcon 
                size="large" 
                color="inherit" 
                sx={{ ml: 1 }}
                onClick={handleSettingsClick}
              >
                <SettingsIcon />
              </StyledToolbarIcon>
            </Tooltip>
            
            <Tooltip title="Profile">
              <StyledToolbarIcon 
                size="large" 
                color="inherit" 
                sx={{ ml: 1 }}
                onClick={handleProfileClick}
              >
                <ProfileIcon />
              </StyledToolbarIcon>
            </Tooltip>
          </Box>
        </Toolbar>
      </StyledAppBar>
      
      {/* Search Popover */}
      <Popover
        open={Boolean(searchAnchorEl)}
        anchorEl={searchAnchorEl}
        onClose={handleSearchClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <Paper sx={{ p: 2, width: 300 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>Search</Typography>
          <input
            type="text"
            placeholder="Search teams, players..."
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '4px',
              border: '1px solid #ddd',
            }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Paper>
      </Popover>

      {/* Notifications Menu */}
       <Menu
  anchorEl={notificationsAnchorEl}
  open={Boolean(notificationsAnchorEl)}
  onClose={handleNotificationsClose}
  PaperProps={{ sx: { width: 320, maxHeight: 400, mt: 1 } }}
>
  {loading ? (
    <MenuItem disabled>Loading...</MenuItem>
  ) : notifications.length === 0 ? (
    <MenuItem disabled>No notifications</MenuItem>
  ) : (
    notifications.map((note) => (
      <MenuItem key={note.id} onClick={handleNotificationsClose}>
        <Box sx={{ width: '100%' }}>
          <Typography variant="subtitle2">{note.message}</Typography>
          <Typography variant="body2" color="text.secondary">
            {note.time}
          </Typography>
        </Box>
      </MenuItem>
    ))
  )}
</Menu>

     

      {/* Profile Menu */}
      <Menu
        anchorEl={profileAnchorEl}
        open={Boolean(profileAnchorEl)}
        onClose={handleProfileClose}
        PaperProps={{
          sx: { width: 200, mt: 1 }
        }}
      >
        <MenuItem onClick={handleViewProfile}>View Profile</MenuItem>
        <MenuItem onClick={handleEditProfile}>Edit Profile</MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout}>Logout</MenuItem>
      </Menu>
      
      <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
        <StyledDrawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
          }}
          open
        >
          {drawer}
        </StyledDrawer>
      </Box>
      
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 2,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          mt: '64px',
          overflow: 'auto',
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default DashboardLayout; 