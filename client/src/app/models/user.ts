import { Basket } from "./basket"

interface Address {
    fullName: string;
    address1: string;
    address2: string;
    city: string;
    state: string;
    zip: string;
    country: string;
}

export interface User {
    email: string
    userName: string
    token: string
    basket?: Basket
    roles?: string[]
    address?: Address
    isGoogle?: boolean
}