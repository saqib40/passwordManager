import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Typography,
  TextField,
  Button,
  Box,
  Link,
  ThemeProvider
} from '@mui/material';
import { styled } from '@mui/system';
import { createTheme } from '@mui/material/styles';
import OTP from '../components/otfverify';

// Custom theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#0d47a1',
    },
    secondary: {
      main: '#00c853',
    },
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
    text: {
      primary: '#ffffff',
      secondary: '#b0bec5',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h2: {
      fontWeight: 700,
      color: '#ffffff',
    },
  },
});

// Custom styles
const LoginContainer = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  width: '100vw',
  margin: 0,
  padding: 0,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: theme.palette.background.default,
  position: 'fixed',
  top: 0,
  left: 0,
  boxSizing: 'border-box',
}));

const FormBox = styled(Box)(({ theme }) => ({
  width: '30vw',
  maxWidth: '400px',
  backgroundColor: theme.palette.background.paper,
  padding: theme.spacing(4),
  borderRadius: theme.shape.borderRadius,
  boxShadow: '0px 3px 3px -2px rgba(0,0,0,0.2), 0px 3px 4px 0px rgba(0,0,0,0.14), 0px 1px 8px 0px rgba(0,0,0,0.12)',
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: theme.palette.text.secondary,
    },
    '&:hover fieldset': {
      borderColor: theme.palette.secondary.main,
    },
    '&.Mui-focused fieldset': {
      borderColor: theme.palette.secondary.main,
    },
  },
  '& .MuiInputLabel-root': {
    color: theme.palette.text.secondary,
  },
  '& .MuiInputLabel-root.Mui-focused': {
    color: theme.palette.secondary.main,
  },
  '& .MuiInputBase-input': {
    color: theme.palette.text.primary,
  },
}));

const StyledLink = styled(Link)(({ theme }) => ({
  color: theme.palette.secondary.main,
  textDecoration: 'underline',
  '&:hover': {
    color: theme.palette.secondary.light,
  },
}));

const LoaderDots = styled(Box)({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  '& span': {
    display: 'inline-block',
    width: '8px',
    height: '8px',
    backgroundColor: '#ffffff',
    borderRadius: '50%',
    margin: '0 4px',
    animation: 'dotFlashing 1s infinite linear alternate',
  },
  '& span:nth-child(2)': {
    animationDelay: '0.2s',
  },
  '& span:nth-child(3)': {
    animationDelay: '0.4s',
  },
  '@keyframes dotFlashing': {
    '0%': { opacity: 0.2 },
    '100%': { opacity: 1 },
  },
});

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [otpOpen, setOtpOpen] = useState(false);
  const [loading, setLoading] = useState(false); // Add loading state
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setEmailError(false);
    setPasswordError(false);

    if (email === '') {
      setEmailError(true);
    }
    if (password === '') {
      setPasswordError(true);
    }
    if (email && password) {
      setLoading(true); // Start loading
      try {
        const response = await fetch('http://localhost:4000/v1/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        });
        const responseData = await response.json();
        console.log('Login response:', responseData);
        if (response.status === 401) {
          alert(responseData.message);
        }
        if (response.ok) {
          setOtpOpen(true);
        }
      } catch (error) {
        console.error('An unexpected error occurred:', error);
        alert('An error occurred. Please try again.');
      } finally {
        setLoading(false); // Stop loading
      }
    }
  }

  return (
    <ThemeProvider theme={theme}>
      <LoginContainer>
        <FormBox>
          <Typography variant="h2" align="center" gutterBottom>
            Login
          </Typography>
          <form noValidate autoComplete="off" onSubmit={handleSubmit}>
            <StyledTextField
              onChange={(e) => setEmail(e.target.value)}
              label="Email Address"
              variant="outlined"
              color="secondary"
              required
              fullWidth
              error={emailError}
              helperText={emailError ? 'Email is required' : ''}
              sx={{ mb: 3 }}
            />
            <StyledTextField
              onChange={(e) => setPassword(e.target.value)}
              label="Password"
              variant="outlined"
              color="secondary"
              type="password"
              required
              fullWidth
              error={passwordError}
              helperText={passwordError ? 'Password is required' : ''}
              sx={{ mb: 3 }}
            />
            <Button
              fullWidth
              variant="contained"
              color="secondary"
              type="submit"
              sx={{ mt: 2 }}
              disabled={loading} // Disable button during loading
            >
              {loading ? (
                <LoaderDots>
                  <span></span>
                  <span></span>
                  <span></span>
                </LoaderDots>
              ) : (
                'Login'
              )}
            </Button>
          </form>
          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <StyledLink
              href="#"
              onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
                e.preventDefault();
                navigate('/signup');
              }}
            >
              Don't have an account? Sign up here
            </StyledLink>
          </Box>
        </FormBox>
      </LoginContainer>
      <OTP
        open={otpOpen}
        onClose={() => setOtpOpen(false)}
        propUrl="http://localhost:4000/v1/verifyLoginOTP"
      />
    </ThemeProvider>
  );
}