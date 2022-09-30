import React from 'react';
import { FormControl, InputLabel, MenuItem } from '@mui/material';
import Select, { SelectChangeEvent } from '@mui/material/Select';

interface RoomsFilterSelectProps {
  value: string;
  label: string;
  options: [];
  selectChangeEvent: (SelectChangeEvent: any) => void;
}

export const RoomsFilterSelect: React.FC<RoomsFilterSelectProps> = ({ value, label, options, selectChangeEvent }) => {
  return (
    <>
      <FormControl fullWidth>
        <InputLabel>{label}</InputLabel>
        <Select value={value} label={label} onChange={selectChangeEvent}>
          <MenuItem value="">
            <em>{ label }</em>
          </MenuItem>

          {options && options.constructor === Array &&
            options.map((item: any, index) => (
              <MenuItem value={item.value} key={index}>
                {item.title}
              </MenuItem>
            ))}
        </Select>
      </FormControl>
    </>
  );
};
