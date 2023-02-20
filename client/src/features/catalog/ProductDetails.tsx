import { Box, Divider, Grid, TextField, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import React from 'react'
import NotFound from '../../app/errors/NotFound'
import LoadingComponent from '../../app/layout/LoadingComponent'
import { LoadingButton } from '@mui/lab'
import { useAppDispatch, useAppSelector } from '../../app/store/configureStore'
import { addBasketItemAsync, removeBasketItemAsync } from '../basket/basketSlice'
import { fetchProductAsync, productSelectors } from './catalogSlice'
import { currencyFormat } from '../../app/util/util'
import AppTable, { TableData } from '../../app/components/AppTable/AppTable'
import RadioButtonGroup from '../../app/components/RadioButtonGroup'
import Render from '../../app/layout/Render'

export default function ProductDetails() {
  const { basket, status } = useAppSelector((state) => state.basket)
  const dispatch = useAppDispatch()
  const { id } = useParams<{ id: string }>()
  const product = useAppSelector((state) => productSelectors.selectById(state, id!))
  const { status: productStatus } = useAppSelector((state) => state.catalog)
  const [newQuantity, setNewQuantity] = useState(0)
  const [config, setConfig] = useState('')

  const basketItem = basket?.items.find(
    (i: { productId: number | undefined }) => i.productId === product?.id,
  )

  useEffect(() => {
    if (basketItem && basketItem.quantity !== newQuantity) {
      setNewQuantity(basketItem.quantity)
    }
    if (!product) dispatch(fetchProductAsync(parseInt(id!)))
  }, [id, basketItem, dispatch, product, newQuantity])

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
      ? dispatch(addBasketItemAsync({ productId, quantity }))
      : dispatch(removeBasketItemAsync({ productId, quantity }))
  }

  if (productStatus.includes('pending')) return <LoadingComponent message='Loading product' />

  if (!product) return <NotFound />

  const tableData: TableData[] = [
    {
      key: 'Name',
      value: product.name,
    },
    {
      key: 'Description',
      value: product.description,
    },
    {
      key: 'Type',
      value: product.type,
    },
    {
      key: 'Brand',
      value: product.brand,
    },
    {
      key: 'Quantity in stock',
      value: product.quantityInStock,
    },
  ]

  const renderQuantityField = () => {
    return (
      <Grid item xs={6}>
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
      <Grid item xs={6}>
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
  const opt2: { label: string; value: string }[] = []
  const opt = product.configurables?.forEach((cfg) =>
    opt2.push({ label: cfg.value, value: cfg.value }),
  )
  return (
    <Grid container spacing={6}>
      <Grid item xs={6}>
        <img src={product.pictureUrl} alt={product.name} style={{ width: '100%' }} />
      </Grid>
      <Grid item xs={6}>
        <Typography variant='h3'>{product.name}</Typography>
        <Divider sx={{ mb: 2 }} />
        <Typography variant='h4' color='secondary'>
          {currencyFormat(
            product.configurables?.find((e) => e.value === config)?.price || product.price,
          )}
        </Typography>
        <AppTable tableData={tableData} />
        <Grid container sx={{ marginTop: 4, marginBottom: 4, p: 1, gap: 1 }}>
          <Render
            condition={product?.configurables !== undefined && product.configurables.length !== 0}
          >
            <>
              <Box marginTop={1}>
                Choose {product?.configurables && product.configurables[0]?.key}:
              </Box>
              <RadioButtonGroup
                flexDirection='row'
                selectedValue={config}
                options={opt2}
                onChange={(e) => setConfig(e.target.value)}
              />
            </>
          </Render>
        </Grid>
        <Grid container spacing={2}>
          {renderQuantityField()}
          {renderUpdateCartButton()}
        </Grid>
      </Grid>
    </Grid>
  )
}
