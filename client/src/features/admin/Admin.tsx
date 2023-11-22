import * as React from 'react';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { Paper } from '@mui/material';
import Inventory from './inventory/Inventory';
import { ContactMessages } from './ContactMessages';
import { Content } from './content/Content';
import ContactMailIcon from '@mui/icons-material/ContactMail';
import SourceIcon from '@mui/icons-material/Source';
import InventoryIcon from '@mui/icons-material/Inventory';
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';
import DashboardIcon from '@mui/icons-material/Dashboard';
import { DashBoard } from './dashboard/DashBoard';
import { AllOrders } from './Order/AllOrders';

const drawerWidth = 140;

interface Props {
  /**
   * Injected by the documentation to work in an iframe.
   * Remove this when copying and pasting into your project.
   */
  window?: () => Window;
}

export default function ResponsiveDrawer(props: Props) {
  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [index, setIndex] = React.useState(() => {
    // Retrieve the selected index from session storage or use a default value (0 in this case)
    const storedIndex = sessionStorage.getItem('selectedTabIndex');
    return storedIndex ? parseInt(storedIndex, 10) : 0;
  });

  const components = [
    {id: 0, element: <DashBoard />, icon: <DashboardIcon />},
    {id: 1, element: <AllOrders />, icon: <PointOfSaleIcon /> },
    {id: 2, element: <Inventory />, icon: <InventoryIcon />},
    {id: 3, element: <Content />, icon: <SourceIcon />},
    {id: 4, element: <ContactMessages />, icon: <ContactMailIcon />},
  ]

  const renderComponent = () => {
    return components.find(e => e.id === index)?.element || null
  }

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleListItemClick = (clickedIndex: number) => {
    setIndex(clickedIndex);
    // Save the selected index to session storage
    sessionStorage.setItem('selectedTabIndex', clickedIndex.toString());
  };

  const renderDrawer = () => { 
    return (
    <div>
        <Divider component={Paper} color='blue' />
      <List>
        {['Dashboard', 'Orders', 'Inventory', 'Content',  'Feedback'].map((text, id) => (
          <ListItem key={text} disablePadding>
            <ListItemButton sx={{color: (theme) => id === index ? theme.palette.primary.main : 'GrayText' }} style={{display: 'flex', width: '100%', alignContent: 'center', flexDirection: 'column', }} onClick={() => handleListItemClick(id)}>
              <ListItemIcon sx={{color: (theme) => id === index ? theme.palette.primary.main : 'GrayText' }} style={{display: 'flex', width: '100%', justifyContent: 'center'}}>
                {components.find(e => e.id === id)?.icon}
              </ListItemIcon>
              <ListItemText style={{display: 'flex', width: '100%', justifyContent: 'center', }} primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </div>
  )}

  // Remove this const when copying and pasting into your project.
  const container = window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ display: 'flex' }}>
      <Box
        component="nav"
        sx={{ flexShrink: { sm: 0 }, width: drawerWidth}}
        aria-label="mailbox folders"
      >
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, marginTop: '64px' },
          }}
        >
          {renderDrawer()}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            backgroundColor: 'white',
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, marginTop: '64px' },
          }}
          open
        >
          {renderDrawer()}
        </Drawer>
      </Box>
        {renderComponent()}
    </Box>
  );
}
