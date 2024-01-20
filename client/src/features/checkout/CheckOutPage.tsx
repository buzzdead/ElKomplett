import { Box, Button, Paper, Step, StepLabel, Stepper, Typography } from '@mui/material'
import { useState } from 'react'
import AddressForm from './AddressForm'
import PaymentForm from './PaymentForm'
import Review from './Review'
import React from 'react'
import { FieldValues, FormProvider, useForm } from 'react-hook-form'
import agent from '../../app/api/agent'
import { useAppDispatch, useAppSelector } from '../../app/store/configureStore'
import { clearBasket } from '../basket/basketSlice'
import { LoadingButton } from '@mui/lab'
import { StripeCardNumberElement } from '@stripe/stripe-js'
import { CardNumberElement, useElements, useStripe } from '@stripe/react-stripe-js'
import { useCheckoutForm } from './useCheckoutForm'

const steps = ['Shipping address', 'Review your order', 'Payment details']

export default function CheckoutPage() {
  const [activeStep, setActiveStep] = useState(0)
  const [orderNumber, setOrderNumber] = useState(0)
  const [loading, setLoading] = useState(false)
  const dispatch = useAppDispatch()
 
  const [paymentMessage, setPaymentMessage] = useState('')
  const [paymentSucceeded, setPaymentSucceeded] = useState(false)
  const { basket } = useAppSelector((state) => state.basket)
  const stripe = useStripe()
  const elements = useElements()
  const { methods, cardState, onCardInputChange, submitDisabled } = useCheckoutForm(activeStep);

 
  function CheckoutStepper({ activeStep }: { activeStep: number }) {
    return (
      <Stepper activeStep={activeStep} sx={{ pt: 3, pb: 5 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
    );
  }

  function getStepContent(step: number) {
    switch (step) {
      case 0:
        return <AddressForm />
      case 1:
        return <Review />
      case 2:
        return <PaymentForm cardState={cardState} onCardInputChange={onCardInputChange} />
      default:
        throw new Error('Unknown step')
    }
  }

  const getPaymentResult = async (cardElement: StripeCardNumberElement | null, nameOnCard: string) => {
    return await stripe?.confirmCardPayment(basket?.clientSecret!, {
      payment_method: {
        card: cardElement!,
        billing_details: {
          name: nameOnCard,
        },
      },
    });
  };

  async function submitOrder(data: FieldValues) {
    setLoading(true)
    const { nameOnCard, saveAddress, ...shippingAddress } = data
    if (!stripe || !elements) return
      //stripe is not ready
      try {
        const cardElement = elements?.getElement(CardNumberElement)
        const paymentResult = await getPaymentResult(cardElement, nameOnCard);
        
        if (paymentResult?.paymentIntent?.status === 'succeeded') {
          const orderNumber = await agent.Orders.create({ saveAddress, shippingAddress })
          setOrderNumber(orderNumber)
          setPaymentSucceeded(true)
          setPaymentMessage('Thank you - we have received your payment')
          setActiveStep(activeStep + 1)
          dispatch(clearBasket())
          setLoading(false)
        } else {
          setPaymentMessage(paymentResult?.error?.message!)
          setPaymentSucceeded(false)
          setLoading(false)
          setActiveStep(activeStep + 1)
        }
      } catch (error) {
        console.log(error)
        setLoading(false)
      }
  }

  const handleNext = async (data: FieldValues) => {
    if (activeStep === steps.length - 1) {
      await submitOrder(data)
    } else {
      setActiveStep(activeStep + 1)
    }
  }

  const handleBack = () => {
    setActiveStep(activeStep - 1)
  }

  return (
    <FormProvider {...methods}>
      <Paper variant='outlined' sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}>
        <Typography component='h1' variant='h4' align='center'>
          Checkout
        </Typography>
       <CheckoutStepper activeStep={activeStep}/>
        <form onSubmit={methods.handleSubmit(handleNext)}>
          {activeStep === steps.length ? (
            <>
              <Typography variant='h5' gutterBottom>
                {paymentMessage}
              </Typography>
              {paymentSucceeded ? (
                <Typography variant='subtitle1'>
                  Your order number is #{orderNumber}. We have not emailed your order confirmation,
                  and will not send you an update when your order has shipped, fakestore!
                </Typography>
              ) : (
                <Button variant='contained' onClick={handleBack}>
                  Go back and try again
                </Button>
              )}
            </>
          ) : (
            <>
              {getStepContent(activeStep)}
              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                {activeStep !== 0 && (
                  <Button onClick={handleBack} sx={{ mt: 3, ml: 1 }}>
                    Back
                  </Button>
                )}
                <LoadingButton
                  loading={loading}
                  disabled={submitDisabled()}
                  variant='contained'
                  type='submit'
                  sx={{ mt: 3, ml: 1 }}
                >
                  {activeStep === steps.length - 1 ? 'Place order' : 'Next'}
                </LoadingButton>
              </Box>
            </>
          )}
        </form>
      </Paper>
    </FormProvider>
  )
}
