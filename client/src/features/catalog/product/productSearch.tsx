import { debounce } from '@mui/material/utils';
import { Paper, TextField } from '@mui/material';
import React, { useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/store/configureStore';
import { setProductParams } from '.././catalogSlice';

export default function ProductSearch() {
  const { productParams } = useAppSelector((state) => state.catalog);
  const [searchTerm, setSearchTerm] = useState(productParams.searchTerm);
  const dispatch = useAppDispatch();
  const timer = useRef<NodeJS.Timeout>()

  const debouncedSearch = (value: string) => {
    if(timer.current) clearTimeout(timer.current)
    timer.current = setTimeout(() => dispatch(setProductParams({ searchTerm: value })), 500);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setSearchTerm(newValue);
    debouncedSearch(newValue);
  };

  return (
    <Paper sx={{ mb: 2, bgcolor: 'special' }}>
      <TextField
        label='Søk blant produkter'
        variant='outlined'
        fullWidth
        value={searchTerm || ''}
        onChange={handleInputChange}
      />
    </Paper>
  );
}
