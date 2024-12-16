"use client"
import React, { useState, useEffect } from 'react';
import { 
  AlertCircle,
  Shield,
  User,
  Phone,
  Home,
  DollarSign,
  Scale,
  ChevronRight,
  ChevronLeft,
  Info,
  CheckCircle
} from 'lucide-react';


import { formConfig } from '../lib/formConfig';

export default function LegalClinicForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [progress, setProgress] = useState(0);
  const [visitedSteps, setVisitedSteps] = useState(new Set([0]));
  const [activeResources, setActiveResources] = useState(null);
  const [showEmergencyAlert, setShowEmergencyAlert] = useState(false);

  useEffect(() => {
    const newProgress = ((currentStep + 1) / formConfig.steps.length) * 100;
    setProgress(newProgress);
  }, [currentStep]);

  const validateField = (field, value, allData = formData) => {
    if (field.required && (!value || value === '')) {
      return {
        isValid: false,
        message: `${field.label} is required`
      };
    }

    if (field.validation?.rules) {
      for (const rule of field.validation.rules) {
        const result = rule(value, allData);
        if (!result.isValid) {
          return result;
        }
      }
    }

    return { isValid: true };
  };

  const validateStep = (stepIndex) => {
    const step = formConfig.steps[stepIndex];
    const newErrors = {};
    let isValid = true;

    for (const field of step.fields) {
      const validation = validateField(field, formData[field.name]);
      if (!validation.isValid) {
        newErrors[field.name] = validation.message;
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleFieldChange = (name, value) => {
    const newData = { ...formData, [name]: value };
    setFormData(newData);

    // Clear error when field is modified
    if (errors[name]) {
      const newErrors = { ...errors };
      delete newErrors[name];
      setErrors(newErrors);
    }

    // Check for emergency resources
    const field = formConfig.steps[currentStep].fields.find(f => f.name === name);
    if (field?.validation?.rules) {
      for (const rule of field.validation.rules) {
        const result = rule(value, newData);
        if (result.resources) {
          setActiveResources(result.resources);
        }
        if (result.terminateIfInvalid) {
          setShowEmergencyAlert(true);
        }
      }
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      setVisitedSteps(prev => new Set([...prev, nextStep]));
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(0, prev - 1));
  };

  const handleStepClick = (index) => {
    if (visitedSteps.has(index) || (index === currentStep + 1 && validateStep(currentStep))) {
      setCurrentStep(index);
      setVisitedSteps(prev => new Set([...prev, index]));
    }
  };

  const getIcon = (iconName) => {
    const icons = {
      AlertCircle,
      Shield,
      User,
      Phone,
      Home,
      DollarSign,
      Scale
    };
    const IconComponent = icons[iconName];
    return IconComponent ? <IconComponent className="h-5 w-5" /> : null;
  };

  const renderField = (field) => {
    const hasError = errors[field.name];
    const commonClasses = `
      w-full p-3 rounded-lg border transition-all
      focus:ring-2 focus:ring-blue-500 focus:border-transparent
      ${hasError ? 'border-red-500 bg-red-50' : 'border-gray-200'}
    `;

    switch (field.type) {
      case 'radio':
        return (
          <div className="space-y-3">
            {field.options.map(option => (
              <div
                key={option.value}
                onClick={() => handleFieldChange(field.name, option.value)}
                className={`
                  flex items-center p-4 rounded-lg border cursor-pointer
                  ${formData[field.name] === option.value 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:bg-gray-50'}
                `}
              >
                <div className={`
                  w-5 h-5 rounded-full border-2 mr-3 
                  flex items-center justify-center
                  ${formData[field.name] === option.value 
                    ? 'border-blue-500' 
                    : 'border-gray-400'}
                `}>
                  {formData[field.name] === option.value && (
                    <div className="w-3 h-3 rounded-full bg-blue-500" />
                  )}
                </div>
                <span>{option.label}</span>
              </div>
            ))}
          </div>
        );

      case 'checkbox':
        return (
          <div
            onClick={() => handleFieldChange(field.name, !formData[field.name])}
            className={`
              flex items-center p-4 rounded-lg border cursor-pointer
              ${formData[field.name] 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-200 hover:bg-gray-50'}
            `}
          >
            <div className={`
              w-5 h-5 rounded mr-3 border-2
              flex items-center justify-center
              ${formData[field.name] ? 'border-blue-500 bg-blue-500' : 'border-gray-400'}
            `}>
              {formData[field.name] && (
                <CheckCircle className="w-4 h-4 text-white" />
              )}
            </div>
            <span>{field.label}</span>
          </div>
        );

      case 'select':
        return (
          <select
            value={formData[field.name] || ''}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            className={commonClasses}
          >
            <option value="">Select an option</option>
            {field.options.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      case 'textarea':
        return (
          <textarea
            value={formData[field.name] || ''}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            className={`${commonClasses} min-h-[120px]`}
          />
        );

      default:
        return (
          <input
            type={field.type}
            value={formData[field.name] || ''}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            className={commonClasses}
          />
        );
    }
  };

  const currentStepConfig = formConfig.steps[currentStep];

  return (
    <div className="min-h-screen bg-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Progress indicator */}
        <div className="mb-12">
          <div className="max-w-3xl mx-auto">
            <div className="h-1 mb-8 rounded-full bg-gray-100 overflow-hidden">
              <div 
                className="h-full bg-red-500 transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex justify-between">
              {formConfig.steps.map((step, index) => (
                <div
                  key={step.id}
                  onClick={() => handleStepClick(index)}
                  className={`
                    flex flex-col items-center cursor-pointer
                    transition-all duration-200
                    ${index <= currentStep ? 'text-red-600' : 'text-gray-400'}
                  `}
                >
                  <div className={`
                    w-8 h-8 rounded-full flex items-center justify-center text-sm
                    transition-all duration-300
                    ${currentStep === index 
                      ? 'bg-red-600 text-white ring-4 ring-red-100' 
                      : visitedSteps.has(index)
                      ? 'bg-red-100 text-red-600'
                      : 'bg-gray-100 text-gray-500'}
                  `}>
                    {visitedSteps.has(index) && index !== currentStep ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      index + 1
                    )}
                  </div>
                  <span className="text-xs mt-2 font-medium">{step.title}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
  
        {/* Emergency alert */}
        {showEmergencyAlert && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-medium text-red-800">Emergency Assistance Required</h3>
              <p className="text-red-700 text-sm mt-1">
                If you are in immediate danger, please call 911 or your local emergency services.
              </p>
            </div>
          </div>
        )}
  
        <div className="grid md:grid-cols-[2fr,1fr] gap-8">
          {/* Main form */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center gap-3">
                {getIcon(currentStepConfig.icon)}
                <h2 className="text-xl font-medium text-gray-900">
                  {currentStepConfig.title}
                </h2>
              </div>
              {currentStepConfig.guidance && (
                <p className="text-gray-600 text-sm mt-2">
                  {currentStepConfig.guidance}
                </p>
              )}
            </div>
  
            <div className="p-6">
              <div className="max-h-[60vh] overflow-y-auto pr-4">
                {currentStepConfig.fields.map(field => (
                  <div key={field.name} className="mb-8">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {field.label}
                      {field.required && (
                        <span className="text-red-500 ml-1">*</span>
                      )}
                    </label>
  
                    {field.guidance && (
                      <p className="text-gray-500 text-sm mb-3 flex items-start">
                        <Info className="w-4 h-4 mr-2 mt-px flex-shrink-0" />
                        {field.guidance}
                      </p>
                    )}
  
                    {renderField(field)}
  
                    {errors[field.name] && (
                      <div className="mt-2 text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        <span>{errors[field.name]}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
  
              <div className="flex justify-between mt-8 pt-6 border-t border-gray-100">
                <button
                  onClick={handlePrevious}
                  disabled={currentStep === 0}
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 disabled:opacity-50 flex items-center gap-2"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </button>
  
                <button
                  onClick={handleNext}
                  disabled={currentStep === formConfig.steps.length - 1}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center gap-2"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
  
          {/* Side panel */}
          {(currentStepConfig.requiredDocuments || activeResources) && (
            <div className="space-y-6">
              {currentStepConfig.requiredDocuments && (
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="text-sm font-medium text-gray-900 mb-4">
                    Required Documents
                  </h3>
                  <ul className="space-y-3">
                    {currentStepConfig.requiredDocuments.map((doc, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                        <Info className="w-4 h-4 mt-0.5 text-gray-400" />
                        <span>{doc}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
  
              {activeResources && (
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="text-sm font-medium text-gray-900 mb-4">
                    Available Resources
                  </h3>
                  <div className="space-y-4">
                    {activeResources.map((resource, index) => (
                      <div key={index} className="bg-white rounded-lg p-4 border border-gray-100">
                        <h4 className="font-medium text-gray-900">{resource.name}</h4>
                        {resource.phoneNumber && (
                          <p className="text-sm text-red-600 mt-1">
                            {resource.phoneNumber}
                          </p>
                        )}
                        {resource.description && (
                          <p className="text-sm text-gray-500 mt-1">
                            {resource.description}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}