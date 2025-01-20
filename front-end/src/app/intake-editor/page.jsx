
"use client"
import React, { useState, useEffect } from 'react';
import { 
  Trash2, 
  Plus, 
  GripVertical, 
  ChevronDown, 
  ChevronUp, 
  ChevronRight,
  EyeIcon, 
  Settings, 
  Save,
  User,
  Shield,
  Phone,
  Mail,
  DollarSign,
  Scale,
  FileText,
  BriefcaseIcon,
  AlertCircle
} from 'lucide-react';
import { saveFormData, getFormData } from './formHelper';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

// Icon mapping for form steps
const ICONS = {
  User,
  Shield,
  Phone,
  Mail,
  DollarSign,
  Scale,
  FileText,
  BriefcaseIcon
};

// Form Preview Component with enhanced design
const FormPreview = ({ formData }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [formValues, setFormValues] = useState({});
  const [errors, setErrors] = useState({});
  const [activeResources, setActiveResources] = useState([]);
  const [showEmergencyAlert, setShowEmergencyAlert] = useState(false);

  if (!formData?.steps?.length) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            No form steps have been created yet. Add some steps in the editor to get started.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const handleInputChange = (name, value, field) => {
    setFormValues(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when field is modified
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }

    // Handle emergency and resource checks
    if (name === 'immediateRisk' && value === 'yes') {
      setShowEmergencyAlert(true);
      setActiveResources(formData.RESOURCES?.emergency || []);
    } else if (name === 'shelterNeeded' && value === 'yes') {
      setActiveResources(prev => [...prev, ...(formData.RESOURCES?.shelters || [])]);
    }

    // Validate field if it has validation rules
    if (field.validation?.rules) {
      validateField(field, value);
    }
  };

  const validateField = (field, value) => {
    const newErrors = { ...errors };
    
    if (field.required && !value) {
      newErrors[field.name] = `${field.label} is required`;
    } else if (field.validation?.rules) {
      field.validation.rules.forEach(rule => {
        switch (rule) {
          case 'email':
            if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
              newErrors[field.name] = 'Please enter a valid email address';
            }
            break;
          case 'phoneNumber':
            if (value && !/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/.test(value)) {
              newErrors[field.name] = 'Please enter a valid phone number (XXX) XXX-XXXX';
            }
            break;
          case 'postalCode':
            if (value && !/^[A-Za-z]\d[A-Za-z] \d[A-Za-z]\d$/.test(value)) {
              newErrors[field.name] = 'Please enter a valid postal code A1A 1A1';
            }
            break;
        }
      });
    }

    setErrors(newErrors);
  };

  const validateStep = () => {
    const currentFields = formData.steps[activeStep].fields;
    const newErrors = {};
    let isValid = true;

    currentFields.forEach(field => {
      if (field.required && !formValues[field.name]) {
        newErrors[field.name] = `${field.label} is required`;
        isValid = false;
      }
      if (field.validation?.rules) {
        validateField(field, formValues[field.name]);
        if (errors[field.name]) {
          isValid = false;
        }
      }
    });

    setErrors(prev => ({ ...prev, ...newErrors }));
    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateStep()) {
      console.log('Form submitted:', formValues);
    }
  };

  const progressPercentage = ((activeStep + 1) / formData.steps.length) * 100;

  return (
    <div className="max-w-7xl mx-auto flex gap-6">
      <div className="flex-1">
        <Card className="shadow-sm">
          {/* Form Header */}
          <CardHeader className="border-b bg-white">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>{formData.metadata.clinic.name}</CardTitle>
                {formData.metadata.clinic.phone && (
                  <p className="text-sm text-gray-500 mt-1">
                    Contact: {formData.metadata.clinic.phone}
                    {formData.metadata.clinic.email && ` | ${formData.metadata.clinic.email}`}
                  </p>
                )}
              </div>
              <div className="text-sm text-gray-500">
                Step {activeStep + 1} of {formData.steps.length}
              </div>
            </div>
            
          </CardHeader>

          {/* Progress Steps */}
          <div className="border-b bg-gray-50">
            <div className="px-6 py-4">
              <div className="flex flex-wrap items-center gap-2">
                {formData.steps.map((step, index) => {
                  const Icon = ICONS[step.icon] || User;
                  const isActive = activeStep === index;
                  const isPast = activeStep > index;
                  const isFuture = activeStep < index;

                  return (
                    <div
                      key={step.id}
                      className="flex items-center"
                    >
                      <button
                        onClick={() => validateStep() && setActiveStep(index)}
                        disabled={isFuture}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm whitespace-nowrap transition-colors ${
                          isActive 
                            ? 'bg-blue-500 text-white shadow-sm' 
                            : isPast
                              ? 'bg-green-100 text-green-700'
                              : 'bg-gray-100 text-gray-500'
                        } ${isFuture ? 'opacity-50 cursor-not-allowed' : 'hover:bg-opacity-90'}`}
                      >
                        <Icon size={14} />
                        <span className="font-medium">{step.title}</span>
                      </button>
                      {index < formData.steps.length - 1 && (
                        <ChevronRight className="mx-1 text-gray-400" size={16} />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {formData.steps[activeStep].fields.map((field, index) => {
                // Check conditional display
                const shouldShow = !field.conditional || 
                  (field.conditional && formValues[field.conditional.field] === field.conditional.value);

                if (!shouldShow) return null;

                const baseFieldProps = {
                  name: field.name,
                  required: field.required,
                  onChange: (e) => handleInputChange(
                    field.name, 
                    e.target.type === 'checkbox' ? e.target.checked : e.target.value,
                    field
                  ),
                  value: formValues[field.name] || '',
                  className: `w-full px-3 py-2 border ${
                    errors[field.name] 
                      ? 'border-red-300 bg-red-50' 
                      : 'border-gray-300'
                  } rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500`
                };

                return (
                  <div key={index} className="space-y-2">
                    <label className="block font-medium text-gray-700">
                      {field.label}
                      {field.required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                    
                    {field.hint && (
                      <p className="text-sm text-gray-500">{field.hint}</p>
                    )}

                    {/* Field Type Rendering */}
                    {field.type === 'text' && (
                      <div className="relative">
                        <input 
                          type="text" 
                          {...baseFieldProps}
                          placeholder={field.placeholder}
                        />
                        {field.name === 'postalCode' && (
                          <p className="mt-1 text-xs text-gray-500">Format: A1A 1A1</p>
                        )}
                      </div>
                    )}

                    {field.type === 'textarea' && (
                      <textarea {...baseFieldProps} rows={4} />
                    )}

                    {field.type === 'number' && (
                      <div className="relative">
                        {field.name.toLowerCase().includes('income') || 
                         field.name.toLowerCase().includes('expense') || 
                         field.name.toLowerCase().includes('assets') ? (
                          <>
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                            <input 
                              type="number" 
                              {...baseFieldProps} 
                              className={`${baseFieldProps.className} pl-8`}
                              min="0"
                              step="0.01"
                            />
                          </>
                        ) : (
                          <input type="number" {...baseFieldProps} />
                        )}
                      </div>
                    )}

                    {field.type === 'email' && (
                      <input 
                        type="email" 
                        {...baseFieldProps} 
                        placeholder="email@example.com" 
                      />
                    )}

                    {field.type === 'tel' && (
                      <div>
                        <input 
                          type="tel" 
                          {...baseFieldProps} 
                          placeholder="(123) 456-7890" 
                        />
                        <p className="mt-1 text-xs text-gray-500">Format: (XXX) XXX-XXXX</p>
                      </div>
                    )}

                    {field.type === 'date' && (
                      <div>
                        <input type="date" {...baseFieldProps} />
                        {field.name === 'dateOfBirth' && formData.CONSTANTS?.AGE && (
                          <p className="mt-1 text-xs text-gray-500">
                            Age must be between {formData.CONSTANTS.AGE.MIN} and {formData.CONSTANTS.AGE.MAX} years
                          </p>
                        )}
                      </div>
                    )}

                    {field.type === 'checkbox' && (
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          {...baseFieldProps}
                          checked={formValues[field.name] || false}
                          className="h-4 w-4 rounded border-gray-300 text-blue-500 focus:ring-blue-500"
                        />
                        <span className="text-gray-700">{field.label}</span>
                      </div>
                    )}

                    {field.type === 'radio' && field.options && (
                      <div className="space-y-2">
                        {field.options.map((option, optIndex) => (
                          <div key={optIndex} className="flex items-center gap-2">
                            <input
                              type="radio"
                              name={field.name}
                              value={option.value}
                              checked={formValues[field.name] === option.value}
                              onChange={(e) => handleInputChange(field.name, e.target.value, field)}
                              className="h-4 w-4 border-gray-300 text-blue-500 focus:ring-blue-500"
                            />
                            <span className="text-gray-700">{option.label}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {field.type === 'select' && field.options && (
                      <select {...baseFieldProps}>
                        <option value="">Select {field.label}</option>
                        {field.options.map((option, optIndex) => (
                          <option key={optIndex} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    )}

                    {errors[field.name] && (
                      <p className="text-sm text-red-600">{errors[field.name]}</p>
                    )}
                  </div>
                );
              })}

              {/* Navigation Buttons */}
              <div className="flex justify-between pt-6 border-t">
                {activeStep > 0 && (
                  <button
                    type="button"
                    onClick={() => setActiveStep(prev => prev - 1)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Previous
                  </button>
                )}
                {activeStep < formData.steps.length - 1 ? (
                  <button
                    type="button"
                    onClick={() => validateStep() && setActiveStep(prev => prev + 1)}
                    className="ml-auto px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Next
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="ml-auto px-4 py-2 text-sm font-medium text-white bg-green-500 rounded-md shadow-sm hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    Submit
                  </button>
                )}
              </div>
            </form>
            </CardContent>
        </Card>
      </div>

      {/* Resources Sidebar */}
      {(showEmergencyAlert || activeResources.length > 0) && (
        <div className="w-80 shrink-0 space-y-4">
          {showEmergencyAlert && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                If you are in immediate danger, please call emergency services (911) immediately.
              </AlertDescription>
            </Alert>
          )}

          {activeResources.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Available Resources</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activeResources.map((resource, index) => (
                    <div key={index} className="p-3 bg-gray-50 rounded-lg">
                      <h3 className="font-medium">{resource.name}</h3>
                      {resource.phoneNumber && (
                        <p className="text-sm text-gray-600 mt-1">
                          Phone: {resource.phoneNumber}
                        </p>
                      )}
                      {resource.location && (
                        <p className="text-sm text-gray-600">
                          Location: {resource.location}
                        </p>
                      )}
                      {resource.notes && (
                        <p className="text-sm text-gray-600 mt-1 italic">
                          Note: {resource.notes}
                        </p>
                      )}
                      {resource.description && (
                        <p className="text-sm text-gray-600 mt-1">
                          {resource.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};

// Main Form Editor Component
const FormEditor = () => {
  const initialFormState = {
    metadata: {
      version: "1.0.0",
      clinic: {
        name: "Legal Clinic Intake Form",
        phone: "",
        email: ""
      }
    },
    steps: [
      {
        id: "step_1",
        title: "Basic Information",
        icon: "User",
        fields: []
      }
    ]
  };

  const [formData, setFormData] = useState(initialFormState);
  const [activeStep, setActiveStep] = useState(0);
  const [expandedField, setExpandedField] = useState(null);
  const [activeTab, setActiveTab] = useState('editor');
  const [saveStatus, setSaveStatus] = useState('');
  const [isInitialized, setIsInitialized] = useState(false);

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      try {
        const { success, data, error } = await getFormData();
        if (success && data) {
          setFormData(data);
        } else {
          console.error('Error loading data:', error);
          setFormData(initialFormState);
        }
      } catch (error) {
        console.error('Error loading data:', error);
        setFormData(initialFormState);
      } finally {
        setIsInitialized(true);
      }
    };
    loadData();
  }, []);

  // Auto-save functionality
  useEffect(() => {
    if (!isInitialized) return;

    const autoSave = async () => {
      if (formData) {
        try {
          setSaveStatus('Saving...');
          const { success, error } = await saveFormData(formData);
          
          if (success) {
            setSaveStatus('Saved successfully!');
          } else {
            throw new Error(error);
          }
        } catch (error) {
          console.error('Error auto-saving form data:', error);
          setSaveStatus('Error saving changes');
        } finally {
          setTimeout(() => setSaveStatus(''), 3000);
        }
      }
    };

    const timeoutId = setTimeout(autoSave, 1000);
    return () => clearTimeout(timeoutId);
  }, [formData, isInitialized]);

  const addStep = () => {
    setFormData(prev => ({
      ...prev,
      steps: [...prev.steps, {
        id: `step_${prev.steps.length + 1}`,
        title: "New Step",
        icon: "User",
        fields: []
      }]
    }));
  };

  const removeStep = (stepIndex) => {
    setFormData(prev => ({
      ...prev,
      steps: prev.steps.filter((_, index) => index !== stepIndex)
    }));
    if (activeStep >= stepIndex) {
      setActiveStep(Math.max(0, activeStep - 1));
    }
  };

  const handleStepChange = (stepIndex, field, value) => {
    setFormData(prev => {
      const newSteps = [...prev.steps];
      newSteps[stepIndex] = {
        ...newSteps[stepIndex],
        [field]: value
      };
      return { ...prev, steps: newSteps };
    });
  };

  const addField = (stepIndex) => {
    setFormData(prev => {
      const newSteps = [...prev.steps];
      newSteps[stepIndex] = {
        ...newSteps[stepIndex],
        fields: [
          ...newSteps[stepIndex].fields,
          {
            type: 'text',
            name: `field_${newSteps[stepIndex].fields.length + 1}`,
            label: 'New Field',
            required: false
          }
        ]
      };
      return { ...prev, steps: newSteps };
    });
  };

  const removeField = (stepIndex, fieldIndex) => {
    setFormData(prev => {
      const newSteps = [...prev.steps];
      newSteps[stepIndex] = {
        ...newSteps[stepIndex],
        fields: newSteps[stepIndex].fields.filter((_, i) => i !== fieldIndex)
      };
      return { ...prev, steps: newSteps };
    });
  };

  const handleFieldChange = (stepIndex, fieldIndex, field, value) => {
    setFormData(prev => {
      const newSteps = [...prev.steps];
      newSteps[stepIndex] = {
        ...newSteps[stepIndex],
        fields: newSteps[stepIndex].fields.map((f, i) => 
          i === fieldIndex ? { ...f, [field]: value } : f
        )
      };
      return { ...prev, steps: newSteps };
    });
  };

  if (!formData) {
    return <div className="p-8 text-center">Loading form data...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8 bg-white rounded-lg shadow-sm p-4">
        <div className="flex justify-between items-center">
          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab('editor')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                activeTab === 'editor' 
                  ? 'bg-blue-500 text-white shadow-sm' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Settings size={16} />
              Editor
            </button>
            <button
              onClick={() => setActiveTab('preview')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                activeTab === 'preview' 
                  ? 'bg-blue-500 text-white shadow-sm' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <EyeIcon size={16} />
              Preview
            </button>
          </div>
          <div className="flex items-center gap-4">
            {saveStatus && (
              <span className={`text-sm font-medium ${
                saveStatus.includes('Error') ? 'text-red-500' : 'text-green-500'
              }`}>
                {saveStatus}
              </span>
            )}
           
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      {activeTab === 'editor' ? (
        <div className="space-y-8">
          {/* Metadata Section */}
          <Card>
            <CardHeader>
              <CardTitle>Form Metadata</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Clinic Name</label>
                  <input
                    type="text"
                    value={formData.metadata.clinic.name}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      metadata: {
                        ...prev.metadata,
                        clinic: {
                          ...prev.metadata.clinic,
                          name: e.target.value
                        }
                      }
                    }))}
                    className="w-full p-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Phone</label>
                  <input
                    type="tel"
                    value={formData.metadata.clinic.phone}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      metadata: {
                        ...prev.metadata,
                        clinic: {
                          ...prev.metadata.clinic,
                          phone: e.target.value
                        }
                      }
                    }))}
                    className="w-full p-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <input
                    type="email"
                    value={formData.metadata.clinic.email}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      metadata: {
                        ...prev.metadata,
                        clinic: {
                          ...prev.metadata.clinic,
                          email: e.target.value
                        }
                      }
                    }))}
                    className="w-full p-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Version</label>
                  <input
                    type="text"
                    value={formData.metadata.version}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      metadata: {
                        ...prev.metadata,
                        version: e.target.value
                      }
                    }))}
                    className="w-full p-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Steps Section */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">Form Steps</h2>
              <button
                onClick={addStep}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg shadow-sm hover:bg-blue-600 transition-colors"
              >
                <Plus size={16} /> Add Step
              </button>
            </div>

            {/* Steps List */}
            <div className="grid grid-cols-1 gap-4">
              {formData.steps.map((step, stepIndex) => (
                <Card key={step.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4">
                        {ICONS[step.icon] && React.createElement(ICONS[step.icon], { 
                          size: 20,
                          className: "text-blue-500" 
                        })}
                        <input
                          type="text"
                          value={step.title}
                          onChange={(e) => handleStepChange(stepIndex, 'title', e.target.value)}
                          className="font-semibold p-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <select
                          value={step.icon}
                          onChange={(e) => handleStepChange(stepIndex, 'icon', e.target.value)}
                          className="p-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          {Object.keys(ICONS).map(icon => (
                            <option key={icon} value={icon}>{icon}</option>
                          ))}
                        </select>
                        <button
                          onClick={() => removeStep(stepIndex)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-md transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>

                    {/* Fields Section */}
                    <div className="space-y-4 pl-6 border-l-2 border-blue-100">
                      <div className="flex justify-between items-center">
                        <h3 className="text-sm font-medium text-gray-700">Fields</h3>
                        <button
                          onClick={() => addField(stepIndex)}
                          className="flex items-center gap-2 px-3 py-1 text-blue-500 hover:bg-blue-50 rounded-md transition-colors"
                        >
                          <Plus size={14} /> Add Field
                        </button>
                      </div>

                      <div className="space-y-4">
                        {step.fields.map((field, fieldIndex) => (
                          <div
                            key={fieldIndex}
                            className="bg-gray-50 rounded-lg p-4 border border-gray-200"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <GripVertical className="text-gray-400 cursor-move" size={16} />
                                <span className="font-medium">{field.label || 'Unnamed Field'}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => setExpandedField(expandedField === fieldIndex ? null : fieldIndex)}
                                  className="p-1 hover:bg-gray-200 rounded-md transition-colors"
                                >
                                  {expandedField === fieldIndex ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                </button>
                                <button
                                  onClick={() => removeField(stepIndex, fieldIndex)}
                                  className="p-1 text-red-500 hover:bg-red-50 rounded-md transition-colors"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </div>

                            {expandedField === fieldIndex && (
                              <div className="mt-4 space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <label className="block text-sm font-medium mb-1">Label</label>
                                    <input
                                      type="text"
                                      value={field.label || ''}
                                      onChange={(e) => handleFieldChange(stepIndex, fieldIndex, 'label', e.target.value)}
                                      className="w-full p-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium mb-1">Name</label>
                                    <input
                                      type="text"
                                      value={field.name || ''}
                                      onChange={(e) => handleFieldChange(stepIndex, fieldIndex, 'name', e.target.value)}
                                      className="w-full p-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                  </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <label className="block text-sm font-medium mb-1">Type</label>
                                    <select
                                      value={field.type}
                                      onChange={(e) => handleFieldChange(stepIndex, fieldIndex, 'type', e.target.value)}
                                      className="w-full p-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    >
                                      <option value="text">Text</option>
                                      <option value="textarea">Textarea</option>
                                      <option value="number">Number</option>
                                      <option value="email">Email</option>
                                      <option value="tel">Telephone</option>
                                      <option value="date">Date</option>
                                      <option value="checkbox">Checkbox</option>
                                      <option value="radio">Radio</option>
                                      <option value="select">Select</option>
                                    </select>
                                  </div>
                                  <div className="flex items-center">
                                    <label className="inline-flex items-center">
                                      <input
                                        type="checkbox"
                                        checked={field.required || false}
                                        onChange={(e) => handleFieldChange(stepIndex, fieldIndex, 'required', e.target.checked)}
                                        className="w-4 h-4 text-blue-500 border-gray-300 rounded focus:ring-blue-500"
                                      />
                                      <span className="ml-2 text-sm font-medium text-gray-700">Required</span>
                                    </label>
                                  </div>
                                </div>

                                {(field.type === 'select' || field.type === 'radio') && (
                                  <div>
                                    <label className="block text-sm font-medium mb-2">Options</label>
                                    {field.options?.map((option, optIndex) => (
                                      <div key={optIndex} className="flex gap-2 mb-2">
                                        <input
                                          type="text"
                                          value={option.label || ''}
                                          onChange={(e) => {
                                            const newOptions = [...(field.options || [])];
                                            newOptions[optIndex] = {
                                              value: e.target.value.toLowerCase().replace(/\s+/g, '-'),
                                              label: e.target.value
                                            };
                                            handleFieldChange(stepIndex, fieldIndex, 'options', newOptions);
                                          }}
                                          className="flex-1 p-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                          placeholder="Option label"
                                        />
                                        <button
                                          onClick={() => {
                                            const newOptions = field.options.filter((_, i) => i !== optIndex);
                                            handleFieldChange(stepIndex, fieldIndex, 'options', newOptions);
                                          }}
                                          className="p-2 text-red-500 hover:bg-red-50 rounded-md transition-colors"
                                        >
                                          <Trash2 size={16} />
                                        </button>
                                      </div>
                                    ))}
                                    <button
                                      onClick={() => {
                                        const newOptions = [...(field.options || []), { value: '', label: '' }];
                                        handleFieldChange(stepIndex, fieldIndex, 'options', newOptions);
                                      }}
                                      className="flex items-center gap-2 text-sm text-blue-500 hover:text-blue-600"
                                    >
                                      <Plus size={14} /> Add Option
                                    </button>
                                  </div>
                                )}

                                <div>
                                  <label className="block text-sm font-medium mb-1">Hint Text</label>
                                  <input
                                    type="text"
                                    value={field.hint || ''}
                                    onChange={(e) => handleFieldChange(stepIndex, fieldIndex, 'hint', e.target.value)}
                                    className="w-full p-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Helper text shown below the field"
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <FormPreview formData={formData} />
      )}
    </div>
  );
};

export default FormEditor;