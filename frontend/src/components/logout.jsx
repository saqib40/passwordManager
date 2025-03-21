import React from 'react';
import { Button as MuiButton } from '@mui/material';
import { styled } from '@mui/system';
import { useNavigate } from 'react-router-dom';

// Custom styled button
const StyledButton = styled(MuiButton)(({ theme }) => ({
  borderRadius: '8px', // Rounded corners
  padding: theme.spacing(1.5, 4), // Comfortable padding
  fontWeight: 600, // Bold text
  textTransform: 'none', // No uppercase transformation
  boxShadow: theme.shadows[2], // Subtle shadow
  backgroundColor: theme.palette.secondary.main, // Light green as default
  color: theme.palette.text.primary, // White text
  '&:hover': {
    boxShadow: theme.shadows[4], // Stronger shadow on hover
    backgroundColor: theme.palette.secondary.light, // Lighter green on hover
    color: theme.palette.background.default, // Dark background text on hover
  },
}));

export default function CustomButton({ children, onClick, ...props }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear(); // Clear all localStorage (e.g., token)
    navigate('/login'); // Redirect to login
  };

  return (
    <StyledButton
      variant="contained"
      onClick={onClick || handleLogout} // Use passed onClick or default to logout
      {...props}
    >
      {children}
    </StyledButton>
  );
}