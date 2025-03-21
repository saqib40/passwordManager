import { useState, useEffect } from 'react';
import {
  Typography,
  Box,
  Grid2,
  ThemeProvider,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material';
import { styled } from '@mui/system';
import { createTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Delete from '@mui/icons-material/Delete';
import CustomButton from '../components/logout';

// Custom dark theme
const theme = createTheme({
  palette: {
    primary: { main: '#0d47a1' },
    secondary: { main: '#00c853' },
    background: { default: '#121212', paper: '#1e1e1e' },
    text: { primary: '#ffffff', secondary: '#b0bec5' },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h2: { fontWeight: 700, color: '#ffffff' },
    h6: { fontWeight: 600, color: '#ffffff' },
    body2: { fontWeight: 400, color: '#b0bec5' },
  },
});

// Styled components
const DashboardContainer = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: theme.palette.background.default,
  padding: theme.spacing(4),
  boxSizing: 'border-box',
}));

const HeaderSection = styled(Box)(({ theme }) => ({
  width: '100%',
  padding: theme.spacing(2),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
}));

const ButtonGroup = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(2),
}));

const PasswordCard = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  padding: theme.spacing(2),
  borderRadius: '12px',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  minWidth: '280px',
  maxWidth: '320px',
  height: '140px',
  transition: 'transform 0.2s, box-shadow 0.2s',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 6px 25px rgba(0, 0, 0, 0.5)',
  },
}));

const ContentWrapper = styled(Box)(({ theme }) => ({
  flexGrow: 1,
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(3), // Consistent spacing between header, grid, and footer
}));

const FooterSection = styled(Box)(({ theme }) => ({
  width: '100%',
  padding: theme.spacing(2),
  textAlign: 'center',
  marginTop: "30px",
}));

// Type definition for password entry
interface PasswordEntry {
  id: number;
  title: string;
  encrypted: string;
  decrypted: string;
}

// Synthetic data
const initialPasswords: PasswordEntry[] = [
  { id: 1, title: 'Email', encrypted: 'XyK9p#mN$2qL', decrypted: 'mypassword123' },
  { id: 2, title: 'Bank', encrypted: '7jP#vR8$kQwM', decrypted: 'securebank456' },
  { id: 3, title: 'Social Media', encrypted: 'aBcD1eF2gH3i', decrypted: 'socialmedia789' },
  { id: 4, title: 'Work Account', encrypted: 'QWeRtY6uI7oP', decrypted: 'workpass000' },
  { id: 5, title: 'Shopping', encrypted: 'zXcVbN9mAsD0', decrypted: 'shopping111' },
  { id: 6, title: 'Forum', encrypted: 'lKjHgF5dSaZ1', decrypted: 'forum222' },
  { id: 7, title: 'Cloud Storage', encrypted: 'pOiUyT4rEwQ2', decrypted: 'cloud333' },
  { id: 8, title: 'Gaming', encrypted: 'mJnBhVgC3xZ4', decrypted: 'game444' },
  { id: 9, title: 'Personal Blog', encrypted: 'nMbVcXsA5zQ6', decrypted: 'blog555' },
  { id: 10, title: 'Home Router', encrypted: 'bVcCxZaS7qW8', decrypted: 'router666' },
  { id: 11, title: 'VPN', encrypted: 'cXvVbAsD9eR0', decrypted: 'vpn777' },
  { id: 12, title: 'Database', encrypted: 'vCbBnMsL1iK2', decrypted: 'db888' },
  { id: 13, title: 'DevOps', encrypted: 'bNmMnKlJ3hG4', decrypted: 'devops999' },
  { id: 14, title: 'CRM', encrypted: 'nMlKjIhG5fD6', decrypted: 'crm1010' },
  { id: 15, title: 'CMS', encrypted: 'lKjHgF5dSaZ7', decrypted: 'cms1111' },
  { id: 16, title: 'E-commerce', encrypted: 'kIjHgF5dSaZ8', decrypted: 'ecommerce1212' },
  { id: 17, title: 'Project Management', encrypted: 'jIhGfEdS9aZ0', decrypted: 'project1313' },
  { id: 18, title: 'HR System', encrypted: 'iHgFeDsA1zX2', decrypted: 'hr1414' },
  { id: 19, title: 'Finance', encrypted: 'hGfEdSaZ3xC4', decrypted: 'finance1515' },
  { id: 20, title: 'Legal', encrypted: 'gFeDsAzX5cV6', decrypted: 'legal1616' },
  { id: 21, title: 'Marketing', encrypted: 'fEdSaZxC7vB8', decrypted: 'marketing1717' },
  { id: 22, title: 'Sales', encrypted: 'eDsAzXcV9bN0', decrypted: 'sales1818' },
  { id: 23, title: 'Support', encrypted: 'dSaZxCvB1nM2', decrypted: 'support1919' },
  { id: 24, title: 'Inventory', encrypted: 'sAzXcVbN3mM4', decrypted: 'inventory2020' },
  { id: 25, title: 'Shipping', encrypted: 'aZxCvBnM5mJ6', decrypted: 'shipping2121' },
  { id: 26, title: 'Receiving', encrypted: 'zXcVbNmJ7nI8', decrypted: 'receiving2222' },
  { id: 27, title: 'Manufacturing', encrypted: 'xCvBnMjI9hG0', decrypted: 'manufacturing2323' },
  { id: 28, title: 'Quality Control', encrypted: 'cVbNmJiH1gF2', decrypted: 'quality2424' },
  { id: 29, title: 'Research', encrypted: 'vBnMjIhG3fE4', decrypted: 'research2525' },
  { id: 30, title: 'Development', encrypted: 'bNmJiHgF5dS6', decrypted: 'development2626' },
  { id: 31, title: 'Testing', encrypted: 'nMjIhGfE7dR8', decrypted: 'testing2727' },
  { id: 32, title: 'Staging', encrypted: 'mJiHgFeD9sA0', decrypted: 'staging2828' },
  { id: 33, title: 'Production', encrypted: 'jIhGfEdS1aZ2', decrypted: 'production2929' },
  { id: 34, title: 'Backup', encrypted: 'iHgFeDsA3zX4', decrypted: 'backup3030' },
  { id: 35, title: 'Archive', encrypted: 'hGfEdSaZ5xC6', decrypted: 'archive3131' },
  { id: 36, title: 'Logs', encrypted: 'gFeDsAzX7vB8', decrypted: 'logs3232' },
  { id: 37, title: 'Monitoring', encrypted: 'fEdSaZxC9bN0', decrypted: 'monitoring3333' },
  { id: 38, title: 'Alerts', encrypted: 'eDsAzXcV1nM2', decrypted: 'alerts3434' },
  { id: 39, title: 'API', encrypted: 'dSaZxCvB3mM4', decrypted: 'api3535' },
  { id: 40, title: 'SDK', encrypted: 'sAzXcVbN5mJ6', decrypted: 'sdk3636' },
  { id: 41, title: 'Library', encrypted: 'aZxCvBnM7nI8', decrypted: 'library3737' },
  { id: 42, title: 'Framework', encrypted: 'zXcVbNmJ9hG0', decrypted: 'framework3838' },
  { id: 43, title: 'Plugin', encrypted: 'xCvBnMjI1gF2', decrypted: 'plugin3939' },
  { id: 44, title: 'Extension', encrypted: 'cVbNmJiH3fE4', decrypted: 'extension4040' },
  { id: 45, title: 'Module', encrypted: 'vBnMjIhG5dS6', decrypted: 'module4141' },
  { id: 46, title: 'Component', encrypted: 'bNmJiHgF7dR8', decrypted: 'component4242' },
  { id: 47, title: 'Service', encrypted: 'nMjIhGfE9sA0', decrypted: 'service4343' },
  { id: 48, title: 'Utility', encrypted: 'mJiHgFeD1aZ2', decrypted: 'utility4444' },
  { id: 49, title: 'Configuration', encrypted: 'jIhGfEdS3zX4', decrypted: 'config4545' },
  { id: 50, title: 'Settings', encrypted: 'iHgFeDsA5xC6', decrypted: 'settings4646' },
];

export default function PasswordDashboard() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [visiblePasswords, setVisiblePasswords] = useState<Record<number, boolean>>({});
  const [passwords, setPasswords] = useState<PasswordEntry[]>(initialPasswords);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [passwordToDelete, setPasswordToDelete] = useState<number | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('myToken');
    setIsAuthenticated(!!token);
  }, []);

  const togglePasswordVisibility = (id: number) => {
    setVisiblePasswords((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const openDeleteDialog = (id: number) => {
    setPasswordToDelete(id);
    setDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setPasswordToDelete(null);
  };

  const confirmDelete = () => {
    if (passwordToDelete !== null) {
      setPasswords((prev) => prev.filter((entry) => entry.id !== passwordToDelete));
      setVisiblePasswords((prev) => {
        const newState = { ...prev };
        delete newState[passwordToDelete];
        return newState;
      });
    }
    closeDeleteDialog();
  };

  const handleAddMore = () => {
    navigate('/create');
  };

  if (!isAuthenticated) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
        bgcolor={theme.palette.background.default}
      >
        <Typography variant="h6" color="error">
          You aren't authorized to access this route. Please login.
        </Typography>
      </Box>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <DashboardContainer>
        <ContentWrapper>
          {/* Header with Title and Buttons */}
          <HeaderSection>
            <Typography variant="h2">Password Manager</Typography>
            <ButtonGroup>
              <CustomButton onClick={handleAddMore}>Add More</CustomButton>
              <CustomButton>Log Out</CustomButton>
            </ButtonGroup>
          </HeaderSection>

          {/* Password List */}
          <Grid2 container spacing={3}>
            {passwords.map((entry) => (
              <Grid2 size={{ xs: 12, sm: 6, md: 4 }} key={entry.id}>
                <PasswordCard>
                  <Box>
                    <Typography variant="h6" gutterBottom>
                      {entry.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {visiblePasswords[entry.id] ? entry.decrypted : entry.encrypted}
                    </Typography>
                  </Box>
                  <Box display="flex" justifyContent="flex-end" width="100%" mt={1}>
                    <IconButton
                      onClick={() => togglePasswordVisibility(entry.id)}
                      sx={{ color: '#ffffff', padding: '6px' }}
                    >
                      {visiblePasswords[entry.id] ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                    <IconButton
                      onClick={() => openDeleteDialog(entry.id)}
                      sx={{ color: '#ff1744', padding: '6px' }}
                    >
                      <Delete />
                    </IconButton>
                  </Box>
                </PasswordCard>
              </Grid2>
            ))}
          </Grid2>
        </ContentWrapper>

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={deleteDialogOpen}
          onClose={closeDeleteDialog}
          PaperProps={{
            sx: { backgroundColor: '#1e1e1e', color: '#ffffff' },
          }}
        >
          <DialogTitle>Confirm Deletion</DialogTitle>
          <DialogContent>
            <Typography>Are you sure you want to delete this password?</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={closeDeleteDialog} color="primary">
              Cancel
            </Button>
            <Button
              onClick={confirmDelete}
              color="error"
              variant="contained"
              sx={{ backgroundColor: '#ff1744' }}
            >
              Yes, Delete
            </Button>
          </DialogActions>
        </Dialog>

        {/* Footer */}
        <FooterSection>
          <Typography variant="body1" color="text.secondary">
            Securely managing your passwords
          </Typography>
        </FooterSection>
      </DashboardContainer>
    </ThemeProvider>
  );
}