import { Typography, Grid, Paper, Box, Button, Tab, Tabs } from '@mui/material'
import { useForm } from 'react-hook-form'
import AppTextInput from '../../app/components/AppTextInput'
import { IProduct } from '../../app/models/product'
import { useEffect, useState } from 'react'
import useProducts from '../../app/hooks/useProducts'
import AppSelectList from '../../app/components/AppSelectList'
import { FieldValues } from 'react-hook-form/dist/types'
import { yupResolver } from '@hookform/resolvers/yup'
import { validationSchema } from './AdvancedInventory/productValidation'
import agent from '../../app/api/agent'
import { useAppDispatch } from '../../app/store/configureStore'
import { setProduct } from '../catalog/catalogSlice'
import { LoadingButton } from '@mui/lab'
import Configurations from './config/Configurations'
import { useCategories } from 'app/hooks/useCategories'
import { useDndList } from '../../app/hooks/useDndList'
import { DndList } from '../../app/components/DndList'
import ProductSpecification from './AdvancedInventory/ProductSpecifications'
import { indexOf } from 'lodash'


interface Props {
  product?: IProduct
  cancelEdit: () => void
}

export default function ProductForm({ product, cancelEdit }: Props) {
  const {
    control,
    reset,
    handleSubmit,
    watch,
    formState: { isDirty, isSubmitting, isValid },
  } = useForm({
    resolver: yupResolver(validationSchema(product === undefined || product === null)),
  })
  const { producers, productTypes } = useProducts()
  const watchFiles = watch('files', [])
  const dispatch = useAppDispatch()
  const [selectedTab, setSelectedTab] = useState(0)
  const { categories, categoriesLoading } = useCategories()
  const cats = categories.map((e) => e.title)

  const {list, onDragEnd, reordered} = useDndList({images: product?.images, watchFiles: watchFiles, control: control, name: 'order'})

  const handleTabChange = (e: any, v: any) => {
    setSelectedTab(v)
  }
  
  useEffect(() => {
    if (product && watchFiles?.length === 0 && !isDirty) {
      reset({
        ...product,
        files: [], // Reset the uploaded files when resetting the form
      })
    }

    return () => {
      watchFiles?.forEach((file: { preview: string }) => URL.revokeObjectURL(file.preview))
    }
  }, [product, reset, isDirty])

  async function handleSubmitData(data: FieldValues) {
    console.log(data)
    return
    const cat =  categories.find((e) => e.title === data.categoryId)
    const newId = !cat ? product?.categoryId : cat?.id
    data.categoryId = newId
    try {
      let response: IProduct
      if (product) {
        response = await agent.Admin.updateProduct(data)
      } else {
        response = await agent.Admin.createProduct(data)
      }
      dispatch(setProduct(response))
      cancelEdit()
    } catch (error) {
      console.log(error)
    }
  }

  const catTitle = categories.find((c) => c.id === product?.categoryId)?.title || categories[0].title
  var catIndex = indexOf(categories.map(e => e.title), catTitle)

  if(categoriesLoading) return null
  return (
    <Box component={Paper} sx={{ p: 4 }}>
      <Typography variant='h4' gutterBottom sx={{ mb: 4 }}>
        Product Details
      </Typography>
      <Tabs sx={{ paddingBottom: 3 }} value={selectedTab} onChange={handleTabChange}>
        <Tab label='Product Details' />
        <Tab disabled={!product} label='Product Configurations' />
        <Tab label='Produktdetaljer' />
      </Tabs>
      {
        //make into own component or use apptable
        selectedTab === 0 ? (
          <form onSubmit={handleSubmit(handleSubmitData)}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={12}>
                <AppTextInput control={control} name='name' label='Product name' />
              </Grid>
              <Grid item xs={12} sm={6}>
                <AppSelectList control={control} items={producers} name='producerName' label='Producer Name' defaultValue={product?.producer?.name} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <AppSelectList control={control} items={productTypes} name='productTypeName' label='Product Type' defaultValue={product?.productType?.name} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <AppTextInput control={control} type='number' name='price' label='Price' />
              </Grid>
              <Grid item xs={12} sm={6}>
                <AppSelectList
                  control={control}
                  items={cats}
                  name='categoryId'
                  label='CategoryId'
                  dValue={catTitle}
                  defaultValue={catIndex}
                />
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
                  rows={2}
                  control={control}
                  name='description'
                  label='Description'
                />
              </Grid>
              <Grid item xs={12}>
               <DndList control={control} list={list} onDragEnd={onDragEnd}/>
              </Grid>
            </Grid>
            <Box display='flex' justifyContent='space-between' sx={{ mt: 3 }}>
              <Button onClick={cancelEdit} variant='contained' color='inherit'>
                Cancel
              </Button>
              <LoadingButton
                loading={isSubmitting}
                disabled={product ? !isDirty && !reordered : !isValid}
                type='submit'
                variant='contained'
                color='success'
              >
                Submit
              </LoadingButton>
            </Box>
          </form>
        ) : selectedTab === 1 ? (
          <Configurations configs={product?.configurables} productId={product?.id!} />
        )
        : <ProductSpecification control={control} specifications={[]} />
      }
    </Box>
  )
}
