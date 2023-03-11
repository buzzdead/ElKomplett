import { FieldValues } from "react-hook-form/dist/types";
import { ConfigPreset, Configurable } from "../models/product";

export function getCookie(key: string) {
    const b = document.cookie.match("(^|;)\\s*" + key + "\\s*=\\s*([^;]+)");
    return b ? b.pop() : "";
  }

export function currencyFormat(amount: number) {
    return '$' + (amount / 100).toFixed(2)
}

export const AuthorisedRoles = ['Admin', 'Test']

export const handleProductsToAdd = (configurations: number, data: FieldValues, configs: Configurable[], preset?: ConfigPreset) => {
  const dataArray = []
  const {configPresetValues, configPresetKeys} = preset ?? {configPresetKeys: null, configPresetValues: null}

  for (let i = 0; i < configurations; i++) {
    const id = data[`id${i}`]
    const productId = data[`productId${i}`]
    const value = data[`value${i}`]
    const key = data[`key${i}`]
    const quantityInStock = data[`quantityInStock${i}`]
    const price = data[`price${i}`]
    const file = data[`file${i}`]
    const presetKeys = configPresetKeys
    const presetValues = configPresetValues ? configPresetValues[i].split(',') : null

    if (productId && value && key && quantityInStock && price) {
      if (id) {
        const cfg = configs && configs?.find((cfg) => cfg?.id?.toString() === id.toString())
        if (
          file === null &&
          value === cfg?.value.toString() &&
          key === cfg?.key.toString() &&
          quantityInStock === cfg?.quantityInStock.toString() &&
          price === cfg?.price.toString()
        )
          continue
        dataArray.push({ id, productId, value, key, quantityInStock, price, file })
      } else 
      preset ?
      dataArray.push({ productId, value, key, quantityInStock, price, file, presetValues, presetKeys })
      :
      dataArray.push({ productId, value, key, quantityInStock, price, file })
    }
  }
  return dataArray

}