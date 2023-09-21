import React, { useState } from 'react';
import { Button } from '@mui/material';
import { Editor } from "react-draft-wysiwyg";
import { ContentState, EditorState, convertFromHTML, convertToRaw } from 'draft-js';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import 'draft-js/dist/Draft.css';
import agent from 'app/api/agent';
import { IProduct } from 'app/models/product';
import draftToHtml from 'draftjs-to-html';
import { Control, FieldValues, useController } from 'react-hook-form';

interface ProductSpecificationsProps {
  selectedProduct: undefined | IProduct
  control: Control<FieldValues, any>
}

const ProductSpecifications: React.FC<ProductSpecificationsProps> = ({ selectedProduct, control }) => {

  const {fieldState, field } = useController({control: control, name: 'productSpecification'})

  const contentBlocks = convertFromHTML(selectedProduct?.richDescription || '');
  const cs = ContentState.createFromBlockArray(
    contentBlocks.contentBlocks,
    contentBlocks.entityMap,
  );
  const es = EditorState.createWithContent(cs)

  const [editorState, setEditorState] = useState(selectedProduct?.richDescription ? es : EditorState.createEmpty());

  const updateState = (editorState: EditorState) => {
    field.onChange(editorState)
    setEditorState(editorState)
  }

  const handleSave = async () => {
    const contentState = editorState.getCurrentContent();
    const rawContentState = convertToRaw(contentState);
    const stringifiedHtmlContentstate = (JSON.stringify(draftToHtml(rawContentState)))
    const cleanedHtml = stringifiedHtmlContentstate.replace(/\\n/g, '').replace(/"/g, '');


    await agent.Admin.createDescription({richText: cleanedHtml, productId: selectedProduct?.id});
  }

  return (
    <div style={{border: '5px solid lightgrey', minHeight: 250}}>
      <Editor
        editorState={editorState}
        editorStyle={{marginLeft: 15}}
        onEditorStateChange={(newEditorState) => updateState(newEditorState)}
      />
      </div>
  );
};

export default ProductSpecifications;
