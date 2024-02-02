
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "../../../lib/theme";
import * as React from 'react';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import Register from "../register";
import AddIcon from '@mui/icons-material/Add';
import Typography from "@mui/material/Typography";
import UserDetail from "../../detail/UserDetail";
import AddJobVacancy from "./addJobVacancy";
import DataListTable from "../../menus/DataListTable";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import GenericDetail from "../../detail/GenericDetail";
import Singleton from "../../../lib/singleton";
import { db } from "../../../../firebase/firebase-config";
import { Timestamp, deleteDoc, doc, getDoc, updateDoc } from "firebase/firestore";
import { deleteItemByID } from "../../../lib/utils";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

export default function JobVacancy({resetState, onResetState}){
  const [openDialog, setOpenDialog] = useState(false);
  const [success, setSuccess] = useState(false);
  const [edit, setEdit] = useState(false);
  const [jobVacancyID, setJobVacancyID] = useState("");

  useEffect(() => {

    if (resetState) {
      setEdit(false);
      onResetState();
    }
  }, [resetState]);

  const handleAddJobVacancyDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseJobVacancyDialog = () => {
    setOpenDialog(false);
  };
  
  const handleSuccessAdd = () => {
    setSuccess(true);
  }

  const handleOpenDetail = (id : string) => {
    setJobVacancyID(id);
    setEdit(true);
  }

  const handleCloseDetail = () => {
    setEdit(false);
  }
  const headers = [
    'Title', 'Seats' ,'Expiry Date', ''
  ]
  const rowRenderer = (data) => {
    return[
        <StyledTableCell key={`title-${data.id}`} align="left">
          {data.title}
        </StyledTableCell>,
        <StyledTableCell key={`seats-${data.id}`} align="left">
          {data.seats}
        </StyledTableCell>,
        <StyledTableCell key={`deadline-${data.id}`} align="left">
          {data.deadline.toDate().toLocaleString()}
        </StyledTableCell>,
    ];
  }
  
  const fetchData = async (id) => {
    try {
      const jobVacancyRef = doc(db, 'jobVacancy', id);
  

      const docSnapshot = await getDoc(jobVacancyRef);
  
      if (docSnapshot.exists()) {
        const data = docSnapshot.data();
        if (data && data.deadline) {
          data.deadline = (data.deadline as Timestamp).toDate();
        }
        return data;
      }
      else {

        console.error(`Document with id ${id} does not exist in the jobVacancy collection`);
        return null;
      }
    } catch (error) {
      console.error('Error fetching jobVacancy data:', error.message);
      throw error; 
    }
  };
  const updateData = async (id, newData) => {
    try {
      const jobVacancyRef = doc(db, 'jobVacancy', id);
      await updateDoc(jobVacancyRef, newData);
  
      console.log('Document updated successfully');
    } catch (error) {
      console.error('Error updating jobVacancy data:', error.message);
      throw error; 
    }
  };
  
  const handleDeleteItem = async () => {
    if(await deleteItemByID('jobVacancy', jobVacancyID) === ''){
      console.log('deleted succesfully');
    }
  };
  
  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ 
        paddingTop: '10vh', 
        paddingInline: '4rem',  
        display: 'flex', 
        width:'100%', 
        flexDirection:'column',
        flexGrow: 1,
        height: '100vh',
        overflow: 'auto',
      }}>

        <CssBaseline />

        {
          !edit && (
            <div>
              <Typography variant="h3" gutterBottom>
                Job Vacancy Lists
              </Typography>
              <div 
                style={{
                  width:'100%', 
                  height: '100vh', 
                  overflowY:'auto'
              }}>
                {/* <UserTable success={success} onOpenDetail={handleOpenDetail}/> */}
                <DataListTable collectionName='jobVacancy' headers={headers} rowRenderer={rowRenderer} onOpenDetail={handleOpenDetail} collectionTitle='Job Vacancy' searchKey={'title'}/>
              </div>
              <Button
                variant="contained"
                color="primary"
                style={{
                  width:'20px',
                  height:'40px',
                  position: 'fixed',
                  bottom: '16px',
                  right: '16px',
                  borderRadius: '50%', 
                  paddingBlock: '2rem'
                }}
                onClick={handleAddJobVacancyDialog}
              >
                <AddIcon />
              </Button>
            </div>
          )
        }

        {
          edit && (
            <GenericDetail 
              id={jobVacancyID} 
              onClose={handleCloseDetail} 
              objectType="jobVacancy" 
              confirmationOptions={Singleton.getInstance().getDeleteDefaultOptions()} 
              fetchData={fetchData} 
              updateData={updateData} 
              deleteData={handleDeleteItem} />
          )
        }

      <AddJobVacancy open={openDialog} onClose={handleCloseJobVacancyDialog}/>
      </Box>
    </ThemeProvider>
  );
}
