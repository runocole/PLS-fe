// Premier League team assets
export const teamAssets = {
  arsenal: {
    name: 'Arsenal',
    logo: '/logos/arsenal.png',
    colors: {
      primary: '#EF0107',
      secondary: '#FFFFFF',
    },
    stadium: 'Emirates Stadium',
  },
  astonVilla: {
    name: 'Aston Villa',
    logo: '/logos/aston-villa.png',
    colors: {
      primary: '#95BFE5',
      secondary: '#7B003C',
    },
    stadium: 'Villa Park',
  },
  bournemouth: {
    name: 'Bournemouth',
    logo: '/logos/bourne-mouth.png',
    colors: {
      primary: '#DA291C',
      secondary: '#000000',
    },
    stadium: 'Vitality Stadium',
  },
 newcastle: {
    name: 'New Castle',
    logo: '/logos/brentford.png',
    colors: {
      primary: '#E30613',
      secondary: '#FFFFFF',
    },
    stadium: 'Gtech Community Stadium',
  },
  brighton: {
    name: 'Brighton & Hove Albion',
    logo: '/logos/brighton.png',
    colors: {
      primary: '#0057B8',
      secondary: '#FFFFFF',
    },
    stadium: 'Amex Stadium',
  },
  chelsea: {
    name: 'Chelsea',
    logo: '/logos/chelsea.png',
    colors: {
      primary: '#034694',
      secondary: '#FFFFFF',
    },
    stadium: 'Stamford Bridge',
  },
  crystalPalace: {
    name: 'Crystal Palace',
    logo: '/logos/crystal-palace.png',
    colors: {
      primary: '#1B458F',
      secondary: '#C4122E',
    },
    stadium: 'Selhurst Park',
  },
  everton: {
    name: 'Everton',
    logo: '/logos/everton.png',
    colors: {
      primary: '#003399',
      secondary: '#FFFFFF',
    },
    stadium: 'Goodison Park',
  },
  fulham: {
    name: 'Fulham',
    logo: '/logos/fulham.png',
    colors: {
      primary: '#FFFFFF',
      secondary: '#000000',
    },
    stadium: 'Craven Cottage',
  },
  liverpool: {
    name: 'Liverpool',
    logo: '/logos/liverpool.png',
    colors: {
      primary: '#C8102E',
      secondary: '#F6EB61',
    },
    stadium: 'Anfield',
  },
  manchesterCity: {
    name: 'Manchester City',
    logo: '/assets/teams/manchester-city.png',
    colors: {
      primary: '#6CABDD',
      secondary: '#1C2C5B',
    },
    stadium: 'Etihad Stadium',
  },
  manchesterUnited: {
    name: 'Manchester United',
    logo: '/assets/teams/manchester-united.png',
    colors: {
      primary: '#DA291C',
      secondary: '#FBE122',
    },
    stadium: 'Old Trafford',
  },
  tottenham: {
    name: 'Tottenham Hotspur',
    logo: '/assets/teams/tottenham.png',
    colors: {
      primary: '#FFFFFF',
      secondary: '#132257',
    },
    stadium: 'Tottenham Hotspur Stadium',
  },
  // Add more teams as needed
};

// Get team assets by ID
export const getTeamAssets = (teamId) => {
  return teamAssets[teamId] || null;
};

// Get team logo URL
export const getTeamLogo = (teamId) => {
  const team = teamAssets[teamId];
  return team ? team.logo : null;
};

// Get team colors
export const getTeamColors = (teamId) => {
  const team = teamAssets[teamId];
  return team ? team.colors : null;
};

// Get team stadium
export const getTeamStadium = (teamId) => {
  const team = teamAssets[teamId];
  return team ? team.stadium : null;
};

// Get all teams
export const getAllTeams = () => {
  return Object.entries(teamAssets).map(([id, team]) => ({
    id,
    ...team,
  }));
}; 