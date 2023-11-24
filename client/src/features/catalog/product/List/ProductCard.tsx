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
  Modal,
  Typography,
} from '@mui/material'
import { IProduct } from '../../../../app/models/product'
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { LoadingButton } from '@mui/lab'
import { currencyFormat } from '../../../../app/util/util'
import { useAppDispatch, useAppSelector } from '../../../../app/store/configureStore'
import { addBasketItemAsync } from '../../../basket/basketSlice'
import ReadMoreIcon from '@mui/icons-material/ReadMore'
import Render from 'app/layout/Render'
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart'
import BuildIcon from '@mui/icons-material/Build'
import useView from 'app/hooks/useView'
import { Configuring } from './Configuring'
import '../Product.css'

interface Props {
  product: IProduct
}

export default function ProductCard({ product }: Props) {
  const { status } = useAppSelector((state) => state.basket)
  const dispatch = useAppDispatch()
  const view = useView()
  const { basket } = useAppSelector((state) => state.basket)
  const [configure, setConfigure] = useState(false)

  const setConfigureMode = () => {
    setConfigure(!configure)
  }

  const cellStyle = {
    display: '-webkit-box',
    WebkitBoxOrient: 'vertical',
    WebkitLineClamp: 2,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    maxHeight: '60px',
  }
  return (
    <Card sx={{
      bgcolor: 'background.paper',
      boxShadow: '0 4px 12px 0 rgba(0,0,0,0.2)',
      borderRadius: '16px',
      '&:hover': {
        boxShadow: '4px 6px 32px 0 rgba(0,0,0,0.3)',
        scale: {md: '1.02'}
      },
      overflow: 'hidden',
      transition: 'box-shadow 0.3s ease-in-out, scale  0.4s ease-in-out', // added transform to transition
    }}>
      <Modal
        open={configure}
        onClose={setConfigureMode}
        aria-labelledby='modal-modal-title'
        aria-describedby='modal-modal-description'
      >
        <Configuring product={product} basket={basket} status={status} modal/>
      </Modal>
      <CardHeader
        avatar={<Avatar sx={{ bgcolor: 'neutral.light', width: '50px', height: '50px', color: 'neutral.darker', fontWeight: 600, fontSize: 15 }}>-10%</Avatar>}
        title={<div className='cellStyle'>{product.name}</div> as any}
        titleTypographyProps={{
          sx: { fontWeight: 'bold', color: 'text.primary', fontSize: '1rem' },
        }}
      />
      <CardMedia
        component="img"
        sx={{
          height: 140,
          objectFit: 'contain',
          p: 2,
        }}
        image={
          product.configurables && product?.configurables?.length > 0
            ? product.configurables[0]?.images[0].pictureUrl
            : product.images[0].pictureUrl
        }
        alt={product.name}
      />
      <CardContent>
        <Box sx={{ display: 'flex', gap: 2.5, alignItems: 'center', justifyContent: 'center' }}>
          <Typography
            sx={{ textDecoration: 'line-through' }}
            variant='button'
            color='text.secondary'
             fontSize={16}
             fontWeight={600}
          >
            {currencyFormat(product.price)}
          </Typography>
          <Typography fontSize={16}
          fontWeight={600} variant='button' color='primary.darker'>
            {currencyFormat(product.price * 0.9)}
          </Typography>
        </Box>
      </CardContent>
      <CardActions sx={{ display: 'flex', justifyContent: 'space-between', p: 0, pb : 2, px: 2 }}>
        <LoadingButton
        sx={{ minWidth: '48px'}}
          loading={status === 'pendingAddItem' + product.id}
          disabled={product.configurables && product.configurables.length > 0}
          onClick={() => dispatch(addBasketItemAsync({ productId: product.id, quantity: 1 }))}
          startIcon={<Badge
            badgeContent={basket?.items
              .filter((e) => e.productId === product.id)
              .reduce((acc, curr) => acc + curr.quantity, 0)}
            color='secondary'
          ><AddShoppingCartIcon sx={{color: (theme) => product.configurables && product.configurables.length > 0 ? 'dark' : theme.palette.warning.main}} fontSize='medium' /></Badge>}
          size='medium'
        />
        {product.configurables && product.configurables.length > 0 && (
          <LoadingButton
            loading={status === 'pendingAddItem' + product.id}
            onClick={setConfigureMode}
            sx={{color: (theme) => theme.palette.warning.main, minWidth: '48px'}}
            startIcon={<BuildIcon />}
            size='medium'
          />
        )}
        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'flex-end' }}>
          <LoadingButton
            sx={{ display: 'flex', gap: 1, minWidth: '48px' }}
            component={Link}
            to={`/catalog/${product.id}`}
            size='medium'
            startIcon={<ReadMoreIcon sx={{ color: (theme) => theme.palette.secondary.light, width: 30, height: 30 }} />}
          >
            
          </LoadingButton>
          </Box>
      </CardActions>
    </Card>
  );
  
}
