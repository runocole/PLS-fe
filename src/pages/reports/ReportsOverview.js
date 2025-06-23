import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTeams } from '../../store/slices/teamsSlice';
import { fetchReports } from '../../store/slices/reportsSlice';
import { reportsAPI } from '../../services/api';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  TextField,
  InputAdornment,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  Tab,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  alpha,
  useTheme,
  Alert,
} from '@mui/material';
import { 
  Search as SearchIcon,
  FilterList as FilterIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Download as DownloadIcon,
  MoreVert as MoreIcon,
  Check as CheckIcon,
  AccessTime as TimeIcon,
  Error as ErrorIcon,
  Sort as SortIcon,
  Visibility as ViewIcon,
  Description as ReportIcon,
  CalendarMonth as DateIcon,
  TrendingUp as ProgressIcon,
} from '@mui/icons-material';
import html2pdf from 'html2pdf.js';

// Status icons mapping
const statusIcons = {
  completed: <CheckIcon color="success" />,
  'in-progress': <TimeIcon color="warning" />,
  'not-started': <ErrorIcon color="error" />
};

// Status labels mapping
const statusLabels = {
  completed: 'Completed',
  'in-progress': 'In Progress',
  'not-started': 'Not Started'
};

// Status to color mapping
const statusColors = {
  completed: 'success',
  'in-progress': 'warning',
  'not-started': 'error'
};

// Format date utility function
const formatDate = (dateString) => {
  if (!dateString) return 'Never';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

// Calculate completion percentage based on panel data
const calculateCompletion = (reportData) => {
  if (!reportData || !reportData.panels) return 0;
  
  const panels = reportData.panels;
  const panelKeys = Object.keys(panels);
  let completedSections = 0;
  let totalSections = 0;
  
  panelKeys.forEach(key => {
    const panel = panels[key];
    // Check for content
    if (panel.content && panel.content.length > 50) completedSections++;
    totalSections++;
    
    // Check for images
    if (panel.images && panel.images.length > 0) completedSections++;
    totalSections++;
    
    // Check for stats
    const statsValues = Object.values(panel.stats || {});
    if (statsValues.some(val => val > 0)) completedSections++;
    totalSections++;
  });
  
  return Math.round((completedSections / totalSections) * 100);
};

// Reports Overview Component
const ReportsOverview = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
  teams, 
  loading: teamLoadingState 
} = useSelector((state) => state.teams);
  const { 
  reports, 
  loading : reportLoadingState
  }= useSelector((state) => state.reports);
  const teamsLoading =teamLoadingState?.teams;
  //console.log('Reports:', reports);
  const reportsLoading = reportLoadingState?.reports;
  
  // Local state
  const [filteredReports, setFilteredReports] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [anchorEl, setAnchorEl] = useState(null);
  const [currentReportId, setCurrentReportId] = useState(null);
  const [sortField, setSortField] = useState('lastUpdated');
  const [sortDirection, setSortDirection] = useState('desc');
  const [error, setError] = useState(null);
  const {user} = useSelector((state) => state.auth);
  
  // Menu state
  const menuOpen = Boolean(anchorEl);
  
  // Load teams and reports data
  useEffect(() => {
  const loadData = async () => {
    setError(null);
    try {
      console.log('Fetching teams and reports...');
      const teamsResult = await dispatch(fetchTeams()).unwrap();
      const reportsResult = await dispatch(fetchReports()).unwrap();
      console.log('Teams:', teamsResult);
      console.log('Reports:', reportsResult);
    } catch (error) {
      console.error('Error loading data:', error);
      setError(error?.message || 'Failed to load reports.');
    }
  };
  loadData();
}, [dispatch]);
  
  // Filter and sort reports based on current state
  useEffect(() => {
    if (!reports) {
      setFilteredReports([]);
      return;
    }
    
    let filtered = reports.map(report => ({
        ...report,
        teamName: report.team?.name || 'Unknown Team',
        teamLogo: report.team?.logo || null,
        completion: calculateCompletion(report) || 0
      }));
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(report => 
        report.teamName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.id?.toString().includes(searchTerm)
      );
    }
    
    // Apply status filter
    if (filter !== 'all') {
      filtered = filtered.filter(report => {
        const completion = report.completion || 0;
        if (filter === 'completed') {
          return completion === 100;
        } else if (filter === 'in-progress') {
          return completion > 0 && completion < 100;
        } else if (filter === 'not-started') {
          return completion === 0;
        }
        return true;
      });
    }
    
    // Apply sorting with null checks
    filtered.sort((a, b) => {
      let compareA, compareB;
      
      switch (sortField) {
        case 'teamName':
          compareA = (a.teamName || '').toLowerCase();
          compareB = (b.teamName || '').toLowerCase();
          break;
        case 'lastUpdated':
          compareA = new Date(a.updated_at || 0);
          compareB = new Date(b.updated_at || 0);
          break;
        case 'completion':
          compareA = a.completion || 0;
          compareB = b.completion || 0;
          break;
        default:
          compareA = new Date(a.updated_at || 0);
          compareB = new Date(b.updated_at || 0);
      }
      
      if (sortDirection === 'asc') {
        return compareA < compareB ? -1 : 1;
      } else {
        return compareA > compareB ? -1 : 1;
      }
    });
    
    setFilteredReports(filtered);
  }, [reports, teams, searchTerm, filter, sortField, sortDirection]);
  
  // Handle menu open
  const handleMenuOpen = (event, reportId) => {
    setAnchorEl(event.currentTarget);
    setCurrentReportId(reportId);
  };
  
  // Handle menu close
  const handleMenuClose = () => {
    setAnchorEl(null);
    setCurrentReportId(null);
  };
  
  // Handle filter change
  const handleFilterChange = (event, newValue) => {
    setFilter(newValue);
  };
  
  // Handle sorting
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };
  
  // Handle edit report
  const handleEditReport = (reportId) => {
    navigate(`/reports/editor/${reportId}`);
  };
  
  // Handle delete report
  const handleDeleteReport = async (reportId) => {
    try {
      await reportsAPI.deleteReport(reportId);
      setFilteredReports(filteredReports.filter(report => report.id !== reportId));
      handleMenuClose();
    } catch (error) {
      console.error('Failed to delete report', error);
    }
  };
  
  // Handle export report
  const handleExportReport = async (reportId) => {
    try {
      const report = filteredReports.find(r => r.id === reportId);
      
      // Create a temporary div to hold report content
      const tempDiv = document.createElement('div');
      tempDiv.style.display = 'none';
      document.body.appendChild(tempDiv);
      
      // Populate with report content
      tempDiv.innerHTML = `
        <h1>${report.teamName} Scouting Report</h1>
        <p>Last Updated: ${formatDate(report.updated_at)}</p>
        <hr>
        
        <h2>In Possession Analysis</h2>
        ${report.panels.in_possession?.content || '<p>No data</p>'}
        
        <h2>Out of Possession Analysis</h2>
        ${report.panels.out_possession?.content || '<p>No data</p>'}
        
        <h2>Pressing Systems Analysis</h2>
        ${report.panels.pressing_systems?.content || '<p>No data</p>'}
      `;
      
      // Generate PDF
      const options = {
        margin: 10,
        filename: `${report.teamName}-scouting-report.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };
      
      await html2pdf().set(options).from(tempDiv).save();
      
      // Clean up
      document.body.removeChild(tempDiv);
      handleMenuClose();
    } catch (error) {
      console.error('Failed to export report', error);
    }
  };
  
  // Determine report status based on completion
  const getReportStatus = (completion) => {
    if (completion === 100) return 'completed';
    if (completion > 0) return 'in-progress';
    return 'not-started';
  };
  
  // Show loading state
  console.log ("Loading states", { teamsLoading, reportsLoading});
  if (teamsLoading || reportsLoading) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 4 }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Loading reports...</Typography>
      </Box>
    );
  }

  // Show error state
  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert 
          severity="error" 
          action={
            <Button color="inherit" size="small" onClick={() => window.location.reload()}>
              RETRY
            </Button>
          }
        >
          {error}
        </Alert>
      </Box>
    );
  }

  // Show empty state
  if (!reports || reports.length === 0) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h6" sx={{ mb: 2 }}>No reports found</Typography>
        <Button 
          variant="contained" 
          color="primary"
          onClick={() => navigate('/scout/new')}
        >
          Create New Report
        </Button>
      </Box>
    );
  }
  
  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" component="h1" fontWeight="700">
            Scouting Reports
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" sx={{ mt: 0.5 }}>
            Manage all your team scouting reports
          </Typography>
        </Box>
      </Box>
      
      {/* Filters and Search */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={8}>
          <Tabs 
            value={filter} 
            onChange={handleFilterChange}
            indicatorColor="primary"
            textColor="primary"
            variant="scrollable"
            scrollButtons="auto"
            sx={{ 
              '& .MuiTab-root': {
                minWidth: 120,
              },
            }}
          >
            <Tab label="All Reports" value="all" />
            <Tab 
              label="Completed" 
              value="completed" 
              icon={statusIcons.completed} 
              iconPosition="start" 
            />
            <Tab 
              label="In Progress" 
              value="in-progress" 
              icon={statusIcons['in-progress']} 
              iconPosition="start"
            />
            <Tab 
              label="Not Started" 
              value="not-started" 
              icon={statusIcons['not-started']} 
              iconPosition="start"
            />
          </Tabs>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            placeholder="Search reports..."
            variant="outlined"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
      </Grid>
      
      {/* Reports Table */}
      <Paper sx={{ mb: 3, overflow: 'hidden' }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Team</TableCell>
                <TableCell 
                  onClick={() => handleSort('updated_at')}
                  sx={{ cursor: 'pointer' }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    Last Updated
                    {sortField === 'updated_at' && (
                      <SortIcon 
                        fontSize="small" 
                        sx={{ 
                          ml: 0.5,
                          transform: sortDirection === 'desc' ? 'none' : 'rotate(180deg)'
                        }} 
                      />
                    )}
                  </Box>
                </TableCell>
                <TableCell 
                  onClick={() => handleSort('completion')}
                  sx={{ cursor: 'pointer' }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    Status
                    {sortField === 'completion' && (
                      <SortIcon 
                        fontSize="small" 
                        sx={{ 
                          ml: 0.5,
                          transform: sortDirection === 'desc' ? 'none' : 'rotate(180deg)'
                        }} 
                      />
                    )}
                  </Box>
                </TableCell>
                <TableCell>Completion</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredReports.length > 0 ? (
                filteredReports.map((report) => {
                  const status = getReportStatus(report.completion);
                  
                  return (
                    <TableRow key={report.id} hover>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          {report.teamLogo && (
                            <Box 
                              component="img" 
                              src={report.teamLogo} 
                              alt={report.teamName}
                              sx={{ 
                                width: 36, 
                                height: 36, 
                                mr: 1.5,
                                borderRadius: '50%',
                                border: '1px solid',
                                borderColor: 'divider'
                              }}
                            />
                          )}
                          <Typography variant="body1" fontWeight="500">
                            {report.teamName}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <DateIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                          <Typography variant="body2">
                            {formatDate(report.updated_at)}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          icon={statusIcons[status]} 
                          label={statusLabels[status]}
                          color={statusColors[status]}
                          size="small"
                          variant="filled"
                        />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Box 
                            sx={{ 
                              width: 100,
                              height: 8,
                              bgcolor: alpha(theme.palette.primary.main, 0.1),
                              borderRadius: 1,
                              mr: 1
                            }}
                          >
                            <Box 
                              sx={{ 
                                height: '100%',
                                width: `${report.completion}%`,
                                bgcolor: report.completion === 100 
                                  ? theme.palette.success.main 
                                  : theme.palette.primary.main,
                                borderRadius: 1
                              }}
                            />
                          </Box>
                          <Typography variant="body2" fontWeight="500">
                            {report.completion}%
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell align="right">
                        {user?.role === 'analyst' && (
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<EditIcon />}
                          sx={{ mr: 1 }}
                          onClick={() => handleEditReport(report.id)}
                        >
                          Continue
                        </Button>
                        )}
                        <IconButton
                          size="small"
                          onClick={(event) => handleMenuOpen(event, report.id)}
                        >
                          <MoreIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                    <ReportIcon sx={{ fontSize: 60, color: 'text.disabled', mb: 1 }} />
                    <Typography variant="h6" color="text.secondary" fontWeight="500">
                      No reports found
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {searchTerm 
                        ? 'Try a different search term' 
                        : filter !== 'all' 
                          ? `No ${filter} reports` 
                          : 'Create your first scouting report'}
                    </Typography>
                    {!searchTerm && filter === 'all' && false && (
                      <Button 
                        variant="contained" 
                        startIcon={<ReportIcon />}
                        onClick={() => navigate('/scout/new')}
                      >
                        Create Report
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      
      {/* Statistics Cards */}
      <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
        Reports Overview
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: alpha(theme.palette.primary.main, 0.08) }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Box
                  sx={{
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                    borderRadius: 1,
                    p: 1,
                    mr: 2,
                  }}
                >
                  <ReportIcon color="primary" />
                </Box>
                <Typography variant="h6" fontWeight="500">
                  Total Reports
                </Typography>
              </Box>
              <Typography variant="h3" fontWeight="700">
                {reports.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: alpha(theme.palette.success.main, 0.08) }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Box
                  sx={{
                    bgcolor: alpha(theme.palette.success.main, 0.1),
                    borderRadius: 1,
                    p: 1,
                    mr: 2,
                  }}
                >
                  <CheckIcon color="success" />
                </Box>
                <Typography variant="h6" fontWeight="500">
                  Completed
                </Typography>
              </Box>
              <Typography variant="h3" fontWeight="700">
                {reports.filter(r => r.completion === 100).length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: alpha(theme.palette.warning.main, 0.08) }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Box
                  sx={{
                    bgcolor: alpha(theme.palette.warning.main, 0.1),
                    borderRadius: 1,
                    p: 1,
                    mr: 2,
                  }}
                >
                  <TimeIcon color="warning" />
                </Box>
                <Typography variant="h6" fontWeight="500">
                  In Progress
                </Typography>
              </Box>
              <Typography variant="h3" fontWeight="700">
                {reports.filter(r => r.completion > 0 && r.completion < 100).length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: alpha(theme.palette.error.main, 0.08) }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Box
                  sx={{
                    bgcolor: alpha(theme.palette.error.main, 0.1),
                    borderRadius: 1,
                    p: 1,
                    mr: 2,
                  }}
                >
                  <ErrorIcon color="error" />
                </Box>
                <Typography variant="h6" fontWeight="500">
                  Not Started
                </Typography>
              </Box>
              <Typography variant="h3" fontWeight="700">
                {reports.filter(r => r.completion === 0).length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      {/* Actions Menu */}
      <Menu
        anchorEl={anchorEl}
        open={menuOpen}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuItem onClick={() => handleEditReport(currentReportId)}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Edit Report</ListItemText>
        </MenuItem>
        
        <MenuItem onClick={() => handleExportReport(currentReportId)}>
          <ListItemIcon>
            <DownloadIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Export as PDF</ListItemText>
        </MenuItem>
        
        <Divider />
        
        <MenuItem 
          onClick={() => handleDeleteReport(currentReportId)}
          sx={{ color: 'error.main' }}
        >
          <ListItemIcon>
            <DeleteIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText>Delete Report</ListItemText>
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default ReportsOverview;