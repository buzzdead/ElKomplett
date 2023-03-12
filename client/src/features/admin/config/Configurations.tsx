import React, { useEffect, useState } from 'react'
import { Box, Button, Grid, Paper, Typography } from '@mui/material'
import { FieldValues, useForm } from 'react-hook-form'
import { LoadingButton } from '@mui/lab'
import AppDropzone from '../../../app/components/AppDropzone'
import AppTextInput from '../../../app/components/AppTextInput'
import agent from '../../../app/api/agent'
import { yupResolver } from '@hookform/resolvers/yup'
import { productConfigurationSchema } from '../productValidation'
import Render from '../../../app/layout/Render'
import { ConfigPreset, Configurable } from '../../../app/models/product'
import ConfigDialog, { IConfigPresetComposition } from './ConfigDialog'
import { handleProductsToAdd } from '../../../app/util/util'

interface Props {
  productId: number
  configs?: Configurable[]
}

const Configurations = ({ productId, configs }: Props) => {
  const [configurations, setConfigurations] = useState<number>(1 + (configs?.length || 0))
  const [configAdded, setConfigAdded] = useState(false)
  const [defaultKey, setDefaultKey] = useState('')
  const [multipleValues, setMultipleValues] = useState<string[]>()
  const { control, handleSubmit, watch } = useForm({
    resolver: yupResolver(productConfigurationSchema(configurations)),
  })
  let watchFiles: Array<any> = []

  for (let i = 0; i < configurations; i += 1) {
    watchFiles[i] = watch(`file${i}`)
  }

  async function handleSubmitData(data: FieldValues) {
    const preset: ConfigPreset = {configPresetKeys: defaultKey.split(','), configPresetValues: multipleValues!}
    const dataArray = handleProductsToAdd(configurations, data, configs!, preset)

    dataArray.forEach(async (array, id) => {
      array.id
        ? agent.Admin.updateConfig(array)
            .then((res) => console.log(res))
            .catch((error) => console.log(error))
        : agent.Admin.createConfig(array)
            .then((res) => console.log(res))
            .catch((error) => console.log(error))
    })
  }

  const values: any[] = []
  for (let i = 0; i < configurations; i += 1) {
    values.push(control._fields[`value${i}`]?._f.value)
  }

  const valuesWithDuplicates = values.map((value, index) => {
    return { value: value, hasDuplicate: values.filter((v) => v !== '' && v === value).length > 0 }
  })

  const getConfigValue = (index: number, value: keyof Configurable, alt?: string) => {
    return configs && configs[index] ? (alt ? alt : configs[index][value]?.toString()) : alt || ''
  }

  // Rewrite entirely (not sure how yet)
  const handleCloseModal = (numberOfValues: number, key: string, n?: IConfigPresetComposition[]) => {

      setConfigAdded(true)
      setConfigurations(numberOfValues)
      setDefaultKey(key)
      const values = n && n.map(e => e.configurations.map(e2 => e2.value))
      const resultArray = values && values[0].flatMap((color) => values[1].map((size) => color + ' ' + size));
      setMultipleValues(resultArray)
      console.log(values)
      if(values) {
        n.forEach(e => e.configurations.forEach(async cfg => await agent.Admin.addConfigPreset(cfg, productId)))
      }
    
  }

  useEffect(() => {
    if(configs?.length! > 0)
    setConfigAdded(true)
  }, [configs])

  if(configs?.length === 0 && !configAdded) {
    return <ConfigDialog handleConfigSubmit={(k, v, n) => handleCloseModal(k, v, n)} />
  }

  return (
    <Box component={Paper} sx={{ p: 4 }}>
      <Typography variant='h4' gutterBottom sx={{ mb: 4 }}>
        Product Configurations
      </Typography>
      <form onSubmit={handleSubmit(handleSubmitData)}>
        {watchFiles.map((file, index) => (
          <Grid container spacing={3} sx={{ marginTop: 0.25 }} key={index}>
            <Grid item xs={12} sm={1.5}>
              <AppTextInput
                control={control}
                disabled
                defaultValue={getConfigValue(index, 'id')}
                name={`id${index}`}
                label='Id'
                type='string'
              />
            </Grid>
            <Grid item xs={12} sm={1.5}>
              <AppTextInput
                control={control}
                defaultValue={getConfigValue(index, 'price')}
                name={`price${index}`}
                label='Price'
                type='number'
              />
            </Grid>
            <Grid item xs={12} sm={1.5}>
              <AppTextInput
                control={control}
                name={`quantityInStock${index}`}
                defaultValue={getConfigValue(index, 'quantityInStock')}
                label='Quantity in Stock'
                type='number'
              />
            </Grid>
            <Grid item xs={12} sm={1.5}>
              <AppTextInput
                control={control}
                name={`key${index}`}
                defaultValue={getConfigValue(index, 'key', defaultKey)}
                label='Key'
                type='string'
              />
            </Grid>
            <Grid item xs={12} sm={1.5}>
              <AppTextInput
                addError={valuesWithDuplicates[index].hasDuplicate}
                control={control}
                defaultValue={getConfigValue(index, 'value', multipleValues && multipleValues[index])}
                name={`value${index}`}
                label='Value'
                type='string'
              />
            </Grid>
            <Grid item xs={12} sm={1.5}>
              <AppTextInput
                disabled
                defaultValue={productId.toString()}
                control={control}
                name={`productId${index}`}
                label='Product Id'
                type='string'
              />
            </Grid>
            <Grid item xs={3}>
              <Box
                display='flex'
                justifyContent='space-between'
                alignItems='center'
                sx={{ gap: 2 }}
              >
                <AppDropzone
                  height={60}
                  width={100}
                  iconSize={'30px'}
                  control={control}
                  name={`file${index}`}
                />
                <Render
                  condition={
                    configs && configs[index] ? configs[index]?.pictureUrl : watchFiles[index]
                  }
                >
                  <img
                    src={getConfigValue(index, 'pictureUrl', watchFiles[index]?.preview)}
                    alt='preview'
                    style={{ maxHeight: 50 }}
                  />
                </Render>
                <Button onClick={() => setConfigurations(configurations - 1)} variant='outlined'>
                  Remove
                </Button>
              </Box>
            </Grid>
          </Grid>
        ))}
        <Box display='flex' justifyContent='space-between' sx={{ mt: 3 }}>
          <Button
            onClick={() => setConfigurations(configurations + 1)}
            variant='contained'
            color='inherit'
          >
            Add Configuration
          </Button>
          <LoadingButton type='submit' variant='contained' color='success'>
            Save
          </LoadingButton>
        </Box>
      </form>
    </Box>
  )
}

export default Configurations
