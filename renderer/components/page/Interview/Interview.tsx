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
import seedJobCandidates from "../../../lib/seeder/jobCandidatesSeeder";
import AddInterview from "./addInterview";


const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

export default function Interview({ resetState, onResetState }) {
  const [openDialog, setOpenDialog] = useState(false);
  const [success, setSuccess] = useState(false);
  const [edit, setEdit] = useState(false);
  const [InterviewID, setInterviewID] = useState("");
  const [status, setStatus] = useState("unclaimed");
  const [confirmationDialog, setConfirmationDialog] = useState(false);
  const [data, setData] = useState<Interview | undefined>(undefined);

  useEffect(() => {
    if (resetState) {
      setEdit(false);
      onResetState();
    }
  }, [resetState]);

  const handleAddInterview = () => {
    setOpenDialog(true);
  };

  const handleCloseInterviewDialog = () => {
    setOpenDialog(false);
  };

  const handleOpenDetail = (id: string) => {
    setInterviewID(id);
    setEdit(true);
  };

  const handleCloseDetail = () => {
    setEdit(false);
  };
  const headers = ["Topic", "Schedule", "Candidate", ""];

  const rowRenderer = (_data) => {
    return [
      <StyledTableCell key={`topic-${_data.id}`} align="left">
        {_data.location}
      </StyledTableCell>,
      <StyledTableCell key={`schedule-${_data.id}`} align="left">
        {_data.schedule.toDate().toLocaleString()}
      </StyledTableCell>,
      <StyledTableCell key={`location-${_data.id}`} align="left">
        <Typography>
          {_data.candidateID}
        </Typography>
      </StyledTableCell>,
    ];
  };

  const fetchData = async (id) => {
    try {
      const InterviewRef = doc(db, "interview", id);

      const docSnapshot = await getDoc(InterviewRef);

      if (docSnapshot.exists()) {
        const data = docSnapshot.data();

        if (data && data.schedule) {
          data.schedule = (data.schedule as Timestamp).toDate();
        }
        return data;
      } else {
        console.error(
          `Document with id ${id} does not exist in the Interview collection`
        );
        return null;
      }
    } catch (error) {
      console.error("Error fetching Interview data:", error.message);
      throw error;
    }
  };

  const updateData = async (id, newData) => {
    try {
      const InterviewRef = doc(db, "interview", id);
      await updateDoc(InterviewRef, newData);

      console.log("Document updated successfully");
    } catch (error) {
      console.error("Error updating Interview data:", error.message);
      throw error;
    }
  };

  async function getCandidateID(id){
    const data = await fetchData(id);
    return data.candidateID;
  }

  const handleCloseDialog = () => {
    setConfirmationDialog(false);
  };

  const handleDeleteItem = async () => {
    if ((await deleteItemByID("interview", InterviewID)) === "") {
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
        {/* <Button onClick={seedJobCandidates}>Seed</Button> */}
        {!edit && (
          <div>
            <Typography variant="h3" gutterBottom>
              Interview Program Lists
            </Typography>
            <div
              style={{
                width: "100%",
                height: "100vh",
                overflowY: "auto",
              }}
            >
              <DataListTable
                collectionName="interview"
                headers={headers}
                rowRenderer={rowRenderer}
                onOpenDetail={handleOpenDetail}
                collectionTitle="Interview"
                searchKey={'topic'}
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
              onClick={handleAddInterview}
            >
              <AddIcon />
            </Button>
          </div>
        )}
        <AddInterview open={openDialog} onClose={handleCloseInterviewDialog} />
        {edit  && (
          <GenericDetail
            id={InterviewID}
            onClose={handleCloseDetail}
            objectType="interview"
            confirmationOptions={Singleton.getInstance().getDeleteDefaultOptions()}
            fetchData={fetchData}
            updateData={updateData}
            deleteData={handleDeleteItem}
            getCandidateID={getCandidateID}
          />
        )}
      </Box>
    </ThemeProvider>
  );
}
