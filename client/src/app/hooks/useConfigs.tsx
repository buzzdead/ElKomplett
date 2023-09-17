
import { Basket, BasketItem } from "app/models/basket"
import { Configurable, IProduct } from "app/models/product"
import { useState } from "react"

type Config = {
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
    newQuantity: number
  }

interface Props {
    basket: Basket | null
    product: IProduct | undefined
}

export const useConfigs = ({basket, product}: Props) => {
  const basketI = basket?.items.find(
    (i: { productId: number | undefined }) => i.productId === product?.id,
  )

    const [state, setState] = useState<ConfigsState>({
        basketItem: basketI,
        newQuantity: basketI?.quantity || 0,
        currentPicture:
          product?.configurables && product.configurables.length > 0
            ? product.configurables[0].images[0]
            : product?.images[0],
        config: product?.configurables
          ? {
              config: product.configurables[0],
              id: product.configurables[0]?.id || 0,
              value: product.configurables[0]?.value,
            }
          : null,
      })
      const updateState = <K extends keyof ConfigsState>(key: K, value: ConfigsState[K]) => {
        setState({ ...state, [key]: value })
      }

      return { state, setState, updateState }

}