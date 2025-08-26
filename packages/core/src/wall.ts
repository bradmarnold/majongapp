import { Tile, Suit, Honor, createTileWithId, WALL_SIZE } from './types.js';

// Deterministic RNG for testing
export class SeededRNG {
  private seed: number;

  constructor(seed: number = 12345) {
    this.seed = seed;
  }

  next(): number {
    // Linear congruential generator
    this.seed = (this.seed * 1664525 + 1013904223) % 0x100000000;
    return this.seed / 0x100000000;
  }

  shuffle<T>(array: T[]): T[] {
    const result = [...array];
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(this.next() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }
}

// Create a complete mahjong wall (144 tiles)
export function createWall(rng?: SeededRNG): Tile[] {
  const tiles: Tile[] = [];
  let tileId = 0;

  // Create numbered tiles (1-9) for each suit, 4 copies each
  const suits: Suit[] = ['man', 'pin', 'sou'];
  for (const suit of suits) {
    for (let value = 1; value <= 9; value++) {
      for (let copy = 0; copy < 4; copy++) {
        tiles.push(createTileWithId(suit, value, `${suit}-${value}-${copy}`));
        tileId++;
      }
    }
  }

  // Create honor tiles, 4 copies each
  const honors: Honor[] = ['east', 'south', 'west', 'north', 'red', 'green', 'white'];
  for (const honor of honors) {
    for (let copy = 0; copy < 4; copy++) {
      tiles.push(createTileWithId('honor', honor, `honor-${honor}-${copy}`));
      tileId++;
    }
  }

  if (tiles.length !== WALL_SIZE) {
    throw new Error(`Wall should have ${WALL_SIZE} tiles, got ${tiles.length}`);
  }

  // Shuffle the wall
  if (rng) {
    return rng.shuffle(tiles);
  }
  
  // Use Math.random for non-deterministic shuffle
  const result = [...tiles];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

// Deal initial hands from the wall
export function dealHands(wall: Tile[], numPlayers: number = 4): {
  hands: Tile[][];
  remaining: Tile[];
} {
  if (numPlayers < 2 || numPlayers > 4) {
    throw new Error('Number of players must be between 2 and 4');
  }

  const hands: Tile[][] = [];
  let wallIndex = 0;

  // Initialize empty hands
  for (let i = 0; i < numPlayers; i++) {
    hands.push([]);
  }

  // Deal 13 tiles to each player in a round-robin fashion
  for (let round = 0; round < 13; round++) {
    for (let player = 0; player < numPlayers; player++) {
      if (wallIndex >= wall.length) {
        throw new Error('Not enough tiles in wall for dealing');
      }
      hands[player].push(wall[wallIndex++]);
    }
  }

  return {
    hands,
    remaining: wall.slice(wallIndex),
  };
}

// Draw a tile from the wall
export function drawTile(wall: Tile[]): { tile: Tile | null; remaining: Tile[] } {
  if (wall.length === 0) {
    return { tile: null, remaining: [] };
  }
  
  return {
    tile: wall[0],
    remaining: wall.slice(1),
  };
}