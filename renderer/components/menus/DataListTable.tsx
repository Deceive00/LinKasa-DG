import React, { useEffect, useState } from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Input from "@mui/material/Input";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import DeleteIcon from "@mui/icons-material/Delete";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert, { AlertColor } from "@mui/material/Alert";
import ConfirmationDialog from "./ConfirmationDialog";
import {
  onSnapshot,
  collection,
  deleteDoc,
  doc,
  updateDoc,
  getDoc,
  getDocs,
} from "firebase/firestore";
import { db } from "../../../firebase/firebase-config";
import InfoIcon from "@mui/icons-material/Info";
import { deleteItemByID } from "../../lib/utils";
import Button from "@mui/material/Button/Button";

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
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

const DataListTable = ({
  collectionName,
  rowRenderer,
  onOpenDetail,
  headers,
  collectionTitle,
  searchKey,
}) => {
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [itemIdToDelete, setItemIdToDelete] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("error");
  const [snackbarSeverity, setSnackbarSeverity] = useState<AlertColor>("error");
  const [index, setIndex] = useState(0);

  const DEFAULT_OPTIONS = {
    title: "Are you sure?",
    description: `Remove the ${collectionTitle} records?`,
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
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, collectionName),
      (snapshot) => {
        const dataList = snapshot.docs.map((doc) => {
          const idOfDoc = doc.id;
          const itemData = doc.data();
          const title = itemData.title || "No Title";
          return {
            id: idOfDoc,
            title: title,
            ...itemData,
          };

        });

        if (searchQuery.length === 0) {
          setData(dataList);
        } else {
          const filteredData = dataList.filter((data) =>
            data[searchKey].toLowerCase().includes(searchQuery.toLowerCase())
          );
          setData(filteredData);
         
        }
      }
    );

    return () => unsubscribe();
  }, [collectionName, searchQuery]);
  
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleOpenDialog = (id, _index) => {
    setItemIdToDelete(id);
    setIndex(_index);
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
  const deleteFundRequestNotifications = async (userID, fundRequestID) => {
    try {
      if (fundRequestID === "") return;
      const userNotificationsDocRef = doc(db, "notifications", userID);
      const userNotificationsDocSnapshot = await getDoc(
        userNotificationsDocRef
      );

      if (userNotificationsDocSnapshot.exists()) {
        const userNotificationsData = userNotificationsDocSnapshot.data();
        const notifications = userNotificationsData.notifications || [];

        const updatedNotifications = notifications.filter(
          (notification) => notification.uid !== fundRequestID
        );
        console.log(updatedNotifications);
        await updateDoc(userNotificationsDocRef, {
          notifications: updatedNotifications,
        });
        console.log(
          `Notifications for Fund Request ID ${fundRequestID} deleted successfully`
        );
      }
    } catch (error) {
      console.error(
        "Error deleting fund request notifications:",
        error.message
      );
      throw error;
    }
  };
  const handleDeleteItem = async () => {
    if ((await deleteItemByID(collectionName, itemIdToDelete)) === "") {
      if (collectionName === "projectPlan") {
        await deleteItemByID("fundRequest", data[index].fundRequestID);
        await deleteFundRequestNotifications(
          "Chief Financial Officer (CFO)",
          data[index].fundRequestID
        );
      }
      handleCloseDialog();
      showMessage(`Successfully deleted ${collectionName}`, "success");
    } else {
      showMessage(`Error deleting ${collectionName}`, "error");
    }
  };

  return (
    <div>
      {/* <Button onClick={seedCollection}>seeders</Button> */}
      <Input
        placeholder={`Search by ${collectionTitle}`}
        startAdornment={
          <InputAdornment position="start">
            <SearchIcon />
          </InputAdornment>
        }
        value={searchQuery}
        onChange={handleSearchChange}
        style={{ marginBlock: "1rem", width: "100%" }}
      />
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 700 }} aria-label={`${collectionName} table`}>
          <TableHead>
            <TableRow>
              {headers?.map((label, index) => (
                <StyledTableCell
                  key={index}
                  style={{
                    backgroundColor: "#556cd6",
                    color: "whitesmoke",
                    fontWeight: "900",
                  }}
                  align="left"
                >
                  {label}
                </StyledTableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody style={{ width: "100%" }}>
            {data.length !== 0 &&
              data?.map((item, index) => (
                <StyledTableRow key={item.id}>
                  {rowRenderer(item)}
                  <StyledTableCell
                    sx={{
                      display: "flex",
                      justifyContent: "flex-end",
                      alignItems: "center",
                      height: "100%",
                    }}
                  >
                    <IconButton
                      onClick={() => {
                        onOpenDetail(item.id);
                      }}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        height: "100%",
                      }}
                    >
                      <InfoIcon />
                    </IconButton>
                    <IconButton
                      aria-label="delete"
                      size="large"
                      onClick={() => handleOpenDialog(item.id, index)}
                    >
                      <DeleteIcon fontSize="small" color="error" />
                    </IconButton>
                  </StyledTableCell>
                </StyledTableRow>
              ))}
          </TableBody>
        </Table>
        {data.length === 0 && (
          <div
            style={{ display: "flex", justifyContent: "center", width: "auto" }}
          >
            <Typography sx={{ paddingY: "2rem" }}>
              {`There is no ${collectionTitle} matched`}
            </Typography>
          </div>
        )}
      </TableContainer>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
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
      <ConfirmationDialog
        open={openDialog}
        onCancel={handleCloseDialog}
        onClose={handleCloseDialog}
        onConfirm={handleDeleteItem}
        options={DEFAULT_OPTIONS}
      />
    </div>
  );
};

export default DataListTable;
