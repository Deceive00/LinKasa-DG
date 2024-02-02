import { createTheme } from '@mui/material/styles'
import { red } from '@mui/material/colors'

// Create a theme instance.
const theme = createTheme({
  palette: {
    primary: {
      main: '#556cd6',
    },
    secondary: {
      main: '#1976d2',
    },
    error: {
      main: red.A400,
    },
    text:{
      primary: 'rgba(0, 0, 0, 0.87)',
      // secondary:'rgb(238, 238, 238)'
      secondary: 'grey'
    }
    
  },
  typography: {
    fontFamily: 'Plus Jakarta Sans, sans-serif',
    fontWeightRegular: 700
  },
  
})

export default theme
