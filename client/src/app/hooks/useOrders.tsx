import agent from 'app/api/agent'
import { Order } from 'app/models/order'
import { useEffect, useState } from 'react'

export const useOrder = () => {
  const [loading, setLoading] = useState(true)
  const [orders, setOrders] = useState<Order[]>()
  useEffect(() => {
    agent.Orders.allOrders()
      .then((orders) => {
        setOrders(orders)
      })
      .catch((error) => console.log(error))
      .finally(() => setLoading(false))
  }, [])
  return { loading, orders }
}
