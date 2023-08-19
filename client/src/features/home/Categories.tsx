import { Grid } from '@mui/material'
import CategoryCard from './CategoryCard'
import { useCategories } from 'app/hooks/useCategories'
import LoadingComponent from 'app/layout/LoadingComponent'

export default function Categories() {

  const {categories, categoriesLoading} = useCategories()
  if(categoriesLoading) return <LoadingComponent otherPos message='Categories loading'/>
  return (
    <Grid container spacing={2} sx={{ width: '100%' }}>
      {categories.map((category) => (
        <Grid key={category.id} item xs={2}>
          <CategoryCard title={category.title} pictureUrl={category.pictureUrl} id={category.id}/>
        </Grid>
      ))}
    </Grid>
  )
}
