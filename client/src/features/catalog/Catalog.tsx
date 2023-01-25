import { Button } from "@mui/material";
import { useState, useEffect } from "react";
import { IProduct } from "../../app/models/product";
import ProductList from "./ProductList";
import React from 'react'

export default function Catalog() {
    const [products, setProducts] = useState<IProduct[]>([])

  useEffect(() => {
    fetch('http://localhost:5000/api/products')
      .then(response => response.json())
      .then(data => setProducts(data))
  }, [])

    return (
        <>
            <ProductList products={products} />
            <Button variant='contained'>Add product</Button>
        </>
    )
}