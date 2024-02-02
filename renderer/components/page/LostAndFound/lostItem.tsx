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
import {UnclaimedStyle, ReturnedToOwnerStyle} from './lostItemStatusState'
import {
  Timestamp,
  deleteDoc,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { deleteItemByID } from "../../../lib/utils";
import AddLostItem from "./addLostItem";
import UpdateIcon from "@mui/icons-material/Update";
import { IconButton } from "@mui/material";
import ConfirmationDialog from "../../menus/ConfirmationDialog";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

export default function LostItem({ resetState, onResetState }) {
  const [openDialog, setOpenDialog] = useState(false);
  const [success, setSuccess] = useState(false);
  const [edit, setEdit] = useState(false);
  const [lostItemID, setLostItemID] = useState("");
  const [status, setStatus] = useState("unclaimed");
  const [confirmationDialog, setConfirmationDialog] = useState(false);
  const [data, setData] = useState<LostItem | undefined>(undefined);

  useEffect(() => {
    if (resetState) {
      setEdit(false);
      onResetState();
    }
  }, [resetState]);

  const handleAddLostItem = () => {
    setOpenDialog(true);
  };

  const handleCloseLostItemDialog = () => {
    setOpenDialog(false);
  };

  const handleSuccessAdd = () => {
    setSuccess(true);
  };

  const handleOpenDetail = (id: string) => {
    setLostItemID(id);
    setEdit(true);
  };

  const handleCloseDetail = () => {
    setEdit(false);
  };
  const headers = ["Title", "Found date", "Status", "", ""];

  const getStatusStyleContext = (_data) => {
    setStatus(_data.status);
    switch (_data.status) {
      case "unclaimed":
        return new UnclaimedStyle();
      case "returned to owner":
        return new ReturnedToOwnerStyle();
      default:
        return null;
    }
  };

  const applyStatusStyle = (_data) => {
    const statusStyleContext = getStatusStyleContext(_data);
    return statusStyleContext ? statusStyleContext.applyStyle() : {};
  };

  const handleUpdateStatus = async () => {
    if (data?.status === "unclaimed") {
      const updatedData = {
        ...data,
        status: "returned to owner",
      };
      
      updateData(data.uid, updatedData);
      handleCloseDialog();
      const message =  `Lost item '${data?.name}' status is updated!.`;
      Singleton.getInstance().addNotification('lost item updation', 'Lost and Found Staff', message, data.uid);
    }

  };
  const rowRenderer = (_data) => {
    return [
      <StyledTableCell key={`name-${_data.id}`} align="left">
        {_data.name}
      </StyledTableCell>,
      <StyledTableCell key={`date-${_data.id}`} align="left">
        {_data.lostDate.toDate().toLocaleString()}
      </StyledTableCell>,
      <StyledTableCell key={`status-${_data.id}`} align="left">
        <Typography style={applyStatusStyle(_data)}>
          {_data.status}
        </Typography>
      </StyledTableCell>,
      _data.status !== "returned to owner" && (
        <StyledTableCell key={`button-${_data.id}`} align="right">
          <IconButton
            onClick={() => {
              setData(_data);
              setConfirmationDialog(true);
            }}
          >
            <UpdateIcon />
          </IconButton>
        </StyledTableCell>
      ),
      _data.status === "returned to owner" && (
        <StyledTableCell
          key={`button-${_data.id}`}
          align="right"
        ></StyledTableCell>
      ),
    ];
  };

  const fetchData = async (id) => {
    try {
      const lostItemRef = doc(db, "lostItem", id);

      const docSnapshot = await getDoc(lostItemRef);

      if (docSnapshot.exists()) {
        const data = docSnapshot.data();

        if (data && data.lostDate) {
          data.lostDate = (data.lostDate as Timestamp).toDate();
        }
        return data;
      } else {
        console.error(
          `Document with id ${id} does not exist in the lostItem collection`
        );
        return null;
      }
    } catch (error) {
      console.error("Error fetching lostItem data:", error.message);
      throw error;
    }
  };

  const updateData = async (id, newData) => {
    try {
      const lostItemRef = doc(db, "lostItem", id);
      await updateDoc(lostItemRef, newData);

      console.log("Document updated successfully");
    } catch (error) {
      console.error("Error updating lostItem data:", error.message);
      throw error;
    }
  };
  const handleCloseDialog = () => {
    setConfirmationDialog(false);
  };

  const handleDeleteItem = async () => {
    if ((await deleteItemByID("lostItem", lostItemID)) === "") {
      console.log("deleted succesfully");
    }
  };

  const isDone = () => {
    if (status === "unclaimed") {
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
              Lost Item Lists
            </Typography>
            <div
              style={{
                width: "100%",
                height: "100vh",
                overflowY: "auto",
              }}
            >
              <DataListTable
                collectionName="lostItem"
                headers={headers}
                rowRenderer={rowRenderer}
                onOpenDetail={handleOpenDetail}
                collectionTitle="Lost Item"
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
              onClick={handleAddLostItem}
            >
              <AddIcon />
            </Button>
          </div>
        )}

        {edit && isDone() && (
          <GenericDetail
            id={lostItemID}
            onClose={handleCloseDetail}
            objectType="lostItem"
            confirmationOptions={Singleton.getInstance().getDeleteDefaultOptions()}
            fetchData={fetchData}
            updateData={updateData}
            deleteData={handleDeleteItem}
          />
        )}

        <AddLostItem open={openDialog} onClose={handleCloseLostItemDialog} />
        <ConfirmationDialog
          open={confirmationDialog}
          onCancel={handleCloseDialog}
          onClose={handleCloseDialog}
          onConfirm={handleUpdateStatus}
          options={Singleton.getInstance().getUpdateDefaultOptions()}
        />
      </Box>
    </ThemeProvider>
  );
}
