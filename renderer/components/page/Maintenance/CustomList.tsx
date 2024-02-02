// CustomListBox.tsx

import * as React from 'react';
import FormControl, { FormControlProps } from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import ListItemText from '@mui/material/ListItemText';


const CustomList = ({
  label,
  selectedValues,
  onChange,
  options,
  multiple = false,
  ...props
}) => {
  return (
    <FormControl {...props as FormControlProps} sx={{minWidth:'10rem'}}>
      <InputLabel>{label}</InputLabel>
      <Select
        multiple={multiple}
        value={selectedValues}
        onChange={(event) => onChange(event.target.value as string[])} // Use type assertion here
        renderValue={(selected) => (
          <div style={{ display: 'flex', flexWrap: 'wrap' }}>
            {(selected as string[]).map((value) => (
              <div key={value} style={{ margin: '2px' }}>
                {value}
              </div>
            ))}
          </div>
        )}
      >
        {options.map((option) => (
          <MenuItem key={option} value={option}>
            {multiple && (
              <Checkbox checked={selectedValues.indexOf(option) > -1} />
            )}
            <ListItemText primary={option} />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default CustomList;
