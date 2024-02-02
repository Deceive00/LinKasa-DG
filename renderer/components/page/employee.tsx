import UserTable from "../UserTable";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "../../lib/theme";
import * as React from 'react';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import Register from "./register";
import AddIcon from '@mui/icons-material/Add';
import Typography from "@mui/material/Typography";
import UserDetail from "../detail/UserDetail";

export default function Employee({resetState, onResetState}){
  const [openRegisterDialog, setOpenRegisterDialog] = useState(false);
  const [success, setSuccess] = useState(false);
  const [edit, setEdit] = useState(false);
  const [userDetailID, setUserDetailID] = useState("");
  const handleOpenRegisterDialog = () => {
    setOpenRegisterDialog(true);
  };

  const handleCloseRegisterDialog = () => {
    setOpenRegisterDialog(false);
  };
  
  const handleSuccessRegister = () => {
    setSuccess(true);
  }

  const handleOpenDetail = (id : string) => {
    setUserDetailID(id);
    setEdit(true);
  }
  useEffect(() => {

    if (resetState) {
      setEdit(false);
      onResetState();
    }
  }, [resetState]);

  const handleCloseDetail = () => {
    setEdit(false);
  }
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
                Employee Lists
              </Typography>
              <div 
                style={{
                  width:'100%', 
                  height: '100vh', 
                  overflowY:'auto'
              }}>
                <UserTable success={success} onOpenDetail={handleOpenDetail}/>
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
                onClick={handleOpenRegisterDialog}
              >
                <AddIcon />
              </Button>
            </div>
          )
        }

        {
          edit && (
            <UserDetail id={userDetailID} onClose={handleCloseDetail}/>
          )
        }
        <Register open={openRegisterDialog} onclose={handleCloseRegisterDialog} onSuccess={handleSuccessRegister}/>
      </Box>
    </ThemeProvider>
  );
}
