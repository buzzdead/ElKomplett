import { ArrowDropDown, ArrowDropUp } from '@mui/icons-material'
import { Box, Card, CardContent, CardHeader, Typography } from '@mui/material'
import { Income, IncomeTypes } from './Income'
import { useOrder } from 'app/hooks/useOrders'
import { SalesChart } from './SalesChart'
import { OrderItem } from 'app/models/order'

export const DashBoard = () => {
  const incomeTypes: IncomeTypes[] = ['Daily', 'Monthly', 'Yearly']
  const { loading, orders } = useOrder()
  const orderItems: OrderItem[] = orders
    ? orders
        .flatMap((order) => order.orderItems)
        .reduce((mergedItems, currentItem) => {
          const existingItem = mergedItems.find((item) => item.productId === currentItem.productId)

          if (existingItem) {
            // If the item already exists, increase the quantity
            existingItem.quantity += currentItem.quantity
          } else {
            // If the item does not exist, add it to the merged list
            mergedItems.push({ ...currentItem }) // Using spread to create a new object
          }

          return mergedItems
        }, [] as OrderItem[]) // Ensure mergedItems is typed as OrderItem[]
        .sort((a, b) => b.quantity - a.quantity)
    : []

    const theItems = orders?.map(e => {
      return {
        dateString: e.orderDate,
        quantity: e.orderItems ? e.orderItems.reduce((mergedQuantity, currentItem) => {
          return mergedQuantity + currentItem.quantity;
        }, 0) : 0, // Provide an initial value of 0 if orderItems is undefined
      };
    });
if(loading) return null
  return (
    <Box display='flex' flexDirection={'row'} gap={2.5}>
      <Card style={{ width: 400 }}>
        <CardHeader
          title={
            <Typography variant='h6' style={{ fontSize: '18px' }}>
              Inntekter
            </Typography>
          }
        />
        <CardContent style={{ display: 'flex', flexDirection: 'column', gap: 50 }}>
          {incomeTypes.map((e) => (
            <Income type={e} orders={orders} />
          ))}
        </CardContent>
      </Card>
      <Box display='flex' flexDirection='column' gap={2.5}>
        <Card style={{ maxHeight: 420, minHeight: 375 }}>
          <CardHeader title={<Typography variant='h6' style={{ fontSize: '18px' }}>Number of products sold</Typography>} />
          <SalesChart myData={theItems} />
        </Card>
        <Card style={{minHeight: 325}}>
          <CardHeader  title={<Typography variant='h6' style={{ fontSize: '18px' }}>Top 5 items sold</Typography>} />
          <CardContent>
            {orderItems.map((e) => (
              <Box display='flex' flexDirection={'row'} justifyContent={'space-between'}>
                <Typography>{e.name}</Typography>
                <Typography>{e.quantity}</Typography>
              </Box>
            ))}
          </CardContent>
        </Card>
      </Box>
      <Card style={{ width: 300 }}>
        <CardHeader  title={<Typography variant='h6' style={{ fontSize: '18px' }}>Orders today</Typography>}  />
        <Box marginLeft={2}>
        {orders?.map(e => <Typography>{e.shippingAddress.fullName}</Typography>)}
        </Box>
      </Card>
    </Box>
  )
}
