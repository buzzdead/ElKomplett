import {
  Avatar,
  Badge,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  Typography,
} from '@mui/material'
import { IProduct } from '../../../app/models/product'
import React from 'react'
import { Link } from 'react-router-dom'
import { LoadingButton } from '@mui/lab'
import { currencyFormat } from '../../../app/util/util'
import { useAppDispatch, useAppSelector } from '../../../app/store/configureStore'
import { addBasketItemAsync } from '../../basket/basketSlice'
import { ShoppingCart } from '@mui/icons-material'
import ReadMoreIcon from '@mui/icons-material/ReadMore';
import { blue, green, lightGreen } from '@mui/material/colors'
import Render from 'app/layout/Render'
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';

interface Props {
  product: IProduct
}

export default function ProductCard({ product }: Props) {
  const { status } = useAppSelector(state => state.basket)
  const dispatch = useAppDispatch()
  const { basket } = useAppSelector((state) => state.basket)

  return (
    <Card sx={{bgcolor: 'special'}}>
      <CardHeader
        avatar={
          <Avatar sx={{ backgroundColor: 'secondary.darker', fontSize: 14 }}>-10%</Avatar>
        }
        title={product.name}
        titleTypographyProps={{
          sx: { fontWeight: 'bold', color: 'primary.default', fontSize: 16 },
        }}
      />
      <CardMedia
        sx={{
          height: '12.5vh',
          backgroundSize: 'contain',
        }}
        image={product.configurables && product?.configurables?.length > 0 ? product.configurables[0]?.images[0].pictureUrl : product.images[0].pictureUrl}
        title={product.name}
      />
      <CardContent sx={{paddingTop: 1, paddingBottom: 0}}>
        <Box sx={{display: 'flex', flexDirection: 'row', gap: 2}}>
        <Typography sx={{textDecoration: 'line-through'}} gutterBottom variant='h5' color='text.primary'>
          {currencyFormat(product.price)}
        </Typography>
        <Typography gutterBottom variant='h6' color='secondary'>
          {currencyFormat(product.price  * 0.9)}
        </Typography>
        </Box>
      </CardContent>
      <CardActions sx={{display: 'flex', justifyContent: 'flex-start', width: '100%'}} >
        <LoadingButton sx={{paddingLeft: 0, marginLeft: 0}} loading={status === ('pendingAddItem' + product.id)} onClick={() => dispatch(addBasketItemAsync({productId: product.id, quantity: 1}))} size='small'>
        <Render condition={status !== ('pendingAddItem' + product.id)}>
        <Badge badgeContent={basket?.items.find(e => e.productId === product.id)?.quantity} color='secondary'>
        <AddShoppingCartIcon sx={{color: 'neutral.dark', width: 30, height: 30}}/>
        </Badge>
        </Render>
        </LoadingButton>
        <Box sx={{width: '100%', display: 'flex', justifyContent: 'flex-end'}}>
        <Button sx={{display: 'flex', gap: 1}} component={Link} to={`/catalog/${product.id}`} size='large'>
          <ReadMoreIcon sx={{color: 'secondary.darker', width: 40, height: 40}}/>
        </Button>
        </Box>
      </CardActions>
    </Card>
  )
}
