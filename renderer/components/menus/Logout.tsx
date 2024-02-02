import { List, ListItem, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import React from "react";

export default function Logout({handleLogout} : {handleLogout:any}){
  return(
    <List>
    <ListItem disablePadding>
      <ListItemButton
        onClick={handleLogout}
        sx={{
          minHeight: 48,
          justifyContent: 'initial',
          px: 2.5,
        }}
      >
        <ListItemIcon
          sx={{
            minWidth: 0,
            mr: 3,
            justifyContent: 'center',
            color: '#cc0000'
          }}
        >
          <ExitToAppIcon />
        </ListItemIcon>
        <ListItemText primary={"Sign Out"} sx={{ opacity: 1, color: '#cc0000' }} />
      </ListItemButton>
    </ListItem>
  </List>
  );
}