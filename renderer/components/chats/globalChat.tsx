import Avatar from "@mui/material/Avatar";
import GlobeIcon from "@mui/icons-material/Public";
import { Typography, TextField, Button, IconButton, Menu, MenuItem, Popover } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import SendIcon from "@mui/icons-material/Send";
import { useUser } from "../../lib/userContext";
import { auth, db } from "../../../firebase/firebase-config";
import { doc, addDoc, collection, onSnapshot, updateDoc, deleteDoc } from "firebase/firestore";
import Singleton from "../../lib/singleton";
import { Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import { useRouter } from "next/router";


export default function GlobalChat() {
  const user = useUser();
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");  
  const [message, setMessage] = useState("");
  const [editedMessage, setEditedMessage] = useState("");
  const [chat, setChat] = useState<GlobalChat[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedChat, setSelectedChat] = useState(null);
  const endRef = useRef(null);
  const router= useRouter();

  if(!user|| user?.user?.role === ''){
    router.push('/auth/login');
  }

  const isUser = (role, id) => {

    return role === user?.user?.role || id === user?.user?.id;
  };

  useEffect(() => {
    endRef.current?.scrollIntoView({ behaviour: "smooth" });
  }, [message]);
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "globalChats"),
      (snapshot) => {
        const updatedChats: GlobalChat[] = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            text: data.text,
            senderID: data.senderID,
            createdAt: data.createdAt.toDate(),
            role: data.role,
          };
        });

        setChat(updatedChats);
      }
    );

    return () => unsubscribe();
  }, []);

  function formatTimestamp(timestamp: Date): string {
    const options: Intl.DateTimeFormatOptions = {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    };

    return new Intl.DateTimeFormat("en-US", options).format(timestamp);
  }

  const handleSendMessage = async () => {
    if (message.trim() === "" || isSending) return;

    setIsSending(true);
    const currentDate = new Date();
    const newChat = {
      text: message,
      senderID: auth.currentUser.uid,
      createdAt: currentDate,
      role: user.user.role,
    };

    try {
      const doc = collection(db, "globalChats");
      const docRef = await addDoc(doc, newChat);
    } catch (error) {
      console.error("Error adding document: ", error);
    }

    setMessage("");
    setIsSending(false);
  };

  const sortedChat = [...chat].sort(
    (a, b) => (a.createdAt as any) - (b.createdAt as any)
  );

  const handleEnter = (e) => {
    if (e.key == "Enter") {
      handleSendMessage();
    }
  }

  const handleChatDoubleClick = (selectedChat) => (event) => {
    console.log(selectedChat);
    setAnchorEl(event.currentTarget);
    setSelectedChat(selectedChat);
    setEditedMessage(selectedChat.text);
  };
  

  const handleClosePopover = () => {
    setAnchorEl(null);
    setSelectedChat(null);
  };

  const handleUpdate = async () => {
  
    if (!selectedChat || !editedMessage.trim()) {
      return;
    }

    try {
      const chatRef = doc(db, "globalChats", selectedChat.id);
      await updateDoc(chatRef, { text: editedMessage });
      handleClosePopover();
      handleCloseDialog();
    } catch (error) {
      console.error("Error updating message:", error);
    }
  };

  const handleDelete = async () => {
    if (!selectedChat) {
      return;
    }

    try {
      const chatRef = doc(db, "globalChats", selectedChat.id);
      await deleteDoc(chatRef);
      handleClosePopover();
    } catch (error) {
      console.error("Error deleting message:", error);
    }
  };

  const handleCloseDialog = () => {
    setAnchorEl(null);
    setSelectedChat(null);
    setEditedMessage("");
    setOpenDialog(false);
  };

  const open = Boolean(anchorEl);
  const popoverId = open ? "simple-popover" : undefined;

  return (
    <div style={{ width: "80vw" }}>
      <div
        style={{
          borderBottom: "0.5px solid gray",
          height: "10.4vh",
          backgroundColor: "rgb(35, 48, 68)",
          alignItems: "center",
          display: "flex",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Avatar
            sx={{
              backgroundColor: "whitesmoke",
              height: "3rem",
              width: "3rem",
              color: "black",
              marginInline: "0.8rem",
            }}
          >
            <GlobeIcon />
          </Avatar>
          <Typography color="whitesmoke" variant="h6">
            Global Chats
          </Typography>
        </div>
      </div>

      <div style={{ height: "80vh", overflowY: "auto", padding: "1rem" }}>
        {sortedChat.map((chat, index) => (
          <div key={index} style={{ paddingBlock: "0.4rem" }}>
            <div>
              <Typography
                color="gray"
                style={{
                  textAlign: isUser(chat.role, chat.senderID)
                    ? "right"
                    : "left",
                }}
              >
                {isUser(chat.role, chat.senderID) ? (
                  <span>Your department</span>
                ) : (
                  <span>{chat.role}</span>
                )}
              </Typography>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: isUser(chat.role, chat.senderID)
                  ? "row-reverse"
                  : "row",
                marginBottom: "0.5rem",
                
              }}
              onDoubleClick={isUser(chat.role, chat.senderID) ? handleChatDoubleClick(chat) : null}
            >
              <div
                style={{
                  textAlign: isUser(chat.role, chat.senderID)
                    ? "right"
                    : "left",
                }}
              >
                <Typography
                  color="black"
                  style={{
                    backgroundColor: isUser(chat.role, chat.senderID)
                      ? "rgb(35, 48, 68)"
                      : "#B59410",
                    padding: "0.5rem",
                    borderRadius: "8px",
                    display: "inline-block",
                    width: "fit-content",
                    wordBreak: "break-word",
                    color: "whitesmoke",
                  }}
                >
                  {chat.text}
                </Typography>
              </div>
              <div
                style={{
                  marginInline: "0.4rem",
                  alignSelf: "flex-end",
                  color: "gray",
                }}
              >
                {formatTimestamp(chat.createdAt)}
              </div>
              <Popover
                id={popoverId}
                open={open}
                anchorEl={anchorEl}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}

                sx={{marginLeft:'90vh'}}
              >
                <Menu
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleClosePopover}
                  sx={{marginLeft:'90vh'}}
                >
                  <MenuItem onClick={() => setOpenDialog(true)}>Update</MenuItem>
                  <MenuItem onClick={handleDelete}>Delete</MenuItem>
                </Menu>
              </Popover>
            </div>
          </div>
        ))}

        <div ref={endRef}></div>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginTop: "1rem",
          paddingInline: "1rem",
        }}
      >
        <TextField
          variant="outlined"
          size="small"
          fullWidth
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleEnter}
          InputProps={{
            style: {
              borderRadius: "10rem",
            },
          }}
          placeholder="Type message"
          disabled={!Singleton.getInstance().getGlobalRoles()?.includes(user?.user?.role)}
        />
        <IconButton
          color="primary"
          onClick={(e) => {
            handleSendMessage();
          }}
          style={{ marginLeft: "0.5rem" }}
        >
          <SendIcon />
        </IconButton>
      </div>


      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Edit Message</DialogTitle>
        <DialogContent>
          <TextField
            multiline
            fullWidth
            rows={3}
            variant="outlined"
            value={editedMessage}
            onChange={(e) => setEditedMessage(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleUpdate}>Update</Button>
        </DialogActions>
      </Dialog>

    </div>
  );
}
