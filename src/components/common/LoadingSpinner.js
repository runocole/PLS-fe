import React from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';

const SpinnerContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: ${props => props.fullScreen ? '100vh' : '200px'};
  width: 100%;
  background: ${props => props.fullScreen ? 'var(--background-dark)' : 'transparent'};
`;

const SpinnerWrapper = styled(motion.div)`
  position: relative;
  width: 80px;
  height: 80px;
`;

const SpinnerCircle = styled(motion.div)`
  position: absolute;
  width: 100%;
  height: 100%;
  border: 4px solid transparent;
  border-top-color: var(--primary-color);
  border-radius: 50%;
`;

const SpinnerText = styled(motion.p)`
  position: absolute;
  bottom: -30px;
  left: 50%;
  transform: translateX(-50%);
  color: var(--text-primary);
  font-size: 14px;
  font-weight: 500;
  white-space: nowrap;
`;

const LoadingSpinner = ({ 
  fullScreen = false, 
  text = 'Loading...',
  size = 'medium'
}) => {
  const spinnerVariants = {
    animate: {
      rotate: 360,
      transition: {
        duration: 1,
        repeat: Infinity,
        ease: 'linear'
      }
    }
  };

  const textVariants = {
    initial: { opacity: 0, y: 10 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5,
        repeat: Infinity,
        repeatType: 'reverse'
      }
    }
  };

  const getSpinnerSize = () => {
    switch (size) {
      case 'small':
        return '40px';
      case 'large':
        return '120px';
      default:
        return '80px';
    }
  };

  return (
    <SpinnerContainer fullScreen={fullScreen}>
      <SpinnerWrapper
        style={{ width: getSpinnerSize(), height: getSpinnerSize() }}
      >
        <SpinnerCircle
          variants={spinnerVariants}
          animate="animate"
        />
        {text && (
          <SpinnerText
            variants={textVariants}
            initial="initial"
            animate="animate"
          >
            {text}
          </SpinnerText>
        )}
      </SpinnerWrapper>
    </SpinnerContainer>
  );
};

export default LoadingSpinner; 