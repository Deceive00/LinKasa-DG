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
import Singleton from '../../../lib/singleton';

const initialLostItem: LostItem = {
  uid:'',
  name: '',
  description: '',
  lostDate: new Date(),
  lostLocation: '',
  status: 'unclaimed',
  photos:''
};

export default function AddLostItem({open, onClose}){
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
  const [data, setData] = useState<LostItem>(() => initialLostItem);
  const [photo,setPhoto] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<AlertColor>('error');

  const resetUserData = () => {
    setData(initialLostItem);
  }


  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };
  
  const handleChange = (prop: keyof LostItem) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
    if(data.name.trim() === '' || 
      data.description.trim() === '' || 
      data.lostLocation.trim() === ''){
        setSnackbarMessage('Please fill all the fields!');
        setSnackbarOpen(true);
      return false;
    }
    return true;
  }

  const handleSubmit = async () => {
    if (validateFields()) {
      const collectionRef = collection(db, 'lostItem');
      const docRef = await addDoc(collectionRef, data);
      const ext = photo.name.split('.')[1]
      const filename = `lostItem/${docRef.id}.${ext}`;
      console.log(photo)
      data.uid = docRef.id;
      data.photos = await uploadImage(filename, photo);

      const message =  `A new Lost Item has been added (name: ${data.name}).`;
      Singleton.getInstance().addNotification('lost item insertion', 'Lost and Found Staff', message, data.uid);
  
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
              Insert Lost Item
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
                    id="location"
                    label="Location"
                    type="text"
                    value={data.lostLocation}
                    onChange={handleChange('lostLocation')}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="foundedDate"
                    label="Founded date"
                    type="date"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    value={data.lostDate.toISOString().split('T')[0]}
                    onChange={handleDateChange('lostDate')}
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


