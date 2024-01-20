// useFormLogic.js
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { validationSchema } from './checkoutValidation';
import agent from '../../app/api/agent';
import { StripeElementType } from '@stripe/stripe-js';

const steps = ['Shipping address', 'Review your order', 'Payment details']

export const useCheckoutForm = (activeStep: number) => {
  const currentValidationSchema = validationSchema[activeStep];
  const [cardState, setCardState] = useState<{
    elementError: { [key in StripeElementType]?: string }
  }>({ elementError: {} })
  const [cardComplete, setCardComplete] = useState({
    cardNumber: false,
    cardExpiry: false,
    cardCvc: false,
  })
  const methods = useForm({
    mode: 'all',
    resolver: yupResolver(currentValidationSchema),
  });

  const onCardInputChange = (event: any) => {
    setCardState({
      ...cardState,
      elementError: {
        ...cardState.elementError,
        [event.elementType]: event.error?.message,
      },
    });

    setCardComplete({ ...cardComplete, [event.elementType]: event.complete });
  };

  function submitDisabled(): boolean {
    if (activeStep === steps.length - 1) {
      return (
        !cardComplete.cardCvc ||
        !cardComplete.cardExpiry ||
        !cardComplete.cardNumber ||
        !methods.formState.isValid
      )
    } else {
      return !methods.formState.isValid
    }
  }

  useEffect(() => {
    agent.Account.fetchAddress().then((response) => {
      if (response) {
        methods.reset({ ...methods.getValues(), ...response, saveAddress: false });
      }
    });
  }, [methods]);

  return {methods, submitDisabled, onCardInputChange, cardState};
};
