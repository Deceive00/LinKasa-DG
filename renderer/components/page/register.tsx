import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useEffect, useState } from 'react';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import { createUserWithEmailAndPassword } from "firebase/auth"
import {  auth, db } from '../../../firebase/firebase-config'
import { doc, setDoc } from 'firebase/firestore';
import Image from 'next/image';
import { useRouter } from 'next/router';
import Snackbar from '@mui/material/Snackbar';
import Alert, { AlertColor } from '@mui/material/Alert';
import theme from '../../lib/theme';
import { Dialog } from '@mui/material';
import Singleton from '../../lib/singleton';

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

export default function Register({ open, onclose, onSuccess}: { open: boolean, onclose: () => void ,onSuccess : any}) {
  const [userData, setUserData] = useState<Guest>({
    email: '',
    name: '',
    password: '',
    role: '',
  });
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<AlertColor>('error');

  const [roles, setRoles] = useState<string[]>([]);

  useEffect(() => {
    const rolesInstance = Singleton.getInstance();
    const rolesData = rolesInstance.getRoles();
    setRoles(rolesData);
  }, []);

  const resetUserData = () => {
    setUserData({
      email: '',
      name: '',
      password: '',
      role: '',
    });
  }

  const createUserProfile = async (_uid : any, _name : any, _role : any, _email : any) => {
    try {
      const userRef = doc(db, 'users', _uid);
      await setDoc(userRef, {
        name: _name,
        role: _role,
        email: _email,
      });
      setSnackbarSeverity('success')
      setSnackbarMessage('User registered successfully');
      resetUserData();
      onclose();
    

    } catch (error : any) {
      setSnackbarMessage('Login failed, ' + error.message);
      setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };
  
  const handleRoleChange = (event : any) => {
    setUserData((prevUserData) => ({
      ...prevUserData,
      role: event.target.value,
    }));
  };

  const handleEmailChange = (event : any) => {
    setUserData((prevUserData) => ({
      ...prevUserData,
      email: event.target.value,
    }));
  };

  const handleNameChange = (event : any) => {
    setUserData((prevUserData) => ({
      ...prevUserData,
      name: event.target.value,
    }));
  };

  const handlePasswordChange = (event : any) => {
    setUserData((prevUserData) => ({
      ...prevUserData,
      password: event.target.value,
    }));
  };

  const validateFields = () => {
    if(userData.email.trim() === '' || 
      userData.password === '' || 
      userData.name.trim() === '' || 
      userData.role.trim() === ''){
        setSnackbarMessage('Please fill all the fields!');
        setSnackbarOpen(true);
      return false;
    }
    return true;
  }

  const handleSubmit = async () => {
    if(validateFields()){
      try {
        const response = await fetch('/api/createUser', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: userData.email,
            password: userData.password,
          }),
        });
  
        if (response.ok) {
          const data = await response.json();
          createUserProfile(data.uid, userData.name, userData.role, userData.email)
          setSnackbarMessage('Registration success!');
          setSnackbarSeverity('success');
          setSnackbarOpen(true);
          onclose();
          onSuccess();
        } 
        else {
          setSnackbarMessage('Registration failed, ' + response.statusText);
          setSnackbarSeverity('error');
          setSnackbarOpen(true);
        }
      } 
      catch (error) {
        setSnackbarMessage('Registration failed, ' + error.message);
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      }
    }
  };

  return (
    <Dialog open={open} onClose={onclose}>
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
              Register
            </Typography>
            <Box component="form" noValidate sx={{ mt: 3 }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    autoComplete="given-name"
                    name="fullName"
                    required
                    fullWidth
                    id="fullName"
                    label="Full Name"
                    autoFocus
                    onChange={handleNameChange}
                    InputLabelProps={{
                      sx: { color: 'rgba(0, 0, 0, 0.54)' },
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                    onChange={handleEmailChange}
                    InputLabelProps={{
                      sx: { color: 'rgba(0, 0, 0, 0.54)' },
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    autoComplete="new-password"
                    onChange={handlePasswordChange}
                    InputLabelProps={{
                      sx: { color: 'rgba(0, 0, 0, 0.54)' },
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                  <InputLabel htmlFor="role-select" sx={{ color: 'rgba(0, 0, 0, 0.54)' }}>
                    Select Role
                  </InputLabel>

                    <Select
                      value={userData.role}
                      onChange={handleRoleChange}
                      label="Select Role"
                      inputProps={{
                        name: 'role',
                        id: 'role-select',
                        color: 'rgba(0, 0, 0, 0.54)'
                      }}
                    >
                      {roles?.map((role) => (
                        <MenuItem key={role} value={role}>
                          {role}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

              </Grid>
              <Button
                fullWidth
                variant="contained"
                onClick={handleSubmit}
                sx={{ mt: 3, mb: 2 }}
              >
                Register
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