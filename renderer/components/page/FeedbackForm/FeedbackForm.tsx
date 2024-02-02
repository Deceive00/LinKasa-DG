import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Container,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Select,
  MenuItem,
  IconButton,
} from '@mui/material';
import { db } from '../../../../firebase/firebase-config';
import { collection, addDoc, getDocs, onSnapshot, updateDoc, doc } from 'firebase/firestore';
import DeleteIcon from '@mui/icons-material/Delete';
import { deleteItemByID } from '../../../lib/utils';
import InfoIcon from "@mui/icons-material/Info";
import Snackbar from '@mui/material/Snackbar';
import Alert, { AlertColor } from '@mui/material/Alert';

const initialQuestion: Question = {
  content: '',
  type: '',

};

const initialFeedbackForm: FeedbackForm = {
  createdAt: new Date(),
  questions: [],
  title:'',
  id:''
};


const FeedbackFormComponent = () => {
  const [formName, setFormName] = useState('');
  const [questionType, setQuestionType] = useState('');
  const [questionText, setQuestionText] = useState('');
  const [ratingScale, setRatingScale] = useState(5);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [feedbackForms, setFeedbackForms] = useState<FeedbackForm[]>([]);
  const [selectedForm, setSelectedForm] = useState<FeedbackForm | null>(null);
  const [editingQuestions, setEditingQuestions] = useState<Question[]>([]);
  const [updatedTitle, setUpdatedTitle] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<AlertColor>('success');
  
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'feedbackForms'), (snapshot) => {
      const formsData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as FeedbackForm[];
      setFeedbackForms(formsData);
    });
    return () => unsubscribe();
  }, []);
  

  const handleQuestionTypeChange = (e) => {
    setQuestionType(e.target.value as string);
  };

  const openSnackbar = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  
  const handleQuestionTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuestionText(e.target.value);
  };

  const handleAddQuestion = () => {
    if (questionType && questionText) {
      const newQuestion: Question = {
        content: questionText,
        type: questionType,
      };

      setQuestions((prevQuestions) => [...prevQuestions, newQuestion]);
      openSnackbar('Questions Added', 'success');
      setQuestionType('');
      setQuestionText('');
      setRatingScale(5);
    }
  };

  const handleCreateFeedbackForm = async () => {
    if (formName && questions.length > 0) {
      try {
        const feedbackFormRef = await addDoc(collection(db, 'feedbackForms'), {
          createdAt: new Date(),
          title:formName,
          questions,
        });
        openSnackbar('Feedback form created successfully!', 'success');
        console.log('Feedback form created with ID:', feedbackFormRef.id);

        setFormName('');
        setQuestions([]);
      } catch (error) {
        openSnackbar('Error creating feedback form', 'error');
        console.error('Error creating feedback form:', error);
      }
    }
  };

  const handleFormRowClick = (form: FeedbackForm) => {
    setSelectedForm(form);
    setEditingQuestions(form.questions.map((question) => ({ ...question })));
    setUpdatedTitle(form.title);
  };
  
  const handleDeleteForm = async (form :FeedbackForm) => {
    if(await deleteItemByID('feedbackForms', form.id) === ''){
      console.log('success');
      openSnackbar('Feedback form deleted successfully!', 'success');
    }
  }

  const handleEditingQuestionContentChange = (index: number, content: string) => {

    const updatedEditingQuestions = [...editingQuestions];
    updatedEditingQuestions[index].content = content;
    setEditingQuestions(updatedEditingQuestions);
  };

  const handleEditingQuestionTypeChange = (index: number, type: string) => {
    const updatedEditingQuestions = [...editingQuestions];
    updatedEditingQuestions[index].type = type;
    setEditingQuestions(updatedEditingQuestions);
  };
  
  const handleUpdateForm = async () => {
    if (selectedForm) {
      try {
        const formRef = doc(db, 'feedbackForms', selectedForm.id);
        await updateDoc(formRef, {
          title: updatedTitle,
          questions: editingQuestions,
        });
        setSelectedForm(null);
        setEditingQuestions([]);
        setUpdatedTitle(null);
        console.log('Form updated successfully!');
        openSnackbar('Feedback form updated successfully!', 'success');
      } catch (error) {
        console.error('Error updating form:', error);
      }
    }
  };
  
  const handleChangeTitle = (value) => {
    setUpdatedTitle(value);
  }

  return (
    <Container sx={{ padding: '5vw', height:'100vh', overflow:'scroll' }}>
      <Typography variant="h4" sx={{ marginBottom: '20px', textAlign: 'center' }}>
        Create Feedback Form
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={6}>
          <TextField
            fullWidth
            label="Form Name"
            value={formName}
            onChange={(e) => setFormName(e.target.value)}
          />
        </Grid>
        <Grid item xs={3}>
          <Select
            fullWidth
            value={questionType}
            onChange={handleQuestionTypeChange}
            displayEmpty
          >
            <MenuItem value="" disabled>
              Select Type
            </MenuItem>
            <MenuItem value="questionnaire">Questionnaire</MenuItem>
            <MenuItem value="text">Text</MenuItem>
          </Select>
          <TextField
            fullWidth
            label="Question Content"
            value={questionText}
            onChange={handleQuestionTextChange}
            sx={{ marginTop: '10px' }}
          />
        </Grid>
        
        <Grid item xs={3}>
          <Button
            variant="contained"
            onClick={handleAddQuestion}
            sx={{ marginTop: '10px' }}
          >
            Add Question
          </Button>
        </Grid>
      </Grid>

      <Box sx={{ marginTop: '20px', border: '1px solid #ccc', padding: '10px', borderRadius: '8px' }}>
        <Typography variant="h5" sx={{ marginBottom: '10px' }}>
          Added Questions:
        </Typography>
        {questions.map((question, index) => (
          <Typography key={index} variant="h6" sx={{ marginBottom: '8px', paddingLeft: '10px', borderLeft: '2px solid #4caf50' }}>
            - {question.content} - {question.type}
          </Typography>
        ))}
      </Box>

      <Button
        variant="contained"
        onClick={handleCreateFeedbackForm}
        sx={{ marginTop: '20px' }}
      >
        Create Feedback Form
      </Button>

      <TableContainer component={Paper} sx={{ marginTop: '20px' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Form Name</TableCell>
              <TableCell>Questions</TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {feedbackForms.map((form) => (
              <TableRow
                key={form.id}
              >
                <TableCell>{form.title}</TableCell>
                <TableCell>
                  {form.questions.map((question, index) => (
                    <div key={question.content}>
                      {index+1}. {question.content} - {question.type}
                    </div>
                  ))}
                </TableCell>
                <TableCell>
                  <IconButton
                    onClick={() => {
                      handleFormRowClick(form)
                    }}
                  >
                    <InfoIcon />
                  </IconButton>
                </TableCell>
                <TableCell>
                 <IconButton onClick={() => handleDeleteForm(form)}>
                  <DeleteIcon sx={{color:'red'}}/>
                 </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {
        selectedForm && (
          <Box sx={{ marginTop: '20px' }}>
            <Typography sx={{marginBottom:'1rem'}} variant="h5">Selected Form Details:</Typography>
            <TextField
              label={`Title`}
              value={updatedTitle}
              sx={{paddingBottom:'1rem'}}
              onChange={(e) => handleChangeTitle(e.target.value)}
              fullWidth
            />
            <Typography variant="body1">Questions:</Typography>
            {editingQuestions.map((question, index) => (
              <div key={`${question.content}-${question.type}`} style={{ marginBlock: '2rem' }}>
                <div>
                  <TextField
                    label={`Question ${index + 1} Content`}
                    value={question.content}
                    onChange={(e) => handleEditingQuestionContentChange(index, e.target.value)}
                    fullWidth
                  />
                </div>
                <div>
                  <Select
                    value={question.type}
                    label='type'
                    placeholder='type'
                    onChange={(e) => handleEditingQuestionTypeChange(index, e.target.value as string)}
                    displayEmpty
                    sx={{ marginTop: '10px' }}
                  >
                    <MenuItem value="" disabled>
                      Select Type
                    </MenuItem>
                    <MenuItem value="questionnaire">Questionnaire</MenuItem>
                    <MenuItem value="text">Text</MenuItem>
                  </Select>
                </div>
              </div>
            ))}
            <Button variant="contained" onClick={handleUpdateForm}>
              Update Form
            </Button>
          </Box>
        )
      }
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>

    </Container>
  );
};

export default FeedbackFormComponent;
