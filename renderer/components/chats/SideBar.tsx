import { Avatar, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, TextField } from "@mui/material";
import { useUser } from "../../lib/userContext";
import { Add, ExitToApp, SearchOutlined } from "@mui/icons-material";
import styles from '../../pages/chat/styles/chatPage.module.css'
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import GlobalChatSideContent from './globalChatSideContent';
import InterdepartmentChadSideCOntent from './interdepartmentChatSideContent';
import Grid from '@mui/material/Grid';
import LanguageIcon from '@mui/icons-material/Language';
import PeopleIcon from '@mui/icons-material/People'
import { useEffect, useState } from "react";
import { Router, useRouter } from "next/router";
import Singleton from "../../lib/singleton";
import Loading from "../Loading/Loading";


export default function SideBar({ setTab, onDepartmentClick }){
  const router = useRouter()
  const [isMakingChats, setMakingChats] = useState(false);
  const [interdepartmentData, setInterdepartmentData] = useState([]);
  const { user, loading } = useUser();

  const [activeTab, setActiveTab] = useState(0);
  let rolesinterdepartmentData;
  useEffect(() => {
    const rolesInstance = Singleton.getInstance();
    rolesinterdepartmentData = rolesInstance.getInterdepartmentRoles();
    setInterdepartmentData(rolesinterdepartmentData);
  }, []);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setTab(newValue);
  };
  if(loading && !user){
    return <Loading/>;
  }

  if(user.role === ''){
    router.push('/auth/login');
  }

  return (
    <div className={styles.sidebar}>
      <div className={styles.sidebarHeader}>
        <div className={styles.leftSidebarHeader}>
          <Avatar src ='/images/logo.png' sx={{marginRight:'0.8rem', padding:'0.2rem',backgroundColor:'whitesmoke'}}/>
          <h4>{user?.name}</h4>
        </div>
        <div className={'styles.rightSidebarHeader'}>
          <IconButton onClick={() => {router.push('/dashboard/dashboard')}}>
            <ExitToApp sx={{color:'whitesmoke'}}/>
          </IconButton>
        </div>
      </div>
      <div className={styles.sidebarSearch}>
        <form action="" className={styles.sidebarSearchContainer}>
          <SearchOutlined/>
          <input type="text"  id="search" placeholder="Search for departments"/>
        </form>
      </div>

      <div className={styles.sidebarTab}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          sx={{display:"flex", width:"100%"}}
        >
          <Tab 
            icon={<LanguageIcon/>} 
            sx={{
              // marginLeft:'10px',
              '&:not(.Mui-selected)': {
                color: 'grey', 
              },
              width:Singleton.getInstance().getNoAccess().includes(user?.role) ? '100%' : '50%'
            }}
          />
          {
            !Singleton.getInstance().getNoAccess().includes(user?.role) && (
              <Tab 
                icon={<PeopleIcon/>} 
                sx={{
                  '&:not(.Mui-selected)': {
                    color: 'grey', 
                  },
                  width:"50%"
                }}
              />
            )
          }

        </Tabs>
        {activeTab === 0 && <GlobalChatSideContent />}
        {activeTab === 1 && <InterdepartmentChadSideCOntent key={'1'} title={'Interdepartment Chats'} data={interdepartmentData} onDepartmentClick={onDepartmentClick}/>}
      </div>

      {/* <div className={styles.sidebarAddChat}>
        <IconButton onClick={() => setMakingChats(true)}>
          <Add/>
        </IconButton>
      </div>

      <Dialog maxWidth="lg" open={isMakingChats} onClose={() => setMakingChats(false)}>
        <DialogTitle>Subscribe</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Add chats
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Email Address"
            type="text"
            fullWidth
            variant="filled"
          />
        </DialogContent>
        <DialogActions>
          <Button color="error" onClick={() => setMakingChats(false)}>Cancel</Button>
          <Button color="success">Subscribe</Button>
        </DialogActions>
      </Dialog> */}
    </div>
  );
}