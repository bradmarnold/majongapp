import React from 'react';

export interface GameHUDProps {
  round: number;
  playerWind: 'east' | 'south' | 'west' | 'north';
  prevalentWind: 'east' | 'south' | 'west' | 'north';
  tilesRemaining: number;
  scores: number[];
  currentPlayer: number;
  gamePhase: 'dealing' | 'playing' | 'ended';
}

export const GameHUD: React.FC<GameHUDProps> = ({
  round,
  playerWind,
  prevalentWind,
  tilesRemaining,
  scores,
  currentPlayer,
  gamePhase,
}) => {
  const windDisplay = {
    east: '東',
    south: '南',
    west: '西',
    north: '北',
  };

  const phases = {
    dealing: 'Dealing tiles...',
    playing: 'Game in progress',
    ended: 'Game ended',
  };

  return (
    <div className="bg-white border border-gray-300 rounded-lg p-4 shadow-sm">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
        <div className="flex flex-col">
          <span className="text-gray-500 text-xs uppercase tracking-wide">Round</span>
          <span className="font-bold">{round}</span>
        </div>
        
        <div className="flex flex-col">
          <span className="text-gray-500 text-xs uppercase tracking-wide">Your Wind</span>
          <span className="font-bold text-lg">{windDisplay[playerWind]}</span>
        </div>
        
        <div className="flex flex-col">
          <span className="text-gray-500 text-xs uppercase tracking-wide">Prevalent Wind</span>
          <span className="font-bold text-lg">{windDisplay[prevalentWind]}</span>
        </div>
        
        <div className="flex flex-col">
          <span className="text-gray-500 text-xs uppercase tracking-wide">Tiles Left</span>
          <span className="font-bold">{tilesRemaining}</span>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <span className="text-gray-500 text-xs uppercase tracking-wide">Status</span>
          <span className="text-sm font-medium">{phases[gamePhase]}</span>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <span className="text-gray-500 text-xs uppercase tracking-wide block mb-2">Scores</span>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
          {scores.map((score, index) => (
            <div
              key={index}
              className={`flex flex-col p-2 rounded ${
                index === currentPlayer ? 'bg-blue-100 border border-blue-300' : 'bg-gray-50'
              }`}
            >
              <span className="text-gray-500">Player {index + 1}</span>
              <span className="font-bold">{score}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GameHUD;