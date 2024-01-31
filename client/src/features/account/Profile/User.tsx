import { LoadingButton } from '@mui/lab'
import { Box, Button, Grid, Typography } from '@mui/material'
import agent from 'app/api/agent'
import AppTextInput from 'app/components/AppTextInput'
import { User as UserType } from 'app/models/user'
import { useAppDispatch } from 'app/store/configureStore'
import { FieldValues, FormProvider, useForm } from 'react-hook-form'
import { fetchCurrentUser } from '../accountSlice'
import { useEffect, useState } from 'react'
import { CheckCircleOutline } from '@mui/icons-material'
import { validationSchema } from 'features/checkout/checkoutValidation'
import { yupResolver } from '@hookform/resolvers/yup'

interface Props {
  user: UserType | null
  isGoogle: boolean
  dispatch: any
}

export const User = ({ user, dispatch, isGoogle }: Props) => {
  const currentValidationSchema = validationSchema[4]
  const formMethods = useForm({ defaultValues: { email: user?.email, userName: user?.userName },  resolver:  yupResolver(currentValidationSchema), mode: 'onChange'  } )
  const [isSaved, setIsSaved] = useState(false);

  const onSubmit = async (data: FieldValues) => {
    // Handle form submission logic here
    const res = await agent.Account.changeUserDetails(data)
    console.log(res)
    setIsSaved(res.ok);
    res.ok && dispatch(fetchCurrentUser())
    res.ok &&  formMethods.reset(data);
  }
  
  useEffect(() => {
    if(formMethods.formState.isDirty && isSaved) {
      setIsSaved(false);
    }
  }, [formMethods.formState])

  return (
    <>
      <FormProvider {...formMethods}>
        <form onSubmit={formMethods.handleSubmit(onSubmit)}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            <Typography variant='h6' gutterBottom>
              User
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <AppTextInput disabled={isGoogle} control={formMethods.control} name='email' label='E-mail' />
              </Grid>
              <Grid item xs={12} sm={6}>
                <AppTextInput control={formMethods.control} name='userName' label='Username' />
              </Grid>
              <Grid item xs={12} >
                <LoadingButton
                  sx={{ display: 'flex', justifyContent: 'flex-start' }}
                  type='submit'
                  disabled={!formMethods.formState.isDirty}
                >
                   {isSaved ? 'Saved' : 'Save changes'}
                   {isSaved && <CheckCircleOutline style={{ color: 'green', marginLeft: 7.5 }} />} {/* Render checkmark icon if isSaved is true */}
                </LoadingButton>
              </Grid>
            </Grid>
          </Box>
        </form>
      </FormProvider>
    </>
  )
}

export default User
