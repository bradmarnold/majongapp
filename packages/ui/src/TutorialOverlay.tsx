import React, { useState } from 'react';

export interface TutorialStep {
  id: string;
  title: string;
  content: string;
  target?: string; // CSS selector for highlighting
  position?: 'top' | 'bottom' | 'left' | 'right';
  action?: 'click' | 'hover' | 'none';
}

export interface TutorialOverlayProps {
  steps: TutorialStep[];
  currentStep: number;
  isVisible: boolean;
  onNext: () => void;
  onPrevious: () => void;
  onSkip: () => void;
  onClose: () => void;
}

export const TutorialOverlay: React.FC<TutorialOverlayProps> = ({
  steps,
  currentStep,
  isVisible,
  onNext,
  onPrevious,
  onSkip,
  onClose,
}) => {
  const [isDismissed, setIsDismissed] = useState(false);

  if (!isVisible || isDismissed || currentStep >= steps.length) {
    return null;
  }

  const step = steps[currentStep];
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === steps.length - 1;

  const handleClose = () => {
    setIsDismissed(true);
    onClose();
  };

  const handleSkip = () => {
    setIsDismissed(true);
    onSkip();
  };

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black bg-opacity-40" />
      
      {/* Tutorial popup */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">{step.title}</h3>
                <p className="text-sm text-gray-500">
                  Step {currentStep + 1} of {steps.length}
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600"
              aria-label="Close tutorial"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Progress bar */}
          <div className="mb-4">
            <div className="bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Content */}
          <div className="mb-6">
            <p className="text-gray-700 leading-relaxed">{step.content}</p>
            
            {step.action && step.action !== 'none' && (
              <div className="mt-3 p-3 bg-blue-50 rounded-md">
                <p className="text-sm text-blue-800">
                  <span className="font-medium">Action required:</span>{' '}
                  {step.action === 'click' ? 'Click on the highlighted element' : 'Hover over the highlighted element'} to continue.
                </p>
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <div>
              {!isFirstStep && (
                <button
                  onClick={onPrevious}
                  className="text-sm text-gray-600 hover:text-gray-800 flex items-center"
                >
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Previous
                </button>
              )}
            </div>

            <div className="flex space-x-2">
              <button
                onClick={handleSkip}
                className="px-3 py-2 text-sm text-gray-600 hover:text-gray-800"
              >
                Skip Tutorial
              </button>
              
              {isLastStep ? (
                <button
                  onClick={handleClose}
                  className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
                >
                  Finish
                </button>
              ) : (
                <button
                  onClick={onNext}
                  className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 flex items-center"
                >
                  Next
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TutorialOverlay;