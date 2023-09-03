import React from 'react';
import { Box, Button } from '@mui/material';
import { useFieldArray, useForm } from 'react-hook-form';
import ProductSpecification from './ProductSpecification';

interface ProductSpecificationsProps {
  control?: any;
  specifications: any[];
}

const ProductSpecifications: React.FC<ProductSpecificationsProps> = ({ specifications }) => {


  const {  handleSubmit, reset, control } = useForm()
  const { fields, append, remove } = useFieldArray({ control, name: 'specifications' })

  const handleSave = (data: any) => {
    console.log(data)
  }

  return (
    <div style={{display: 'flex', gap: 10, flexDirection: 'column'}}>
         {fields.map((f, id) => <ProductSpecification id={id} control={control}/>)}
         <Box mt={2}>
        <Button variant='outlined' color='success' onClick={() => append({ key: '', values: [] })}>
          Add Specification
        </Button>
      </Box>
      <Button color='primary' onClick={handleSubmit(handleSave)}>Save</Button>
    </div>
  );
};

export default ProductSpecifications;
