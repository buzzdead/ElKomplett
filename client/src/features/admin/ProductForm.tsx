import { Typography, Grid, Paper, Box, Button, Tab, Tabs, Card } from '@mui/material'
import { useForm } from 'react-hook-form'
import AppTextInput from '../../app/components/AppTextInput'
import { IProduct } from '../../app/models/product'
import { Key, useEffect, useState } from 'react'
import useProducts from '../../app/hooks/useProducts'
import AppSelectList from '../../app/components/AppSelectList'
import AppDropzone from '../../app/components/AppDropzone'
import { FieldValues } from 'react-hook-form/dist/types'
import { yupResolver } from '@hookform/resolvers/yup'
import { validationSchema } from './productValidation'
import agent from '../../app/api/agent'
import { useAppDispatch } from '../../app/store/configureStore'
import { setProduct } from '../catalog/catalogSlice'
import { LoadingButton } from '@mui/lab'
import Configurations from './config/Configurations'
import { useCategories } from 'app/hooks/useCategories'
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';


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
  const { brands, types } = useProducts()
  const watchFiles = watch('files', [])
  const dispatch = useAppDispatch()
  const [selectedTab, setSelectedTab] = useState(0)
  const { categories } = useCategories()
  const cats = categories.map((e) => e.title)
  const [theList, setTheList] = useState<{publicId?: string, path?: string, pictureUrl?: string, preview?: string}[]>(product !== undefined ? product.images.map(i => { return {publicId: i.publicId, pictureUrl: i.pictureUrl}}) : [])
  
  const handleTabChange = () => {
    const setNewValue = selectedTab === 0 ? 1 : 0
    setSelectedTab(setNewValue)
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
  useEffect(() => {
    let abc = watchFiles?.map((wf: { path: any, preview: any }) => {return {path: wf.path, preview: wf.preview}}) || []
    if(abc.length > 0) {
      abc = abc.filter((e: { path: string | undefined }) => !theList.some(t => t.path === e.path))
    }
    setTheList([...theList, ...abc])
  }, [watchFiles])
  


  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;
    if (!destination) return;
  
    const [reorderedItem] = theList.splice(source.index, 1);
    theList.splice(destination.index, 0, reorderedItem);
  
  };
  

  async function handleSubmitData(data: FieldValues) {
    const cat = categories.find((e) => e.title === data.categoryId)
    data.categoryId = cat?.id
    data.order = theList.map(e => e.publicId || e.path)
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
  const getItemStyle = (isDragging: boolean, draggableStyle: any) => ({
    
    background: isDragging ? '#4a2975' : 'white', 
    color: isDragging ? 'white' : 'black',
    border: '1px solid black',
    fontSize: '20px',
    borderRadius: '5px',
    ...draggableStyle
  })
  const catTitle = categories.find((c) => c.id === product?.categoryId)?.title
  return (
    <Box component={Paper} sx={{ p: 4 }}>
      <Typography variant='h4' gutterBottom sx={{ mb: 4 }}>
        Product Details
      </Typography>
      <Tabs sx={{ paddingBottom: 3 }} value={selectedTab} onChange={handleTabChange}>
        <Tab label='Product Details' />
        <Tab label='Product Configurations' />
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
                <AppSelectList control={control} items={brands} name='brand' label='Brand' />
              </Grid>
              <Grid item xs={12} sm={6}>
                <AppTextInput control={control} type='number' name='price' label='Price' />
              </Grid>
              <Grid item xs={12} sm={6}>
                <AppSelectList
                  control={control}
                  dValue={catTitle ?? categories[0].title}
                  items={cats}
                  name='categoryId'
                  label='CategoryId'
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
                <Box display='flex' justifyContent='space-between' alignItems='center' gap={5} flexDirection='column'>
                  <AppDropzone control={control} name='files' />
                  
                      <DragDropContext onDragEnd={onDragEnd}>
                      <Droppable droppableId='index' direction='horizontal' >
                            {(provided) => (
                              <div {...provided.droppableProps} ref={provided.innerRef} style={{display: 'flex', flexDirection: 'row', gap: 5, flexWrap: 'wrap',}}>
                      {theList?.map(
                        (file, index: number) => {
                          return (
                          <Draggable key={index} draggableId={index.toString()} index={index}>
                            {(provided, snapshot) => (
                              <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} style={getItemStyle(snapshot.isDragging, provided.draggableProps.style)}>
                              <img
                            key={index}
                            src={file.pictureUrl || file.preview}
                            alt={`Image ${index}`}
                            style={{ maxHeight: 200 }}
                          />
                          </div>
                            )}
                          
                          </Draggable>
                         
                        )},
                      )}
                      </div>)}</Droppable>
                      </DragDropContext>
                     
                </Box>
              </Grid>
            </Grid>
            <Box display='flex' justifyContent='space-between' sx={{ mt: 3 }}>
              <Button onClick={cancelEdit} variant='contained' color='inherit'>
                Cancel
              </Button>
              <LoadingButton
                loading={isSubmitting}
                disabled={product ? !isDirty : !isValid}
                type='submit'
                variant='contained'
                color='success'
              >
                Submit
              </LoadingButton>
            </Box>
          </form>
        ) : (
          <Configurations configs={product?.configurables} productId={product?.id!} />
        )
      }
    </Box>
  )
}
