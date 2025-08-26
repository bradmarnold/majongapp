// Tile suits for Hong Kong Basic Mahjong
export type Suit = 'man' | 'pin' | 'sou' | 'honor';

// Honor tiles: winds and dragons
export type Wind = 'east' | 'south' | 'west' | 'north';
export type Dragon = 'red' | 'green' | 'white';
export type Honor = Wind | Dragon;

// Tile represents a single mahjong tile
export interface Tile {
  suit: Suit;
  value: number | Honor; // 1-9 for suited tiles, Wind/Dragon for honors
  id: string; // unique identifier for this specific tile instance
}

// Meld types
export type MeldType = 'chi' | 'pon' | 'kan' | 'ankan';

export interface Meld {
  type: MeldType;
  tiles: Tile[];
  fromPlayer?: number; // which player the called tile came from (undefined for ankan)
}

// Game constants
export const WALL_SIZE = 144;
export const HAND_SIZE = 13;
export const DRAWN_HAND_SIZE = 14;

// Utility functions
export function createTile(suit: Suit, value: number | Honor): Omit<Tile, 'id'> {
  return { suit, value };
}

export function createTileWithId(suit: Suit, value: number | Honor, id: string): Tile {
  return { suit, value, id };
}

export function getTileKey(tile: Tile): string {
  return `${tile.suit}-${tile.value}`;
}

export function getTileName(tile: Tile): string {
  if (tile.suit === 'honor') {
    return `${tile.value}`;
  }
  return `${tile.value}${tile.suit}`;
}

export function tilesEqual(a: Tile, b: Tile): boolean {
  return a.suit === b.suit && a.value === b.value;
}

export function sortTiles(tiles: Tile[]): Tile[] {
  return [...tiles].sort((a, b) => {
    // Sort order: man, pin, sou, honor
    const suitOrder = { man: 0, pin: 1, sou: 2, honor: 3 };
    
    if (a.suit !== b.suit) {
      return suitOrder[a.suit] - suitOrder[b.suit];
    }
    
    if (a.suit === 'honor') {
      // Honor tile order: east, south, west, north, red, green, white
      const honorOrder = { east: 0, south: 1, west: 2, north: 3, red: 4, green: 5, white: 6 };
      return honorOrder[a.value as Honor] - honorOrder[b.value as Honor];
    }
    
    return (a.value as number) - (b.value as number);
  });
}