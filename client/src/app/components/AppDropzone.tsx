import { UploadFile } from '@mui/icons-material'
import { FormControl, FormHelperText } from '@mui/material'
import React, {useCallback} from 'react'
import {useDropzone} from 'react-dropzone'
import { useController, UseControllerProps } from 'react-hook-form'

interface Props extends UseControllerProps {
  height?: number
  width?: number
  iconSize?: string
  defaultValue?: any
  singular?: boolean
}

export default function AppDropzone(props: Props) {
    const {fieldState, field} = useController({...props, defaultValue: null })

    const dzStyles = {
        display: 'flex',
        border: 'dashed 3px #eee',
        borderColor: '#eee',
        borderRadius: '5px',
        alignItems: 'center',
        justifyContent: 'center',
        height: props.height || 200,
        width: props.width || 500,
    }

    const dzActive = {
        borderColor: 'green'
    }

    const onDrop = useCallback((acceptedFiles: any[]) => {
      if(props.singular) { acceptedFiles[0] = Object.assign(acceptedFiles[0], 
        {preview: URL.createObjectURL(acceptedFiles[0])})
    field.onChange(acceptedFiles[0])
      }
      else {
      const updatedFiles = acceptedFiles.map(file => (
        Object.assign(file, {preview: URL.createObjectURL(file)})
      ));
      field.onChange([...(field.value || []), ...updatedFiles]);
      }
    }, [field]);
  const {getRootProps, getInputProps, isDragActive, isFileDialogActive} = useDropzone({onDrop})

  return (
    <div {...getRootProps()} >
     <FormControl style={isDragActive || isFileDialogActive ? {...dzStyles, ...dzActive} : dzStyles}>
        <input {...getInputProps()} />
        <UploadFile sx={{fontSize: props.iconSize || '100px'}} />
        <FormHelperText>{fieldState.error?.message}</FormHelperText>
     </FormControl>
    </div>
  )
}