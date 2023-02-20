import { Remove, Add, Delete } from '@mui/icons-material'
import { LoadingButton } from '@mui/lab'
import {
  Paper,
  Box,
} from '@mui/material'
import * as React from 'react'
import { TableData } from '../../app/components/AppTable/AppTable'
import AppTable2D from '../../app/components/AppTable/AppTable2D'
import { BasketItem } from '../../app/models/basket'
import { useAppSelector, useAppDispatch } from '../../app/store/configureStore'
import { currencyFormat } from '../../app/util/util'
import { removeBasketItemAsync, addBasketItemAsync } from './basketSlice'

interface Props {
  items: BasketItem[]
  isBasket?: boolean
}

export default function BasketTable({ items, isBasket = true }: Props) {
  const { status } = useAppSelector((state) => state.basket)
  const dispatch = useAppDispatch()

  const product = (item: BasketItem) => {
    return (
      <Box display='flex' alignItems='center'>
        <img
          src={item.pictureUrl}
          alt={item.name}
          style={{
            height: 50,
            marginRight: 20,
          }}
        />
        <span>{item.name}</span>
      </Box>
    )
  }

  const quantity = (item: BasketItem) => {
    return (
      <>
        <LoadingButton
          loading={status === 'pendingRemoveItem' + item.productId + 'rem'}
          color='error'
          onClick={() =>
            dispatch(
              removeBasketItemAsync({
                productId: item.productId,
                quantity: 1,
                name: 'rem',
              }),
            )
          }
        >
          <Remove />
        </LoadingButton>
        {item.quantity}
        {isBasket && (
          <LoadingButton
            loading={status === 'pendingAddItem' + item.productId}
            color='secondary'
            onClick={() => dispatch(addBasketItemAsync({ productId: item.productId }))}
          >
            <Add />
          </LoadingButton>
        )}{' '}
      </>
    )
  }

  const deleteButton = (item: BasketItem) => {
    return (
      <LoadingButton
        loading={status === 'pendingRemoveItem' + item.productId + 'del'}
        color='error'
        onClick={() =>
          dispatch(
            removeBasketItemAsync({
              productId: item.productId,
              quantity: item.quantity,
              name: 'del',
            }),
          )
        }
      >
        <Delete />
      </LoadingButton>
    )
  }

  const tableData: TableData[][] = items.map((item) => {
    return [
      {
        key: 'Product',
        value: product(item) as any,
      },
      {
        key: 'Price',
        value: currencyFormat(item.price),
        sx: { alignItems: 'right' },
      },
      {
        key: 'Quantity',
        value: quantity(item) as any,
        sx: { alignItems: 'center', textAlign: 'center' },
      },
      {
        key: 'Subtotal',
        value: currencyFormat(item.price * item.quantity),
        sx: { alignItems: 'right' },
      },
      {
        key: '',
        value: deleteButton(item) as any,
        sx: { alignItems: 'right' },
      },
    ]
  })

  return (
    <AppTable2D
      component={Paper}
      tableData={tableData}
      sx={{ '&:last-child td, &:last-child th': { border: 0 }, minWidth: 650 }}
    />
  )
}
