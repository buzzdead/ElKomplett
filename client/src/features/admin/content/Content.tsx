import {
  Typography,
  Tabs,
  Tab,
  Box,
} from '@mui/material'
import Render from 'app/layout/Render'
import { useState } from 'react'
import { Producers } from './Producers'
import { ProductTypes } from './ProductTypes'
import { EditCategory } from './Category'

export const Content = () => {
  const [selectedTab, setSelectedTab] = useState(0)
  const handleTabChange = (e: any, v: any) => {
    setSelectedTab(v)
  }

  return (
    <Box>
      <Typography variant='h4' gutterBottom sx={{ mb: 4 }}>
        Advanced inventory
      </Typography>
      <Tabs sx={{ paddingBottom: 3 }} value={selectedTab} onChange={handleTabChange}>
        <Tab label='Producers' />
        <Tab label='Product Types' />
        <Tab label='Categories' />
      </Tabs>
      <Render condition={selectedTab === 0}>
        <Producers />
      </Render>
      <Render condition={selectedTab === 1}>
        <ProductTypes />
      </Render>
      <Render condition={selectedTab === 2}>
        <EditCategory />
      </Render>
    </Box>
  )
}
