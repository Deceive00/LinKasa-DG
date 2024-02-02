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
import { useState, useEffect } from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert, { AlertColor } from '@mui/material/Alert';
import { Dialog } from '@mui/material';
import { db } from '../../../../firebase/firebase-config';
import { addDoc, collection, getDocs, Timestamp } from 'firebase/firestore';
import Autocomplete from '@mui/material/Autocomplete';
import theme from '../../../lib/theme';

const initialInterview: Interview = {
  id: '',
  candidateID: '',
  jobPosition: '',
  location: '',
  schedule: new Date(),
};

export default function AddInterview({ open, onClose }) {
  const [candidateOptions, setCandidateOptions] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [data, setData] = useState<Interview>(() => initialInterview);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<AlertColor>('error');

  useEffect(() => {
    const fetchCandidateOptions = async () => {
      try {
        const candidatesCollection = collection(db, 'jobCandidates');
        const candidatesSnapshot = await getDocs(candidatesCollection);
        const candidates = candidatesSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCandidateOptions(candidates);
      } catch (error) {
        console.error('Error fetching candidates:', error);
      }
    };

    fetchCandidateOptions();
  }, []);

  const resetInterviewData = () => {
    setData(initialInterview);
    setSelectedCandidate(null);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleChange = (prop: keyof Interview) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setData((prevData) => ({
      ...prevData,
      [prop]: event.target.value,
    }));
  };

  const handleDateChange = (event) => {
    const newDate = new Date(event.target.value);
    setData((prevData) => ({ ...prevData, schedule: newDate }));
  };

  const handleCandidateChange = (event, value) => {
    setSelectedCandidate(value);
  };

  const validateFields = () => {
    if (data.jobPosition.trim() === '' || data.location.trim() === '' || !selectedCandidate) {
      setSnackbarMessage('Please fill all the fields!');
      setSnackbarOpen(true);
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (validateFields()) {
      const collectionRef = collection(db, 'interview');
      const { id: _, ...dataWithoutId } = data;
      const docRef = await addDoc(collectionRef, {
        ...dataWithoutId,
        candidateID: selectedCandidate.id,
        schedule: Timestamp.fromDate(data.schedule),
      });

      data.id = docRef.id;

      resetInterviewData();
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
              Insert Interview
            </Typography>
            <Box component="form" noValidate sx={{ mt: 3 }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="jobPosition"
                    label="Job Position"
                    type="text"
                    value={data.jobPosition}
                    onChange={handleChange('jobPosition')}
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
                <Grid item xs={12}>
                  <Autocomplete
                    id="candidate"
                    options={candidateOptions}
                    getOptionLabel={(option) => `${option.name}`}
                    onChange={handleCandidateChange}
                    value={selectedCandidate}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Select Candidate"
                        placeholder="Select Candidate"
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="schedule"
                    label="Schedule"
                    type="datetime-local"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    value={data.schedule.toISOString().slice(0, 16)}
                    onChange={handleDateChange}
                  />
                </Grid>
              </Grid>
              <Button fullWidth variant="contained" onClick={handleSubmit} sx={{ mt: 3, mb: 2 }}>
                Insert Data
              </Button>
              <Grid container justifyContent="flex-end"></Grid>
            </Box>
          </Box>
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
        </Container>
      </ThemeProvider>
    </Dialog>
  );
}
