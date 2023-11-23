import { ArrowDropDown, ArrowDropUp } from '@mui/icons-material'
import { Box, Typography } from '@mui/material'
import Render from 'app/layout/Render'
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

export const isSameDay = (date1: Date, date2: Date, previousDay?: boolean) => {
  const minus = previousDay && date2.getDate() > 0 ? 1 : 0
  return (
    date1.getDate() === date2.getDate() - minus &&
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear()
  )
}
const isSameMonth = (date1: Date, date2: Date, previousMonth?: boolean) => {
  const minus = previousMonth && date1.getMonth() > 0 ? 1 : 0
  return (
    date1.getMonth() - minus === date2.getMonth() && date1.getFullYear() === date2.getFullYear()
  )
}

const getOrderSum = (orders: Order[] | undefined, type: IncomeTypes, previous?: boolean) => {
  if (orders === undefined) return
  const toDaysDate = new Date()

  const ordersByType = orders.filter((e) => {
    const orderDate = new Date(e.orderDate)
    return type === 'Daily'
      ? isSameDay(orderDate, toDaysDate, previous)
      : type === 'Monthly'
      ? isSameMonth(toDaysDate, orderDate, previous)
      : orderDate.getFullYear() === toDaysDate.getFullYear()
  })
  const sumTotal = ordersByType.reduce((total, order) => total + order.subtotal, 0)
  return sumTotal
}

export const Income = ({ type, orders }: Props) => {
  const incomeType = incomeTypes.find((e) => e.variant === type)
  const total = currencyFormat(getOrderSum(orders, type) || 0)
  const total2 = currencyFormat(getOrderSum(orders, type, true) || 0)
  const deficit = parseInt(total2) > parseInt(total)
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
        <Render condition={deficit}>
          <ArrowDropDown color='warning' style={{ marginLeft: -5, fontSize: 38 }} />
          <ArrowDropUp color='success' style={{ marginLeft: -5, fontSize: 38 }} />
        </Render>
        <Box display='flex' flexDirection={'row'} alignItems={'flex-end'}>
          <Typography style={{ fontSize: 11, marginBottom: 1.5, marginRight: 1 }}>NOK</Typography>
          <Render condition={deficit}>
          <Typography>{currencyFormat((parseInt(total2) - parseInt(total)) * 100)}</Typography>
          <Typography>{total}</Typography>
          </Render>
          <Typography style={{ marginLeft: 5 }}>fra {incomeType?.from}</Typography>
        </Box>
      </Box>
    </Box>
  )
}
