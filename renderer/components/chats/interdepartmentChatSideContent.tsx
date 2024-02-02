import React, { useEffect } from 'react';
import styles from '../../pages/chat/styles/chatPage.module.css'
import Loading from '../Loading/Loading';
import ChatItemList from './ChatItemList';
import { useUser } from '../../lib/userContext';

const InterdepartmentChatSideContent = ({title, data, onDepartmentClick}) => {
  const { user } = useUser();
  const filteredData = data.filter(item => item !== user.role);
  if (!data) {
    return <Loading />;
  }
  
  useEffect(() => {
    if (filteredData && filteredData.length > 0) {
      onDepartmentClick(filteredData[0]);
    }
  }, []);
  

  return (
    <div className={styles.interdepartmentChatContainer}>
      <h2>{title}</h2>
      {

        filteredData.map((item, index) => (
          <ChatItemList key={index} item={item} onDepartmentClick={onDepartmentClick}/>
        ))
      }
    </div>
  );
};

export default InterdepartmentChatSideContent;
