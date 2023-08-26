import { Grid, Box, Button, Radio } from '@mui/material'
import AppDropzone from 'app/components/AppDropzone'
import AppTextInput from 'app/components/AppTextInput'
import Render from 'app/layout/Render'
import { Configurable } from 'app/models/product'

interface Props {
  config: Configurable
  control: any
  setValue: any
  watch: any
  index: number
  radioNumber: number
  setRadioNumber: (i: number) => void
  removeConfig: (config: Configurable) => void
}

export default function Config({
  config,
  control,
  watch,
  index,
  removeConfig,
  radioNumber,
  setRadioNumber,
}: Props) {
  const watchFile = watch(`${index}.file`, null)

  const getConfigValue = (value: keyof Configurable, defaultValue?: string): string => {
    return String(defaultValue ?? config?.[value] ?? '')
  }

  return (
    <Grid container spacing={2} sx={{ marginTop: 0.25 }}>
      <Grid
        item
        xs={2}
        sm={1}
        sx={{ display: 'flex', justifyContent: 'center', alignContent: 'center' }}
      >
        <Button variant='text' onClick={() => removeConfig(config)}>
          Del
        </Button>
        <Radio onClick={() => setRadioNumber(index)} checked={radioNumber === index} />
      </Grid>
      {[
        { name: 'id', label: 'Id', type: 'string', disabled: true },
        { name: 'price', label: 'Price', type: 'number' },
        { name: 'quantityInStock', label: 'Quantity in Stock', type: 'number' },
        { name: 'key', label: 'Key', type: 'string' },
        { name: 'value', label: 'Value', type: 'string' },
        { name: 'productId', label: 'Product Id', type: 'string', disabled: true },
      ].map(({ name, label, type, disabled }) => (
        <Grid item xs={12} sm={1.3} key={name}>
          <AppTextInput
            control={control}
            disabled={disabled}
            defaultValue={getConfigValue(name as keyof Configurable)}
            name={`${index}.${name}`}
            label={label}
            type={type}
          />
        </Grid>
      ))}
      <Grid item xs={3} sm={1}>
        <Box display='flex' justifyContent='space-between' alignItems='center' sx={{ gap: 2 }}>
          <AppDropzone
            singular
            height={60}
            width={100}
            iconSize={'30px'}
            control={control}
            name={`${index}.file`}
          />
          <Render condition={(config && config.pictureUrl) || watchFile}>
            <img
              src={getConfigValue('pictureUrl', watchFile?.preview)}
              alt='preview'
              style={{ maxHeight: 50 }}
            />
          </Render>
        </Box>
      </Grid>
    </Grid>
  )
}
