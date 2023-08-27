import { Grid, Box, Button, Radio } from '@mui/material'
import AppDropzone from 'app/components/AppDropzone'
import AppTextInput from 'app/components/AppTextInput'
import { DndList } from 'app/components/DndList'
import { useDndList } from 'app/hooks/useDndList'
import Render from 'app/layout/Render'
import { Configurable } from 'app/models/product'
import { Control, FieldValues } from 'react-hook-form'

interface Props {
  config: Configurable
  control: Control<FieldValues, any>
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
  const watchFiles = watch(`${index}.files`, [])
  const {list, onDragEnd} = useDndList({images: config.images, watchFiles: watchFiles, control: control, name: `${index}.order`})

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
      <Grid item xs={2} sm={3} sx={{display: 'flex', flexDirection: 'row'}}>
        <DndList name={`${index}.files`} small onDragEnd={onDragEnd} control={control} list={list} />
      </Grid>
    </Grid>
  )
}
