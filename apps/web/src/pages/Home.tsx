import React from 'react';
import { Link } from 'react-router-dom';

export const Home: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Learn Hong Kong Mahjong
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Master the art of Mahjong with our intelligent advisor and interactive tutorials
        </p>
        <div className="flex justify-center space-x-4">
          <Link
            to="/learn"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Start Learning
          </Link>
          <Link
            to="/play"
            className="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Play Now
          </Link>
        </div>
      </div>

      {/* Features */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Interactive Tutorials</h3>
          <p className="text-gray-600 text-sm">Step-by-step lessons covering all aspects of Hong Kong Mahjong</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">AI Coach</h3>
          <p className="text-gray-600 text-sm">Get real-time advice and strategic tips from our intelligent advisor</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1.5a4.5 4.5 0 110 9H9m-4-9h4.5a4.5 4.5 0 110 9H5m8-9h4.5a4.5 4.5 0 110 9H17" />
            </svg>
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Practice Mode</h3>
          <p className="text-gray-600 text-sm">Hone your skills with focused practice sessions and challenges</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Game Replay</h3>
          <p className="text-gray-600 text-sm">Review and analyze your past games to improve your strategy</p>
        </div>
      </div>

      {/* About Hong Kong Mahjong */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">About Hong Kong Mahjong</h2>
        <div className="prose text-gray-600">
          <p className="mb-4">
            Hong Kong Mahjong is a strategic tile-based game traditionally played by four players. 
            This variant focuses on forming winning combinations of tiles through careful planning, 
            calculated risks, and tactical awareness.
          </p>
          <p className="mb-4">
            Our app teaches the fundamental Hong Kong Basic rules, perfect for beginners who want 
            to learn the core mechanics without overwhelming complexity. You'll master:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Tile recognition and combinations</li>
            <li>Hand building strategies</li>
            <li>Calling and melding decisions</li>
            <li>Basic scoring systems</li>
            <li>Defensive play techniques</li>
          </ul>
          <p>
            Ready to begin your Mahjong journey? Start with our interactive tutorials!
          </p>
        </div>
      </div>
    </div>
  );
};