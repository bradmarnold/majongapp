import React, { useState } from 'react';
import { AdviceResult } from '@majongapp/core';

export interface CoachOverlayProps {
  advice?: AdviceResult;
  isVisible: boolean;
  onToggle: () => void;
  onDismiss?: () => void;
  position?: 'bottom' | 'right' | 'top';
}

export const CoachOverlay: React.FC<CoachOverlayProps> = ({
  advice,
  isVisible,
  onToggle,
  onDismiss,
  position = 'bottom',
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getPriorityColor = (priority: number) => {
    if (priority >= 8) return 'text-red-600 bg-red-50';
    if (priority >= 6) return 'text-yellow-600 bg-yellow-50';
    return 'text-green-600 bg-green-50';
  };

  const getPriorityLabel = (priority: number) => {
    if (priority >= 8) return 'Urgent';
    if (priority >= 6) return 'Important';
    return 'Suggestion';
  };

  const positionClasses = {
    bottom: 'bottom-4 left-4 right-4',
    right: 'right-4 top-1/2 transform -translate-y-1/2 w-80',
    top: 'top-4 left-4 right-4',
  };

  if (!isVisible) {
    return (
      <button
        onClick={onToggle}
        className="fixed bottom-4 right-4 bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-full shadow-lg z-40"
        aria-label="Show coaching advice"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      </button>
    );
  }

  return (
    <div className={`fixed ${positionClasses[position]} z-50`}>
      <div className="bg-white border border-gray-300 rounded-lg shadow-lg p-4 max-w-md">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div className="flex-shrink-0">
              <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 className="font-medium text-gray-900">Coach</h3>
            {advice && (
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(advice.priority)}`}>
                {getPriorityLabel(advice.priority)}
              </span>
            )}
          </div>
          <div className="flex space-x-1">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-gray-400 hover:text-gray-600 p-1"
              aria-label={isExpanded ? "Collapse details" : "Expand details"}
            >
              <svg className={`w-4 h-4 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <button
              onClick={onDismiss || onToggle}
              className="text-gray-400 hover:text-gray-600 p-1"
              aria-label="Close coaching advice"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {advice ? (
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-700 leading-relaxed">
                {advice.reasoning}
              </p>
            </div>

            {advice.tile && (
              <div className="text-xs text-gray-500">
                <span className="font-medium">Recommended tile:</span> {advice.tile.suit}-{advice.tile.value}
              </div>
            )}

            {isExpanded && advice.alternatives.length > 0 && (
              <div className="pt-3 border-t border-gray-200">
                <h4 className="text-xs font-medium text-gray-700 mb-2">Alternatives:</h4>
                <div className="space-y-2">
                  {advice.alternatives.slice(0, 3).map((alt, index) => (
                    <div key={index} className="text-xs text-gray-600">
                      <span className="font-medium">{alt.tile.suit}-{alt.tile.value}:</span> {alt.reasoning}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center justify-between pt-2 border-t border-gray-200">
              <div className="text-xs text-gray-500">
                Priority: {advice.priority}/10
              </div>
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-xs text-blue-600 hover:text-blue-800"
              >
                {isExpanded ? 'Show less' : `${advice.alternatives.length > 0 ? 'Show alternatives' : 'Show details'}`}
              </button>
            </div>
          </div>
        ) : (
          <div className="text-sm text-gray-500">
            <p>No advice available at this time.</p>
            <p className="mt-1 text-xs">Play a tile to get coaching suggestions.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CoachOverlay;