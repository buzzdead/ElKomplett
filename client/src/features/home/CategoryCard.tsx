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
  sx={{
    maxHeight: 20,
    bgcolor: 'white',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    backgroundColor: (theme) => theme.palette.mode2.main
  }}
  titleTypographyProps={{
    sx: {textAlign: 'center', color: (theme) => theme.palette.neutral.main}
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
