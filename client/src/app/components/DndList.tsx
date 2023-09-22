import { Box } from '@mui/material'
import AppDropzone from 'app/components/AppDropzone'
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd'
import { Image, useDndList } from '../hooks/useDndList'
import { Control, FieldValues } from 'react-hook-form'
import Render from 'app/layout/Render'

interface Props {
    control: Control<FieldValues, any>
    onDragEnd: (result: DropResult) => void
    list: Image[]
    small?: boolean
    name?: string
    
}

export const DndList = ({control, onDragEnd, list, small = false, name='files'}: Props) => {

  const getItemStyle = (isDragging: boolean, draggableStyle: any) => ({
    background: isDragging ? '#4a2975' : 'white',
    color: isDragging ? 'white' : 'black',
    border: '1px solid black',
    fontSize: '20px',
    borderRadius: '5px',
    ...draggableStyle,
  })
  return (
    <Box
      display='flex'
      alignItems='center'
      gap={small && list.length > 5 ? 2.5 : 5}
      flexDirection={small ? list.length > 5 ? 'column' : 'row' : 'row'}
    >
      <Render condition={small}>
      <AppDropzone height={60} width={100} iconSize='30px' control={control} name={name} />
      <AppDropzone height={200} width={150} control={control} name={name} />
      </Render>
      
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId='index' direction='horizontal'>
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              style={{ display: 'flex', flexDirection: 'row', gap: 5, flexWrap: 'wrap' }}
            >
              {list?.map((f, index: number) => {
                return (
                  <Draggable key={index} draggableId={index.toString()} index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={getItemStyle(snapshot.isDragging, provided.draggableProps.style)}
                      >
                        <img
                          key={index}
                          src={f.pictureUrl || f.preview}
                          alt={`Image ${index}`}
                          style={{ maxHeight: small ? 50 : 200 }}
                        />
                      </div>
                    )}
                  </Draggable>
                )
              })}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </Box>
  )
}
