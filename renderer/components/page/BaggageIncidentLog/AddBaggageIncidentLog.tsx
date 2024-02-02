import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useState } from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert, { AlertColor } from '@mui/material/Alert';
import { Dialog, Link } from '@mui/material';
import { db } from '../../../../firebase/firebase-config';
import { addDoc, collection, updateDoc } from 'firebase/firestore';
import theme from '../../../lib/theme';

interface BaggageIncidentLog {
  incidentID: string;
  description: string;
  actionTaken: string;
  time: Date;
}

const initialBaggageIncidentLog: BaggageIncidentLog = {
  incidentID: '',
  description: '',
  actionTaken: '',
  time: new Date(),
};

export default function AddBaggageIncidentLog({ open, onClose }) {
  function Copyright(props: any) {
    return (
      <Typography variant="body2" color="text.secondary" align="center" {...props}>
        {'Copyright © '}
        <Link color="inherit" href="https://mui.com/">
          LinKasa
        </Link>{' '}
        {new Date().getFullYear()}
        {'.'}
      </Typography>
    );
  }
  const [data, setData] = useState<BaggageIncidentLog>(() => initialBaggageIncidentLog);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<AlertColor>('error');

  const resetUserData = () => {
    setData(initialBaggageIncidentLog);
  }

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleChange = (prop: keyof BaggageIncidentLog) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setData((prevData) => ({
      ...prevData,
      [prop]: event.target.value,
    }));
  };

  const handleDateChange = (field: keyof BaggageIncidentLog) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = new Date(event.target.value);
    setData((prevData) => ({ ...prevData, [field]: newDate }));
  };

  const validateFields = () => {
    if (data.description.trim() === '' ||
      data.actionTaken.trim() === '') {
      setSnackbarMessage('Please fill all the fields!');
      setSnackbarOpen(true);
      return false;
    }
    return true;
  }

  const handleSubmit = async () => {
    if (validateFields()) {
      const collectionRef = collection(db, 'baggageIncidentLog');
      const docRef = await addDoc(collectionRef, data);
      data.incidentID = docRef.id;

      await updateDoc(docRef, data as { [x: string]: any });

      resetUserData();
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
              <LockOutlinedIcon sx={{ color: 'red' }} />

            </Avatar>
            <Typography component="h1" variant="h5">
              Insert Baggage Incident Log
            </Typography>
            <Box component="form" noValidate sx={{ mt: 3 }}>
              <Grid container spacing={2}>

                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="description"
                    label="Description"
                    type="text"
                    value={data.description}
                    onChange={handleChange('description')}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="actionTaken"
                    label="Action Taken"
                    type="text"
                    value={data.actionTaken}
                    onChange={handleChange('actionTaken')}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="time"
                    label="Time"
                    type="date"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    value={data.time.toISOString().split('T')[0]}
                    onChange={handleDateChange('time')}
                  />
                </Grid>
              </Grid>
              <Button fullWidth variant="contained" onClick={handleSubmit} sx={{ mt: 3, mb: 2 }}>
                Insert Data
              </Button>
              <Grid container justifyContent="flex-end">

              </Grid>
            </Box>
          </Box>
          <Copyright sx={{ my: 5 }} />
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

        <Grid></Grid>
      </ThemeProvider>
    </Dialog>
  );
}
