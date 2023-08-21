import { Grid, Typography } from '@mui/material'
import React, { useEffect } from 'react'
import LoadingComponent from '../../app/layout/LoadingComponent'
import { useAppDispatch } from '../../app/store/configureStore'
import { setPageNumber, setProductParams } from './catalogSlice'
import AppPagination from '../../app/components/AppPagination'
import useProducts from '../../app/hooks/useProducts'
import SideBar from '../SideBar'
import Render from '../../app/layout/Render'
import ProductSearch from './product/productSearch'
import ProductList from './product/ProductList'
import { useCategory } from 'app/hooks/useCategory'
import { Link } from 'react-router-dom'
import { useCategories } from 'app/hooks/useCategories'

export default function Catalog() {
  const { products, brands, types, filtersLoaded, metaData, productsLoaded } = useProducts()
  const dispatch = useAppDispatch()
  const {category, categoryLoading} = useCategory(0)
  const {categories} = useCategories()

  if(!filtersLoaded || categoryLoading) return <LoadingComponent message={'Loading categories'} />

  return (
    <Grid container columnSpacing={4}>
      <Grid
        sx={{
          display: 'flex',
          flexDirection: 'row',
          gap: 2.5,
          justifyContent: 'center',
          marginBottom: 2.5,
        }}
        item
        xs={12}
      >
        {categories.map((c) => {
          return (
            <Link style={{ textDecoration: 'none' }} key={c.id} to={`/catalog/categories/${c.id}`}>
              <Typography
                variant='overline'
                sx={{
                  fontSize: 14,
                  color: c.id === category.id ? 'blue' : 'black',
                  fontWeight: 500,
                }}
              >
                {c.title}
              </Typography>
            </Link>
          )
        })}
      </Grid>
      <Grid item xs={2}>
        <ProductSearch />
        <SideBar brands={brands} types={types} />
      </Grid>
      <Grid item xs={9}>
        <ProductList loadingCondition={!filtersLoaded || categoryLoading || !productsLoaded} products={products} />
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
