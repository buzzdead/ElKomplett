import { Box, Card, CardContent, CardMedia, Grid, Skeleton, Typography } from '@mui/material'
import useProducts from 'app/hooks/useProducts'
import LoadingComponent from 'app/layout/LoadingComponent'
import SideBar from 'features/SideBar'
import ProductList from 'features/catalog/product/ProductList'
import ProductSearch from 'features/catalog/product/productSearch'
import { useCategory } from 'app/hooks/useCategory'
import Render from 'app/layout/Render'
import { useCategories } from 'app/hooks/useCategories'
import { Link } from 'react-router-dom'

export default function Category() {
  const { products, productsLoaded } = useProducts()
  const { category, categoryLoading } = useCategory()
  const { categories, categoriesLoading } = useCategories()

  return (
    <Grid container columnSpacing={4}>
      <Render condition={!categoriesLoading}>
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
      <Grid item xs={2.65}>
        <Card sx={{ width: 325, marginBottom: 2, bgcolor: 'special' }}>
          <Render condition={!categoryLoading}>
            <CardMedia
              sx={{ height: 225, backgroundSize: 'cover' }}
              image={category.pictureUrl}
              title={category.title}
            />
            <Skeleton animation='wave' variant='rectangular' height={225} />
          </Render>
          <CardContent>
            <Typography gutterBottom variant='h5' component='div'>
              {!categoryLoading ? (
                category.title
              ) : (
                <Skeleton animation='wave' height={60} width='80%' style={{}} />
              )}
            </Typography>
            <Typography variant='h6' fontSize={14} >
              {!categoryLoading ? (
                category.description
              ) : (
                <Skeleton animation='wave' height={60} width='80%' style={{}} />
              )}
            </Typography>
          </CardContent>
        </Card>
        <ProductSearch />
        <SideBar brands={[]} types={[]} />
      </Grid>
      <Grid item xs={9}>
        <ProductList loadingCondition={categoryLoading} products={products} />
      </Grid>
    </Grid>
  )
}
