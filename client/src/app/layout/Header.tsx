import { ShoppingCart } from '@mui/icons-material'
import {
  AppBar,
  Badge,
  Box,
  IconButton,
  List,
  ListItem,
  Switch,
  Toolbar,
  Typography,
} from '@mui/material'
import React from 'react'
import { Link, NavLink } from 'react-router-dom'
import useView from '../hooks/useView'
import { useAppSelector } from '../store/configureStore'
import { AuthorisedRoles } from '../util/util'
import Render from './Render'
import SignedInMenu from './SignedInMenu'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import LightModeIcon from '@mui/icons-material/LightMode'
import { yellow } from '@mui/material/colors'

interface Props {
  darkMode: boolean
  handleThemeChange: () => void
}

const midLinks = [
  {
    title: 'katalog',
    path: '/catalog',
  },
  {
    title: 'Kontakt',
    path: '/contact',
  },
]

const rightLinks = [
  {
    title: 'logg inn',
    path: '/login',
  },
  {
    title: 'registrer',
    path: '/register',
  },
]

const navStyles = {
  color: 'inherit',
  textDecoration: 'none',
  typography: 'h6',
  '&:hover': {
    color: 'grey.500',
  },
  '&.active': {
    color: 'text.secondary',
  },
}

export default function Header({ darkMode, handleThemeChange }: Props) {
  const { basket } = useAppSelector((state) => state.basket)
  const { user } = useAppSelector((state) => state.account)
  const { view } = useView()
  const itemCount = basket && basket.items.reduce((sum, item) => sum + item.quantity, 0)
  return (
    <AppBar position='static'>
      <Toolbar
        style={{ maxHeight: '10px' }}
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Box display='flex' alignItems='center'>
          <Typography variant='h6' component={NavLink} to='/' sx={navStyles}>
            ElKomplett
          </Typography>
          <Switch
            icon={
              <LightModeIcon
                sx={{ marginTop: -0.25, marginLeft: -0.3, color: yellow[400] }}
                fontSize={'medium'}
              />
            }
            checkedIcon={
              <DarkModeIcon sx={{ marginTop: -0.5 }} color={'action'} fontSize={'medium'} />
            }
            checked={darkMode}
            onChange={handleThemeChange}
          />
        </Box>
        <List sx={{ display: 'flex' }}>
          <Render condition={!view.ipad} ignoreTernary>
            {midLinks.map(({ title, path }) => (
              <ListItem component={NavLink} to={path} key={path} sx={navStyles}>
                {title.toUpperCase()}
              </ListItem>
            ))}
          </Render>
          <Render
            condition={
              !view.ipad && user && AuthorisedRoles.some((role) => user.roles?.includes(role))
            }
          >
            <ListItem component={NavLink} to={'/inventory'} sx={navStyles}>
              INNHOLD
            </ListItem>
          </Render>
        </List>
        <Box display='flex' alignItems='center'>
          <IconButton component={Link} to='/basket' size='large' sx={{ color: 'inherit' }}>
            <Badge badgeContent={itemCount} color='secondary'>
              <ShoppingCart />
            </Badge>
          </IconButton>
          <Render condition={user !== null}>
            <SignedInMenu />
            <List sx={{ display: 'flex' }}>
              {rightLinks.map(({ title, path }) => (
                <ListItem component={NavLink} to={path} key={path} sx={navStyles}>
                  {title.toUpperCase()}
                </ListItem>
              ))}
            </List>
          </Render>
        </Box>
      </Toolbar>
    </AppBar>
  )
}
