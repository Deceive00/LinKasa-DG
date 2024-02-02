import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import { ThemeProvider } from "@mui/material/styles";
import { useState } from "react";
import { auth, db } from "../../../firebase/firebase-config";
import { getDoc, doc } from "firebase/firestore";
import { signInWithEmailAndPassword } from "firebase/auth";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import theme from "../../lib/theme";
import { useRouter } from "next/router";
import { useUser } from "../../lib/userContext";

function Copyright(props: any) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="https://mui.com/">
        LinKasa
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

export default function Login() {
  const currentUser = useUser();
  const router = useRouter();

  const [userData, setUserData] = useState<Guest>({
    email: "",
    name: "",
    password: "",
    role: "",
  });

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const handleEmailChange = (event) => {
    setUserData((prevUserData) => ({
      ...prevUserData,
      email: event.target.value,
    }));
  };

  const handlePasswordChange = (event) => {
    setUserData((prevUserData) => ({
      ...prevUserData,
      password: event.target.value,
    }));
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  // jangan lupa apus
  // React.useEffect(() => {
  //   handleLogin();
  // }, []);

  const validateEmailAndPassword = () => {
    if (userData.email.trim() == "" || userData.password.trim() == "") {
      setSnackbarMessage("Please fill all the fields!");
      setSnackbarOpen(true);
      return false;
    }
    return true;
  };

  const handleLogin = async () => {
    // await signInWithEmailAndPassword(auth, 'chiefoperationsofficer@linkasa.ac.id', 'rian1234');
    let isValid = validateEmailAndPassword();


    if (isValid) {
      try {
        await signInWithEmailAndPassword(auth, userData.email, userData.password);
        // await signInWithEmailAndPassword(auth, 'humanresourcedirector@example.com', 'rian1234');
        // await signInWithEmailAndPassword(auth, 'dor@example.com', 'rian1234');
        // await signInWithEmailAndPassword(auth, 'lostnfound@linkasa.ac.id', 'rian123');
        // await signInWithEmailAndPassword(auth, 'civilengineeringmanager@example.com', 'rian1234');
        // await signInWithEmailAndPassword(
        //   auth,
        //   "chiefoperationsofficer@linkasa.ac.id",
        //   "rian1234"
        // );
        // await signInWithEmailAndPassword(auth, 'lostnfound@linkasa.ac.id', 'rian123');
        const user = auth.currentUser;

        const userDoc = await getDoc(doc(db, "users", user.uid));
        const userCredential = userDoc.data();

        currentUser.setUser({
          id: userCredential.uid,
          name: userCredential.name,
          email: userCredential.email,
          role: userCredential.role,
        });

        router.push("/dashboard/dashboard");
      } catch (error) {
        setSnackbarMessage("Login failed, " + error.message);
        setSnackbarOpen(true);
      }
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Grid container component="main" sx={{ height: "100vh" }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage:
              "url(https://source.unsplash.com/random?wallpapers)",
            backgroundRepeat: "no-repeat",
            backgroundColor: (t) =>
              t.palette.mode === "light"
                ? t.palette.grey[50]
                : t.palette.grey[900],
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign in
            </Typography>
            <Box component="form" noValidate sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                onChange={handleEmailChange}
                InputLabelProps={{
                  sx: { color: "rgba(0, 0, 0, 0.54)" },
                }}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                onChange={handlePasswordChange}
                InputLabelProps={{
                  sx: { color: "rgba(0, 0, 0, 0.54)" },
                }}
              />
              <FormControlLabel
                control={<Checkbox value="remember" color="primary" />}
                label="Remember me"
              />
              <Button
                onClick={handleLogin}
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Login
              </Button>
              <Grid container>
                <Grid item xs>
                  <Link href="#" variant="body2">
                    Forgot password?
                  </Link>
                </Grid>
              </Grid>
              <Copyright sx={{ mt: 5 }} />
            </Box>
          </Box>
        </Grid>
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={3000}
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        >
          <Alert severity="error" onClose={handleSnackbarClose}>
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Grid>
    </ThemeProvider>
  );
}
