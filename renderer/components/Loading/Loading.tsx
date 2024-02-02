import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";

export default function Loading(){
  return(
    <div
    style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      backgroundColor: 'rgba(255, 255, 255, 0.8)',
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      zIndex: 9999,
    }}
  >
    <Box position="relative" display="inline-flex">
      <CircularProgress size={80} thickness={4} color="primary" />
    </Box>
  </div>
  );
}