import React, { useState } from 'react';
import { Button } from '@mui/material';
import { useFieldArray, useForm } from 'react-hook-form';
import { Editor } from "react-draft-wysiwyg";
import { ContentState, EditorState, convertFromHTML, convertToRaw } from 'draft-js';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import 'draft-js/dist/Draft.css';
import agent from 'app/api/agent';
import { IProduct } from 'app/models/product';
import draftToHtml from 'draftjs-to-html';

interface ProductSpecificationsProps {
  control?: any;
  specifications: any[];
  selectedProduct: undefined | IProduct
}

const ProductSpecifications: React.FC<ProductSpecificationsProps> = ({ specifications, selectedProduct }) => {

  const { handleSubmit, reset, control } = useForm();
  const { fields, append, remove } = useFieldArray({ control, name: 'specifications' });
  const contentBlocks = convertFromHTML(selectedProduct?.richDescription || '');
  const contentState2 = ContentState.createFromBlockArray(
    contentBlocks.contentBlocks,
    contentBlocks.entityMap
  );
  const ne = EditorState.createWithContent(contentState2)

  const [editorState, setEditorState] = useState(selectedProduct?.richDescription ? ne : EditorState.createEmpty());

  const handleSave = async () => {
    const contentState = editorState.getCurrentContent();
    const rawContentState = convertToRaw(contentState);
    const stringifiedHtmlContentstate = (JSON.stringify(draftToHtml(rawContentState)))
    const cleanedHtml = stringifiedHtmlContentstate.replace(/\\n/g, '').replace(/"/g, '');

    await agent.Admin.createDescription({richText: cleanedHtml, productId: selectedProduct?.id});
  }

  return (
    <div>
      <Editor
        editorState={editorState}
        onEditorStateChange={(newEditorState) => setEditorState(newEditorState)}
      />
      <Button onClick={handleSave}>
        sAve
      </Button>
      </div>
  );
};

export default ProductSpecifications;
