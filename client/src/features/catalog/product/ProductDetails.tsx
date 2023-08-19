import { Divider, Grid, TextField, Typography } from '@mui/material'
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

  const [newQuantity, setNewQuantity] = useState(0)
  const [config, setConfig] = useState<Config>()

  const basketItem = basket?.items.find(
    (i: { productId: number | undefined }) => i.productId === product?.id,
  )

  useEffect(() => {
    if (basketItem) {
      setNewQuantity(basketItem.quantity)
    }
    if (!product) dispatch(fetchProductAsync(parseInt(id!)))
  }, [id, basketItem, dispatch, product])

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
      value: config?.config.quantityInStock || product.quantityInStock,
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
  return (
    <Grid container spacing={6}>
      <Grid item xs={6}>
        <img
          className='productImage'
          src={config?.config.pictureUrl || product.pictureUrl}
          alt={product.name}
          style={{ width: '100%' }}
        />
      </Grid>
      <Grid item xs={6}>
        <Typography variant='h3'>{product.name}</Typography>
        <Divider sx={{ mb: 2 }} />
        <Typography variant='h4' color='secondary'>
          {currencyFormat(config?.config?.price || product.price)}
        </Typography>
        <AppTable tableData={tableData} />
        <Grid
          container
          sx={{ marginTop: 4, marginBottom: 4, p: 1, gap: 1, flexDirection: 'column' }}
        >
          <ProductConfigs product={product} onConfigChange={onConfigChange} />
        </Grid>
        <Grid container spacing={2}>
          {renderQuantityField()}
          {renderUpdateCartButton()}
        </Grid>
      </Grid>
    </Grid>
  )
}
