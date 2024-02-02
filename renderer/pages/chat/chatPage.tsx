import React, { useEffect, useState } from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import GlobalChat from '../../components/chats/globalChat';
import InterdepartmentChat from '../../components/chats/interdepartmentChat';
import Grid from '@mui/material/Grid';
import LanguageIcon from '@mui/icons-material/Language';
import PeopleIcon from '@mui/icons-material/People'
import styles from './styles/chatPage.module.css'
import SideBar from '../../components/chats/SideBar';
import { useUser } from '../../lib/userContext';
import { useRouter } from 'next/router';
export default function ChatPage(){
  const [tab, setTab] = useState(0);
  const [selectedRole, setSelectedRole] = useState();
  const {user} = useUser();
  const router= useRouter();
  const handleRoleClick = (role) => {
    console.log(role);
    setSelectedRole(role);
  };

  useEffect(()=> {
    console.log(user?.role)
    if(user?.role === undefined){
      router.push('/auth/login');
    }
  }, [])

  return (
    <div className={styles.allContainer}>
      <SideBar setTab={setTab} onDepartmentClick={handleRoleClick}/>
      <div 
      className={styles.chatContainer} 
      style={{  backgroundColor: '#f5f5f5', minHeight: '300px', width:'70vw'}}>
        {
          tab === 0 && (
            <GlobalChat/>
          )
        }
        {
          tab === 1 && (
            <InterdepartmentChat selectedRole={selectedRole}/>
          )
        }
      </div>
    </div>
  );
};

