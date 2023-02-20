import { FormControl, RadioGroup, FormControlLabel, Radio } from '@mui/material'
import React from 'react'

interface Props {
  options: any[]
  onChange: (event: any) => void
  selectedValue: string
  flexDirection?: 'row' | 'column'
}

export default function RadioButtonGroup({ options, onChange, selectedValue, flexDirection = 'row' }: Props) {
  return (
    <FormControl>
      <RadioGroup onChange={onChange} value={selectedValue} sx={{display: 'flex', flexDirection: flexDirection}}>
        {options.map(({ value, label }) => (
          <FormControlLabel value={value} control={<Radio />} label={label} key={value} />
        ))}
      </RadioGroup>
    </FormControl>
  )
}
