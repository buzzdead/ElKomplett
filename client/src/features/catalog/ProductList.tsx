import { Grid } from '@mui/material'
import { IProduct } from '../../app/models/product'
import React from 'react'
import ProductCard from './ProductCard'
import { useAppSelector } from '../../app/store/configureStore'
import ProductCardSkeleton from './ProductCardSkeleton'

interface Props {
  products: IProduct[]
}

export default function ProductList({ products }: Props) {
  const { productsLoaded } = useAppSelector((state) => state.catalog)

  return (
    <Grid container spacing={4}>
      {products.map((product) => (
        <Grid key={product.id} item xs={4}>
          {!productsLoaded ? <ProductCardSkeleton /> : <ProductCard product={product} />}
        </Grid>
      ))}
    </Grid>
  )
}
