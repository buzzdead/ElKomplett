import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { store } from './app/store/configureStore'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import { router } from './app/router/Routes'
import { RouterProvider } from 'react-router-dom'
import { GoogleOAuthProvider } from '@react-oauth/google'
import env from "react-dotenv";

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
const googleId = process.env.REACT_APP_GOOGLE_ID;

root.render(
  <GoogleOAuthProvider clientId={googleId || env.REACT_APP_GOOGLE_ID || ''}>
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
  </GoogleOAuthProvider>,
)
