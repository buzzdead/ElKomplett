import { Grid } from '@mui/material'
import ProductList from './ProductList'
import React from 'react'
import LoadingComponent from '../../app/layout/LoadingComponent'
import { useAppDispatch } from '../../app/store/configureStore'
import { setPageNumber } from './catalogSlice'
import ProductSearch from './productSearch'
import AppPagination from '../../app/components/AppPagination'
import useProducts from '../../app/hooks/useProducts'
import SideBar from '../SideBar'
import Render from '../../app/layout/Render'

export default function Catalog() {
  const { products, brands, types, filtersLoaded, metaData } = useProducts()
  const dispatch = useAppDispatch()

  if (!filtersLoaded) return <LoadingComponent message={'Loading products...'} />
  return (
    <Grid container columnSpacing={4}>
      <Grid item xs={3}>
        <ProductSearch />
        <SideBar brands={brands} types={types} />
      </Grid>
      <Grid item xs={9}>
        <ProductList products={products} />
      </Grid>
      <Grid item xs={3} />
      <Grid item xs={9} sx={{ mb: 2 }}>
        <Render condition={metaData !== null}>
          <AppPagination
            metaData={metaData!}
            onPageChange={(page: number) => dispatch(setPageNumber({ pageNumber: page }))}
          />
        </Render>
      </Grid>
    </Grid>
  )
}
