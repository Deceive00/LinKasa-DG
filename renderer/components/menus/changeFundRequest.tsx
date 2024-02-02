import { Box, Button, Dialog } from "@mui/material";
import ConfirmationDialog from "./ConfirmationDialog";
import Singleton from "../../lib/singleton";
import { useState, useEffect } from "react";
import AddFundRequest from "../page/project/ProjectPlan/addFundRequest";
import { addDoc, collection, doc, updateDoc } from "firebase/firestore";
import { db } from "../../../firebase/firebase-config";
import { deleteItemByID } from "../../lib/utils";

export default function ChangeFundRequest({ data, id, after, updateData, showMessage }) {
  const initialFundRequest: FundRequest = {
    uid: "",
    projectID: "",
    status: "Pending Approval",
    purpose: "",
    requestedAmount: "",
    requestDate: new Date(),
  };

  const [fundRequestData, setFundRequestData] = useState<FundRequest>(
    () => initialFundRequest
  );
  const [childDialog, setChildDialog] = useState(false);
  const [fundRequestDialog, setFundRequestDialog] = useState(false);

  const handleFundRequestSubmit = (data: FundRequest) => {
    setFundRequestData(data);
  };

  const handleDeleteFundRequest = async (fundRequestToBeDeleted : string) => {
    if(fundRequestToBeDeleted === ''){
      showMessage('There is no fund request for this project', 'error');
      return;
    } 
    await deleteItemByID('fundRequest', fundRequestToBeDeleted);
    updateData(id, {
      ...data,
      fundRequestID:''
    });
    showMessage('Fund request deleted successfully', 'success');
    setChildDialog(false);
    after();
  };  

  useEffect(() => {
    if (!open) {
      setFundRequestData(initialFundRequest);
    }
  }, [open]);

  const handleNewFundRequest = async () => {
    try {
      if (fundRequestData) {
        const updatedFundRequestData = { ...fundRequestData, projectID: id };
        
        const { uid: fundRequestUid, ...fundRequestDataWithoutUid } = updatedFundRequestData;
        const fundRequestRef = await addDoc(collection(db, 'fundRequest'), fundRequestDataWithoutUid);
        console.log('Fund Request submitted with ID:', fundRequestRef.id);

        await updateDoc(doc(db, 'projectPlan', id), { fundRequestID: fundRequestRef.id });

        console.log('Project Plan updated with Fund Request ID:', fundRequestRef.id);
        setFundRequestDialog(false);
        showMessage('Fund request created successfully', 'success');
        after();
      } else {
        console.error('Error: Project Plan or Fund Request data is missing.');
      }
    } catch (error) {
      console.error('Error submitting data to Firestore:', error.message);
    }
  }
  return (
    <>
      <Button
        variant="contained"
        color="primary"
        style={{ marginTop: "2rem", marginLeft: "2rem" , backgroundColor:'#E50000'}}
        onClick={() => setChildDialog(true)}
      >
        Delete Fund Request
      </Button>
      <Button
        variant="contained"
        color="primary"
        style={{ marginTop: "2rem", marginLeft: "2rem" , backgroundColor:'#FFC000'}}
        onClick={() => setFundRequestDialog(true)}
      >
        Add Fund Request
      </Button>

      <ConfirmationDialog
        open={childDialog}
        onCancel={() => setChildDialog(false)}
        onClose={() => setChildDialog(false)}
        onConfirm={() => handleDeleteFundRequest(data.fundRequestID)}
        options={Singleton.getInstance().getDeleteDefaultOptions()}
      />
      <Dialog
        open={fundRequestDialog}
        onClose={() => setFundRequestDialog(false)}
      >
        <Box
          sx={{
            margin: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <AddFundRequest
            onDataSubmit={handleFundRequestSubmit}
            fundRequestData={fundRequestData || initialFundRequest}
            open={open}
          />
          <Button
            variant="contained"
            color="primary"
            style={{ marginTop: "2rem", marginLeft: "2rem" }}
            onClick={() => handleNewFundRequest()}
          >
            Create New Fund Request
          </Button>
        </Box>
      </Dialog>
    </>
  );
}
