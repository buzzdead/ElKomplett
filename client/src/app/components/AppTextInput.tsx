import { Visibility, VisibilityOff } from '@mui/icons-material'
import { IconButton, InputAdornment, TextField } from '@mui/material'
import * as React from 'react'
import { useController, UseControllerProps } from 'react-hook-form'

interface Props extends UseControllerProps {
  label: string
  multiline?: boolean
  disabled?: boolean
  rows?: number
  type?: string
  defaultValue?: string | number
  autoComplete?: string
  addError?: boolean
}

export default function AppTextInput(props: Props) {
  const [showPassword, setShowPassword] = React.useState(false)
  const { fieldState, field } = useController({
    ...props,
    defaultValue: props.defaultValue || '',
  })

  return (
    <TextField
      label={props.label}
      disabled={props.disabled}
      {...field}
      autoComplete={props.autoComplete ?? 'on'}
      multiline={props.multiline}
      rows={props.rows}
      type={props.type === "password" ? showPassword ? '-' : props.type : props.type}
      InputProps={{
        endAdornment: props.type === 'password' ? (
          <InputAdornment position="end">
            <IconButton
              aria-label="toggle password visibility"
              onClick={() => setShowPassword(!showPassword)}
              edge="end"
            >
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        ) : null,
      }}
      fullWidth
      variant='outlined'
      error={!!fieldState.error || props.addError}
      helperText={fieldState.error?.message}
      sx={{
        '& .MuiOutlinedInput-notchedOutline': {
          borderColor: props.disabled ? 'green !important' : '',
        },
      }}
    />
  )
}
