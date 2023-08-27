import { useAppDispatch, useAppSelector } from "app/store/configureStore"
import { addBasketItemAsync, removeBasketItemAsync } from '../../basket/basketSlice'
import { BasketItem } from "app/models/basket"
import { Box, Grid, TextField } from "@mui/material"
import { LoadingButton } from "@mui/lab"
import { Configurable } from "app/models/product"
import { useEffect, useState } from "react"
import { Abc } from "@mui/icons-material"
import { current } from "@reduxjs/toolkit"

type Config = {
    id?: number
    value: string
    config: Configurable
  }

type Quantity = {currentQuantity: number}

type Abc = Config & Quantity

interface Props {
    newQuantity: number
    setNewQuantity: (quantity: number) => void
    basketItem: BasketItem | undefined
    config: Config | null
    productId: number
}
//Problemet er basketItem
export const ProductQuantity = ({setNewQuantity, newQuantity, basketItem, config, productId}: Props) => {
    const { status: productStatus } = useAppSelector((state) => state.catalog)
    const dispatch = useAppDispatch()
    const [currentConfig, setCurrentConfig] = useState(config)
    const [configList, setConfigList] = useState<Abc[]>(config ? [{...config, currentQuantity: 0}] : [])

    useEffect(() => {
        if(!configList.find(c => c.id === config?.id)) {configList.push({...config!, currentQuantity: 0}); setNewQuantity(0)}
        else {
            const currentQuantity = configList.find(c => c.config.id === config?.id)?.currentQuantity
            setNewQuantity(currentQuantity!)
        }
        setCurrentConfig(config)
    }, [config])

    function handleInputChange(event: any) {
      if (event.target.value >= 0) {
        setNewQuantity(parseInt(event.target.value))
      }
    }

      function handleUpdateCart() {

        const configsQuantity = configList.find(c => c.id === currentConfig?.id)?.currentQuantity || 0

        const quantity = Math.abs(newQuantity - (configsQuantity))
        const addToCart = !basketItem || newQuantity > configsQuantity

        const newConfigList = configList.map(c => c.id !== currentConfig?.id ? c : {...c, currentQuantity: newQuantity})
        setConfigList(newConfigList)
    
        addToCart
          ? config
            ? dispatch(addBasketItemAsync({ productId, quantity, configId: config.id }))
            : dispatch(addBasketItemAsync({ productId, quantity }))
          : dispatch(removeBasketItemAsync({ productId, quantity }))
      }

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
        const configsQuantity = configList.find(c => c.id === currentConfig?.id)?.currentQuantity || 0
        const quantityChanged =
          configsQuantity === newQuantity || (!basketItem && newQuantity === 0)
        return (
          <Grid item xs={3}>
            <LoadingButton
              disabled={quantityChanged}
              loading={productStatus.includes('pending')}
              onClick={handleUpdateCart}
              sx={{ height: '55px' }}
              color='primary'
              size='large'
              variant='contained'
              fullWidth
            >
              {basketItem && configsQuantity > 0 ? 'Update Quantity' : 'Add to cart'}
            </LoadingButton>
          </Grid>
        )
      }
      return (
        <>
            {renderQuantityField()}
            {renderUpdateCartButton()}
            </>
      )
    
}