import { Grid, useMediaQuery } from '@mui/material'
import { IProduct } from '../../../app/models/product'
import React from 'react'
import ProductCard from './ProductCard'
import { useAppSelector } from '../../../app/store/configureStore'
import ProductCardSkeleton from './ProductCardSkeleton'
import Render from '../../../app/layout/Render'

interface Props {
  products: IProduct[]
  loadingCondition?: boolean
}

export default function ProductList({ products, loadingCondition = false }: Props) {
  const isMobileMatch = useMediaQuery('(max-width:900px)')
  const { productsLoaded } = useAppSelector((state: { catalog: any }) => state.catalog)

  return (
    <Grid container spacing={4}>
      {products.map((product) => (
        <Grid key={product.id} item xs={isMobileMatch ? 6 : 3}>
          <Render condition={productsLoaded && !loadingCondition}>
            <ProductCard product={product} />
            <ProductCardSkeleton />
          </Render>
        </Grid>
      ))}
    </Grid>
  )
}
