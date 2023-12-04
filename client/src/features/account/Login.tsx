import * as React from 'react'
import Avatar from '@mui/material/Avatar'
import TextField from '@mui/material/TextField'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'
import { Button, Paper } from '@mui/material'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { FieldValues } from 'react-hook-form/dist/types'
import { LoadingButton } from '@mui/lab'
import { useAppDispatch } from '../../app/store/configureStore'
import { createTestAdmin, signInUser, signInUserWithGoogle } from './accountSlice'
import { GoogleLogin } from '@react-oauth/google'
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount'
import useView from 'app/hooks/useView'

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useAppDispatch()
  const view = useView()
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors, isValid },
  } = useForm({
    mode: 'onTouched',
  })

  async function submitForm(data: FieldValues) {
    try {
      await dispatch(signInUser(data))
      navigate(location.state?.from?.pathname || '/catalog')
    } catch (error) {
      console.log(error)
    }
  }

  const newAdmin = async () => {
    try {
      await dispatch(createTestAdmin({}))
      navigate(location.state?.from?.pathname || '/catalog')
    }
    catch (error) {
      console.log(error)
    }
  }

  const responseMessage = async (response: any) => {
    try {
      await dispatch(signInUserWithGoogle(response.credential))
      navigate(location.state?.from?.pathname || '/catalog')
    } catch (error) {
      console.log(error)
    }
  }
  const errorMessage = () => {
    console.log('error')
  }

  return (
    <Container
      component={Paper}
      maxWidth='sm'
      sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 4 }}
    >
      <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
        <LockOutlinedIcon />
      </Avatar>
      <Typography component='h1' variant='h5' marginBottom={2}>
        Sign in
      </Typography>
      <Box
        gap={2}
        maxHeight={{ xs: 30, sm: 39 }}
        minHeight={{ xs: 30, sm: 39 }}
        display='flex'
        flexDirection={'row'}
      >
        <GoogleLogin
          size={view.view.mobile ? 'medium' : 'large'}
          onSuccess={responseMessage}
          onError={errorMessage}
        />
        <Button
          sx={{ ':hover': { opacity: 0.8 } }}
          style={{ backgroundColor: 'white', textTransform: 'none', color: 'black' }}
          title='asdijf'
          onClick={newAdmin}
        >
          Test Admin <SupervisorAccountIcon style={{ marginLeft: 5, marginBottom: 5 }} />
        </Button>
      </Box>
      <Box component='form' onSubmit={handleSubmit(submitForm)} noValidate sx={{ mt: 1 }}>
        <TextField
          margin='normal'
          fullWidth
          label='Username'
          autoFocus
          {...register('username', { required: 'Username is required' })}
          error={!!errors.username}
          helperText={errors?.username?.message as string}
        />
        <TextField
          margin='normal'
          fullWidth
          label='Password'
          type='password'
          {...register('password', { required: 'Password is required' })}
          error={!!errors.password}
          helperText={errors?.password?.message as string}
        />
        <LoadingButton
          disabled={!isValid}
          loading={isSubmitting}
          type='submit'
          fullWidth
          variant='contained'
          sx={{ mt: 3, mb: 2 }}
        >
          Sign In
        </LoadingButton>
        <Grid container>
          <Link to='/register'>{"Don't have an account? Sign Up"}</Link>
        </Grid>
      </Box>
    </Container>
  )
}
