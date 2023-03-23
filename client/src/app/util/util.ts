import { FieldValues } from "react-hook-form/dist/types";
import { ConfigPreset, Configurable } from "../models/product";

export function getCookie(key: string) {
    const b = document.cookie.match("(^|;)\\s*" + key + "\\s*=\\s*([^;]+)");
    return b ? b.pop() : "";
  }

export function currencyFormat(amount: number) {
    return '$' + (amount / 100).toFixed(2)
}

export const createNewConfig = (key: string, productId: number, value?: string, tempId?: number): Configurable => ({
  price: 0,
  key,
  value: value || '',
  quantityInStock: 1,
  productId,
  tempId: tempId
});

export  function getCombinations<T>(arrays: T[][]): T[] {
  if (arrays.length === 0) {
    return [] as T[];
  } else if (arrays.length === 1) {
    return arrays[0];
  } else {
    const [firstArray, ...remainingArrays] = arrays;
    const remainingCombinations = getCombinations(remainingArrays);
    const combinations = [];

    for (const value of firstArray) {
      for (const combination of remainingCombinations) {
        combinations.push(`${value} ${combination}`);
      }
    }

    return combinations as T[];
  }
}


export const AuthorisedRoles = ['Admin', 'Test']