import { Avatar, Typography, TextField, IconButton } from "@mui/material";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useEffect, useRef, useState } from 'react';
import SendIcon from '@mui/icons-material/Send';
import { useUser } from "../../lib/userContext";
import { Timestamp, addDoc, collection, doc, onSnapshot, orderBy, query, runTransaction, serverTimestamp, where } from "firebase/firestore";
import { db } from "../../../firebase/firebase-config";


export default function interdepartmentChat({ selectedRole }){
  const user = useUser();

  const [message, setMessage] = useState('');
  const [chat, setChat] = useState<InterdepartmentChat>();
  const [isSending, setIsSending] = useState(false);
  const endRef = useRef(null);

  const isUser = (role) => {
    return (role === user?.user.role)
  }

  function formatTimestamp(timestamps): string {
    if (!timestamps) {
      return ''; 
    }
    const date = timestamps.toDate()

    const options: Intl.DateTimeFormatOptions = {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    };
  
    return new Intl.DateTimeFormat('en-US', options).format(date);
  }
  
  useEffect(() => {
    endRef.current?.scrollIntoView({behaviour: "smooth"});
  }, [message])
  useEffect(() => {
    const chatRef = collection(db, 'interdepartmentChats');
  
    const q1 = query(
      chatRef,
      where('senderRole', 'array-contains', selectedRole || '')
    );
  
    const unsubscribe = onSnapshot(q1, (snapshot) => {
      let updatedChat: InterdepartmentChat;
  
      snapshot.forEach((doc) => {
        const chatData = doc.data() as InterdepartmentChat;
      
        if (chatData && chatData.senderRole.includes(selectedRole) && chatData.senderRole.includes(user?.user.role)) {
          updatedChat = chatData;
        }
      });      

      setChat(updatedChat as InterdepartmentChat);
    });

    return () => unsubscribe();
    
  }, [selectedRole, user?.user.role]);
  
  const handleSendMessage = async () => {
    if (message.trim() === '' || isSending) return;

    setIsSending(true);
    const newMessage: Message = {
      content: message,
      senderRole: user?.user.role || '',
      time: new Date(),
    };

    const chatRef = collection(db, 'interdepartmentChats');
    const userRoles = [user?.user.role, selectedRole].sort(); 
    const chatDocRef = doc(chatRef, userRoles.join('-'));

    try {
      await runTransaction(db, async (transaction) => {
        const chatDoc = await transaction.get(chatDocRef);

        if (!chatDoc.exists()) {
          transaction.set(chatDocRef, {
            senderRole: userRoles,
            message: [newMessage],
          });
        } else {
          const chatData = chatDoc.data() as InterdepartmentChat;
          transaction.update(chatDocRef, {
            message: [...chatData.message, newMessage],
          });
        }
      });

      console.log('Message sent successfully!');
    } catch (error) {
      console.error('Error sending message: ', error);
    }

    setMessage('');
    setIsSending(false);
  };


  return(
    <div style={{ width: '80vw' }}>
      <div
        style={{
          borderBottom: '0.5px solid gray',
          height: '10.4vh',
          backgroundColor: 'rgb(35, 48, 68)',
          alignItems: 'center',
          display: 'flex',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
          <Avatar
            sx={{ backgroundColor: 'whitesmoke', height: '3rem', width: '3rem', color: 'black', marginInline: '0.8rem' }}
          >
            <AccountCircleIcon />
          </Avatar>
          <Typography color="whitesmoke" variant="h6">
            {selectedRole}
          </Typography>
        </div>
      </div>

      <div style={{ height: '80vh', overflowY: 'auto', padding: '1rem' }}>
        {chat?.message.map((chatItem, index) => (
          <div key={index} style={{ paddingBlock: '0.4rem' }}>
            <div>
              <Typography 
                color="gray"
                style={{
                  textAlign: isUser(chatItem.senderRole) ? 'right' : 'left'
                }}
              >
                {isUser(chatItem.senderRole) ? (
                  <span>Your department</span>
                ) : (
                  <span>{chatItem.senderRole}</span>
                )}
              </Typography>
            </div>
            <div
              style={{
                display: 'flex',
                flexDirection: isUser(chatItem.senderRole) ? 'row-reverse' : 'row',
                marginBottom: '0.5rem',
              }}
            >
              <div style={{ textAlign: isUser(chatItem.senderRole) ? 'right' : 'left' }}>
                <Typography
                  color="black"
                  style={{
                    backgroundColor: isUser(chatItem.senderRole) ? 'rgb(35, 48, 68)' : '#B59410',
                    padding: '0.5rem',
                    borderRadius: '8px',
                    display: 'inline-block',
                    width: 'fit-content',
                    wordBreak: 'break-word',
                    color:'whitesmoke'
                  }}
                >
                  {chatItem.content}
                </Typography>
              </div>
              <div style={{ marginInline:'0.4rem', alignSelf: 'flex-end', color: 'gray' }}>
                {formatTimestamp(chatItem.time)}
              </div>
            </div>
          </div>
        ))}

        <div ref={endRef}></div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', marginTop: '1rem', paddingInline:'1rem' }}>
        <TextField
          variant="outlined"
          size="small"
          fullWidth
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          InputProps={{
            style: {
              borderRadius: "10rem",
            }
          }}
          placeholder='Type message'
        />
       <IconButton color="primary" onClick={handleSendMessage} style={{ marginLeft: '0.5rem'}}>
          <SendIcon />
        </IconButton>
      </div>
    </div>
  );
}