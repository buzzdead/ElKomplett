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
import { Configurable } from '../../app/models/product'
import './Product.css'

type cfg = {
  value: string
  config: Configurable
}

interface ConfigMap {
  key: string
  values: string[]
}

interface IRadioButton {
  key: string
  checkedValue: string
}

export default function ProductDetails() {
  const { basket, status } = useAppSelector((state) => state.basket)
  const dispatch = useAppDispatch()
  const { id } = useParams<{ id: string }>()
  const product = useAppSelector((state) => productSelectors.selectById(state, id!))
  const { status: productStatus } = useAppSelector((state) => state.catalog)
  const [newQuantity, setNewQuantity] = useState(0)
  const [config, setConfig] = useState<cfg>()
  const [checkedRadioButton, setCheckedRadioButton] = useState<IRadioButton[]>([{key: '', checkedValue: ''}])  
  const basketItem = basket?.items.find(
    (i: { productId: number | undefined }) => i.productId === product?.id,
  )

  useEffect(() => {
    if (basketItem && basketItem.quantity !== newQuantity) {
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
      ? dispatch(addBasketItemAsync({ productId, quantity }))
      : dispatch(removeBasketItemAsync({ productId, quantity }))
  }

  function handleConfigChange(e: any, key: string = '') {
    const current = checkedRadioButton.map(checked => checked.key === key ? {key: key, checkedValue: e} : checked)
    const hasKey = current.find(e => e.key === key)
    if(!hasKey) current.push({key: key, checkedValue: e})
    const newConfig = current.filter(e => e.checkedValue !== '')
    const newConfigValue = newConfig.map(e => e.checkedValue).join(' ')
    const currentConfig = product?.configurables?.find(e => e.value === newConfigValue)
    if(currentConfig) setConfig({config: currentConfig, value: currentConfig.value})
    setCheckedRadioButton(current)
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

  const cfgValues: { label: string; value: string }[] =
    product.configurables?.map((e) => ({ label: e.value, value: e.value })) || []

    
  const configMap: ConfigMap[] = []
  product.configPresets?.map(cfg => {
    const key = configMap.find(e => e.key === cfg.key)
    key ? key.values.push(cfg.value) : configMap.push({key: cfg.key, values: [cfg.value]})
  })
console.log(checkedRadioButton)

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
        <Grid container sx={{ marginTop: 4, marginBottom: 4, p: 1, gap: 1, flexDirection: 'column' }}>
          <Render condition={configMap.length > 0}>
            <>
              {configMap.map(cfg => {
                return (
                  <>
                <Box marginTop={1}>
                Choose {cfg.key}:
              </Box>
              <RadioButtonGroup
                flexDirection='row'
                selectedValue={checkedRadioButton.find(b => b.key === cfg.key)?.checkedValue || ''}
                options={cfg.values.map(e => ({value: e, label: e}))}
                onChange={(e) => handleConfigChange(e.target.value, cfg.key)}
              />
              </>
                )
              })}
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
