import { Typography, Button, Paper, Box, Grid } from '@mui/material'
import { Edit, Delete } from '@mui/icons-material'
import useProducts from '../../../app/hooks/useProducts'
import AppPagination from '../../../app/components/AppPagination'
import { useAppDispatch } from '../../../app/store/configureStore'
import { removeProduct, setPageNumber } from '../../catalog/catalogSlice'
import { useEffect, useState } from 'react'
import ProductForm from './ProductForm'
import { IProduct } from '../../../app/models/product'
import agent from '../../../app/api/agent'
import { LoadingButton } from '@mui/lab'
import SideBar from '../../SideBar'
import ProductSearch from '../../catalog/product/productSearch'
import { TableData } from '../../../app/components/AppTable/AppTable'
import AppTable2D from '../../../app/components/AppTable/AppTable2D'
import { currencyFormat } from '../../../app/util/util'
import useView from '../../../app/hooks/useView'
import Render from '../../../app/layout/Render'
import FilterListIcon from '@mui/icons-material/FilterList'
import LoadingComponent from '../../../app/layout/LoadingComponent'
import { useCategory } from 'app/hooks/useCategory'
import { SidebarModal } from 'features/catalog/SidebarModal'

interface Props {
  adminMode?: boolean
}

export default function Inventory({ adminMode = false }: Props) {
  const { products, metaData, producers, productTypes, filtersLoaded, productsLoaded } =
    useProducts(0)
  const { category, categoryLoading } = useCategory(0)
  const { view } = useView()
  const dispatch = useAppDispatch()
  //State
  const [editMode, setEditMode] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<IProduct | undefined>(undefined)
  const [loading, setLoading] = useState(false)
  const [target, setTarget] = useState(0)
  const [showFilterModal, setShowFilterModal] = useState(false)

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
    if (selectedProduct) setSelectedProduct(products.find((e) => e.id === selectedProduct?.id))
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
      <Box display='flex' width='100%' justifyContent='flex-end'>
        <Button
          onClick={() => setEditMode(true)}
          sx={{ my: 2, minWidth: 170 }}
          size='large'
          variant='contained'
        >
          Create product
        </Button>
      </Box>
    )
  }

  type TableCellProps = {
    key: string
    value: any
    sx?: any
    scope?: string
    dontRender?: boolean
  }

  const createTableCell = ({ key, value, sx, scope, dontRender }: TableCellProps): TableData => ({
    key,
    value,
    scope,
    sx,
    dontRender,
  })

  const ProductImage = ({ product }: { product: IProduct }) => (
    <Box display='flex' alignItems='center'>
      <img
        src={product.images[0]?.pictureUrl}
        alt={product.name}
        style={{ height: 50, marginRight: 20 }}
      />
      <span>{product.name}</span>
    </Box>
  )

  type ActionButtonsProps = {
    product: IProduct
    loading: boolean
    target: number
    handleSelectProduct: Function
    handleDeleteProduct: Function
  }

  const ActionButtons = ({
    product,
    loading,
    target,
    handleSelectProduct,
    handleDeleteProduct,
  }: ActionButtonsProps) => (
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
  )

  const tableData: TableData[][] = products.map((product: IProduct): TableData[] => {
    return [
      createTableCell({ key: '#', value: product.id, sx: { ...tableProps }, scope: 'row' }),
      createTableCell({ key: 'Product', value: <ProductImage product={product} /> }),
      createTableCell({
        key: 'Price',
        value: currencyFormat(product.price),
        sx: { ...tableProps },
      }),
      createTableCell({ key: 'Type', value: product.productType?.name, dontRender: !view.ipad }),
      createTableCell({ key: 'Brand', value: product.producer?.name, dontRender: !view.ipad }),
      createTableCell({
        key: 'Quantity',
        value: product.quantityInStock,
        sx: { ...tableProps, textAlign: 'center' },
      }),
      createTableCell({
        key: '',
        value: (
          <ActionButtons
            product={product}
            loading={loading}
            target={target}
            handleSelectProduct={handleSelectProduct}
            handleDeleteProduct={handleDeleteProduct}
          />
        ),
        sx: { p: 0, textAlign: view.mobile ? 'left' : 'right' },
      }),
    ]
  })

  if (!filtersLoaded || categoryLoading) return <LoadingComponent message={'Loading products...'} />
  if (editMode) return <ProductForm product={selectedProduct} cancelEdit={cancelEdit} />
  const toggleFilterModal = () => {
    setShowFilterModal(!showFilterModal)
  }
  return (
    <Grid
      display='flex'
      flexDirection={'row'}
      container
      columnSpacing={4}
      sx={{ marginTop: { xs: 5, sm: 0 } }}
    >
      {renderHeader()}
      <Grid item xs={12} lg={12} display='flex' gap={5} flexDirection={'row'}>
        <Render condition={view.custom}>
          <SidebarModal
            onClose={toggleFilterModal}
            producers={producers}
            productTypes={productTypes}
            showModal={showFilterModal}
          />
        </Render>
        <Render condition={!view.custom}>
          <Grid item xs={3} minWidth='175px'>
            <ProductSearch />
            <SideBar producers={producers} productTypes={productTypes} />
          </Grid>
          <Button
            onClick={toggleFilterModal}
            sx={{
              height: 40,
              width: 40,
              color: 'green',
              display: 'flex',
              alignSelf: 'center',
              position: 'absolute',
              marginBottom: 2,
              top: { xs: 145, sm: 105 },
            }}
          >
            <FilterListIcon fontSize='large' />
          </Button>
        </Render>

        <Grid item xs={12} lg={view.custom ? 12 : 9} md={12}>
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
    </Grid>
  )
}
