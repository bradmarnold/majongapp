import { describe, it, expect } from 'vitest';
import { calculateShanten, isWinningHand } from './shanten.js';
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

describe('shanten calculation', () => {
  describe('calculateShanten', () => {
    it('should throw error for invalid hand sizes', () => {
      expect(() => calculateShanten([])).toThrow('Hand must have 13 or 14 tiles');
      expect(() => calculateShanten(tiles('123m'))).toThrow('Hand must have 13 or 14 tiles');
    });

    it('should calculate shanten for a complete winning hand', () => {
      // 123456789m + 1111p (complete hand)
      const hand = tiles('123456789m 1111p');
      const result = calculateShanten(hand);
      expect(result.shanten).toBe(-1);
      expect(result.improvements).toEqual([]);
    });

    it('should calculate shanten for tenpai hands (shanten = 0)', () => {
      // 12345678m + 111p + 11s (waiting for 9m)
      const hand = tiles('12345678m 111p 11s');
      const result = calculateShanten(hand);
      expect(result.shanten).toBe(0);
      expect(result.improvements).toContain('man-9');
    });

    it('should calculate shanten for 1-shanten hands', () => {
      // 1234567m + 111p + 123s (need to draw and discard once)
      const hand = tiles('1234567m 111p 123s');
      const result = calculateShanten(hand);
      expect(result.shanten).toBe(1);
      expect(result.improvements.length).toBeGreaterThan(0);
    });

    it('should handle honor tiles correctly', () => {
      // 123456m + honor-east honor-east honor-east + honor-red honor-red honor-red + honor-green honor-green
      const hand: Tile[] = [
        ...tiles('123456m'),
        ...Array(3).fill(null).map((_, i) => tile('honor', 'east', `east-${i}`)),
        ...Array(3).fill(null).map((_, i) => tile('honor', 'red', `red-${i}`)),
        ...Array(2).fill(null).map((_, i) => tile('honor', 'green', `green-${i}`)),
      ];
      const result = calculateShanten(hand);
      expect(result.shanten).toBe(0); // tenpai, waiting for 7m or green dragon
    });

    it('should handle mixed sequences and triplets', () => {
      // 111222333m + 456p + 78s
      const hand = tiles('111222333m 456p 78s');
      const result = calculateShanten(hand);
      expect(result.shanten).toBe(1);
    });

    it('should handle complex mixed hands', () => {
      // 1199m + 234p + 567s + honor-east honor-east (13 tiles total)
      const hand: Tile[] = [
        ...tiles('1199m 234p 567s'),
        ...Array(2).fill(null).map((_, i) => tile('honor', 'east', `east-${i}`)),
      ];
      expect(hand.length).toBe(13); // Verify we have 13 tiles
      const result = calculateShanten(hand);
      expect(result.shanten).toBe(1);
    });

    it('should identify correct improvement tiles', () => {
      // Simple case: 12345678m + 99p + 99s (13 tiles total)
      const hand = tiles('12345678m 99p 99s');
      expect(hand.length).toBe(13); // Verify we have 13 tiles
      const result = calculateShanten(hand);
      expect(result.improvements).toContain('man-9');
    });

    it('should handle all honor tiles', () => {
      // All different honors: one of each wind and dragon + extras
      const hand: Tile[] = [
        tile('honor', 'east'), tile('honor', 'east'), tile('honor', 'east'),
        tile('honor', 'south'), tile('honor', 'south'), tile('honor', 'south'),
        tile('honor', 'west'), tile('honor', 'west'), tile('honor', 'west'),
        tile('honor', 'north'), tile('honor', 'north'), tile('honor', 'north'),
        tile('honor', 'red'),
      ];
      const result = calculateShanten(hand);
      expect(result.shanten).toBe(0); // tenpai, waiting for another red dragon
    });

    it('should handle worst case shanten', () => {
      // Completely scattered hand (13 tiles)
      const hand = tiles('159m 259p 369s 137s');
      expect(hand.length).toBe(13); // Verify we have 13 tiles
      // This should be close to maximum shanten
      const result = calculateShanten(hand);
      expect(result.shanten).toBeGreaterThan(4);
    });

    it('should handle edge case with many pairs', () => {
      // 1122334455m + 667p
      const hand = tiles('1122334455m 667p');
      const result = calculateShanten(hand);
      expect(result.shanten).toBeGreaterThanOrEqual(0);
    });

    it('should handle 14-tile hands correctly', () => {
      // 123456789m + 1111p (winning hand)
      const hand = tiles('123456789m 1111p');
      const result = calculateShanten(hand);
      expect(result.shanten).toBe(-1);
    });

    it('should handle 14-tile non-winning hands', () => {
      // 123456789m + 123p + 4p
      const hand = tiles('123456789m 123p 4p');
      const result = calculateShanten(hand);
      expect(result.shanten).toBeGreaterThanOrEqual(0);
    });
  });

  describe('isWinningHand', () => {
    it('should return false for non-14-tile hands', () => {
      expect(isWinningHand(tiles('123m'))).toBe(false);
      expect(isWinningHand(tiles('12345678901234m'))).toBe(false);
    });

    it('should recognize standard winning patterns', () => {
      // 123456789m + 1111p
      expect(isWinningHand(tiles('123456789m 1111p'))).toBe(true);
      
      // 111222333m + 456p + 77s
      const hand = tiles('111222333m 456p 77s');
      expect(isWinningHand(hand)).toBe(true);
    });

    it('should recognize honor tile wins', () => {
      // 123m + 456p + 789s + honor-east*3 + honor-red*2
      const hand: Tile[] = [
        ...tiles('123m 456p 789s'),
        ...Array(3).fill(null).map((_, i) => tile('honor', 'east', `east-${i}`)),
        ...Array(2).fill(null).map((_, i) => tile('honor', 'red', `red-${i}`)),
      ];
      expect(isWinningHand(hand)).toBe(true);
    });

    it('should reject incomplete hands', () => {
      // 12345678m + 111p + 12s (not complete)
      expect(isWinningHand(tiles('12345678m 111p 12s'))).toBe(false);
      
      // 111222333m + 45p + 677s (not complete)
      expect(isWinningHand(tiles('111222333m 45p 677s'))).toBe(false);
    });

    it('should reject hands with too many pairs', () => {
      // 1122334455m + 6677p
      expect(isWinningHand(tiles('1122334455m 6677p'))).toBe(false);
    });

    it('should handle complex winning patterns', () => {
      // All triplets: 111222333m + 444p + 55s
      expect(isWinningHand(tiles('111222333m 444p 55s'))).toBe(true);
      
      // All sequences: 123456789m + 123p + 99s  
      expect(isWinningHand(tiles('123456789m 123p 99s'))).toBe(true);
    });

    it('should handle honor-only wins', () => {
      // All honors: east*3 + south*3 + west*3 + north*3 + red*2
      const hand: Tile[] = [
        ...Array(3).fill(null).map((_, i) => tile('honor', 'east', `east-${i}`)),
        ...Array(3).fill(null).map((_, i) => tile('honor', 'south', `south-${i}`)),
        ...Array(3).fill(null).map((_, i) => tile('honor', 'west', `west-${i}`)),
        ...Array(3).fill(null).map((_, i) => tile('honor', 'north', `north-${i}`)),
        ...Array(2).fill(null).map((_, i) => tile('honor', 'red', `red-${i}`)),
      ];
      expect(isWinningHand(hand)).toBe(true);
    });
  });

  describe('edge cases and error conditions', () => {
    it('should handle empty improvements list correctly', () => {
      const hand = tiles('123456789m 1111p');
      const result = calculateShanten(hand);
      expect(result.improvements).toEqual([]);
    });

    it('should handle identical tiles correctly', () => {
      // Multiple copies of same tile
      const hand: Tile[] = Array(13).fill(null).map((_, i) => 
        tile('man', 1, `copy-${i}`)
      );
      const result = calculateShanten(hand);
      expect(result.shanten).toBeGreaterThan(0);
    });

    it('should be consistent between multiple calls', () => {
      const hand = tiles('123456m 789p 147s 1m');
      const result1 = calculateShanten(hand);
      const result2 = calculateShanten(hand);
      expect(result1.shanten).toBe(result2.shanten);
      expect(result1.improvements).toEqual(result2.improvements);
    });
  });
});