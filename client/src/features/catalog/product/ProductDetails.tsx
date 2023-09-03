import { Box, Card, CardMedia, Grid, Paper, TextField, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
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
import { ProductQuantity } from './ProductQuantity'
import useView from 'app/hooks/useView'

type Config = {
  id?: number
  value: string
  config: Configurable
}

export default function ProductDetails() {
  const { basket, status } = useAppSelector((state) => state.basket)
  const dispatch = useAppDispatch()
  const { status: productStatus } = useAppSelector((state) => state.catalog)

  const { id } = useParams<{ id: string }>()
  const product = useAppSelector((state) => productSelectors.selectById(state, id!))
  const [currentPicture, setCurrentPicture] = useState(product?.configurables && product.configurables.length > 0 ? product.configurables[0].images[0] : product?.images[0])

  const [newQuantity, setNewQuantity] = useState(0)
  const [config, setConfig] = useState<Config | null>(product?.configurables ? {config: product.configurables[0], id: product.configurables[0]?.id || 0, value: product.configurables[0]?.value} : null)
  const [bottomValue, setBottomValue] = useState(0)
  const view = useView()

  const basketItem = basket?.items.find(
    (i: { productId: number | undefined }) => i.productId === product?.id,
  )

  useEffect(() => {
    if (basketItem && !basketItem.configurables) {
      setNewQuantity(basketItem.quantity)
    }
    if (!product) dispatch(fetchProductAsync(parseInt(id!)))
  }, [id, basketItem, dispatch, product])

  function handleInputChange(event: any) {
    if (event.target.value >= 0) {
      setNewQuantity(parseInt(event.target.value))
    }
  }

  const cellStyle = {
    display: '-webkit-box',
    WebkitBoxOrient: 'vertical',
    WebkitLineClamp: 2,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    maxHeight: '60px'
  };

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
    setCurrentPicture(currentConfig?.images[0])
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
      value: product.producer?.name || "produktnavn",
    },
      {key: 'Produkttype',
      value: product.productType?.name},
    {
      key: 'Lagerstatus',
      value: config && config.config && config.config.quantityInStock ? config?.config.quantityInStock : product.quantityInStock,
    },
  ]

  const renderQuantityField = () => {
    return (
      <Grid item xs={6} md={4}>
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
      <Grid item xs={6} md={4}>
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
    <Grid container spacing={6} sx={{marginTop: 0, marginLeft: 0}}>
      <Grid item xs={12} md={6} sx={{display : 'flex', flexDirection: view.view.ipad ? 'column' : 'row', width: '100%', height: '100%'}}>
      <Render condition={product.images.length > 1}>
      <Grid item xs={12} md={4} sx={{overflow: 'hidden'}}>
        <ImageScroller horizontal={view.view.ipad} selectedImageUrl={currentPicture?.pictureUrl || ''} onPress={handleOnPress} images={config && config?.config ? config.config.images : product.images}/>
      </Grid>
      </Render>
      <Grid style={{padding: view.view.ipad ? 0 : 40}} sx={{ alignSelf: 'center', display: 'flex'}} item xs={12} md={8}>
        <Card style={{height: view.view.ipad ? 300 : 475, width: '100%' }}>
        <CardMedia
        title="asdf"
          component={Paper}
          image={currentPicture?.pictureUrl}
          
          sx={{padding: 20, width: '100%', height: '100%', alignSelf: 'center',  backgroundSize: 'cover',}}
        />
        </Card>
      </Grid>
      </Grid>
      <Grid item xs={12} md={6}>
        <Typography variant='h3' sx={{paddingBottom: 2, ...cellStyle}}>{product.name}</Typography>
        <Typography variant='h4' color='secondary'>
          {currencyFormat(config?.config?.price || product.price)}
        </Typography>
        <AppTable tableData={tableData} />
        <Grid
          item
          sx={{ marginTop: 4, marginBottom: 4, p: 1, gap: 1, flexDirection: 'column' }}
        >
          <Box sx={{position: 'absolute', marginTop: -6}}>
          <ProductConfigs product={product} onConfigChange={onConfigChange} defaultConfig={config && config.config ? {key: config.config.key, checkedValue: config?.value} : {key: '', checkedValue: ''}} />
          </Box>
        </Grid>
        <Grid xs={12} item>
          <Render condition={product?.configurables !== undefined && product.configurables.length > 0}>
          <ProductQuantity basketItem={basketItem} productId={product.id} newQuantity={newQuantity} setNewQuantity={setNewQuantity} config={config}/>
          <Grid xs={12} item sx={{display: 'flex', flexDirection: 'row'}}>
            {renderQuantityField()}
            {renderUpdateCartButton()}
          </Grid>
          </Render>
        </Grid>
      </Grid>
      
      <Grid component={Paper}  marginBottom={5} marginTop={5} elevation={1} item xs={12}  sx={{ backgroundImage: 'none', bgcolor: 'background.paper', borderRadius: 15, minHeight: 250, display: 'flex', flexDirection: 'column', width: '100%', marginLeft: view.view.ipad ? 0 : 30, marginRight: view.view.ipad ? 0 : 10}}>

        <ProductBottom onChangeValue={setBottomValue} />
        <Typography variant='subtitle1' sx={{marginBottom: 5, marginTop: 2, marginRight: 5}}>{bottomValue === 0 ? product.description : bottomValue === 1 ? "Spesifikasjoner kommer" : "Dokumentasjon kommer"}</Typography>

      </Grid>
    </Grid>
  )
}
