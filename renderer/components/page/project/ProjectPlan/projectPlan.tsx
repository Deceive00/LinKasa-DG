import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "../../../../lib/theme";
import * as React from "react";
import { styled, createTheme, ThemeProvider } from "@mui/material/styles";
import { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import Register from "../../register";
import AddIcon from "@mui/icons-material/Add";
import Typography from "@mui/material/Typography";
import UserDetail from "../../../detail/UserDetail";
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
import { IconButton } from "@mui/material";
import ConfirmationDialog from "../../../menus/ConfirmationDialog";
import AddProjectPlan from "./addProjectPlan";
import AddProject from "./addProject";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

export default function ProjectPlan({ resetState, onResetState }) {
  const [openDialog, setOpenDialog] = useState(false);
  const [success, setSuccess] = useState(false);
  const [edit, setEdit] = useState(false);
  const [projectPlanID, setProjectPlanID] = useState("");
  const [status, setStatus] = useState("Pending Approval");
  const [confirmationDialog, setConfirmationDialog] = useState(false);
  const [data, setData] = useState<ProjectPlan | undefined>(undefined);

  useEffect(() => {
    if (resetState) {
      setEdit(false);
      onResetState();
    }
  }, [resetState]);

  const handleAddProjectPlan = () => {
    setOpenDialog(true);
  };

  const handleCloseProjectPlanDialog = () => {
    setOpenDialog(false);
  };

  const handleOpenDetail = (id: string) => {
    setProjectPlanID(id);
    setEdit(true);
  };

  const handleCloseDetail = () => {
    setEdit(false);
  };
  const headers = ["Title", "Found date", "Status", ""];

  const getStatusStyle = (_status) => {
    switch (_status) {
      case "Pending Approval":
        return {
          borderRadius: "8px",
          backgroundColor: "#ff6961",
          color: "white",
          padding: "8px",
          textAlign: "center" as React.CSSProperties["textAlign"],
          width: "fit-content",
          fontSize: "14px",
        };
      case "Accepted":
        return {
          borderRadius: "8px",
          backgroundColor: "#77dd77",
          color: "white",
          padding: "8px",
          textAlign: "center" as React.CSSProperties["textAlign"],
          width: "fit-content",
          fontSize: "14px",
        };
      default:
        return {};
    }
  };

  const handleUpdateStatus = async () => {
    if (data?.status === "Pending Approval") {
      const updatedData = {
        ...data,
        status: "Accepted",
      };
      updateData(data.uid, updatedData);
      handleCloseDialog();
    }
  };
  const rowRenderer = (_data) => {
    const statusStyle = getStatusStyle(_data.status);
    return [
      <StyledTableCell key={`name-${_data.id}`} align="left">
        {_data.title}
      </StyledTableCell>,
      <StyledTableCell key={`date-${_data.id}`} align="left">
        {_data.createdAt.toDate().toLocaleString()}
      </StyledTableCell>,
      <StyledTableCell key={`status-${_data.id}`} align="left">
        <Typography style={statusStyle}>{_data.status}</Typography>
      </StyledTableCell>,
      // _data.status !== "Accepted" && (
      //   <StyledTableCell key={`button-${_data.id}`} align="right">
      //     <IconButton
      //       onClick={() => {
      //         setData(_data);
      //         setConfirmationDialog(true);
      //       }}
      //     >
      //       <UpdateIcon />
      //     </IconButton>
      //   </StyledTableCell>
      // ),
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
      const projectPlanRef = doc(db, "projectPlan", id);

      const docSnapshot = await getDoc(projectPlanRef);

      if (docSnapshot.exists()) {
        const data = docSnapshot.data();
        if (data && data.createdAt) {
          data.createdAt = (data.createdAt as Timestamp).toDate();
        }
        return data;
      } else {
        console.error(
          `Document with id ${id} does not exist in the ProjectPlan collection`
        );
        return null;
      }
    } catch (error) {
      console.error("Error fetching ProjectPlan data:", error.message);
      throw error;
    }
  };

  const updateData = async (id, newData) => {
    try {
      const projectPlanRef = doc(db, "projectPlan", id);
      await updateDoc(projectPlanRef, newData);

      console.log("Document updated successfully");
    } catch (error) {
      console.error("Error updating ProjectPlan data:", error.message);
      throw error;

    }
  };

  const handleCloseDialog = () => {
    setConfirmationDialog(false);
  };
  const deleteFundRequestNotifications = async (userID, fundRequestID) => {
    try {
      if(fundRequestID === '')  return;
      const userNotificationsDocRef = doc(db, 'notifications', userID);
      const userNotificationsDocSnapshot = await getDoc(userNotificationsDocRef);
  
      if (userNotificationsDocSnapshot.exists()) {
        const userNotificationsData = userNotificationsDocSnapshot.data();
        const notifications = userNotificationsData.notifications || [];
  
        const updatedNotifications = notifications.filter(notification => notification.uid !== fundRequestID);
        console.log(updatedNotifications);
        await updateDoc(userNotificationsDocRef, { notifications: updatedNotifications });
        console.log(`Notifications for Fund Request ID ${fundRequestID} deleted successfully`);
      }
    } catch (error) {
      console.error('Error deleting fund request notifications:', error.message);
      throw error;
    }
  };

  const handleDeleteItem = async () => {
    console.log('kepanggil kan')
    await deleteItemByID("projectPlan", projectPlanID);
    console.log("deleted succesfully");
    console.log(data)
    await deleteFundRequestNotifications('Chief Financial Officer (CFO)', data.fundRequestID);

  };

  const isDone = () => {
    if (status === "Pending Approval") {
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
              Project Plan Lists
            </Typography>
            <div
              style={{
                width: "100%",
                height: "100vh",
                overflowY: "auto",
              }}
            >
              <DataListTable
                collectionName="projectPlan"
                headers={headers}
                rowRenderer={rowRenderer}
                onOpenDetail={handleOpenDetail}
                collectionTitle="Project Plan"
                searchKey={'title'}
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
              onClick={handleAddProjectPlan}
            >
              <AddIcon />
            </Button>
          </div>
        )}

        {edit && isDone() && (
          <GenericDetail
            id={projectPlanID}
            onClose={handleCloseDetail}
            objectType="projectPlan"
            confirmationOptions={Singleton.getInstance().getDeleteDefaultOptions()}
            fetchData={fetchData}
            updateData={updateData}
            deleteData={handleDeleteItem}
          />
        )}
        <AddProject open={openDialog} onClose={handleCloseProjectPlanDialog} />
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
