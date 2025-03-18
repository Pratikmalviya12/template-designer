import React from 'react';
import { Grid, Paper, Box } from '@mui/material';
import { useStore } from '../store/useStore';

const SectionSelector: React.FC = () => {
  const { addSection } = useStore();

  const renderColumnPreview = (columns: number) => {
    return (
      <Grid container spacing={0.5} sx={{ height: '24px' }}>
        {Array.from({ length: columns }).map((_, index) => (
          <Grid 
            key={index} 
            item 
            xs={12 / columns}
          >
            <Box 
              sx={{ 
                height: '100%', 
                bgcolor: 'primary.main', 
                opacity: 0.7,
                borderRadius: 0.5
              }} 
            />
          </Grid>
        ))}
      </Grid>
    );
  };

  return (
    <Grid container spacing={1}>
      {Array.from({ length: 12 }, (_, i) => i + 1).map((columns) => (
        <Grid item xs={12} key={columns}>
          <Paper
            sx={{
              p: 1,
              cursor: 'pointer',
              '&:hover': {
                bgcolor: 'action.hover',
                borderColor: 'primary.main',
              },
              border: 1,
              borderColor: 'divider',
              transition: 'all 0.2s ease',
            }}
            onClick={() => addSection(columns)}
          >
            {renderColumnPreview(columns)}
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
};

export default SectionSelector; 