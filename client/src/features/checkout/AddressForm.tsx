import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import React from 'react'
import { useFormContext } from 'react-hook-form'
import AppTextInput from '../../app/components/AppTextInput'
import AppCheckBox from '../../app/components/AppCheckBox/AppCheckBox'
import { AnimatePresence, motion } from 'framer-motion'
import { CssBaseline } from '@mui/material'
import Render from 'app/layout/Render'
import { LoadingButton } from '@mui/lab'
import { CheckCircleOutline } from '@mui/icons-material'

interface Props {
  minimized?: boolean
  alternativeSave?: boolean
  saved?: boolean
  hasErrors?: boolean
}

export default function AddressForm({ minimized, alternativeSave, hasErrors, saved = false }: Props) {
  const { control, formState } = useFormContext()
  return (
    <>
      <Typography variant='h6' gutterBottom>
        Shipping address
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={12}>
          <AppTextInput control={control} name='fullName' label='Full name' />
        </Grid>
        <AnimatePresence mode='wait'>
        <motion.div
          style={{width: '100%'}}
          variants={{
            open: { opacity: 1, height: 'auto' },
            closed: { opacity: 0, height: 0 },
          }}
          initial='closed'
          animate={minimized ? 'closed' : 'open'}
          transition={{ opacity: { duration: 0.1 }, height: { duration: 0.2 }}}
        >
              <Grid style={{paddingLeft: 20}} container spacing={3}>
        <Grid item xs={12} sm={6}></Grid>
        <Grid item xs={12}>
          <AppTextInput disabled={minimized} control={control} name='address1' label='Address 1' />
        </Grid>
        <Grid item xs={12}>
          <AppTextInput disabled={minimized} control={control} name='address2' label='Address 2' />
        </Grid>
        <Grid item xs={12} sm={6}>
          <AppTextInput disabled={minimized} control={control} name='city' label='City' />
        </Grid>
        <Grid item xs={12} sm={6}>
          <AppTextInput disabled={minimized} control={control} name='state' label='State' />
        </Grid>
        <Grid item xs={12} sm={6}>
          <AppTextInput disabled={minimized} control={control} name='zip' label='Zipcode' />
        </Grid>
        <Grid item xs={12} sm={6}>
          <AppTextInput disabled={minimized} control={control} name='country' label='Country' />
        </Grid>
        <Grid item xs={12}>
          <Render condition={alternativeSave}>
            <LoadingButton type='submit' disabled={!formState.isDirty || hasErrors}>
              Save Address
              {saved && <CheckCircleOutline style={{ color: 'green', marginLeft: 7.5 }} />} {/* Render checkmark icon if isSaved is true */}
            </LoadingButton>
          <AppCheckBox
            name='saveAddress'
            label='Save this as the default address'
            disabled={!formState.isDirty}
            control={control}
          />
          </Render>
        </Grid>
        </Grid>
        </motion.div>
        </AnimatePresence>
      </Grid>
    </>
  )
}
