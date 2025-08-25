import { Tile, Suit, Honor, tilesEqual, getTileKey } from './types.js';

// Shanten calculation for Hong Kong Basic Mahjong
// Shanten = minimum number of tile changes needed to reach tenpai (ready to win)

export interface ShantenResult {
  shanten: number;
  improvements: string[]; // tile keys that would improve the hand
}

// Count tiles by their key (suit-value)
function countTiles(tiles: Tile[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const tile of tiles) {
    const key = getTileKey(tile);
    counts.set(key, (counts.get(key) || 0) + 1);
  }
  return counts;
}

// Convert tile counts to arrays for easier processing
function countsToArrays(counts: Map<string, number>): {
  man: number[];
  pin: number[];
  sou: number[];
  honor: number[];
} {
  const result = {
    man: new Array(9).fill(0),
    pin: new Array(9).fill(0),
    sou: new Array(9).fill(0),
    honor: new Array(7).fill(0), // east, south, west, north, red, green, white
  };

  const honorMap = {
    east: 0, south: 1, west: 2, north: 3,
    red: 4, green: 5, white: 6
  };

  for (const [key, count] of counts) {
    const [suit, value] = key.split('-');
    
    if (suit === 'honor') {
      const honorIndex = honorMap[value as Honor];
      if (honorIndex !== undefined) {
        result.honor[honorIndex] = count;
      }
    } else {
      const suitArray = result[suit as 'man' | 'pin' | 'sou'];
      const numValue = parseInt(value) - 1; // convert to 0-based index
      if (numValue >= 0 && numValue < 9) {
        suitArray[numValue] = count;
      }
    }
  }

  return result;
}

// Calculate minimum shanten for a hand using standard mahjong rules
export function calculateShanten(tiles: Tile[]): ShantenResult {
  if (tiles.length !== 13 && tiles.length !== 14) {
    throw new Error('Hand must have 13 or 14 tiles for shanten calculation');
  }

  const counts = countTiles(tiles);
  const arrays = countsToArrays(counts);
  
  // For a 14-tile hand, check if it's already winning
  if (tiles.length === 14) {
    if (isWinningHand(tiles)) {
      return { shanten: -1, improvements: [] };
    }
  }

  // Calculate shanten using a simplified approach
  const shanten = calculateShantenSimple(arrays);
  
  // Find improvement tiles
  const improvements = findImprovements(arrays, shanten);

  return { shanten, improvements };
}

// Simplified shanten calculation
function calculateShantenSimple(arrays: {
  man: number[];
  pin: number[];
  sou: number[];
  honor: number[];
}): number {
  let minShanten = 8; // Max possible shanten

  // Try different arrangements with pairs
  const suits = ['man', 'pin', 'sou'] as const;
  
  // Try pair in each position
  for (const suit of suits) {
    for (let i = 0; i < 9; i++) {
      if (arrays[suit][i] >= 2) {
        // Use this as pair
        arrays[suit][i] -= 2;
        const shanten = calculateWithoutPair(arrays);
        minShanten = Math.min(minShanten, shanten);
        arrays[suit][i] += 2;
      }
    }
  }

  // Try honor pairs
  for (let i = 0; i < 7; i++) {
    if (arrays.honor[i] >= 2) {
      arrays.honor[i] -= 2;
      const shanten = calculateWithoutPair(arrays);
      minShanten = Math.min(minShanten, shanten);
      arrays.honor[i] += 2;
    }
  }

  return minShanten;
}

// Calculate shanten when pair is already removed
function calculateWithoutPair(arrays: {
  man: number[];
  pin: number[];
  sou: number[];
  honor: number[];
}): number {
  const suits = ['man', 'pin', 'sou'] as const;
  let totalShanten = 0;

  // Calculate for each suit
  for (const suit of suits) {
    totalShanten += calculateSuitShanten(arrays[suit]);
  }

  // Calculate for honors (only triplets possible)
  totalShanten += calculateHonorShanten(arrays.honor);

  return totalShanten;
}

// Calculate shanten for a single suit
function calculateSuitShanten(counts: number[]): number {
  // Dynamic programming approach
  const memo = new Map<string, number>();
  
  function dp(arr: number[]): number {
    const key = arr.join(',');
    if (memo.has(key)) {
      return memo.get(key)!;
    }

    const total = arr.reduce((sum, count) => sum + count, 0);
    if (total === 0) {
      memo.set(key, 0);
      return 0;
    }

    let minShanten = Math.ceil(total / 3); // Worst case: all isolated tiles

    // Try forming sequences
    for (let i = 0; i <= 6; i++) {
      if (arr[i] > 0 && arr[i + 1] > 0 && arr[i + 2] > 0) {
        arr[i]--; arr[i + 1]--; arr[i + 2]--;
        minShanten = Math.min(minShanten, dp(arr));
        arr[i]++; arr[i + 1]++; arr[i + 2]++;
      }
    }

    // Try forming triplets
    for (let i = 0; i < arr.length; i++) {
      if (arr[i] >= 3) {
        arr[i] -= 3;
        minShanten = Math.min(minShanten, dp(arr));
        arr[i] += 3;
      }
    }

    memo.set(key, minShanten);
    return minShanten;
  }

  return dp([...counts]);
}

// Calculate shanten for honor tiles (only triplets possible)
function calculateHonorShanten(counts: number[]): number {
  let shanten = 0;
  
  for (const count of counts) {
    if (count > 0) {
      shanten += Math.ceil(count / 3) - Math.floor(count / 3);
      if (count % 3 !== 0) {
        shanten += Math.ceil((count % 3) / 3);
      }
    }
  }

  return shanten;
}

// Find tiles that would improve the hand
function findImprovements(arrays: {
  man: number[];
  pin: number[];
  sou: number[];
  honor: number[];
}, currentShanten: number): string[] {
  const improvements: string[] = [];
  
  // Test each possible tile
  const allTileKeys = getAllPossibleTileKeys();
  
  for (const tileKey of allTileKeys) {
    const [suit, value] = tileKey.split('-');
    
    // Add the test tile
    const testArrays = {
      man: [...arrays.man],
      pin: [...arrays.pin],
      sou: [...arrays.sou],
      honor: [...arrays.honor],
    };

    if (suit === 'honor') {
      const honorMap = { east: 0, south: 1, west: 2, north: 3, red: 4, green: 5, white: 6 };
      const index = honorMap[value as Honor];
      if (index !== undefined) {
        testArrays.honor[index]++;
      }
    } else {
      const suitArray = testArrays[suit as 'man' | 'pin' | 'sou'];
      const numValue = parseInt(value) - 1;
      if (numValue >= 0 && numValue < 9) {
        suitArray[numValue]++;
      }
    }

    // Check if this improves shanten
    const newShanten = calculateShantenSimple(testArrays);
    if (newShanten < currentShanten) {
      improvements.push(tileKey);
    }
  }

  return improvements.sort();
}

// Check if a hand is winning (complete)
export function isWinningHand(tiles: Tile[]): boolean {
  if (tiles.length !== 14) {
    return false;
  }

  const counts = countTiles(tiles);
  const arrays = countsToArrays(counts);

  // Check if hand has exactly 4 melds + 1 pair
  return checkWinningPattern(arrays);
}

// Check if the tile arrangement forms a winning pattern
function checkWinningPattern(arrays: {
  man: number[];
  pin: number[];
  sou: number[];
  honor: number[];
}): boolean {
  // Try removing a pair first, then see if remaining forms 4 melds
  const suits = ['man', 'pin', 'sou'] as const;
  
  // Try pair in suited tiles
  for (const suit of suits) {
    for (let i = 0; i < 9; i++) {
      if (arrays[suit][i] >= 2) {
        arrays[suit][i] -= 2;
        if (checkAllMelds(arrays)) {
          arrays[suit][i] += 2;
          return true;
        }
        arrays[suit][i] += 2;
      }
    }
  }

  // Try pair in honor tiles
  for (let i = 0; i < 7; i++) {
    if (arrays.honor[i] >= 2) {
      arrays.honor[i] -= 2;
      if (checkAllMelds(arrays)) {
        arrays.honor[i] += 2;
        return true;
      }
      arrays.honor[i] += 2;
    }
  }

  return false;
}

// Check if all remaining tiles form exactly 4 melds
function checkAllMelds(arrays: {
  man: number[];
  pin: number[];
  sou: number[];
  honor: number[];
}): boolean {
  const totalTiles = 
    arrays.man.reduce((sum, count) => sum + count, 0) +
    arrays.pin.reduce((sum, count) => sum + count, 0) +
    arrays.sou.reduce((sum, count) => sum + count, 0) +
    arrays.honor.reduce((sum, count) => sum + count, 0);

  if (totalTiles !== 12) {
    return false; // Should be exactly 4 melds = 12 tiles
  }

  // Check if each suit can form valid melds
  const suits = ['man', 'pin', 'sou'] as const;
  for (const suit of suits) {
    if (!canFormMelds(arrays[suit])) {
      return false;
    }
  }

  // Check honor tiles (only triplets)
  for (const count of arrays.honor) {
    if (count % 3 !== 0) {
      return false;
    }
  }

  return true;
}

// Check if a suit array can form valid melds
function canFormMelds(counts: number[]): boolean {
  const arr = [...counts];
  
  // Remove all possible sequences
  for (let i = 0; i <= 6; i++) {
    while (arr[i] > 0 && arr[i + 1] > 0 && arr[i + 2] > 0) {
      arr[i]--; arr[i + 1]--; arr[i + 2]--;
    }
  }

  // Check if remaining tiles can form triplets
  for (const count of arr) {
    if (count % 3 !== 0) {
      return false;
    }
  }

  return true;
}

// Get all possible tile keys for improvement calculation
function getAllPossibleTileKeys(): string[] {
  const keys: string[] = [];

  // Suited tiles
  for (const suit of ['man', 'pin', 'sou']) {
    for (let value = 1; value <= 9; value++) {
      keys.push(`${suit}-${value}`);
    }
  }

  // Honor tiles
  for (const honor of ['east', 'south', 'west', 'north', 'red', 'green', 'white']) {
    keys.push(`honor-${honor}`);
  }

  return keys;
}