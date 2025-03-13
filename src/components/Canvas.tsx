import React from 'react';
import { Paper, Typography, Box, TextField, Stack, Button } from '@mui/material';
import { useStore } from '../store/useStore';
import Section from './Section';
import { DragDropContext, Droppable, DropResult } from 'react-beautiful-dnd';
import { Download as DownloadIcon } from '@mui/icons-material';

const Canvas: React.FC = () => {
  const { sections, canvasWidth, canvasHeight, updateCanvasDimensions, currentTemplate, updateTemplateName, generateTemplateHtml } = useStore();

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const sourceIndex = result.source.index;
    const destinationIndex = result.destination.index;

    // Reorder sections
    const reorderedSections = Array.from(sections);
    const [removed] = reorderedSections.splice(sourceIndex, 1);
    reorderedSections.splice(destinationIndex, 0, removed);

    // Update the store with the new order
    useStore.setState({ sections: reorderedSections });
  };

  const handleDownload = () => {
    const html = generateTemplateHtml();
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentTemplate.name.toLowerCase().replace(/\s+/g, '-')}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
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
      <Stack 
        direction="row" 
        spacing={2} 
        sx={{ mb: 2 }}
        justifyContent="center"
        alignItems="center"
      >
        <TextField
          label="Template Name"
          value={currentTemplate.name}
          size="small"
          sx={{ width: 200 }}
          onChange={(e) => updateTemplateName(e.target.value)}
        />
        <TextField
          label="Canvas Width"
          defaultValue={canvasWidth}
          size="small"
          sx={{ width: 150 }}
          onChange={(e) => updateCanvasDimensions(e.target.value)}
        />
        <TextField
          label="Canvas Height"
          defaultValue={canvasHeight}
          size="small"
          sx={{ width: 150 }}
          onChange={(e) => updateCanvasDimensions(undefined, e.target.value)}
        />
        <Button
          variant="contained"
          startIcon={<DownloadIcon />}
          onClick={handleDownload}
          sx={{ ml: 'auto !important' }}
        >
          Download Template
        </Button>
      </Stack>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Paper sx={{ 
          p: 3,
          margin: 'auto',
          minHeight: canvasHeight,
          bgcolor: 'white',
          width: canvasWidth
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
          
          <Droppable droppableId="canvas-drop-area" type="SECTION">
            {(provided, snapshot) => (
              <Box 
                ref={provided.innerRef}
                {...provided.droppableProps}
                sx={{ 
                  '& > *:not(:last-child)': { mb: 2 },
                  minHeight: 100,
                  transition: 'all 0.2s ease',
                  border: snapshot.isDraggingOver ? '2px dashed' : '2px solid transparent',
                  borderRadius: 1,
                  p: snapshot.isDraggingOver ? 2 : 0
                }}
              >
                {sections.map((section, index) => (
                  <Section 
                    key={section.id} 
                    section={section}
                    index={index}
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