import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "../../../../lib/theme";
import * as React from "react";
import { styled, createTheme, ThemeProvider } from "@mui/material/styles";
import { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import Typography from "@mui/material/Typography";
import DataListTable from "../../../menus/DataListTable";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import GenericDetail from "../../../detail/GenericDetail";
import Singleton from "../../../../lib/singleton";
import { db } from "../../../../../firebase/firebase-config";
import {
  Timestamp,
  deleteDoc,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { deleteItemByID } from "../../../../lib/utils";

import UpdateIcon from "@mui/icons-material/Update";
import { Container, Dialog, DialogContent, DialogTitle, FormControl, Grid, IconButton, InputLabel, MenuItem, Select } from "@mui/material";
import ConfirmationDialog from "../../../menus/ConfirmationDialog";
const initialFundRequest: FundRequest = {
  uid: '',
  projectID: '',
  status: 'Pending Approval',
  purpose: '',
  requestedAmount: '',
  requestDate: new Date(),
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

export default function FundRequest({ resetState, onResetState }) {
  const [openDialog, setOpenDialog] = useState(false);
  const [success, setSuccess] = useState(false);
  const [edit, setEdit] = useState(false);
  const [fundRequestID, setfundRequestID] = useState("");
  const [newStatus, setNewStatus] = useState("Pending Approval");
  const [confirmationDialog, setConfirmationDialog] = useState(false);
  const [data, setData] = useState<FundRequest>(() => initialFundRequest);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [updateID, setUpdateID] = useState('');
 
  useEffect(() => {
    if (resetState) {
      setEdit(false);
      onResetState();
    }
  }, [resetState]);

  const handleUpdateStatus = async () => {
    
    if (data?.status === "Pending Approval") {
      setStatusDialogOpen(true);
    } else {
      alert("Status can only be updated when it's 'Pending Approval'.");
    }
  };

  const handleStatusDialogClose = () => {
    setStatusDialogOpen(false);
  };

  const handleStatusUpdate = async () => {
    const updatedData = {
      ...data,
      status: newStatus,
    };
    console.log(updatedData)
    await updateData(updateID, updatedData);
    setStatusDialogOpen(false);

  };

  const handleAddfundRequest = () => {
    setOpenDialog(true);
  };

  const handleClosefundRequestDialog = () => {
    setOpenDialog(false);
  };

  const handleSuccessAdd = () => {
    setSuccess(true);
  };

  const handleOpenDetail = (id: string) => {
    setfundRequestID(id);
    setEdit(true);
  };

  const handleCloseDetail = () => {
    setEdit(false);
  };
  const headers = ["Title", "Found date", "Status", "", ""];
  const getStatusStyle = (_status) => {
    switch (_status) {
      case "Pending Approval":
        return {
          borderRadius: "8px",
          backgroundColor: "gray",
          color: "white",
          padding: "8px",
          textAlign: "center" as React.CSSProperties["textAlign"],
          width: "fit-content",
          fontSize:'14'
        };
      case "Rejected":
        return {
          borderRadius: "8px",
          backgroundColor: "#ff6961",
          color: "white",
          padding: "8px",
          textAlign: "center" as React.CSSProperties["textAlign"],
          width: "fit-content",
          fontSize:'14'
        };
      case "Accepted":
        return {
          borderRadius: "8px",
          backgroundColor: "#77dd77",
          color: "white",
          padding: "8px",
          textAlign: "center" as React.CSSProperties["textAlign"],
          width: "fit-content",
          fontSize:'14'
        };
      default:
        return {};
    }
  };


  const rowRenderer = (_data) => {
    return [
      <StyledTableCell key={`purpose-${_data.id}`} align="left">
        {_data.purpose}
      </StyledTableCell>,
      <StyledTableCell key={`requestDate-${_data.id}`} align="left">
        {_data.requestDate.toDate().toLocaleString()}
      </StyledTableCell>,
      <StyledTableCell key={`status-${_data.id}`} align="left">
        <Typography style={getStatusStyle(_data.status)}>
          {_data.status}
        </Typography>
      </StyledTableCell>,
      _data.status !== "Accepted" && (
        <StyledTableCell key={`button-${_data.id}`} align="right">
          <IconButton
            onClick={() => {
              setData(_data);
              data.uid = _data.id
              setUpdateID(_data.id);
              handleUpdateStatus();
            }}
          >
            <UpdateIcon />
          </IconButton>
        </StyledTableCell>
      ),
      _data.status === "Accepted" && (
        <StyledTableCell
          key={`button-${_data.id}`}
          align="right"
        ></StyledTableCell>
      ),
    ];
  };

  const fetchData = async (id) => {
    try {
      const fundRequestRef = doc(db, "fundRequest", id);

      const docSnapshot = await getDoc(fundRequestRef);

      if (docSnapshot.exists()) {
        const data = docSnapshot.data();

        if (data && data.requestDate) {
          data.requestDate = (data.requestDate as Timestamp).toDate();
        }
        data.uid = id

        return data;
      } else {
        console.error(
          `Document with id ${id} does not exist in the fundRequest collection`
        );
        return null;
      }
    } catch (error) {
      console.error("Error fetching fundRequest data:", error.message);
      throw error;
    }
  };

  const updateData = async (id, newData) => {
    try {
      const fundRequestRef = doc(db, "fundRequest", id);
      const { uid: fundRequestUid, id: fundRequestID, ...dataWithoutId } = newData;
      await updateDoc(fundRequestRef, dataWithoutId);

      console.log("Document updated successfully");
    } catch (error) {
      console.error("Error updating fundRequest data:", error.message);
      throw error;
    }
  };
  const handleCloseDialog = () => {
    setConfirmationDialog(false);
  };

  const handleDeleteItem = async () => {
    if ((await deleteItemByID("fundRequest", fundRequestID)) === "") {
      console.log("deleted succesfully");
    }
  };

  const isDone = () => {
    if (newStatus === "Pending Approval") {
      return true;
    } else {
      setEdit(false);

      return false;
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
              Fund Request Lists
            </Typography>
            <div
              style={{
                width: "100%",
                height: "100vh",
                overflowY: "auto",
              }}
            >
              <DataListTable
                collectionName="fundRequest"
                headers={headers}
                rowRenderer={rowRenderer}
                onOpenDetail={handleOpenDetail}
                collectionTitle="Fund Request"
                searchKey={'purpose'}
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
              onClick={handleAddfundRequest}
            >
              <AddIcon />
            </Button>
          </div>
        )}

        {edit && isDone() && (
          <GenericDetail
            id={fundRequestID}
            onClose={handleCloseDetail}
            objectType="fundRequest"
            confirmationOptions={Singleton.getInstance().getDeleteDefaultOptions()}
            fetchData={fetchData}
            updateData={updateData}
            deleteData={handleDeleteItem}
          />
        )}

        <ConfirmationDialog
          open={confirmationDialog}
          onCancel={handleCloseDialog}
          onClose={handleCloseDialog}
          onConfirm={handleUpdateStatus}
          options={Singleton.getInstance().getUpdateDefaultOptions()}
        />

        <Dialog open={statusDialogOpen} onClose={handleStatusDialogClose}>
          <DialogTitle>Change Status</DialogTitle>
          <Container sx={{padding:2}}>
              <DialogContent>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel htmlFor='new-status' id="new-status-label">New Status</InputLabel>
                    <Select
                      labelId="new-status-label"
                      id="new-status"
                      value={newStatus}
                      label="New Status"
                      onChange={(e) => setNewStatus(e.target.value)}
                      inputProps={{
                        name: 'newstatus',
                        id: 'new-status',
                        color: 'rgba(0, 0, 0, 0.54)'
                      }}
                    >
                      <MenuItem value="Pending Approval">Pending Approval</MenuItem>
                      <MenuItem value="Accepted">Accepted</MenuItem>
                      <MenuItem value="Rejected">Rejected</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </DialogContent>

            <DialogContent>
              <Button variant="contained" color="primary" onClick={handleStatusUpdate} fullWidth>
                Update Status
              </Button>
            </DialogContent>

          </Container>
        </Dialog>
      </Box>
    </ThemeProvider>
  );
}
