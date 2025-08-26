import React from 'react';
import { Tile as TileType, getTileName } from '@majongapp/core';

export interface TileProps {
  tile: TileType;
  selected?: boolean;
  disabled?: boolean;
  size?: 'small' | 'medium' | 'large';
  onClick?: (tile: TileType) => void;
  'aria-label'?: string;
}

export const Tile: React.FC<TileProps> = ({
  tile,
  selected = false,
  disabled = false,
  size = 'medium',
  onClick,
  'aria-label': ariaLabel,
}) => {
  const tileName = getTileName(tile);
  const displayText = tileName.toUpperCase();
  
  const handleClick = () => {
    if (!disabled && onClick) {
      onClick(tile);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if ((event.key === 'Enter' || event.key === ' ') && !disabled && onClick) {
      event.preventDefault();
      onClick(tile);
    }
  };

  const sizeClasses = {
    small: 'w-8 h-12 text-xs',
    medium: 'w-12 h-16 text-sm',
    large: 'w-16 h-20 text-base',
  };

  const baseClasses = [
    'border-2',
    'rounded',
    'bg-white',
    'flex',
    'items-center',
    'justify-center',
    'font-bold',
    'transition-all',
    'duration-200',
    sizeClasses[size],
  ];

  if (onClick && !disabled) {
    baseClasses.push('cursor-pointer', 'hover:shadow-md', 'focus:outline-none', 'focus:ring-2', 'focus:ring-blue-500');
  }

  if (selected) {
    baseClasses.push('border-blue-500', 'bg-blue-50', 'shadow-md', 'transform', 'scale-105');
  } else {
    baseClasses.push('border-gray-300', 'hover:border-gray-400');
  }

  if (disabled) {
    baseClasses.push('opacity-50', 'cursor-not-allowed');
  }

  // Color coding for different suits
  let textColor = 'text-gray-800';
  if (tile.suit === 'man') {
    textColor = 'text-red-600';
  } else if (tile.suit === 'pin') {
    textColor = 'text-blue-600';
  } else if (tile.suit === 'sou') {
    textColor = 'text-green-600';
  } else if (tile.suit === 'honor') {
    textColor = 'text-purple-600';
  }

  const label = ariaLabel || `${tileName} tile${selected ? ', selected' : ''}${disabled ? ', disabled' : ''}`;

  return (
    <div
      className={`${baseClasses.join(' ')} ${textColor}`}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={onClick && !disabled ? 0 : -1}
      role={onClick ? 'button' : 'img'}
      aria-label={label}
      aria-pressed={onClick && selected ? 'true' : undefined}
      aria-disabled={disabled}
    >
      {displayText}
    </div>
  );
};

export default Tile;