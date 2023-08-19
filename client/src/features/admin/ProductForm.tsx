import { Typography, Grid, Paper, Box, Button, Tab, Tabs } from '@mui/material'
import { useForm } from 'react-hook-form'
import AppTextInput from '../../app/components/AppTextInput'
import { IProduct } from '../../app/models/product'
import { useEffect, useState } from 'react'
import useProducts from '../../app/hooks/useProducts'
import AppSelectList from '../../app/components/AppSelectList'
import AppDropzone from '../../app/components/AppDropzone'
import { FieldValues } from 'react-hook-form/dist/types'
import {yupResolver} from '@hookform/resolvers/yup'
import { validationSchema } from './productValidation'
import agent from '../../app/api/agent'
import { useAppDispatch } from '../../app/store/configureStore'
import { setProduct } from '../catalog/catalogSlice'
import { LoadingButton } from '@mui/lab'
import Configurations from './config/Configurations'
import { useCategories } from 'app/hooks/useCategories'

interface Props {
  product?: IProduct
  cancelEdit: () => void
}

export default function ProductForm({ product, cancelEdit }: Props) {
  const { control, reset, handleSubmit, watch, formState: {isDirty, isSubmitting, isValid} } = useForm({
    resolver: yupResolver(validationSchema(product === undefined || product === null))
  })
  const { brands, types } = useProducts()
  const watchFile = watch('file', null)
  const dispatch = useAppDispatch()
  const [selectedTab, setSelectedTab] = useState(0);
  const categories = useCategories()
  const cats = categories.map(e => e.title)

  const handleTabChange = () => {
    const setNewValue = selectedTab === 0 ? 1 : 0
    setSelectedTab(setNewValue);
  };

  useEffect(() => {
    if (product && !watchFile && !isDirty) reset(product)
    return () => {
        if(watchFile) URL.revokeObjectURL(watchFile.preview)
    }
  }, [product, reset, watchFile, isDirty])

  async function handleSubmitData(data: FieldValues) {
    const cat = categories.find(e => e.title === data.categoryId)
    data.categoryId = cat?.id
    try {
        let response: IProduct
        if(product) {
            response = await agent.Admin.updateProduct(data)
        } else {
            response = await agent.Admin.createProduct(data)
        }
        dispatch(setProduct(response))
        cancelEdit()
    }
    catch (error) {
        console.log(error)
    }
  }
  const catTitle = categories.find(c => c.id === product?.categoryId)?.title
  return (
    <Box component={Paper} sx={{ p: 4 }}>
      <Typography variant='h4' gutterBottom sx={{ mb: 4 }}>
        Product Details
      </Typography>
      <Tabs sx={{paddingBottom: 3}} value={selectedTab} onChange={handleTabChange}>
        <Tab label="Product Details" />
        <Tab label="Product Configurations" />
      </Tabs>
      { //make into own component or use apptable
      selectedTab === 0 ? (
      <form onSubmit={handleSubmit(handleSubmitData)}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={12}>
            <AppTextInput control={control} name='name' label='Product name' />
          </Grid>
          <Grid item xs={12} sm={6}>
            <AppSelectList control={control} items={brands} name='brand' label='Brand' />
          </Grid>
          <Grid item xs={12} sm={6}>
            <AppSelectList control={control} items={types} name='type' label='Type' />
          </Grid>
          <Grid item xs={12} sm={6}>
            <AppTextInput control={control} type='number' name='price' label='Price' />
          </Grid>
          <Grid item xs={12} sm={6}>
            <AppSelectList control={control} dValue={catTitle ?? categories[0].title} items={cats} name='categoryId' label='CategoryId' />
          </Grid>
          <Grid item xs={12} sm={6}>
            <AppTextInput
              control={control}
              type='number'
              name='quantityInStock'
              label='Quantity in Stock'
            />
          </Grid>
          <Grid item xs={12}>
            <AppTextInput
              multiline
              rows={4}
              control={control}
              name='description'
              label='Description'
            />
          </Grid>
          <Grid item xs={12}>
            <Box display='flex' justifyContent='space-between' alignItems='center'>
              <AppDropzone control={control} name='file' />
              {watchFile ? (
                <img src={watchFile.preview} alt='preview' style={{ maxHeight: 200 }} />
              ) : (
                <img src={product?.pictureUrl} alt={product?.name} style={{ maxHeight: 200 }} />
              )}
            </Box>
          </Grid>
        </Grid>
        <Box display='flex' justifyContent='space-between' sx={{ mt: 3 }}>
          <Button onClick={cancelEdit} variant='contained' color='inherit'>
            Cancel
          </Button>
          <LoadingButton loading={isSubmitting} disabled={product ? !isDirty : !isValid} type='submit' variant='contained' color='success'>
            Submit
          </LoadingButton>
        </Box>
      </form>
      )
      :
      <Configurations configs={product?.configurables} productId={product?.id!} />
    }
    </Box>
  )
}
