import React from 'react';
import { Box } from '@mui/material';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import { useStore } from './store/useStore';
import Sidebar from './components/Sidebar';
import Canvas from './components/Canvas';
import PropertiesPanel from './components/PropertiesPanel';

const App: React.FC = () => {
  const { moveComponent } = useStore();

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const sourceId = result.source.droppableId;
    const destId = result.destination.droppableId;

    // Extract section and column IDs from the droppable ID
    const [, sourceSectionId, sourceColumnIndex] = sourceId.split('-');
    const [, destSectionId, destColumnIndex] = destId.split('-');

    moveComponent(
      sourceSectionId,
      parseInt(sourceColumnIndex),
      result.source.index,
      destSectionId,
      parseInt(destColumnIndex),
      result.destination.index
    );
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
