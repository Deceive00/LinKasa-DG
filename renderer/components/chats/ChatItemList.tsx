import Link from "../Link";
import styles from '../../pages/chat/styles/chatPage.module.css'
import { Avatar, Button, Typography } from "@mui/material";

export default function ChatItemList({item, onDepartmentClick}){
  const handleChangeChat = () => {
    onDepartmentClick(item);
  
  }
  return (
    <Button className={styles.link} onClick={ handleChangeChat }>
      <div className={styles.sidebarChat}>
        <div className={styles.avatarContainer}>
          <Avatar 
            // src = {item}
          />
        </div>
        <div className={styles.sidebarChatInfo}>
          <Typography >{item}</Typography>
        </div>
      </div>
    </Button>
  );
}