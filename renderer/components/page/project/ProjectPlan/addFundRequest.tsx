import * as React from 'react';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

export default function AddFundRequest({ onDataSubmit, fundRequestData, open }) {
  
  const [data, setData] = React.useState<FundRequest>(() => fundRequestData);

  const handleChange = (prop: keyof FundRequest) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setData((prevData) => ({
      ...prevData,
      [prop]: event.target.value,
    }));
  };

  React.useEffect(() => {
    onDataSubmit(data);
  }, [data, onDataSubmit]);

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Fund Request Details
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            required
            fullWidth
            id="purpose"
            label="Purpose"
            type="text"
            value={data.purpose}
            onChange={handleChange('purpose')}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            fullWidth
            id="requestedAmount"
            label="Requested Amount"
            type="number"
            value={data.requestedAmount}
            onChange={handleChange('requestedAmount')}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            required
            fullWidth
            id="status"
            label="Status"
            type="text"
            value={data.status}
            onChange={handleChange('status')}
          />
        </Grid>
      </Grid>
    </Box>
  );
}
