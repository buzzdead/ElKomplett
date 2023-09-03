import { FormControl, InputLabel, Select, MenuItem, FormHelperText } from '@mui/material'
import * as React from 'react'
import { useController, UseControllerProps } from 'react-hook-form'

interface Props extends UseControllerProps {
    label: string
    items: string[]
    dValue?: string
}

export default function AppSelectList(props: Props) {
    const {fieldState, field} = useController({...props, defaultValue: props.defaultValue || ''})
  return (
    <FormControl fullWidth error={!!fieldState.error}>
      <InputLabel>{props.label}</InputLabel>
      <Select
        value={props.dValue !== undefined && typeof field.value === 'number' || field.value === 0 ? props.dValue : field.value}
        label={props.label}
        onChange={field.onChange}
      >
        {props.items?.map((item, index) => (
            <MenuItem key={index} value={item}>{item}</MenuItem>
        ))}
      </Select>
      <FormHelperText>{fieldState.error?.message}</FormHelperText>
    </FormControl>
  )
}
