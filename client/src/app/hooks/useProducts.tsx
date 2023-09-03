import * as React from 'react'
import {
  productSelectors,
  fetchProductsAsync,
  fetchFilters,
} from '../../features/catalog/catalogSlice'
import { useAppSelector, useAppDispatch } from '../store/configureStore'

export default function useProducts() {
  const products = useAppSelector(productSelectors.selectAll)
  const { productsLoaded, filtersLoaded, producers, productTypes, metaData } = useAppSelector(
    (state) => state.catalog,
  )
  const dispatch = useAppDispatch()

  React.useEffect(() => {
    if (!productsLoaded) dispatch(fetchProductsAsync())
  }, [productsLoaded, dispatch])

  React.useEffect(() => {
    if (!filtersLoaded) dispatch(fetchFilters())
  }, [dispatch, filtersLoaded])

  return {
    products,
    productsLoaded,
    filtersLoaded,
    producers,
    productTypes,
    metaData,
  }
}
