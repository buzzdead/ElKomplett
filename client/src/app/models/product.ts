export interface Configurable {
  id?: number;
  tempId?: number
  price: number;
  quantityInStock: number;
  key: string;
  value: string;
  productId?: number;
  pictureUrl?: string
  publicId?: string
  file?: any
}

export interface ConfigPreset {
  configPresetKeys: string[]
  configPresetValues: string[]
}

export interface IProduct {
    id: number;
    name: string;
    description: string;
    price: number;
    pictureUrl: string;
    type?: string;
    brand: string;
    quantityInStock?: number;
    configurable?: boolean;
    configurables?: Configurable[]
    configPresets?: {key: string, value: string}[]

  }

  export interface ProductParams {
    orderBy: string
    searchTerm?: string
    types: string[]
    brands: string[]
    pageNumber: number
    pageSize: number
  }