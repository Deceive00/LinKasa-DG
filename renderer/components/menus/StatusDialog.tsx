import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Button,
  Container,
} from "@mui/material";

const StatusDialog = ({ open, onClose, onStatusUpdate, possibleStatuses }) => {
  const [newStatus, setNewStatus] = useState("");

  const handleStatusUpdate = () => {
    onStatusUpdate(newStatus);
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Change Status</DialogTitle>
      <Container sx={{ padding: 2 }}>
        <DialogContent>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel htmlFor="new-status" id="new-status-label">
                New Status
              </InputLabel>
              <Select
                labelId="new-status-label"
                id="new-status"
                value={newStatus}
                label="New Status"
                onChange={(e) => {setNewStatus(e.target.value); console.log(e.target.value)}}
                inputProps={{
                  name: "newstatus",
                  id: "new-status",
                  color: "rgba(0, 0, 0, 0.54)",
                }}
              >
                {possibleStatuses.map((status) => (
                  <MenuItem key={status} value={status}>
                    {status}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </DialogContent>

        <DialogContent>
          <Button
            variant="contained"
            color="primary"
            onClick={handleStatusUpdate}
            fullWidth
          >
            Update Status
          </Button>
        </DialogContent>
      </Container>
    </Dialog>
  );
};

export default StatusDialog;
