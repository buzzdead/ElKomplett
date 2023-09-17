import { Box, Card, CardMedia, Grid, Paper, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import React from 'react'
import NotFound from '../../../app/errors/NotFound'
import LoadingComponent from '../../../app/layout/LoadingComponent'
import { useAppDispatch, useAppSelector } from '../../../app/store/configureStore'
import { addBasketItemAsync, removeBasketItemAsync } from '../../basket/basketSlice'
import { fetchProductAsync, productSelectors } from '.././catalogSlice'
import { currencyFormat } from '../../../app/util/util'
import AppTable, { TableData } from '../../../app/components/AppTable/AppTable'
import './Product.css'
import { ProductConfigs } from './ProductConfigs'
import ImageScroller from 'app/components/ImageScroller'
import Render from 'app/layout/Render'
import ProductBottom from './ProductBottom'
import useView from 'app/hooks/useView'
import { RichTextDisplay } from 'app/components/RichTextDisplay'
import { useConfigs } from 'app/hooks/useConfigs'
import { ShoppingField } from './ShoppingField'

export default function ProductDetails() {
  const { basket, status } = useAppSelector((state) => state.basket)
  const dispatch = useAppDispatch()
  const { status: productStatus } = useAppSelector((state) => state.catalog)

  const { id } = useParams<{ id: string }>()
  const product = useAppSelector((state) => productSelectors.selectById(state, id!))

  const [bottomValue, setBottomValue] = useState(0)
  const view = useView()
  const { state, setState, updateState } = useConfigs({ basket: basket, product: product })

  useEffect(() => {
    if (state.basketItem) {
      updateState('newQuantity', state.basketItem.quantity)
    }
    if (!product) dispatch(fetchProductAsync(parseInt(id!)))
  }, [id, state.basketItem, dispatch, product])
  useEffect(() => {
    const basketI = basket?.items.filter(
      (i: { productId: number | undefined }) => i.productId === product?.id,
    )

    if (basketI !== undefined && basketI.length > 0)
      updateState(
        'basketItem',
        basketI.find((e) => e.configId === state.config?.id),
      )
    else basketI !== undefined && updateState('basketItem', basketI[0])
  }, [basket])

  function handleUpdateCart() {
    const quantity = Math.abs(state.newQuantity - (state.basketItem?.quantity || 0))
    const productId: number = product?.id as number
    const addToCart = !state.basketItem || state.newQuantity > state.basketItem.quantity

    addToCart
      ? dispatch(addBasketItemAsync({ productId, quantity, configId: state.config?.id }))
      : dispatch(removeBasketItemAsync({ productId, quantity, configId: state.config?.id }))
  }

  if (productStatus.includes('pendingFetchProduct'))
    return <LoadingComponent message='Loading product' />

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
      value: product.producer?.name || 'produktnavn',
    },
    { key: 'Produkttype', value: product.productType?.name },
    {
      key: 'Lagerstatus',
      value:
        state.config && state.config.config && state.config.config.quantityInStock
          ? state.config?.config.quantityInStock
          : product.quantityInStock,
    },
  ]

  const handleOnPress = (img: { pictureUrl: string }) => {
    updateState('currentPicture', img)
  }

  return (
    <Grid container spacing={6} sx={{ marginTop: 0, marginLeft: 0 }}>
      <Grid
        item
        xs={12}
        md={6}
        sx={{
          display: 'flex',
          flexDirection: view.view.ipad ? 'column' : 'row',
          justifyContent: 'center',
          width: '100%',
          height: '100%',
        }}
      >
        <Render condition={product.images.length > 1}>
          <Grid item xs={12} md={4} sx={{ overflow: 'hidden' }}>
            <ImageScroller
              horizontal={view.view.ipad}
              selectedImageUrl={state.currentPicture?.pictureUrl || ''}
              onPress={handleOnPress}
              images={
                state.config && state.config?.config ? state.config.config.images : product.images
              }
            />
          </Grid>
        </Render>
        <Grid style={{ padding: view.view.ipad ? 0 : 40 }} item xs={10} md={8}>
          <Card style={{ height: view.view.ipad ? 350 : 475 }}>
            <CardMedia
              title='asdf'
              component={Paper}
              image={state.currentPicture?.pictureUrl || product.images[0].pictureUrl}
              sx={{
                padding: 20,
                height: '100%',
                alignSelf: 'center',
                backgroundSize: 'cover',
              }}
            />
          </Card>
        </Grid>
      </Grid>
      <Grid item xs={10} md={4.5}>
        <Typography variant='h3' className='cellStyle' sx={{ paddingBottom: 2 }}>
          {product.name}
        </Typography>
        <Typography variant='h4' color='secondary'>
          {currencyFormat(state.config?.config?.price || product.price)}
        </Typography>
        <AppTable tableData={tableData} />
        <Grid
          item
          sx={{
            marginTop: state.config ? 4 : 2,
            marginBottom: state.config ? 4 : 2,
            p: 1,
            gap: 1,
            flexDirection: 'column',
          }}
        >
          <Box sx={{ position: 'absolute', marginTop: -6 }}>
            <ProductConfigs
              product={product}
              updateState={setState}
              defaultConfig={
                state.config && state.config.config
                  ? { key: state.config.config.key, checkedValue: state.config?.value }
                  : { key: '', checkedValue: '' }
              }
              basket={basket}
            />
          </Box>
        </Grid>
        <ShoppingField
          quantityChanged={
            state.basketItem?.quantity === state.newQuantity ||
            (!state.basketItem && state.newQuantity === 0)
          }
          newQuantity={state.newQuantity}
          status={status}
          handleUpdateCart={handleUpdateCart}
          updateState={(newQuantity: 'newQuantity', n: number) => updateState('newQuantity', n)}
          basketItem={state.basketItem}
        />
      </Grid>

      <Grid
        component={Paper}
        marginBottom={5}
        marginTop={5}
        elevation={1}
        item
        xs={10}
        sx={{
          backgroundImage: 'none',
          bgcolor: 'background.paper',
          borderRadius: 15,
          minHeight: 250,
          display: 'flex',
          justifyContent: 'center',
          flexDirection: 'column',
          width: '100%',
          marginLeft: view.view.ipad ? 2 : 20,
          marginRight: view.view.ipad ? 2 : 20,
        }}
      >
        <ProductBottom onChangeValue={setBottomValue} />
        <Typography variant='subtitle1' sx={{ marginBottom: 5, marginTop: 2, marginRight: 5 }}>
          {bottomValue === 0 ? (
            product.richDescription !== null ? (
              <RichTextDisplay richText={product.richDescription} />
            ) : (
              product.description
            )
          ) : bottomValue === 1 ? (
            'Spesifikasjoner kommer'
          ) : (
            'Dokumentasjon kommer'
          )}
        </Typography>
      </Grid>
    </Grid>
  )
}
