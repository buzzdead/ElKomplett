import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Typography,
  DialogActions,
  Button,
  Grid,
} from '@mui/material'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import agent from '../../app/api/agent'
import AppTextInput from '../../app/components/AppTextInput'
import Render from '../../app/layout/Render'
import ConfigPreset from './ConfigPreset'

interface Props {
  handleConfigSubmit: (values: number, key: string, n?: IConfigPresetComposition[]) => void
}
interface IConfiguration {key: string, value: string}
export interface IConfigPresetComposition {
  id: number
  key: string
  configurations: IConfiguration[]
}

export default function ConfigDialog({ handleConfigSubmit }: Props) {
  const [addingConfig, setAddingConfig] = useState(false)
  const { control } = useForm({})
  const [multipleKeys, setMultipleKeys] = useState(false)
  const [configPresets, setConfigPresets] = useState<IConfigPresetComposition[]>([])
  const [checkedConfigPreset, setCheckedConfigPreset] = useState<IConfigPresetComposition[]>([])

  const handleCloseModal = () => {
    if(multipleKeys) {
      const key2 = checkedConfigPreset.map(e => e.key).join(", ")
      //pass checkedConfigPreset, take values from it, take composition from it. add composition to product as Dto.
      const values = checkedConfigPreset.map(e => e.configurations.map(e2 => e2.value))
      const totalLength = values.reduce((acc, curr) => acc.concat(curr)).length;
      setAddingConfig(false)
      handleConfigSubmit(totalLength, key2, checkedConfigPreset)
      return
    }
    if (!control._fields['configKey']?._f.value) alert('Must enter value')
    else {
      const numberOfValues = getFieldValue('numberOfValues')
      const key = getFieldValue('configKey')
      setAddingConfig(false)
      handleConfigSubmit(numberOfValues, key)
    }
  }
  useEffect(() => {
    if (multipleKeys) agent.Admin.getConfigPresets().then((res) => setConfigPresets(res))
  }, [multipleKeys])

  const getFieldValue = (fieldValue: any) => {
    return control._fields[fieldValue]?._f.value
  }
  const handleOnChange = (configPreset: IConfigPresetComposition) => {
    const newCheckedConfigPreset = checkedConfigPreset.filter(e => e.key !== configPreset.key)
    newCheckedConfigPreset.push(configPreset)
    setCheckedConfigPreset(newCheckedConfigPreset)

  }
  console.log(checkedConfigPreset)
  if (addingConfig) {
    return (
      <>
        <Dialog fullWidth maxWidth='sm' open={addingConfig}>
          <DialogTitle textAlign={'center'} color='blue' fontSize={24}>
            Configure the product
          </DialogTitle>
          <DialogContent>
            <Render condition={multipleKeys}>
              <Box padding={2} sx={{display: 'flex', gap: 2, flexDirection: 'column'}}>
              <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
              <ConfigPreset onChange={handleOnChange} label='Preset 1' items={configPresets}/>
              </Grid>
              <Grid item xs={12} sm={6}>
              <ConfigPreset onChange={handleOnChange} label='Preset 2' items={configPresets}/>
              </Grid>
              </Grid>
              </Box> 
              <>
                <Box paddingBottom={2}>
                  <Typography variant='subtitle2' color='CaptionText' padding={1}>
                    Enter the key, i.e "Color" or "Size"
                  </Typography>
                  <AppTextInput control={control} label={'Config key'} name={'configKey'} />
                </Box>
                <Box paddingBottom={2}>
                  <AppTextInput
                    type='number'
                    control={control}
                    defaultValue={'1'}
                    label={'Number of configurations'}
                    name={'numberOfValues'}
                  />
                </Box>
              </>
            </Render>
          </DialogContent>
          <DialogActions>
            <Button disabled={multipleKeys} onClick={() => setMultipleKeys(true)}>Add key</Button>
            <Button onClick={handleCloseModal}>Save config</Button>
          </DialogActions>
        </Dialog>
      </>
    )
  }
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        alignContent: 'center',
        textAlign: 'center',
        alignItems: 'center',
      }}
    >
      <Typography>No configuration found</Typography>
      <Button onClick={() => setAddingConfig(true)} variant='outlined' color='secondary'>
        Add new configuration
      </Button>
    </Box>
  )
}