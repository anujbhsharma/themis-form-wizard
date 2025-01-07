import React, { useState } from 'react'; 
import { AlertCircle, Check, ChevronRight, ChevronLeft, Info } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';

// Form step definitions
const STEPS = {
  PERSONAL: 0,
  CONTACT: 1,
  FINANCIAL: 2,
  LEGAL: 3,
  REVIEW: 4
};

const StepProgressBar = ({ currentStep, totalSteps }) => (
  <div className="w-full mb-8">
    <Progress value={(currentStep / (totalSteps - 1)) * 100} className="h-2" />
    <p className="text-center mt-2 text-sm text-gray-600">
      Step {currentStep + 1} of {totalSteps}
    </p>
  </div>
);

const IntakeForm = () => {
  const [currentStep, setCurrentStep] = useState(STEPS.PERSONAL);
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const validateField = (name, value) => {
    switch (name) {
      case 'fullName':
        return value && /^[A-Za-z\s]{2,}$/.test(value)
          ? ''
          : 'Please enter a valid name (letters and spaces only)';
          case 'dateOfBirth':
            if (!value) return 'Date of birth is required';
            
            const dob = new Date(value);
            const today = new Date();
            
            // Check if date is valid
            if (isNaN(dob.getTime())) {
              return 'Please enter a valid date';
            }
            
            // Check if date is in the future
            if (dob > today) {
              return 'Date of birth cannot be in the future';
            }
            
            // Calculate age
            let age = today.getFullYear() - dob.getFullYear();
            const monthDiff = today.getMonth() - dob.getMonth();
            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
              age--;
            }
            
            // Check if person is at least 18 years old
            if (age < 18) {
              return 'You must be at least 18 years old to submit this form';
            }
            
            // Check if date is too far in the past (e.g., over 120 years)
            if (age > 120) {
              return 'Please enter a valid date of birth';
            }
            
            return '';
      case 'phone':
        return value && /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/.test(value)
          ? ''
          : 'Please enter a valid phone number (XXX-XXX-XXXX)';
      
      case 'email':
        return value && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
          ? ''
          : 'Please enter a valid email address';
      
      case 'income':
        const numValue = parseFloat(value);
        return !isNaN(numValue) && numValue >= 0
          ? ''
          : 'Please enter a valid income amount';
      
      default:
        return '';
    }
  };
  

  const handleChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    const validationError = validateField(name, value);
    setErrors(prev => ({
      ...prev,
      [name]: validationError
    }));
  };

  const formatPhoneNumber = (value) => {
    if (!value) return value;
    const phoneNumber = value.replace(/[^\d]/g, '');
    if (phoneNumber.length < 4) return phoneNumber;
    if (phoneNumber.length < 7) {
      return `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(3)}`;
    }
    return `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
  };

  const validateStep = () => {
    const newErrors = {};
    const requiredFields = getRequiredFieldsForStep(currentStep);
    
    requiredFields.forEach(field => {
      if (!formData[field.name] || formData[field.name] === '') {
        newErrors[field.name] = `${field.label} is required`;
      } else {
        const validationError = validateField(field.name, formData[field.name]);
        if (validationError) {
          newErrors[field.name] = validationError;
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const getRequiredFieldsForStep = (step) => {
    switch (step) {
      case STEPS.PERSONAL:
        return [
          { name: 'fullName', label: 'Full Name', type: 'text' },
          { name: 'dateOfBirth', label: 'Date of Birth', type: 'date' },
          { name: 'gender', label: 'Gender', type: 'select', options: ['Male', 'Female', 'Other', 'Prefer not to say'] }
        ];
      case STEPS.CONTACT:
        return [
          { name: 'email', label: 'Email', type: 'email' },
          { name: 'phone', label: 'Phone Number', type: 'text' },
          { name: 'address', label: 'Address', type: 'textarea' }
        ];
      case STEPS.FINANCIAL:
        return [
          { name: 'income', label: 'Annual Income', type: 'text' },
          { name: 'employmentStatus', label: 'Employment Status', type: 'select', 
            options: ['Employed', 'Self-employed', 'Unemployed', 'Retired', 'Student'] }
        ];
      case STEPS.LEGAL:
        return [
          { name: 'legalIssueType', label: 'Type of Legal Issue', type: 'select',
            options: ['Family Law', 'Housing', 'Employment', 'Immigration', 'Other'] },
          { name: 'description', label: 'Brief Description of Your Legal Issue', type: 'textarea' }
        ];
      default:
        return [];
    }
  };

  const handleNext = () => {
    if (validateStep()) {
      if (currentStep === STEPS.LEGAL) {
        handleSubmit();
      } else {
        setCurrentStep(prev => prev + 1);
      }
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = async () => {
    if (validateStep()) {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/save/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
  
        if (!response.ok) {
          throw new Error('Failed to submit the form');
        }
  
        const data = await response.json();
        console.log('Form submitted successfully:', data);
        setSubmitted(true);
      } catch (error) {
        console.error('Error submitting form:', error);
        alert('Error submitting form. Please try again later.');
      }
    }
  };  


  const renderField = (field) => {
    const commonLabelProps = {
      className: "text-sm font-medium text-gray-700 mb-1.5"
    };

    const errorMessage = errors[field.name] && (
      <Alert variant="destructive" className="mt-2">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{errors[field.name]}</AlertDescription>
      </Alert>
    );

    switch (field.type) {
      case 'select':
        return (
          <div key={field.name} className="space-y-2">
            <Label {...commonLabelProps}>{field.label}</Label>
            <Select
              value={formData[field.name] || ''}
              onValueChange={(value) => handleChange(field.name, value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select an option" />
              </SelectTrigger>
              <SelectContent>
                {field.options.map(option => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errorMessage}
          </div>
        );

      case 'textarea':
        return (
          <div key={field.name} className="space-y-2">
            <Label {...commonLabelProps}>{field.label}</Label>
            <Textarea
              value={formData[field.name] || ''}
              onChange={(e) => handleChange(field.name, e.target.value)}
              className="min-h-[100px]"
            />
            {errorMessage}
          </div>
        );

      default:
        return (
          <div key={field.name} className="space-y-2">
            <Label {...commonLabelProps}>{field.label}</Label>
            <Input
              type={field.type}
              value={formData[field.name] || ''}
              onChange={(e) => {
                let value = e.target.value;
                if (field.name === 'phone') {
                  value = formatPhoneNumber(value);
                }
                handleChange(field.name, value);
              }}
              className={errors[field.name] ? 'border-red-500' : ''}
            />
            {errorMessage}
          </div>
        );
    }
  };

  const renderReviewStep = () => (
    <div className="space-y-6">
      {Object.entries(formData).map(([key, value]) => (
        <div key={key} className="border-b pb-4">
          <Label className="text-sm font-medium text-gray-700">{key}</Label>
          <p className="mt-1 text-gray-900">{value}</p>
        </div>
      ))}
    </div>
  );

  if (submitted) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="pt-6">
          <div className="text-center">
            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="text-green-600 w-8 h-8" />
            </div>
            <CardTitle className="text-2xl text-green-800 mb-4">
              Form Submitted Successfully
            </CardTitle>
            <CardDescription className="text-green-700">
              Thank you for submitting your intake form. Our team will review your request and contact you soon.
            </CardDescription>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl text-center text-red-800">
            Legal Clinic Intake Form
          </CardTitle>
          <CardDescription className="text-center">
            Please complete all required fields below
          </CardDescription>
        </CardHeader>

        <CardContent>
          <StepProgressBar currentStep={currentStep} totalSteps={Object.keys(STEPS).length} />

          <Alert className="mb-6 bg-red-50 border-red-200">
            <Info className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-amber-700">
              All information provided will be kept confidential and used only for the purpose of assessing your legal needs.
            </AlertDescription>
          </Alert>

          <div className="space-y-6">
            {currentStep === STEPS.REVIEW ? (
              renderReviewStep()
            ) : (
              getRequiredFieldsForStep(currentStep).map(field => renderField(field))
            )}

            <div className="flex justify-between pt-4">
              {currentStep > 0 && (
                <Button 
                  type="button" 
                  onClick={handleBack}
                  variant="outline"
                >
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
              )}
              <Button 
                type="button" 
                onClick={handleNext}
                className="ml-auto"
              >
                {currentStep === STEPS.LEGAL ? 'Submit' : 'Next'}
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default IntakeForm;