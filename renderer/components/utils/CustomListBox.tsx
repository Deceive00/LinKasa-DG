
import React, { useEffect, useState } from 'react';
import styles from './styles.module.css';
import { TextField } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';

interface CustomListBoxProps {
  onListChange: (newValues: string | string[]) => void;
  id: string;
  initialValues: string[];
}

const CustomListBox: React.FC<CustomListBoxProps> = ({ onListChange, id, initialValues }) => {
  const [values, setValues] = useState<string[]>([]);
  const [currValue, setCurrValue] = useState<string>('');

  const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const newValues = [...values, currValue];
      setValues(newValues);
      setCurrValue('');
      onListChange(newValues); 
    }
  };

  useEffect(() => {
    setValues(initialValues);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrValue(e.target.value);
  };

  const handleDelete = (index: number) => {
    let arr = [...values];
    arr.splice(index, 1);
    setValues(arr);
    onListChange(arr); 
  };

  return (
    <div className={styles.app}>
      <div className={styles.container}>
        {values.map((item, index) => (
          <span key={index} className={styles.chip} onClick={() => handleDelete(index)}>
            {item}
            <ClearIcon fontSize="small" style={{ paddingLeft: '2px', color: 'red' }} />
          </span>
        ))}
      </div>
      <TextField
        fullWidth
        value={currValue}
        id={id}
        label={id}
        onChange={handleChange}
        onKeyDown={handleKeyUp}
        placeholder="Type and press enter to add"
      />
    </div>
  );
};

export default CustomListBox;
