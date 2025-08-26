import { Tile, getTileKey, tilesEqual, sortTiles } from './types.js';
import { calculateShanten } from './shanten.js';

export interface AdviceResult {
  action: 'discard' | 'keep' | 'call';
  tile?: Tile;
  reasoning: string;
  priority: number; // 1-10, higher is more urgent
  alternatives: AdviceAlternative[];
}

export interface AdviceAlternative {
  action: 'discard' | 'keep';
  tile: Tile;
  reasoning: string;
  priority: number;
}

export interface GameSummary {
  hand: Tile[];
  drawnTile?: Tile;
  availableCalls: CallOption[];
  round: number;
  playerWind: 'east' | 'south' | 'west' | 'north';
  prevalentWind: 'east' | 'south' | 'west' | 'north';
  dora: Tile[]; // Empty for Hong Kong Basic (no dora)
}

export interface CallOption {
  type: 'chi' | 'pon' | 'kan';
  tiles: Tile[];
  fromPlayer: number;
  discardAfter?: Tile;
}

// Analyze a hand and provide advice
export function analyzeHand(summary: GameSummary): AdviceResult {
  const { hand, drawnTile, availableCalls } = summary;
  const currentHand = drawnTile ? [...hand, drawnTile] : hand;

  // Check for winning opportunities first
  if (drawnTile) {
    const isWinning = calculateShanten(currentHand).shanten === -1;
    if (isWinning) {
      return {
        action: 'keep',
        tile: drawnTile,
        reasoning: 'Winning hand! Declare mahjong.',
        priority: 10,
        alternatives: [],
      };
    }
  }

  // Check for beneficial calls
  if (availableCalls.length > 0) {
    const callAdvice = analyzeCalls(hand, availableCalls);
    if (callAdvice && callAdvice.priority >= 7) {
      return callAdvice;
    }
  }

  // Analyze discard options
  if (currentHand.length === 14) {
    return analyzeDiscards(currentHand);
  }

  // For 13-tile hands, provide general advice
  return analyzeWaiting(hand);
}

// Analyze potential calls (chi, pon, kan)
function analyzeCalls(hand: Tile[], calls: CallOption[]): AdviceResult | null {
  let bestCall: CallOption | null = null;
  let bestScore = -1;

  for (const call of calls) {
    const score = evaluateCall(hand, call);
    if (score > bestScore) {
      bestScore = score;
      bestCall = call;
    }
  }

  if (!bestCall || bestScore < 5) {
    return null;
  }

  return {
    action: 'call',
    reasoning: `Call ${bestCall.type} to improve hand structure. This gives you a completed meld and better chances.`,
    priority: Math.min(9, Math.floor(bestScore)),
    alternatives: calls.filter(c => c !== bestCall).map(call => ({
      action: 'keep',
      tile: call.tiles[0],
      reasoning: `Alternative: call ${call.type}`,
      priority: Math.floor(evaluateCall(hand, call)),
    })),
  };
}

// Evaluate the value of making a call
function evaluateCall(hand: Tile[], call: CallOption): number {
  // Simulate the call
  const newHand = [...hand];
  
  // Remove tiles used in the call (except the called tile)
  const callTiles = call.tiles.slice(1); // First tile is from another player
  for (const tile of callTiles) {
    const index = newHand.findIndex(t => tilesEqual(t, tile));
    if (index >= 0) {
      newHand.splice(index, 1);
    }
  }

  const beforeShanten = calculateShanten(hand);
  const afterShanten = calculateShanten(newHand);

  // Base score on shanten improvement
  let score = (beforeShanten.shanten - afterShanten.shanten) * 3;

  // Bonus for completing sequences vs triplets
  if (call.type === 'chi') {
    score += 1; // Sequences are often more flexible
  }

  // Penalty for honor tiles in late game
  if (call.tiles[0].suit === 'honor') {
    score -= 1;
  }

  return Math.max(0, score);
}

// Analyze discard options for a 14-tile hand
function analyzeDiscards(hand: Tile[]): AdviceResult {
  const discardOptions: Array<{
    tile: Tile;
    index: number;
    resultingShanten: number;
    improvements: string[];
  }> = [];

  // Try discarding each tile
  for (let i = 0; i < hand.length; i++) {
    const testHand = hand.filter((_, index) => index !== i);
    const result = calculateShanten(testHand);
    
    discardOptions.push({
      tile: hand[i],
      index: i,
      resultingShanten: result.shanten,
      improvements: result.improvements,
    });
  }

  // Sort by best outcome (lowest shanten, most improvements)
  discardOptions.sort((a, b) => {
    if (a.resultingShanten !== b.resultingShanten) {
      return a.resultingShanten - b.resultingShanten;
    }
    return b.improvements.length - a.improvements.length;
  });

  const bestDiscard = discardOptions[0];
  const worstDiscard = discardOptions[discardOptions.length - 1];

  let reasoning = '';
  let priority = 5;

  if (bestDiscard.resultingShanten === 0) {
    reasoning = 'Discard this tile to reach tenpai (ready to win). ';
    priority = 9;
  } else if (bestDiscard.resultingShanten === 1) {
    reasoning = 'Good discard that brings you closer to tenpai. ';
    priority = 7;
  } else {
    reasoning = 'Best available discard to improve hand structure. ';
    priority = 6;
  }

  reasoning += `This leaves ${bestDiscard.improvements.length} useful tiles: ${bestDiscard.improvements.slice(0, 3).join(', ')}${bestDiscard.improvements.length > 3 ? '...' : ''}.`;

  // Generate alternatives
  const alternatives: AdviceAlternative[] = discardOptions
    .slice(1, 4) // Top 3 alternatives
    .map(option => ({
      action: 'discard' as const,
      tile: option.tile,
      reasoning: `Alternative discard. Shanten: ${option.resultingShanten}, ${option.improvements.length} useful tiles.`,
      priority: Math.max(1, priority - 2),
    }));

  return {
    action: 'discard',
    tile: bestDiscard.tile,
    reasoning,
    priority,
    alternatives,
  };
}

// Analyze a waiting hand (13 tiles)
function analyzeWaiting(hand: Tile[]): AdviceResult {
  const result = calculateShanten(hand);
  
  let reasoning = '';
  let priority = 5;

  if (result.shanten === 0) {
    reasoning = `You're in tenpai! Wait for these tiles: ${result.improvements.slice(0, 5).join(', ')}.`;
    priority = 8;
  } else if (result.shanten === 1) {
    reasoning = `One away from tenpai. Look for these useful tiles: ${result.improvements.slice(0, 5).join(', ')}.`;
    priority = 6;
  } else {
    reasoning = `Focus on improving hand structure. ${result.improvements.length} tiles can help: ${result.improvements.slice(0, 3).join(', ')}.`;
    priority = 4;
  }

  return {
    action: 'keep',
    reasoning,
    priority,
    alternatives: [],
  };
}

// Evaluate the defensive value of a tile
export function evaluateDefensiveValue(tile: Tile, visibleTiles: Tile[]): number {
  const tileKey = getTileKey(tile);
  const visibleCount = visibleTiles.filter(t => getTileKey(t) === tileKey).length;
  
  // Safer tiles are those that are less likely to be winning tiles for opponents
  let safety = 5; // Base safety (1-10 scale)

  // Terminal tiles (1, 9) and honors are generally safer
  if (tile.suit === 'honor') {
    safety += 2;
  } else if (tile.value === 1 || tile.value === 9) {
    safety += 1;
  }

  // Tiles that have been discarded multiple times are safer
  safety += Math.min(3, visibleCount);

  // Middle tiles (4, 5, 6) are more dangerous
  if (tile.suit !== 'honor' && tile.value >= 4 && tile.value <= 6) {
    safety -= 1;
  }

  return Math.max(1, Math.min(10, safety));
}

// Generate a summary for the advice API
export function generateAdviceSummary(summary: GameSummary, advice: AdviceResult): string {
  const { hand, drawnTile, round, playerWind } = summary;
  const handSize = hand.length + (drawnTile ? 1 : 0);
  const currentShanten = calculateShanten(drawnTile ? [...hand, drawnTile] : hand);

  let description = `Round ${round}, playing as ${playerWind} wind. `;
  description += `Hand size: ${handSize}, Shanten: ${currentShanten.shanten}. `;
  
  if (advice.action === 'discard') {
    description += `Recommended discard: ${getTileKey(advice.tile!)}. `;
  } else if (advice.action === 'call') {
    description += `Recommended call available. `;
  }
  
  description += `Priority: ${advice.priority}/10. ${advice.reasoning}`;
  
  return description;
}

// Score a completed hand (basic scoring for Hong Kong style)
export function scoreHand(
  hand: Tile[],
  winningTile: Tile,
  isSelfDraw: boolean,
  playerWind: 'east' | 'south' | 'west' | 'north',
  prevalentWind: 'east' | 'south' | 'west' | 'north'
): { score: number; doubles: number; details: string[] } {
  const details: string[] = [];
  let doubles = 0;

  // Base score
  details.push('Base score: 1 double');
  doubles += 1;

  // Self-draw bonus
  if (isSelfDraw) {
    details.push('Self-draw: +1 double');
    doubles += 1;
  }

  // Wind bonuses
  const honorCounts = countHonorTiles(hand);
  
  if (honorCounts.get(playerWind) >= 3) {
    details.push(`Player wind (${playerWind}): +1 double`);
    doubles += 1;
  }
  
  if (honorCounts.get(prevalentWind) >= 3 && prevalentWind !== playerWind) {
    details.push(`Prevalent wind (${prevalentWind}): +1 double`);
    doubles += 1;
  }

  // Dragon bonuses
  for (const dragon of ['red', 'green', 'white'] as const) {
    if (honorCounts.get(dragon) >= 3) {
      details.push(`Dragon (${dragon}): +1 double`);
      doubles += 1;
    }
  }

  // All honor tiles
  if (hand.every(tile => tile.suit === 'honor')) {
    details.push('All honors: +3 doubles');
    doubles += 3;
  }

  // Calculate final score (base 10 points * 2^doubles)
  const score = 10 * Math.pow(2, doubles);

  return { score, doubles, details };
}

// Helper function to count honor tiles
function countHonorTiles(tiles: Tile[]): Map<string, number> {
  const counts = new Map<string, number>();
  
  for (const tile of tiles) {
    if (tile.suit === 'honor') {
      const key = tile.value as string;
      counts.set(key, (counts.get(key) || 0) + 1);
    }
  }
  
  return counts;
}