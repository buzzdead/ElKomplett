import { Container, createTheme, CssBaseline } from '@mui/material'
import { PaletteColorOptions, Shadows, ThemeProvider } from '@mui/material/styles'
import { useCallback, useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Header from './Header'
import React from 'react'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import LoadingComponent from './LoadingComponent'
import { useAppDispatch } from '../store/configureStore'
import { fetchBasketAsync } from '../../features/basket/basketSlice'
import { fetchCurrentUser } from '../../features/account/accountSlice'
import HomePage from '../../features/home/HomePage'
import { blue, blueGrey, common, green, grey, lightGreen, lime, purple, red, teal, yellow, amber, brown, deepOrange, deepPurple,cyan } from '@mui/material/colors'
import { dark } from '@mui/material/styles/createPalette'

declare module '@mui/material/styles' {
  interface Palette {
    special: PaletteColor;
    special2: PaletteColor;
    special3: PaletteColor;
    special4: PaletteColor;
    brandSecondary: PaletteColor;
    mode2: PaletteColor
  }

  interface PaletteOptions {
    special: string;
    special2: string;
    mode2: {main: string};
    special3: {main: string};
    special4: {main: string};
    brandSecondary: {main: string; light: string; dark: string; contrastText: string;}
  }
}

declare module '@mui/material/styles' {
  interface Theme {
    status: {
      danger: React.CSSProperties['color'];
    };
  }

  interface Palette {
    neutral: Palette['primary'];
  }

  interface PaletteOptions {
    neutral: PaletteOptions['primary'];
  }

  interface PaletteColor {
    darker?: string;
  }

  interface SimplePaletteColorOptions {
    darker?: string;
  }

  interface ThemeOptions {
    status?: {
      danger: React.CSSProperties['color'];
    };
  }
}
function App() {
  const location = useLocation()
  const dispatch = useAppDispatch()
  const [loading, setLoading] = useState(true)

  const initApp = useCallback(async () => {
    try {
      await dispatch(fetchCurrentUser())
      await dispatch(fetchBasketAsync())
    } catch (error) {
      console.log(error)
    }
  }, [dispatch])

  useEffect(() => {
    initApp().then(() => setLoading(false))
  }, [initApp])

  const [darkMode, setDarkMode] = useState(false)
  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      mode2: {main: darkMode ? 'black' : 'white'},
      error: {
        main: '#d32f2f', // or any color that fits your design
      },
      primary: {
        main: '#2979ff',
      },
      secondary: {
        main: darkMode ? red[400] : blue[500], // Adjust secondary color
        contrastText: darkMode ? grey[100] : grey[900], // Ensure text on secondary color is visible
      },
      brandSecondary: {
        light: teal[400],
        main: teal[500],
        dark: teal[600],
        contrastText: common.white,
      },
      // Adjust other colors as needed
      background: {
        main: darkMode ? grey[700] : grey[200],
        default: darkMode ? grey[800] : grey[200],
        paper: darkMode ? grey[900] : grey[300],
      },
      special: darkMode ? grey[700] : 'white',
      special2: darkMode ? grey[900] : grey[100],
      special3: {
        main: darkMode ? cyan[100] : 'black',
      },
      special4: {
        main: darkMode ? grey[700] : 'white',
      },
      neutral: {
        main: darkMode ? 'white' : 'black',
        dark: darkMode ? blue[400] : blue[300],
        darker: darkMode ? cyan[300] : cyan[200],
      },
      common: {},
    },
  });
  

  function handleThemeChange() {
    setDarkMode(!darkMode)
  }

  if (loading) return <LoadingComponent message='Initialising app...' />
  return (
    <ThemeProvider theme={theme}>
      <ToastContainer position='bottom-right' hideProgressBar />
      <CssBaseline />
      <Header darkMode={darkMode} handleThemeChange={handleThemeChange} />
      {loading ? (
        <LoadingComponent message='Initialising app...' />
      ) : location.pathname === '/' ? (
        <HomePage />
      ) : (
        <Container sx={{ mt: 4, maxWidth: '1600px' }} disableGutters maxWidth={false}>
          <Outlet />
        </Container>
      )}
    </ThemeProvider>
  )
}

export default App
