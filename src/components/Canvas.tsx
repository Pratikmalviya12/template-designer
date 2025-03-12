import React from 'react';
import { Paper, Typography, Box } from '@mui/material';
import { useStore } from '../store/useStore';
import Section from './Section';
import { DragDropContext, Droppable, DropResult } from 'react-beautiful-dnd';

const Canvas: React.FC = () => {
  const { sections } = useStore();

  const handleDragEnd = (result: DropResult) => {
    // Drag and drop handling will be implemented later
  };

  return (
    <Box sx={{ 
      flexGrow: 1, 
      p: 3, 
      overflowY: 'auto',
      '& *': {
        boxSizing: 'border-box'
      }
    }}>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Paper sx={{ 
          p: 3,
          margin: 'auto',
          minHeight: 800, 
          bgcolor: 'white',
          width: '600px'
        }}>
          <Typography 
            variant="h6" 
            sx={{ 
              mb: 2, 
              textAlign: 'center', 
              color: 'text.secondary' 
            }}
          >
            {sections.length === 0 && 'Drag sections from the sidebar to start designing'}
          </Typography>
          
          <Droppable droppableId="canvas-drop-area">
            {(provided) => (
              <Box 
                ref={provided.innerRef}
                {...provided.droppableProps}
                sx={{ '& > *:not(:last-child)': { mb: 2 } }}
              >
                {sections.map((section) => (
                  <Section 
                    key={section.id} 
                    section={section} 
                  />
                ))}
                {provided.placeholder}
              </Box>
            )}
          </Droppable>
        </Paper>
      </DragDropContext>
    </Box>
  );
};

export default Canvas; 