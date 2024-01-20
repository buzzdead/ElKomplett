import { Box, Card, CardMedia, Grid, Paper, Typography, useTheme } from '@mui/material'
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import React from 'react'
import NotFound from '../../../app/errors/NotFound'
import LoadingComponent from '../../../app/layout/LoadingComponent'
import { useAppDispatch, useAppSelector } from '../../../app/store/configureStore'
import { addBasketItemAsync, removeBasketItemAsync } from '../../basket/basketSlice'
import { productSelectors } from '.././catalogSlice'
import { createTableCell, currencyFormat } from '../../../app/util/util'
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

const gridStyle = {
  backgroundImage: 'none',
  bgcolor: 'background.paper',
  borderRadius: 15,
  minHeight: 250,
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  width: '100%',
  mt: 5,
  mb: 5,
  position: 'sticky',
  top: 0,
  zIndex: 10,
}

export default function ProductDetails() {
  const { basket, status } = useAppSelector((state) => state.basket)
  const { status: productStatus } = useAppSelector((state) => state.catalog)
  const dispatch = useAppDispatch()
  const { id } = useParams<{ id: string }>()
  const product = useAppSelector((state) => productSelectors.selectById(state, parseInt(id!)))
  const { state, setState, updateState } = useConfigs({ basket: basket, product: product, id: id })
  const [bottomValue, setBottomValue] = useState(0)
  const view = useView()
  const theme = useTheme()

  const isInvalidQuantity = (quantity: number) => {
    return typeof quantity !== 'number' || quantity < 0
  }

  const updateCart = (quantity: number, basketItemQuantity: number) => {
    const newQuantity = Math.abs(quantity - basketItemQuantity)
    const productId: number = product?.id as number
    const addToCart = !state.basketItem || quantity > state.basketItem.quantity
    const dispatchableItem = { productId, quantity: newQuantity, configId: state.config?.id }

    addToCart
      ? dispatch(addBasketItemAsync(dispatchableItem))
      : dispatch(removeBasketItemAsync(dispatchableItem))
  }

  function handleUpdateCart() {
    const quantity = state.newQuantity as number
    const basketItemQuantity = state.basketItem?.quantity || 0
    isInvalidQuantity(quantity)
      ? updateState('newQuantity', basketItemQuantity)
      : updateCart(quantity, basketItemQuantity)
  }

  if (productStatus.includes('pendingFetchProduct'))
    return <LoadingComponent message='Loading product' />

  if (!product) return <NotFound />

  const isConfigWithQuantity = state.config && state.config.config && state.config.config.quantityInStock

  const tableData: TableData[] = [
    createTableCell('Navn', product.name),
    createTableCell('Beskrivelse', product.description),
    createTableCell('Produsent', product.producer?.name || 'produktnavn'),
    createTableCell('Produkttype', product.productType?.name),
    createTableCell(
      'Lagerstatus',
      isConfigWithQuantity
        ? state.config?.config.quantityInStock
        : product.quantityInStock,
    ),
  ]

  const handleOnPress = (img: { pictureUrl: string }) => {
    updateState('currentPicture', img)
  }
  return (
    <Grid width='inherit' container spacing={6} sx={{ marginTop: 0, marginLeft: 0 }}>
      <Grid
        item
        xs={12}
        style={{ paddingLeft: 0 }}
        md={6}
        sx={{
          display: 'flex',
          flexDirection: view.view.ipad ? 'column' : 'row',
          justifyContent: 'center',
          width: '100%',
          height: '100%',
          alignItems: 'center',
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
              config={state.config}
              basket={basket}
            />
          </Box>
        </Grid>
        <ShoppingField
          newQuantity={state.newQuantity as number}
          status={status}
          handleUpdateCart={handleUpdateCart}
          updateState={(newQuantity: 'newQuantity', n: number | string) =>
            updateState(newQuantity, n)
          }
          basketItem={state.basketItem}
        />
      </Grid>

      <Grid
        component={Paper}
        item
        sm={10}
        xs={12}
        style={{
          paddingLeft: view.view.mobile ? 2.5 : 48,
          alignItems: view.view.mobile ? 'center' : 'flex-start',
        }}
        pl={{ xs: 2.5 }}
        pr={{ xs: 2.5 }}
        pb={5}
        sx={{
          ...gridStyle,
          backgroundColor: theme.palette.background.paper,
          color: theme.palette.text.primary,
          ml: view.view.ipad ? 2 : 20,
          mr: view.view.ipad ? 2 : 20,
        }}
      >
        <ProductBottom onChangeValue={setBottomValue} />
        <Grid item xs={12} sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
          <div
            style={{ paddingLeft: 15 }}
            className={`tab-content ${bottomValue === 0 ? 'active' : ''}`}
          >
            {bottomValue === 0 ? (
              product.richDescription !== null ? (
                <RichTextDisplay richText={product.richDescription} />
              ) : (
                product.description
              )
            ) : null}
          </div>
          <div className={`tab-content ${bottomValue === 1 ? 'active' : ''}`}>
            {bottomValue === 1 ? 'Spesifikasjoner kommer' : null}
          </div>
          <div className={`tab-content ${bottomValue === 2 ? 'active' : ''}`}>
            {bottomValue === 2 ? 'Dokumentasjon kommer' : null}
          </div>
        </Grid>
      </Grid>
    </Grid>
  )
}
