import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
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

const initialFlight: Flight = {
  airplaneID: '',
  id: '',
  departureAirport: '',
  arrivalAirport: '',
  departureTime: new Date(),
  arrivalTime: new Date(),
  status: 'Idle',
  passengerList:[],
};

export default function AddFlight({ open, onClose }) {
  const [airplaneOptions, setAirplaneOptions] = useState([]);
  const [selectedAirplane, setSelectedAirplane] = useState(null);
  const [data, setData] = useState<Flight>(() => initialFlight);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<AlertColor>('error');

  useEffect(() => {
    const fetchAirplaneOptions = async () => {
      try {
        const airplaneCollection = collection(db, 'airplanes');
        const airplaneSnapshot = await getDocs(airplaneCollection);
        const airplanes = airplaneSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setAirplaneOptions(airplanes);
      } catch (error) {
        console.error('Error fetching airplanes:', error);
      }
    };

    fetchAirplaneOptions();
  }, []);

  const resetFlightData = () => {
    setData(initialFlight);
    setSelectedAirplane(null);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleChange = (prop: keyof Flight) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setData((prevData) => ({
      ...prevData,
      [prop]: event.target.value,
    }));
  };

  const handleArrivalTime = (event) => {

    const newDate = new Date(event.target.value);
    setData((prevData) => ({ ...prevData, arrivalTime: newDate }));
  };
  const handleDepartureTime = (event) => {

    const newDate = new Date(event.target.value);
    setData((prevData) => ({ ...prevData, departureTime: newDate }));
  };

  const handleAirplaneChange = (event, value) => {
    setSelectedAirplane(value);
  };

  const validateFields = () => {
    if (
      data.departureAirport.trim() === '' ||
      data.arrivalAirport.trim() === '' ||
      data.status.trim() === '' ||
      !selectedAirplane
    ) {
      setSnackbarMessage('Please fill all the fields!');
      setSnackbarOpen(true);
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (validateFields()) {
      const collectionRef = collection(db, 'flights');
      const { id: flightId, ...dataWithoutId } = data;
      const docRef = await addDoc(collectionRef, {
        ...dataWithoutId,
        airplaneID: selectedAirplane.id,
        departureTime: Timestamp.fromDate(data.departureTime),
        arrivalTime: Timestamp.fromDate(data.arrivalTime),
      });

      data.id = docRef.id;

      resetFlightData();
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
              <FlightTakeoffIcon sx={{ color: 'blue' }} />
            </Avatar>
            <Typography component="h1" variant="h5">
              Insert Flight
            </Typography>
            <Box component="form" noValidate sx={{ mt: 3 }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="departureAirport"
                    label="Departure Airport"
                    type="text"
                    value={data.departureAirport}
                    onChange={handleChange('departureAirport')}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="arrivalAirport"
                    label="Arrival Airport"
                    type="text"
                    value={data.arrivalAirport}
                    onChange={handleChange('arrivalAirport')}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Autocomplete
                    id="airplaneID"
                    options={airplaneOptions}
                    getOptionLabel={(option) => option.id}
                    onChange={handleAirplaneChange}
                    value={selectedAirplane}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Select Airplane"
                        placeholder="Select Airplane"
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="departure time"
                    label="Departure Time"
                    type="datetime-local"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    value={data.departureTime.toISOString().slice(0, 16)}
                    onChange={handleDepartureTime}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="arrivalTime"
                    label="Arrival Time"
                    type="datetime-local"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    value={data.arrivalTime.toISOString().slice(0, 16)}
                    onChange={handleArrivalTime}
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
