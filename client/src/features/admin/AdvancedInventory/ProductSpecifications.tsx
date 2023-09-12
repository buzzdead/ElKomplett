import React, { useState } from 'react';
import { Button } from '@mui/material';
import { Editor } from "react-draft-wysiwyg";
import { ContentState, EditorState, convertFromHTML, convertToRaw } from 'draft-js';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import 'draft-js/dist/Draft.css';
import agent from 'app/api/agent';
import { IProduct } from 'app/models/product';
import draftToHtml from 'draftjs-to-html';

interface ProductSpecificationsProps {
  selectedProduct: undefined | IProduct
}

const ProductSpecifications: React.FC<ProductSpecificationsProps> = ({ selectedProduct }) => {

  const contentBlocks = convertFromHTML(selectedProduct?.richDescription || '');
  const cs = ContentState.createFromBlockArray(
    contentBlocks.contentBlocks,
    contentBlocks.entityMap,
  );
  const es = EditorState.createWithContent(cs)

  const [editorState, setEditorState] = useState(selectedProduct?.richDescription ? es : EditorState.createEmpty());

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
        Save
      </Button>
      </div>
  );
};

export default ProductSpecifications;
