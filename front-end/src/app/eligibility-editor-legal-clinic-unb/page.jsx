"use client"
import React, { useState, useEffect } from 'react';
import { 
  Trash2, 
  Plus, 
  GripVertical, 
  ChevronDown, 
  ChevronUp, 
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
  AlertCircle,
  RefreshCcw,
  CheckCircle
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
const ICONS = {
  User,
  Shield,
  Phone,
  Mail,
  DollarSign,
  Scale,
  FileText,
  BriefcaseIcon,
  AlertCircle
};

const initialState = {
  CONSTANTS: {
    INCOME: {
      MIN_ANNUAL: 0,
      MAX_ANNUAL: 42000,
      PER_DEPENDENT: 5000
    },
    AGE: {
      MIN: 18,
      MAX: 85
    },
    HOUSEHOLD: {
      MAX_DEPENDENTS: 10,
      MIN_SIZE: 1,
      MAX_SIZE: 6
    }
  },
  MONTHLY_THRESHOLDS: {
    "1": { income: 1900, assets: 5000 },
    "2": { income: 2800, assets: 9000 },
    "3": { income: 2900, assets: 10000 },
    "4": { income: 3100, assets: 11000 },
    "5": { income: 3300, assets: 12000 },
    "6": { income: 3500, assets: 13000 }
  },
  RESOURCES: {
    shelters: [],
    legal: [],
    emergency: []
  },
  formConfig: {
    metadata: {
      version: "1.0.0",
      lastUpdated: new Date().toISOString(),
      clinic: {
        name: "Legal Clinic Intake Form",
        phone: "",
        email: "",
        address: ""
      }
    },
    steps: [{
      id: "step_1",
      title: "Basic Information",
      icon: "User",
      fields: []
    }]
  }
};
const SortableField = ({ field, stepIndex, fieldIndex, children }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ 
    id: `${stepIndex}-${fieldIndex}`,
    data: {
      type: 'field',
      stepIndex,
      fieldIndex,
      field
    }
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <div className={`bg-gray-50 rounded-lg p-4 ${isDragging ? 'border-2 border-blue-500 shadow-lg' : 'border border-gray-200'}`}>
        <div className="flex items-center justify-between cursor-move" {...listeners}>
          {children}
        </div>
      </div>
    </div>
  );
};
const FormPreview = ({ formData }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [formValues, setFormValues] = useState({});
  const [errors, setErrors] = useState({});
  const [showEmergencyAlert, setShowEmergencyAlert] = useState(false);
  const [activeResources, setActiveResources] = useState([]);

  if (!formData?.formConfig?.steps?.length) {
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

  const handleInputChange = (name, value) => {
    setFormValues(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when field is modified
    if (errors[name]) {
      const newErrors = { ...errors };
      delete newErrors[name];
      setErrors(newErrors);
    }

    // Handle emergency situations and resources
    if (name === 'immediateRisk' && value === 'yes') {
      setShowEmergencyAlert(true);
      setActiveResources(formData.RESOURCES.emergency || []);
    } else if (name === 'shelterNeeded' && value === 'yes') {
      setActiveResources(prev => [...prev, ...(formData.RESOURCES.shelters || [])]);
    } else if (name === 'legalIssueType') {
      setActiveResources(formData.RESOURCES.legal || []);
    }
  };

  const validateStep = () => {
    const currentStepFields = formData.formConfig.steps[activeStep].fields;
    const newErrors = {};
    let isValid = true;

    currentStepFields.forEach(field => {
      if (field.required && !formValues[field.name]) {
        newErrors[field.name] = `${field.label} is required`;
        isValid = false;
      }

      if (field.validation?.rules) {
        field.validation.rules.forEach(rule => {
          switch (rule) {
            case 'email':
              if (formValues[field.name] && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formValues[field.name])) {
                newErrors[field.name] = 'Please enter a valid email address';
                isValid = false;
              }
              break;
            case 'phoneNumber':
              if (formValues[field.name] && !/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/.test(formValues[field.name])) {
                newErrors[field.name] = 'Please enter a valid phone number in format: (XXX) XXX-XXXX';
                isValid = false;
              }
              break;
            case 'postalCode':
              if (formValues[field.name] && !/^[A-Za-z]\d[A-Za-z] \d[A-Za-z]\d$/.test(formValues[field.name])) {
                newErrors[field.name] = 'Please enter a valid postal code in format: A1A 1A1';
                isValid = false;
              }
              break;
            case 'dateOfBirth':
              if (formValues[field.name]) {
                const birthDate = new Date(formValues[field.name]);
                const today = new Date();
                let age = today.getFullYear() - birthDate.getFullYear();
                const monthDiff = today.getMonth() - birthDate.getMonth();
                
                if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                  age--;
                }

                if (age < formData.CONSTANTS.AGE.MIN || age > formData.CONSTANTS.AGE.MAX) {
                  newErrors[field.name] = `Age must be between ${formData.CONSTANTS.AGE.MIN} and ${formData.CONSTANTS.AGE.MAX} years`;
                  isValid = false;
                }
              }
              break;
          }
        });
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleNext = () => {
    if (validateStep()) {
      setActiveStep(prev => Math.min(prev + 1, formData.formConfig.steps.length - 1));
    }
  };

  const handlePrevious = () => {
    setActiveStep(prev => Math.max(0, prev - 1));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateStep()) {
      console.log('Form submitted:', formValues);
      // Add your form submission logic here
    }
  };

  const renderField = (field, index) => {
    const fieldProps = {
      id: field.name,
      name: field.name,
      value: formValues[field.name] || '',
      onChange: (e) => handleInputChange(field.name, e.target.type === 'checkbox' ? e.target.checked : e.target.value),
      className: `w-full p-2 border rounded-md ${
        errors[field.name] ? 'border-red-500' : 'border-gray-300'
      }`
    };

    const renderFieldInput = () => {
      switch (field.type) {
        case 'tel':
          return (
            <div>
              <input
                type="tel"
                {...fieldProps}
                placeholder="(123) 456-7890"
              />
              <p className="text-xs text-gray-500 mt-1">Format: (XXX) XXX-XXXX</p>
            </div>
          );

        case 'date':
          return (
            <div>
              <input
                type="date"
                {...fieldProps}
              />
              {field.name === 'dateOfBirth' && (
                <p className="text-xs text-gray-500 mt-1">
                  Age must be between {formData.CONSTANTS.AGE.MIN} and {formData.CONSTANTS.AGE.MAX} years
                </p>
              )}
            </div>
          );

        case 'email':
          return (
            <input
              type="email"
              {...fieldProps}
              placeholder="example@email.com"
            />
          );

        case 'number':
          if (field.name.toLowerCase().includes('income') || 
              field.name.toLowerCase().includes('expense') || 
              field.name.toLowerCase().includes('assets')) {
            return (
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                <input
                  type="number"
                  {...fieldProps}
                  className={`${fieldProps.className} pl-8`}
                  min="0"
                  step="0.01"
                />
              </div>
            );
          }
          return <input type="number" {...fieldProps} />;

        case 'textarea':
          return <textarea {...fieldProps} rows={4} />;

        case 'select':
          return (
            <select {...fieldProps}>
              <option value="">Select {field.label}</option>
              {field.options?.map((option, i) => (
                <option key={i} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          );

        case 'radio':
          return (
            <div className="space-y-2">
              {field.options?.map((option, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input
                    type="radio"
                    id={`${field.name}-${option.value}`}
                    name={field.name}
                    value={option.value}
                    checked={formValues[field.name] === option.value}
                    onChange={(e) => handleInputChange(field.name, e.target.value)}
                    className="w-4 h-4 text-blue-600"
                  />
                  <label htmlFor={`${field.name}-${option.value}`} className="text-sm">
                    {option.label}
                  </label>
                </div>
              ))}
            </div>
          );

        case 'checkbox':
          return (
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                {...fieldProps}
                checked={formValues[field.name] || false}
                className="w-4 h-4 rounded border-gray-300 text-blue-600"
              />
              <label htmlFor={field.name} className="text-sm">
                {field.label}
              </label>
            </div>
          );

        default:
          if (field.name === 'postalCode') {
            return (
              <div>
                <input
                  type="text"
                  {...fieldProps}
                  placeholder="A1A 1A1"
                />
                <p className="text-xs text-gray-500 mt-1">Format: A1A 1A1</p>
              </div>
            );
          }
          return <input type="text" {...fieldProps} />;
      }
    };

    return (
      <div key={index} className="space-y-2">
        {field.type !== 'checkbox' && (
          <label className="block text-sm font-medium text-gray-700">
            {field.label}
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        {field.guidance && (
          <p className="text-sm text-gray-500 mb-2">{field.guidance}</p>
        )}

        {renderFieldInput()}

        {errors[field.name] && (
          <p className="text-sm text-red-500">{errors[field.name]}</p>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto flex gap-6">
      {/* Main Form Content */}
      <div className="flex-1 bg-white rounded-lg shadow-sm overflow-hidden">
        {/* Form Header */}
        <div className="border-b p-6">
          <h2 className="text-xl font-semibold text-gray-900">
            {formData.formConfig.metadata.clinic.name}
          </h2>
          {formData.formConfig.metadata.clinic.phone && (
            <p className="text-sm text-gray-500 mt-1">
              Contact: {formData.formConfig.metadata.clinic.phone}
              {formData.formConfig.metadata.clinic.email && 
                ` | ${formData.formConfig.metadata.clinic.email}`}
            </p>
          )}
        </div>

        {/* Progress Steps */}
        <div className="border-b bg-gray-50">
          <div className="px-6 py-4">
            <div className="flex flex-wrap gap-2">
              {formData.formConfig.steps.map((step, index) => {
                const Icon = ICONS[step.icon] || User;
                const isActive = activeStep === index;
                const isPast = activeStep > index;

                return (
                  <button
                    key={step.id}
                    onClick={() => validateStep() && setActiveStep(index)}
                    disabled={!isPast && !isActive}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm whitespace-nowrap transition-colors ${
                      isActive 
                        ? 'bg-blue-500 text-white' 
                        : isPast
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    <Icon size={14} />
                    <span className="font-medium">{step.title}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-6 max-w-2xl">
            {formData.formConfig.steps[activeStep].fields.map((field, index) => 
              renderField(field, index)
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t">
            {activeStep > 0 && (
              <button
                type="button"
                onClick={handlePrevious}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Previous
              </button>
            )}
            {activeStep < formData.formConfig.steps.length - 1 ? (
              <button
                type="button"
                onClick={handleNext}
                className="ml-auto px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600"
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                className="ml-auto px-4 py-2 text-sm font-medium text-white bg-green-500 rounded-md hover:bg-green-600"
              >
                Submit
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Resources Sidebar */}
      {(showEmergencyAlert || activeResources.length > 0) && (
        <div className="w-80 shrink-0">
          {showEmergencyAlert && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                If you are in immediate danger, please call emergency services (911) immediately.
              </AlertDescription>
            </Alert>
          )}

          {activeResources.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Available Resources</CardTitle>
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
                        <p className="text-sm text-gray-600 mt-1">
                          {resource.notes}
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




// Constants Editor Component
const ConstantsEditor = ({ constants, onChange }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Constants Configuration</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Income Settings */}
          <div className="space-y-4">
            <h3 className="font-semibold">Income Settings</h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm mb-1">Min Annual</label>
                <input
                  type="number"
                  value={constants.INCOME.MIN_ANNUAL}
                  onChange={(e) => {
                    onChange({
                      ...constants,
                      INCOME: {
                        ...constants.INCOME,
                        MIN_ANNUAL: parseInt(e.target.value)
                      }
                    });
                  }}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Max Annual</label>
                <input
                  type="number"
                  value={constants.INCOME.MAX_ANNUAL}
                  onChange={(e) => {
                    onChange({
                      ...constants,
                      INCOME: {
                        ...constants.INCOME,
                        MAX_ANNUAL: parseInt(e.target.value)
                      }
                    });
                  }}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Per Dependent</label>
                <input
                  type="number"
                  value={constants.INCOME.PER_DEPENDENT}
                  onChange={(e) => {
                    onChange({
                      ...constants,
                      INCOME: {
                        ...constants.INCOME,
                        PER_DEPENDENT: parseInt(e.target.value)
                      }
                    });
                  }}
                  className="w-full p-2 border rounded"
                />
              </div>
            </div>
          </div>

          {/* Age Settings */}
          <div className="space-y-4">
            <h3 className="font-semibold">Age Settings</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm mb-1">Min Age</label>
                <input
                  type="number"
                  value={constants.AGE.MIN}
                  onChange={(e) => {
                    onChange({
                      ...constants,
                      AGE: {
                        ...constants.AGE,
                        MIN: parseInt(e.target.value)
                      }
                    });
                  }}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Max Age</label>
                <input
                  type="number"
                  value={constants.AGE.MAX}
                  onChange={(e) => {
                    onChange({
                      ...constants,
                      AGE: {
                        ...constants.AGE,
                        MAX: parseInt(e.target.value)
                      }
                    });
                  }}
                  className="w-full p-2 border rounded"
                />
              </div>
            </div>
          </div>

          {/* Household Settings */}
          <div className="space-y-4">
            <h3 className="font-semibold">Household Settings</h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm mb-1">Max Dependents</label>
                <input
                  type="number"
                  value={constants.HOUSEHOLD.MAX_DEPENDENTS}
                  onChange={(e) => {
                    onChange({
                      ...constants,
                      HOUSEHOLD: {
                        ...constants.HOUSEHOLD,
                        MAX_DEPENDENTS: parseInt(e.target.value)
                      }
                    });
                  }}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Min Size</label>
                <input
                  type="number"
                  value={constants.HOUSEHOLD.MIN_SIZE}
                  onChange={(e) => {
                    onChange({
                      ...constants,
                      HOUSEHOLD: {
                        ...constants.HOUSEHOLD,
                        MIN_SIZE: parseInt(e.target.value)
                      }
                    });
                  }}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Max Size</label>
                <input
                  type="number"
                  value={constants.HOUSEHOLD.MAX_SIZE}
                  onChange={(e) => {
                    onChange({
                      ...constants,
                      HOUSEHOLD: {
                        ...constants.HOUSEHOLD,
                        MAX_SIZE: parseInt(e.target.value)
                      }
                    });
                  }}
                  className="w-full p-2 border rounded"
                />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Thresholds Editor Component
const ThresholdsEditor = ({ thresholds, onChange }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Thresholds</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {Object.keys(thresholds).map((size) => (
            <div key={size} className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium mb-3">Household Size: {size}</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-1">Income Threshold</label>
                  <input
                    type="number"
                    value={thresholds[size].income}
                    onChange={(e) => {
                      const newThresholds = { ...thresholds };
                      newThresholds[size] = {
                        ...newThresholds[size],
                        income: parseInt(e.target.value)
                      };
                      onChange(newThresholds);
                    }}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">Assets Threshold</label>
                  <input
                    type="number"
                    value={thresholds[size].assets}
                    onChange={(e) => {
                      const newThresholds = { ...thresholds };
                      newThresholds[size] = {
                        ...newThresholds[size],
                        assets: parseInt(e.target.value)
                      };
                      onChange(newThresholds);
                    }}
                    className="w-full p-2 border rounded"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

// Resources Editor Component
const ResourcesEditor = ({ resources, onChange }) => {
  const addResource = (category) => {
    const newResources = { ...resources };
    newResources[category] = [
      ...(newResources[category] || []),
      {
        name: "",
        phoneNumber: "",
        category,
        location: "",
        notes: ""
      }
    ];
    onChange(newResources);
  };

  const updateResource = (category, index, field, value) => {
    const newResources = { ...resources };
    newResources[category] = newResources[category].map((resource, i) => 
      i === index ? { ...resource, [field]: value } : resource
    );
    onChange(newResources);
  };

  const removeResource = (category, index) => {
    const newResources = { ...resources };
    newResources[category] = newResources[category].filter((_, i) => i !== index);
    onChange(newResources);
  };

  const ResourceCategory = ({ category, title }) => (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-medium">{title}</h3>
        <button
          onClick={() => addResource(category)}
          className="flex items-center gap-2 text-blue-500 hover:bg-blue-50 px-3 py-1 rounded"
        >
          <Plus size={16} /> Add Resource
        </button>
      </div>
      <div className="space-y-4">
        {resources[category]?.map((resource, index) => (
          <div key={index} className="p-4 bg-gray-50 rounded-lg">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm mb-1">Name</label>
                <input
                  type="text"
                  value={resource.name}
                  onChange={(e) => updateResource(category, index, 'name', e.target.value)}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Phone Number</label>
                <input
                  type="text"
                  value={resource.phoneNumber}
                  onChange={(e) => updateResource(category, index, 'phoneNumber', e.target.value)}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Location</label>
                <input
                  type="text"
                  value={resource.location}
                  onChange={(e) => updateResource(category, index, 'location', e.target.value)}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Notes</label>
                <input
                  type="text"
                  value={resource.notes}
                  onChange={(e) => updateResource(category, index, 'notes', e.target.value)}
                  className="w-full p-2 border rounded"
                />
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => removeResource(category, index)}
                className="flex items-center gap-2 text-red-500 hover:bg-red-50 px-3 py-1 rounded"
              >
                <Trash2 size={16} /> Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Resources</CardTitle>
      </CardHeader>
      <CardContent>
        <ResourceCategory category="emergency" title="Emergency Resources" />
        <ResourceCategory category="shelters" title="Shelter Resources" />
        <ResourceCategory category="legal" title="Legal Resources" />
      </CardContent>
    </Card>
  );
};

// Form Steps Editor Component
const FormStepsEditor = ({ formConfig, onChange }) => {
  const [expandedField, setExpandedField] = useState(null);
  const [activeId, setActiveId] = useState(null);
  const [draggedField, setDraggedField] = useState(null);

  // Configure DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event) => {
    const { active } = event;
    setActiveId(active.id);
    if (active.data?.current?.type === 'field') {
      setDraggedField(active.data.current.field);
    }
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    
    if (!over || active.id === over.id) {
      setActiveId(null);
      setDraggedField(null);
      return;
    }

    // Get the step and field indices from the IDs
    const [activeStepIndex, activeFieldIndex] = active.id.split('-').map(Number);
    const [overStepIndex, overFieldIndex] = over.id.split('-').map(Number);

    // Create a new formConfig with the updated field order
    const newFormConfig = { ...formConfig };
    const newSteps = [...formConfig.steps];

    if (activeStepIndex === overStepIndex) {
      // Reordering within the same step
      const step = { ...newSteps[activeStepIndex] };
      const fields = [...step.fields];
      const [movedField] = fields.splice(activeFieldIndex, 1);
      fields.splice(overFieldIndex, 0, movedField);
      step.fields = fields;
      newSteps[activeStepIndex] = step;
    } else {
      // Moving field between steps
      const sourceStep = { ...newSteps[activeStepIndex] };
      const targetStep = { ...newSteps[overStepIndex] };
      const [movedField] = sourceStep.fields.splice(activeFieldIndex, 1);
      targetStep.fields.splice(overFieldIndex, 0, movedField);
      newSteps[activeStepIndex] = sourceStep;
      newSteps[overStepIndex] = targetStep;
    }

    newFormConfig.steps = newSteps;
    onChange(newFormConfig);
    
    setActiveId(null);
    setDraggedField(null);
  };

  const addField = (stepIndex) => {
    const newFormConfig = { ...formConfig };
    const newSteps = [...formConfig.steps];
    const step = { ...newSteps[stepIndex] };
    
    step.fields = [
      ...step.fields,
      {
        name: `field_${step.fields.length + 1}`,
        label: 'New Field',
        type: 'text',
        required: false
      }
    ];
    
    newSteps[stepIndex] = step;
    newFormConfig.steps = newSteps;
    onChange(newFormConfig);
  };

  const removeField = (stepIndex, fieldIndex) => {
    const newFormConfig = { ...formConfig };
    const newSteps = [...formConfig.steps];
    const step = { ...newSteps[stepIndex] };
    
    step.fields = step.fields.filter((_, index) => index !== fieldIndex);
    newSteps[stepIndex] = step;
    newFormConfig.steps = newSteps;
    onChange(newFormConfig);
  };

  return (
    <div className="space-y-6">
      {formConfig.steps.map((step, stepIndex) => (
        <Card key={step.id}>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>{step.title}</CardTitle>
              <button
                onClick={() => addField(stepIndex)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                <Plus size={16} /> Add Field
              </button>
            </div>
          </CardHeader>
          <CardContent>
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={step.fields.map((_, fieldIndex) => `${stepIndex}-${fieldIndex}`)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-4">
                  {step.fields.map((field, fieldIndex) => (
                    <SortableField
                      key={`${stepIndex}-${fieldIndex}`}
                      field={field}
                      stepIndex={stepIndex}
                      fieldIndex={fieldIndex}
                    >
                      <div className="w-full">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <GripVertical className="text-gray-400" size={16} />
                            <span className="font-medium">{field.label || 'Unnamed Field'}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setExpandedField(expandedField === `${stepIndex}-${fieldIndex}` ? null : `${stepIndex}-${fieldIndex}`)}
                              className="p-1 hover:bg-gray-200 rounded"
                            >
                              {expandedField === `${stepIndex}-${fieldIndex}` ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                            </button>
                            <button
                              onClick={() => removeField(stepIndex, fieldIndex)}
                              className="p-1 text-red-500 hover:bg-red-50 rounded"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>

                        {expandedField === `${stepIndex}-${fieldIndex}` && (
                          <div className="mt-4 space-y-4">
                            {/* Field editing form here */}
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-medium mb-1">Label</label>
                                <input
                                  type="text"
                                  value={field.label || ''}
                                  onChange={(e) => {
                                    const newConfig = { ...formConfig };
                                    newConfig.steps[stepIndex].fields[fieldIndex].label = e.target.value;
                                    onChange(newConfig);
                                  }}
                                  className="w-full p-2 border rounded"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium mb-1">Type</label>
                                <select
                                  value={field.type}
                                  onChange={(e) => {
                                    const newConfig = { ...formConfig };
                                    newConfig.steps[stepIndex].fields[fieldIndex].type = e.target.value;
                                    onChange(newConfig);
                                  }}
                                  className="w-full p-2 border rounded"
                                >
                                  <option value="text">Text</option>
                                  <option value="number">Number</option>
                                  <option value="email">Email</option>
                                  <option value="tel">Telephone</option>
                                  <option value="select">Select</option>
                                </select>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </SortableField>
                  ))}
                </div>
              </SortableContext>

              <DragOverlay>
                {activeId && draggedField && (
                  <div className="bg-white rounded-lg p-4 border-2 border-blue-500 shadow-lg opacity-50">
                    <div className="flex items-center gap-2">
                      <GripVertical className="text-gray-400" size={16} />
                      <span className="font-medium">{draggedField.label || 'Unnamed Field'}</span>
                    </div>
                  </div>
                )}
              </DragOverlay>
            </DndContext>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

// Main Form Editor Component
const FormEditor = () => {
  const [formData, setFormData] = useState(initialState);
  const [activeTab, setActiveTab] = useState('editor');
  const [activeSection, setActiveSection] = useState('form');
  const [saveStatus, setSaveStatus] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        setLoadError(null);
        
        // Try to fetch data from API
        const response = await fetch('/api/eligibility');
        
        if (!response.ok) {
          // If API fails, use initial state
          console.warn('Failed to load form data, using initial state');
          setFormData(initialState);
          return;
        }

        const data = await response.json();
        setFormData(data);
      } catch (error) {
        console.error('Error loading form data:', error);
        setLoadError('Failed to load form data');
        // Fallback to initial state if API fails
        setFormData(initialState);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto p-6 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading form configuration...</p>
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {loadError}. Using default configuration.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const handleSave = async () => {
    setSaveStatus('Saving...');
    const { success } = await saveFormData(formData);
    setSaveStatus(success ? 'Saved successfully!' : 'Error saving');
    setTimeout(() => setSaveStatus(''), 3000);
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8 bg-white rounded-lg shadow-sm p-4">
        <div className="flex justify-between items-center">
          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab('editor')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                activeTab === 'editor' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Settings size={16} /> Editor
            </button>
            <button
              onClick={() => setActiveTab('preview')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                activeTab === 'preview' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <EyeIcon size={16} /> Preview
            </button>
          </div>
          <div className="flex items-center gap-4">
            <span className={`text-sm ${
              saveStatus.includes('Error') ? 'text-red-500' : 'text-green-500'
            }`}>
              {saveStatus}
            </span>
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              <Save size={16} /> Save Changes
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      {activeTab === 'editor' ? (
        <div className="space-y-8">
          <Tabs defaultValue={activeSection} onValueChange={setActiveSection}>
            <TabsList>
              <TabsTrigger value="form">Form Structure</TabsTrigger>
              <TabsTrigger value="constants">Constants</TabsTrigger>
              <TabsTrigger value="thresholds">Thresholds</TabsTrigger>
              <TabsTrigger value="resources">Resources</TabsTrigger>
            </TabsList>

            <TabsContent value="form">
              <FormStepsEditor 
                formConfig={formData.formConfig} 
                onChange={(newConfig) => setFormData({ ...formData, formConfig: newConfig })}
              />
            </TabsContent>

            <TabsContent value="constants">
              <ConstantsEditor 
                constants={formData.CONSTANTS}
                onChange={(newConstants) => setFormData({ ...formData, CONSTANTS: newConstants })}
              />
            </TabsContent>

            <TabsContent value="thresholds">
              <ThresholdsEditor 
                thresholds={formData.MONTHLY_THRESHOLDS}
                onChange={(newThresholds) => setFormData({ ...formData, MONTHLY_THRESHOLDS: newThresholds })}
              />
            </TabsContent>

            <TabsContent value="resources">
              <ResourcesEditor 
                resources={formData.RESOURCES}
                onChange={(newResources) => setFormData({ ...formData, RESOURCES: newResources })}
              />
            </TabsContent>
          </Tabs>
        </div>
      ) : (
        <FormPreview formData={formData} />
      )}
    </div>
  );
};

export default FormEditor;