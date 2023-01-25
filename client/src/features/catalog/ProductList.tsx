import { Grid } from "@mui/material";
import { IProduct } from "../../app/models/product";
import React from 'react'
import ProductCard from "./ProductCard";

interface Props {
    products: IProduct[]
}

export default function ProductList({ products }: Props) {
    return (
        <Grid container spacing={4}>
            {products.map(product => (
                <Grid key={product.id} item xs={4}>
                <ProductCard product={product}/>
                </Grid>
            ))}
        </Grid>
    )
}