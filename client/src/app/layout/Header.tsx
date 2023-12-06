import { ShoppingCart } from '@mui/icons-material'
import {
  AppBar,
  Badge,
  Box,
  IconButton,
  List,
  ListItem,
  Switch,
  Theme,
  Toolbar,
  Typography,
  useTheme,
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
import { LowResMenu } from './LowResMenu'

interface Props {
  darkMode: boolean
  handleThemeChange: () => void
}

const midLinks = [
  {
    title: 'Katalog',
    path: '/catalog',
    condition: true,
  },
  {
    title: 'Kontakt',
    path: '/contact',
    condition: true,
  },
]

const rightLinks = (condition: any) => [
  {
    title: 'Logg inn',
    path: '/login',
    condition: condition
  },
  {
    title: 'Registrer',
    path: '/register',
    condition: condition
  },
]

const navStyles = (theme: Theme) => ({
  color: 'inherit',
  textDecoration: 'none',
  typography: 'h6',
  '&:hover': {
    color: 'grey.500',
  },
  '&.active': {
    color: theme.palette.mode === 'dark' ? theme.palette.secondary.main : theme.palette.warning.light, // A warm color in light mode
  },
});



export default function Header({ darkMode, handleThemeChange }: Props) {
  const { basket } = useAppSelector((state) => state.basket)
  const { user } = useAppSelector((state) => state.account)
  const { view } = useView()
  const theme = useTheme();
const styles = navStyles(theme);
  const itemCount = basket && basket.items.reduce((sum, item) => sum + item.quantity, 0)
  return (
    <AppBar position='sticky' sx={{ backgroundColor: darkMode ? 'grey.900' : 'primary.main' }}>

      <Toolbar
        style={{ maxHeight: '40px' }}
        sx={{
          display: 'flex',
          width: '100%',
        }}
      >
        <Box display='flex' alignItems='center' justifyContent='flex-start'>
          <Typography variant='h6' component={NavLink} to='/' sx={styles} style={{color: 'white'}}>
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
        <List sx={{ display: 'flex', justifyContent: 'center', width: '100%', gap: 5 }}>
          <Render condition={!view.ipad} ignoreTernary>
            {midLinks.map(({ title, path }) => (
              <ListItem component={NavLink} to={path} key={path} sx={{...styles, width: '125px'}}>
                {title.toUpperCase()}
              </ListItem>
            ))}
          </Render>
          <Render
            condition={
              !view.ipad && user && AuthorisedRoles.some((role) => user.roles?.includes(role))
            }
          >
            <ListItem component={NavLink} to={'/admin'} sx={{...styles, width: ''}}>
              ADMIN
            </ListItem>
          </Render>
        </List>
        <Render condition={view.ipad}>
          <LowResMenu
            links={midLinks.concat({
              path: './admin',
              title: 'Admin',
              condition:
                user !== null && AuthorisedRoles.some((role) => user.roles?.includes(role)),
            }).concat(rightLinks(user === null))}
          />
        </Render>
        <Box display='flex' alignItems='center' justifyContent='flex-end' sx={{}}>
          <IconButton component={Link} to='/basket' size='large' sx={{ color: 'inherit' }}>
            <Badge badgeContent={itemCount} color='error'>
              <ShoppingCart fontSize='large'  />
            </Badge>
          </IconButton>
          <Render condition={user !== null}>
            <SignedInMenu />
            <List sx={{ display: 'flex'}}>
              {rightLinks(!view.ipad).map(({title, condition, path }) => (
                <ListItem component={NavLink} to={path} key={path} sx={{...styles, width: !view.ipad ? '125px' : ''}}>
                  {condition && title.toUpperCase()}
                </ListItem>
              ))}
            </List>
          </Render>
        </Box>
      </Toolbar>
    </AppBar>
  )
}
