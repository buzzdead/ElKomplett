
import { FormControl, FormControlLabel, } from '@mui/material'
import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';

interface Props {
  options: any[]
  label: string
  onChange: (event: any) => void
  selectedValue: string
  flexDirection?: 'row' | 'column'
}

export default function SelectButtonGroup({ options, onChange, selectedValue, flexDirection = 'row', label }: Props) {
  return (
    <FormControl>
      <InputLabel id="demo-simple-select-label">{label}</InputLabel>
        <Select
        value={selectedValue}
        label={label}
        onChange={onChange}
      sx={{
        width: 120,
        height: 50
      }}
    >
        
        {options.map(({ value, label }) => (
          <MenuItem key={value} value={value}>{label}</MenuItem>
        ))}
    </Select>
      
    </FormControl>
  )
}
