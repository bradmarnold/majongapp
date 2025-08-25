import React, { useState } from 'react';
import { TutorialOverlay, TutorialStep } from '@majongapp/ui';

export const Learn: React.FC = () => {
  const [currentLesson, setCurrentLesson] = useState<string | null>(null);
  const [tutorialStep, setTutorialStep] = useState(0);
  const [showTutorial, setShowTutorial] = useState(false);

  const lessons = [
    {
      id: 'basics',
      title: 'Mahjong Basics',
      description: 'Learn the fundamental concepts and tile types',
      duration: '10 min',
      difficulty: 'Beginner',
    },
    {
      id: 'hands',
      title: 'Building Hands',
      description: 'Understand winning combinations and hand structures',
      duration: '15 min',
      difficulty: 'Beginner',
    },
    {
      id: 'calls',
      title: 'Calling & Melding',
      description: 'Master chi, pon, and kan decisions',
      duration: '12 min',
      difficulty: 'Intermediate',
    },
    {
      id: 'strategy',
      title: 'Basic Strategy',
      description: 'Learn fundamental strategic concepts',
      duration: '20 min',
      difficulty: 'Intermediate',
    },
    {
      id: 'scoring',
      title: 'Scoring System',
      description: 'Understand how hands are scored',
      duration: '18 min',
      difficulty: 'Advanced',
    },
  ];

  const tutorialSteps: TutorialStep[] = [
    {
      id: 'welcome',
      title: 'Welcome to Mahjong Learning',
      content: 'This interactive tutorial will guide you through the fundamentals of Hong Kong Mahjong. Take your time and practice each concept.',
    },
    {
      id: 'tiles',
      title: 'Understanding Tiles',
      content: 'Mahjong uses 144 tiles divided into suits: Characters (萬), Circles (筒), Bamboo (索), and Honor tiles (winds and dragons).',
    },
    {
      id: 'objective',
      title: 'Game Objective',
      content: 'The goal is to form a complete hand with 4 melds (sets of 3) plus 1 pair, totaling 14 tiles. The first player to achieve this wins.',
    },
  ];

  const startLesson = (lessonId: string) => {
    setCurrentLesson(lessonId);
    if (lessonId === 'basics') {
      setShowTutorial(true);
    }
  };

  const handleTutorialNext = () => {
    setTutorialStep(prev => prev + 1);
  };

  const handleTutorialPrevious = () => {
    setTutorialStep(prev => Math.max(0, prev - 1));
  };

  const handleTutorialClose = () => {
    setShowTutorial(false);
    setTutorialStep(0);
  };

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
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Learn Mahjong</h1>
        <p className="text-lg text-gray-600">
          Master Hong Kong Mahjong with our structured learning path. Start with the basics and progress at your own pace.
        </p>
      </div>

      {/* Progress Overview */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Progress</h2>
        <div className="flex items-center space-x-4">
          <div className="flex-1 bg-gray-200 rounded-full h-2">
            <div className="bg-blue-600 h-2 rounded-full" style={{ width: '20%' }}></div>
          </div>
          <span className="text-sm text-gray-600">1 of 5 lessons completed</span>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">1</div>
            <div className="text-gray-600">Completed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-400">25</div>
            <div className="text-gray-600">Minutes Studied</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-400">0</div>
            <div className="text-gray-600">Achievements</div>
          </div>
        </div>
      </div>

      {/* Lessons */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900">Lessons</h2>
        {lessons.map((lesson, index) => (
          <div key={lesson.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    index === 0 ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {index + 1}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">{lesson.title}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(lesson.difficulty)}`}>
                    {lesson.difficulty}
                  </span>
                </div>
                <p className="text-gray-600 mb-3">{lesson.description}</p>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span className="flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {lesson.duration}
                  </span>
                </div>
              </div>
              <div className="ml-6">
                <button
                  onClick={() => startLesson(lesson.id)}
                  className={`px-4 py-2 rounded-md text-sm font-medium ${
                    index === 0
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                  disabled={index !== 0}
                >
                  {index === 0 ? 'Start Lesson' : 'Locked'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* How to Play Guide */}
      <div className="mt-12 bg-blue-50 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Reference: How to Play</h2>
        <div className="grid md:grid-cols-2 gap-6 text-sm">
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Basic Setup</h3>
            <ul className="space-y-1 text-gray-700">
              <li>• 4 players, each starts with 13 tiles</li>
              <li>• 144 tiles total: 3 suits + honor tiles</li>
              <li>• Players draw and discard in turns</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Winning Condition</h3>
            <ul className="space-y-1 text-gray-700">
              <li>• Form 4 melds + 1 pair (14 tiles total)</li>
              <li>• Melds: 3 identical or sequence tiles</li>
              <li>• Declare "Mahjong" when complete</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Tutorial Overlay */}
      <TutorialOverlay
        steps={tutorialSteps}
        currentStep={tutorialStep}
        isVisible={showTutorial}
        onNext={handleTutorialNext}
        onPrevious={handleTutorialPrevious}
        onSkip={handleTutorialClose}
        onClose={handleTutorialClose}
      />
    </div>
  );
};