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
import { db, storage } from '../../../../firebase/firebase-config';
import { addDoc, collection, doc, setDoc, updateDoc } from 'firebase/firestore';
import theme from '../../../lib/theme';
import CustomListBox from '../../utils/CustomListBox';
import { getDownloadURL, ref, uploadBytes, uploadBytesResumable } from 'firebase/storage';
import { uploadImage } from '../../../lib/utils';

const initialIncidentLog: IncidentLog = {
  incidentID:'',
  nature:'',
  time: new Date(),
  location:''
};

export default function AddIncidentLog({open, onClose}){
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
  const [data, setData] = useState<IncidentLog>(() => initialIncidentLog);
  const [photo,setPhoto] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<AlertColor>('error');

  const resetUserData = () => {
    setData(initialIncidentLog);
  }


  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };
  
  const handleChange = (prop: keyof IncidentLog) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setData((prevData) => ({
      ...prevData,
      [prop]: event.target.value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setPhoto(file);
  };

  const handleDateChange = (field) => (event) => {
    const newDate = new Date(event.target.value);
    setData((prevData) => ({ ...prevData, [field]: newDate }));
  };

  const validateFields = () => {
    if(data.nature.trim() === '' || 
      data.location.trim() === '' ){
        setSnackbarMessage('Please fill all the fields!');
        setSnackbarOpen(true);
      return false;
    }
    return true;
  }

  const handleSubmit = async () => {
    if (validateFields()) {
      const collectionRef = collection(db, 'incidentLog');
      const docRef = await addDoc(collectionRef, data);
      data.incidentID = docRef.id;

      await updateDoc(docRef, data);
  
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
              <LockOutlinedIcon sx={{color:'red'}}/>

            </Avatar>
            <Typography component="h1" variant="h5">
              Insert Incident Log
            </Typography>
            <Box component="form" noValidate sx={{ mt: 3 }}>
              <Grid container spacing={2}>

                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="nature"
                    label="Nature"
                    type="text"
                    value={data.nature}
                    onChange={handleChange('nature')}
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


