import {
  TextField,
  Button,
  IconButton,
  Typography,
  Snackbar,
  Alert,
  Grid,
  AlertColor,
  Autocomplete,
} from "@mui/material";
import { useState, useEffect } from "react";
import ConfirmationDialog from "../menus/ConfirmationDialog";
import CustomListBox from "../utils/CustomListBox";
import KeyboardBackspaceRoundedIcon from "@mui/icons-material/KeyboardBackspaceRounded";
import { uploadImage } from "../../lib/utils";
import ChangeFundRequest from "../menus/changeFundRequest";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { db } from "../../../firebase/firebase-config";

interface Mode {
  delete: boolean;
  update: boolean;
}

interface ConfirmationOptions {
  title: string;
  description: string;
}

interface GenericDetailProps<T> {
  id: string;
  onClose: () => void;
  objectType: string;
  confirmationOptions: ConfirmationOptions;
  fetchData: (id: string) => Promise<T>;
  updateData: (id: string, data: Partial<T>) => Promise<void>;
  deleteData: (id: string) => Promise<void>;
  getEmployeeList?: (id: string) => Promise<string[]>;
  getCandidateID?: (data: any) => Promise<string>;
}

export default function GenericDetail<T>({
  id,
  onClose,
  objectType,
  confirmationOptions,
  fetchData,
  updateData,
  deleteData,
  getEmployeeList,
  getCandidateID,
}: GenericDetailProps<T>) {
  const [data, setData] = useState<T>();
  const [boolDialog, setBoolDialog] = useState<Mode>({
    delete: false,
    update: false,
  });
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("error");
  const [snackbarSeverity, setSnackbarSeverity] = useState("error");
  const [photo, setPhoto] = useState(null);
  const [employeeOptions, setEmployeeOptions] = useState([]);
  const [fundRequestStatus, setFundRequestStatus] = useState("");
  const [fetching, setFetching] = useState(false);
  const [candidateOptions, setCandidateOptions] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  const disabled = [
    "createdAt",
    "projectManagerName",
    "status",
    "baggageHandlingStatus",
    "instructor",
    "baggageGroundStatus"
  ];

  const hide = ["uid", "id", "projectID", "incidentID"];
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const showMessage = (reason, type) => {
    setSnackbarOpen(true);
    setSnackbarMessage(reason);
    setSnackbarSeverity(type);
  };

  useEffect(() => {
    const fetchObjectData = async () => {
      try {
        const objectData = await fetchData(id);
        setData(objectData);
        setFetching(false);
      } catch (error) {
        console.error(`Error fetching ${objectType} data:`, error.message);
      }
    };

    fetchObjectData();
  }, [id, objectType, fetchData, fetching]);

  useEffect(() => {
    if (objectType !== "employeeTraining") return;
    const fetchEmployeeOptions = async () => {
      try {
        const employeeCollection = collection(db, "users");
        const employeeSnapshot = await getDocs(employeeCollection);
        const employees = employeeSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setEmployeeOptions(employees);
        const employeeLists = await getEmployeeList(id);
        const selectedEmployeeObjects = employeeLists.map((id) =>
          employees.find((employee) => employee.id === id)
        );

        setSelectedEmployees(selectedEmployeeObjects);
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    };

    fetchEmployeeOptions();
  }, []);

  useEffect(() => {
    const fetchCandidateOptions = async () => {
      try {
        const candidatesCollection = collection(db, "jobCandidates");
        const candidatesSnapshot = await getDocs(candidatesCollection);
        const candidates = candidatesSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setCandidateOptions(candidates);
        const currCandidateID = await getCandidateID(id);
        const selectedCandidateObject = candidates.find(
          (cand) => cand.id === currCandidateID
        );
  
        setSelectedCandidate(selectedCandidateObject);

      } catch (error) {
        console.error("Error fetching candidates:", error);
      }
    };
    if (objectType === "interview") {
      fetchCandidateOptions();
    }
  }, []);

  const handleChange = (attribute: keyof T, value: string | string[]) => {
    setData((prevData) => ({
      ...prevData,
      [attribute]: value,
    }));
  };
  const handleChangeDate = (attribute: keyof T, value: Date) => {
    setData((prevData) => ({
      ...prevData,
      [attribute]: value,
    }));
  };
  const handleEmployeeChange = (values) => {
    // khusus employee training program
    setSelectedEmployees(values);
  };

  const handleCandidateChange = (value) => {
    setSelectedCandidate(value);
  };
  const handleUpdate = async () => {
    try {
      // khusus lost item
      if (photo) {
        const ext = photo.name.split(".")[1];
        const filename = `lostItem/${id}.${ext}`;
        data["photos"] = await uploadImage(filename, photo);
      }
      if (selectedEmployees.length !== 0) {
        data["listEmployee"] = selectedEmployees.map((value) => value.id);
      }

      if (selectedCandidate !== null) {
        console.log(selectedCandidate)
        data["candidateID"] = selectedCandidate.id;
      }

      await updateData(id, data);
      setBoolDialog({ ...boolDialog, update: false });
      showMessage("Data successfully updated", "success");
    } catch (error) {
      console.error(`Error updating ${objectType} data:`, error.message);
    }
  };
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setPhoto(file);
  };

  const determineDisabled = (attribute) => {
    if (disabled.includes(attribute)) {
      return true;
    }
    return false;
  };

  const getFundRequestStatus = (fundRequestID) => {
    if (fetching || fundRequestID === "") {
      return null;
    }
    const fundRequestRef = doc(db, "fundRequest", fundRequestID);
    return getDoc(fundRequestRef)
      .then((docSnapshot) => {
        if (docSnapshot.exists()) {
          const { status } = docSnapshot.data();
          return status;
        } else {
          console.error(`Document with ID ${fundRequestID} does not exist.`);
          return "N/A";
        }
      })
      .catch((error) => {
        console.error("Error fetching fundRequest data:", error.message);
        throw error;
      });
  };

  const renderInputFields = () => {
    if (!data) {
      return null;
    }
    const datas = Object.keys(data).sort((a, b) => b.localeCompare(a));

    return datas.map((attribute) => {
      const value = data[attribute as keyof T];

      if (
        objectType === "projectPlan" &&
        attribute === "fundRequestID" &&
        getFundRequestStatus(value)
      ) {
        getFundRequestStatus(value).then((status) => {
          setFundRequestStatus(status);
        });
      }
      if (attribute === "title" && value === "No Title") {
        return;
      }
      if (hide.includes(attribute)) return;

      if ((attribute as keyof T) === "photos") {
        return (
          <div
            key={attribute}
            style={{ display: "flex", flexDirection: "column" }}
          >
            {!photo && (
              <img
                src={value as string}
                alt="Lost item"
                style={{ width: "100%", marginTop: "16px", maxHeight: "50vh" }}
              />
            )}
            {photo && (
              <img
                src={URL.createObjectURL(photo)}
                alt="Lost item"
                style={{ width: "100%", marginTop: "16px", maxHeight: "50vh" }}
              />
            )}

            <Grid item xs={12}>
              <input
                accept="image/*"
                style={{ display: "none" }}
                id="photo"
                type="file"
                onChange={(e) => handleFileChange(e)}
              />
              <label htmlFor="photo">
                <Button
                  fullWidth
                  variant="outlined"
                  component="span"
                  sx={{ mt: 3, mb: 2 }}
                >
                  Upload Photo
                </Button>
              </label>
            </Grid>
          </div>
        );
      } else if (attribute === "listEmployee") {
        return (
          <Grid item xs={12}>
            <Autocomplete
              multiple
              id="employee"
              options={employeeOptions}
              getOptionLabel={(option) => `${option.name} - ${option.role}`}
              onChange={(event, values) => handleEmployeeChange(values)}
              value={selectedEmployees}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Select Employees"
                  placeholder="Select Employees"
                />
              )}
            />
          </Grid>
        );
      } else if (attribute === "candidateID") {
        return (
          <Grid item xs={12}>
            <Autocomplete
              id="candidate"
              options={candidateOptions}
              getOptionLabel={(option) => `${option.name}`}
              onChange={(event,value) => handleCandidateChange(value)}
              value={selectedCandidate}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Select Candidate"
                  placeholder="Select Candidate"
                />
              )}
            />
          </Grid>
        );
      } else if (
        attribute === "schedule" &&
        (objectType === "employeeTraining" || objectType === "interview" || objectType === "maintenance")
        || attribute === "departureTime" || attribute === 'arrivalTime'
      ) {
        console.log(value)
        const formattedValue =
          value instanceof Date ? value.toISOString().slice(0, 16) : "";
        return (
          <TextField
            required
            fullWidth
            id={attribute}
            label={attribute}
            type="datetime-local"
            InputLabelProps={{
              shrink: true,
            }}
            value={formattedValue}
            onChange={(e) =>
              handleChangeDate(attribute as keyof T, new Date(e.target.value))
            }
          />
        );
      } else if (Array.isArray(value)) {
        return (
          <CustomListBox
            key={attribute}
            id={attribute}
            onListChange={(newValue) =>
              handleChange(attribute as keyof T, newValue)
            }
            initialValues={data[attribute as keyof T] as string[]}
          />
        );
      } else if (value instanceof Date) {
        return (
          <TextField
            key={attribute}
            id={`outlined-basic-${attribute}`}
            label={attribute.charAt(0).toUpperCase() + attribute.slice(1)}
            variant="outlined"
            type="date"
            value={formatDate(value)}
            onChange={(e) =>
              handleChangeDate(attribute as keyof T, new Date(e.target.value))
            }
            disabled={determineDisabled(attribute)}
          />
        );
      } else if (
        objectType === "projectPlan" &&
        attribute === "fundRequestID"
      ) {
        return (
          <TextField
            key={attribute}
            id={`outlined-basic-${attribute}`}
            label={"Fund Request Status"}
            variant="outlined"
            value={value === "" ? "No Fund Request Yet" : fundRequestStatus}
            disabled
            error
          />
        );
      } else {
        return (
          <TextField
            key={attribute}
            id={`outlined-basic-${attribute}`}
            label={attribute.charAt(0).toUpperCase() + attribute.slice(1)}
            variant="outlined"
            value={value as string}
            onChange={(e) => handleChange(attribute as keyof T, e.target.value)}
            disabled={determineDisabled(attribute)}
          />
        );
      }
    });
  };

  const formatDate = (date: Date): string => {
    const isoString = date.toISOString();
    return isoString.slice(0, 10);
  };

  return (
    <div>
      <div
        style={{ display: "flex", alignItems: "center", marginBottom: "3vh" }}
      >
        <IconButton onClick={onClose}>
          <KeyboardBackspaceRoundedIcon fontSize="large" />
        </IconButton>
        <Typography
          variant="h3"
          gutterBottom
          sx={{
            display: "flex",
            alignItems: "center",
            margin: 0,
            marginLeft: "2vw",
          }}
        >
          {objectType} Details
        </Typography>
      </div>
      <div style={{ padding: "20px", maxWidth: "600px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {renderInputFields()}
        </div>
        <Button
          variant="contained"
          color="primary"
          style={{ marginTop: "2rem" }}
          onClick={() => setBoolDialog({ ...boolDialog, update: true })}
        >
          Update
        </Button>
        {objectType === "projectPlan" && (
          <ChangeFundRequest
            data={data}
            id={id}
            after={() => setFetching(true)}
            updateData={updateData}
            showMessage={showMessage}
          />
        )}
      </div>
      <ConfirmationDialog
        open={boolDialog.update}
        onCancel={() => setBoolDialog({ ...boolDialog, update: false })}
        onClose={() => setBoolDialog({ ...boolDialog, update: false })}
        onConfirm={handleUpdate}
        options={confirmationOptions}
      />
      <ConfirmationDialog
        open={boolDialog.delete}
        onCancel={() => setBoolDialog({ ...boolDialog, delete: false })}
        onClose={() => setBoolDialog({ ...boolDialog, delete: false })}
        onConfirm={deleteData}
        options={confirmationOptions}
      />

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        <Alert
          severity={snackbarSeverity as AlertColor}
          onClose={handleSnackbarClose}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
}
