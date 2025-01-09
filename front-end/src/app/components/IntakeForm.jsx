import React, { useState, useEffect } from 'react';
import { 
  AlertCircle, Shield, User, Phone, Home, DollarSign, 
  Scale, ChevronRight, ChevronLeft, Info, Check, Send,
  FileText
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

// Resource definitions
const RESOURCES = {
  shelters: [
    {
      name: "Oak Centre",
      location: "Fredericton",
      phoneNumber: "(506) 206-0667",
      category: "shelters"
    },
    {
      name: "Saint John House",
      location: "Fredericton",
      phoneNumber: "(506) 450-1102",
      category: "shelters"
    },
    {
      name: "Women in Transition",
      location: "Fredericton",
      phoneNumber: "(506) 459-2300",
      notes: "Women Only",
      category: "shelters"
    },
    {
      name: "Grace House for Women",
      phoneNumber: "(506) 450-3001",
      notes: "Women Only",
      category: "shelters"
    },
    {
      name: "Gignoo Transition House",
      phoneNumber: "(800) 565-6878",
      notes: "First Nations Women",
      category: "shelters"
    }
  ],
  legal: [
    {
      name: "Legal Aid New Brunswick",
      phoneNumber: "(506) 444-2777",
      category: "legal"
    },
    {
      name: "Law Society of New Brunswick",
      phoneNumber: "(506) 458-8540",
      category: "legal"
    }
  ],
  emergency: [
    {
      name: "Emergency Services",
      phoneNumber: "911",
      category: "emergency",
      description: "For immediate danger"
    },
    {
      name: "Mental Health Crisis Line",
      phoneNumber: "1-800-667-5005",
      category: "emergency",
      description: "24/7 crisis support"
    }
  ]
};

// Form steps and fields configuration
const formConfig = {
  metadata: {
    version: "1.0.0",
    clinic: {
      name: "Legal Clinic Intake Form",
      phone: "(506) 452-6313",
      email: "lawclinic@unb.ca"
    }
  },
  steps: [
    {
      id: "disclaimer",
      title: "Disclaimer",
      icon: "Shield",
      fields: [
        {
          name: "disclaimer",
          label: "Disclaimer",
          type: "radio",
          required: true,
          options: [
            { value: "understand", label: "I understand" },
            { value: "not-understand", label: "I do not understand" }
          ],
          guidance: "Please be advised that the legal clinic is operated by third-year law students under the supervision of the clinic director and supervising lawyer. Our ability to accept cases depends on the availability of our students and resources within the clinic, with a limited waiting list capacity across New Brunswick. While we offer comprehensive services in Fredericton, Saint John, and Woodstock, our services in other areas are restricted to providing free advice and information. Individuals in those regions must complete this intake form to receive a call back or email response. If your matter is urgent, please contact us by telephone; however, we make no promises or guarantees of assistance, as we can only take on as many cases as our student capacity allows. Thank you for your understanding."
        }
      ]
    },
    {
      id: "personal",
      title: "Personal Information",
      icon: "User",
      fields: [
        {
          name: "fullName",
          label: "Full Name",
          type: "text",
          required: true
        },
        {
          name: "dateOfBirth",
          label: "Date of Birth",
          type: "date",
          required: true
        },
        {
          name: "cityProvince",
          label: "City/Province",
          type: "text",
          required: true
        }
      ]
    },
    {
      id: "contact",
      title: "Contact Information",
      icon: "Phone",
      fields: [
        {
          name: "phone",
          label: "Cell Phone",
          type: "tel",
          required: true
        },
        {
          name: "email",
          label: "Email Address",
          type: "email",
          required: true,
          guidance: "Please provide an accessible email address, as this will be our primary means of communication"
        }
      ]
    },
    {
      id: "financial",
      title: "Financial Information",
      icon: "DollarSign",
      fields: [
        {
          name: "monthlyIncome",
          label: "Total Income per month",
          type: "number",
          required: true,
          guidance: "Add numbers only such as 2000"
        },
        {
          name: "monthlyExpenses",
          label: "Total Expenses per month",
          type: "number",
          required: true,
          guidance: "Add numbers only such as 2000"
        }
      ]
    },
    {
      id: "legal",
      title: "Legal Information",
      icon: "Scale",
      fields: [
        {
          name: "legalIssueType",
          label: "The legal matter is related to which one of the following categories",
          type: "select",
          required: true,
          options: [
            { value: "housing", label: "Housing and Tenancy" },
            { value: "benefits", label: "Provincial and Federal benefits" },
            { value: "employment", label: "Employment Law" },
            { value: "human-rights", label: "Human Rights" },
            { value: "small-claims", label: "Small Claims" },
            { value: "notary", label: "Notary Services" },
            { value: "divorce", label: "Uncontested Divorce" },
            { value: "offences", label: "Provincial Offences (Tickets)" },
            { value: "immigration", label: "Immigration and Refugee Assistance" },
            { value: "other", label: "Other" }
          ]
        },
        {
          name: "description",
          label: "Please describe your matter in as much detail as possible",
          type: "textarea",
          required: true
        },
        {
          name: "priorLegalAssistance",
          label: "Have you previously sought legal assistance for this issue?",
          type: "radio",
          required: true,
          options: [
            { value: "yes", label: "Yes" },
            { value: "no", label: "No" }
          ]
        },
        {
          name: "priorLegalDetails",
          label: "If yes, please provide details:",
          type: "textarea",
          required: false,
          showIf: "priorLegalAssistance === 'yes'"
        },
        {
          name: "opposingParty",
          label: "Opposing Party",
          type: "textarea",
          required: true,
          guidance: "Please write down the name(s) of all the opposing party(s) in this matter, if any. For example, If you're a tenant in a housing dispute- give the landlords' name. (Last name- First Name- Middle Name- Date of Birth)"
        }
      ]
    },
    {
      id: "consent",
      title: "Consent",
      icon: "Shield",
      fields: [
        {
          name: "finalConsent",
          label: "Consent",
          type: "radio",
          required: true,
          options: [
            { value: "understand", label: "I understand" }
          ],
          guidance: "I consent to the collection and use of my information for the purpose of legal assistance and understand that this form does not create an attorney-client relationship."
        }
      ]
    }
  ]
};

export default function IntakeForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [progress, setProgress] = useState(0);
  const [visitedSteps, setVisitedSteps] = useState(new Set([0]));
  const [activeResources, setActiveResources] = useState(null);
  const [submitted, setSubmitted] = useState(false);

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

    switch (field.name) {
      case 'dateOfBirth':
        if (!value) return { isValid: false, message: 'Date of birth is required' };
        
        const dob = new Date(value);
        const today = new Date();
        let age = today.getFullYear() - dob.getFullYear();
        const monthDiff = today.getMonth() - dob.getMonth();
        
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
          age--;
        }
        
        if (age < 18) {
          return {
            isValid: false,
            message: 'You must be at least 18 years old'
          };
        }
        
        return { isValid: true };

      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return {
          isValid: emailRegex.test(value),
          message: emailRegex.test(value) ? '' : 'Please enter a valid email address'
        };

      case 'phone':
        const phoneRegex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
        return {
          isValid: phoneRegex.test(value),
          message: phoneRegex.test(value) ? '' : 'Please enter a valid phone number'
        };

      case 'monthlyIncome':
      case 'monthlyExpenses':
        const numValue = parseFloat(value);
        return {
          isValid: !isNaN(numValue) && numValue >= 0,
          message: !isNaN(numValue) && numValue >= 0 ? '' : 'Please enter a valid amount'
        };

      default:
        return { isValid: true };
    }
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

    // Find the current field
    const field = formConfig.steps[currentStep].fields.find(f => f.name === name);
    
    // Check for legal issue type to show resources
    // Resource suggestion logic
    // Resource suggestion logic
    if (name === 'legalIssueType') {
      let relevantResources = [];
      
      // Always add Legal Aid NB for all legal issues except notary services
      if (value !== 'notary') {
        relevantResources = [...RESOURCES.legal];
      }

      // Add specific resources based on issue type
      switch (value) {
        case 'housing':
          relevantResources = [...relevantResources, ...RESOURCES.shelters];
          break;
        case 'benefits':
        case 'employment':
        case 'human-rights':
          // Add crisis line for sensitive cases
          relevantResources = [...relevantResources, RESOURCES.emergency[1]];
          break;
        case 'immigration':
          // Immigration cases might need both emergency support and shelter resources
          relevantResources = [
            ...relevantResources,
            RESOURCES.emergency[1],
            ...RESOURCES.shelters
          ];
          break;
        case 'divorce':
          // Domestic cases might need shelter resources
          relevantResources = [...relevantResources, ...RESOURCES.shelters];
          break;
        case 'offences':
          // Only legal aid for provincial offences
          relevantResources = [RESOURCES.legal[0]]; // Legal Aid NB only
          break;
        case 'small-claims':
          // Law Society for small claims
          relevantResources = [RESOURCES.legal[1]]; // Law Society NB only
          break;
        case 'notary':
          // Law Society for notary services
          relevantResources = [RESOURCES.legal[1]]; // Law Society NB only
          break;
        case 'other':
          // Both legal resources for other cases
          relevantResources = [...RESOURCES.legal];
          break;
      }

      // Filter out duplicates
      const uniqueResources = relevantResources.filter((resource, index, self) =>
        index === self.findIndex((r) => r.name === resource.name)
      );

      setActiveResources(uniqueResources.length > 0 ? uniqueResources : null);
    }

    // Show shelter resources if needed
    if (name === 'shelterNeeded' && value === 'yes') {
      const currentResources = activeResources || [];
      const shelterResources = [...currentResources, ...RESOURCES.shelters];
      // Filter out duplicates
      const uniqueResources = shelterResources.filter((resource, index, self) =>
        index === self.findIndex((r) => r.name === resource.name)
      );
      setActiveResources(uniqueResources);
    }

    // Show emergency resources for immediate danger
    if (name === 'immediateRisk' && value === 'yes') {
      const currentResources = activeResources || [];
      const emergencyResources = [...RESOURCES.emergency, ...currentResources];
      // Filter out duplicates
      const uniqueResources = emergencyResources.filter((resource, index, self) =>
        index === self.findIndex((r) => r.name === resource.name)
      );
      setActiveResources(uniqueResources);
    }
    
    // Show shelter resources if needed
    if (name === 'shelterNeeded' && value === 'yes') {
      setActiveResources(RESOURCES.shelters);
    }
    
    // Show emergency resources for immediate danger
    if (name === 'immediateRisk' && value === 'yes') {
      setActiveResources(RESOURCES.emergency);
    }

    // Validate field
    if (field) {
      const validation = validateField(field, value, newData);
      if (!validation.isValid) {
        setErrors(prev => ({
          ...prev,
          [name]: validation.message
        }));
      }
    }
  };

  const validateStep = (stepIndex) => {
    const step = formConfig.steps[stepIndex];
    const newErrors = {};
    let isValid = true;

    for (const field of step.fields) {
      if (field.showIf) {
        const [dependentField, expectedValue] = field.showIf.split(' === ');
        if (formData[dependentField] !== expectedValue.replace(/['"]/g, '')) {
          continue;
        }
      }

      const validation = validateField(field, formData[field.name]);
      if (!validation.isValid) {
        newErrors[field.name] = validation.message;
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep === formConfig.steps.length - 1) {
        handleSubmit();
      } else {
        const nextStep = currentStep + 1;
        setCurrentStep(nextStep);
        setVisitedSteps(prev => new Set([...prev, nextStep]));
      }
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

  const handleSubmit = () => {
    if (validateStep(currentStep)) {
      console.log('Form submitted:', formData);
      setSubmitted(true);
    }
  };

  const renderField = (field) => {
    // Check if field should be shown based on dependencies
    if (field.showIf) {
      const [dependentField, expectedValue] = field.showIf.split(' === ');
      if (formData[dependentField] !== expectedValue.replace(/['"]/g, '')) {
        return null;
      }
    }

    const hasError = errors[field.name];

    switch (field.type) {
      case 'radio':
        return (
          <div className="space-y-3">
            <RadioGroup
              value={formData[field.name] || ''}
              onValueChange={(value) => handleFieldChange(field.name, value)}
            >
              {field.options.map(option => (
                <div
                  key={option.value}
                  className={`
                    flex items-center p-4 rounded-lg border cursor-pointer
                    ${formData[field.name] === option.value 
                      ? 'border-red-500 bg-red-50' 
                      : 'border-gray-200 hover:bg-gray-50'}
                  `}
                >
                  <RadioGroupItem value={option.value} id={`${field.name}-${option.value}`} />
                  <Label htmlFor={`${field.name}-${option.value}`} className="ml-3">
                    {option.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
            {hasError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{hasError}</AlertDescription>
              </Alert>
            )}
          </div>
        );

      case 'select':
        return (
          <Select
            value={formData[field.name] || ''}
            onValueChange={(value) => handleFieldChange(field.name, value)}
          >
            <SelectTrigger className={`w-full ${hasError ? 'border-red-500' : ''}`}>
              <SelectValue placeholder="Select an option" />
            </SelectTrigger>
            <SelectContent>
              {field.options.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
            {hasError && (
              <Alert variant="destructive" className="mt-2">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{hasError}</AlertDescription>
              </Alert>
            )}
          </Select>
        );

      case 'textarea':
        return (
          <div>
            <Textarea
              value={formData[field.name] || ''}
              onChange={(e) => handleFieldChange(field.name, e.target.value)}
              className={`min-h-[120px] ${hasError ? 'border-red-500' : ''}`}
            />
            {hasError && (
              <Alert variant="destructive" className="mt-2">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{hasError}</AlertDescription>
              </Alert>
            )}
          </div>
        );

      default:
        return (
          <div>
            <Input
              type={field.type}
              value={formData[field.name] || ''}
              onChange={(e) => handleFieldChange(field.name, e.target.value)}
              className={hasError ? 'border-red-500' : ''}
            />
            {hasError && (
              <Alert variant="destructive" className="mt-2">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{hasError}</AlertDescription>
              </Alert>
            )}
          </div>
        );
    }
  };

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

  const currentStepConfig = formConfig.steps[currentStep];

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl text-center text-red-800">
              {formConfig.metadata.clinic.name}
            </CardTitle>
            <CardDescription className="text-center">
              Phone: {formConfig.metadata.clinic.phone} • Email: {formConfig.metadata.clinic.email}
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Progress bar */}
        <div className="mb-12">
          <div className="max-w-3xl mx-auto">
            <Progress value={progress} className="h-2 mb-8" />
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
                      <Check className="w-4 h-4" />
                    ) : (
                      index + 1
                    )}
                  </div>
                  <span className="text-xs mt-2 font-medium hidden md:block">
                    {step.title}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main content grid */}
        <div className="grid md:grid-cols-[2fr,1fr] gap-8">
          {/* Main form */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                {currentStepConfig.icon && (
                  <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                    {getIcon(currentStepConfig.icon)}
                  </div>
                )}
                <div>
                  <CardTitle>{currentStepConfig.title}</CardTitle>
                  {currentStepConfig.description && (
                    <CardDescription>{currentStepConfig.description}</CardDescription>
                  )}
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <div className="space-y-6">
                {currentStepConfig.fields.map((field, index) => (
                  <div key={`${field.name}-${index}`} className="space-y-2">
                    <Label className="text-sm font-medium">
                      {field.label}
                      {field.required && <span className="text-red-500 ml-1">*</span>}
                    </Label>
                    
                    {field.guidance && (
                      <p className="text-sm text-gray-500 flex items-center gap-2 mb-2">
                        <Info className="h-4 w-4" />
                        {field.guidance}
                      </p>
                    )}

                    {renderField(field)}
                  </div>
                ))}

                <div className="flex justify-between pt-6 border-t">
                  {currentStep > 0 && (
                    <Button
                      variant="outline"
                      onClick={handlePrevious}
                    >
                      <ChevronLeft className="mr-2 h-4 w-4" />
                      Previous
                    </Button>
                  )}

                  <Button
                    onClick={handleNext}
                    className={currentStep === 0 ? 'ml-auto' : ''}
                  >
                    {currentStep === formConfig.steps.length - 1 ? (
                      <>
                        Submit
                        <Send className="ml-2 h-4 w-4" />
                      </>
                    ) : (
                      <>
                        Next
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Side panel */}
          {activeResources && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Available Resources</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activeResources.map((resource, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <h4 className="font-medium text-gray-900">{resource.name}</h4>
                    <div className="space-y-2 mt-2">
                      {resource.phoneNumber && (
                        <p className="text-sm text-red-600 flex items-center gap-2">
                          <Phone className="h-4 w-4" />
                          {resource.phoneNumber}
                        </p>
                      )}
                      {resource.location && (
                        <p className="text-sm text-gray-600 flex items-center gap-2">
                          <Home className="h-4 w-4" />
                          {resource.location}
                        </p>
                      )}
                      {resource.description && (
                        <p className="text-sm text-gray-500 flex items-start gap-2">
                          <Info className="h-4 w-4 mt-0.5" />
                          {resource.description}
                        </p>
                      )}
                      {resource.notes && (
                        <p className="text-sm text-amber-600 flex items-start gap-2 font-medium">
                          <AlertCircle className="h-4 w-4 mt-0.5" />
                          {resource.notes}
                        </p>
                      )}
                    </div>
                  </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

function getIcon(iconName) {
  const icons = {
    Shield: <Shield className="h-5 w-5" />,
    User: <User className="h-5 w-5" />,
    Phone: <Phone className="h-5 w-5" />,
    DollarSign: <DollarSign className="h-5 w-5" />,
    Scale: <Scale className="h-5 w-5" />,
  };
  return icons[iconName] || null;
}