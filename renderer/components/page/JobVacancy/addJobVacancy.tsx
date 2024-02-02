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
import { addDoc, collection, doc, setDoc } from 'firebase/firestore';
import theme from '../../../lib/theme';
import CustomListBox from '../../utils/CustomListBox';

const initialJobVacancy: JobVacancy = {
  title: '',
  description: '',
  location: '',
  qualifications: [],
  skills: [],
  deadline: new Date(),
  salary: 0,
  seats: 0,
  applicant: [],
};
export default function AddJobVacancy({open, onClose}){
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
  const [data, setData] = useState<JobVacancy>(() => initialJobVacancy);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<AlertColor>('error');

  const resetUserData = () => {
    setData(initialJobVacancy);
  }


  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };
  
  const handleChange = (prop: keyof JobVacancy) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setData((prevData) => ({
      ...prevData,
      [prop]: event.target.value,
    }));
  };

  const handleDateChange = (field) => (event) => {
    const newDate = new Date(event.target.value);
    setData((prevData) => ({ ...prevData, [field]: newDate }));
  };

  const handleSkillsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setData((prevData) => ({
      ...prevData,
      skills: event.target.value.split(','),
    }));
  };

  const handleQualificationsChange = (newValues) => {
    setData((prevData) => ({
      ...prevData,
      qualifications: newValues,
    }));
  };

  const validateFields = () => {
    if(data.title.trim() === '' || 
      data.description.trim() === '' || 
      data.location.trim() === '' || 
      data.seats === 0 || 
      data.salary === 0 || 
      data.deadline < new Date() || 
      data.qualifications.length === 0 || 
      data.skills.length === 0){
        setSnackbarMessage('Please fill all the fields!');
        setSnackbarOpen(true);
      return false;
    }
    return true;
  }

  const handleSubmit = async () => {
    if(validateFields()){
      const collectionRef = collection(db, 'jobVacancy');
      await addDoc(collectionRef, data);
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
              Insert Job Vacancy
            </Typography>
            <Box component="form" noValidate sx={{ mt: 3 }}>
              <Grid container spacing={2}>
                {/* ... (previous code) */}
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="title"
                    label="Title"
                    type="text"
                    value={data.title}
                    onChange={handleChange('title')}
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
                    value={data.location}
                    onChange={handleChange('location')}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="deadline"
                    label="Deadline"
                    type="date"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    value={data.deadline.toISOString().split('T')[0]}
                    onChange={handleDateChange('deadline')}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="salary"
                    label="Salary"
                    type="number"
                    value={data.salary}
                    onChange={handleChange('salary')}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="seats"
                    label="Seats"
                    type="number"
                    value={data.seats}
                    onChange={handleChange('seats')}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="skills"
                    label="Skills (comma-separated)"
                    value={data.skills.join(',')}
                    onChange={handleSkillsChange}
                  />
                </Grid>

                <Grid item xs={12}>
                  <CustomListBox onListChange={handleQualificationsChange} id='Qualifications' initialValues={[]}/>
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