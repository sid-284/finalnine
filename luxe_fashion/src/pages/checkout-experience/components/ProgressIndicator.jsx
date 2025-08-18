import React from 'react';
import Icon from '../../../components/AppIcon';

const ProgressIndicator = ({ currentStep, steps }) => {
  return (
    <div className="w-full mb-8">
      <div className="flex items-center justify-between relative">
        {/* Progress Line */}
        <div className="absolute top-4 left-0 right-0 h-0.5 bg-border">
          <div 
            className="h-full bg-accent transition-all duration-500 ease-out"
            style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
          />
        </div>

        {/* Steps */}
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;
          const isUpcoming = stepNumber > currentStep;

          return (
            <div key={step.id} className="flex flex-col items-center relative z-10">
              {/* Step Circle */}
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                  isCompleted
                    ? 'bg-accent text-accent-foreground'
                    : isCurrent
                    ? 'bg-accent text-accent-foreground ring-4 ring-accent/20'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {isCompleted ? (
                  <Icon name="Check" size={16} />
                ) : (
                  <span className="text-sm font-medium">{stepNumber}</span>
                )}
              </div>

              {/* Step Label */}
              <div className="mt-2 text-center">
                <p
                  className={`text-sm font-medium transition-colors duration-300 ${
                    isCompleted || isCurrent
                      ? 'text-foreground'
                      : 'text-muted-foreground'
                  }`}
                >
                  {step.title}
                </p>
                {step.subtitle && (
                  <p className="text-xs text-muted-foreground mt-1 hidden sm:block">
                    {step.subtitle}
                  </p>
                )}
              </div>

              {/* Current Step Indicator */}
              {isCurrent && (
                <div className="absolute -bottom-2 w-2 h-2 bg-accent rounded-full animate-pulse" />
              )}
            </div>
          );
        })}
      </div>

      {/* Mobile Step Info */}
      <div className="mt-6 sm:hidden">
        <div className="bg-card rounded-lg p-4 card-elevation">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-foreground">
                Step {currentStep} of {steps.length}
              </p>
              <p className="text-sm text-muted-foreground">
                {steps[currentStep - 1]?.title}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">
                {Math.round(((currentStep - 1) / (steps.length - 1)) * 100)}% Complete
              </p>
            </div>
          </div>
          
          {/* Progress Bar for Mobile */}
          <div className="mt-3 w-full bg-border rounded-full h-2">
            <div 
              className="bg-accent h-2 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressIndicator;