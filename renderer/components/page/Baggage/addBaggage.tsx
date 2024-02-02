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

const initialBaggage: Baggage = {
  uid:'',
  baggageHandlingStatus: 'checked',
  baggageGroundStatus: 'receive for transport',
  height: 0,
  width: 0,
  weight: 0,
  passengerID: '',
  passengerName: '',
  photos: '',
};

export default function AddBaggage({ open, onClose }) {
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
  
  const [data, setData] = useState<Baggage>(() => initialBaggage);
  const [photo, setPhoto] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<AlertColor>('error');
  
  const resetUserData = () => {
    setData(initialBaggage);
  }
  
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleChange = (prop: keyof Baggage) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setData((prevData) => ({
      ...prevData,
      [prop]: event.target.value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setPhoto(file);
  };

  const validateFields = () => {
    if (
      data.baggageHandlingStatus.trim() === '' ||
      data.passengerID.trim() === '' ||
      data.passengerName.trim() === ''
    ) {
      setSnackbarMessage('Please fill all the fields!');
      setSnackbarOpen(true);
      return false;
    }
    return true;
  }

  const handleSubmit = async () => {
    if (validateFields()) {
      const collectionRef = collection(db, 'baggage');
      const docRef = await addDoc(collectionRef, data);

      const ext = photo.name.split('.')[1]
      const filename = `baggage/${docRef.id}.${ext}`;

      data.uid = docRef.id;
      data.photos = await uploadImage(filename, photo);

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
              <LockOutlinedIcon sx={{ color: 'red' }} />
            </Avatar>
            <Typography component="h1" variant="h5">
              Insert Baggage
            </Typography>
            <Box component="form" noValidate sx={{ mt: 3 }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="baggageHandlingStatus"
                    label="Baggage Handling Status"
                    type="text"
                    value={data.baggageHandlingStatus}
                    onChange={handleChange('baggageHandlingStatus')}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="passengerID"
                    label="Passenger ID"
                    type="text"
                    value={data.passengerID}
                    onChange={handleChange('passengerID')}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="passengerName"
                    label="Passenger Name"
                    type="text"
                    value={data.passengerName}
                    onChange={handleChange('passengerName')}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="height"
                    label="Height"
                    type="number"
                    value={data.height}
                    onChange={handleChange('height')}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="width"
                    label="Width"
                    type="number"
                    value={data.width}
                    onChange={handleChange('width')}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="weight"
                    label="Weight"
                    type="number"
                    value={data.weight}
                    onChange={handleChange('weight')}
                  />
                </Grid>
                <Grid item xs={12}>
                  <input
                    accept="image/*"
                    style={{ display: 'none' }}
                    id="photo"
                    type="file"
                    onChange={(e) => handleFileChange(e)}
                  />
                  <label htmlFor="photo">
                    <Button
                      fullWidth
                      variant="outlined"
                      component="span"
                      sx={{ mt: 3, mb: 2 }}
                    >
                      Upload Photo
                    </Button>
                  </label>
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
