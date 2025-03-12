import React from 'react';
import { Paper } from '@mui/material';
import { Droppable, DroppableProvided, DroppableStateSnapshot } from 'react-beautiful-dnd';
import { EmailComponent as EmailComponentType, useStore } from '../store/useStore';
import EmailComponent from './EmailComponent';

interface ColumnProps {
  sectionId: string;
  columnIndex: number;
  components: EmailComponentType[];
}

const Column: React.FC<ColumnProps> = ({ sectionId, columnIndex, components }) => {
  const { addComponent } = useStore();
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const componentData = e.dataTransfer.getData('component');
    
    if (componentData) {
      try {
        const data = JSON.parse(componentData);
        addComponent(sectionId, columnIndex, data.type);
      } catch (error) {
        console.error('Failed to parse component data', error);
      }
    }
  };
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };
  
  return (
    <Droppable droppableId={`column-${sectionId}-${columnIndex}`}>
      {(provided: DroppableProvided, snapshot: DroppableStateSnapshot) => (
        <Paper
          ref={provided.innerRef}
          {...provided.droppableProps}
          sx={{
            minHeight: 100,
            p: 1,
            border: '1px dashed',
            borderColor: snapshot.isDraggingOver ? 'primary.main' : 'grey.300',
            bgcolor: snapshot.isDraggingOver ? 'action.hover' : 'transparent',
            transition: 'all 0.2s ease',
            width: '100%',
            boxSizing: 'border-box',
            '& > *:not(:last-child)': {
              mb: 1
            }
          }}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          {components.map((component, index) => (
            <EmailComponent
              key={component.id}
              component={component}
              sectionId={sectionId}
              columnIndex={columnIndex}
              index={index}
            />
          ))}
          {provided.placeholder}
        </Paper>
      )}
    </Droppable>
  );
};

export default Column; 