import { Typography, Button, Paper, Box, Grid } from '@mui/material'
import { Edit, Delete } from '@mui/icons-material'
import useProducts from '../../app/hooks/useProducts'
import AppPagination from '../../app/components/AppPagination'
import { useAppDispatch } from '../../app/store/configureStore'
import { removeProduct, setPageNumber } from '../catalog/catalogSlice'
import { useEffect, useState } from 'react'
import ProductForm from './ProductForm'
import { IProduct } from '../../app/models/product'
import agent from '../../app/api/agent'
import { LoadingButton } from '@mui/lab'
import SideBar from '../SideBar'
import ProductSearch from '../catalog/product/productSearch'
import { TableData } from '../../app/components/AppTable/AppTable'
import AppTable2D from '../../app/components/AppTable/AppTable2D'
import { currencyFormat } from '../../app/util/util'
import useView from '../../app/hooks/useView'
import Render from '../../app/layout/Render'
import LoadingComponent from '../../app/layout/LoadingComponent'
import { useCategory } from 'app/hooks/useCategory'


interface Props {
  adminMode?: boolean
}

export default function Inventory({adminMode = false}: Props) {
  const { products, metaData, producers, productTypes, filtersLoaded, productsLoaded } = useProducts(0)
  const {category, categoryLoading} = useCategory(0);
  const { view } = useView()
  const dispatch = useAppDispatch()
  //State
  const [editMode, setEditMode] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<IProduct | undefined>(undefined)
  const [loading, setLoading] = useState(false)
  const [target, setTarget] = useState(0)

  const tableProps = {
    p: view.mobile ? '0 8px' : '16px',
    align: 'left',
  }
  const iconProps = { display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }

  function handleSelectProduct(product: IProduct) {
    setSelectedProduct(product)
    setEditMode(true)
  }

  useEffect(() => {
    if(selectedProduct) setSelectedProduct(products.find(e => e.id === selectedProduct?.id))
  }, [products])

  function handleDeleteProduct(id: number) {
    setLoading(true)
    setTarget(id)
    agent.Admin.deleteProduct(id)
      .then(() => dispatch(removeProduct(id)))
      .catch((error) => console.log(error))
      .finally(() => setLoading(false))
  }

  function cancelEdit() {
    if (selectedProduct) setSelectedProduct(undefined)
    setEditMode(false)
  }

  const renderHeader = () => {
    return (
      <Box display='flex' justifyContent='space-between' flexDirection={view.mobile ? 'column' : 'row'}>
        <Typography sx={{ p: 2 }} variant='h4'>
          Inventory
        </Typography>
        <Box display='flex' flexDirection='row'>
        <Button onClick={() => setEditMode(true)} sx={{ m: 2, minWidth: 170 }} size='large' variant='contained'>
          Create product
        </Button>
        </Box>
      </Box>
    )
  }

  const tableData: TableData[][] = products.map((product: IProduct): TableData[] => {
    return [
      {
        key: '#',
        value: product.id,
        scope: 'row',
        component: 'th',
        sx: { ...tableProps },
      },
      {
        key: 'Product',
        value: (
          <Box display='flex' alignItems='center'>
            <img
              src={product.images[0]?.pictureUrl}
              alt={product.name}
              style={{ height: 50, marginRight: 20 }}
            />
            <span>{product.name}</span>
          </Box>
        ) as any,
      },
      {
        key: 'Price',
        value: currencyFormat(product.price),
        sx: { ...tableProps },
      },
      {
        key: 'Type',
        value: product.productType?.name,
        dontRender: view.ipad,
      },
      {
        key: 'Brand',
        value: product.producer?.name,
        dontRender: view.ipad,
      },
      {
        key: 'Quantity',
        value: product.quantityInStock,
        sx: { ...tableProps, textAlign: 'center' },
      },
      {
        key: '',
        sx: { p: 0, textAlign: view.mobile ? 'left' : 'right' },
        value: (
          <>
            <Button
              sx={view.mobile ? iconProps : null}
              onClick={() => handleSelectProduct(product)}
              startIcon={<Edit />}
            />
            <LoadingButton
              sx={view.mobile ? iconProps : null}
              loading={loading && target === product.id}
              onClick={() => handleDeleteProduct(product.id)}
              startIcon={<Delete />}
              color='error'
            />
          </>
        ) as any,
      },
    ]
  })

  if(!filtersLoaded || categoryLoading) return <LoadingComponent message={'Loading products...'} />
  if (editMode) return <ProductForm product={selectedProduct} cancelEdit={cancelEdit} />
 
  return (
    <>
      <Grid container columnSpacing={4} width='100%'>
        <Render condition={!view.mobile}>
          <Grid item xs={3} minWidth='175px'>
            <ProductSearch />
            <SideBar producers={producers} productTypes={productTypes} />
          </Grid>
        </Render>

        <Grid item xs={view.mobile ? 14 : 9}>
          {renderHeader()}
          <AppTable2D
            sxRow={{ '&:last-child td, &:last-child th': { border: 0 } }}
            tableData={tableData}
            component={Paper}
            sx={{ minWidth: 350 }}
          />
          <Render condition={metaData !== null}>
            <Box sx={{ p: 2 }}>
              <AppPagination
                flexOnMobile={view.ipad ? 'column' : 'row'}
                metaData={metaData!}
                onPageChange={(page: number) => dispatch(setPageNumber({ pageNumber: page }))}
              />
            </Box>
          </Render>
        </Grid>
      </Grid>
    </>
  )
}
