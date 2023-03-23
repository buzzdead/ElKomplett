import { LoadingButton } from '@mui/lab'
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'
import agent from 'app/api/agent'
import AppTextInput from 'app/components/AppTextInput'
import { useAppDispatch } from 'app/store/configureStore'
import { useEffect, useState } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { setConfigPresetComposition } from '../configSlice'

interface Props {
  open: boolean
  handleClosePresetDialog: () => void
}

export default function ConfigPresetDialog(props: Props) {
  const { control, handleSubmit, reset } = useForm({})
  const { fields, append, remove } = useFieldArray({ control, name: 'configurations' })
  const [loading, setLoading ] = useState(false)
  const dispatch = useAppDispatch()

  const handleSave = async (data: any) => {
    setLoading(true)
    const res = await agent.Admin.createConfigPresetComposition({key: data.key, configPresets: data.configurations})
    dispatch(setConfigPresetComposition(res))
    setLoading(false)
 } 

 useEffect(() => {
  if(loading === false && fields.length > 0){
    reset()
    fields.forEach((field, id) => remove(id))}
 }, [loading])
 
  return (
    <Dialog fullWidth maxWidth='sm' open={props.open}>
      <DialogTitle textAlign='center' color='blue' fontSize={24}>
        Enter key and values for new Preset
      </DialogTitle>
      <DialogContent>
        <Box py={2}>
          <AppTextInput control={control} label='Key' name='key' />
        </Box>
        {fields.map((field, index) => (
          <Box key={field.id} display='flex' alignItems='center' mt={2}>
            <Box flex={1}>
              <AppTextInput control={control} label={`Value ${index + 1}`} name={`configurations[${index}].value`} />
            </Box>
            <Box ml={2}>
              <Button variant='outlined' color='secondary' onClick={() => remove(index)}>Remove</Button>
            </Box>
          </Box>
        ))}
        <Box mt={2}>
          <Button variant='outlined' color='success' onClick={() => append({ value: '' })}>Add Value</Button>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={props.handleClosePresetDialog}>Cancel</Button>
        <LoadingButton loading={loading} variant='contained' color='primary' onClick={handleSubmit(handleSave)}>Save</LoadingButton>
      </DialogActions>
    </Dialog>
  )
}
