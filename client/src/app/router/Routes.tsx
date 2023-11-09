import { createBrowserRouter, Navigate } from 'react-router-dom'
import AboutPage from '../../features/about/AboutPage'
import Login from '../../features/account/Login'
import Register from '../../features/account/Register'
import Inventory from '../../features/admin/Inventory'
import BasketPage from '../../features/basket/BasketPage'
import Catalog from '../../features/catalog/Catalog'
import ProductDetails from '../../features/catalog/product/ProductDetails'
import CheckoutWrapper from '../../features/checkout/CheckoutWrapper'
import ContactPage from '../../features/contacts/ContactPage'
import Orders from '../../features/orders/Orders'
import NotFound from '../errors/NotFound'
import ServerError from '../errors/ServerError'
import App from '../layout/App'
import RequireAuth from './RequireAuth'
import Categories from 'features/home/Categories'
import Category from 'features/home/Category'
import { AdvancedInventory } from 'features/admin/AdvancedInventory/AdvancedInventory'
import { AllOrders } from 'features/admin/AllOrders'
import { Order } from 'features/admin/Order'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        element: <RequireAuth />,
        children: [
          { path: 'checkout', element: <CheckoutWrapper /> },
          { path: 'orders', element: <Orders /> },
        ],
      },
      {
        element: <RequireAuth roles={['Admin', 'Test']} />,
        children: [
          { path: 'inventory', element: <Inventory /> },
          { path: 'inventory/advanced', element: <AdvancedInventory /> },
          { path: 'inventory/orders', element: <AllOrders /> },
          { path: 'inventory/orders/:id', element: <Order /> },
        ],
      },
      { path: 'catalog', element: <Catalog /> },
      { path: 'catalog/categories', element: <Categories /> },
      { path: 'catalog/categories/:id', element: <Category /> },
      { path: 'catalog/:id', element: <ProductDetails /> },
      { path: 'about', element: <AboutPage /> },
      { path: 'contact', element: <ContactPage /> },
      { path: 'server-error', element: <ServerError /> },
      { path: 'not-found', element: <NotFound /> },
      { path: 'basket', element: <BasketPage /> },
      { path: 'login', element: <Login /> },
      { path: 'register', element: <Register /> },
      { path: '*', element: <Navigate replace to='/not-found' /> },
    ],
  },
])
