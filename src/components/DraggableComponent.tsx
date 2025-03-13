import React from "react";
import { Box, Button, IconButton, Paper, Tooltip } from "@mui/material";
import { ContentCopy, Delete, Facebook, Twitter, Instagram, LinkedIn, YouTube, Pinterest } from "@mui/icons-material";
import { Draggable } from "react-beautiful-dnd";
import {
  useStore,
  DraggableComponent as DraggableComponentType,
} from "../store/useStore";

interface DraggableComponentProps {
  component: DraggableComponentType;
  sectionId: string;
  columnIndex: number;
  index: number;
}

const DraggableComponent: React.FC<DraggableComponentProps> = ({
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

  const renderSocialIcons = () => {
    const socialMedia = component.properties?.socialMedia || [];
    
    const getIcon = (type: string) => {
      switch(type) {
        case 'facebook':
          return <Facebook />;
        case 'twitter':
          return <Twitter />;
        case 'instagram':
          return <Instagram />;
        case 'linkedin':
          return <LinkedIn />;
        case 'youtube':
          return <YouTube />;
        case 'pinterest':
          return <Pinterest />;
        default:
          return null;
      }
    };

    return (
      <Box sx={{ 
        display: 'flex', 
        gap: '12px',
        justifyContent: 'center',
        alignItems: 'center',
        ...component.style
      }}>
        {socialMedia
          .filter(item => item.enabled)
          .map((item, i) => (
            <IconButton
              key={`${item.type}-${i}`}
              component="a"
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                color: 'inherit',
                '&:hover': {
                  color: theme => {
                    switch(item.type) {
                      case 'facebook':
                        return '#1877F2';
                      case 'twitter':
                        return '#1DA1F2';
                      case 'instagram':
                        return '#E4405F';
                      case 'linkedin':
                        return '#0A66C2';
                      case 'youtube':
                        return '#FF0000';
                      case 'pinterest':
                        return '#BD081C';
                      default:
                        return theme.palette.primary.main;
                    }
                  }
                }
              }}
            >
              {getIcon(item.type)}
            </IconButton>
          ))}
      </Box>
    );
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
            ) : 
              component.type === "timer" ? (
                <div className="timer" style={{ whiteSpace: "pre-wrap", wordWrap: "break-word"}}>
                  {component.properties?.endDate}
                </div>
              )
              :
              component.type === "menu" ? (
                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                  {component.properties?.menuItems?.map((item, index) => (
                    <li key={index}>{item.text}</li>
                  ))}
                </ul>
              ):
              component.type === "heading" ? (
                component.properties?.level ? 
                React.createElement(component.properties?.level, {
                  style: { whiteSpace: "pre-wrap", wordWrap: "break-word", margin: 0 }
                }, component.content)
                :
                <h2 style={{ whiteSpace: "pre-wrap", wordWrap: "break-word", margin: 0 }}>
                  {component.content}
                </h2>
              )
              :component.type === "button" ? (
                <Button sx={{ ...component.style as React.CSSProperties }}>
                  {component.content}
                </Button>
              )
              :component.type === "paragraph" ? (
                <p style={{ whiteSpace: "pre-wrap", wordWrap: "break-word", margin: 0 }}>
                  {component.content}
                </p>
              )
              :component.type === "social" ? (
                renderSocialIcons()
              )
              : (
                <div style={{ whiteSpace: "pre-wrap", wordWrap: "break-word" }}>
                  {component.content}
                </div>
              )
              }
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

export default DraggableComponent;
