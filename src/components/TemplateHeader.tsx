import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  TextField,
  Box,
} from '@mui/material';
import {
  Save as SaveIcon,
  Undo as UndoIcon,
  Redo as RedoIcon,
  Preview as PreviewIcon,
  Send as SendIcon,
} from '@mui/icons-material';
import { useStore } from '../store/useStore';

const TemplateHeader: React.FC = () => {
  const { currentTemplate } = useStore();

  return (
    <AppBar position="static" color="default" elevation={1}>
      <Toolbar>
        <TextField
          value={currentTemplate.name}
          onChange={(e) => {/* Add handler */}}
          variant="standard"
          sx={{ mr: 2 }}
        />
        
        <Box sx={{ flexGrow: 1 }} />
        
        <Button
          variant="contained"
          startIcon={<SaveIcon />}
          sx={{ mx: 1 }}
          >
          Save
          </Button>
        
      </Toolbar>
    </AppBar>
  );
};

export default TemplateHeader;
