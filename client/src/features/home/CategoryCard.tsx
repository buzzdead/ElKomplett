import { Card, CardHeader, CardMedia, Paper } from '@mui/material'
import { Link } from 'react-router-dom';

interface Props {
  id: number
  title: string
  pictureUrl: string
}

export default function CategoryCard({ title, pictureUrl, id }: Props) {
  return (
    <Link to={`/catalog/categories/${id}`} style={{ textDecoration: 'none' }}>
    <Card>
      <CardHeader
        title={title}
        sx={{maxHeight: 20, bgcolor: ''}}
        titleTypographyProps={{
          sx: {textAlign: 'center', color: 'neutral.darker'},
          
        }}
      />
      <CardMedia
      component={Paper}
        sx={{
          height: 180,
          backgroundSize: 'cover',
        }}
        image={pictureUrl}
        title={title}
      />
    </Card>
    </Link>
  )
}
