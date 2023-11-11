import { ArrowDropUp } from '@mui/icons-material'
import { Box, Typography } from '@mui/material'
import { Order } from 'app/models/order'
import { currencyFormat } from 'app/util/util'

export type IncomeTypes = 'Daily' | 'Monthly' | 'Yearly'
type Income = { variant: IncomeTypes; header: string; from: string }

const incomeTypes: Income[] = [
  { variant: 'Daily', header: 'I dag', from: 'i går' },
  { variant: 'Monthly', header: 'Denne måneden', from: 'forrige måned' },
  { variant: 'Yearly', header: 'I år', from: 'i fjor' },
]

interface Props {
  type: IncomeTypes
  orders: Order[] | undefined
}

const getOrderSum = (orders: Order[] | undefined, type: IncomeTypes) => {
  if (orders === undefined) return
  const toDaysDate = new Date()
  const ordersByType = orders.filter((e) => {
    const orderDate = new Date(e.orderDate)
    return type === 'Daily'
      ? orderDate.getDay() === toDaysDate.getDay()
      : type === 'Monthly'
      ? orderDate.getMonth() === toDaysDate.getMonth()
      : orderDate.getFullYear() === toDaysDate.getFullYear()
  })
  const sumTotal = ordersByType.reduce((total, order) => total + order.subtotal, 0);
  return sumTotal
}

export const Income = ({ type, orders }: Props) => {
  const incomeType = incomeTypes.find((e) => e.variant === type)
  const total = currencyFormat(getOrderSum(orders, type) || 0)
  return (
    <Box>
      <Box display='flex' flexDirection={'row'} gap={0.5}>
        <Typography
          style={{ fontWeight: 600, fontSize: 24, marginBottom: 10, alignSelf: 'flex-end' }}
        >
          NOK
        </Typography>
        <Typography style={{ fontWeight: 600, fontSize: 48 }}>{total}</Typography>
      </Box>
      <Typography style={{}}>{incomeType?.header}</Typography>
      <Box display='flex' flexDirection={'row'} alignItems={'center'}>
        <ArrowDropUp color='success' style={{ marginLeft: -5, fontSize: 38 }} />
        <Box display='flex' flexDirection={'row'} alignItems={'flex-end'}>
          <Typography style={{ fontSize: 11, marginBottom: 1.5, marginRight: 1 }}>NOK</Typography>
          <Typography>{total}</Typography>
          <Typography style={{ marginLeft: 5 }}>fra {incomeType?.from}</Typography>
        </Box>
      </Box>
    </Box>
  )
}
