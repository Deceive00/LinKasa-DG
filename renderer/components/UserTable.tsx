import React, { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { db } from '../../firebase/firebase-config'; 
import { collection, deleteDoc, doc, getDoc } from 'firebase/firestore';
import Input from '@mui/material/Input';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import { IconButton, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ConfirmationDialog from './menus/ConfirmationDialog';
import InfoIcon from '@mui/icons-material/Info';
import {getAllData} from "../lib/utils";
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertColor } from '@mui/material/Alert';

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

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));


export default function UserTable({success,onOpenDetail} : {success: any, onOpenDetail : any}) {
  const [userData, setUserData] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  let [prevData, setPrevData] = useState<User[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [userIdToDelete, setUserIdToDelete] = useState("");
  const [refetch, setRefetch] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('error');
  const [snackbarSeverity, setSnackbarSeverity] = useState<AlertColor>('error');

  useEffect(() => {
    
    const fetchuserData = async () => {

      try {
        const usersSnapshot = await getAllData('users');
        const userDatas = usersSnapshot.docs.map((doc) => {
          const userData = doc.data() as User;
      
          return {
            id: doc.id,
            ...userData,
          };
        });

        setUserData(userDatas);
        setPrevData(userDatas);

      } catch (error) {
        showMessage('Error fetching user', 'error');
      }
    };

    if(searchQuery.length === 0){
      fetchuserData();
    }
    else{
      let filteredUserData = prevData;
      filteredUserData = prevData.filter((user) =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.role.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setUserData(filteredUserData)
    }
  }, [success, searchQuery, refetch]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleOpenDialog = (id : string) => {
    setUserIdToDelete(id);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };
  const showMessage = (reason, type) => {
    setSnackbarOpen(true);
    setSnackbarMessage(reason);
    setSnackbarSeverity(type);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleDeleteData = async () => {
    const userDocRef = doc(db, 'users', userIdToDelete);
    let deleteUserFromDB;

    try {
      deleteUserFromDB = async () => {
        try {
          const response = await fetch('/api/deleteUser', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userIdToDelete }),
          });
          if (response.ok) {
            setRefetch(true);

            await deleteDoc(userDocRef);
            setUserIdToDelete('')
            showMessage('Successfully deleted user', 'success');
          } 
          else {
            showMessage('Error deleting user', 'error');
          }
        } catch (error) {
          showMessage('Error deleting user', 'error');
        }
      };
      handleCloseDialog();
    } catch (error) {
      showMessage('Error deleting user', 'error');
      handleCloseDialog();
    }

    try {
      const userDocSnapshot = await getDoc(userDocRef);
  
      if (userDocSnapshot.exists()) {
        const selectedUser = userDocSnapshot.data();
        
        if(selectedUser.role === 'Human Resource Director'){
          showMessage('You can\'t do that!', 'error');
  
          return;
        }
        else{
          deleteUserFromDB();
          setRefetch(false);
        }
      } 
      else {
        showMessage('Error! User doesn\'t exists', 'error')
      }
      handleCloseDialog();
    } catch (error) {
      showMessage('Error getting user', 'error');
      throw error;
    }


  };

  return (
    <div>
      <Input
        placeholder="Search by name"
        startAdornment={
          <InputAdornment position="start">
            <SearchIcon />
          </InputAdornment>
        }
        value={searchQuery}
        onChange={handleSearchChange}
        style={{ marginBlock: '1rem', width:'100%'}}
      />
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 700 }} aria-label="User table">
          <TableHead>
            <TableRow>
              <StyledTableCell style={{ backgroundColor: '#556cd6', color: 'whitesmoke', fontWeight:'900'}} align="left">Name</StyledTableCell>
              <StyledTableCell style={{ backgroundColor: '#556cd6', color: 'whitesmoke', fontWeight:'900'}} align="left">Email</StyledTableCell>
              <StyledTableCell style={{ backgroundColor: '#556cd6', color: 'whitesmoke', fontWeight:'900'}} align="left">Role</StyledTableCell>
              <StyledTableCell style={{ backgroundColor: '#556cd6', color: 'whitesmoke', fontWeight:'900'}} align="left"></StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody style={{width:'100%'}}>
            {
              userData.length !== 0 && (
                userData.map((user) => (
                  <StyledTableRow key={user.id}>
                    <StyledTableCell align="left" component="th" scope="row">
                      {user.name}
                    </StyledTableCell>
                    <StyledTableCell align="left">
                      {user.email}
                    </StyledTableCell>
                    <StyledTableCell align="left">
                      {user.role}
                    </StyledTableCell>
                    <StyledTableCell sx={{display:'flex', justifyContent:'flex-end'}}>
                      <IconButton onClick={() => onOpenDetail(user.id)}>
                        <InfoIcon />
                      </IconButton>
                      <IconButton aria-label="delete" size="large" onClick={() => handleOpenDialog(user.id)}>
                        <DeleteIcon fontSize='small' color='error'/>
                      </IconButton>
                    </StyledTableCell>


                  </StyledTableRow>
                ))
              )
            }
          </TableBody>
        </Table>
        {
          userData.length === 0 && (
            <div style={{display:'flex', justifyContent:'center', width: 'auto'}}>
              <Typography sx={{paddingY:'2rem'}}>
                There is no employee matched
              </Typography>
            </div>
          )
        }
      </TableContainer>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        
      >
        <MuiAlert
          elevation={6}
          variant="filled"
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
        >
          {snackbarMessage}
        </MuiAlert>
      </Snackbar>
      <ConfirmationDialog open={openDialog} onCancel={handleCloseDialog} onClose={handleCloseDialog} onConfirm={handleDeleteData} options={DEFAULT_OPTIONS}/>
    </div>
  );
}


