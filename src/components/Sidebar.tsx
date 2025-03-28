import React from 'react';
import { 
  Paper, 
  Typography, 
  Divider, 
  List, 
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import {
  ViewColumn as LayoutIcon,
  Article as ContentIcon,
  Share as SocialIcon,
  ExpandMore as ExpandMoreIcon,
} from '@mui/icons-material';
import { useStore, ComponentType } from '../store/useStore';
import SectionSelector from './SectionSelector';
import ComponentItem from './ComponentItem';

const Sidebar: React.FC = () => {
  const componentCategories = {
    'Content': {
      icon: <ContentIcon />,
      components: [
        { type: 'text', label: 'Text', content: 'Add your text here' },
        { type: 'heading', label: 'Heading', content: 'Heading' },
        { type: 'paragraph', label: 'Paragraph', content: 'Add your paragraph text here' },
        { type: 'image', label: 'Image', content: 'https://via.placeholder.com/150' },
        { type: 'button', label: 'Button', content: 'Click Me' },
        { type: 'video', label: 'Video', content: '' },
        { type: 'timer', label: 'Timer', content: '' },
      ],
    },
    'Social': {
      icon: <SocialIcon />,
      components: [
        { type: 'social', label: 'Social Follow', content: '' },
        { type: 'socialShare', label: 'Social Share', content: '' },
        { type: 'menu', label: 'Menu', content: '' },
      ],
    },
  };

  return (
    <Paper 
      sx={{ 
        width: 300, 
        height: '100%', 
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          Template Designer
        </Typography>
      </Box>

      <Box sx={{ overflowY: 'auto', flexGrow: 1 }}>
        <Box sx={{ p: 2 }}>
          <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
            Add Sections
          </Typography>
          <SectionSelector />
        </Box>

        <Divider />

        {Object.entries(componentCategories).map(([category, { icon, components }]) => (
          <Accordion key={category} defaultExpanded>
            <AccordionSummary 
              expandIcon={<ExpandMoreIcon />}
              sx={{ 
                '&.Mui-expanded': { 
                  minHeight: 48,
                  margin: '0 !important'
                }
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ color: 'primary.main' }}>{icon}</Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  {category}
                </Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails sx={{ p: 1 }}>
              <List disablePadding>
                {components.map((component) => (
                  <ComponentItem 
                    key={component.type} 
                    type={component.type as ComponentType} 
                    label={component.label} 
                    content={component.content} 
                  />
                ))}
              </List>
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>
    </Paper>
  );
};

export default Sidebar; 