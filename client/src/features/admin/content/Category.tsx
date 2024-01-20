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
  }, [categoriesLoading, categories])
  
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
    if (!selectedCategory?.id) return;
    data = {
      ...data,
      title: editedTitle,
      id: selectedCategory.id,
      description: editedDescription,
    };
  
    if (selectedCategory.id === maxId + 1) {
      setMaxId(maxId + 1);
    }
  
    setModalOpen(false);
  };

  const handleDeleteClick = async () => {
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
            alt={'currentFile'}
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