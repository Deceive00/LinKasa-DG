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
import { Autocomplete, Dialog, Link } from '@mui/material';
import { db, storage } from '../../../../firebase/firebase-config';
import { addDoc, collection, doc, updateDoc, getDocs } from 'firebase/firestore';
import theme from '../../../lib/theme';
import CustomList from './CustomList';

const initialMaintenance: Maintenance = {
  infrastructureID: '',
  infrastructureName:'',
  id: '',
  schedule: new Date(),
  personnel: [],
  status: 'need maintenance',
};

export default function AddMaintenance({ open, onClose }) {
  function Copyright(props: any) {
    return (
      <Typography variant="body2" color="text.secondary" align="center"  {...props}>
        {'Copyright © '}
        <Link color="inherit" href="https://mui.com/">
          LinKasa
        </Link>{' '}
        {new Date().getFullYear()}
        {'.'}
      </Typography>
    );
  }
  
  const [data, setData] = useState<Maintenance>(() => initialMaintenance);
  const [infrastructures, setInfrastructures] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<AlertColor>('error');
  
  useEffect(() => {
    const fetchInfrastructures = async () => {
      try {
        const infrastructureCollection = collection(db, 'infrastructure');
        const infrastructureSnapshot = await getDocs(infrastructureCollection);  
        const infrastructureList = infrastructureSnapshot.docs.map((doc) => ({
          id: doc.id,            
          ...doc.data(),
        }));
        setInfrastructures(infrastructureList);
      } catch (error) {
        console.error('Error fetching infrastructures:', error);
      }
    };

    fetchInfrastructures();
  }, []);

  const resetMaintenanceData = () => {
    setData(initialMaintenance);
  }
  
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleChange = (prop: keyof Maintenance) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setData((prevData) => ({
      ...prevData,
      [prop]: event.target.value,
    }));
  };

  const handleDate = (event) => {

    const newDate = new Date(event.target.value);
    setData((prevData) => ({ ...prevData, schedule: newDate }));
  };

  const validateFields = () => {
    if (
      data.infrastructureID.trim() === '' ||
      data.personnel.length === 0
    ) {
      setSnackbarMessage('Please fill all the fields!');
      setSnackbarOpen(true);
      return false;
    }
    return true;
  }
  const handleInfrastructure = (value) => {
    setData((prevData) => ({
      ...prevData,
      infrastructureName: value,
    }));
  }
  const handleSubmit = async () => {
    if (validateFields()) {
      const collectionRef = collection(db, 'maintenance');
      const { id: _, ...dataWithoutId } = data;
      const docRef = await addDoc(collectionRef, dataWithoutId);

      resetMaintenanceData();
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
              Insert Maintenance
            </Typography>
            <Box component="form" noValidate sx={{ mt: 3 }}>
              <Grid container spacing={2}>
              <Grid item xs={12}>
                  <Autocomplete
                    fullWidth
                    id="infrastructureID"
                    options={infrastructures}
                    getOptionLabel={(infrastructure) => infrastructure.name}
                    value={infrastructures.find((i) => i.id === data.infrastructureID) || null}
                    onChange={(_, newValue) => {
                      handleChange('infrastructureID')({ target: { value: newValue?.id || '' } } as React.ChangeEvent<HTMLInputElement>);
                      handleInfrastructure(newValue?.name);
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        required
                        label="Infrastructure ID"
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
                    onChange={handleDate}
                  />
                </Grid>
                <Grid item xs={12}>
                  <CustomList
                    label="Personnel"
                    selectedValues={data.personnel}
                    onChange={(values) => handleChange('personnel')({ target: { value: values } } as React.ChangeEvent<HTMLInputElement>)}
                    options={['Budi Harjanto', 'Angga Suryjana', 'Ryan Budiyanto']} 
                    multiple
                  />
                </Grid>
              </Grid>
              <Button fullWidth variant="contained" onClick={handleSubmit} sx={{ mt: 3, mb: 2 }}>
                Insert Data
              </Button>
              <Grid container justifyContent="flex-end"></Grid>
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
