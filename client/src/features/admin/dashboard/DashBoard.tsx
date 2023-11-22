import { Box, Card, CardContent, CardHeader, Grid, Typography } from '@mui/material'
import { Income, IncomeTypes } from './Income'
import { useOrder } from 'app/hooks/useOrders'
import { SalesChart } from './SalesChart'
import { OrderItem } from 'app/models/order'
import { currencyFormat } from 'app/util/util'

export const DashBoard = () => {
  const incomeTypes: IncomeTypes[] = ['Daily', 'Monthly', 'Yearly']
  const { loading, orders } = useOrder()
  const orderItems: OrderItem[] = orders
    ? orders
        .flatMap((order) => order.orderItems)
        .reduce((mergedItems, currentItem) => {
          const existingItem = mergedItems.find((item) => item.productId === currentItem.productId)

          if (existingItem) {
            existingItem.quantity += currentItem.quantity
          } else {
            mergedItems.push({ ...currentItem })
          }

          return mergedItems
        }, [] as OrderItem[])
        .sort((a, b) => b.quantity - a.quantity)
    : []

  const theItems = orders?.map((e) => {
    return {
      dateString: e.orderDate,
      quantity: e.orderItems
        ? e.orderItems.reduce((mergedQuantity, currentItem) => {
            return mergedQuantity + currentItem.quantity
          }, 0)
        : 0
    }
  })
  /* const getNumberOfOrdersToday = () => {
    const todaysDate = new Date()
    const ordersToday = orders?.filter((e) => {
      const orderDate = new Date(e.orderDate)
      return (
        orderDate.getDate() === todaysDate.getDate() &&
        orderDate.getFullYear() === todaysDate.getFullYear() &&
        orderDate.getMonth() === todaysDate.getMonth()
      )
    })
    return ordersToday?.length
  }

  const getAverageOrderValue = () => {
    const todaysDate = new Date()
    const ordersToday = orders?.filter((e) => {
      const orderDate = new Date(e.orderDate)
      return (
        orderDate.getDate() === todaysDate.getDate() &&
        orderDate.getFullYear() === todaysDate.getFullYear() &&
        orderDate.getMonth() === todaysDate.getMonth()
      )
    })
    const averageTotal = ordersToday?.reduce((mergedValue, currentOrder) => {
      return mergedValue + currentOrder.subtotal
    }, 0)
    return currencyFormat(Math.round((averageTotal || 0) / (ordersToday?.length || 1)))
  } */
  if (loading) return null
  return (
    <Grid
      container
      spacing={2}
      paddingLeft={{ md: 5, lg: 0, xs: 0, sm: 5 }}
      paddingRight={{ md: 5, lg: 0, xs: 0, sm: 5 }}
    >
      <Grid item lg={4} sm={12} xs={12}>
        <Card style={{ width: '100%', minHeight: 600 }}>
          <CardHeader
            title={
              <Typography variant='h6' style={{ fontSize: '18px' }}>
                Inntekter
              </Typography>
            }
          />
          <CardContent style={{ display: 'flex', flexDirection: 'column', gap: 25 }}>
            {incomeTypes.map((e, id) => (
              <Income key={id} type={e} orders={orders} />
            ))}
          </CardContent>
        </Card>
      </Grid>

      <Grid item lg={5} sm={12} container spacing={2} justifyContent='space-between'>
        <Grid item xs={12}>
          <Card style={{ minHeight: 375, width: '100%' }}>
            <CardHeader
              title={
                <Typography variant='h6' style={{ fontSize: '18px' }}>
                  Number of products sold
                </Typography>
              }
            />
            <SalesChart myData={theItems} />
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Card style={{ width: '100%', minHeight: 207.5 }}>
            <CardHeader
              title={
                <Typography variant='h6' style={{ fontSize: '18px' }}>
                  Top 5 items sold
                </Typography>
              }
            />
            <CardContent>
              {orderItems.map((e, id) => (
                <Box key={id} display='flex' flexDirection={'row'} justifyContent={'space-between'}>
                  <Typography>{e.name}</Typography>
                  <Typography>{e.quantity}</Typography>
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid item lg={3} sm={12} xs={12}>
        <Card style={{ width: '100%', minHeight: 600 }}>
          <CardHeader
            title={
              <Typography variant='h6' style={{ fontSize: '18px' }}>
                Orders today
              </Typography>
            }
          />
          <Box display={'flex'} flexDirection={'column'} gap={4} p={2}></Box>
        </Card>
      </Grid>
    </Grid>
  )
}
