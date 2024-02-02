// AddInfrastructure.jsx
import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useState } from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert, { AlertColor } from '@mui/material/Alert';
import { Dialog, Link } from '@mui/material';
import { db } from '../../../../firebase/firebase-config';
import { addDoc, collection, updateDoc, doc } from 'firebase/firestore';
import theme from '../../../lib/theme';

const initialInfrastructureData = {
  name: '',
  type: '',
  location: '',
  status: 'operational',
};

export default function AddInfrastructure({ open, onClose }) {
  const [data, setData] = useState(() => initialInfrastructureData);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<AlertColor>('error');

  const resetInfrastructureData = () => {
    setData(initialInfrastructureData);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleChange = (prop) => (event) => {
    setData((prevData) => ({
      ...prevData,
      [prop]: event.target.value,
    }));
  };

  const validateFields = () => {
    if (
      data.name.trim() === '' ||
      data.type.trim() === '' ||
      data.location.trim() === '' 
    ) {
      setSnackbarMessage('Please fill all the fields!');
      setSnackbarOpen(true);
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (validateFields()) {
      const collectionRef = collection(db, 'infrastructure');
      const docRef = await addDoc(collectionRef, data);
      resetInfrastructureData();
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <ThemeProvider theme={theme}>
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <Box
            sx={{
              marginTop: 8,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: '#FFFFFF' }}>
              <AddCircleOutlineIcon sx={{ color: 'green' }} />
            </Avatar>
            <Typography component="h1" variant="h5">
              Add Infrastructure
            </Typography>
            <Box component="form" noValidate sx={{ mt: 3 }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="name"
                    label="Name"
                    type="text"
                    value={data.name}
                    onChange={handleChange('name')}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="type"
                    label="Type"
                    type="text"
                    value={data.type}
                    onChange={handleChange('type')}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="location"
                    label="Location"
                    type="text"
                    value={data.location}
                    onChange={handleChange('location')}
                  />
                </Grid>
              </Grid>
              <Button
                fullWidth
                variant="contained"
                onClick={handleSubmit}
                sx={{ mt: 3, mb: 2 }}
              >
                Add Infrastructure
              </Button>
              <Grid container justifyContent="flex-end"></Grid>
            </Box>
          </Box>
        </Container>
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={3000}
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        >
          <Alert severity={snackbarSeverity} onClose={handleSnackbarClose}>
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </ThemeProvider>
    </Dialog>
  );
}
