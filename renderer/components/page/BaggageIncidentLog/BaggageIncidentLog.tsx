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
import AddBaggageIncidentLog from "./AddBaggageIncidentLog";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

export default function BaggageIncidentLog({ resetState, onResetState }) {
  const [openDialog, setOpenDialog] = useState(false);
  const [success, setSuccess] = useState(false);
  const [edit, setEdit] = useState(false);
  const [BaggageincidentLogID, setBaggageincidentLogID] = useState("");
  const [status, setStatus] = useState("unclaimed");
  const [confirmationDialog, setConfirmationDialog] = useState(false);
  const [data, setData] = useState<BaggageIncidentLog | undefined>(undefined);

  useEffect(() => {
    if (resetState) {
      setEdit(false);
      onResetState();
    }
  }, [resetState]);

  const handleAddBaggageIncidentLog = () => {
    setOpenDialog(true);
  };

  const handleCloseBaggageIncidentLogDialog = () => {
    setOpenDialog(false);
  };

  const handleOpenDetail = (id: string) => {
    setBaggageincidentLogID(id);
    setEdit(true);
  };

  const handleCloseDetail = () => {
    setEdit(false);
  };
  const headers = ["Description", "Date", "Action Taken", ""];

  const rowRenderer = (_data) => {
    return [
      <StyledTableCell key={`name-${_data.id}`} align="left">
        {_data.description}
      </StyledTableCell>,
      <StyledTableCell key={`date-${_data.id}`} align="left">
        {_data.time.toDate().toLocaleString()}
      </StyledTableCell>,
      <StyledTableCell key={`status-${_data.id}`} align="left">
        <Typography>
          {_data.actionTaken}
        </Typography>
      </StyledTableCell>,
    ];
  };

  const fetchData = async (id) => {
    try {
      const BaggageincidentLogRef = doc(db, "baggageIncidentLog", id);

      const docSnapshot = await getDoc(BaggageincidentLogRef);

      if (docSnapshot.exists()) {
        const data = docSnapshot.data();

        if (data && data.time) {
          data.time = (data.time as Timestamp).toDate();
        }
        return data;
      } else {
        console.error(
          `Document with id ${id} does not exist in the BaggageincidentLog collection`
        );
        return null;
      }
    } catch (error) {
      console.error("Error fetching BaggageincidentLog data:", error.message);
      throw error;
    }
  };

  const updateData = async (id, newData) => {
    try {
      const BaggageincidentLogRef = doc(db, "baggageIncidentLog", id);
      await updateDoc(BaggageincidentLogRef, newData);

      console.log("Document updated successfully");
    } catch (error) {
      console.error("Error updating BaggageincidentLog data:", error.message);
      throw error;
    }
  };
  const handleCloseDialog = () => {
    setConfirmationDialog(false);
  };

  const handleDeleteItem = async () => {
    if ((await deleteItemByID("baggageIncidentLog", BaggageincidentLogID)) === "") {
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

        {!edit && (
          <div>
            <Typography variant="h3" gutterBottom>
              Baggage Incident Log Lists
            </Typography>
            <div
              style={{
                width: "100%",
                height: "100vh",
                overflowY: "auto",
              }}
            >
              <DataListTable
                collectionName="baggageIncidentLog"
                headers={headers}
                rowRenderer={rowRenderer}
                onOpenDetail={handleOpenDetail}
                collectionTitle="Baggage Incident Log"
                searchKey={'description'}
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
              onClick={handleAddBaggageIncidentLog}
            >
              <AddIcon />
            </Button>
          </div>
        )}
        <AddBaggageIncidentLog open={openDialog} onClose={handleCloseBaggageIncidentLogDialog} />
        {edit  && (
          <GenericDetail
            id={BaggageincidentLogID}
            onClose={handleCloseDetail}
            objectType="baggageIncidentLog"
            confirmationOptions={Singleton.getInstance().getDeleteDefaultOptions()}
            fetchData={fetchData}
            updateData={updateData}
            deleteData={handleDeleteItem}
          />
        )}
      </Box>
    </ThemeProvider>
  );
}
