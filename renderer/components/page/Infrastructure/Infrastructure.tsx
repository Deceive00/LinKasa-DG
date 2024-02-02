import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "../../../lib/theme";
import * as React from "react";
import { styled, createTheme, ThemeProvider } from "@mui/material/styles";
import { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import Register from "../register";
import AddIcon from "@mui/icons-material/Add";
import Typography from "@mui/material/Typography";
import UserDetail from "../../detail/UserDetail";
import DataListTable from "../../menus/DataListTable";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import GenericDetail from "../../detail/GenericDetail";
import Singleton from "../../../lib/singleton";
import { db } from "../../../../firebase/firebase-config";

import {
  Timestamp,
  deleteDoc,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { deleteItemByID } from "../../../lib/utils";

import UpdateIcon from "@mui/icons-material/Update";
import { IconButton } from "@mui/material";
import ConfirmationDialog from "../../menus/ConfirmationDialog";
import { ReturnedToOwnerStyle, UnclaimedStyle } from "../LostAndFound/lostItemStatusState";
// import { CheckedStyle, DelayedStyle, InTransitStyle, LoadingStyle, ReceivedStyle, TransferStyle, UnloadStyle } from "./InfrastructureHandlingStatusState";
import StatusDialog from "../../menus/StatusDialog";
import AddInfrastructure from "./addInfrastructure";
import { OperationalStyle, UnderMaintenanceStyle, UnusedStyle } from "./infrastructureStatusState";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

export default function Infrastructure({ resetState, onResetState }) {
  const [openDialog, setOpenDialog] = useState(false);
  const [edit, setEdit] = useState(false);
  const [infrastructureID, setInfrastructureID] = useState("");
  const [status, setStatus] = useState("unclaimed");
  const [infrastructureHandlingStatuses, setInfrastructureHandlingStatus] = useState('checked');
  const [confirmationDialog, setConfirmationDialog] = useState(false);
  const [data, setData] = useState<Infrastructure>();
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);

  useEffect(() => {
    if (resetState) {
      setEdit(false);
      onResetState();
    }
  }, [resetState]);

  const handleAddInfrastructure = () => {
    setOpenDialog(true);
  };

  const handleCloseInfrastructureDialog = () => {
    setOpenDialog(false);
  };

  const handleOpenDetail = (id: string) => {
    setInfrastructureID(id);
    setEdit(true);
  };

  const handleCloseDetail = () => {
    setEdit(false);
  };
  const headers = ["Infrastructure Name", "Location", "Status", "", ""];
  const infrastructureHandlingStatus = [
    'under maintenance',
    'operational',
    'unused'
  ];
  const getStatusStyleContext = (_data) => {
    setInfrastructureHandlingStatus(_data.status);
    switch (_data.status) {
      case "under maintenance":
        return new UnderMaintenanceStyle();
      case "operational":
        return new OperationalStyle();
      case "unused":
        return new UnusedStyle();
      default:
        return null;
    }
  };

  const applyStatusStyle = (_data) => {
    const statusStyleContext = getStatusStyleContext(_data);
    return statusStyleContext ? statusStyleContext.applyStyle() : {};
  };

  const rowRenderer = (_data) => {
    return [
      <StyledTableCell key={`name-${_data.id}`} align="left">
        {_data.name}
      </StyledTableCell>,
      <StyledTableCell key={`date-${_data.id}`} align="left">
        {_data.location}
      </StyledTableCell>,
      <StyledTableCell key={`status-${_data.id}`} align="left">
        <Typography style={applyStatusStyle(_data)}>
          {_data.status}
        </Typography>
      </StyledTableCell>,
      (
        <StyledTableCell key={`button-${_data.id}`} align="right">
          <IconButton
            onClick={() => {
              setData(_data);
              setStatusDialogOpen(true);
            }}
          >
            <UpdateIcon />
          </IconButton>
        </StyledTableCell>
      ),
    ];
  };

  const fetchData = async (id) => {
    try {
      const infrastructureRef = doc(db, "infrastructure", id);

      const docSnapshot = await getDoc(infrastructureRef);

      if (docSnapshot.exists()) {
        const data = docSnapshot.data();
        return data;
      } else {
        console.error(
          `Document with id ${id} does not exist in the Infrastructure collection`
        );
        return null;
      }
    } catch (error) {
      console.error("Error fetching Infrastructure data:", error.message);
      throw error;
    }
  };

  const updateData = async (id, newData) => {

    try {
      const infrastructureRef = doc(db, "infrastructure", id);
    
      await updateDoc(infrastructureRef, newData);

      console.log("Document updated successfully");
    } catch (error) {
      console.error("Error updating Infrastructure data:", error.message);
      throw error;
    }
  };

  const handleDeleteItem = async () => {
    if ((await deleteItemByID("infrastructure", infrastructureID)) === "") {
      console.log("deleted succesfully");
    }
  };

  const handleUpdateStatus = async () => {
    setStatusDialogOpen(true);

  };

  const handleStatusDialogClose = () => {
    setStatusDialogOpen(false);
  };

  const handleStatusUpdate = async (_status) => {
    if (infrastructureHandlingStatus.includes(_status)) {


      const updatedData = {
        ...data,
        status: _status,
      };
      await updateData(data.id, updatedData);
      setStatusDialogOpen(false);
    } else {
      alert("Invalid status");
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          paddingTop: "10vh",
          paddingInline: "4rem",
          display: "flex",
          width: "100%",
          flexDirection: "column",
          flexGrow: 1,
          height: "100vh",
          overflow: "auto",
          
        }}
      >
        <CssBaseline />

        {!edit && (
          <div>
            <Typography variant="h3" gutterBottom>
              Infrastructure Lists
            </Typography>
            <div
              style={{
                width: "100%",
                height: "100vh",
                overflowY: "auto",
              }}
            >
              <DataListTable
                collectionName="infrastructure"
                headers={headers}
                rowRenderer={rowRenderer}
                onOpenDetail={handleOpenDetail}
                collectionTitle="Infrastructure"
                searchKey={'name'}
              />
            </div>
            <Button
              variant="contained"
              color="primary"
              style={{
                width: "20px",
                height: "40px",
                position: "fixed",
                bottom: "16px",
                right: "16px",
                borderRadius: "50%",
                paddingBlock: "2rem",
              }}
              onClick={handleAddInfrastructure}
            >
              <AddIcon />
            </Button>
          </div>
        )}
        <AddInfrastructure onClose={handleCloseInfrastructureDialog} open={openDialog}/>
        {edit && (
          <GenericDetail
            id={infrastructureID}
            onClose={handleCloseDetail}
            objectType="infrastructure"
            confirmationOptions={Singleton.getInstance().getDeleteDefaultOptions()}
            fetchData={fetchData}
            updateData={updateData}
            deleteData={handleDeleteItem}
          />
        )}
        <StatusDialog open={statusDialogOpen} onClose={handleStatusDialogClose} onStatusUpdate={handleStatusUpdate} possibleStatuses={infrastructureHandlingStatus}/>

      </Box>
    </ThemeProvider>
  );
}
