import React, { useEffect } from "react";
import AddFundRequest from "./addFundRequest";
import AddProjectPlan from "./addProjectPlan";
import { Copyright } from "@mui/icons-material";
import {
  CssBaseline,
  Container,
  Paper,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Box,
  Button,
  Dialog,
} from "@mui/material";
import { useUser } from "../../../../lib/userContext";
import { addDoc, arrayUnion, collection, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../../../../../firebase/firebase-config";
import Singleton from "../../../../lib/singleton";

export default function AddProject({ open, onClose }) {

  const steps = ["Project Plan Details", "Fund Request Details"];
  const [projectPlanData, setProjectPlanData] = React.useState<ProjectPlan>(() => initialProjectPlan);
  const [fundRequestData, setFundRequestData] = React.useState<FundRequest>(() => initialFundRequest);
  const [activeStep, setActiveStep] = React.useState(0);
  const {user} = useUser();
  const initialProjectPlan: ProjectPlan = {
    uid: '',
    title: '',
    description: '',
    projectManagerName: '',
    status: 'Pending Approval',
    fundRequestID: '',
    createdAt: new Date(),
  };

  const initialFundRequest: FundRequest = {
    uid: '',
    projectID: '',
    status: 'Pending Approval',
    purpose: '',
    requestedAmount: '',
    requestDate: new Date(),
  };

  const handleProjectPlanSubmit = (data: ProjectPlan) => {
    if(open){
      setProjectPlanData(data);
    }
  };

  useEffect(() => {
    if (!open) {
      setProjectPlanData(initialProjectPlan);
      setFundRequestData(initialFundRequest);
      setActiveStep(0);
    }
  }, [open]);

  const handleFundRequestSubmit = (data: FundRequest) => {
    setFundRequestData(data);
  };


  const handleSubmitProject = async () => {

    try {
      if (projectPlanData && fundRequestData) {
        const { uid, ...projectPlanDataWithoutUid } = projectPlanData;
        const projectPlanRef = await addDoc(collection(db, 'projectPlan'), projectPlanDataWithoutUid);
        console.log('Project Plan submitted with ID:', projectPlanRef.id);

        const updatedFundRequestData = { ...fundRequestData, projectID: projectPlanRef.id };

        const { uid: fundRequestUid, ...fundRequestDataWithoutUid } = updatedFundRequestData;
        const fundRequestRef = await addDoc(collection(db, 'fundRequest'), fundRequestDataWithoutUid);
        console.log('Fund Request submitted with ID:', fundRequestRef.id);
        
        await updateDoc(doc(db, 'projectPlan', projectPlanRef.id), { fundRequestID: fundRequestRef.id });
        console.log('Project Plan updated with Fund Request ID:', fundRequestRef.id);
        onClose();
        const message =  `A new fund request needs your review (purpose: ${fundRequestData.purpose}).`;
        Singleton.getInstance().addNotification('fundRequest', 'Chief Financial Officer (CFO)', message, fundRequestRef.id);

      } else {
        console.error('Error: Project Plan or Fund Request data is missing.');
      }
    } catch (error) {
      console.error('Error submitting data to Firestore:', error.message);
    }
  };
  function getStepContent(step: number) {
    switch (step) {
      case 0:
        return <AddProjectPlan onDataSubmit={handleProjectPlanSubmit} projectPlanData={projectPlanData || initialProjectPlan} open={open}/>;
      case 1:
        return <AddFundRequest onDataSubmit={handleFundRequestSubmit} fundRequestData={fundRequestData || initialFundRequest} open={open}/>;
      default:
        throw new Error("Unknown step");
    }
  }


  const handleNext = () => {
    setActiveStep(activeStep + 1);
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <Container component="main" maxWidth="sm" sx={{ mb: 4 }}>
        <Paper
          variant="outlined"
          sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}
        >
          <Typography component="h1" variant="h4" align="center">
            Project Plan
          </Typography>
          <Stepper activeStep={activeStep} sx={{ pt: 3, pb: 5 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          {activeStep === steps.length ? (
            <div>
              <Typography variant="h5" gutterBottom>
                Project addedd successfully
              </Typography>
              <Typography variant="subtitle1">
                Your fund request is pending
              </Typography>
            </div>
          ) : (
            <div>
              {getStepContent(activeStep)}
              <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                {activeStep !== 0 && (
                  <Button onClick={handleBack} sx={{ mt: 3, ml: 1 }}>
                    Back
                  </Button>
                )}
                <Button
                  variant="contained"
                  onClick={() => activeStep === steps.length - 1 ? handleSubmitProject() :handleNext()}
                  sx={{ mt: 3, ml: 1 }}
                >
                  {activeStep === steps.length - 1 ? "Insert" : "Next"}
                </Button>
              </Box>
            </div>
          )}
        </Paper>
        <Copyright />
      </Container>
    </Dialog>
  );
}
