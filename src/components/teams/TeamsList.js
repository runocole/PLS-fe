import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { fetchTeams } from '../../store/slices/teamsSlice';
import LoadingSpinner from '../common/LoadingSpinner';
import TeamCard from './TeamCard';

const TeamsContainer = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const TeamsGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
`;

const ErrorMessage = styled.div`
  background: var(--error-background);
  color: var(--error-text);
  padding: 1rem;
  border-radius: 8px;
  margin: 1rem 0;
  text-align: center;
`;

const TeamsList = () => {
  const dispatch = useDispatch();
  const { teams, loading, error } = useSelector((state) => state.teams);

  useEffect(() => {
    dispatch(fetchTeams());
  }, [dispatch]);

  if (loading.teams) {
    return <LoadingSpinner text="Loading teams..." />;
  }

  if (error.teams) {
    return (
      <ErrorMessage>
        <h3>Error loading teams</h3>
        <p>{error.teams}</p>
      </ErrorMessage>
    );
  }

  return (
    <TeamsContainer>
      <h2>Premier League Teams</h2>
      <TeamsGrid
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {teams.map((team) => (
          <TeamCard key={team.id} team={team} />
        ))}
      </TeamsGrid>
    </TeamsContainer>
  );
};

export default TeamsList; 