import { createTheme } from '@mui/material/styles';
import { lightTheme, darkTheme } from './colors.js';

export const getTheme = (mode: 'light' | 'dark') => {
  const colors = mode === 'light' ? lightTheme : darkTheme;

  return createTheme({
    palette: {
      mode,
      background: {
        default: colors.background,
        paper: colors.cardBackground,
      },
      text: {
        primary: colors.primary,
        secondary: colors.secondary,
      },
      success: {
        main: colors.accent,
      },
      error: {
        main: colors.negative,
      },
    },
    typography: {
     
      h1: {
        fontSize: '2rem',
        fontWeight: 700,
      },
      h2: {
        fontSize: '1.5rem',
        fontWeight: 600,
      },
      h3: {
        fontSize: '1.25rem',
        fontWeight: 600,
      },
      body1: {
        fontSize: '1rem',
      },
      body2: {
        fontSize: '0.875rem',
      },
    },
    components: {
      MuiCard: {
        styleOverrides: {
          root: {
            backgroundColor: colors.cardBackground,
            borderRadius: 16,
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 20,
            textTransform: 'none',
            fontWeight: 600,
          },
        },
      },
    },
  });
};