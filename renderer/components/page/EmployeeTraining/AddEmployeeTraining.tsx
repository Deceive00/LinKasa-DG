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
import { Dialog, Link } from '@mui/material';
import { db } from '../../../../firebase/firebase-config';
import { addDoc, collection, getDocs, Timestamp } from 'firebase/firestore';
import Autocomplete from '@mui/material/Autocomplete';
import theme from '../../../lib/theme';

const initialEmployeeTraining: EmployeeTraining = {
  id: '',
  schedule: new Date(),
  listEmployee: [],
  topic: '',
  location: '',
  instructor: '',
};

export default function AddEmployeeTraining({ open, onClose }) {
  const [employeeOptions, setEmployeeOptions] = useState([]);
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [data, setData] = useState<EmployeeTraining>(() => initialEmployeeTraining);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<AlertColor>('error');

  useEffect(() => {
    const fetchEmployeeOptions = async () => {
      try {
        const employeeCollection = collection(db, 'users');
        const employeeSnapshot = await getDocs(employeeCollection);  
        const employees = employeeSnapshot.docs.map((doc) => ({
          id: doc.id,            
          ...doc.data(),
        }));
        setEmployeeOptions(employees);
      } catch (error) {
        console.error('Error fetching employees:', error);
      }
    };

    fetchEmployeeOptions();
  }, []);

  const resetEmployeeTrainingData = () => {
    setData(initialEmployeeTraining);
    setSelectedEmployees([]);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleChange = (prop: keyof EmployeeTraining) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setData((prevData) => ({
      ...prevData,
      [prop]: event.target.value,
    }));
  };

  const handleDateChange = (event) => {
    const newDate = new Date(event.target.value);
    setData((prevData) => ({ ...prevData, schedule: newDate }));
  };

  const handleEmployeeChange = (values) => {
    setSelectedEmployees(values);
  };

  const validateFields = () => {
    if (data.topic.trim() === '' || data.location.trim() === '' || data.instructor.trim() === '') {
      setSnackbarMessage('Please fill all the fields!');
      setSnackbarOpen(true);
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (validateFields()) {
      const collectionRef = collection(db, 'employeeTraining');
      const { id: id, ...dataWithoutId } = data;
      const docRef = await addDoc(collectionRef, {
        ...dataWithoutId,
        listEmployee: selectedEmployees.map((employee) => employee.id),
        schedule: Timestamp.fromDate(data.schedule),
      });

      data.id = docRef.id;

      resetEmployeeTrainingData();
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
              Insert Employee Training
            </Typography>
            <Box component="form" noValidate sx={{ mt: 3 }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="topic"
                    label="Topic"
                    type="text"
                    value={data.topic}
                    onChange={handleChange('topic')}
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
                  <TextField
                    required
                    fullWidth
                    id="instructor"
                    label="Instructor"
                    type="text"
                    value={data.instructor}
                    onChange={handleChange('instructor')}
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
                <Grid item xs={12}>
                  <Autocomplete
                    multiple
                    id="employee"
                    options={employeeOptions}
                    getOptionLabel={(option) => `${option.name} - ${option.role}`}
                    onChange={(event, values) => handleEmployeeChange(values)}
                    value={selectedEmployees}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Select Employees"
                        placeholder="Select Employees"
                      />
                    )}
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
