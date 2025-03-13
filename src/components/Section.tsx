import React, { useState } from 'react';
import { Paper, IconButton, Tooltip, Box, Typography, TextField } from '@mui/material';
import { Delete, ContentCopy, DragIndicator, Edit } from '@mui/icons-material';
import { Section as SectionType, useStore } from '../store/useStore';
import Column from './Column';
import { Draggable } from 'react-beautiful-dnd';

interface SectionProps {
  section: SectionType;
  index: number;
}

const Section: React.FC<SectionProps> = ({ section, index }) => {
  const { removeSection, duplicateSection, updateSection } = useStore();
  const [isHovered, setIsHovered] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedId, setEditedId] = useState(section.id);
  
  const getGridColumns = (columns: number): Record<string, string | number> => {
    return {
      display: 'grid',
      gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
      width: '100%'
    };
  };

  const handleEditSave = () => {
    updateSection(section.id, { id: editedId });
    setIsEditing(false);
  };
  return (
    <Draggable draggableId={section.id} index={index}>
      {(provided, snapshot) => (
        <Paper 
          ref={provided.innerRef}
          {...provided.draggableProps}
          elevation={snapshot.isDragging ? 4 : 2}
          sx={{  
            position: 'relative',
            width: '100%',
            minHeight: '100px',
            transform: snapshot.isDragging ? 'rotate(1deg)' : 'none',
            '&:hover': {
              boxShadow: (theme) => theme.shadows[4]
            }
          }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {isHovered && (
            <Box sx={{
              position: 'absolute',
              top: -12,
              right: 8,
              bgcolor: 'white',
              borderRadius: 1,
              boxShadow: 2,
              display: 'flex',
              zIndex: 1
            }}>
              <Tooltip title="Drag section">
                <div {...provided.dragHandleProps}>
                  <IconButton size="small">
                    <DragIndicator fontSize="small" />
                  </IconButton>
                </div>
              </Tooltip>
              <Tooltip title="Edit section ID">
                <IconButton size="small" onClick={() => setIsEditing(true)}>
                  <Edit fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Duplicate section">
                <IconButton size="small" onClick={() => duplicateSection(section.id)}>
                  <ContentCopy fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete section">
                <IconButton size="small" onClick={() => removeSection(section.id)}>
                  <Delete fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          )}

          <Box
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                zIndex: 10
              }}
            >
              {isEditing ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, backgroundColor: 'white' }}>
                  <TextField
                    size="small"
                    value={editedId}
                    onChange={(e) => setEditedId(e.target.value)}
                    onBlur={handleEditSave}
                    onKeyPress={(e) => e.key === 'Enter' && handleEditSave()}
                    autoFocus
                  />
                </Box>
              ) : (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ opacity: 0.7 }}
                >
                  {section.id}
                </Typography>
              )}
            </Box>
        
          <Box sx={getGridColumns(section.columns)}>
            {Array.from({ length: section.columns }).map((_, index) => (
              <Column
                key={index}
                sectionId={section.id}
                columnIndex={index}
                components={section.components[index] || []}
              />
            ))}
          </Box>
        </Paper>
      )}
    </Draggable>
  );
};

export default Section; 