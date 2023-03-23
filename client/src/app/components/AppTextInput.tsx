import { TextField } from '@mui/material';
import * as React from 'react';
import { useController, UseControllerProps } from 'react-hook-form';

interface Props extends UseControllerProps {
    label: string
    multiline?: boolean
    disabled?: boolean
    rows?: number
    type?: string
    defaultValue?: string | number
    addError?: boolean
}

export default function AppTextInput(props: Props) {
    const {fieldState, field} = useController({
        ...props, 
        defaultValue: props.defaultValue || ''
    })

    return (
        <TextField
      label={props.label}
      disabled={props.disabled}
      {...field}
      multiline={props.multiline}
      rows={props.rows}
      type={props.type}
      fullWidth
      variant="outlined"
      error={!!fieldState.error || props.addError}
      helperText={fieldState.error?.message}
      sx={{
        "& .MuiOutlinedInput-notchedOutline": {
          borderColor: props.disabled ? "green !important" : '',
        },
      }}
    />
    )
}