import { createTheme } from '@mui/material/styles';

// Custom colors for sports analytics dashboard
const colors = {
  primary: {
    main: '#00B2FF', // Bright blue
    light: '#33C1FF',
    dark: '#0082B8',
    contrastText: '#FFFFFF',
  },
  secondary: {
    main: '#FF5400', // Bright orange
    light: '#FF7B33',
    dark: '#B83C00',
    contrastText: '#000000',
  },
  background: {
    default: '#121212', // Near black
    paper: '#1A1A1A', // Dark gray
    dark: '#000000', // Pure black
    card: '#1E1E1E', // Slightly lighter dark gray for cards
  },
  success: {
    main: '#00E676',
    light: '#33EB91',
    dark: '#00A152',
    contrastText: '#000000',
  },
  error: {
    main: '#FF3D00',
    light: '#FF6333',
    dark: '#B82A00',
    contrastText: '#FFFFFF',
  },
  warning: {
    main: '#FFAB00',
    light: '#FFBB33',
    dark: '#B87800',
    contrastText: '#000000',
  },
  info: {
    main: '#00B0FF',
    light: '#33BFFF',
    dark: '#007BB2',
    contrastText: '#FFFFFF',
  },
  text: {
    primary: '#FFFFFF',
    secondary: '#B0B0B0',
    disabled: '#686868',
  },
  divider: 'rgba(255, 255, 255, 0.12)',
};

// Custom typography
const typography = {
  fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
  h1: {
    fontSize: '2.5rem',
    fontWeight: 700,
    letterSpacing: '-0.01562em',
    color: '#FFFFFF',
  },
  h2: {
    fontSize: '2rem',
    fontWeight: 600,
    letterSpacing: '-0.00833em',
    color: '#FFFFFF',
  },
  h3: {
    fontSize: '1.75rem',
    fontWeight: 600,
    letterSpacing: '0em',
    color: '#FFFFFF',
  },
  h4: {
    fontSize: '1.5rem',
    fontWeight: 600,
    letterSpacing: '0.00735em',
    color: '#FFFFFF',
  },
  h5: {
    fontSize: '1.25rem',
    fontWeight: 600,
    letterSpacing: '0em',
    color: '#FFFFFF',
  },
  h6: {
    fontSize: '1rem',
    fontWeight: 600,
    letterSpacing: '0.0075em',
    color: '#FFFFFF',
  },
  subtitle1: {
    fontSize: '1rem',
    fontWeight: 400,
    letterSpacing: '0.00938em',
    color: '#B0B0B0',
  },
  subtitle2: {
    fontSize: '0.875rem',
    fontWeight: 500,
    letterSpacing: '0.00714em',
    color: '#B0B0B0',
  },
  body1: {
    fontSize: '1rem',
    fontWeight: 400,
    letterSpacing: '0.00938em',
    color: '#FFFFFF',
  },
  body2: {
    fontSize: '0.875rem',
    fontWeight: 400,
    letterSpacing: '0.01071em',
    color: '#B0B0B0',
  },
  button: {
    fontSize: '0.875rem',
    fontWeight: 500,
    letterSpacing: '0.02857em',
    textTransform: 'none',
  },
};

// Custom component styles
const components = {
  MuiCssBaseline: {
    styleOverrides: {
      body: {
        backgroundColor: '#121212',
        scrollbarWidth: 'thin',
        scrollbarColor: '#00B2FF #1A1A1A',
        '&::-webkit-scrollbar': {
          width: '6px',
          height: '6px',
        },
        '&::-webkit-scrollbar-track': {
          background: '#1A1A1A',
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: '#00B2FF',
          borderRadius: '3px',
        },
      },
    },
  },
  MuiButton: {
    styleOverrides: {
      root: {
        borderRadius: 6,
        padding: '8px 16px',
        textTransform: 'none',
        fontWeight: 600,
      },
      contained: {
        boxShadow: '0px 2px 12px rgba(0, 178, 255, 0.3)',
        '&:hover': {
          boxShadow: '0px 4px 15px rgba(0, 178, 255, 0.4)',
        },
      },
      outlinedPrimary: {
        borderWidth: '2px',
        '&:hover': {
          borderWidth: '2px',
        },
      },
    },
  },
  MuiCard: {
    styleOverrides: {
      root: {
        backgroundColor: '#1E1E1E',
        borderRadius: 12,
        boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.2)',
        backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0))',
        backdropFilter: 'blur(4px)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
      },
    },
  },
  MuiAppBar: {
    styleOverrides: {
      root: {
        backgroundImage: 'linear-gradient(90deg, #000000, #121212)',
        boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.3)',
      },
    },
  },
  MuiDrawer: {
    styleOverrides: {
      paper: {
        backgroundColor: '#000000',
        backgroundImage: 'linear-gradient(180deg, #121212, #000000)',
        borderRight: '1px solid rgba(255, 255, 255, 0.1)',
      },
    },
  },
  MuiPaper: {
    styleOverrides: {
      root: {
        backgroundColor: '#1A1A1A',
        backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0))',
        boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.2)',
        borderRadius: 12,
      },
    },
  },
  MuiTextField: {
    styleOverrides: {
      root: {
        '& .MuiOutlinedInput-root': {
          borderRadius: 8,
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          '& fieldset': {
            borderColor: 'rgba(255, 255, 255, 0.15)',
          },
          '&:hover fieldset': {
            borderColor: 'rgba(255, 255, 255, 0.25)',
          },
          '&.Mui-focused fieldset': {
            borderColor: '#00B2FF',
          },
        },
      },
    },
  },
  MuiChip: {
    styleOverrides: {
      root: {
        borderRadius: 16,
        backgroundColor: 'rgba(0, 178, 255, 0.15)',
        '&.MuiChip-colorPrimary': {
          backgroundColor: 'rgba(0, 178, 255, 0.15)',
        },
        '&.MuiChip-colorSecondary': {
          backgroundColor: 'rgba(255, 84, 0, 0.15)',
        },
      },
      label: {
        fontWeight: 500,
      },
    },
  },
  MuiTab: {
    styleOverrides: {
      root: {
        textTransform: 'none',
        fontWeight: 600,
        fontSize: '0.875rem',
      },
    },
  },
  MuiTabs: {
    styleOverrides: {
      indicator: {
        height: 3,
        borderRadius: '3px 3px 0 0',
      },
    },
  },
};

// Create and export the theme
const theme = createTheme({
  palette: colors,
  typography,
  components,
  shape: {
    borderRadius: 8,
  },
  shadows: [
    'none',
    '0px 2px 4px rgba(0, 0, 0, 0.2)',
    '0px 4px 8px rgba(0, 0, 0, 0.2)',
    '0px 6px 12px rgba(0, 0, 0, 0.2)',
    '0px 8px 16px rgba(0, 0, 0, 0.2)',
    // ... add more shadows as needed
  ],
});

export default theme; 