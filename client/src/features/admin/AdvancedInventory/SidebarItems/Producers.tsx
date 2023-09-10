import {
  Card,
  CardHeader,
  CardMedia,
  Paper,
  Box,
  Typography,
  Dialog,
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material'
import agent from 'app/api/agent'
import useProducts from 'app/hooks/useProducts'
import { useState } from 'react'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { useAppDispatch } from 'app/store/configureStore';
import { fetchFilters } from 'features/catalog/catalogSlice';

export const Producers = () => {
  const [modalOpen, setModalOpen] = useState(false)
  const [editedName, setEditedName] = useState('')
  const { producers } = useProducts(0)
  const dispatch = useAppDispatch()

  const handleSave = async () => {
    const data = { name: editedName }
    if (editedName === '') return
    const res = await agent.Admin.createProducer(data)
    console.log(res)
    dispatch(fetchFilters(0))
    setModalOpen(false)
  }
  const handleDelete = async (producer: string) => {
    const res = await agent.Admin.deleteProducer(producer)
    dispatch(fetchFilters(0))
    console.log(res)
  }
  return (
    <Box sx={{padding: 5}}>
      <Card sx={{ width: 60, height: 60, marginBottom: 5 }} onClick={() => setModalOpen(true)}>
        <CardHeader
          title={'+'}
          sx={{ maxHeight: 20, bgcolor: 'background.paper' }}
          titleTypographyProps={{
            sx: { textAlign: 'center', color: 'neutral.darker' },
          }}
        />
        <CardMedia
          component={Paper}
          sx={{
            height: 180,
            backgroundSize: 'cover',
          }}
          image={''}
          title={''}
        />
      </Card>
      {producers?.map((e) => (
        <Box sx={{ display: 'flex', flexDirection: 'row'}}>
        <Box sx={{ border: '1px solid black', width: 100 }}>
          <Typography style={{ textAlign: 'center' }}>{e}</Typography>
          
        </Box>
        <Button sx={{padding: 0, minWidth: 0}} onClick={() => handleDelete(e)}>
          <DeleteForeverIcon color='error' />
          </Button>
        </Box>
      ))}
      <Dialog open={modalOpen} onClose={() => setModalOpen(false)}>
        <DialogTitle>Edit Producer</DialogTitle>
        <DialogContent>
          <TextField
            label='Title'
            value={editedName}
            onChange={(e) => setEditedName(e.target.value)}
            fullWidth
            margin='normal'
          />
          <DialogActions>
            <Button onClick={handleSave}>Save</Button>
          </DialogActions>
        </DialogContent>
      </Dialog>
    </Box>
  )
}
