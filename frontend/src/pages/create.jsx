import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Typography,
  TextField,
  Button,
  Box,
  ThemeProvider,
} from '@mui/material';
import { styled } from '@mui/system';
import { createTheme } from '@mui/material/styles';

// Custom theme (same as Login)
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

// Custom styles (adapted from Login)
const CreateContainer = styled(Box)(({ theme }) => ({
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

export default function Create() {
  const [title, setTitle] = useState('');
  const [password, setPassword] = useState('');
  const [titleError, setTitleError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setTitleError(false);
    setPasswordError(false);

    if (title === '') {
      setTitleError(true);
    }
    if (password === '') {
      setPasswordError(true);
    }
    if (title && password) {
      setLoading(true);
      try {
        // Placeholder for backend API call
        const response = await fetch('http://localhost:4000/v1/create-password', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ title, password }),
        });
        const responseData = await response.json();
        console.log('Create response:', responseData);
        if (response.status === 400) {
          alert(responseData.message);
        }
        if (response.ok) {
          navigate('/dashboard'); // Redirect to dashboard on success
        }
      } catch (error) {
        console.error('An unexpected error occurred:', error);
        alert('An error occurred. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  }

  return (
    <ThemeProvider theme={theme}>
      <CreateContainer>
        <FormBox>
          <Typography variant="h2" align="center" gutterBottom>
            Create Password
          </Typography>
          <form noValidate autoComplete="off" onSubmit={handleSubmit}>
            <StyledTextField
              onChange={(e) => setTitle(e.target.value)}
              label="Title"
              variant="outlined"
              color="secondary"
              required
              fullWidth
              error={titleError}
              helperText={titleError ? 'Title is required' : ''}
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
              disabled={loading}
            >
              {loading ? (
                <LoaderDots>
                  <span></span>
                  <span></span>
                  <span></span>
                </LoaderDots>
              ) : (
                'Create'
              )}
            </Button>
          </form>
        </FormBox>
      </CreateContainer>
    </ThemeProvider>
  );
}