import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { 
  Tile, 
  createWall, 
  dealHands, 
  drawTile as drawTileFromWall,
  AdviceResult 
} from '@majongapp/core';

export interface GameState {
  // Game setup
  isInitialized: boolean;
  phase: 'dealing' | 'playing' | 'ended';
  round: number;
  currentPlayer: number;
  
  // Tiles and hands
  wall: Tile[];
  playerHand: Tile[];
  drawnTile: Tile | null;
  discardedTiles: Tile[];
  
  // Game state
  scores: number[];
  
  // Settings
  adviceEnabled: boolean;
  currentAdvice: AdviceResult | null;
  
  // Undo system
  history: GameSnapshot[];
  canUndo: boolean;
}

interface GameSnapshot {
  wall: Tile[];
  playerHand: Tile[];
  drawnTile: Tile | null;
  discardedTiles: Tile[];
  scores: number[];
  currentPlayer: number;
  phase: 'dealing' | 'playing' | 'ended';
}

interface GameActions {
  initializeGame: () => void;
  drawTileFromWall: () => void;
  discardTile: (tile: Tile) => void;
  toggleAdvice: () => void;
  updateAdvice: (advice: AdviceResult | null) => void;
  undo: () => void;
  saveSnapshot: () => void;
  reset: () => void;
}

type GameStore = GameState & GameActions;

const initialState: GameState = {
  isInitialized: false,
  phase: 'dealing',
  round: 1,
  currentPlayer: 0,
  wall: [],
  playerHand: [],
  drawnTile: null,
  discardedTiles: [],
  scores: [0, 0, 0, 0],
  adviceEnabled: true,
  currentAdvice: null,
  history: [],
  canUndo: false,
};

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      initializeGame: () => {
        try {
          const wall = createWall();
          const { hands, remaining } = dealHands(wall, 1); // Single player for now
          
          set({
            isInitialized: true,
            phase: 'playing',
            round: 1,
            currentPlayer: 0,
            wall: remaining,
            playerHand: hands[0],
            drawnTile: null,
            discardedTiles: [],
            scores: [0, 0, 0, 0],
            history: [],
            canUndo: false,
          });
        } catch (error) {
          console.error('Failed to initialize game:', error);
        }
      },

      drawTileFromWall: () => {
        const state = get();
        if (state.wall.length === 0 || state.drawnTile || state.phase !== 'playing') {
          return;
        }

        // Save snapshot before drawing
        get().saveSnapshot();

        const { tile, remaining } = drawTileFromWall(state.wall);
        
        if (tile) {
          set({
            wall: remaining,
            drawnTile: tile,
            canUndo: true,
          });
        } else {
          // No more tiles - end game
          set({
            phase: 'ended',
          });
        }
      },

      discardTile: (tileToDiscard: Tile) => {
        const state = get();
        if (!state.drawnTile || state.phase !== 'playing') {
          return;
        }

        // Save snapshot before discarding
        get().saveSnapshot();

        let newHand = [...state.playerHand];
        let discardedTile = tileToDiscard;

        // If discarding the drawn tile, just remove it
        if (tileToDiscard.id === state.drawnTile.id) {
          discardedTile = state.drawnTile;
        } else {
          // Remove the tile from hand and add drawn tile to hand
          const index = newHand.findIndex(t => t.id === tileToDiscard.id);
          if (index >= 0) {
            newHand.splice(index, 1);
            newHand.push(state.drawnTile);
          }
        }

        set({
          playerHand: newHand,
          drawnTile: null,
          discardedTiles: [...state.discardedTiles, discardedTile],
          canUndo: true,
        });
      },

      toggleAdvice: () => {
        set(state => ({
          adviceEnabled: !state.adviceEnabled,
        }));
      },

      updateAdvice: (advice: AdviceResult | null) => {
        const state = get();
        
        // If advice is enabled and we have an API URL, try to get enhanced advice
        if (advice && state.adviceEnabled && import.meta.env.VITE_ADVICE_API_URL) {
          // Try to get enhanced advice from API
          fetch(`${import.meta.env.VITE_ADVICE_API_URL}/api/advice`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              summary: `Round ${state.round}, ${state.playerHand.length} tiles in hand, ${advice.action} recommended with priority ${advice.priority}. ${advice.reasoning}`,
            }),
          })
            .then(response => response.json())
            .then(data => {
              if (data.tip) {
                // Enhance the advice with API response
                const enhancedAdvice: AdviceResult = {
                  ...advice,
                  reasoning: data.tip,
                  alternatives: advice.alternatives.slice(0, 2), // Limit alternatives when using API
                };
                
                set({
                  currentAdvice: enhancedAdvice,
                });
              } else {
                set({
                  currentAdvice: advice,
                });
              }
            })
            .catch(() => {
              // Fallback to local advice if API fails
              set({
                currentAdvice: advice,
              });
            });
        } else {
          set({
            currentAdvice: advice,
          });
        }
      },

      saveSnapshot: () => {
        const state = get();
        const snapshot: GameSnapshot = {
          wall: [...state.wall],
          playerHand: [...state.playerHand],
          drawnTile: state.drawnTile,
          discardedTiles: [...state.discardedTiles],
          scores: [...state.scores],
          currentPlayer: state.currentPlayer,
          phase: state.phase,
        };

        set({
          history: [...state.history.slice(-9), snapshot], // Keep last 10 states
        });
      },

      undo: () => {
        const state = get();
        if (state.history.length === 0 || !state.canUndo) {
          return;
        }

        const previousState = state.history[state.history.length - 1];
        const newHistory = state.history.slice(0, -1);

        set({
          wall: previousState.wall,
          playerHand: previousState.playerHand,
          drawnTile: previousState.drawnTile,
          discardedTiles: previousState.discardedTiles,
          scores: previousState.scores,
          currentPlayer: previousState.currentPlayer,
          phase: previousState.phase,
          history: newHistory,
          canUndo: newHistory.length > 0,
        });
      },

      reset: () => {
        set(initialState);
      },
    }),
    {
      name: 'mahjong-game-store',
      partialize: (state) => ({
        adviceEnabled: state.adviceEnabled,
        // Only persist settings, not game state
      }),
    }
  )
);