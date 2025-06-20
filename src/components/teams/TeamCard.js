import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const Card = styled(motion.div)`
  background: var(--card-background);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.2s ease-in-out;

  &:hover {
    transform: translateY(-5px);
  }
`;

const CardImage = styled.div`
  width: 100%;
  height: 200px;
  background: ${props => `url(${props.imageUrl})`} center/cover no-repeat;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 60px;
    background: linear-gradient(to top, var(--card-background), transparent);
  }
`;

const CardContent = styled.div`
  padding: 1.5rem;
`;

const TeamName = styled.h3`
  color: var(--text-primary);
  margin: 0 0 0.5rem 0;
  font-size: 1.25rem;
`;

const TeamInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid var(--border-color);
`;

const TeamStats = styled.div`
  display: flex;
  gap: 1rem;
`;

const Stat = styled.div`
  text-align: center;
`;

const StatValue = styled.div`
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--primary-color);
`;

const StatLabel = styled.div`
  font-size: 0.875rem;
  color: var(--text-secondary);
`;

const TeamCard = ({ team }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/teams/${team.id}`);
  };

  return (
    <Card
      onClick={handleClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <CardImage imageUrl={team.logoUrl} />
      <CardContent>
        <TeamName>{team.name}</TeamName>
        <TeamInfo>
          <TeamStats>
            <Stat>
              <StatValue>{team.stats?.matches || 0}</StatValue>
              <StatLabel>Matches</StatLabel>
            </Stat>
            <Stat>
              <StatValue>{team.stats?.wins || 0}</StatValue>
              <StatLabel>Wins</StatLabel>
            </Stat>
            <Stat>
              <StatValue>{team.stats?.points || 0}</StatValue>
              <StatLabel>Points</StatLabel>
            </Stat>
          </TeamStats>
        </TeamInfo>
      </CardContent>
    </Card>
  );
};

export default TeamCard; 