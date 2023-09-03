import { Grid, Skeleton, Typography } from '@mui/material'
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
import './catalog.css'
import useView from 'app/hooks/useView'

export default function Catalog() {
  const { products, producers, productTypes, filtersLoaded, metaData, productsLoaded } = useProducts()
  const dispatch = useAppDispatch()
  const {category, categoryLoading} = useCategory(0)
  const {categories, categoriesLoading} = useCategories()
  const view = useView()

  if(!filtersLoaded || categoryLoading) return <LoadingComponent message={'Loading categories'} />

  return (
    <Grid container columnSpacing={4} className='center-on-small'>
      <Render condition={!categoriesLoading}>
      <Grid
        sx={{
          display: 'flex',
          flexDirection: 'row',
          gap: 2.5,
          justifyContent: 'center',
          marginBottom: 2.5,
          flexWrap: 'wrap'
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
                  color: c.id === category.id ? 'blue' : 'neutral.main',
                  fontWeight: 500,
                }}
              >
                {c.title}
              </Typography>
            </Link>
          )
        })}
        </Grid>
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
      <Skeleton animation='wave' variant='rectangular' height={35}  width={'60%'} />
          </Grid>
        </Render>
      
      <Grid item lg={2.65} xl={2.65} md={3} sm={6} xs={8}>
        <ProductSearch />
        <Render condition={!view.view.mobile}>
        <SideBar producers={producers} productTypes={productTypes} />
        </Render>
      </Grid>
      <Grid item xs={12} md={9}>
        <ProductList loadingCondition={!filtersLoaded || categoryLoading || !productsLoaded} products={products} />
      </Grid>
      <Grid item xs={3} />
      <Grid item xs={12} md={9} sx={{ mb: 2 }}>
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
