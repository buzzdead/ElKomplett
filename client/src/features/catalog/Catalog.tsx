import { Button, Grid, Skeleton, Typography } from '@mui/material'
import React from 'react'
import LoadingComponent from '../../app/layout/LoadingComponent'
import { useAppDispatch } from '../../app/store/configureStore'
import { setPageNumber } from './catalogSlice'
import AppPagination from '../../app/components/AppPagination'
import useProducts from '../../app/hooks/useProducts'
import SideBar from '../SideBar'
import Render from '../../app/layout/Render'
import ProductSearch from './product/productSearch'
import ProductList from './product/List/ProductList'
import { useCategory } from 'app/hooks/useCategory'
import { Link } from 'react-router-dom'
import { useCategories } from 'app/hooks/useCategories'
import './catalog.css'
import useView from 'app/hooks/useView'
import FilterListIcon from '@mui/icons-material/FilterList';
import { SidebarModal } from './SidebarModal'

export default function Catalog() {
  const { products, producers, productTypes, filtersLoaded, metaData, productsLoaded } = useProducts()
  const dispatch = useAppDispatch()
  const {category, categoryLoading} = useCategory(0)
  const {categories, categoriesLoading} = useCategories()
  const view = useView()
  const [showFilterModal, setShowFilterModal] = React.useState(false);

  const toggleFilterModal = () => {
    setShowFilterModal(!showFilterModal);
  };

  if(!filtersLoaded || categoryLoading) return <LoadingComponent message={'Loading categories'} />

  return (
    <Grid container columnSpacing={4} className='center-on-small'>
      <Render condition={!categoriesLoading}>
      <Grid
          sx={{
            display: 'flex',
            flexDirection: 'row',
            overflow: {xs: 'scroll', md: 'hidden'},
            marginBottom: 2.5,
            justifyContent: {xs: 'flex-start', md: 'center'}
          }}
          item
          xs={12}
          gap={2.5}
        >
           {categories.map((c) => (
              <Button
                component={Link}
                to={`/catalog/categories/${c.id}`}
                key={c.id}
                sx={{
                  my: 1,
                  minWidth: 150,
                  color: c.id === category.id ? 'primary.main' : 'text.secondary',
                  fontWeight: c.id === category.id ? 600 : 400,
                  fontSize: c.id === category.id ? '1rem' : '0.875rem',
                  height: 30,
                  '&:hover': {
                    backgroundColor: c.id === category.id ? 'primary' : 'grey.500',
                  },
                }}
              >
                {c.title}
              </Button>
            ))}
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
      
      <Grid item lg={2.65} xl={2.65} md={3} sm={6} xs={8} display={'flex'} flexDirection={view.view.mobile ? 'row' : 'column'}>
        <ProductSearch />
        <Render condition={!view.view.mobile}>
        <SideBar producers={producers} productTypes={productTypes} />
        <Button onClick={toggleFilterModal}>
        <FilterListIcon sx={{ height: 40, width: 40, display: 'flex', alignSelf: 'center', marginBottom: 2, position: 'absolute', right: 15}} fontSize='large' />
        </Button>
        </Render>
        <Render condition={view.view.ipad}>
          <SidebarModal onClose={toggleFilterModal} producers={producers} productTypes={productTypes} showModal={showFilterModal}/>
        </Render>
      </Grid>
      <Grid item xs={11} md={9}>
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
