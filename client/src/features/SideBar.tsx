import { Paper } from '@mui/material'
import * as React from 'react'
import CheckboxButtons from '../app/components/AppCheckBox/CheckboxButtons'
import RadioButtonGroup from '../app/components/RadioButtonGroup'
import { useAppDispatch, useAppSelector } from '../app/store/configureStore'
import { setProductParams } from './catalog/catalogSlice'
import Render from 'app/layout/Render'

interface Props {
    producers: string[]
    productTypes: string[]
}

const sortOptions = [
    { value: 'name', label: 'Alfabetisk' },
    { value: 'priceDesc', label: 'Pris - Høy til lav' },
    { value: 'price', label: 'Pris - Lav til høy' },
  ]

export default function SideBar(props: Props) {
  const { productParams } = useAppSelector((state) => state.catalog)
  const dispatch = useAppDispatch()

  return (
    <div>
      <Paper sx={{ mb: 2, p: 2, bgcolor: 'special' , minWidth: 225}}>
        <RadioButtonGroup
          selectedValue={productParams.orderBy}
          flexDirection='column'
          options={sortOptions}
          onChange={(e) => dispatch(setProductParams({ orderBy: e.target.value }))}
        />
      </Paper>
      <Render condition={props.producers?.length > 0}>
      <Paper sx={{ mb: 2, p: 2, bgcolor: 'special', minWidth: 225  }}>
        <CheckboxButtons
          items={props.producers}
          checked={productParams.producers}
          onChange={(items: string[]) => dispatch(setProductParams({ producers: items }))}
        />
      </Paper>
      </Render>
      <Render condition={props.productTypes?.length > 0}>
      <Paper sx={{ mb: 2, p: 2, minWidth: 250 }}>
        <CheckboxButtons
          items={props.productTypes}
          checked={productParams.productTypes}
          onChange={(items: string[]) => dispatch(setProductParams({ productTypes: items }))}
        />
      </Paper>
      </Render>
    </div>
  )
}
