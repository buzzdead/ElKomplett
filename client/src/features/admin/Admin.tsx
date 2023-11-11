import * as React from 'react';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MailIcon from '@mui/icons-material/Mail';
import { Paper } from '@mui/material';
import Inventory from './Inventory';
import Orders from 'features/orders/Orders';
import { ContactMessages } from './AdvancedInventory/ContactMessages';
import { AdvancedInventory } from './AdvancedInventory/AdvancedInventory';
import ContactMailIcon from '@mui/icons-material/ContactMail';
import SourceIcon from '@mui/icons-material/Source';
import InventoryIcon from '@mui/icons-material/Inventory';
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';
import DashboardIcon from '@mui/icons-material/Dashboard';
import { DashBoard } from './dashboard/DashBoard';
import { AllOrders } from './AllOrders';

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
    {id: 3, element: <AdvancedInventory />, icon: <SourceIcon />},
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

  const drawer = (
    <div>
        <Divider component={Paper} color='blue' />
      <List>
        {['Dashboard', 'Orders', 'Inventory', 'Content',  'Feedback',].map((text, id) => (
          <ListItem key={text} disablePadding>
            <ListItemButton style={{display: 'flex', width: '100%', alignContent: 'center', flexDirection: 'column', color: id === index ? 'blue' : 'GrayText'}} onClick={() => handleListItemClick(id)}>
              <ListItemIcon style={{display: 'flex', width: '100%', justifyContent: 'center', color: id === index ? 'blue' : 'GrayText'}}>
                {components.find(e => e.id === id)?.icon}
              </ListItemIcon>
              <ListItemText style={{display: 'flex', width: '100%', justifyContent: 'center' }} primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </div>
  );

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
          {drawer}
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
          {drawer}
        </Drawer>
      </Box>
        {renderComponent()}
    </Box>
  );
}
