import React from 'react';
import { Check } from 'lucide-react';

interface ProgressStepperProps {
  steps: string[];
  currentStep: number;
}

export const ProgressStepper: React.FC<ProgressStepperProps> = ({ steps, currentStep }) => {
  return (
    <div className="flex items-center w-full mb-8 overflow-x-auto pb-2">
      {steps.map((label, idx) => {
        const completed = idx < currentStep;
        const active = idx === currentStep;
        return (
          <React.Fragment key={idx}>
            <div className="flex flex-col items-center flex-shrink-0">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm border-2 transition-all ${
                  completed
                    ? 'bg-green-600 border-green-600 text-white'
                    : active
                    ? 'bg-white border-green-600 text-green-700'
                    : 'bg-gray-100 border-gray-300 text-gray-400'
                }`}
              >
                {completed ? <Check size={18} /> : idx + 1}
              </div>
              <span
                className={`text-xs mt-1 text-center max-w-16 leading-tight ${
                  active ? 'text-green-700 font-semibold' : completed ? 'text-green-600' : 'text-gray-400'
                }`}
              >
                {label}
              </span>
            </div>
            {idx < steps.length - 1 && (
              <div
                className={`flex-1 h-0.5 mx-1 min-w-4 ${idx < currentStep ? 'bg-green-500' : 'bg-gray-200'}`}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};
