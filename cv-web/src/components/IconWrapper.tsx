import React from 'react';
import { IconType } from 'react-icons';

// Interface pour les propriétés des icônes
interface IconWrapperProps {
  IconComponent: IconType;
  size?: number;
  color?: string;
  style?: React.CSSProperties;
  className?: string;
}

// Composant wrapper pour les icônes React Icons
const IconWrapper: React.FC<IconWrapperProps> = ({ 
  IconComponent, 
  size = 16,
  color,
  style, 
  className 
}) => {
  // Cast l'icône en composant React valide
  const Icon = IconComponent as React.FC<{
    size?: number;
    color?: string;
    style?: React.CSSProperties;
    className?: string;
  }>;

  return React.createElement(Icon, {
    size,
    color,
    style,
    className
  });
};

export default IconWrapper;
