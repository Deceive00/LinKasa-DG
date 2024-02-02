import React, { useEffect, useState } from 'react';
import SideBar from './SideBar';
import styles from '../../pages/chat/styles/chatPage.module.css'
import Singleton from '../../lib/singleton';

const GlobalChatSideContent = () => {
  const [roles, setRoles] = useState<string[]>([]);

  useEffect(() => {
    const rolesInstance = Singleton.getInstance();
    const rolesData = rolesInstance.getRoles();
    setRoles(rolesData);
  }, []);
  
  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    backgroundColor: 'whitesmoke', 
    padding: '20px',
  };

  const headingStyle: React.CSSProperties = {
    fontSize: '1.2rem',
    marginBottom: '10px',
  };

  const listStyle: React.CSSProperties = {
    listStyleType: 'none',
    padding: '0',
    margin: '0',
  };

  const listItemStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    padding: '10px',
    borderRadius: '8px',
    marginBottom: '8px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  };

  const listItemHoverStyle: React.CSSProperties = {
    backgroundColor: '#e2e2e2',
  };

  return (
    <div className={styles.globalChatContainer}>
      <div style={containerStyle}>
        <h2 style={headingStyle}>Members</h2>
        <ul style={listStyle}>
          {roles?.map((role, index) => (
            <li key={index} style={listItemStyle}>{role}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default GlobalChatSideContent;
