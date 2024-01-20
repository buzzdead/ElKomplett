import { useEffect, useState } from 'react';
import { DropResult } from 'react-beautiful-dnd';
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

  const {field } = useController({control: control, name: name})

  const reorderList = (list: Image[], startIndex: number, endIndex: number) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    field.onChange(result.map(e => e.publicId || e.path))
    !reordered && setReordered(true)
    setList(result);
  }

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;
    if (!destination || source.index === destination.index) return;
    reorderList(list, source.index, destination.index);
  };

  const mapFiles = (files: Image[]) => files?.map(({ path, preview }) => ({ path, preview })) || [];
  const filterFiles = (files: Image[], list: Image[]) => files.filter(({ path }) => !list.some(item => item.path === path));

  useEffect(() => {
    const updatedFiles = filterFiles(mapFiles(watchFiles), list);
    if (updatedFiles.length > 0) {
      setList(prevList => [...prevList, ...updatedFiles]);
    }
  }, [watchFiles, list]);

  return {
    list,
    onDragEnd,
    reordered
  };
}
