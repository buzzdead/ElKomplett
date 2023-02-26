import React, { useState } from 'react'
import { Box, Button, Grid, Paper, Typography } from '@mui/material'
import { FieldValues, useForm } from 'react-hook-form'
import { LoadingButton } from '@mui/lab'
import AppDropzone from '../../app/components/AppDropzone'
import AppTextInput from '../../app/components/AppTextInput'
import agent from '../../app/api/agent'
import { yupResolver } from '@hookform/resolvers/yup'
import { productConfigurationSchema } from './productValidation'
import Render from '../../app/layout/Render'
import { Configurable } from '../../app/models/product'

interface Props {
  productId: number
  configs?: Configurable[]
}

const ProductConfigurations = ({ productId, configs }: Props) => {
  const [configurations, setConfigurations] = useState<number>(1 + (configs?.length || 0))
  const { control, handleSubmit, watch } = useForm({
    resolver: yupResolver(productConfigurationSchema(configurations)),
  })
  let watchFiles: Array<any> = []

  for (let i = 0; i < configurations; i += 1) {
    watchFiles[i] = watch(`file${i}`)
  }

  async function handleSubmitData(data: FieldValues) {
    const dataArray = []

    for (let i = 0; i < configurations; i++) {
      const id = data[`id${i}`]
      const productId = data[`productId${i}`]
      const value = data[`value${i}`]
      const key = data[`key${i}`]
      const quantityInStock = data[`quantityInStock${i}`]
      const price = data[`price${i}`]
      const file = data[`file${i}`]

      if (productId && value && key && quantityInStock && price) {
        if(id)
        {
          const cfg = configs && configs?.find(cfg => cfg?.id?.toString() === id.toString())
          if(file === null && value === cfg?.value.toString() && key === cfg?.key.toString() && quantityInStock === cfg?.quantityInStock.toString() && price === cfg?.price.toString())
            continue
        dataArray.push({ id, productId, value, key, quantityInStock, price, file })
        }
        else
        dataArray.push({ productId, value, key, quantityInStock, price, file })
      }
    }
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
                defaultValue={getConfigValue(index, 'key')}
                label='Key'
                type='string'
              />
            </Grid>
            <Grid item xs={12} sm={1.5}>
              <AppTextInput
                addError={valuesWithDuplicates[index].hasDuplicate}
                control={control}
                defaultValue={getConfigValue(index, 'value')}
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

export default ProductConfigurations
