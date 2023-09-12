import { ContentState, Editor, EditorState, convertFromHTML } from "draft-js"
import './RichText.css'

interface Props {
    richText: string | undefined
}

export const RichTextDisplay = ({richText = ''}: Props) => {

    const blockStyleFn = (contentBlock: { getType: () => any }) => {
        const type = contentBlock.getType()
        if (type === 'blockquote') {
          return 'custom-blockquote'
        }
        return ''
      }

    const contentBlocks = convertFromHTML(richText)
    const contentState2 = ContentState.createFromBlockArray(
      contentBlocks.contentBlocks,
      contentBlocks.entityMap,
    )
    const editorState = EditorState.createWithContent(contentState2)

    return (
      <Editor
        onChange={() => console.log()}
        editorState={editorState}
        readOnly
        blockStyleFn={blockStyleFn}
      />
    )
}