import { Remove, Add, Delete } from '@mui/icons-material'
import { LoadingButton } from '@mui/lab'
import {
  Paper,
  Box,
  Typography,
} from '@mui/material'
import agent from 'app/api/agent'
import { Configurable } from 'app/models/product'
import * as React from 'react'
import { useEffect } from 'react'
import { TableData } from '../../app/components/AppTable/AppTable'
import AppTable2D from '../../app/components/AppTable/AppTable2D'
import { BasketItem } from '../../app/models/basket'
import { useAppSelector, useAppDispatch } from '../../app/store/configureStore'
import { currencyFormat } from '../../app/util/util'
import { removeBasketItemAsync, addBasketItemAsync } from './basketSlice'
import useView from 'app/hooks/useView'

interface Props {
  items: BasketItem[]
  isBasket?: boolean
}

export default function BasketTable({ items, isBasket = true }: Props) {
  const { status } = useAppSelector((state) => state.basket)
  const dispatch = useAppDispatch()
  const [config, setConfig] = React.useState<Configurable[]>()
  const view = useView();

  const renderConfiguration = (key: string, value: string) => (
    <Typography variant='caption' fontWeight={500}>{key}: {value}</Typography>
  );

  const renderConfigs = (cfg: Configurable | undefined) => {
    if(cfg === undefined) return null;
    const cfgKeys = cfg.key?.replace(',', '').split(' ')
    const cfgValues = cfg.value.split(' ')
    return cfgKeys.map((key, id) => renderConfiguration(key, cfgValues[id]));
  }

  const product = (item: BasketItem, cfg?: Configurable) => {
    return (
      <Box display='flex' flexDirection={'column'}>
      <Box display='flex' alignItems='center'>
        <img
          src={cfg?.images[0]?.pictureUrl || item.pictureUrl}
          alt={item.name}
          style={{
            height: view.view.mobile ? 50 : 75,
            marginRight: 20,
            marginBottom: 5,
          }}
        />
        <span>{item.name}</span>
      </Box>
      {renderConfigs(cfg)}
      </Box>
    )
  }

  const quantity = (item: BasketItem) => {
    const stat = item.configId ? 'pendingRemoveItem' + item.productId + '-' + item.configId + 'rem' : 'pendingRemoveItem' + item.productId +  'rem'
    const addStat = item.configId ? 'pendingAddItem' + item.productId + '-' + item.configId : 'pendingAddItem' + item.productId
    return (
      <>
        <LoadingButton
          loading={status === stat}
          color='error'
          onClick={() =>
            dispatch(
              removeBasketItemAsync({
                productId: item.productId,
                quantity: 1,
                configId: item.configId,
                name: item.configId ? '-' + item.configId + 'rem' : 'rem',
              }),
            )
          }
        >
          <Remove />
        </LoadingButton>
        {item.quantity}
        {isBasket && (
          <LoadingButton
            loading={status === addStat}
            color='secondary'
            onClick={() => dispatch(addBasketItemAsync({ productId: item.productId, quantity: 1, configId: item.configId }))}
          >
            <Add />
          </LoadingButton>
        )}{' '}
      </>
    )
  }

  const deleteButton = (item: BasketItem) => {
    const stat = item.configId ? 'pendingRemoveItem' + item.productId + '-' + item.configId + 'del' : 'pendingRemoveItem' + item.productId + 'del'  
    return (
      <LoadingButton
        loading={status === stat}
        color='error'
        sx={{minWidth: view.view.mobile ? '30px' : '64px'}}
        onClick={() =>
          dispatch(
            removeBasketItemAsync({
              productId: item.productId,
              quantity: item.quantity,
              configId: item.configId,
              name: item.configId ? '-' + item.configId + 'del' : 'del',
            }),
          )
        }
      >
        <Delete />
      </LoadingButton>
    )
  }

  const getConfig = async (configId: number | undefined) => {
    if (configId === undefined) return;
    const abc = await agent.Admin.getConfig(configId);
    return abc;
  };
  useEffect(() => {
    (async () => {
      await Promise.all(items.map((item) => getConfig(item.configId))).then(res => setConfig(res));
    })();
  }, [items]);

  const tableData: TableData[][] = items.map((item) => {
    const cfg = config?.find(cfg => cfg.id === item.configId)
    return [
      {
        key: 'Product',
        value: product(item, cfg) as any,
        sx: {padding: view.view.mobile ? '4px' : '16px'}
      },
      {
        key: 'Price',
        value: currencyFormat(cfg?.price || item.price),
        sx: { alignItems: 'right', padding: view.view.mobile ? '4px' : '16px' },
      },
      {
        key: 'Quantity',
        value: quantity(item) as any,
        sx: { alignItems: 'center', textAlign: 'center', padding: view.view.mobile ? '22px' : '16px' },
      },
      {
        key: 'Subtotal',
        value: currencyFormat((cfg?.price || item.price) * item.quantity),
        sx: { alignItems: 'right', padding: view.view.mobile ? '4px' : '16px' },
      },
      {
        key: '',
        value: deleteButton(item) as any,
        sx: { alignItems: 'right', padding: view.view.mobile ? '0px' : '16px' },
      },
    ]
  })

  return (
    <AppTable2D
      component={Paper}
      tableData={tableData}
      sx={{ '&:last-child td, &:last-child th': { border: 0 }, minWidth: 350 }}
    />
  )
}
