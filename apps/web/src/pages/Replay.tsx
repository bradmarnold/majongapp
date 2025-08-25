import React from 'react';

export const Replay: React.FC = () => {
  const gameReplays = [
    {
      id: '1',
      date: '2024-08-24',
      duration: '12 min',
      result: 'Won',
      score: 1200,
      winningHand: 'All Sequences',
    },
    {
      id: '2',
      date: '2024-08-23',
      duration: '18 min',
      result: 'Lost',
      score: 800,
      winningHand: '-',
    },
    {
      id: '3',
      date: '2024-08-22',
      duration: '15 min',
      result: 'Won',
      score: 1500,
      winningHand: 'Mixed Triplets',
    },
  ];

  const getResultColor = (result: string) => {
    return result === 'Won' ? 'text-green-600' : 'text-red-600';
  };

  const getResultBadge = (result: string) => {
    return result === 'Won' 
      ? 'bg-green-100 text-green-800' 
      : 'bg-red-100 text-red-800';
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Game Replays</h1>
        <p className="text-lg text-gray-600">
          Review your past games to analyze your decisions and improve your strategy.
        </p>
      </div>

      {/* Game Statistics */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Performance</h2>
        <div className="grid grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-1">3</div>
            <div className="text-sm text-gray-600">Games Played</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-1">67%</div>
            <div className="text-sm text-gray-600">Win Rate</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600 mb-1">1167</div>
            <div className="text-sm text-gray-600">Average Score</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-600 mb-1">15</div>
            <div className="text-sm text-gray-600">Avg. Duration (min)</div>
          </div>
        </div>
      </div>

      {/* Replay List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Game History</h2>
          <button className="text-sm text-blue-600 hover:text-blue-800">
            Export All Games
          </button>
        </div>

        {gameReplays.map((game) => (
          <div key={game.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-4 mb-3">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Game #{game.id}
                  </h3>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getResultBadge(game.result)}`}>
                    {game.result}
                  </span>
                  <span className="text-sm text-gray-500">{game.date}</span>
                </div>
                
                <div className="grid grid-cols-3 gap-6 text-sm">
                  <div>
                    <span className="text-gray-500">Duration:</span>
                    <span className="ml-2 font-medium">{game.duration}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Score:</span>
                    <span className={`ml-2 font-medium ${getResultColor(game.result)}`}>
                      {game.score}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">Winning Hand:</span>
                    <span className="ml-2 font-medium">{game.winningHand}</span>
                  </div>
                </div>
              </div>
              
              <div className="ml-6 flex space-x-2">
                <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm font-medium">
                  View Replay
                </button>
                <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 text-sm font-medium">
                  Analyze
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Analysis Tools */}
      <div className="mt-12 bg-blue-50 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Analysis Tools</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-2">Mistake Detection</h3>
            <p className="text-sm text-gray-600 mb-3">
              AI-powered analysis identifies suboptimal moves and suggests improvements.
            </p>
            <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
              Learn More →
            </button>
          </div>
          
          <div className="bg-white rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-2">Hand Efficiency</h3>
            <p className="text-sm text-gray-600 mb-3">
              Track your tile efficiency and learn optimal discard patterns.
            </p>
            <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
              View Metrics →
            </button>
          </div>
          
          <div className="bg-white rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-2">Strategy Insights</h3>
            <p className="text-sm text-gray-600 mb-3">
              Compare your play style with advanced strategies and techniques.
            </p>
            <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
              Get Insights →
            </button>
          </div>
        </div>
      </div>

      {/* Coming Soon */}
      {gameReplays.length === 0 && (
        <div className="bg-gray-50 rounded-lg p-12 text-center">
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Games Yet</h3>
          <p className="text-gray-600 mb-4">
            Play some games to see your replays and analysis here.
          </p>
          <a
            href="/play"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Start Playing
          </a>
        </div>
      )}
    </div>
  );
};