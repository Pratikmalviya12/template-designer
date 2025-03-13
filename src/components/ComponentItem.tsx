import React from "react";
import {
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  ListItemButton,
} from "@mui/material";
import {
  TextFields as TextIcon,
  Title as HeadingIcon,
  Article as ParagraphIcon,
  Image as ImageIcon,
  SmartButton as ButtonIcon,
  Share as SocialIcon,
  ShareOutlined as SocialShareIcon,
  Menu as MenuIcon,
  VideoLibrary as VideoIcon,
  Timer as TimerIcon,
} from "@mui/icons-material";
import { ComponentType, componentDefaults } from "../store/useStore";

interface ComponentItemProps {
  type: ComponentType;
  label: string;
  content: string;
}

const ComponentItem: React.FC<ComponentItemProps> = ({
  type,
  label,
  content,
}) => {
  const getIcon = () => {
    switch (type) {
      // Content
      case "text":
        return <TextIcon />;
      case "heading":
        return <HeadingIcon />;
      case "paragraph":
        return <ParagraphIcon />;
      case "image":
        return <ImageIcon />;
      case "button":
        return <ButtonIcon />;
      case "video":
        return <VideoIcon />;
      case "timer":
        return <TimerIcon />;
      // Social
      case "social":
        return <SocialIcon />;
      case "socialShare":
        return <SocialShareIcon />;
      case "menu":
        return <MenuIcon />;
      default:
        return null;
    }
  };

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    const defaults = componentDefaults[type];
    e.dataTransfer.setData(
      "component",
      JSON.stringify({
        type,
        ...defaults,
      })
    );
  };

  return (
    <Paper
      sx={{
        mb: 1,
        "&:hover": {
          bgcolor: "action.hover",
          borderColor: "primary.main",
        },
        border: 1,
        borderColor: "divider",
        transition: "all 0.2s ease",
      }}
    >
      <ListItem component="div" disablePadding>
        <ListItemButton
          draggable
          onDragStart={handleDragStart}
          sx={{
            borderRadius: 1,
            "& .MuiListItemIcon-root": {
              minWidth: 40,
            },
          }}
        >
          <ListItemIcon
            sx={{
              color: "primary.main",
            }}
          >
            {getIcon()}
          </ListItemIcon>
          <ListItemText
            primary={label}
            primaryTypographyProps={{
              variant: "body2",
              sx: { fontWeight: 500 },
            }}
          />
        </ListItemButton>
      </ListItem>
    </Paper>
  );
};

export default ComponentItem;
