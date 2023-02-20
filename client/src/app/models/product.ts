interface Configurable {
  id?: number;
  price: number;
  quantityInStock: number;
  key: string;
  value: string;
  productId?: number;
  defaultProduct?: boolean;
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
    configureable?: boolean;
    configurables?: Configurable[]

  }

  export interface ProductParams {
    orderBy: string
    searchTerm?: string
    types: string[]
    brands: string[]
    pageNumber: number
    pageSize: number
  }