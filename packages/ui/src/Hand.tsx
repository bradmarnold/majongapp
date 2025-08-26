import React from 'react';
import { Tile as TileType, sortTiles } from '@majongapp/core';
import { Tile } from './Tile';

export interface HandProps {
  tiles: TileType[];
  selectedTiles?: TileType[];
  onTileClick?: (tile: TileType, index: number) => void;
  size?: 'small' | 'medium' | 'large';
  maxWidth?: string;
  label?: string;
}

export const Hand: React.FC<HandProps> = ({
  tiles,
  selectedTiles = [],
  onTileClick,
  size = 'medium',
  maxWidth = '800px',
  label = 'Your hand',
}) => {
  const sortedTiles = sortTiles(tiles);

  const handleTileClick = (tile: TileType) => {
    const index = tiles.findIndex(t => t.id === tile.id);
    if (index >= 0 && onTileClick) {
      onTileClick(tile, index);
    }
  };

  const isSelected = (tile: TileType) => {
    return selectedTiles.some(selected => selected.id === tile.id);
  };

  return (
    <div className="flex flex-col items-center space-y-2">
      <h3 className="text-sm font-medium text-gray-700 sr-only">
        {label}
      </h3>
      <div 
        className="flex flex-wrap justify-center gap-1 p-2"
        style={{ maxWidth }}
        role="group"
        aria-label={`${label} with ${tiles.length} tiles`}
      >
        {sortedTiles.map((tile, index) => {
          const originalIndex = tiles.findIndex(t => t.id === tile.id);
          return (
            <Tile
              key={tile.id}
              tile={tile}
              selected={isSelected(tile)}
              onClick={onTileClick ? handleTileClick : undefined}
              size={size}
              aria-label={`Tile ${index + 1} of ${tiles.length}`}
            />
          );
        })}
      </div>
      <div className="text-xs text-gray-500" aria-live="polite">
        {tiles.length} tiles
      </div>
    </div>
  );
};

export default Hand;