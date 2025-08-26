import React, { useState } from 'react';
import { Tile as TileType, Meld, MeldType } from '@majongapp/core';
import { Tile } from './Tile';

export interface MeldPickerProps {
  availableTiles: TileType[];
  calledTile?: TileType;
  onMeldSelect: (meld: Meld) => void;
  onCancel: () => void;
}

export const MeldPicker: React.FC<MeldPickerProps> = ({
  availableTiles,
  calledTile,
  onMeldSelect,
  onCancel,
}) => {
  const [selectedTiles, setSelectedTiles] = useState<TileType[]>([]);
  const [meldType, setMeldType] = useState<MeldType | null>(null);

  const handleTileClick = (tile: TileType) => {
    setSelectedTiles(prev => {
      const isSelected = prev.some(t => t.id === tile.id);
      if (isSelected) {
        return prev.filter(t => t.id !== tile.id);
      } else {
        return [...prev, tile];
      }
    });
  };

  const handleMeldTypeSelect = (type: MeldType) => {
    setMeldType(type);
    // Auto-validate and create meld if possible
    if (canFormMeld(type)) {
      createMeld(type);
    }
  };

  const canFormMeld = (type: MeldType): boolean => {
    if (!calledTile) return false;

    switch (type) {
      case 'pon':
        return selectedTiles.length === 2 && 
               selectedTiles.every(t => t.suit === calledTile.suit && t.value === calledTile.value);
      
      case 'chi':
        if (selectedTiles.length !== 2) return false;
        // Check if forms a sequence with called tile
        const allTiles = [...selectedTiles, calledTile];
        const values = allTiles.map(t => t.value as number).sort((a, b) => a - b);
        return values[2] - values[1] === 1 && values[1] - values[0] === 1 &&
               allTiles.every(t => t.suit === calledTile.suit);
      
      case 'kan':
        return selectedTiles.length === 3 &&
               selectedTiles.every(t => t.suit === calledTile.suit && t.value === calledTile.value);
      
      default:
        return false;
    }
  };

  const createMeld = (type: MeldType) => {
    if (!calledTile || !canFormMeld(type)) return;

    const meld: Meld = {
      type,
      tiles: [calledTile, ...selectedTiles],
      fromPlayer: 0, // Will be set by parent
    };

    onMeldSelect(meld);
  };

  const handleConfirm = () => {
    if (meldType && canFormMeld(meldType)) {
      createMeld(meldType);
    }
  };

  const isSelected = (tile: TileType) => {
    return selectedTiles.some(t => t.id === tile.id);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-lg w-full mx-4">
        <h3 className="text-lg font-bold mb-4">Call Meld</h3>
        
        {calledTile && (
          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-2">Called tile:</p>
            <Tile tile={calledTile} size="medium" />
          </div>
        )}

        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-2">Select meld type:</p>
          <div className="flex space-x-2">
            <button
              className={`px-3 py-2 rounded text-sm ${
                meldType === 'pon' ? 'bg-blue-500 text-white' : 'bg-gray-200'
              }`}
              onClick={() => handleMeldTypeSelect('pon')}
            >
              Pon (3 same)
            </button>
            <button
              className={`px-3 py-2 rounded text-sm ${
                meldType === 'chi' ? 'bg-blue-500 text-white' : 'bg-gray-200'
              }`}
              onClick={() => handleMeldTypeSelect('chi')}
            >
              Chi (sequence)
            </button>
            <button
              className={`px-3 py-2 rounded text-sm ${
                meldType === 'kan' ? 'bg-blue-500 text-white' : 'bg-gray-200'
              }`}
              onClick={() => handleMeldTypeSelect('kan')}
            >
              Kan (4 same)
            </button>
          </div>
        </div>

        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-2">
            Select tiles from your hand ({selectedTiles.length} selected):
          </p>
          <div className="flex flex-wrap gap-1 max-h-32 overflow-y-auto">
            {availableTiles.map(tile => (
              <Tile
                key={tile.id}
                tile={tile}
                selected={isSelected(tile)}
                onClick={handleTileClick}
                size="small"
              />
            ))}
          </div>
        </div>

        <div className="flex justify-end space-x-2">
          <button
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            className={`px-4 py-2 rounded text-white ${
              meldType && canFormMeld(meldType)
                ? 'bg-blue-500 hover:bg-blue-600'
                : 'bg-gray-400 cursor-not-allowed'
            }`}
            onClick={handleConfirm}
            disabled={!meldType || !canFormMeld(meldType)}
          >
            Confirm Meld
          </button>
        </div>
      </div>
    </div>
  );
};

export default MeldPicker;