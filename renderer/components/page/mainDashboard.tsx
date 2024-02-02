import * as React from 'react';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import NextLink from 'next/link';
import CardActionArea from '@mui/material/CardActionArea';
import CardMedia from '@mui/material/CardMedia';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import theme from '../../lib/theme';
import Link from '@mui/material/Link';
import { useUser } from '../../lib/userContext';
import Button from '@mui/material/Button';
import WeatherCard from '../menus/WeatherCard';
import { Timestamp, collection, doc, getDoc, getDocs } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { db } from '../../../firebase/firebase-config';
import { Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import Title from '../title';



function Copyright(props: any) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props} marginTop='5vh'>
      {'Copyright © '}
      <Link color="inherit" href="https://mui.com/">
        LinKasa
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}


export default function MainDashBoard({handleChangeBody}){
  const user = useUser();
  const [notifications, setNotifications] = useState([]);

  const formatDate = (date: Date): string => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
    };
    return new Intl.DateTimeFormat('en-US', options).format(date);
  };
  

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        if (!user || !user.user.role) {
          return;
        }

        const roleDocRef = doc(db, 'notifications', `${user.user.role}`);
        const roleDocSnapshot = await getDoc(roleDocRef);

        if (roleDocSnapshot.exists()) {
          const roleDocData = roleDocSnapshot.data();
          
          if (roleDocData && roleDocData.notifications) {
            roleDocData.notifications = roleDocData.notifications.map(notification => {
              return {
                ...notification,
                timestamp: notification.timestamp.toDate(),
              };
            });
          }
          setNotifications(roleDocData.notifications || []);
        } else {
          console.log(`Role document not found for ${user.user.role}`);
        }
      } catch (error) {
        console.error('Error fetching notifications:', error.message);
      }
    };

    fetchNotifications();
  }, [user]);

  return(
  <Box
    component="main"
    sx={{
      backgroundColor: theme.palette.grey[100],
      flexGrow: 1,
      height: '100vh',
      overflow: 'auto',
      paddingTop: '10vh'
    }}
  >
    <div style={{ display: 'flex', flexDirection: 'column' , paddingInline:'3vw'}}>
      <Typography variant="h3" gutterBottom>
        Hello, {user.user && user.user.name}!
      </Typography>
      <Typography variant="h5" color="grey" style={{ marginTop: '-8px' }}>
        {user.user && user.user.role}
      </Typography>

    </div>
    <Toolbar />
    <Container maxWidth="lg" sx={{ mb: 4 }}>
      <Grid container spacing={10} justifyContent={'center'}>
        {
          user.user.role === 'Airport Operations Manager' && (
            <WeatherCard/>
          )
        }
      {
        user.user.role === 'Human Resource Director' && (
          <div style={{display:'flex', marginTop:'5vh'}}>
            <Grid item xs={12} md={6} lg={4}>
              <Button onClick={() => handleChangeBody(2)}>
                <Card sx={{ width: 330 }}>
                  <CardActionArea>
                    <CardContent>
                      <Typography gutterBottom variant="h5" component="div" align='left'>
                        Job Vacancies
                      </Typography>
                    </CardContent>
                    <br/><br/><br/>
                    <div style={{ position: 'absolute', bottom: 0, right: 0 , padding: '1rem'}}>
                      <CardMedia
                        component="img"
                        height="70px"
                        width="70px"
                        image={`../../images/employee.png`}
                      />
                    </div>
                  </CardActionArea>
                </Card>
              </Button>
            </Grid>
            {/* Employee */}
            <Grid item xs={12} md={6} lg={4}>
              <Button onClick={() => handleChangeBody(1)}>
                <Card sx={{ width: 330 }}>
                  <CardActionArea>
                    <CardContent>
                      <Typography gutterBottom variant="h5" component="div" align='left'>
                        {/* {item.roleName} */}
                        Employee
                      </Typography>
                    </CardContent>
                    <br/><br/><br/>
                    <div style={{ position: 'absolute', bottom: 0, right: 0 }}>
                      <CardMedia
                        component="img"
                        height="70"
                        width="70"
                        image={`../../images/employee.png`}
                      />
                    </div>
                  </CardActionArea>
                </Card>
              </Button>
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <NextLink href={"/dashboard/jobs/employee"}>
                <Card sx={{ width: 330 }}>
                  <CardActionArea>
                    <CardContent>
                      <Typography gutterBottom variant="h5" component="div">
                        {/* {item.roleName} */}
                        Employee
                      </Typography>
                    </CardContent>
                    <br/><br/><br/>
                    <div style={{ position: 'absolute', bottom: 0, right: 0 }}>
                      <CardMedia
                        component="img"
                        height="70"
                        width="70"
                        image={`../../images/employee.png`}
                      />
                    </div>
                  </CardActionArea>
                </Card>
              </NextLink>
            </Grid>
          </div>
        )
      }
        

        <Grid item xs={12}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
            <Title>Notifications</Title>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Messages</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {notifications.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>{row.message}</TableCell>
                    <TableCell>{formatDate(row.timestamp)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        </Grid>
        <Copyright/>
      </Grid>
    </Container>
  </Box>
  );
}