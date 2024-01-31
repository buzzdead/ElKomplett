import React, { useEffect, useState } from 'react';
import { FieldValues, FormProvider, useForm } from 'react-hook-form';
import { Box, Button, Typography } from '@mui/material';
import AddressForm from 'features/checkout/AddressForm';
import { yupResolver } from '@hookform/resolvers/yup';
import { validationSchema } from 'features/checkout/checkoutValidation';
import agent from 'app/api/agent';
import { fetchCurrentUser } from '../accountSlice';
import { User } from 'app/models/user';

interface Props {
    user: User | null
    dispatch: any
}

export const ShippingAddress = ({user, dispatch}: Props) => {
    const [isSaved, setIsSaved] = useState(false);
    const currentValidationSchema = validationSchema[0]
    const formMethods = useForm({
        defaultValues: user?.address,
        resolver: yupResolver(currentValidationSchema),
        mode: 'all'
      });
    const [minimized, setMinimized] = React.useState(user?.address !== undefined);

    useEffect(() => {
        if(formMethods.formState.isDirty && isSaved) {
          setIsSaved(false);
        }
      }, [formMethods.formState])

    const onSubmit = async (data: FieldValues) => {
        // Handle form submission logic here
        const res = await agent.Account.updateAddress(data);
        setIsSaved(true);
        formMethods.reset(data)
        dispatch(fetchCurrentUser())
    };
     const hasErrors = Object.keys(formMethods.formState.errors).length > 0;

    return (
        <FormProvider {...formMethods}>
        <form onSubmit={formMethods.handleSubmit(onSubmit)}>
            <Box sx={{display: 'flex', flexDirection: 'column', gap: 2.5}}>
            <AddressForm saved={isSaved} alternativeSave minimized={minimized} hasErrors={hasErrors}/>
            <Button onClick={() => setMinimized(!minimized)} variant="contained" color="primary">
                {minimized ? "Show full address" : "Hide"}
            </Button>
            </Box>
        </form>
        </FormProvider>
        );
};

export default ShippingAddress;