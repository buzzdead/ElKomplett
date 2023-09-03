export interface Configurable {
  id?: number;
  tempId?: number
  price: number;
  quantityInStock: number;
  key: string;
  value: string;
  productId?: number;
  images: {pictureUrl: string, publicId?: string}[];
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
    images: {pictureUrl: string, publicId?: string}[];
    productType?: {id: number, name: string};
    producer: {id: number, name: string};
    producerName: string
    productTypeName: string
    quantityInStock?: number;
    configurable?: boolean;
    configurables?: Configurable[]
    configPresets?: {key: string, value: string}[]
    categoryId?: number

  }

  export interface ProductParams {
    orderBy: string
    searchTerm?: string
    categoryId: number
    productTypes: string[]
    producers: string[]
    pageNumber: number
    pageSize: number
  }