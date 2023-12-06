import { Box, Button, Card, CardContent, CardMedia, Grid, Skeleton, Typography } from '@mui/material'
import useProducts from 'app/hooks/useProducts'
import LoadingComponent from 'app/layout/LoadingComponent'
import SideBar from 'features/SideBar'
import ProductList from 'features/catalog/product/List/ProductList'
import ProductSearch from 'features/catalog/product/productSearch'
import { useCategory } from 'app/hooks/useCategory'
import Render from 'app/layout/Render'
import { useCategories } from 'app/hooks/useCategories'
import { Link } from 'react-router-dom'
import './category.css'
import useView from 'app/hooks/useView'
import FilterListIcon from '@mui/icons-material/FilterList';
import { SidebarModal } from 'features/catalog/SidebarModal'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { CategoryList } from 'app/components/CategoryList'

export default function Category() {
 
  const { category, categoryLoading } = useCategory()
  const { products, productsLoaded, producers, productTypes } = useProducts(category.id, categoryLoading)
  const { categories, categoriesLoading } = useCategories()
  const [showFilterModal, setShowFilterModal] = useState(false);
  
  const toggleFilterModal = () => {
    setShowFilterModal(!showFilterModal);
  };

  const view = useView()
  if(categoryLoading) return null;
  return (
    <Grid container columnSpacing={4}>
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
          gap={2.5}
          xs={12}
        >
             <CategoryList categories={categories} category={category} />
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
          <Skeleton animation='wave' variant='rectangular' height={35} width={'60%'} />
        </Grid>
      </Render>
  
      <Grid item xs={12} className='center-on-small2' sx={{ display: 'flex', flexDirection: 'row', gap: { sm: 0, md: 5 } }}>
        <Grid item lg={2.65} xl={2.65} md={3} sm={6} xs={10} className='center-on-small2'>
         
  
          <Box display='flex' flexDirection={view.view.ipad ? 'row' : 'column'}>
            <ProductSearch />
  
            <Render condition={!view.view.mobile}>
              <SideBar producers={producers} productTypes={productTypes} />
              <Button onClick={toggleFilterModal} sx={{ height: 40, width: 40, display: 'flex', alignSelf: 'center', marginBottom: 2, position: 'absolute', right: 15 }}>
                <FilterListIcon fontSize='large' />
              </Button>
            </Render>
  
            <Render condition={view.view.ipad}>
              <SidebarModal onClose={toggleFilterModal} producers={producers} productTypes={productTypes} showModal={showFilterModal} />
            </Render>
          </Box>
        </Grid>
  
        <Grid item xs={11}>
          <ProductList loadingCondition={categoryLoading} products={products} />
        </Grid>
      </Grid>
    </Grid>
  );
  
}
