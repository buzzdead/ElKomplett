import React, { useState } from 'react'
import { Box, Button, Grid, TextField } from '@mui/material'
import { useFieldArray, Controller } from 'react-hook-form'
import AppTextInput from 'app/components/AppTextInput'
import { HeaderKey } from './HeaderKey'

interface ProductSpecificationProps {
  control: any
  id: number
}

const ProductSpecification: React.FC<ProductSpecificationProps> = ({ control, id }) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: `${id}specification`,
  })

  const [headerKeys, setHeaderKeys] = useState(['Key1'])

  return (
    <Grid container style={{ display: 'flex', gap: 10, flexDirection: 'column' }}>
      <Grid item xs={2} display={'flex'} flexDirection={'row'}>
        <Controller
          name={`${id}specification.header`}
          control={control}
          render={({ field }) => <AppTextInput control={control} label='Header' name={`${id}header`} />}
        />
        <Button
                variant='outlined'
                color='success'
                onClick={() => setHeaderKeys([...headerKeys, `Key${headerKeys.length + 1}`])}
              >
                Add Key
              </Button>
      </Grid>
      {headerKeys.map((hk) => <HeaderKey control={control} id={id} hk={hk}/> )}
    </Grid>
  )
}

export default ProductSpecification
