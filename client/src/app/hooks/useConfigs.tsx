
import { Basket, BasketItem } from "app/models/basket"
import { Configurable, IProduct } from "app/models/product"
import { useAppDispatch } from "app/store/configureStore"
import { fetchProductAsync } from "features/catalog/catalogSlice"
import { useEffect, useState } from "react"

export type Config = {
    id?: number
    value: string
    config: Configurable
  }

export interface ConfigsState {
    basketItem: BasketItem | undefined
    config: Config | null
    currentPicture:
      | {
          pictureUrl: string
          publicId?: string | undefined
        }
      | undefined
    newQuantity: number | string
  }

interface Props {
    basket: Basket | null
    product: IProduct | undefined
    id: string | undefined
}

export const useConfigs = ({basket, product, id}: Props) => {
  const dispatch = useAppDispatch()
  const basketI = basket?.items.find(
    (i: { productId: number | undefined }) => i.productId === product?.id,
  )

  const isConfigurableProduct = product?.configurables && basketI?.configId === product?.configurables[0]?.id;

  const initializeState = () => ({
    basketItem: isConfigurableProduct ? basketI : undefined,
    newQuantity: isConfigurableProduct ? basketI?.quantity || 0 : 0,
    currentPicture: product?.configurables && product.configurables.length > 0
      ? product.configurables[0].images[0]
      : product?.images[0],
    config: product?.configurables
      ? {
          config: product.configurables[0],
          id: product.configurables[0]?.id || 0,
          value: product.configurables[0]?.value,
        }
      : null,
  });

  const [state, setState] = useState<ConfigsState>(initializeState());

  const updateState = <K extends keyof ConfigsState>(key: K, value: ConfigsState[K]) => {
    setState(prevState => ({ ...prevState, [key]: value }));
  }

  const updateProduct = () => {
    if (state.basketItem) {
      updateState('newQuantity', state.basketItem.quantity)
    }
    if (!product) dispatch(fetchProductAsync(parseInt(id!)))
  }

  const updateBasketItem = () => {
    const item = basket?.items.filter(
      (i: { productId: number | undefined }) => i.productId === product?.id,
    )

    if (item !== undefined && item.length > 0)
      updateState(
        'basketItem',
        item.find((e) => e.configId === state.config?.id),
      )
    else item !== undefined && updateState('basketItem', item[0])
  }

  useEffect(updateProduct, [id, state.basketItem, dispatch, product]);
  useEffect(updateBasketItem, [basket]);

  return { state, setState, updateState }
}