import * as React from 'react'
import Typography from '@mui/material/Typography'
import { Grid } from '@mui/material'
import BasketSummary from '../basket/BasketSummary'
import { useAppSelector } from '../../app/store/configureStore'
import BasketTable from '../basket/BasketTable'

export default function Review() {
  const { basket } = useAppSelector((state) => state.basket)
  return (
    <>
      <Typography variant='h6' gutterBottom>
        Order summary
      </Typography>
      {basket && <BasketTable items={basket.items} isBasket={false} />}
      <Grid container>
        <Grid item xs={6} />
        <Grid item xs={6}>
          <BasketSummary />
        </Grid>
      </Grid>
    </>
  )
}
