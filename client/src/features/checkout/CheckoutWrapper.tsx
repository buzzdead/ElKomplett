import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import * as React from 'react'
import { useEffect, useState } from 'react'
import agent from '../../app/api/agent'
import LoadingComponent from '../../app/layout/LoadingComponent'
import { useAppDispatch } from '../../app/store/configureStore'
import { setBasket } from '../basket/basketSlice'
import CheckoutPage from './CheckOutPage'

const stripePromise = loadStripe(
  'pk_test_51MX6rJEP2FAJR8soQgZo57KS7wklWRNaBzluWWud8XybhTJsgI0pL69OYAoXCCVwEe1H9UrEvg5Tp1MCm0XdBtCf00CaWltWtJ',
)

export default function CheckoutWrapper() {
  const dispatch = useAppDispatch()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    agent.Payments.createPaymentIntent()
      .then((basket) => dispatch(setBasket(basket)))
      .catch((error) => console.log(error))
      .finally(() => setLoading(false))
  }, [dispatch])

  if (loading) return <LoadingComponent message='Loading checkout...' />
  return (
    <Elements stripe={stripePromise}>
      <CheckoutPage />
    </Elements>
  )
}
