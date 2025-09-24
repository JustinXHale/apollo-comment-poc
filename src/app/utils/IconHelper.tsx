import * as React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faHouse,
  faFolder
} from '@fortawesome/free-regular-svg-icons';
import {
  faBrain,
  faFlask,
  faMagnifyingGlass,
  faBook,
  faCode,
  faGear
} from '@fortawesome/free-solid-svg-icons';

// Map of icon names to FontAwesome icons
const iconMap = {
  'fa-light fa-house': faHouse,
  'fa-light fa-folder': faFolder,
  'fa-light fa-brain': faBrain,
  'fa-light fa-flask': faFlask,
  'fa-light fa-magnifying-glass': faMagnifyingGlass,
  'fa-light fa-book': faBook,
  'fa-light fa-code': faCode,
  'fa-light fa-gear': faGear,
};

interface FontAwesomeIconComponentProps {
  iconClass: string;
}

export const FontAwesomeIconComponent: React.FunctionComponent<FontAwesomeIconComponentProps> = ({ iconClass }) => {
  const icon = iconMap[iconClass as keyof typeof iconMap];
  
  if (!icon) {
    console.warn(`Icon not found for class: ${iconClass}`);
    return null;
  }
  
  return <FontAwesomeIcon icon={icon} />;
};

// Helper function to create icon components for routes
export const createFontAwesomeIcon = (iconClass: string) => {
  return () => <FontAwesomeIconComponent iconClass={iconClass} />;
};
