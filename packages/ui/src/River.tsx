import React from 'react';
import { Tile as TileType } from '@majongapp/core';
import { Tile } from './Tile';

export interface RiverProps {
  tiles: TileType[];
  playerName?: string;
  highlightedTile?: TileType;
  maxRows?: number;
}

export const River: React.FC<RiverProps> = ({
  tiles,
  playerName = 'Player',
  highlightedTile,
  maxRows = 3,
}) => {
  const tilesPerRow = Math.ceil(tiles.length / maxRows);

  const isHighlighted = (tile: TileType) => {
    return highlightedTile?.id === tile.id;
  };

  return (
    <div className="flex flex-col items-center space-y-2">
      <h4 className="text-sm font-medium text-gray-700">
        {playerName} River ({tiles.length} tiles)
      </h4>
      <div 
        className="grid gap-1 p-2 bg-gray-50 rounded"
        style={{
          gridTemplateColumns: `repeat(${Math.min(tilesPerRow, 6)}, 1fr)`,
          maxWidth: '400px',
        }}
        role="group"
        aria-label={`${playerName} discarded tiles`}
      >
        {tiles.map((tile, index) => (
          <div
            key={`${tile.id}-${index}`}
            className={`${isHighlighted(tile) ? 'ring-2 ring-yellow-400 rounded' : ''}`}
          >
            <Tile
              tile={tile}
              size="small"
              aria-label={`Discarded tile ${index + 1}: ${tile.suit}-${tile.value}`}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default River;