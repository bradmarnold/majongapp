import React from 'react';

export const Practice: React.FC = () => {
  const drills = [
    {
      id: 'shanten',
      title: 'Shanten Calculation',
      description: 'Practice identifying how many tiles away you are from winning',
      difficulty: 'Intermediate',
      completed: false,
    },
    {
      id: 'efficiency',
      title: 'Discard Efficiency',
      description: 'Learn to choose the best tiles to discard',
      difficulty: 'Beginner',
      completed: true,
    },
    {
      id: 'defense',
      title: 'Defensive Play',
      description: 'Practice safe discarding when opponents are close to winning',
      difficulty: 'Advanced',
      completed: false,
    },
    {
      id: 'calls',
      title: 'Calling Decisions',
      description: 'When to call chi, pon, or kan from other players',
      difficulty: 'Intermediate',
      completed: false,
    },
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-800';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'Advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Practice Drills</h1>
        <p className="text-lg text-gray-600">
          Sharpen your skills with focused practice sessions. Each drill targets specific aspects of Mahjong strategy.
        </p>
      </div>

      {/* Practice Stats */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Practice Stats</h2>
        <div className="grid grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-1">1</div>
            <div className="text-sm text-gray-600">Drills Completed</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-1">85%</div>
            <div className="text-sm text-gray-600">Average Score</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600 mb-1">12</div>
            <div className="text-sm text-gray-600">Practice Sessions</div>
          </div>
        </div>
      </div>

      {/* Practice Drills */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900">Available Drills</h2>
        {drills.map((drill) => (
          <div key={drill.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">{drill.title}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(drill.difficulty)}`}>
                    {drill.difficulty}
                  </span>
                  {drill.completed && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Completed
                    </span>
                  )}
                </div>
                <p className="text-gray-600 mb-4">{drill.description}</p>
                
                {drill.completed && (
                  <div className="text-sm text-gray-500">
                    <span className="font-medium">Best score:</span> 92% • 
                    <span className="font-medium ml-2">Last practiced:</span> 2 days ago
                  </div>
                )}
              </div>
              <div className="ml-6">
                <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm font-medium">
                  {drill.completed ? 'Practice Again' : 'Start Drill'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Coming Soon */}
      <div className="mt-12 bg-gray-50 rounded-lg p-8 text-center">
        <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 11.172V5l-1-1z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">More Drills Coming Soon</h3>
        <p className="text-gray-600">
          We're working on additional practice scenarios including tile efficiency puzzles, 
          endgame situations, and advanced defensive techniques.
        </p>
      </div>
    </div>
  );
};