import { useEffect, useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { UseControllerProps, useController } from 'react-hook-form';

export type Image = {publicId?: string, path?: string, pictureUrl?: string, preview?: string}

interface Props extends UseControllerProps {
    images?: Image[]
    control?: any
    name: string
    watchFiles: any[]
}

export function useDndList({images, watchFiles, control, name}: Props) {
  const [list, setList] = useState<Image[]>(images !== undefined ? images.map(img => {return {publicId: img.publicId, pictureUrl: img.pictureUrl}}) : [])

  const [reordered, setReordered] = useState(false)

  const {fieldState, field } = useController({control: control, name: name})

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;
    if (!destination) return;

    const reorderedList = Array.from(list);
    const [reorderedItem] = reorderedList.splice(source.index, 1);
    reorderedList.splice(destination.index, 0, reorderedItem);
    source.index !== destination.index && field.onChange(reorderedList.map(e => e.publicId || e.path))
    !reordered && source.index !== destination.index && setReordered(true)
    source.index !== destination.index && setList(reorderedList);
  };

  useEffect(() => {
    let abc = watchFiles?.map((wf: { path: any, preview: any }) => {return {path: wf.path, preview: wf.preview}}) || []
    if(abc.length > 0) {
      abc = abc.filter((e: { path: string | undefined }) => !list.some(t => t.path === e.path))
    }
    setList([...list, ...abc])
  }, [watchFiles])

  return {
    list,
    onDragEnd,
    reordered
  };
}
