import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Grid,
  Card,
  Button,
  Box,
  ThemeProvider,
} from '@mui/material';
import { styled } from '@mui/system';
import { createTheme } from '@mui/material/styles';

// Custom dark theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#0d47a1', // Dark blue
    },
    secondary: {
      main: '#00c853', // Light green
    },
    background: {
      default: '#121212', // Dark background
      paper: '#1e1e1e', // Dark card background
    },
    text: {
      primary: '#ffffff', // White text
      secondary: '#b0bec5', // Light gray for secondary text
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 900,
      color: '#ffffff',
    },
    h4: {
      fontWeight: 500,
      color: '#ffffff',
    },
    h5: {
      fontWeight: 400,
      color: '#b0bec5',
    },
    body1: {
      color: '#b0bec5',
    },
  },
});

// Custom styles
const HeroSection = styled(Box)(({ theme }) => ({
  width: '100%',
  minHeight: '80vh',
  backgroundColor: theme.palette.background.default,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  padding: theme.spacing(4),
  boxSizing: 'border-box',
  color: theme.palette.text.primary,
}));

const FeatureCard = styled(Card)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: '#1e1e1e',
  color: '#ffffff',
  padding: theme.spacing(4),
  textAlign: 'center',
  borderRadius: '16px',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  '&:hover': {
    transform: 'translateY(-10px)',
    boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
  },
}));

const IconBox = styled(Box)({
  width: '80px',
  height: '80px',
  borderRadius: '50%',
  backgroundColor: '#00c853',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  marginBottom: '16px',
});

const CTASection = styled(Box)(({ theme }) => ({
  width: '100%',
  padding: theme.spacing(6),
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.text.primary,
  textAlign: 'center',
  boxSizing: 'border-box',
}));

const StyledButton = styled(Button)(({ theme }) => ({
  padding: theme.spacing(1.5, 4),
  fontWeight: 600,
  textTransform: 'none',
  boxShadow: '0px 3px 1px -2px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 1px 5px 0px rgba(0,0,0,0.12)', // Equivalent to shadows[2]
  '&:hover': {
    boxShadow: '0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12)', // Equivalent to shadows[4]
    backgroundColor: theme.palette.secondary.light,
  },
}));

function LandingPage() {
  const [hover, setHover] = useState(false);
  const navigate = useNavigate();

  return (
    <ThemeProvider theme={theme}>
      {/* Hero Section */}
      <HeroSection>
        <Typography
          variant="h1"
          align="center"
          gutterBottom
          sx={{ fontWeight: 900, textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}
        >
          Password Manager
        </Typography>
        <Typography variant="h5" align="center" gutterBottom sx={{ fontWeight: 300 }}>
          A full-stack minimal application to keep all your passwords safe in an encrypted way
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, mt: 4 }}>
          <StyledButton
            variant="contained"
            color="secondary"
            size="large"
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            onClick={() => navigate('/login')}
            style={{ transform: hover ? 'scale(1.05)' : 'scale(1)', transition: 'transform 0.2s' }}
          >
            Login
          </StyledButton>
          <StyledButton
            variant="contained"
            color="secondary"
            size="large"
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            onClick={() => navigate('/signup')}
            style={{ transform: hover ? 'scale(1.05)' : 'scale(1)', transition: 'transform 0.2s' }}
          >
            Signup
          </StyledButton>
        </Box>
      </HeroSection>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Key Features of 1984
      </Typography>
      <Grid container spacing={4} justifyContent="center">
        {["Secure Credential Vault", "Centralized Account Management", "Secure Data Retrieval"].map((title, index) => (
          <Grid item xs={12} sm={4} key={index}>
            <FeatureCard>
              <IconBox>
                <Typography variant="h6" color="inherit">{index + 1}</Typography>
              </IconBox>
              <Typography variant="h6" sx={{ mb: 2 }}>{title}</Typography>
              <Typography variant="body1">
                {index === 0 && "Provides a centralized, encrypted repository for all your login credentials, ensuring secure access and easy management across various online accounts."}
                {index === 1 && "Offers a unified interface for managing passwords and login details across multiple online accounts, streamlining access and organization."}
                {index === 2 && "Enables quick and secure retrieval of stored credentials, facilitating efficient logins while maintaining data integrity."}
              </Typography>
            </FeatureCard>
          </Grid>
        ))}
      </Grid>
    </Container>

      {/* Call-to-Action Section */}
      <CTASection>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 500 }}>
          Ready to Secure Your Passwords?
        </Typography>
        <Typography variant="body1" gutterBottom>
          Learn more about our architecture that we use for this project
        </Typography>
        <StyledButton
          variant="contained"
          color="secondary"
          size="large"
          sx={{ mt: 2 }}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          onClick={() => window.open('https://github.com/saqib40/passwordManager', '_blank')}
          style={{ transform: hover ? 'scale(1.05)' : 'scale(1)', transition: 'transform 0.2s' }}
        >
          View on GitHub
        </StyledButton>
      </CTASection>
    </ThemeProvider>
  );
}

export default LandingPage;