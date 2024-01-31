import { yupResolver } from "@hookform/resolvers/yup"
import { CheckCircleOutline } from "@mui/icons-material"
import { LoadingButton } from "@mui/lab"
import { Box, Grid, Typography } from "@mui/material"
import agent from "app/api/agent"
import AppTextInput from "app/components/AppTextInput"
import Render from "app/layout/Render"
import { validationSchema } from "features/checkout/checkoutValidation"
import { useEffect, useState } from "react"
import { FormProvider, useForm } from "react-hook-form"

interface Props {
  isGoogle: boolean
}

export const Password = ({isGoogle}: Props) => {
  const [confirmed, setConfirmed] = useState(false)
  const [isSaved, setIsSaved] = useState(false);
  const [oldPasswordError , setOldPasswordError] = useState(false)
  const currentValidationSchema = validationSchema[3]
    const formMethods = useForm({resolver: yupResolver(currentValidationSchema),  mode: 'onChange', defaultValues: {password: '', passwordConfirm: '', oldpassword: ''}
      })

      const hasErrors = Object.keys(formMethods.formState.errors).length > 0;

      const confirm = () => {
        setConfirmed(true)
      }

      const renderConfirmed = () => {
        return (
          <Grid item xs={12}>
            <AppTextInput type="password" autoComplete="new-password" control={formMethods.control} name='oldpassword' label='Old Password' />
          </Grid>
        )
      }

      const renderUnconfirmed = () => {
        return (
          <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
          <AppTextInput type="password" disabled={isGoogle} autoComplete="new-password"  control={formMethods.control} name='password' label='New Password' />
          </Grid>
          <Grid item xs={12} sm={6}>
          <AppTextInput type="password" disabled={isGoogle} autoComplete="new-password" control={formMethods.control} name='passwordConfirm' label='Confirm New Password' />
          </Grid>
          </Grid>
        )
      }

      const onSubmit = async (data: any) => {
        try {
          const res = await agent.Account.changePassword(data);
          setIsSaved(true)
          setConfirmed(false)
          setOldPasswordError(false)
          formMethods.reset();
        }
        catch (error) {
          if(error[0]?.code === 'PasswordMismatch') {
            setOldPasswordError(true)
          }
        }
        
      }

      useEffect(() => {
        if(formMethods.formState.isDirty && isSaved && !confirmed) {
          setIsSaved(false);
        }
      }, [formMethods.formState])
      
    return (
      <FormProvider {...formMethods}>
        <form onSubmit={formMethods.handleSubmit(onSubmit)}>
      <Box sx={{display: 'flex', flexDirection: 'column', gap: 2.5}}>
        <Typography variant='h6' gutterBottom>Password</Typography>
        <Render condition={confirmed}>
          {renderConfirmed()}
          {renderUnconfirmed()}
        </Render>
        
        <Grid item xs={12} >
        <LoadingButton sx={{display: 'flex', justifyContent: 'flex-start'}} onClick={confirmed ? formMethods.handleSubmit(onSubmit) : () => confirm()} disabled={!formMethods.formState.isDirty || hasErrors}>
              {confirmed ? 'SET NEW PASSWORD' : 'Confirm'}
              {isSaved && <CheckCircleOutline style={{ color: 'green', marginLeft: 7.5 }} />} {/* Render checkmark icon if isSaved is true */}
              {oldPasswordError && <Typography sx={{color: 'red', marginLeft: 7.5}}>Old password is incorrect</Typography>}
          </LoadingButton>
          </Grid>
        </Box>
        </form>
      </FormProvider>
    )
}

export default Password