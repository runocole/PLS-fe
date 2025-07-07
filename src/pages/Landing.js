import { useState } from 'react';
import { 
  Box, Typography, Button, Container, Grid, Paper, useTheme, useMediaQuery, 
  Menu, MenuItem, AppBar, Toolbar 
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { styled, keyframes } from '@mui/material/styles';
import { motion } from 'framer-motion';
import { 
  SportsSoccer, Stadium, EmojiEvents, TrendingUp, Analytics, Group, KeyboardArrowDown 
} from '@mui/icons-material';

const floatAnimation = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-15px); }
`;

const pulseAnimation = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
`;

const teams = [
  { name: 'Arsenal', logo: '/logos/arsenal.png' },
  { name: 'Chelsea', logo: '/logos/chelsea.png' },
  { name: 'Liverpool', logo: '/logos/liverpool.png' },
  { name: 'Manchester City', logo: '/logos/manchester-city.png' },
  { name: 'Manchester United', logo: '/logos/manchester-united.png' },
  { name: 'Tottenham', logo: '/logos/tottenham.png' },
  { name: 'Newcastle', logo: '/logos/newcastle.png' },
  { name: 'Aston Villa', logo: '/logos/aston-villa.png' },
  { name: 'Nottingham Forest', logo: '/logos/nottingham.png' },
  { name: 'Bourne Mouth', logo: '/logos/bourne-mouth.png' },
];

const RootContainer = styled(Box)({
  minHeight: '100vh',
  backgroundColor: '#000',
  overflow: 'hidden',
});

const HeroSection = styled(Box)({
  height: '100vh',
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  '&::before': {
    content: '""',
    position: 'absolute',
    inset: 0,
    backgroundImage: 'url("/images/managers-dark.jpg")',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    opacity: 0.15,
    zIndex: 0,
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    inset: 0,
    background: 'linear-gradient(to right, rgba(0,0,0,0.95), rgba(20,0,30,0.95))',
    zIndex: 1,
  },
});

const StyledAppBar = styled(AppBar)({
  background: 'rgba(0, 0, 0, 0.8)',
  backdropFilter: 'blur(12px)',
  boxShadow: '0 0 30px rgba(0, 0, 0, 0.6)',
});

const TeamButton = styled(Button)({
  color: '#fff',
  fontWeight: 600,
  border: '2px solid #9c27b0',
  borderRadius: 8,
  backgroundColor: 'rgba(156,39,176,0.2)',
  '&:hover': {
    backgroundColor: 'rgba(156,39,176,0.4)',
  },
});

const TeamMenuPaper = styled(Paper)({
  backgroundColor: '#121212',
  border: '1px solid #9c27b0',
  borderRadius: 10,
});

const TeamMenuItem = styled(MenuItem)({
  display: 'flex',
  alignItems: 'center',
  padding: '10px 16px',
  '&:hover': {
    backgroundColor: 'rgba(156,39,176,0.1)',
  },
});

const TeamLogo = styled('img')({
  width: 36,
  height: 36,
  marginRight: 12,
});

const HeroContent = styled(Grid)({
  position: 'relative',
  zIndex: 2,
  width: '100%',
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
});

const HeroTextSection = styled(Grid)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  padding: theme.spacing(6),
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(3),
  },
}));

const LogoContainer = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: 16,
  animation: `${floatAnimation} 6s ease-in-out infinite`,
  '& svg': {
    fontSize: 64,
    color: '#9c27b0',
  },
});

const HeroImageSection = styled(Grid)({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 2,
});

const HeroImage = styled('img')(({ theme }) => ({
  width: '100%',
  maxWidth: 600,
  borderRadius: 20,
  boxShadow: '0 10px 30px rgba(0,0,0,0.6)',
  objectFit: 'cover',
  mixBlendMode: 'screen',
  filter: 'brightness(1.1)',
}));

const ActionButton = styled(Button)(({ theme }) => ({
  padding: theme.spacing(1.5, 4),
  fontWeight: 700,
  borderRadius: 8,
  textTransform: 'none',
  fontSize: '1.1rem',
  backgroundColor: '#9c27b0',
  color: '#fff',
  '&:hover': {
    backgroundColor: '#7b1fa2',
  },
}));

const FeaturesContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  overflowX: 'auto',
  padding: theme.spacing(4, 0),
  paddingLeft: theme.spacing(6),
  gap: theme.spacing(3),
  '&::-webkit-scrollbar': { display: 'none' },
}));

const FeatureCard = styled(Box)(({ theme }) => ({
  minWidth: 300,
  height: 300,
  backgroundColor: 'rgba(255,255,255,0.05)',
  backdropFilter: 'blur(10px)',
  borderRadius: 20,
  padding: theme.spacing(3),
  textAlign: 'center',
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    backgroundColor: 'rgba(255,255,255,0.08)',
    transform: 'translateY(-8px)',
    boxShadow: '0 12px 24px rgba(0,0,0,0.5)',
  },
}));

const FeatureIcon = styled(Box)(({ theme }) => ({
  width: 70,
  height: 70,
  borderRadius: '50%',
  background: 'linear-gradient(135deg, #9c27b0, #7b1fa2)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  margin: '0 auto 16px',
  animation: `${pulseAnimation} 3s infinite`,
  '& svg': {
    color: '#fff',
    fontSize: 32,
  },
}));

const Landing = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleTeamMenuClick = (e) => setAnchorEl(e.currentTarget);
  const handleTeamMenuClose = () => setAnchorEl(null);

  const features = [
    { icon: <Stadium />, title: 'Official Reports', description: 'Access tactical breakdowns for every Premier League team.' },
    { icon: <SportsSoccer />, title: 'Personal Drafts', description: 'Customize scouting reports with your own insights.' },
    { icon: <EmojiEvents />, title: 'Visual Analytics', description: 'Interactive graphs and charts for performance analysis.' },
    { icon: <TrendingUp />, title: 'Performance Metrics', description: 'Track team stats with real-time data trends.' },
    { icon: <Analytics />, title: 'Data Insights', description: 'Make decisions with predictive analytics and modeling.' },
    { icon: <Group />, title: 'Team Collaboration', description: 'Work with other scouts live on shared reports.' },
  ];

  return (
    <RootContainer>
      <StyledAppBar position="absolute">
        <Toolbar>
          <Box sx={{ flexGrow: 1 }} />
          <TeamButton endIcon={<KeyboardArrowDown />} onClick={handleTeamMenuClick}>
            Premier League Teams
          </TeamButton>
          <Menu anchorEl={anchorEl} open={open} onClose={handleTeamMenuClose} PaperProps={{ component: TeamMenuPaper }}>
            {teams.map((team) => (
              <TeamMenuItem key={team.name} onClick={handleTeamMenuClose}>
                <TeamLogo src={team.logo} alt={team.name} />
                <Typography sx={{ color: '#fff', fontWeight: 600 }}>{team.name}</Typography>
              </TeamMenuItem>
            ))}
          </Menu>
          {!isMobile && (
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button sx={{ color: '#fff' }} onClick={() => navigate('/login')}>Sign In</Button>
              <ActionButton onClick={() => navigate('/register')}>Get Started</ActionButton>
            </Box>
          )}
        </Toolbar>
      </StyledAppBar>

      <HeroSection>
        <Container maxWidth="xl">
          <HeroContent container>
            <HeroTextSection item xs={12} md={6}>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                <LogoContainer>
                  <SportsSoccer />
                  <Typography variant="h3" sx={{ color: '#fff', fontWeight: 800 }}>
                    SCOUTER
                  </Typography>
                </LogoContainer>
                <Typography sx={{ color: '#e1bee7', mb: 4, lineHeight: 1.6 }}>
                  Professional tactical analysis and scouting platform for Premier League teams.
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <ActionButton onClick={() => navigate('/register')}>Get Started</ActionButton>
                  <Button variant="outlined" sx={{ borderColor: '#9c27b0', color: '#fff' }} onClick={() => navigate('/login')}>Sign In</Button>
                </Box>
              </motion.div>
            </HeroTextSection>

            <HeroImageSection item xs={12} md={6}>
              <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
                <HeroImage src="/images/managers-dark.jpg" alt="Legendary Managers" />
              </motion.div>
            </HeroImageSection>
          </HeroContent>
        </Container>
      </HeroSection>

      <Box sx={{ py: 10, background: 'linear-gradient(to bottom, #0a0a0a, #1a001f)' }}>
        <Container maxWidth="xl">
          <Typography variant="h4" sx={{ color: '#fff', mb: 4, fontWeight: 700 }}>
            Key Features
          </Typography>
          <FeaturesContainer>
            {features.map((f, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} viewport={{ once: true }}>
                <FeatureCard>
                  <FeatureIcon>{f.icon}</FeatureIcon>
                  <Typography variant="h6" sx={{ color: '#fff', fontWeight: 700, mb: 1 }}>{f.title}</Typography>
                  <Typography sx={{ color: '#ccc' }}>{f.description}</Typography>
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