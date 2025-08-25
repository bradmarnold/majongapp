import { describe, it, expect } from 'vitest';
import { 
  analyzeHand, 
  evaluateDefensiveValue, 
  generateAdviceSummary, 
  scoreHand,
  GameSummary 
} from './advisor.js';
import { createTileWithId, Tile } from './types.js';

// Helper function to create test tiles
function tile(suit: string, value: string | number, id?: string): Tile {
  const tileId = id || `${suit}-${value}-test`;
  if (suit === 'honor') {
    return createTileWithId('honor', value as any, tileId);
  }
  return createTileWithId(suit as any, value as number, tileId);
}

// Helper to create multiple tiles
function tiles(spec: string): Tile[] {
  const result: Tile[] = [];
  let counter = 0;
  
  const parts = spec.split(' ');
  for (const part of parts) {
    if (!part) continue;
    
    const honorMatch = part.match(/^honor-(\w+)$/);
    if (honorMatch) {
      // Single honor tile
      result.push(tile('honor', honorMatch[1], `test-${counter++}`));
      continue;
    }
    
    const suitMatch = part.match(/^(\d+)([mps])$/);
    if (suitMatch) {
      const values = suitMatch[1];
      const suitChar = suitMatch[2];
      const suit = suitChar === 'm' ? 'man' : suitChar === 'p' ? 'pin' : 'sou';
      
      for (const char of values) {
        result.push(tile(suit, parseInt(char), `test-${counter++}`));
      }
    }
  }
  
  return result;
}

function createTestSummary(hand: Tile[], drawnTile?: Tile): GameSummary {
  return {
    hand,
    drawnTile,
    availableCalls: [],
    round: 1,
    playerWind: 'east',
    prevalentWind: 'east',
    dora: [],
  };
}

describe('advisor', () => {
  describe('analyzeHand', () => {
    it('should recognize winning hands', () => {
      const hand = tiles('123456789m 111p');
      const summary = createTestSummary(hand.slice(0, 13), hand[13]);
      
      const advice = analyzeHand(summary);
      expect(advice.action).toBe('keep');
      expect(advice.priority).toBe(10);
      expect(advice.reasoning).toContain('Winning hand');
    });

    it('should suggest discards for 14-tile hands', () => {
      const hand = tiles('123456789m 111p 4s');
      const summary = createTestSummary(hand);
      
      const advice = analyzeHand(summary);
      expect(advice.action).toBe('discard');
      expect(advice.tile).toBeDefined();
      expect(advice.priority).toBeGreaterThan(0);
    });

    it('should provide waiting advice for tenpai hands', () => {
      const hand = tiles('12345678m 111p 11s');
      const summary = createTestSummary(hand);
      
      const advice = analyzeHand(summary);
      expect(advice.reasoning).toContain('tenpai');
      expect(advice.priority).toBeGreaterThan(5);
    });

    it('should handle hands far from completion', () => {
      const hand = tiles('159m 259p 369s 147s');
      const summary = createTestSummary(hand);
      
      const advice = analyzeHand(summary);
      expect(advice.priority).toBeLessThan(7);
      expect(advice.reasoning).toContain('structure');
    });

    it('should analyze call opportunities', () => {
      const hand = tiles('123456m 789p 11s 34s');
      const summary = {
        ...createTestSummary(hand),
        availableCalls: [{
          type: 'chi' as const,
          tiles: [tile('sou', 2), tile('sou', 3), tile('sou', 4)],
          fromPlayer: 1,
        }],
      };
      
      const advice = analyzeHand(summary);
      // Should evaluate the call opportunity
      expect(advice).toBeDefined();
    });

    it('should prioritize winning over other actions', () => {
      const winningHand = tiles('123456789m 1111p');
      const summary = createTestSummary(winningHand.slice(0, 13), winningHand[13]);
      
      const advice = analyzeHand(summary);
      expect(advice.action).toBe('keep');
      expect(advice.priority).toBe(10);
    });

    it('should provide alternatives for discard decisions', () => {
      const hand = tiles('1234567m 111p 123s 9m');
      const summary = createTestSummary(hand);
      
      const advice = analyzeHand(summary);
      expect(advice.action).toBe('discard');
      expect(advice.alternatives.length).toBeGreaterThan(0);
    });

    it('should handle honor-heavy hands', () => {
      const hand: Tile[] = [
        ...Array(3).fill(null).map((_, i) => tile('honor', 'east', `east-${i}`)),
        ...Array(3).fill(null).map((_, i) => tile('honor', 'red', `red-${i}`)),
        ...tiles('123456m 7m'),
      ];
      const summary = createTestSummary(hand);
      
      const advice = analyzeHand(summary);
      expect(advice).toBeDefined();
      expect(advice.reasoning).toBeTruthy();
    });
  });

  describe('evaluateDefensiveValue', () => {
    it('should rate honor tiles as safer', () => {
      const honorTile = tile('honor', 'east');
      const numberTile = tile('man', 5);
      const visibleTiles: Tile[] = [];
      
      const honorSafety = evaluateDefensiveValue(honorTile, visibleTiles);
      const numberSafety = evaluateDefensiveValue(numberTile, visibleTiles);
      
      expect(honorSafety).toBeGreaterThan(numberSafety);
    });

    it('should rate terminal tiles as safer than middle tiles', () => {
      const terminalTile = tile('man', 1);
      const middleTile = tile('man', 5);
      const visibleTiles: Tile[] = [];
      
      const terminalSafety = evaluateDefensiveValue(terminalTile, visibleTiles);
      const middleSafety = evaluateDefensiveValue(middleTile, visibleTiles);
      
      expect(terminalSafety).toBeGreaterThan(middleSafety);
    });

    it('should consider visible tiles for safety', () => {
      const testTile = tile('man', 3);
      const noVisibleTiles: Tile[] = [];
      const manyVisibleTiles = [
        tile('man', 3, 'copy1'),
        tile('man', 3, 'copy2'),
        tile('man', 3, 'copy3'),
      ];
      
      const baseSafety = evaluateDefensiveValue(testTile, noVisibleTiles);
      const improvedSafety = evaluateDefensiveValue(testTile, manyVisibleTiles);
      
      expect(improvedSafety).toBeGreaterThan(baseSafety);
    });

    it('should return values in valid range', () => {
      const testTile = tile('man', 5);
      const safety = evaluateDefensiveValue(testTile, []);
      
      expect(safety).toBeGreaterThanOrEqual(1);
      expect(safety).toBeLessThanOrEqual(10);
    });
  });

  describe('generateAdviceSummary', () => {
    it('should generate descriptive summaries', () => {
      const hand = tiles('123456789m 111p 4s');
      const summary = createTestSummary(hand);
      const advice = analyzeHand(summary);
      
      const description = generateAdviceSummary(summary, advice);
      
      expect(description).toContain('Round 1');
      expect(description).toContain('east wind');
      expect(description).toContain('Hand size');
      expect(description).toContain('Shanten');
    });

    it('should include discard recommendations', () => {
      const hand = tiles('123456789m 111p 4s');
      const summary = createTestSummary(hand);
      const advice = analyzeHand(summary);
      
      const description = generateAdviceSummary(summary, advice);
      
      if (advice.action === 'discard') {
        expect(description).toContain('Recommended discard');
      }
    });

    it('should include priority and reasoning', () => {
      const hand = tiles('123456m 789p 11s 34s');
      const summary = createTestSummary(hand);
      const advice = analyzeHand(summary);
      
      const description = generateAdviceSummary(summary, advice);
      
      expect(description).toContain(`Priority: ${advice.priority}/10`);
      expect(description).toContain(advice.reasoning);
    });
  });

  describe('scoreHand', () => {
    it('should calculate basic scores', () => {
      const hand = tiles('123456789m 111p 22s');
      const winningTile = hand[hand.length - 1];
      
      const result = scoreHand(hand, winningTile, false, 'east', 'east');
      
      expect(result.score).toBeGreaterThan(0);
      expect(result.doubles).toBeGreaterThan(0);
      expect(result.details.length).toBeGreaterThan(0);
    });

    it('should award self-draw bonus', () => {
      const hand = tiles('123456789m 111p 22s');
      const winningTile = hand[hand.length - 1];
      
      const selfDrawResult = scoreHand(hand, winningTile, true, 'east', 'east');
      const normalResult = scoreHand(hand, winningTile, false, 'east', 'east');
      
      expect(selfDrawResult.doubles).toBeGreaterThan(normalResult.doubles);
      expect(selfDrawResult.score).toBeGreaterThan(normalResult.score);
    });

    it('should award wind bonuses', () => {
      const hand: Tile[] = [
        ...tiles('123456m 789p 22s'),
        ...Array(3).fill(null).map((_, i) => tile('honor', 'east', `east-${i}`)),
      ];
      // Remove some tiles to make room for winds
      const testHand = [...hand.slice(0, 11), ...hand.slice(-3)];
      const winningTile = testHand[testHand.length - 1];
      
      const result = scoreHand(testHand, winningTile, false, 'east', 'east');
      
      expect(result.details.some(d => d.includes('wind'))).toBe(true);
    });

    it('should award dragon bonuses', () => {
      const hand: Tile[] = [
        ...tiles('123456m 789p 22s'),
        ...Array(3).fill(null).map((_, i) => tile('honor', 'red', `red-${i}`)),
      ];
      // Remove some tiles to make room for dragons
      const testHand = [...hand.slice(0, 11), ...hand.slice(-3)];
      const winningTile = testHand[testHand.length - 1];
      
      const result = scoreHand(testHand, winningTile, false, 'east', 'east');
      
      expect(result.details.some(d => d.includes('Dragon'))).toBe(true);
    });

    it('should award all honors bonus', () => {
      const hand: Tile[] = [
        ...Array(3).fill(null).map((_, i) => tile('honor', 'east', `east-${i}`)),
        ...Array(3).fill(null).map((_, i) => tile('honor', 'south', `south-${i}`)),
        ...Array(3).fill(null).map((_, i) => tile('honor', 'west', `west-${i}`)),
        ...Array(3).fill(null).map((_, i) => tile('honor', 'red', `red-${i}`)),
        ...Array(2).fill(null).map((_, i) => tile('honor', 'green', `green-${i}`)),
      ];
      const winningTile = hand[hand.length - 1];
      
      const result = scoreHand(hand, winningTile, false, 'east', 'east');
      
      expect(result.details.some(d => d.includes('All honors'))).toBe(true);
    });

    it('should calculate exponential scoring', () => {
      const hand = tiles('123456789m 111p 22s');
      const winningTile = hand[hand.length - 1];
      
      const result = scoreHand(hand, winningTile, false, 'east', 'east');
      
      // Score should be 10 * 2^doubles
      const expectedScore = 10 * Math.pow(2, result.doubles);
      expect(result.score).toBe(expectedScore);
    });
  });

  describe('edge cases and error handling', () => {
    it('should handle empty call lists', () => {
      const hand = tiles('123456m 789p 147s 1m');
      const summary = createTestSummary(hand);
      
      const advice = analyzeHand(summary);
      expect(advice).toBeDefined();
    });

    it('should handle hands with duplicate tiles', () => {
      const hand: Tile[] = Array(14).fill(null).map((_, i) => 
        tile('man', 1, `copy-${i}`)
      );
      const summary = createTestSummary(hand);
      
      const advice = analyzeHand(summary);
      expect(advice).toBeDefined();
      expect(advice.action).toBe('discard');
    });

    it('should be consistent across multiple calls', () => {
      const hand = tiles('123456m 789p 147s 1m');
      const summary = createTestSummary(hand);
      
      const advice1 = analyzeHand(summary);
      const advice2 = analyzeHand(summary);
      
      expect(advice1.action).toBe(advice2.action);
      expect(advice1.priority).toBe(advice2.priority);
    });

    it('should handle minimal hands', () => {
      const hand: Tile[] = Array(13).fill(null).map((_, i) => 
        tile('honor', 'east', `east-${i}`)
      );
      const summary = createTestSummary(hand);
      
      const advice = analyzeHand(summary);
      expect(advice).toBeDefined();
    });
  });
});