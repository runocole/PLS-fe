import { Box, CircularProgress, Typography } from '@mui/material';
import styled, { keyframes } from 'styled-components';

const pulse = keyframes`
  0% {
    transform: scale(0.95);
    opacity: 0.5;
  }
  50% {
    transform: scale(1);
    opacity: 1;
  }
  100% {
    transform: scale(0.95);
    opacity: 0.5;
  }
`;

const AnimatedBox = styled(Box)`
  animation: ${pulse} 2s ease-in-out infinite;
`;

const LoadingScreen = ({ message = 'Loading...' }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        bgcolor: 'background.default',
        gap: 2,
      }}
    >
      <AnimatedBox>
        <CircularProgress
          size={60}
          thickness={4}
          sx={{
            color: 'primary.main',
            '& .MuiCircularProgress-circle': {
              strokeLinecap: 'round',
            },
          }}
        />
      </AnimatedBox>
      <AnimatedBox>
        <Typography
          variant="h6"
          sx={{
            color: 'text.secondary',
            fontWeight: 500,
          }}
        >
          {message}
        </Typography>
      </AnimatedBox>
    </Box>
  );
};

export default LoadingScreen; 