import { Box, Card, CardMedia, Divider, Grid, Paper, TextField, Typography } from '@mui/material'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import React from 'react'
import NotFound from '../../../app/errors/NotFound'
import LoadingComponent from '../../../app/layout/LoadingComponent'
import { LoadingButton } from '@mui/lab'
import { useAppDispatch, useAppSelector } from '../../../app/store/configureStore'
import { addBasketItemAsync, removeBasketItemAsync } from '../../basket/basketSlice'
import { fetchProductAsync, productSelectors } from '.././catalogSlice'
import { currencyFormat } from '../../../app/util/util'
import AppTable, { TableData } from '../../../app/components/AppTable/AppTable'
import { Configurable } from '../../../app/models/product'
import './Product.css'
import { IRadioButton, ProductConfigs } from './ProductConfigs'
import ImageScroller from 'app/components/ImageScroller'
import Render from 'app/layout/Render'
import ProductBottom from './ProductBottom'
import { grey } from '@mui/material/colors'

type Config = {
  id?: number
  value: string
  config: Configurable
}

export default function ProductDetails() {
  const { basket, status } = useAppSelector((state) => state.basket)
  const dispatch = useAppDispatch()
  const { status: productStatus } = useAppSelector((state) => state.catalog)
  const [mounted, setMounted] = useState(false)

  const { id } = useParams<{ id: string }>()
  const product = useAppSelector((state) => productSelectors.selectById(state, id!))
  const [currentPicture, setCurrentPicture] = useState(product?.images[0])

  const [newQuantity, setNewQuantity] = useState(0)
  const [config, setConfig] = useState<Config>()
  const [bottomValue, setBottomValue] = useState(0)

  const basketItem = basket?.items.find(
    (i: { productId: number | undefined }) => i.productId === product?.id,
  )

  useEffect(() => {
    if (basketItem) {
      setNewQuantity(basketItem.quantity)
    }
    if (!product) dispatch(fetchProductAsync(parseInt(id!)))
  }, [id, basketItem, dispatch, product])

  useEffect(() => {
    return
    if(!mounted) setMounted(true)
    else  window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    
  }, [bottomValue]);

  function handleInputChange(event: any) {
    if (event.target.value >= 0) {
      setNewQuantity(parseInt(event.target.value))
    }
  }

  function handleUpdateCart() {
    const quantity = Math.abs(newQuantity - (basketItem?.quantity || 0))
    const productId: number = product?.id as number
    const addToCart = !basketItem || newQuantity > basketItem.quantity

    addToCart
      ? config
        ? dispatch(addBasketItemAsync({ productId, quantity, configId: config.id }))
        : dispatch(addBasketItemAsync({ productId, quantity }))
      : dispatch(removeBasketItemAsync({ productId, quantity }))
  }

  const isTheRightOne = (a: string, b: string) => {
    const arrayA = a.split(" ");
    const arrayB = b.split(" ");
  
    if (arrayA.length !== arrayB.length) {
      return false;
    }
  
    const sortedArrayA = arrayA.sort();
    const sortedArrayB = arrayB.sort();
  
    return sortedArrayA.every((value, index) => value === sortedArrayB[index]);
  };

  function onConfigChange(updatedWithNewValue: IRadioButton[]) {
    const newConfig = updatedWithNewValue.filter((e) => e.checkedValue !== '')
    const newConfigValue = newConfig.map((e) => e.checkedValue).join(' ')
    const currentConfig = product?.configurables?.find((e) => isTheRightOne(e.value, newConfigValue))
    if(currentConfig)
      setConfig({ config: currentConfig, value: currentConfig.value, id: currentConfig.id })
  }

  if (productStatus.includes('pending')) return <LoadingComponent message='Loading product' />

  if (!product) return <NotFound />

  const tableData: TableData[] = [
    {
      key: 'Navn',
      value: product.name,
    },
    {
      key: 'Beskrivelse',
      value: product.description,
    },
    {
      key: 'Produsent',
      value: product.brand,
    },
    {
      key: 'Lagerstatus',
      value: config?.config.quantityInStock || product.quantityInStock,
    },
  ]

  const renderQuantityField = () => {
    return (
      <Grid item xs={3}>
        <TextField
          variant='outlined'
          type='number'
          label='Quantity in Cart'
          onChange={handleInputChange}
          fullWidth
          value={newQuantity}
        />
      </Grid>
    )
  }

  const renderUpdateCartButton = () => {
    const quantityChanged =
      basketItem?.quantity === newQuantity || (!basketItem && newQuantity === 0)
    return (
      <Grid item xs={3}>
        <LoadingButton
          disabled={quantityChanged}
          loading={status.includes('pending')}
          onClick={handleUpdateCart}
          sx={{ height: '55px' }}
          color='primary'
          size='large'
          variant='contained'
          fullWidth
        >
          {basketItem ? 'Update Quantity' : 'Add to cart'}
        </LoadingButton>
      </Grid>
    )
  }

  const handleOnPress = (img: {pictureUrl: string}) => {
    setCurrentPicture(img)
    
  }

  return (
    <Grid container spacing={6} sx={{marginTop: 0}}>
      <Render condition={product.images.length > 1}>
      <Grid item xs={1.5} sx={{overflow: 'hidden'}}>
        <ImageScroller selectedImageUrl={currentPicture?.pictureUrl || ''} onPress={handleOnPress} images={product.images}/>
      </Grid>
      </Render>
      <Grid style={{padding: 40}} sx={{ alignSelf: 'center', display: 'flex'}} item xs={4}>
        <Card style={{height: 475, width: '100%' }}>
        <CardMedia
        title="asdf"
          component={Paper}
          image={config?.config.pictureUrl || currentPicture?.pictureUrl || product.images[0].pictureUrl}
          
          sx={{padding: 20, width: '100%', height: '100%', alignSelf: 'center',  backgroundSize: 'cover',}}
        />
        </Card>
      </Grid>
      
      <Grid item xs={6}>
      
        <Typography variant='h3' sx={{paddingBottom: 2}}>{product.name}</Typography>
        <Typography variant='h4' color='secondary'>
          {currencyFormat(config?.config?.price || product.price)}
        </Typography>
        <AppTable tableData={tableData} />
        <Grid
          container
          sx={{ marginTop: 4, marginBottom: 4, p: 1, gap: 1, flexDirection: 'column' }}
        >
          <Box sx={{position: 'absolute', height: '100%', marginTop: -6}}>
          <ProductConfigs product={product} onConfigChange={onConfigChange} />
          </Box>
        </Grid>
        <Grid container spacing={2}>
          {renderQuantityField()}
          {renderUpdateCartButton()}
        </Grid>
      </Grid>
      <Grid component={Paper}  marginBottom={5} marginTop={5} elevation={1} item xs={12} sx={{ backgroundImage: 'none', bgcolor: 'background.paper', borderRadius: 15, minHeight: 250, display: 'flex', flexDirection: 'column', width: '100%', marginLeft: 30, marginRight: 10}}>

        <ProductBottom onChangeValue={setBottomValue} />
        <Typography variant='subtitle1' sx={{marginBottom: 5, marginTop: 2, marginRight: 5}}>{bottomValue === 0 ? product.description : bottomValue === 1 ? "Spesifikasjoner kommer" : "Dokumentasjon kommer"}</Typography>

      </Grid>
    </Grid>
  )
}
