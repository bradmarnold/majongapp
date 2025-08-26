import React, { useState, useEffect } from 'react';
import { analyzeHand, GameSummary, Tile as TileType } from '@majongapp/core';
import { Hand, GameHUD, CoachOverlay, Tile } from '@majongapp/ui';
import { useGameStore } from '../store/gameStore';

export const Play: React.FC = () => {
  const gameState = useGameStore(state => state);
  const initializeGame = useGameStore(state => state.initializeGame);
  const drawTileFromWall = useGameStore(state => state.drawTileFromWall);
  const discardTile = useGameStore(state => state.discardTile);
  const toggleAdvice = useGameStore(state => state.toggleAdvice);
  const updateAdvice = useGameStore(state => state.updateAdvice);

  const [selectedTile, setSelectedTile] = useState<TileType | null>(null);
  const [showAdvice, setShowAdvice] = useState(false);

  useEffect(() => {
    if (!gameState.isInitialized) {
      initializeGame();
    }
  }, [gameState.isInitialized, initializeGame]);

  useEffect(() => {
    // Update advice when game state changes
    if (gameState.isInitialized && gameState.phase === 'playing') {
      const summary: GameSummary = {
        hand: gameState.playerHand,
        drawnTile: gameState.drawnTile || undefined,
        availableCalls: [],
        round: gameState.round,
        playerWind: 'east',
        prevalentWind: 'east',
        dora: [],
      };
      
      try {
        const advice = analyzeHand(summary);
        updateAdvice(advice);
      } catch (error) {
        console.warn('Failed to generate advice:', error);
        updateAdvice(null);
      }
    }
  }, [gameState.playerHand, gameState.drawnTile, gameState.phase, updateAdvice]);

  const handleDrawTile = () => {
    if (gameState.phase === 'playing' && !gameState.drawnTile) {
      drawTileFromWall();
    }
  };

  const handleTileClick = (tile: TileType, index: number) => {
    if (gameState.phase === 'playing' && gameState.drawnTile) {
      setSelectedTile(tile);
    }
  };

  const handleDiscard = () => {
    if (selectedTile && gameState.phase === 'playing') {
      discardTile(selectedTile);
      setSelectedTile(null);
    }
  };

  const handleNewGame = () => {
    initializeGame();
    setSelectedTile(null);
  };

  const handleToggleAdvice = () => {
    setShowAdvice(!showAdvice);
    toggleAdvice();
  };

  if (!gameState.isInitialized) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Initializing game...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Play Mahjong</h1>
        <div className="flex space-x-4">
          <button
            onClick={handleToggleAdvice}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              gameState.adviceEnabled
                ? 'bg-green-100 text-green-800 border border-green-300'
                : 'bg-gray-100 text-gray-600 border border-gray-300'
            }`}
          >
            {gameState.adviceEnabled ? 'Advice On' : 'Advice Off'}
          </button>
          <button
            onClick={handleNewGame}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm font-medium"
          >
            New Game
          </button>
        </div>
      </div>

      {/* Game HUD */}
      <div className="mb-8">
        <GameHUD
          round={gameState.round}
          playerWind="east"
          prevalentWind="east"
          tilesRemaining={gameState.wall.length}
          scores={gameState.scores}
          currentPlayer={gameState.currentPlayer}
          gamePhase={gameState.phase}
        />
      </div>

      {/* Game Area */}
      <div className="space-y-8">
        {/* Drawn Tile */}
        {gameState.drawnTile && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Drawn Tile</h3>
            <div className="flex items-center space-x-4">
              <Tile
                tile={gameState.drawnTile}
                size="large"
                selected={selectedTile?.id === gameState.drawnTile.id}
                onClick={(tile) => setSelectedTile(tile)}
              />
              <div className="text-sm text-gray-600">
                Click to select for discard
              </div>
            </div>
          </div>
        )}

        {/* Player Hand */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <Hand
            tiles={gameState.playerHand}
            selectedTiles={selectedTile ? [selectedTile] : []}
            onTileClick={handleTileClick}
            label="Your Hand"
          />
        </div>

        {/* Game Controls */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions</h3>
          <div className="flex space-x-4">
            {!gameState.drawnTile ? (
              <button
                onClick={handleDrawTile}
                className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 font-medium"
                disabled={gameState.phase !== 'playing'}
              >
                Draw Tile
              </button>
            ) : (
              <button
                onClick={handleDiscard}
                className={`px-6 py-3 rounded-md font-medium ${
                  selectedTile
                    ? 'bg-red-600 text-white hover:bg-red-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
                disabled={!selectedTile}
              >
                Discard Selected Tile
              </button>
            )}
          </div>
          
          {selectedTile && (
            <div className="mt-4 p-4 bg-blue-50 rounded-md">
              <p className="text-sm text-blue-800">
                <span className="font-medium">Selected:</span> {selectedTile.suit}-{selectedTile.value}
              </p>
            </div>
          )}
        </div>

        {/* River (Discarded Tiles) */}
        {gameState.discardedTiles.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Discarded Tiles ({gameState.discardedTiles.length})
            </h3>
            <div className="flex flex-wrap gap-1">
              {gameState.discardedTiles.map((tile, index) => (
                <Tile
                  key={`${tile.id}-${index}`}
                  tile={tile}
                  size="small"
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Coach Overlay */}
      {gameState.adviceEnabled && (
        <CoachOverlay
          advice={gameState.currentAdvice || undefined}
          isVisible={showAdvice}
          onToggle={() => setShowAdvice(!showAdvice)}
          onDismiss={() => setShowAdvice(false)}
        />
      )}

      {/* Game Status */}
      {gameState.phase === 'ended' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Game Over</h2>
            <p className="text-gray-600 mb-6">
              The game has ended. Would you like to start a new game?
            </p>
            <div className="flex space-x-4">
              <button
                onClick={handleNewGame}
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 font-medium"
              >
                New Game
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};