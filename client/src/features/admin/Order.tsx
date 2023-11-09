import agent from 'app/api/agent'
import { Order as order } from 'app/models/order'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import AppTable, { TableData } from 'app/components/AppTable/AppTable'
import { Box, Typography } from '@mui/material'
import LoadingComponent from 'app/layout/LoadingComponent'

export const Order = () => {
  const { id } = useParams<{ id: string }>()
  const [order, setOrder] = useState<order>()
  const [tableData, setTableData] = useState<TableData[]>([])
  const fetchOrder = async (orderId: number) => {
    const theId = orderId + 1
    try {
      await agent.Orders.fetch(theId).then((res) => {
        setOrder(res)
        setTable(res)
        console.log(res)
      })
    } catch (error) {
      console.log(error)
    }
  }
  const setTable = (ord: order) => {
    const tableD = [
      { key: 'Buyer', value: ord?.buyerId },
      { key: 'Order Date', value: new Date(ord.orderDate).toLocaleDateString() },
      { key: 'Order Status', value: ord?.orderStatus },
    ]
    setTableData(tableD)
  }
  useEffect(() => {
    if (id !== undefined) fetchOrder(parseInt(id))
  }, [id])

  return tableData.length === 0 ? <LoadingComponent /> : (
    <Box
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        gap: 10,
        alignItems: 'center',
        width: '100%',
      }}
    >
      <Typography paddingLeft={1} fontWeight={600} width={600}>
        Order: #{order?.id}
      </Typography>
      <Box style={{ width: 600 }}>
        <AppTable tableData={tableData} sx={{ maxWidth: 600 }} />
      </Box>
      <Typography borderBottom={'1px solid grey'} paddingLeft={1} paddingTop={5} fontWeight={600} width={600}>
        Address Information
      </Typography>
      <Box
        sx={{ width: 600, padding: 2, bgcolor: 'inherit' }}
      >
        <Typography>{order?.shippingAddress.fullName}</Typography>
        <Typography>{order?.shippingAddress.address1}</Typography>
        <Typography>
          {order?.shippingAddress.state}, {order?.shippingAddress.zip}
        </Typography>
        <Typography>{order?.shippingAddress.country}</Typography>
      </Box>
    </Box>
  )
}
