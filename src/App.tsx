import React from 'react';
import { Box } from '@mui/material';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import { useStore } from './store/useStore';
import Sidebar from './components/Sidebar';
import Canvas from './components/Canvas';
import PropertiesPanel from './components/PropertiesPanel';

const App: React.FC = () => {
  const { moveComponent, sections } = useStore();

  const handleDragEnd = (result: DropResult) => {
    const { source, destination } = result;
    
    // Dropped outside the list
    if (!destination) {
      return;
    }

    // Handle section reordering within canvas-sections
    if (source.droppableId === 'canvas-sections' && destination.droppableId !== 'canvas-sections') {
      // Don't do anything if dropped in the same position
      const desId = destination.droppableId.split('-').slice(1, -1).join('-')
      const desIndex = sections.findIndex(section => section.id === desId)
      if (source.index === desIndex) {
        return;
      }
      
      // Create a new array with the reordered sections
      const newSections = Array.from(sections);
      const [removed] = newSections.splice(source.index, 1);
      newSections.splice(desIndex, 0, removed);
      
      // Update the store
      useStore.setState({ sections: newSections });
      return;
    }

    // Handle component dragging between columns
    if (source.droppableId.startsWith('column-') && destination.droppableId.startsWith('column-')) {
      // Extract section and column IDs from the droppable ID
      const [, sourceSectionId, sourceColumnIndex] = source.droppableId.split('-');
      const [, destSectionId, destColumnIndex] = destination.droppableId.split('-');

      moveComponent(
        sourceSectionId,
        parseInt(sourceColumnIndex),
        source.index,
        destSectionId,
        parseInt(destColumnIndex),
        destination.index
      );
    }
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Box sx={{ 
        display: 'flex',
        justifyContent: 'space-between',
        height: '100vh',
        bgcolor: 'grey.100'
      }}>
        <Sidebar />
        <Canvas />
        <PropertiesPanel />
      </Box>
    </DragDropContext>
  );
};

export default App;
