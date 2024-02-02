
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import theme from '../../lib/theme';
import { useState } from 'react';
import * as React from 'react';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { useUser } from "../../lib/userContext";
import { auth } from "../../../firebase/firebase-config";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import DeviceUnknownIcon from '@mui/icons-material/DeviceUnknown';
import ListItemText from "@mui/material/ListItemText";
import { useRouter } from "next/router";
import Image from 'next/image';
import Grid from "@mui/material/Grid";
import DashboardIcon from '@mui/icons-material/Dashboard';
import PersonIcon from '@mui/icons-material/Person';
import MainDashBoard from '../../components/page/mainDashboard';
import Employee from '../../components/page/employee';
import Loading from '../../components/Loading/Loading';
import ChatIcon from '@mui/icons-material/Chat';
import Logout from '../../components/menus/Logout';
import WorkIcon from '@mui/icons-material/Work';
import JobVacancy from '../../components/page/JobVacancy/jobVacancy';
import Singleton from '../../lib/singleton';
import LostItem from '../../components/page/LostAndFound/lostItem';
import { Button } from '@mui/material';
import {seedUsers} from '../../lib/seeder/userSeeder'
import PaidIcon from '@mui/icons-material/Paid';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import ProjectPlan from '../../components/page/project/ProjectPlan/projectPlan';
import FundRequest from '../../components/page/project/FundRequest/fundRequest';
import WarningIcon from '@mui/icons-material/Warning';
import IncidentLog from '../../components/page/IncidentLog/incidentLog';
import Baggage from '../../components/page/Baggage/baggage';
import LuggageIcon from '@mui/icons-material/Luggage';
import withAuthorization from '../../middleware/withAuthorization';
import TerminalMap from '../../components/page/TerminalMap/terminalMap';
import MapIcon from '@mui/icons-material/Map';
import FeedbackFormPage from '../../components/page/FeedbackForm/FeedbackForm';
import ApartmentIcon from '@mui/icons-material/Apartment';
import Infrastructure from '../../components/page/Infrastructure/Infrastructure';
import FeedbackIcon from '@mui/icons-material/Feedback';
import TrainIcon from '@mui/icons-material/Train';
import EmployeeTraining from '../../components/page/EmployeeTraining/EmployeeTraining';
import ReportDownloader from '../../components/page/ReportDownloader/ReportDownloader';
import Interview from '../../components/page/Interview/Interview';
import EventIcon from '@mui/icons-material/Event';
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import BaggageIncidentLog from '../../components/page/BaggageIncidentLog/BaggageIncidentLog';
import Flight from '../../components/page/Flight/Flight';
import AirplanemodeActiveIcon from '@mui/icons-material/AirplanemodeActive'; // Import the icon
import Maintenance from '../../components/page/Maintenance/Maintenance';
import BuildIcon from '@mui/icons-material/Build';
const drawerWidth: number = 300;
interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    '& .MuiDrawer-paper': {
      position: 'relative',
      whiteSpace: 'nowrap',
      width: drawerWidth,
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
      boxSizing: 'border-box',
      ...(!open && {
        overflowX: 'hidden',
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
        width: theme.spacing(7),
        [theme.breakpoints.up('sm')]: {
          width: theme.spacing(9),
        },
      }),
    },
  }),
);


const Dashboard = () =>  {
  const [resetState, setResetState] = useState(false);
  const [selectedMenuItem, setSelectedMenuItem] = useState(0);
  const { user, logout, loading } = useUser();
  
  const router = useRouter();

  const handleChangeBody = (index : any) => {

    setSelectedMenuItem(index);
    setResetState(true);
  };

  const menu =[
    {text:'Dashboard', icon: <DashboardIcon/>, component:<MainDashBoard handleChangeBody={handleChangeBody}/>},
    {text:'Employee', icon: <PersonIcon/>, component:<Employee resetState={resetState} onResetState={() => setResetState(false)}/>},
    {text:'Job Vacancy', icon: <WorkIcon/>, component:<JobVacancy resetState={resetState} onResetState={() => setResetState(false)}/>},
    {text:'Lost Items', icon: <DeviceUnknownIcon/>, component:<LostItem resetState={resetState} onResetState={() => setResetState(false)}/>},
    {text:'Project Plan', icon: <WorkOutlineIcon />, component:<ProjectPlan resetState={resetState} onResetState={() => setResetState(false)}/>},
    {text:'Fund Request', icon: <PaidIcon />, component:<FundRequest resetState={resetState} onResetState={() => setResetState(false)}/>},
    {text:'Incident Log', icon: <WarningIcon />, component:<IncidentLog resetState={resetState} onResetState={() => setResetState(false)}/>},
    {text:'Baggage', icon: <LuggageIcon />, component:<Baggage resetState={resetState} onResetState={() => setResetState(false)} role={'BSS'}/>},
    {text:'Terminal Map', icon: <MapIcon />, component:<TerminalMap resetState={resetState} onResetState={() => setResetState(false)}/>},
    {text:'Infrastructure', icon: <ApartmentIcon />, component:<Infrastructure resetState={resetState} onResetState={() => setResetState(false)}/>},
    {text:'Feedback Form', icon: <FeedbackIcon />, component:<FeedbackFormPage resetState={resetState} onResetState={() => setResetState(false)}/>},
    {text:'Employee Training', icon: <TrainIcon />, component:<EmployeeTraining resetState={resetState} onResetState={() => setResetState(false)}/>},
    {text:'Interview Candidates', icon: <EventIcon />, component:<Interview resetState={resetState} onResetState={() => setResetState(false)}/>},
    {text:'Reports Downloader', icon: <CloudDownloadIcon />, component:<ReportDownloader resetState={resetState} onResetState={() => setResetState(false)}/>},
    {text:'Baggage Incident Log', icon: <WarningIcon />, component:<BaggageIncidentLog resetState={resetState} onResetState={() => setResetState(false)}/>},
    {text:'Baggage', icon: <LuggageIcon />, component:<Baggage resetState={resetState} onResetState={() => setResetState(false)} role={'GHM'}/>},
    {text:'Flight', icon: <AirplanemodeActiveIcon />, component:<Flight resetState={resetState} onResetState={() => setResetState(false)}/>},
    {text:'Maintenance', icon: <BuildIcon />, component:<Maintenance resetState={resetState} onResetState={() => setResetState(false)}/>},
  ];

  const handleLogout = () => {
    logout();
    auth.signOut();
    router.push('/auth/login');
  }

  const handleAuthorize = (userRole, index) => {

    const allowedIndices = Singleton.getInstance().getRolePermissions()[userRole] || [];
    return allowedIndices.includes(index);
  };
  let filteredMenu = menu.filter((menus, index) => {
    
    return handleAuthorize(user?.role, index)
  });

  React.useEffect(() => {
    filteredMenu = menu.filter((menus, index) => {
      return handleAuthorize(user?.role, index)
    });

    if (filteredMenu.length > 0) {
      if (selectedMenuItem >= filteredMenu.length) {
        setSelectedMenuItem(0);
      }
    }

    if(!user){
      router.push('/auth/login');
    }

  }, [user, selectedMenuItem]);
  

  if(loading){
    return (
      <Loading/>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <div>
          <AppBar
            position="absolute"
            open={true}
            sx={{
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
              boxShadow: 'none',
              backdropFilter: 'blur(6.5px)',
              WebkitBackdropFilter: 'blur(6.5px)',
              borderRadius: '10px',
              border: '1px solid rgba(255, 255, 255, 0.18)',
            }}
          >
            <Toolbar
              sx={{
                pr: '24px', 
                display: 'flex',
                justifyContent: 'space-between', 
              }}
            >
              <div style={{ position: 'fixed', right: '24px' }}>

                <IconButton sx={{ color: 'grey' }} onClick={() => router.push('/chat/chatPage')}>
                  <ChatIcon />
                </IconButton>
 
                <IconButton color="inherit" sx={{ml:2}}>
                  <Badge badgeContent={4} color="secondary" sx={{ color: 'grey' }}>
                    <NotificationsIcon />
                  </Badge>
                </IconButton>

              </div>
            </Toolbar>
          </AppBar>
          <Drawer variant="permanent" open={true} sx={{height:'100vh', '& .MuiDrawer-paper': {
            backgroundColor:'rgb(35, 48, 68)',
          } }}>
            <Divider />
            <List component="nav">
              <Grid item xs={12} style={{ height: '30px' }} />
              <Image 
                src='/images/linkasalogo.png' 
                width='400'
                height='250'
              ></Image>
              <Grid item xs={12} style={{ height: '30px' }} />

                {
                  
                  filteredMenu.map((menus, index) => {
                  
                    return (
                      <ListItemButton key={index} onClick={() => handleChangeBody(index)}>
                        <ListItemIcon sx={{color: index === selectedMenuItem ? '#FFC000': 'whitesmoke'}}>
                          {menus.icon}
                        </ListItemIcon>
                        <ListItemText primary={menus.text} sx={{color: index === selectedMenuItem ? '#FFC000': 'whitesmoke'}}/>
                    </ListItemButton>
                    );
                  })
                }
            </List>

            <div style={{ marginTop: 'auto' }}>
              <Divider sx={{ my: 1 }} />
              <Logout handleLogout={handleLogout}/>
            </div>
          </Drawer>
        </div>
        {/* <Button onClick={seedUsers}>
          seed user
        </Button> */}
        {filteredMenu.length > 0 && filteredMenu[selectedMenuItem].component}
      </Box>
    </ThemeProvider>
  );
}
export default Dashboard
// export default withAuthorization(Singleton.getInstance().getRoles())(Dashboard)