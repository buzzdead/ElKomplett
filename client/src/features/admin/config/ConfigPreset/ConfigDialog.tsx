import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Typography,
  DialogActions,
  Button,
  Grid,
  styled,
} from '@mui/material'
import { useConfig } from 'app/hooks/useConfig'
import { getCombinations } from 'app/util/util'
import { useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import AppTextInput from '../../../../app/components/AppTextInput'
import Render from '../../../../app/layout/Render'
import ConfigPreset from './ConfigPreset'
import ConfigPresetDialog from './ConfigPresetDialog'
import CloseIcon from '@mui/icons-material/Close'
import { LoadingButton } from '@mui/lab'

interface Props {
  handleConfigSubmit: (
    key: string,
    configPresetCompositions?: IConfigPresetComposition[],
    combinations?: string[],
  ) => void
}
interface IConfiguration {
  key: string
  value: string
}
export interface IConfigPresetComposition {
  id: number
  key: string
  configurations: IConfiguration[]
}
const CloseButtonContainer = styled(Box)({
  position: 'absolute',
  top: 8,
  right: 8,
})

export default function ConfigDialog({ handleConfigSubmit }: Props) {
  const [configDialogOpen, setConfigDialogOpen] = useState(false)
  const [configPresetDialogOpen, setConfigPresetDialogOpen] = useState(false)
  const [multipleKeys, setMultipleKeys] = useState(false)
  const [empty, setIsEmpty] = useState(true)
  const preset1 = useRef<IConfigPresetComposition>()
  const preset2 = useRef<IConfigPresetComposition>()

  const { control, getValues, watch } = useForm({})
  const { configPresets, configsLoaded } = useConfig(multipleKeys)

  const watchConfigKey = watch('configKey')
  const watchNumberOfValues = watch('numberOfValues')

  const handleSingleKeySubmit = () => {
    if (!control._fields['configKey']?._f.value) alert('Must enter value')
    else {
      const numberOfValues = getFieldValue('numberOfValues')
      const key = getFieldValue('configKey')
      setConfigDialogOpen(false)
      handleConfigSubmit(key, [], Array(parseInt(numberOfValues)).fill(''))
    }
  }

  const getKeysAndValuesFromPresets = (configPresetCompositions: IConfigPresetComposition[]) => {
    const keys = configPresetCompositions.map((preset) => preset.key).join(', ')
    const values = configPresetCompositions.map((preset) =>
      preset.configurations.map((configuration) => configuration.value),
    )
    return { keys, values }
  }

  const handleMultipleKeysSubmit = () => {
    if(!preset1.current || !preset2.current) return
    const newCheckedConfigPresets = [preset1.current, preset2.current]
    const { keys, values } = getKeysAndValuesFromPresets(newCheckedConfigPresets)
    setConfigDialogOpen(false)
    const combinations = getCombinations(values)
    handleConfigSubmit(keys, newCheckedConfigPresets, combinations)
  }

  const handleCloseModal = () => {
    if (multipleKeys) {
      handleMultipleKeysSubmit()
    } else {
      handleSingleKeySubmit()
    }
  }

  const getFieldValue = (fieldValue: any) => {
    return getValues(fieldValue)
  }

  const handleOnChange = (type: "Preset1" | "Preset2", preset: IConfigPresetComposition) => {
    type === "Preset1" ? preset1.current = preset : preset2.current = preset
    if(!preset1 || !preset2 || (preset1?.current?.configurations.length === 0 && preset2?.current?.configurations.length === 0)) setIsEmpty(true)
    else setIsEmpty(false)
  }


  if (configDialogOpen) {
    return (
      <>
        <Render condition={!configPresetDialogOpen}>
          <Dialog fullWidth maxWidth='sm' open={configDialogOpen}>
            <CloseButtonContainer>
              <Button
                sx={{
                  minWidth: 'initial',
                  padding: 1,
                  zIndex: 1,
                  '&:hover': {
                    backgroundColor: 'transparent',
                  },
                }}
                color='primary'
                onClick={() => setConfigDialogOpen(false)}
              >
                <CloseIcon sx={{ color: '#757575', ':hover': {
                    color: 'blue',
                  }, }}/>
              </Button>
            </CloseButtonContainer>
            <DialogTitle marginTop={2} textAlign={'center'} color='blue' fontSize={24}>
              Configure the product
            </DialogTitle>
            <DialogContent>
              <Render condition={multipleKeys && configsLoaded}>
                <Box padding={2} sx={{ display: 'flex', gap: 2, flexDirection: 'column' }}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <ConfigPreset
                        onChange={(configPreset) => handleOnChange("Preset1", configPreset)}
                        label='Preset 1'
                        items={configPresets!}
                        loading={!configsLoaded}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <ConfigPreset
                        onChange={(configPreset) => handleOnChange("Preset2", configPreset)}
                        label='Preset 2'
                        items={configPresets!}
                        loading={!configsLoaded}
                      />
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
              <Render condition={multipleKeys}>
                <Button
                  onClick={() => setConfigPresetDialogOpen(true)}
                  sx={{ display: 'flex', marginRight: 'auto', marginLeft: 5}}
                >
                  Add Preset
                </Button>
              </Render>
              <Button color={multipleKeys ? 'secondary' : 'primary'} onClick={() => setMultipleKeys(!multipleKeys)}>
                {multipleKeys ? 'Remove Key' : 'Add key'}
              </Button>
              <LoadingButton
              loading={false}
                disabled={
                  multipleKeys
                    ? empty
                    : !(watchConfigKey && watchNumberOfValues)
                }
                sx={{ display: 'flex', marginLeft: 'auto', marginRight: 5 }}
                onClick={handleCloseModal}
              >
                Generate
              </LoadingButton>
            </DialogActions>
          </Dialog>
          <ConfigPresetDialog
            open={configPresetDialogOpen}
            handleClosePresetDialog={() => setConfigPresetDialogOpen(false)}
          />
        </Render>
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
      <Button onClick={() => setConfigDialogOpen(true)} variant='contained' color='primary'>
        Add new configuration
      </Button>
    </Box>
  )
}
