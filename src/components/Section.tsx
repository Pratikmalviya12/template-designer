import React, { useState } from 'react';
import { Paper, IconButton, Tooltip, Box } from '@mui/material';
import { Delete, ContentCopy, DragIndicator } from '@mui/icons-material';
import { Section as SectionType, useStore } from '../store/useStore';
import Column from './Column';

interface SectionProps {
  section: SectionType;
}

const Section: React.FC<SectionProps> = ({ section }) => {
  const { removeSection, duplicateSection } = useStore();
  const [isHovered, setIsHovered] = useState(false);
  
  const getGridColumns = (columns: number): Record<string, string | number> => {
    return {
      display: 'grid',
      gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
      width: '100%'
    };
  };

  return (
    <Paper 
      elevation={2}
      sx={{  
        position: 'relative',
        width: '100%'
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
            <IconButton size="small">
              <DragIndicator fontSize="small" />
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
      
      <Box sx={getGridColumns(section.columns)}>
        {Array.from({ length: section.columns }).map((_, columnIndex) => (
          <Column 
            key={`${section.id}-${columnIndex}`}
            sectionId={section.id}
            columnIndex={columnIndex}
            components={section.components[columnIndex] || []}
          />
        ))}
      </Box>
    </Paper>
  );
};

export default Section; 