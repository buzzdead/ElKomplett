import { Paper } from '@mui/material'
import * as React from 'react'
import CheckboxButtons from '../app/components/AppCheckBox/CheckboxButtons'
import RadioButtonGroup from '../app/components/RadioButtonGroup'
import { useAppDispatch, useAppSelector } from '../app/store/configureStore'
import { setProductParams } from './catalog/catalogSlice'
import Render from 'app/layout/Render'

interface Props {
    brands: string[]
    types: string[]
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
      <Paper sx={{ mb: 2, p: 2 }}>
        <RadioButtonGroup
          selectedValue={productParams.orderBy}
          flexDirection='column'
          options={sortOptions}
          onChange={(e) => dispatch(setProductParams({ orderBy: e.target.value }))}
        />
      </Paper>
      <Render condition={props.brands.length > 0}>
      <Paper sx={{ mb: 2, p: 2 }}>
        <CheckboxButtons
          items={props.brands}
          checked={productParams.brands}
          onChange={(items: string[]) => dispatch(setProductParams({ brands: items }))}
        />
      </Paper>
      </Render>
      <Render condition={props.types.length > 0}>
      <Paper sx={{ mb: 2, p: 2 }}>
        <CheckboxButtons
          items={props.types}
          checked={productParams.types}
          onChange={(items: string[]) => dispatch(setProductParams({ types: items }))}
        />
      </Paper>
      </Render>
    </div>
  )
}
