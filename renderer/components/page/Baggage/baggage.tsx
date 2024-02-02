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
import AddBaggage from "./addBaggage";
import { CheckedStyle, DelayedStyle, InTransitStyle, LoadingStyle, ReceivedStyle, TransferStyle, UnloadStyle } from "./baggageHandlingStatusState";
import StatusDialog from "../../menus/StatusDialog";
import { ClaimedStyle, InTransitGroundStyle, ReadyForPickUpStyle, ReceiveForTransportStyle } from "./baggageGroundStatusState";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

export default function Baggage({ resetState, onResetState, role }) {
  const [openDialog, setOpenDialog] = useState(false);
  const [edit, setEdit] = useState(false);
  const [baggageID, setbaggageID] = useState("");
  const [status, setStatus] = useState("unclaimed");

  const [confirmationDialog, setConfirmationDialog] = useState(false);
  const [data, setData] = useState<Baggage>();
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);

  useEffect(() => {
    if (resetState) {
      setEdit(false);
      onResetState();
    }
  }, [resetState]);

  const handleAddbaggage = () => {
    setOpenDialog(true);
  };

  const handleClosebaggageDialog = () => {
    setOpenDialog(false);
  };


  const handleOpenDetail = (id: string) => {
    setbaggageID(id);
    setEdit(true);
  };

  const handleCloseDetail = () => {
    setEdit(false);
  };

  const headerStatus = role === 'BSS' ? "Baggage Handling Status" : "Baggage Ground Status";
  const headers = ["Passenger Name", "Weight", headerStatus , "", ""];
  const baggageHandlingStatus = [
    'checked',
    'loading',
    'transfer',
    'in transit',
    'unload',
    'received',
    'delayed',
  ];

  const baggageGroundStatus = [
    'receive for transport', 
    'in transit',
    'ready for pickup',
    'claimed by passenger'
  ];
  const possibleStatuses = role === 'BSS' ? baggageHandlingStatus : baggageGroundStatus;
  const getStatusStyleContext = (_data) => {
    if(role === 'BSS'){
      switch (_data.baggageHandlingStatus) {
        case "checked":
          return new CheckedStyle();
        case "loading":
          return new LoadingStyle();
        case "transfer":
          return new TransferStyle();
        case "in transit":
          return new InTransitStyle();
        case "unload":
          return new UnloadStyle();
        case "received":
          return new ReceivedStyle();
        case "delayed":
          return new DelayedStyle();
        default:
          return null;
      }
    }
    else if(role === 'GHM'){

      switch(_data.baggageGroundStatus){
        case 'receive for transport':
          
          return new ReceiveForTransportStyle();
        case 'in transit':
          return new InTransitGroundStyle();
        case 'ready for pickup':
          return new ReadyForPickUpStyle();
        case 'claimed by passenger':
          return new ClaimedStyle();
        default:
          return null;
      }
    }
  };

  const applyStatusStyle = (_data) => {
    const statusStyleContext = getStatusStyleContext(_data);
    return statusStyleContext ? statusStyleContext.applyStyle() : {};
  };

  const rowRenderer = (_data) => {
    return [
      <StyledTableCell key={`name-${_data.id}`} align="left">
        {_data.passengerName}
      </StyledTableCell>,
      <StyledTableCell key={`date-${_data.id}`} align="left">
        {_data.weight}
      </StyledTableCell>,
      <StyledTableCell key={`status-${_data.id}`} align="left">
        <Typography style={applyStatusStyle(_data)}>
          {role === 'BSS' ? _data.baggageHandlingStatus : _data.baggageGroundStatus}
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
      const baggageRef = doc(db, "baggage", id);

      const docSnapshot = await getDoc(baggageRef);

      if (docSnapshot.exists()) {
        const data = docSnapshot.data();

        if (data && data.lostDate) {
          data.lostDate = (data.lostDate as Timestamp).toDate();
        }
        return data;
      } else {
        console.error(
          `Document with id ${id} does not exist in the baggage collection`
        );
        return null;
      }
    } catch (error) {
      console.error("Error fetching baggage data:", error.message);
      throw error;
    }
  };

  const updateData = async (id, newData) => {
    try {
      const baggageRef = doc(db, "baggage", id);
      await updateDoc(baggageRef, newData);

      console.log("Document updated successfully");
    } catch (error) {
      console.error("Error updating baggage data:", error.message);
      throw error;
    }
  };

  const handleDeleteItem = async () => {
    if ((await deleteItemByID("baggage", baggageID)) === "") {
      console.log("deleted succesfully");
    }
  };


  const handleStatusDialogClose = () => {
    setStatusDialogOpen(false);
  };

  const handleStatusUpdate = async (_status) => {
    if (role === 'BSS' && baggageHandlingStatus.includes(_status)) {

      const updatedData = {
        ...data,
        baggageHandlingStatus: _status,
      };
      await updateData(data.uid, updatedData);
      setStatusDialogOpen(false);
    } else if(role === 'GHM' && baggageGroundStatus.includes(_status)){
      const updatedData = {
        ...data,
        baggageGroundStatus: _status,
      };
      await updateData(data.uid, updatedData);
      setStatusDialogOpen(false);
    }else{
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
              Baggage Lists
            </Typography>
            <div
              style={{
                width: "100%",
                height: "100vh",
                overflowY: "auto",
              }}
            >
              <DataListTable
                collectionName="baggage"
                headers={headers}
                rowRenderer={rowRenderer}
                onOpenDetail={handleOpenDetail}
                collectionTitle="Baggage"
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
              onClick={handleAddbaggage}
            >
              <AddIcon />
            </Button>
          </div>
        )}
        {role === 'BSS' && <AddBaggage onClose={handleClosebaggageDialog} open={openDialog}/>}
        {edit && (
          <GenericDetail
            id={baggageID}
            onClose={handleCloseDetail}
            objectType="baggage"
            confirmationOptions={Singleton.getInstance().getDeleteDefaultOptions()}
            fetchData={fetchData}
            updateData={updateData}
            deleteData={handleDeleteItem}
          />
        )}
        <StatusDialog open={statusDialogOpen} onClose={handleStatusDialogClose} onStatusUpdate={handleStatusUpdate} possibleStatuses={possibleStatuses}/>

      </Box>
    </ThemeProvider>
  );
}
