import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';

export type ComponentType = 
  | 'text'
  | 'heading'
  | 'paragraph'
  | 'image'
  | 'button'
  | 'video'
  | 'timer'
  | 'social'
  | 'menu'

export interface ComponentStyle {
  width?: string;
  height?: string;
  padding?: string;
  margin?: string;
  fontSize?: string;
  fontWeight?: string;
  textAlign?: string;
  color?: string;
  backgroundColor?: string;
  borderWidth?: string;
  borderStyle?: string;
  borderColor?: string;
  borderRadius?: string;
  lineHeight?: string;
  [key: string]: string | undefined;
}

export interface SocialMediaItem {
  type: 'facebook' | 'twitter' | 'instagram' | 'linkedin' | 'youtube' | 'pinterest';
  url: string;
  enabled: boolean;
}

export interface ComponentProperties {
  url?: string;
  altText?: string;
  controls?: boolean;
  autoplay?: boolean;
  loop?: boolean;
  responsive?: string;
  endDate?: string;
  format?: string;
  menuItems?: Array<{ text: string; url: string; }>;
  socialMedia?: SocialMediaItem[];
  [key: string]: any;
}

export interface DraggableComponent {
  id: string;
  type: ComponentType;
  content: string;
  style?: ComponentStyle;
  properties?: ComponentProperties;
}

export interface Section {
  id: string;
  columns: number;
  components: DraggableComponent[][];
}

export interface EmailTemplate {
  id: string;
  name: string;
  sections: Section[];
}

interface SelectedComponent {
  sectionId: string;
  columnIndex: number;
  index: number;
  component: DraggableComponent;
}

interface TemplateState {
  currentTemplate: EmailTemplate;
  selectedComponent: SelectedComponent | null;
  selectedSectionId: string | null;
  templates: EmailTemplate[];
  sections: Section[];
  addSection: (columns: number) => void;
  removeSection: (sectionId: string) => void;
  duplicateSection: (sectionId: string) => void;
  updateSection: (sectionId: string, updates: Partial<Section>) => void;
  updateTemplateName: (name: string) => void;
  addComponent: (sectionId: string, columnIndex: number, componentType: ComponentType) => void;
  removeComponent: (sectionId: string, columnIndex: number, index: number) => void;
  duplicateComponent: (sectionId: string, columnIndex: number, index: number) => void;
  moveComponent: (
    sourceSectionId: string,
    sourceColumnIndex: number,
    sourceIndex: number,
    destinationSectionId: string,
    destinationColumnIndex: number,
    destinationIndex: number
  ) => void;
  selectComponent: (sectionId: string, columnIndex: number, index: number) => void;
  setSelectedSection: (id: string | null) => void;
  updateComponent: (componentId: string, updates: Partial<DraggableComponent>) => void;
  updateComponentStyle: (
    sectionId: string,
    columnIndex: number,
    index: number,
    property: string,
    value: string
  ) => void;
  canvasWidth: string;
  canvasHeight: string;
  updateCanvasDimensions: (width?: string, height?: string) => void;
  generateTemplateHtml: () => string;
}

export const useStore = create<TemplateState>((set, get) => ({
  currentTemplate: {
    id: uuidv4(),
    name: 'Untitled Template',
    sections: []
  },
  selectedComponent: null,
  selectedSectionId: null,
  templates: [],
  sections: [],
  canvasWidth: '600px',
  canvasHeight: 'auto',
  updateCanvasDimensions: (width?: string, height?: string) => 
    set((state) => ({
      canvasWidth: width || state.canvasWidth,
      canvasHeight: height || state.canvasHeight
    })),
  
  addSection: (columns) => set((state) => ({
    sections: [...state.sections, {
      id: uuidv4(),
      columns,
      components: Array(columns).fill([])
    }]
  })),
  
  removeSection: (sectionId) => set((state) => ({
    sections: state.sections.filter(section => section.id !== sectionId),
    selectedComponent: state.selectedComponent?.sectionId === sectionId ? null : state.selectedComponent,
  })),
  
  duplicateSection: (sectionId) => set((state) => {
    const sectionToDuplicate = state.sections.find(section => section.id === sectionId);
    if (!sectionToDuplicate) return state;
    
    const duplicatedSection = {
      ...sectionToDuplicate,
      id: uuidv4(),
      components: sectionToDuplicate.components.map(column => [...column])
    };
    
    return {
      sections: [...state.sections, duplicatedSection]
    };
  }),
  
  addComponent: (sectionId, columnIndex, componentType: ComponentType) => set((state) => {
    const newSections = [...state.sections];
    const sectionIndex = newSections.findIndex(section => section.id === sectionId);
    
    if (sectionIndex === -1) return state;
    
    const defaults = componentDefaults[componentType];
    const newComponent: DraggableComponent = {
      id: uuidv4(),
      type: componentType,
      content: defaults.content,
      style: defaults.style,
      properties: defaults.properties
    };
    
    newSections[sectionIndex].components[columnIndex] = [
      ...newSections[sectionIndex].components[columnIndex],
      newComponent
    ];
    
    return { sections: newSections };
  }),
  
  removeComponent: (sectionId, columnIndex, index) => set((state) => {
    const newSections = [...state.sections];
    const sectionIndex = newSections.findIndex(section => section.id === sectionId);
    
    if (sectionIndex === -1) return state;
    
    newSections[sectionIndex].components[columnIndex].splice(index, 1);
    
    return { 
      sections: newSections,
      selectedComponent: null
    };
  }),
  
  duplicateComponent: (sectionId, columnIndex, index) => set((state) => {
    const newSections = [...state.sections];
    const sectionIndex = newSections.findIndex(section => section.id === sectionId);
    
    if (sectionIndex === -1) return state;
    
    const componentToDuplicate = newSections[sectionIndex].components[columnIndex][index];
    
    if (!componentToDuplicate) return state;
    
    const duplicatedComponent = {
      ...componentToDuplicate,
      id: uuidv4()
    };
    
    newSections[sectionIndex].components[columnIndex].splice(index + 1, 0, duplicatedComponent);
    
    return { sections: newSections };
  }),
  
  moveComponent: (
    sourceSectionId,
    sourceColumnIndex,
    sourceIndex,
    destinationSectionId,
    destinationColumnIndex,
    destinationIndex
  ) => set((state) => {
    const newSections = [...state.sections];
    
    const sourceSectionIndex = newSections.findIndex(
      section => section.id === sourceSectionId
    );
    const destinationSectionIndex = newSections.findIndex(
      section => section.id === destinationSectionId
    );
    
    if (sourceSectionIndex === -1 || destinationSectionIndex === -1) return state;
    
    const [movedComponent] = newSections[sourceSectionIndex].components[sourceColumnIndex]
      .splice(sourceIndex, 1);
    
    newSections[destinationSectionIndex].components[destinationColumnIndex]
      .splice(destinationIndex, 0, movedComponent);
    
    return { 
      sections: newSections,
      selectedComponent: null
    };
  }),
  
  selectComponent: (sectionId, columnIndex, index) => set((state) => {
    const section = state.sections.find(s => s.id === sectionId);
    if (!section) return { selectedComponent: null };

    const component = section.components[columnIndex][index];
    if (!component) return { selectedComponent: null };

    return {
      selectedComponent: {
        sectionId,
        columnIndex,
        index,
        component
      }
    };
  }),

  setSelectedSection: (id) => set({ selectedSectionId: id }),
  
  updateComponent: (componentId, updates) => 
    set((state) => {
      // Update in sections array
      const newSections = state.sections.map(section => ({
        ...section,
        components: section.components.map(column => 
          column.map(component =>
            component.id === componentId
              ? { ...component, ...updates }
              : component
          )
        )
      }));

      // Update in currentTemplate
      const newTemplate = { ...state.currentTemplate };
      newTemplate.sections = newTemplate.sections.map(section => ({
        ...section,
        components: section.components.map(column => 
          column.map(component =>
            component.id === componentId
              ? { ...component, ...updates }
              : component
          )
        )
      }));

      // Find the updated component for selection state
      let updatedSelectedComponent: SelectedComponent | null = null;

      for (const section of newSections) {
        for (let colIdx = 0; colIdx < section.components.length; colIdx++) {
          const column = section.components[colIdx];
          for (let compIdx = 0; compIdx < column.length; compIdx++) {
            const component = column[compIdx];
            if (component.id === componentId) {
              updatedSelectedComponent = {
                sectionId: section.id,
                columnIndex: colIdx,
                index: compIdx,
                component
              };
              break;
            }
          }
          if (updatedSelectedComponent) break;
        }
      }

      return {
        sections: newSections,
        currentTemplate: newTemplate,
        selectedComponent: updatedSelectedComponent || state.selectedComponent
      };
    }),
  
  updateComponentStyle: (sectionId, columnIndex, index, property, value) =>
    set((state) => {
      // Update in sections array
      const newSections = state.sections.map((section) => {
        if (section.id === sectionId) {
          const newComponents = [...section.components];
          const component = { ...newComponents[columnIndex][index] };
          component.style = {
            ...component.style,
            [property]: value,
          };
          newComponents[columnIndex][index] = component;
          return { ...section, components: newComponents };
        }
        return section;
      });

      // Update in currentTemplate
      const newTemplate = { ...state.currentTemplate };
      newTemplate.sections = newTemplate.sections.map((section) => {
        if (section.id === sectionId) {
          const newComponents = [...section.components];
          const component = { ...newComponents[columnIndex][index] };
          component.style = {
            ...component.style,
            [property]: value,
          };
          newComponents[columnIndex][index] = component;
          return { ...section, components: newComponents };
        }
        return section;
      });

      const updatedComponent = newSections
        .find(s => s.id === sectionId)
        ?.components[columnIndex][index];

      return {
        sections: newSections,
        currentTemplate: newTemplate,
        selectedComponent: updatedComponent ? {
          sectionId,
          columnIndex,
          index,
          component: updatedComponent
        } : null
      };
    }),

  updateSection: (sectionId, updates) => 
    set((state) => {
      // Update in sections array
      const newSections = state.sections.map(section => 
        section.id === sectionId ? { ...section, ...updates } : section
      );

      // Update in currentTemplate
      const newTemplate = { ...state.currentTemplate };
      newTemplate.sections = newTemplate.sections.map(section => 
        section.id === sectionId ? { ...section, ...updates } : section
      );

      return {
        sections: newSections,
        currentTemplate: newTemplate
      };
    }),

  updateTemplateName: (name) => 
    set((state) => ({
      currentTemplate: {
        ...state.currentTemplate,
        name
      }
    })),

  generateTemplateHtml: () => {
    const state = get();
    const { sections, currentTemplate, canvasWidth } = state;

    const generateComponentHtml = (component: DraggableComponent): string => {
      const style = component.style || {};
      const inlineStyle = Object.entries(style)
        .map(([key, value]) => `${key}: ${value}`)
        .join('; ');

      switch (component.type) {
        case 'text':
          return `<div id="${component.id}" data-type="${component.type}" style="${inlineStyle}">${component.content}</div>`;
        case 'heading':
          return `<${component.properties?.level || 'h2'} id="${component.id}" data-type="${component.type}" style="${inlineStyle}">${component.content}</${component.properties?.level || 'h2'}>`;
        case 'paragraph':
          return `<p id="${component.id}" data-type="${component.type}" style="${inlineStyle}">${component.content}</p>`;
        case 'image':
          return `<img id="${component.id}" data-type="${component.type}" src="${component.properties?.src || component.content}" alt="${component.properties?.altText || ''}" style="${inlineStyle}" />`;
        case 'button':
          return `<button id="${component.id}" data-type="${component.type}" style="${inlineStyle}">${component.content}</button>`;
        case 'video':
          return `<video id="${component.id}" data-type="${component.type}" src="${component.properties?.src || ''}" style="${inlineStyle}" ${component.properties?.controls ? 'controls' : ''} ${component.properties?.autoplay ? 'autoplay' : ''} ${component.properties?.loop ? 'loop' : ''}></video>`;
        case 'timer':
          return `<div id="${component.id}" data-type="${component.type}" style="${inlineStyle}">${component.properties?.endDate}</div>`;
        case 'menu':
          return `<ul id="${component.id}" data-type="${component.type}" style="${inlineStyle}">${component.properties?.menuItems?.map(item => `<li><a href="${item.url}">${item.text}</a></li>`).join('')}</ul>`;
        case 'social':
          const socialIcons = {
            facebook: '<svg viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M12 2.04C6.5 2.04 2 6.53 2 12.06C2 17.06 5.66 21.21 10.44 21.96V14.96H7.9V12.06H10.44V9.85C10.44 7.34 11.93 5.96 14.22 5.96C15.31 5.96 16.45 6.15 16.45 6.15V8.62H15.19C13.95 8.62 13.56 9.39 13.56 10.18V12.06H16.34L15.89 14.96H13.56V21.96A10 10 0 0 0 22 12.06C22 6.53 17.5 2.04 12 2.04Z"/></svg>',
            twitter: '<svg viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M22.46,6C21.69,6.35 20.86,6.58 20,6.69C20.88,6.16 21.56,5.32 21.88,4.31C21.05,4.81 20.13,5.16 19.16,5.36C18.37,4.5 17.26,4 16,4C13.65,4 11.73,5.92 11.73,8.29C11.73,8.63 11.77,8.96 11.84,9.27C8.28,9.09 5.11,7.38 3,4.79C2.63,5.42 2.42,6.16 2.42,6.94C2.42,8.43 3.17,9.75 4.33,10.5C3.62,10.5 2.96,10.3 2.38,10C2.38,10 2.38,10 2.38,10.03C2.38,12.11 3.86,13.85 5.82,14.24C5.46,14.34 5.08,14.39 4.69,14.39C4.42,14.39 4.15,14.36 3.89,14.31C4.43,16 6,17.26 7.89,17.29C6.43,18.45 4.58,19.13 2.56,19.13C2.22,19.13 1.88,19.11 1.54,19.07C3.44,20.29 5.7,21 8.12,21C16,21 20.33,14.46 20.33,8.79C20.33,8.6 20.33,8.42 20.32,8.23C21.16,7.63 21.88,6.87 22.46,6Z"/></svg>',
            instagram: '<svg viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M7.8,2H16.2C19.4,2 22,4.6 22,7.8V16.2A5.8,5.8 0 0,1 16.2,22H7.8C4.6,22 2,19.4 2,16.2V7.8A5.8,5.8 0 0,1 7.8,2M7.6,4A3.6,3.6 0 0,0 4,7.6V16.4C4,18.39 5.61,20 7.6,20H16.4A3.6,3.6 0 0,0 20,16.4V7.6C20,5.61 18.39,4 16.4,4H7.6M17.25,5.5A1.25,1.25 0 0,1 18.5,6.75A1.25,1.25 0 0,1 17.25,8A1.25,1.25 0 0,1 16,6.75A1.25,1.25 0 0,1 17.25,5.5M12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9Z"/></svg>',
            linkedin: '<svg viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M19 3A2 2 0 0 1 21 5V19A2 2 0 0 1 19 21H5A2 2 0 0 1 3 19V5A2 2 0 0 1 5 3H19M18.5 18.5V13.2A3.26 3.26 0 0 0 15.24 9.94C14.39 9.94 13.4 10.46 12.92 11.24V10.13H10.13V18.5H12.92V13.57C12.92 12.8 13.54 12.17 14.31 12.17A1.4 1.4 0 0 1 15.71 13.57V18.5H18.5M6.88 8.56A1.68 1.68 0 0 0 8.56 6.88C8.56 5.95 7.81 5.19 6.88 5.19A1.69 1.69 0 0 0 5.19 6.88C5.19 7.81 5.95 8.56 6.88 8.56M8.27 18.5V10.13H5.5V18.5H8.27Z"/></svg>',
            youtube: '<svg viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M10,15L15.19,12L10,9V15M21.56,7.17C21.69,7.64 21.78,8.27 21.84,9.07C21.91,9.87 21.94,10.56 21.94,11.16L22,12C22,14.19 21.84,15.8 21.56,16.83C21.31,17.73 20.73,18.31 19.83,18.56C19.36,18.69 18.5,18.78 17.18,18.84C15.88,18.91 14.69,18.94 13.59,18.94L12,19C7.81,19 5.2,18.84 4.17,18.56C3.27,18.31 2.69,17.73 2.44,16.83C2.31,16.36 2.22,15.73 2.16,14.93C2.09,14.13 2.06,13.44 2.06,12.84L2,12C2,9.81 2.16,8.2 2.44,7.17C2.69,6.27 3.27,5.69 4.17,5.44C4.64,5.31 5.5,5.22 6.82,5.16C8.12,5.09 9.31,5.06 10.41,5.06L12,5C16.19,5 18.8,5.16 19.83,5.44C20.73,5.69 21.31,6.27 21.56,7.17Z"/></svg>',
            pinterest: '<svg viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M9.04,21.54C10,21.83 10.97,22 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2A10,10 0 0,0 2,12C2,16.25 4.67,19.9 8.44,21.34C8.35,20.56 8.26,19.27 8.44,18.38L9.59,13.44C9.59,13.44 9.3,12.86 9.3,11.94C9.3,10.56 10.16,9.53 11.14,9.53C12,9.53 12.4,10.16 12.4,10.92C12.4,11.777 11.89,13.01 11.62,14.17C11.4,15.13 12.14,15.92 13.08,15.92C14.8,15.92 16.1,14.23 16.1,11.86C16.1,9.85 14.69,8.34 12.03,8.34C9.03,8.34 7.26,10.42 7.26,12.82C7.26,13.63 7.53,14.26 7.93,14.76C8.06,14.91 8.09,15.05 8.04,15.21L7.69,16.61C7.64,16.81 7.5,16.87 7.29,16.77C6.11,16.19 5.36,14.37 5.36,12.74C5.36,10.07 7.72,6.64 12.32,6.64C16,6.64 18.56,9.45 18.56,12.29C18.56,15.95 16.41,18.37 13.24,18.37C12.27,18.37 11.35,17.93 11.03,17.4L10.27,19.93C10.03,20.72 9.46,21.64 9.04,22.23V21.54Z"/></svg>'
          };
          return `<div id="${component.id}" data-type="${component.type}" style="${inlineStyle}">${component.properties?.socialMedia?.filter(item => item.enabled).map(item => `<a href="${item.url}" target="_blank" rel="noopener noreferrer" style="margin-right: 10px; color: ${item.type === 'facebook' ? '#1877F2' : item.type === 'twitter' ? '#1DA1F2' : item.type === 'instagram' ? '#E4405F' : item.type === 'linkedin' ? '#0A66C2' : item.type === 'youtube' ? '#FF0000' : item.type === 'pinterest' ? '#BD081C' : '#000000'}">${socialIcons[item.type]}</a>`).join('')}</div>`;
        default:
          return `<div id="${component.id}" data-type="${component.type}" style="${inlineStyle}">${component.content}</div>`;
      }
    };

    const generateSectionHtml = (section: Section): string => {
      const columnWidth = `${100 / section.columns}%`;
      const columnsHtml = section.components
        .map((column, columnIndex) => {
          const componentsHtml = column
            .map(component => generateComponentHtml(component))
            .join('\n');
          return `<div class="template-column" data-column-index="${columnIndex}" style="width: ${columnWidth}; padding: 10px;">${componentsHtml}</div>`;
        })
        .join('\n');

      return `<section id="${section.id}" class="template-section" data-columns="${section.columns}" style="display: flex; width: 100%;">${columnsHtml}</section>`;
    };

    const sectionsHtml = sections
      .map(section => generateSectionHtml(section))
      .join('\n');

    return `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${currentTemplate.name}</title>
    <!-- Template ID: ${currentTemplate.id} -->
</head>
<body style="margin: 0; padding: 0;">
    <div id="template-container" style="max-width: ${canvasWidth}; margin: 0 auto; padding: 20px;">
        ${sectionsHtml}
    </div>
</body>
</html>`;
  }
}));

export interface ComponentDefaults {
  content: string;
  style?: ComponentStyle;
  properties?: ComponentProperties;
}

export const componentDefaults: Record<ComponentType, ComponentDefaults> = {
  text: {
    content: 'Add your text here',
    style: {
      fontSize: '16px',
      fontWeight: 'normal',
      color: '#333333',
      lineHeight: '1.5'
    }
  },
  heading: {
    content: 'Heading',
    style: {
      fontSize: '24px',
      fontWeight: 'bold',
      color: '#222222'
    }
  },
  paragraph: {
    content: 'Add your paragraph text here',
    style: {
      fontSize: '16px',
      fontWeight: 'normal',
      color: '#333333',
      lineHeight: '1.5'
    }
  },
  image: {
    content: 'https://via.placeholder.com/600x300',
    style: {
      width: '100%',
      height: '100%'
    },
    properties: {
      altText: 'Image description',
      responsive: 'true',
      src: 'https://via.placeholder.com/600x300'
    }
  },
  button: {
    content: 'Click Me',
    style: {
      padding: '8px 16px',
      backgroundColor: '#1976d2',
      color: '#ffffff',
      borderRadius: '4px'
    }
  },
  video: {
    content: '',
    style: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      display: 'block'
    },
    properties: {
      controls: true,
      autoplay: false,
      loop: false,
      src: 'https://via.placeholder.com/600x300'
    }
  },
  timer: {
    content: '',
    style: {},
    properties: {
      endDate: new Date().toISOString(),
      format: 'dd:hh:mm:ss'
    }
  },
  social: {
    content: '',
    style: {
      display: 'flex',
      gap: '12px',
      justifyContent: 'center',
      alignItems: 'center'
    },
    properties: {
      socialMedia: [
        { type: 'facebook', url: 'https://facebook.com', enabled: true },
        { type: 'twitter', url: 'https://twitter.com', enabled: true },
        { type: 'instagram', url: 'https://instagram.com', enabled: true },
        { type: 'linkedin', url: 'https://linkedin.com', enabled: true },
        { type: 'youtube', url: 'https://youtube.com', enabled: true },
        { type: 'pinterest', url: 'https://pinterest.com', enabled: true }
      ]
    }
  },
  menu: {
    content: '',
    style: {},
    properties: {
      menuItems: [
        { text: 'Home', url: '#' },
        { text: 'About', url: '#' },
        { text: 'Contact', url: '#' }
      ]
    }
  }
}; 