import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';

export type ComponentType = 
  // Content
  | 'text'
  | 'heading'
  | 'paragraph'
  | 'image'
  | 'button'
  | 'video'
  | 'html'
  | 'timer'
  // Social
  | 'social'
  | 'socialShare'
  | 'menu'
  | 'header'
  | 'footer'
  | 'spacer'
  | 'divider';

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
  [key: string]: any;
}

export interface EmailComponent {
  id: string;
  type: ComponentType;
  content: string;
  style?: ComponentStyle;
  properties?: ComponentProperties;
}

export interface Section {
  id: string;
  columns: number;
  components: EmailComponent[][];
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
  component: EmailComponent;
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
  updateComponent: (componentId: string, updates: Partial<EmailComponent>) => void;
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
}

export const useStore = create<TemplateState>((set) => ({
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
    const newComponent: EmailComponent = {
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
}));

export interface ComponentDefaults {
  content: string;
  style?: ComponentStyle;
  properties?: ComponentProperties;
}

export const componentDefaults: Record<ComponentType, ComponentDefaults> = {
  header: {
    content: 'Header',
    style: {}
  },
  footer: {
    content: 'Footer',
    style: {}
  },
  spacer: {
    content: '',
    style: {
      height: '40px'
    }
  },
  divider: {
    content: '',
    style: {}
  },
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
  html: {
    content: '',
    style: {}
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
    style: {}
  },
  socialShare: {
    content: '',
    style: {}
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