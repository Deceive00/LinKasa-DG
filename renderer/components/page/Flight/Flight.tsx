import { useState, useEffect } from "react";
import {
  Box,
  CssBaseline,
  Typography,
  ThemeProvider,
  Button,
  IconButton,
  Snackbar,
  Alert,
  tableCellClasses,
  TableCell,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import UpdateIcon from "@mui/icons-material/Update";
import { styled, createTheme } from "@mui/material/styles";
import DataListTable from "../../menus/DataListTable";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import GenericDetail from "../../detail/GenericDetail";
import Singleton from "../../../lib/singleton";
import StatusDialog from "../../menus/StatusDialog";
import { db } from "../../../../firebase/firebase-config";
import { deleteItemByID } from "../../../lib/utils";
import { seedCollection } from "../../../lib/seeder/airplaneSeeder";
import AddFlight from "./AddFlight";
import { FlyingStyle, IdleStyle } from "./FlightStatusState";

const theme = createTheme();


const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

export default function Flight({ resetState, onResetState }) {
  const [openDialog, setOpenDialog] = useState(false);
  const [edit, setEdit] = useState(false);
  const [flightID, setFlightID] = useState("");
  const [data, setData] = useState<Flight | undefined>(undefined);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [confirmationDialog, setConfirmationDialog] = useState(false);

  useEffect(() => {
    if (resetState) {
      setEdit(false);
      onResetState();
    }
  }, [resetState]);

  const handleAddFlight = () => {
    setOpenDialog(true);
  };

  const handleCloseFlightDialog = () => {
    setOpenDialog(false);
  };

  const handleOpenDetail = (id: string) => {
    setFlightID(id);
    setEdit(true);
  };

  const handleCloseDetail = () => {
    setEdit(false);
  };
  const possibleStatuses = ['Idle' ,'Flying']
  const headers = ["Airplane ID", "Departure Airport", "Arrival Airport", "Status", "Departure Date","", ""];
  const getStatusStyleContext = (_data) => {
    switch (_data.status) {
      case "Idle":
        return new IdleStyle();
      case "Flying":
        return new FlyingStyle();
      default:
        return null;
    }
  };

  const applyStatusStyle = (_data) => {
    const statusStyleContext = getStatusStyleContext(_data);
    return statusStyleContext ? statusStyleContext.applyStyle() : {};
  };
  const handleCloseDialog = () => {
    setConfirmationDialog(false);
  };

  const handleUpdateStatus = async (_status) => {

    const updatedData = {
      ...data,
      status: _status,
    };
    await updateData(data.id, updatedData);
    setStatusDialogOpen(false);
    updateData(data.id, updatedData);
    handleCloseDialog();

    

  };
  const rowRenderer = (_data) => {
    return [
      <StyledTableCell key={`airplaneid-${_data.id}`} align="left">
        {_data.airplaneID}
      </StyledTableCell>,
      <StyledTableCell key={`departure-${_data.id}`} align="left">
        {_data.departureAirport}
      </StyledTableCell>,
      <StyledTableCell key={`arrival-${_data.id}`} align="left">
        {_data.arrivalAirport}
      </StyledTableCell>,
      <StyledTableCell key={`status-${_data.id}`} align="left">
        <Typography style={applyStatusStyle(_data)}>
          {_data.status}
        </Typography>
      </StyledTableCell>,
      <StyledTableCell key={`schedule-${_data.id}`} align="left">
        {_data.departureTime.toDate().toLocaleString()}
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
      const flightRef = doc(db, "flights", id);
      const docSnapshot = await getDoc(flightRef);

      if (docSnapshot.exists()) {
        return docSnapshot.data() as Flight;
      } else {
        console.error(`Flight with id ${id} does not exist`);
        return null;
      }
    } catch (error) {
      console.error("Error fetching flight data:", error.message);
      throw error;
    }
  };

  const handleStatusDialogClose = () => {
    console.log('hi')
    setStatusDialogOpen(false);
  };

  const updateData = async (id, newData) => {
    try {
      const flightRef = doc(db, "flights", id);
      await updateDoc(flightRef, newData);

      console.log("Flight data updated successfully");
    } catch (error) {
      console.error("Error updating flight data:", error.message);
      throw error;
    }
  };
  const handleDeleteItem = async () => {
    if ((await deleteItemByID("flights", flightID)) === "") {
      console.log("deleted succesfully");
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
        {/* <Button onClick={seedCollection}>
          seed
        </Button> */}
        {!edit && (
          <div>
            <Typography variant="h3" gutterBottom>
              Flight Lists
            </Typography>
            <div
              style={{
                width: "100%",
                height: "100vh",
                overflowY: "auto",
              }}
            >
              <DataListTable
                collectionName="flights"
                headers={headers}
                rowRenderer={rowRenderer}
                onOpenDetail={handleOpenDetail}
                collectionTitle="Flights"
                searchKey={'departureAirport'}
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
              onClick={handleAddFlight}
            >
              <AddIcon />
            </Button>
          </div>
        )}
        <AddFlight onClose={handleCloseFlightDialog} open={openDialog}/>
        {edit && (
          <GenericDetail
            id={flightID}
            onClose={handleCloseDetail}
            objectType="flight"
            confirmationOptions={Singleton.getInstance().getDeleteDefaultOptions()}
            fetchData={fetchData}
            updateData={updateData}
            deleteData={handleDeleteItem} 
          />
        )}
        <StatusDialog open={statusDialogOpen} onClose={handleStatusDialogClose} onStatusUpdate={handleUpdateStatus} possibleStatuses={possibleStatuses}/>
      </Box>
    </ThemeProvider>
  );
}
