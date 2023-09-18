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
            gap: 2.5,
            flexWrap: 'wrap',
            justifyContent: 'center',
            marginBottom: 2.5,
          }}
          item
          xs={12}
        >
          {categories.map((c) => {
            return (
              <Link
                style={{ textDecoration: 'none' }}
                key={c.id}
                to={`/catalog/categories/${c.id}`}
              >
                <Typography
                  variant='overline'
                  sx={{
                    fontSize: c.id === category.id ? 15 : 14,
                    color: c.id === category.id ? 'primary.main' : 'neutral.main',
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
          <Skeleton animation='wave' variant='rectangular' height={35} width={'60%'} />
        </Grid>
      </Render>
      <Grid item xs={12} className='center-on-small2' sx={{display: 'flex', flexDirection: 'row', gap: 5}}>
      <Grid item lg={2.65} xl={2.65} md={3} sm={6} xs={10} className='center-on-small2'>
        <Card sx={{ width: '100%', marginBottom: 2, bgcolor: 'special' }}>
          <Render condition={!categoryLoading}>
            <CardMedia
              sx={{ height: 200, backgroundSize: 'cover' }}
              image={category.pictureUrl || ''}
              title={category.title}
            />
            <Skeleton animation='wave' variant='rectangular' height={225} />
          </Render>
          <Render condition={!view.view.mobile}>
          <CardContent>
            <Typography gutterBottom variant='h5' component='div'>
              {!categoryLoading ? (
                category.title
              ) : (
                <Skeleton animation='wave' height={60} width='80%' style={{}} />
              )}
            </Typography>
            <Typography variant='h6' fontSize={14}>
              {!categoryLoading ? (
                category.description
              ) : (
                <Skeleton animation='wave' height={60} width='80%' style={{}} />
              )}
            </Typography>
          </CardContent>
          </Render>
        </Card>
        <Box display='flex' flexDirection={view.view.ipad ? 'row' : 'column'}>

        
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
        </Box>
      </Grid>
      <Grid item xs={11} >
        <ProductList loadingCondition={categoryLoading} products={products} />
      </Grid>
      </Grid>
    </Grid>
  )
}
