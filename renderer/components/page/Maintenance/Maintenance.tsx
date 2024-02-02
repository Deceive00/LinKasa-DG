// Import necessary components and libraries
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "../../../lib/theme";
import * as React from "react";
import { styled, createTheme, ThemeProvider } from "@mui/material/styles";
import { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import Typography from "@mui/material/Typography";
import { Alert, AlertColor, IconButton, Snackbar, TableCell, tableCellClasses } from "@mui/material";
import UpdateIcon from "@mui/icons-material/Update";
import DataListTable from "../../menus/DataListTable";
import GenericDetail from "../../detail/GenericDetail";
import StatusDialog from "../../menus/StatusDialog";
import { db } from "../../../../firebase/firebase-config";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { deleteItemByID } from "../../../lib/utils";
import { MaintenanceStyle, InProgressStyle, CompletedStyle } from "./MaintenanceStatusState";
import Singleton from "../../../lib/singleton";
import AddMaintenance from "./AddMaintenance";
import Loading from "../../Loading/Loading";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

export default function Maintenance({ resetState, onResetState }) {
  const [openDialog, setOpenDialog] = useState(false);
  const [edit, setEdit] = useState(false);
  const [maintenanceID, setMaintenanceID] = useState("");
  const [data, setData] = useState<Maintenance | undefined>(undefined);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<AlertColor>("error");

  useEffect(() => {
    if (resetState) {
      setEdit(false);
      onResetState();
    }
  }, [resetState]);
  const fetchInfrastructureDetails = async (infrastructureID) => {
    try {
      const infrastructureRef = doc(db, "infrastructure", infrastructureID);
      const infrastructureSnapshot = await getDoc(infrastructureRef);

      if (infrastructureSnapshot.exists()) {
        return infrastructureSnapshot.data();
      } else {
        console.error(`Infrastructure with ID ${infrastructureID} does not exist`);
        return null;
      }
    } catch (error) {
      console.error("Error fetching infrastructure data:", error.message);
      throw error;
    }

  };
  
  const applyStatusStyle = (_data) => {
    const statusStyleContext = getStatusStyleContext(_data);
    return statusStyleContext ? statusStyleContext.applyStyle() : {};
  };

  const getStatusStyleContext = (_data) => {
    switch (_data.status) {
      case "need maintenance":
        return new MaintenanceStyle();
      case "in-progress":
        return new InProgressStyle();
      case "completed":
        return new CompletedStyle();
      default:
        return null;
    }
  };

  const headers = ["Infrastructure Name", "Schedule", "Status", "", ""];

  const rowRenderer = (_data) => {

    return [
      <StyledTableCell key={`infrastructure-${_data.id}`} align="left">
        {_data.infrastructureName ? _data.infrastructureName : 'N/A'}
      </StyledTableCell>,
      <StyledTableCell key={`schedule-${_data.id}`} align="left">
        {_data.schedule.toDate().toLocaleString()} 
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
  const handleCloseMaintenanceDialog = () => {
    setOpenDialog(false);
  };
  const fetchData = async (id) => {
    try {
      const maintenanceRef = doc(db, "maintenance", id);
      const docSnapshot = await getDoc(maintenanceRef);

      if (docSnapshot.exists()) {
        return docSnapshot.data();
      } else {
        console.error(`Maintenance with ID ${id} does not exist`);
        return null;
      }
    } catch (error) {
      console.error("Error fetching maintenance data:", error.message);
      throw error;
    }
  };

  const updateData = async (id, newData) => {
    try {
      const maintenanceRef = doc(db, "maintenance", id);
      await updateDoc(maintenanceRef, newData);

      console.log("Maintenance data updated successfully");
      setSnackbarMessage("Maintenance data updated successfully");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error updating maintenance data:", error.message);
      setSnackbarMessage("Error updating maintenance data");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleDeleteItem = async () => {
    if ((await deleteItemByID("maintenance", maintenanceID)) === "") {
      console.log("Deleted successfully");
      setSnackbarMessage("Maintenance record deleted successfully");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } else {
      console.error("Error deleting maintenance record");
      setSnackbarMessage("Error deleting maintenance record");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleStatusDialogClose = () => {
    setStatusDialogOpen(false);
  };

  const handleStatusUpdate = async (_status) => {
    try {
      const updatedData = {
        ...data,
        status: _status,
      };
      await updateData(data.id, updatedData);
      setStatusDialogOpen(false);
    } catch (error) {
      console.error("Error updating maintenance status:", error.message);
      setSnackbarMessage("Error updating maintenance status");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
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
              Maintenance Lists
            </Typography>
            <div
              style={{
                width: "100%",
                height: "100vh",
                overflowY: "auto",
              }}
            >
              <DataListTable
                collectionName="maintenance"
                headers={headers}
                rowRenderer={rowRenderer}
                onOpenDetail={(id) => {
                  setMaintenanceID(id);
                  setEdit(true);
                }}
                collectionTitle="Maintenance"
                searchKey={'infrastructureID'} 
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
              onClick={() => setOpenDialog(true)}
            >
              <AddIcon />
            </Button>
          </div>
        )}
        <AddMaintenance onClose={handleCloseMaintenanceDialog} open={openDialog}/>
        {edit && (
          <GenericDetail
            id={maintenanceID}
            onClose={() => setEdit(false)}
            objectType="maintenance"
            confirmationOptions={Singleton.getInstance().getDeleteDefaultOptions()}
            fetchData={fetchData}
            updateData={updateData}
            deleteData={handleDeleteItem}
          />
        )}
        <StatusDialog open={statusDialogOpen} onClose={handleStatusDialogClose} onStatusUpdate={handleStatusUpdate} possibleStatuses={['maintenance', 'in-progress', 'completed']} />
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
      </Box>
    </ThemeProvider>
  );
}
