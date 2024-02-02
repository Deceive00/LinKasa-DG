import React, { useState, useEffect } from "react";
import { TextField, Button, Typography, IconButton, Snackbar, Alert } from "@mui/material";
import { deleteDoc, doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../../firebase/firebase-config"; 
import ConfirmationDialog from "../menus/ConfirmationDialog";
import KeyboardBackspaceRoundedIcon from '@mui/icons-material/KeyboardBackspaceRounded';
interface Mode{
  delete: boolean,
  update: boolean
}

const DEFAULT_OPTIONS = {
  title: "Are you sure?",
  description: "Remove the employee records?",
  content: null,
  confirmationText: "Ok",
  cancellationText: "Cancel",
  dialogProps: {},
  dialogActionsProps: {},
  confirmationButtonProps: {},
  cancellationButtonProps: {},
  titleProps: {},
  contentProps: {},
  allowClose: true,
  confirmationKeywordTextFieldProps: {},
  hideCancelButton: false,
  buttonOrder: ["cancel", "confirm"],
};
export default function UserDetail({ id , onClose }) {
  const [userData, setUserData] = useState<User>({
    email: '',
    id: id,
    role: '',
    name: ''
  });

  const [boolDialog, setBoolDialog] = useState<Mode>({
    delete: false,
    update: false,
  });
  
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('error');
  const [snackbarSeverity, setSnackbarSeverity] = useState('error');

  const handleDeleteDialog = () => {
    setBoolDialog((prev) => ({
      ...prev,
      delete: true,
    }));
  };
  const handleUpdateDialog = () => {
    setBoolDialog((prev) => ({
      ...prev,
      update: true,
    }));
  };

  const handleCloseDialog = () => {
    setBoolDialog((prev) => ({
      ...prev,
      update: false,
      delete: false,
    }));
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };
  
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userDocRef = doc(db, "users", id);
        const userDocSnapshot = await getDoc(userDocRef);

        if (userDocSnapshot.exists()) {
          const userDataFromFirestore = userDocSnapshot.data() as User;
          setUserData(userDataFromFirestore);
        }
      } catch (error) {
        console.error("Error fetching user data:", error.message);
      }
    };

    fetchUserData();
  }, [id]);

  const handleChange = (attribute, value) => {
    setUserData((prevUserData) => ({
      ...prevUserData,
      [attribute]: value,
    }));
  };

  const handleUpdate = async () => {
    try {
      const userDocRef = doc(db, "users", id);
      await updateDoc(userDocRef, userData);
      handleCloseDialog();
      showMessage('Succesfully updated user data', 'success')
    } catch (error) {
      showMessage('Error updating user data'+error.message, 'success')
    }
  };
  const showMessage = (reason, type) => {
    setSnackbarOpen(true);
    setSnackbarMessage(reason);
    setSnackbarSeverity(type);
  };

  const deleteUserFromDB = async () => {
    try {
      console.log(id)
      const response = await fetch('/api/deleteUser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userIdToDelete:id }),
      });
      if (response.ok) {
        console.log('ok?')
        const userDocRef = doc(db, 'users', id);
        await deleteDoc(userDocRef);
        onClose();
      } 
      else {
        showMessage('Error deleting user', 'error');
      }
    } catch (error) {
      showMessage('Error deleting user', 'error');
    }
  };

  return (
    <div>
      <div style={{display:'flex', alignItems:'center', marginBottom:'3vh'}}>
        <IconButton onClick={onClose}>
          <KeyboardBackspaceRoundedIcon fontSize="large"/>
        </IconButton>
        <Typography variant="h3" gutterBottom sx={{display:'flex', alignItems:'center', margin:0, marginLeft:'2vw'}}>
          Employee Details
        </Typography>
      </div>
      <div style={{ padding: "20px", maxWidth: "600px", }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <TextField
            id="outlined-basic"
            label="Role"
            variant="outlined"
            value={userData.role}
            onChange={(e) => handleChange("role", e.target.value)}
            disabled
          />
          <TextField
            id="outlined-basic"
            label="Email"
            variant="outlined"
            value={userData.email}
            onChange={(e) => handleChange("email", e.target.value)}
            disabled
          />
          <TextField
            id="outlined-basic"
            label="Name"
            variant="outlined"
            value={userData.name}
            onChange={(e) => handleChange("name", e.target.value)}
          />
        </div>
        <Button
          variant="contained"
          color="primary"
          style={{ marginTop: "16px" }}
          onClick={handleUpdateDialog}
        >
          Update
        </Button>
        <Button
          variant="contained"
          color="primary"
          style={{ marginTop: "16px" }}
          onClick={handleDeleteDialog}
        >
          Delete
        </Button>
      </div>   
      <ConfirmationDialog open={boolDialog.update} onCancel={handleCloseDialog} onClose={handleCloseDialog} onConfirm={handleUpdate} options={DEFAULT_OPTIONS}/>
      <ConfirmationDialog open={boolDialog.delete} onCancel={handleCloseDialog} onClose={handleCloseDialog} onConfirm={deleteUserFromDB} options={DEFAULT_OPTIONS}/>
      <Snackbar
          open={snackbarOpen}
          autoHideDuration={3000}
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        >
          <Alert severity={'success'} onClose={handleSnackbarClose}>
            {snackbarMessage}
          </Alert>
        </Snackbar>
    </div>

  );
}
