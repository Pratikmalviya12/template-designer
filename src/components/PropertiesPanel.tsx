import React, { useState } from "react";
import {
  Paper,
  Typography,
  Box,
  TextField,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  Button,
  Stack,
  Divider,
  Switch,
  FormControlLabel,
  Tabs,
  Tab,
} from "@mui/material";
import { useStore, ComponentStyle } from "../store/useStore";

interface MenuItemType {
  text: string;
  url: string;
}

export interface ComponentProperties {
  url?: string;
  altText?: string;
  controls?: string;
  autoplay?: string;
  loop?: string;
  responsive?: string;
  endDate?: string;
  format?: string;
  menuItems?: Array<{ text: string; url: string }>;
  [key: string]: any;
}

export interface ComponentDefaults {
  content: string;
  style?: ComponentStyle;
  properties?: ComponentProperties;
}

const PropertiesPanel: React.FC = () => {
  const {
    selectedComponent,
    currentTemplate,
    updateComponent,
    updateComponentStyle,
  } = useStore();

  const [activeTab, setActiveTab] = useState(0);

  if (!selectedComponent) {
    return (
      <Paper
        sx={{
          width: 300,
          height: "100%",
          borderLeft: 1,
          borderColor: "divider",
        }}
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Select a component to edit its properties
          </Typography>
        </Box>
      </Paper>
    );
  }

  const handlePropertyChange = (property: string, value: any) => {
    updateComponent(selectedComponent.component.id, {
      properties: {
        ...selectedComponent.component.properties,
        [property]: value,
      },
    });
  };

  const handleStyleChange = (property: string, value: string) => {
    if (selectedComponent) {
      updateComponentStyle(
        selectedComponent.sectionId,
        selectedComponent.columnIndex,
        selectedComponent.index,
        property,
        value.toString()
      );
    }
  };

  const renderBasicProperties = () => {
    const showContent = !["image", "video"].includes(
      selectedComponent.component.type
    );

    return (
      <Stack spacing={2}>
        {showContent && (
          <>
            <TextField
              label="Content"
              value={
                currentTemplate.sections.find(
                  (section) => section.id === selectedComponent.sectionId
                )?.components[selectedComponent.columnIndex][
                  selectedComponent.index
                ]?.content
              }
              onChange={(e) =>
                updateComponent(selectedComponent.component.id, {
                  content: e.target.value,
                })
              }
              multiline={["text", "paragraph", "heading"].includes(
                selectedComponent.component.type
              )}
              rows={selectedComponent.component.type === "paragraph" ? 4 : 1}
              fullWidth
            />
            <Divider />
          </>
        )}

        <Typography variant="subtitle2">Dimensions</Typography>
        <TextField
          label="Width"
          value={selectedComponent.component.style?.width || ""}
          onChange={(e) => handleStyleChange("width", e.target.value)}
          placeholder="auto, 100%, 200px"
          fullWidth
        />
        <TextField
          label="Height"
          value={selectedComponent.component.style?.height || ""}
          onChange={(e) => handleStyleChange("height", e.target.value)}
          placeholder="auto, 100%, 200px"
          fullWidth
        />

        <Divider />

        <Typography variant="subtitle2">Spacing</Typography>
        <TextField
          label="Padding"
          value={selectedComponent.component.style?.padding || ""}
          onChange={(e) => handleStyleChange("padding", e.target.value)}
          placeholder="8px, 1rem, 10px 20px"
          fullWidth
        />

        <FormControl fullWidth>
          <InputLabel>Text Align</InputLabel>
          <Select
            value={selectedComponent.component.style?.textAlign || "left"}
            onChange={(e) => handleStyleChange("textAlign", e.target.value)}
            label="Text Align"
          >
            <MenuItem value="left">Left</MenuItem>
            <MenuItem value="center">Center</MenuItem>
            <MenuItem value="right">Right</MenuItem>
          </Select>
        </FormControl>
      </Stack>
    );
  };

  const renderTextProperties = () => {
    if (
      !["text", "heading", "paragraph", "button"].includes(
        selectedComponent.component.type
      )
    ) {
      return (
        <Typography variant="body2" color="text.secondary">
          Text properties are not available for this component type.
        </Typography>
      );
    }

    return (
      <Stack spacing={2}>
        <Typography variant="subtitle2">Typography</Typography>

        <TextField
          label="Font Size"
          value={selectedComponent.component.style?.fontSize || ""}
          onChange={(e) => handleStyleChange("fontSize", e.target.value)}
          placeholder="16px, 1.2rem, 2em"
          fullWidth
        />

        <FormControl fullWidth>
          <InputLabel>Font Weight</InputLabel>
          <Select
            value={selectedComponent.component.style?.fontWeight || "normal"}
            onChange={(e) => handleStyleChange("fontWeight", e.target.value)}
            label="Font Weight"
          >
            <MenuItem value="normal">Normal</MenuItem>
            <MenuItem value="bold">Bold</MenuItem>
            <MenuItem value="lighter">Lighter</MenuItem>
            <MenuItem value="bolder">Bolder</MenuItem>
            <MenuItem value="100">100</MenuItem>
            <MenuItem value="200">200</MenuItem>
            <MenuItem value="300">300</MenuItem>
            <MenuItem value="400">400</MenuItem>
            <MenuItem value="500">500</MenuItem>
            <MenuItem value="600">600</MenuItem>
            <MenuItem value="700">700</MenuItem>
            <MenuItem value="800">800</MenuItem>
            <MenuItem value="900">900</MenuItem>
          </Select>
        </FormControl>

        <FormControl fullWidth>
          <InputLabel>Font Family</InputLabel>
          <Select
            value={
              selectedComponent.component.style?.fontFamily ||
              "Arial, sans-serif"
            }
            onChange={(e) => handleStyleChange("fontFamily", e.target.value)}
            label="Font Family"
          >
            <MenuItem value="Arial, sans-serif">Arial</MenuItem>
            <MenuItem value="'Times New Roman', serif">
              Times New Roman
            </MenuItem>
            <MenuItem value="'Courier New', monospace">Courier New</MenuItem>
            <MenuItem value="Georgia, serif">Georgia</MenuItem>
            <MenuItem value="'Trebuchet MS', sans-serif">Trebuchet MS</MenuItem>
            <MenuItem value="Verdana, sans-serif">Verdana</MenuItem>
            <MenuItem value="'Segoe UI', sans-serif">Segoe UI</MenuItem>
            <MenuItem value="'Roboto', sans-serif">Roboto</MenuItem>
            <MenuItem value="'Open Sans', sans-serif">Open Sans</MenuItem>
          </Select>
        </FormControl>

        <TextField
          label="Color"
          value={selectedComponent.component.style?.color || ""}
          onChange={(e) => handleStyleChange("color", e.target.value)}
          placeholder="#000000, rgb(0,0,0), black"
          fullWidth
        />

        <Divider />

        <Typography variant="subtitle2">Text Styling</Typography>

        <TextField
          label="Line Height"
          value={selectedComponent.component.style?.lineHeight || ""}
          onChange={(e) => handleStyleChange("lineHeight", e.target.value)}
          placeholder="1.5, 24px, normal"
          fullWidth
        />

        <TextField
          label="Letter Spacing"
          value={selectedComponent.component.style?.letterSpacing || ""}
          onChange={(e) => handleStyleChange("letterSpacing", e.target.value)}
          placeholder="normal, 2px, 0.1em"
          fullWidth
        />

        <FormControl fullWidth>
          <InputLabel>Text Transform</InputLabel>
          <Select
            value={selectedComponent.component.style?.textTransform || "none"}
            onChange={(e) => handleStyleChange("textTransform", e.target.value)}
            label="Text Transform"
          >
            <MenuItem value="none">None</MenuItem>
            <MenuItem value="capitalize">Capitalize</MenuItem>
            <MenuItem value="uppercase">UPPERCASE</MenuItem>
            <MenuItem value="lowercase">lowercase</MenuItem>
          </Select>
        </FormControl>

        <FormControl fullWidth>
          <InputLabel>Font Style</InputLabel>
          <Select
            value={selectedComponent.component.style?.fontStyle || "normal"}
            onChange={(e) => handleStyleChange("fontStyle", e.target.value)}
            label="Font Style"
          >
            <MenuItem value="normal">Normal</MenuItem>
            <MenuItem value="italic">Italic</MenuItem>
            <MenuItem value="oblique">Oblique</MenuItem>
          </Select>
        </FormControl>

        <FormControl fullWidth>
          <InputLabel>Text Decoration</InputLabel>
          <Select
            value={selectedComponent.component.style?.textDecoration || "none"}
            onChange={(e) =>
              handleStyleChange("textDecoration", e.target.value)
            }
            label="Text Decoration"
          >
            <MenuItem value="none">None</MenuItem>
            <MenuItem value="underline">Underline</MenuItem>
            <MenuItem value="line-through">Line Through</MenuItem>
            <MenuItem value="overline">Overline</MenuItem>
          </Select>
        </FormControl>
      </Stack>
    );
  };

  const renderComponentSpecificProperties = () => {
    switch (selectedComponent.component.type) {
      case "button":
        return (
          <Stack spacing={2}>
            <TextField
              label="Link URL"
              value={
                currentTemplate.sections.find(
                  (section) => section.id === selectedComponent.sectionId
                )?.components[selectedComponent.columnIndex][
                  selectedComponent.index
                ]?.properties?.url
              }
              onChange={(e) => handlePropertyChange("url", e.target.value)}
              fullWidth
            />
            <FormControl fullWidth>
              <InputLabel>Button Type</InputLabel>
              <Select
                value={
                  currentTemplate.sections.find(
                    (section) => section.id === selectedComponent.sectionId
                  )?.components[selectedComponent.columnIndex][
                    selectedComponent.index
                  ]?.properties?.buttonType ||
                  "primary"
                }
                onChange={(e) =>
                  handlePropertyChange("buttonType", e.target.value)
                }
                label="Button Type"
              >
                <MenuItem value="primary">Primary</MenuItem>
                <MenuItem value="secondary">Secondary</MenuItem>
                <MenuItem value="outline">Outline</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Size</InputLabel>
              <Select
                value={selectedComponent.component.properties?.size || "medium"}
                onChange={(e) => handlePropertyChange("size", e.target.value)}
                label="Size"
              >
                <MenuItem value="small">Small</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="large">Large</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        );

      case "image":
        return (
          <Stack spacing={2}>
            <TextField
              label="Image Source"
              value={
                currentTemplate.sections.find(
                  (section) => section.id === selectedComponent.sectionId
                )?.components[selectedComponent.columnIndex][
                  selectedComponent.index
                ]?.properties?.src
              }
              onChange={(e) =>
                updateComponent(selectedComponent.component.id, {
                  properties: { src: e.target.value },
                })
              }
              placeholder="Add your image source here"
              fullWidth
            />
            <TextField
              label="Alt Text"
              value={selectedComponent.component.properties?.altText || ""}
              onChange={(e) => handlePropertyChange("altText", e.target.value)}
              placeholder="Descriptive text for the image"
              fullWidth
            />
            <FormControl fullWidth>
              <InputLabel>Border Radius</InputLabel>
              <Select
                value={selectedComponent.component.style?.borderRadius || "0"}
                onChange={(e) =>
                  handleStyleChange("borderRadius", e.target.value)
                }
                label="Border Radius"
              >
                <MenuItem value="0">None</MenuItem>
                <MenuItem value="4px">Small</MenuItem>
                <MenuItem value="8px">Medium</MenuItem>
                <MenuItem value="16px">Large</MenuItem>
                <MenuItem value="50%">Round</MenuItem>
              </Select>
            </FormControl>
            <FormControlLabel
              control={
                <Switch
                  checked={
                    selectedComponent.component.properties?.responsive ===
                    "true"
                  }
                  onChange={(e) =>
                    handlePropertyChange(
                      "responsive",
                      e.target.checked ? "true" : "false"
                    )
                  }
                />
              }
              label="Responsive"
            />
            <TextField
              label="Object Fit"
              select
              value={selectedComponent.component.style?.objectFit || "cover"}
              onChange={(e) => handleStyleChange("objectFit", e.target.value)}
              fullWidth
            >
              <MenuItem value="cover">Cover</MenuItem>
              <MenuItem value="contain">Contain</MenuItem>
              <MenuItem value="fill">Fill</MenuItem>
              <MenuItem value="none">None</MenuItem>
              <MenuItem value="scale-down">Scale Down</MenuItem>
            </TextField>
          </Stack>
        );

      case "video":
        return (
          <Stack spacing={2}>
            <TextField
              label="Video Source"
              value={
                currentTemplate.sections.find(
                  (section) => section.id === selectedComponent.sectionId
                )?.components[selectedComponent.columnIndex][
                  selectedComponent.index
                ]?.properties?.src
              }
              onChange={(e) =>
                updateComponent(selectedComponent.component.id, {
                  properties: { src: e.target.value },
                })
              }
              placeholder="Add your video source here"
              fullWidth
            />
            <TextField
              label="Poster Image"
              value={selectedComponent.component.properties?.poster || ""}
              onChange={(e) => handlePropertyChange("poster", e.target.value)}
              placeholder="https://example.com/poster.jpg"
              fullWidth
            />
            <FormControlLabel
              control={
                <Switch
                  checked={
                    selectedComponent.component.properties?.controls
                  }
                  onChange={(e) =>
                    handlePropertyChange(
                      "controls",
                      e.target.checked ? true : false
                    )
                  }
                />
              }
              label="Show Controls"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={
                    selectedComponent.component.properties?.autoplay
                  }
                  onChange={(e) =>
                    handlePropertyChange(
                      "autoplay",
                      e.target.checked ? "true" : "false"
                    )
                  }
                />
              }
              label="Autoplay"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={
                    selectedComponent.component.properties?.loop
                  }
                  onChange={(e) =>
                    handlePropertyChange(
                      "loop",
                      e.target.checked ? "true" : "false"
                    )
                  }
                />
              }
              label="Loop"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={
                    selectedComponent.component.properties?.muted === "true"
                  }
                  onChange={(e) =>
                    handlePropertyChange(
                      "muted",
                      e.target.checked ? "true" : "false"
                    )
                  }
                />
              }
              label="Muted"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={
                    selectedComponent.component.properties?.playsInline ===
                    "true"
                  }
                  onChange={(e) =>
                    handlePropertyChange(
                      "playsInline",
                      e.target.checked ? "true" : "false"
                    )
                  }
                />
              }
              label="Plays Inline"
            />
            <TextField
              label="Preload"
              select
              value={selectedComponent.component.properties?.preload || "auto"}
              onChange={(e) => handlePropertyChange("preload", e.target.value)}
              fullWidth
            >
              <MenuItem value="auto">Auto</MenuItem>
              <MenuItem value="metadata">Metadata</MenuItem>
              <MenuItem value="none">None</MenuItem>
            </TextField>
          </Stack>
        );

      case "timer":
        return (
          <Stack spacing={2}>
            <TextField
              label="End Date"
              type="datetime-local"
              value={
                selectedComponent.component.properties?.endDate?.slice(0, 16) ||
                new Date().toISOString().slice(0, 16)
              }
              onChange={(e) =>
                handlePropertyChange(
                  "endDate",
                  new Date(e.target.value).toISOString()
                )
              }
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
            <FormControl fullWidth>
              <InputLabel>Format</InputLabel>
              <Select
                value={
                  selectedComponent.component.properties?.format ||
                  "dd:hh:mm:ss"
                }
                onChange={(e) => handlePropertyChange("format", e.target.value)}
                label="Format"
              >
                <MenuItem value="dd:hh:mm:ss">
                  Days, Hours, Minutes, Seconds
                </MenuItem>
                <MenuItem value="hh:mm:ss">Hours, Minutes, Seconds</MenuItem>
                <MenuItem value="mm:ss">Minutes, Seconds</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        );

      case "menu":
        return (
          <Stack spacing={2}>
            <Typography variant="subtitle2">Menu Items</Typography>
            {(selectedComponent.component.properties?.menuItems || []).map(
              (item: MenuItemType, index: number) => (
                <Box
                  key={index}
                  sx={{
                    mb: 2,
                    p: 2,
                    border: "1px solid",
                    borderColor: "divider",
                    borderRadius: 1,
                  }}
                >
                  <TextField
                    label="Text"
                    value={item.text}
                    onChange={(e) => {
                      const newItems = [
                        ...(selectedComponent.component.properties?.menuItems ||
                          []),
                      ];
                      newItems[index] = { ...item, text: e.target.value };
                      handlePropertyChange("menuItems", newItems);
                    }}
                    sx={{ mb: 1 }}
                    fullWidth
                  />
                  <TextField
                    label="URL"
                    value={item.url}
                    onChange={(e) => {
                      const newItems = [
                        ...(selectedComponent.component.properties?.menuItems ||
                          []),
                      ];
                      newItems[index] = { ...item, url: e.target.value };
                      handlePropertyChange("menuItems", newItems);
                    }}
                    fullWidth
                  />
                  <Button
                    variant="outlined"
                    color="error"
                    size="small"
                    onClick={() => {
                      const newItems = [
                        ...(selectedComponent.component.properties?.menuItems ||
                          []),
                      ];
                      newItems.splice(index, 1);
                      handlePropertyChange("menuItems", newItems);
                    }}
                    sx={{ mt: 1 }}
                  >
                    Remove
                  </Button>
                </Box>
              )
            )}
            <Button
              variant="outlined"
              onClick={() => {
                const newItems = [
                  ...(selectedComponent.component.properties?.menuItems || []),
                  { text: "", url: "" },
                ];
                handlePropertyChange("menuItems", newItems);
              }}
            >
              Add Menu Item
            </Button>
          </Stack>
        );

      case "heading":
        return (
          <Stack spacing={2}>
            <FormControl fullWidth>
              <InputLabel>Heading Level</InputLabel>
              <Select
                value={selectedComponent.component.properties?.level || "h2"}
                onChange={(e) => handlePropertyChange("level", e.target.value)}
                label="Heading Level"
              >
                <MenuItem value="h1">H1</MenuItem>
                <MenuItem value="h2">H2</MenuItem>
                <MenuItem value="h3">H3</MenuItem>
                <MenuItem value="h4">H4</MenuItem>
                <MenuItem value="h5">H5</MenuItem>
                <MenuItem value="h6">H6</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        );

      default:
        return null;
    }
  };

  return (
    <Paper
      sx={{ width: 300, height: "100%", borderLeft: 1, borderColor: "divider" }}
    >
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={activeTab}
          onChange={(_, newValue) => setActiveTab(newValue)}
        >
          <Tab label="Basic" />
          <Tab label="Text" />
          <Tab label="Specific" />
        </Tabs>
      </Box>
      <Box sx={{ p: 2, height: "calc(100% - 48px)", overflow: "auto" }}>
        <Typography variant="subtitle1" gutterBottom>
          {selectedComponent.component.type.charAt(0).toUpperCase() +
            selectedComponent.component.type.slice(1)}{" "}
          Properties
        </Typography>

        {activeTab === 0 && renderBasicProperties()}
        {activeTab === 1 && renderTextProperties()}
        {activeTab === 2 && renderComponentSpecificProperties()}
      </Box>
    </Paper>
  );
};

export default PropertiesPanel;
