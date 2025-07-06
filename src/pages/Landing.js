import { useState } from 'react';
import { Box, Typography, Button, Container, Grid, Paper, useTheme, useMediaQuery, Menu, MenuItem, AppBar, Toolbar } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { styled, keyframes } from '@mui/material/styles';
import { motion } from 'framer-motion';
import { 
  SportsSoccer, 
  Stadium, 
  EmojiEvents,
  TrendingUp,
  Analytics,
  Group,
  KeyboardArrowDown
} from '@mui/icons-material';

// Animations
const floatAnimation = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
  100% { transform: translateY(0px); }
`;

const pulseAnimation = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

// Premier League teams data
const teams = [
  { name: 'Arsenal', logo: '/logos/arsenal.png', color: '#EF0107' },
  { name: 'Chelsea', logo: '/logos/chelsea.png', color: '#034694' },
  { name: 'Liverpool', logo: '/logos/liverpool.png', color: '#C8102E' },
  { name: 'Manchester City', logo: '/logos/manchester-city.png', color: '#6CABDD' },
  { name: 'Manchester United', logo: '/logos/manchester-united.png', color: '#DA291C' },
  { name: 'Tottenham', logo: '/logos/tottenham.png', color: '#132257' },
  { name: 'Newcastle', logo: '/logos/newcastle.png', color: '#241F20' },
  { name: 'Aston Villa', logo: '/logos/aston-villa.png', color: '#95BFE5' },
  { name: 'Nottingham Forest', logo: '/logos/nottingham.png', color: '#0057B8' },
  { name: 'Bourne Mouth', logo: '/logos/bourne-mouth.png', color: '#7A263A' },
];

// Styled Components
const RootContainer = styled(Box)({
  minHeight: '100vh',
  background: '#000',
  position: 'relative', 
  overflow: 'hidden',
});

const HeroSection = styled(Box)(({ theme }) => ({
  height: '100vh',
  width: '100%',
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'url("/images/stadium-bg.jpg")',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    opacity: 0.15,
    zIndex: 0,
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(135deg, rgba(0,0,0,0.95) 0%, rgba(55,0,60,0.9) 100%)',
    zIndex: 1,
  },
}));

const StyledAppBar = styled(AppBar)({
  background: 'rgba(0, 0, 0, 0.7)',
  backdropFilter: 'blur(10px)',
  boxShadow: '0 4px 30px rgba(0, 0, 0, 0.5)',
  position: 'absolute',
  top: 0,
  zIndex: 10,
});

const TeamButton = styled(Button)(({ theme }) => ({
  color: '#fff',
  fontSize: '1.1rem',
  fontWeight: 600,
  textTransform: 'none',
  marginRight: theme.spacing(2),
  padding: theme.spacing(1, 2),
  borderRadius: '8px',
  border: '2px solid #9c27b0',
  backgroundColor: 'rgba(156, 39, 176, 0.2)',
  '&:hover': {
    backgroundColor: 'rgba(156, 39, 176, 0.4)',
    borderColor: '#ba68c8',
  },
}));

const TeamMenuPaper = styled(Paper)({
  background: '#ffffff',
  borderRadius: '10px',
  border: '2px solid #9c27b0',
  maxHeight: '400px',
  overflowY: 'auto',
});

const TeamMenuItem = styled(MenuItem)({
  display: 'flex',
  alignItems: 'center',
  padding: '12px 20px',
  '&:hover': {
    background: 'rgba(156, 39, 176, 0.1)',
  },
});

const TeamLogo = styled('img')({
  width: '40px',
  height: '40px',
  marginRight: '16px',
});

const HeroContent = styled(Grid)(({ theme }) => ({
  position: 'relative',
  zIndex: 2,
  height: '100%',
  width: '100%',
  display: 'flex',
  justifyContent: 'flex-start', // Left alignment
  [theme.breakpoints.down('sm')]: {
    justifyContent: 'flex-start', 
  },
}));

const HeroTextSection = styled(Grid)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'left',
  alignItems: 'flex-start', // Left alignment
  padding: theme.spacing(4),
  paddingLeft: theme.spacing(8), // Adjusted padding
  [theme.breakpoints.down('md')]: {
    paddingLeft: theme.spacing(4), // Less padding on medium screens
  },
  [theme.breakpoints.down('sm')]: {
    paddingLeft: theme.spacing(2), // Even less padding on small screens
  },
}));

const LogoContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
  marginBottom: theme.spacing(4),
  marginTop: theme.spacing(8), // Add top margin to push down from header
  animation: `${floatAnimation} 6s ease-in-out infinite`,
  '& svg': {
    fontSize: '80px',
    color: '#9c27b0',
    filter: 'drop-shadow(0 0 10px rgba(156, 39, 176, 0.5))',
  },
}));

const ActionButton = styled(Button)(({ theme, variant }) => ({
  padding: theme.spacing(1.5, 4),
  borderRadius: '8px',
  fontSize: '1.2rem',
  fontWeight: 700,
  fontFamily: '"Montserrat", sans-serif',
  textTransform: 'none',
  transition: 'all 0.3s ease',
  height: '60px',
  ...(variant === 'contained' ? {
    background: '#9c27b0',
    color: '#fff',
    boxShadow: '0 8px 16px rgba(156, 39, 176, 0.3)',
    '&:hover': {
      background: '#7b1fa2',
      transform: 'translateY(-2px)',
      boxShadow: '0 12px 20px rgba(156, 39, 176, 0.4)',
    },
  } : {
    borderColor: '#9c27b0',
    color: '#fff',
    '&:hover': {
      borderColor: '#ba68c8',
      background: 'rgba(156, 39, 176, 0.1)',
      transform: 'translateY(-2px)',
    },
  }),
}));

const FeaturesContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  width: '100%',
  overflowX: 'auto',
  padding: theme.spacing(4, 0),
  paddingLeft: theme.spacing(8), // Match heading alignment with hero section
  scrollbarWidth: 'none',
  '&::-webkit-scrollbar': {
    display: 'none',
  },
  '-ms-overflow-style': 'none',
  [theme.breakpoints.down('md')]: {
    paddingLeft: theme.spacing(4), // Less padding on medium screens
  },
  [theme.breakpoints.down('sm')]: {
    paddingLeft: theme.spacing(2), // Even less on small screens
  },
}));

const FeatureCard = styled(Box)(({ theme }) => ({
  minWidth: '300px',
  height: '300px',
  background: 'rgba(255, 255, 255, 0.05)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(156, 39, 176, 0.3)',
  borderRadius: '20px',
  transition: 'all 0.3s ease-in-out',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(3),
  margin: theme.spacing(0, 2),
  textAlign: 'center',
  '&:hover': {
    transform: 'translateY(-10px)',
    background: 'rgba(255, 255, 255, 0.08)',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)',
    border: '1px solid rgba(156, 39, 176, 0.6)',
  },
}));

const FeatureIcon = styled(Box)(({ theme }) => ({
  width: '80px',
  height: '80px',
  borderRadius: '50%',
  background: 'linear-gradient(135deg, #9c27b0 0%, #7b1fa2 100%)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: theme.spacing(3),
  boxShadow: '0 10px 20px rgba(156, 39, 176, 0.3)',
  animation: `${pulseAnimation} 3s ease-in-out infinite`,
  '& svg': {
    fontSize: '40px',
    color: '#fff',
  },
}));

const Landing = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleTeamMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleTeamMenuClose = () => {
    setAnchorEl(null);
  };

  const features = [
    {
      icon: <Stadium />,
      title: 'Official Reports',
      description: 'Access detailed tactical analysis with in-possession, out-of-possession, and pressing system breakdowns for each team.',
    },
    {
      icon: <SportsSoccer />,
      title: 'Personal Drafts',
      description: 'Create and edit your own scouting reports with custom notes and tactical images for each team.',
    },
    {
      icon: <EmojiEvents />,
      title: 'Visual Analytics',
      description: 'Interactive charts and statistics to help you understand team performance and tactical patterns.',
    },
    {
      icon: <TrendingUp />,
      title: 'Performance Metrics',
      description: 'Track team and player performance with advanced statistics and trend analysis.',
    },
    {
      icon: <Analytics />,
      title: 'Data Insights',
      description: 'Make data-driven decisions with comprehensive analytics and predictive modeling.',
    },
    {
      icon: <Group />,
      title: 'Team Collaboration',
      description: 'Work together with your scouting team in real-time, sharing insights and reports.',
    },
  ];

  return (
    <RootContainer>
      <StyledAppBar>
        <Toolbar>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', flexGrow: 1 }}>
            
          </Box>
          
          <TeamButton 
            endIcon={<KeyboardArrowDown />}
            onClick={handleTeamMenuClick}
          >
            Premier League Teams
          </TeamButton>
          
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleTeamMenuClose}
            PaperProps={{
              component: TeamMenuPaper
            }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            {teams.map((team) => (
              <TeamMenuItem key={team.name} onClick={handleTeamMenuClose}>
                <TeamLogo src={team.logo} alt={team.name} />
                <Typography variant="body1" sx={{ color: '#ffffff', fontWeight: 600, fontFamily: '"Poppins", sans-serif' }}>
                  {team.name}
                </Typography>
              </TeamMenuItem>
            ))}
          </Menu>

          {!isMobile && (
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button 
                variant="text" 
                sx={{ 
                  color: '#fff', 
                  fontWeight: 600,
                  fontFamily: '"Poppins", sans-serif',
                  '&:hover': { color: '#ba68c8' }
                }}
                onClick={() => navigate('/login')}
              >
                Sign In
              </Button>
              <Button 
                variant="contained" 
                sx={{ 
                  bgcolor: '#9c27b0', 
                  color: '#fff',
                  fontWeight: 600,
                  fontFamily: '"Poppins", sans-serif',
                  '&:hover': { bgcolor: '#7b1fa2' }
                }}
                onClick={() => navigate('/register')}
              >
                Get Started
              </Button>
            </Box>
          )}
        </Toolbar>
      </StyledAppBar>

      <HeroSection>
        <Container maxWidth={false} sx={{ height: '100%' }}>
          <HeroContent container>
            <HeroTextSection item xs={12} md={10} lg={8}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <LogoContainer>
                  <SportsSoccer />
                  <Typography
                    variant="h1"
                    sx={{
                      color: '#fff',
                      fontWeight: 800,
                      fontSize: { xs: '2rem', md: '3rem', lg: '4rem' },
                      textShadow: '2px 2px 4px rgb(255, 255, 255)',
                      letterSpacing: '-1px',
                      fontFamily: '"Montserrat", sans-serif',
                      textAlign: 'left',
                      marginLeft: '-8px', // Better alignment with icon
                    }}
                  >
                    SCOUTER
                  </Typography>
                </LogoContainer>
                <Typography
                  variant="h6"
                  sx={{
                    color: '#e1bee7',
                    mb: 6,
                    fontWeight: 500,
                    maxWidth: '800px',
                    lineHeight: 1.4,
                    fontFamily: '"Poppins", sans-serif',
                  }}
                >
                  Professional tactical analysis and scouting platform for Premier League teams.
                  Transform your team's performance with data-driven insights.
                </Typography>
                <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap', justifyContent: 'flex-start', marginLeft: 0 }}>
                  <ActionButton
                    variant="contained"
                    size="large"
                    onClick={() => navigate('/register')}
                  >
                    Get Started
                  </ActionButton>
                  <ActionButton
                    variant="outlined"
                    size="large"
                    onClick={() => navigate('/login')}
                  >
                    Sign In
                  </ActionButton>
                </Box>
              </motion.div>
            </HeroTextSection>
          </HeroContent>
        </Container>
      </HeroSection>

      {/* Features Section - Horizontal Scrolling */}
      <Box sx={{ 
        py: 8, 
        background: 'linear-gradient(180deg, rgba(0,0,0,0.9) 0%, rgba(55,0,60,0.9) 100%)',
        position: 'relative',
        zIndex: 2,
      }}>
        <Container maxWidth="xl">
          <Typography
            variant="h2"
            sx={{
              color: '#fff',
              textAlign: 'left',
              pl: { xs: 2, sm: 4, md: 8 }, // Match the hero section padding
              mb: 6,
              fontWeight: 800,
              textShadow: '0 2px 4px rgba(0,0,0,0.3)',
              fontFamily: '"Montserrat", sans-serif',
            }}
          >
            Key Features
          </Typography>
          
          <FeaturesContainer>
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <FeatureCard>
                  <FeatureIcon>
                    {feature.icon}
                  </FeatureIcon>
                  <Typography
                    variant="h5"
                    sx={{ 
                      color: '#fff', 
                      mb: 2, 
                      fontWeight: 700,
                      fontFamily: '"Montserrat", sans-serif',
                    }}
                  >
                    {feature.title}
                  </Typography>
                  <Typography 
                    sx={{ 
                      color: 'rgba(255,255,255,0.8)',
                      lineHeight: 1.6,
                      fontFamily: '"Poppins", sans-serif',
                    }}
                  >
                    {feature.description}
                  </Typography>
                </FeatureCard>
              </motion.div>
            ))}
          </FeaturesContainer>
        </Container>
      </Box>
    </RootContainer>
  );
};

export default Landing; 