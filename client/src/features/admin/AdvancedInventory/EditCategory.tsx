import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardHeader,
  CardMedia,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Paper,
  TextField,
} from '@mui/material';
import { useCategories } from 'app/hooks/useCategories';
import AppDropzone from 'app/components/AppDropzone';
import { useForm } from 'react-hook-form';
import agent from 'app/api/agent';

export const EditCategory = () => {
  const { categories, categoriesLoading } = useCategories();
  const [selectedCategory, setSelectedCategory] = useState<{pictureUrl: string, title: string, id: number, description: string}>();
  const [modalOpen, setModalOpen] = useState(false);
  const [editedTitle, setEditedTitle] = useState('');
  const [editedDescription, setEditedDescription] = useState('');
  const [maxId, setMaxId] = useState(0)

  useEffect(() => {
    const abc = Math.max(...categories.map(c => c.id))
    setMaxId(abc)
  }, [categoriesLoading])
  
  const {
    control,
    reset,
    handleSubmit,
    watch,
  } = useForm()
  const watchFile = watch('file')

  const handleEditClick = (category: any) => {
    if(category === null) {
        setSelectedCategory({id: maxId + 1, title: '', description: '', pictureUrl:''})
        setEditedTitle("");
        setEditedDescription("");
    }
    else {
    setSelectedCategory(category);
    setEditedTitle(category.title);
    setEditedDescription(category.description);
    }
    setModalOpen(true);
  };

  const handleSaveChanges = async (data: any) => {
    // Implement logic to save editedTitle and editedDescription to the selectedCategory
    // You can use an API call or a state management library like Redux
    if(!selectedCategory?.id) return
    if(!selectedCategory) return
    data.title = editedTitle
    data.id = selectedCategory.id
    data.description = editedDescription

    selectedCategory.id === maxId + 1  && setMaxId(maxId + 1)
    setModalOpen(false);
  };

  const handleDeleteClick = async () => {
    // Implement logic to delete the selectedCategory
    // You can use an API call or a state management library like Redux
    if(!selectedCategory?.id) return
    await agent.Catalog.deleteCategory(selectedCategory.id)
    setModalOpen(false);
  };

  const handleCancel = () => {
    reset(watchFile)
    setModalOpen(false)
  }

  return (
    <Grid container gap={10} sx={{padding: 5}}>
        <Card sx={{minWidth: 200}} onClick={() => handleEditClick(null)}>
            <CardHeader
              title={"+"}
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
      {categories.map((category) => (
        <Grid key={category.id} item xs={2}>
          <Card onClick={() => handleEditClick(category)}>
            <CardHeader
              title={category.title}
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
              image={category.pictureUrl}
              title={category.title}
            />
          </Card>
        </Grid>
      ))}
    
    <Dialog open={modalOpen} onClose={() => setModalOpen(false)}>
    <form onSubmit={handleSubmit(handleSaveChanges)}>
        <DialogTitle>Edit Category</DialogTitle>
        <DialogContent>
          <TextField
            label="Title"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Description"
            value={editedDescription}
            onChange={(e) => setEditedDescription(e.target.value)}
            fullWidth
            margin="normal"
          />
          <Box sx={{display: 'flex', flexDirection: 'row', gap: 15}}>
          <AppDropzone width={150} height={150} control={control} singular name='file'
            // Props for AppDropZone
          />
          <img
            src={watchFile ? watchFile.preview : selectedCategory?.pictureUrl}
            alt={'Image'}
            style={{ maxHeight: 150 }}
        />
        </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteClick} color="error">
            Delete
          </Button>
          <Button type='submit' color="primary">
            Save Changes
          </Button>
          <Button onClick={handleCancel}>
            Cancel
          </Button>
        </DialogActions>
        </form>
      </Dialog>

    </Grid>
    
  );

};