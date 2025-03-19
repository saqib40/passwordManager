import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Add useNavigate
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  ThemeProvider,
  Typography,
} from '@mui/material';
import { styled } from '@mui/system';
import { createTheme } from '@mui/material/styles';

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
    h6: {
      fontWeight: 700,
      color: '#ffffff',
    },
  },
});

// Styled components
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

interface OTPProps {
  open: boolean;
  onClose: () => void;
  propUrl: string;
}

export default function OTP({ open, onClose, propUrl }: OTPProps) {
  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState(false);
  const navigate = useNavigate(); // Add navigation hook

  // Toggle this flag to simulate backend response for testing
  const simulateBackend = false;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setOtpError(false);

    if (otp === '') {
      setOtpError(true);
      return;
    }

    if (simulateBackend) {
      console.log(`Simulated POST to ${propUrl} with OTP: ${otp}`);
      setTimeout(() => {
        const mockResponse = { success: true, token: 'mock-token-123' }; // Mock token
        if (mockResponse.success) {
          localStorage.setItem('myToken', mockResponse.token); // Store mock token
          alert('OTP verified successfully (simulated)');
          onClose();
          navigate('/dashboard'); // Navigate after verification
        } else {
          alert('Invalid OTP (simulated)');
        }
      }, 500);
      return;
    }

    try {
      const response = await fetch(propUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ otp }),
      });
      const responseData = await response.json();

      if (response.ok) {
        console.log('OTP verification successful:', responseData);
        localStorage.setItem('myToken', responseData.token); // Store token from backend
        alert('OTP verified successfully');
        onClose();
        navigate('/dashboard'); // Navigate after verification
      } else {
        console.error('OTP verification failed:', responseData);
        alert(responseData.message || 'Invalid OTP');
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      alert('An error occurred. Please try again.');
    }
  }

  return (
    <ThemeProvider theme={theme}>
      <Dialog
        open={open}
        onClose={onClose}
        PaperProps={{
          sx: {
            backgroundColor: theme.palette.background.paper,
            borderRadius: theme.shape.borderRadius,
            boxShadow: '0px 3px 3px -2px rgba(0,0,0,0.2), 0px 3px 4px 0px rgba(0,0,0,0.14), 0px 1px 8px 0px rgba(0,0,0,0.12)',
          },
        }}
      >
        <form noValidate onSubmit={handleSubmit}>
          <DialogTitle>
            <Typography variant="h6" align="center">
              Enter OTP
            </Typography>
          </DialogTitle>
          <DialogContent>
            <StyledTextField
              label="OTP"
              variant="outlined"
              color="secondary"
              required
              fullWidth
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              error={otpError}
              helperText={otpError ? 'OTP is required' : ''}
              sx={{ mt: 1 }}
            />
          </DialogContent>
          <DialogActions sx={{ justifyContent: 'center', pb: 2 }}>
            <Button
              variant="contained"
              color="secondary"
              type="submit"
              sx={{ width: '50%' }}
            >
              Verify OTP
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </ThemeProvider>
  );
}