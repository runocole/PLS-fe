import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  Button,
  Container,
  alpha,
} from '@mui/material';
import {
  SportsSoccer as SportsSoccerIcon,
  EmojiEvents as TrophyIcon,
} from '@mui/icons-material';

const RegistrationSuccess = () => {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate('/login');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #2A0845 0%, #6441A5 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Animated soccer balls */}
      {[...Array(5)].map((_, i) => (
        <SportsSoccerIcon
          key={i}
          sx={{
            position: 'absolute',
            fontSize: 40 + Math.random() * 40,
            color: alpha('#fff', 0.2),
            animation: `float-${i} ${10 + i * 2}s ease-in-out infinite`,
            [`@keyframes float-${i}`]: {
              '0%, 100%': {
                transform: `translate(${Math.random() * 100}vw, ${Math.random() * 100}vh) rotate(0deg)`,
              },
              '50%': {
                transform: `translate(${Math.random() * 100}vw, ${Math.random() * 100}vh) rotate(360deg)`,
              },
            },
          }}
        />
      ))}

      <Container maxWidth="sm">
        <Paper
          elevation={24}
          sx={{
            p: 6,
            borderRadius: 3,
            backgroundColor: alpha('#1A1A1A', 0.85),
            backdropFilter: 'blur(10px)',
            boxShadow: '0 30px 60px rgba(0, 0, 0, 0.25), 0 10px 20px rgba(100, 65, 165, 0.2)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '4px',
              background: 'linear-gradient(90deg, #2A0845, #6441A5, #2A0845)',
              backgroundSize: '200% 100%',
              animation: 'gradient 15s ease infinite',
              '@keyframes gradient': {
                '0%': { backgroundPosition: '0% 50%' },
                '50%': { backgroundPosition: '100% 50%' },
                '100%': { backgroundPosition: '0% 50%' },
              },
            }}
          />

          <TrophyIcon
            sx={{
              fontSize: 80,
              color: '#FFD700',
              mb: 3,
              filter: 'drop-shadow(0 0 10px rgba(255, 215, 0, 0.5))',
            }}
          />

          <Typography
            variant="h4"
            component="h1"
            sx={{
              fontWeight: 800,
              color: '#fff',
              mb: 2,
              textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
            }}
          >
            Welcome to the Team!
          </Typography>

          <Typography
            variant="h6"
            sx={{
              color: alpha('#fff', 0.9),
              mb: 4,
              textShadow: '1px 1px 2px rgba(0,0,0,0.2)',
            }}
          >
            Your registration was successful!
          </Typography>

          <Box
            sx={{
              mb: 4,
              p: 3,
              borderRadius: 2,
              backgroundColor: alpha('#6441A5', 0.2),
              border: '1px solid ' + alpha('#6441A5', 0.3),
            }}
          >
            <Typography
              variant="body1"
              sx={{
                color: alpha('#fff', 0.8),
                mb: 1,
              }}
            >
              Redirecting to login in
            </Typography>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 'bold',
                color: '#6441A5',
                textShadow: '0 0 20px rgba(100, 65, 165, 0.5)',
              }}
            >
              {countdown}
            </Typography>
          </Box>

          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/login')}
            sx={{
              py: 1.5,
              px: 4,
              borderRadius: '12px',
              background: 'linear-gradient(45deg, #2A0845 30%, #6441A5 90%)',
              color: '#fff',
              fontSize: '1.1rem',
              fontWeight: 700,
              textTransform: 'none',
              letterSpacing: '0.5px',
              boxShadow: '0 4px 20px rgba(100, 65, 165, 0.4)',
              transition: 'all 0.3s ease',
              '&:hover': {
                background: 'linear-gradient(45deg, #2A0845 10%, #6441A5 70%)',
                transform: 'translateY(-2px)',
                boxShadow: '0 6px 30px rgba(100, 65, 165, 0.6)',
              },
            }}
          >
            Login Now
          </Button>
        </Paper>
      </Container>
    </Box>
  );
};

export default RegistrationSuccess; 