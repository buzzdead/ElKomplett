import * as React from 'react'
import {
  productSelectors,
  fetchProductsAsync,
  fetchFilters,
} from '../../features/catalog/catalogSlice'
import { useAppSelector, useAppDispatch } from '../store/configureStore'

export default function useProducts(categoryId = 0, categoryLoading = false) {
  const products = useAppSelector(productSelectors.selectAll)
  const { productsLoaded, filtersLoaded, producers, productTypes, metaData } = useAppSelector(
    (state) => state.catalog,
  )
  const dispatch = useAppDispatch()

  React.useEffect(() => {
    if (!productsLoaded) dispatch(fetchProductsAsync())
  }, [productsLoaded, dispatch])

  React.useEffect(() => {
    if(categoryLoading) return
    dispatch(fetchFilters(categoryId))
  }, [dispatch, filtersLoaded, categoryId])

  return {
    products,
    productsLoaded,
    filtersLoaded,
    producers,
    productTypes,
    metaData,
  }
}
