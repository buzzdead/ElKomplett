import { Paper } from '@mui/material'
import { TableData } from 'app/components/AppTable/AppTable'
import AppTable2D from 'app/components/AppTable/AppTable2D'
import { useOrder } from 'app/hooks/useOrders'
import useView from 'app/hooks/useView'
import LoadingComponent from 'app/layout/LoadingComponent'
import { Order } from 'app/models/order'
import { currencyFormat } from 'app/util/util'
import { useEffect, useState } from 'react'

export const AllOrders = () => {
  const [tableData, setTableData] = useState<TableData[][]>()
  const { view } = useView()
  const tableProps = {
    p: view.mobile ? '0 8px' : '16px',
    align: 'left',
  }

  const { orders, loading } = useOrder()

  useEffect(() => {
    if(loading) return
    const myTable: TableData[][] | undefined = orders?.map((order: Order): TableData[] => {
      return [
        {
          key: 'Order number',
          value: order.id,
          scope: 'row',
          component: 'th',
          sx: { ...tableProps },
        },
        {
          key: 'Total',
          value: currencyFormat(order.total),
        },
        {
          key: 'Order Date',
          value: order.orderDate.split('T')[0],
        },
        {
          key: 'Order Status',
          value: order.orderStatus,
        },
        {
          key: 'Buyer',
          value: order.buyerId,
        },
      ] 
    })
    setTableData(myTable)
  }, [orders])

  if (loading) return <LoadingComponent message='Loading orders' />

  return tableData && tableData.length > 0 ? (
    <AppTable2D
      clickable
      sxRow={{ '&:last-child td, &:last-child th': { border: 0 } }}
      tableData={tableData}
      component={Paper}
      url={'/admin/orders'}
      sx={{ minWidth: 350 }}
    />
  ) : null
}
