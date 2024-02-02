import * as React from 'react';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { addDoc, collection } from 'firebase/firestore';
import { auth, db } from '../../../../../firebase/firebase-config';
import { useUser } from '../../../../lib/userContext';


export default function AddProjectPlan({onDataSubmit, projectPlanData, open}) {

  const [data, setData] = React.useState<ProjectPlan>(() => projectPlanData);
  const user = useUser();

  React.useEffect(() => {
    setData((prevData) => ({
      ...prevData,
      ['projectManagerName']: user.user.name,
    }));
  }, [])

  const handleChange = (prop: keyof ProjectPlan) => (
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
        Project Plan Details
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            required
            fullWidth
            id="title"
            label="Title"
            type="text"
            value={data.title}
            onChange={handleChange('title')}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            fullWidth
            id="description"
            label="Description"
            type="text"
            value={data.description}
            onChange={handleChange('description')}
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
