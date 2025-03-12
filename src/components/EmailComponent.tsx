import React from "react";
import { Box, IconButton, Paper, Tooltip } from "@mui/material";
import { ContentCopy, Delete } from "@mui/icons-material";
import { Draggable } from "react-beautiful-dnd";
import {
  useStore,
  EmailComponent as EmailComponentType,
} from "../store/useStore";

interface EmailComponentProps {
  component: EmailComponentType;
  sectionId: string;
  columnIndex: number;
  index: number;
}

const EmailComponent: React.FC<EmailComponentProps> = ({
  component,
  sectionId,
  columnIndex,
  index,
}) => {
  const {
    duplicateComponent,
    removeComponent,
    selectComponent,
    selectedComponent,
  } = useStore();

  const isSelected = selectedComponent?.component.id === component.id;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    selectComponent(sectionId, columnIndex, index);
  };

  return (
    <Draggable draggableId={component.id} index={index}>
      {(provided) => (
        <Box
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onClick={handleClick}
          sx={{
            position: "relative",
            cursor: "pointer",
            "&:hover .component-actions": {
              opacity: 1,
            },
          }}
        >
          <Paper
            elevation={isSelected ? 2 : 0}
            sx={{
              p: 2,
              border: isSelected
                ? "2px solid #1976d2"
                : "1px solid transparent",
              ...component.style,
            }}
          >
            {component.type === "image" ? (
              <img
                src={component.properties?.src}
                alt={component.properties?.altText}
                style={component.style as React.CSSProperties}
              />
            ) : component.type === "video" ? (
              <video
                src={component.properties?.src}
                style={component.style as React.CSSProperties}
                controls={component.properties?.controls}
                loop={component.properties?.loop}
                autoPlay={component.properties?.autoplay}
              />
            ) : (
              component.content || component.type
            )}
            <Box
              className="component-actions"
              sx={{
                position: "absolute",
                top: -16,
                right: 8,
                opacity: 0,
                transition: "opacity 0.2s",
                bgcolor: "background.paper",
                borderRadius: 1,
                boxShadow: 1,
                display: "flex",
                gap: "4px",
                padding: "4px",
              }}
            >
              <Tooltip title="Duplicate component" placement="top">
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    duplicateComponent(sectionId, columnIndex, index);
                  }}
                  sx={{
                    "&:hover": {
                      bgcolor: "action.hover",
                      color: "primary.main",
                    },
                  }}
                >
                  <ContentCopy fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete component" placement="top">
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeComponent(sectionId, columnIndex, index);
                  }}
                  sx={{
                    "&:hover": {
                      bgcolor: "error.light",
                      color: "error.main",
                    },
                  }}
                >
                  <Delete fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          </Paper>
        </Box>
      )}
    </Draggable>
  );
};

export default EmailComponent;
