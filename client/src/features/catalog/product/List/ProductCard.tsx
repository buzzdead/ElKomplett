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
    <Card sx={{ bgcolor: 'special4.main' }}>
      <Modal
        open={configure}
        onClose={setConfigureMode}
        aria-labelledby='modal-modal-title'
        aria-describedby='modal-modal-description'
      >
        <Configuring product={product} basket={basket} status={status} modal/>
      </Modal>
      <CardHeader
        avatar={<Avatar sx={{ backgroundColor: 'secondary.darker', fontSize: 14 }}>-10%</Avatar>}
        title={product.name}
        titleTypographyProps={{
          sx: { ...cellStyle, fontWeight: 'bold', color: 'primary.default', fontSize: 15, minHeight: '75px' },
        }}
      />
      <CardMedia
        sx={{
          height: '12.5vh',
          backgroundSize: 'contain',
        }}
        image={
          product.configurables && product?.configurables?.length > 0
            ? product.configurables[0]?.images[0].pictureUrl
            : product.images[0].pictureUrl
        }
        title={product.name}
      />
      <CardContent sx={{ paddingTop: 1, paddingBottom: 0 }}>
        <Box sx={{ display: 'flex', flexDirection: 'row', gap: view.view.ipad ? 0 : 2, justifyContent: 'center', width: '100%' }}>
          <Typography
            sx={{ textDecoration: 'line-through' }}
            gutterBottom
            variant='h5'
            color='text.primary'
          >
            {view.view.ipad ? '' : currencyFormat(product.price)}
          </Typography>
          <Typography gutterBottom variant='h6' color='secondary'>
            {currencyFormat(product.price * 0.9)}
          </Typography>
        </Box>
      </CardContent>
      <CardActions sx={{ display: 'flex', justifyContent: 'flex-start' }}>
        <LoadingButton
          sx={{ paddingLeft: 0, marginLeft: 0, minWidth: view.view.ipad ? 'inherit' : 64 }}
          loading={status === 'pendingAddItem' + product.id}
          disabled={product.configurables && product.configurables.length > 0}
          onClick={() => dispatch(addBasketItemAsync({ productId: product.id, quantity: 1 }))}
          size='small'
        >
          <Render condition={status !== 'pendingAddItem' + product.id}>
            <Badge
              badgeContent={basket?.items
                .filter((e) => e.productId === product.id)
                .reduce((acc, curr) => acc + curr.quantity, 0)}
              color='secondary'
            >
              <AddShoppingCartIcon sx={{ color: product.configurables && product.configurables.length > 0 ? 'grey' : 'neutral.dark', width: 30, height: 30 }} />
            </Badge>
          </Render>
        </LoadingButton>
        <Render condition={product.configurables && product.configurables.length > 0}>
          <LoadingButton
            sx={{ paddingLeft: 0, marginLeft: 0, minWidth: view.view.ipad ? 'inherit' : 64 }}
            loading={status === 'pendingAddItem' + product.id}
            onClick={setConfigureMode}
            size='small'
          >
            <BuildIcon fontSize='medium' color={'primary'} />
          </LoadingButton>
        </Render>

        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            sx={{ display: 'flex', gap: 1 }}
            component={Link}
            to={`/catalog/${product.id}`}
            size='large'
          >
            <ReadMoreIcon sx={{ color: 'secondary.darker', width: 40, height: 40 }} />
          </Button>
        </Box>
      </CardActions>
    </Card>
  )
}
