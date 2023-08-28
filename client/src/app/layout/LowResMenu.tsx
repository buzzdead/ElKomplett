import { Button, Fade, Menu, MenuItem } from "@mui/material"
import { signOut } from "features/account/accountSlice"
import { clearBasket } from "features/basket/basketSlice"
import MenuIcon from '@mui/icons-material/Menu';
import { useState } from "react";
import { Link } from 'react-router-dom'

interface Props {
    links: {path: string, title: string, condition?: boolean}[]
}

export const LowResMenu = ({links}: Props) => {
    const [anchorEl, setAnchorEl] = useState(null)
     const open = Boolean(anchorEl)

    const handleClick = (event: any) => {
        setAnchorEl(event.currentTarget)
      }
      const handleClose = () => {
        setAnchorEl(null)
      }
    

    return (
        <div>
          <Button color='inherit' sx={{typography: 'h6'}} onClick={handleClick}><MenuIcon sx={{color: 'white'}} fontSize='large'/></Button>
          <Menu anchorEl={anchorEl} open={open} onClose={handleClose} TransitionComponent={Fade}>
            {links.map(l => {return l.condition && <MenuItem component={Link} to={l.path}>{l.title}</MenuItem>})}
          </Menu>
        </div>
      )
}