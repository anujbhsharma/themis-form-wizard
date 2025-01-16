// "use client"
// import React, { useState, useEffect } from 'react';
// import { 
//   Trash2, 
//   Plus, 
//   GripVertical, 
//   ChevronDown, 
//   ChevronUp, 
//   EyeIcon, 
//   Settings, 
//   Save 
// } from 'lucide-react';
// import { saveFormData, getFormData } from './formHelper';
// // Form Preview Component
// const FormPreview = ({ formData }) => {
//   return (
//     <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow space-y-6">
//       {/* Disclaimer */}
//       <div className="bg-gray-50 p-4 rounded text-sm">
//         {formData.disclaimer}
//       </div>

//       {/* Form Fields */}
//       <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
//         {formData.formFields.map((field, index) => {
//           // Check if field should be shown based on conditional logic
//           const shouldShow = !field.conditional || 
//             (field.conditional && formData.formFields.find(f => 
//               f.name === field.conditional.field)?.value === field.conditional.value);

//           if (!shouldShow) return null;

//           return (
//             <div key={index} className="space-y-2">
//               <label className="block font-medium">
//                 {field.label}
//                 {field.required && <span className="text-red-500 ml-1">*</span>}
//               </label>
              
//               {field.hint && (
//                 <p className="text-sm text-gray-500 mb-1">{field.hint}</p>
//               )}

//               {field.type === 'text' && (
//                 <input
//                   type="text"
//                   className="w-full p-2 border rounded"
//                   placeholder={field.label}
//                   name={field.name}
//                   required={field.required}
//                 />
//               )}

//               {field.type === 'textarea' && (
//                 <textarea
//                   className="w-full p-2 border rounded h-24"
//                   placeholder={field.label}
//                   name={field.name}
//                   required={field.required}
//                 />
//               )}

//               {field.type === 'number' && (
//                 <input
//                   type="number"
//                   className="w-full p-2 border rounded"
//                   name={field.name}
//                   required={field.required}
//                 />
//               )}

//               {field.type === 'email' && (
//                 <input
//                   type="email"
//                   className="w-full p-2 border rounded"
//                   placeholder="email@example.com"
//                   name={field.name}
//                   required={field.required}
//                 />
//               )}

//               {field.type === 'tel' && (
//                 <input
//                   type="tel"
//                   className="w-full p-2 border rounded"
//                   placeholder="(123) 456-7890"
//                   name={field.name}
//                   required={field.required}
//                 />
//               )}

//               {field.type === 'date' && (
//                 <input
//                   type="date"
//                   className="w-full p-2 border rounded"
//                   name={field.name}
//                   required={field.required}
//                 />
//               )}

//               {field.type === 'checkbox' && (
//                 <div className="flex items-center gap-2">
//                   <input
//                     type="checkbox"
//                     className="w-4 h-4"
//                     name={field.name}
//                     required={field.required}
//                   />
//                   <span>{field.label}</span>
//                 </div>
//               )}

//               {field.type === 'radio' && field.options && (
//                 <div className="space-y-2">
//                   {field.options.map((option, optIndex) => (
//                     <div key={optIndex} className="flex items-center gap-2">
//                       <input
//                         type="radio"
//                         name={field.name}
//                         value={option}
//                         className="w-4 h-4"
//                         required={field.required}
//                       />
//                       <span>{option}</span>
//                     </div>
//                   ))}
//                 </div>
//               )}

//               {field.type === 'select' && field.options && (
//                 <select 
//                   className="w-full p-2 border rounded"
//                   name={field.name}
//                   required={field.required}
//                 >
//                   <option value="">Select {field.label}</option>
//                   {field.options.map((option, optIndex) => (
//                     <option key={optIndex} value={option}>
//                       {option}
//                     </option>
//                   ))}
//                 </select>
//               )}
//             </div>
//           );
//         })}

//         <button 
//           type="submit" 
//           className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
//         >
//           Submit
//         </button>
//       </form>
//     </div>
//   );
// };

// // Main Form Editor Component
// const FormEditor = () => {
//   const [formData, setFormData] = useState(null);
//   const [draggedIndex, setDraggedIndex] = useState(null);
//   const [expandedField, setExpandedField] = useState(null);
//   const [activeTab, setActiveTab] = useState('editor');
//   const [saveStatus, setSaveStatus] = useState('');
//   useEffect(() => {
//     const autoSave = async () => {
//       if (formData) {
//         try {
//           setSaveStatus('Saving...');
//           const { success, error } = await saveFormData(formData);
          
//           if (success) {
//             setSaveStatus('Saved successfully!');
//           } else {
//             throw new Error(error);
//           }
//         } catch (error) {
//           console.error('Error auto-saving form data:', error);
//           setSaveStatus('Error saving changes');
//         } finally {
//           setTimeout(() => setSaveStatus(''), 3000);
//         }
//       }
//     };
  
//     // Debounce the auto-save to avoid too many requests
//     const timeoutId = setTimeout(() => {
//       autoSave();
//     }, 1000);
  
//     return () => clearTimeout(timeoutId);
//   }, [formData]);
//   // Load initial data
//   useEffect(() => {
//     const loadData = async () => {
//       const { success, data, error } = await getFormData();
//       if (success) {
//         setFormData(data);
//       } else {
//         console.error('Error loading data:', error);
//         setFormData({
//           disclaimer: '',
//           formFields: []
//         });
//       }
//     };
//     loadData();
//   }, []);
  
//   // Update saveChanges function
//   const saveChanges = async () => {
//     try {
//       setSaveStatus('Saving...');
//       const { success, error } = await saveFormData(formData);
      
//       if (success) {
//         setSaveStatus('Saved successfully!');
//       } else {
//         throw new Error(error);
//       }
//     } catch (error) {
//       console.error('Error saving form data:', error);
//       setSaveStatus('Error saving changes');
//     } finally {
//       setTimeout(() => setSaveStatus(''), 3000);
//     }
//   };

//   if (!formData) {
//     return <div className="p-8 text-center">Loading form data...</div>;
//   }

//   // Save changes to file
// //   const saveChanges = async () => {
// //     try {
// //       const jsonString = JSON.stringify(formData, null, 4);
// //       await window.fs.writeFile('dummy.json', jsonString);
// //       setSaveStatus('Saved successfully!');
// //       setTimeout(() => setSaveStatus(''), 3000);
// //     } catch (error) {
// //       console.error('Error saving form data:', error);
// //       setSaveStatus('Error saving changes');
// //       setTimeout(() => setSaveStatus(''), 3000);
// //     }
// //   };

//   const handleDisclaimerChange = (e) => {
//     setFormData(prev => ({
//       ...prev,
//       disclaimer: e.target.value
//     }));
//   };

//   const handleFieldChange = (index, field, value) => {
//     setFormData(prev => {
//       const newFields = [...prev.formFields];
//       newFields[index] = {
//         ...newFields[index],
//         [field]: value
//       };
//       return { ...prev, formFields: newFields };
//     });
//   };

//   const addNewField = () => {
//     setFormData(prev => ({
//       ...prev,
//       formFields: [...prev.formFields, {
//         type: 'text',
//         name: `field_${prev.formFields.length + 1}`,
//         label: 'New Field',
//         required: false
//       }]
//     }));
//   };

//   const removeField = (index) => {
//     setFormData(prev => ({
//       ...prev,
//       formFields: prev.formFields.filter((_, i) => i !== index)
//     }));
//   };

//   const moveField = (fromIndex, toIndex) => {
//     setFormData(prev => {
//       const newFields = [...prev.formFields];
//       const [movedItem] = newFields.splice(fromIndex, 1);
//       newFields.splice(toIndex, 0, movedItem);
//       return { ...prev, formFields: newFields };
//     });
//   };

//   const handleDragStart = (index) => {
//     setDraggedIndex(index);
//   };

//   const handleDragOver = (e, index) => {
//     e.preventDefault();
//     if (draggedIndex === null || draggedIndex === index) return;
//     moveField(draggedIndex, index);
//     setDraggedIndex(index);
//   };

//   const handleDragEnd = () => {
//     setDraggedIndex(null);
//   };

//   const toggleFieldExpansion = (index) => {
//     setExpandedField(expandedField === index ? null : index);
//   };

//   return (
//     <div className="max-w-6xl mx-auto p-4">
//       {/* Header with Save Button */}
//       <div className="flex justify-between items-center mb-6">
//         <div className="flex gap-4">
//           <button
//             onClick={() => setActiveTab('editor')}
//             className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
//               activeTab === 'editor' 
//                 ? 'bg-blue-500 text-white' 
//                 : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//             }`}
//           >
//             <Settings size={16} />
//             Editor
//           </button>
//           <button
//             onClick={() => setActiveTab('preview')}
//             className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
//               activeTab === 'preview' 
//                 ? 'bg-blue-500 text-white' 
//                 : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//             }`}
//           >
//             <EyeIcon size={16} />
//             Preview
//           </button>
//         </div>
//         <div className="flex items-center gap-4">
//           {saveStatus && (
//             <span className={`text-sm ${
//               saveStatus.includes('Error') ? 'text-red-500' : 'text-green-500'
//             }`}>
//               {saveStatus}
//             </span>
//           )}
//           <button
//             onClick={saveChanges}
//             className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
//           >
//             <Save size={16} />
//             Save Changes
//           </button>
//         </div>
//       </div>

//       <div className="grid grid-cols-2 gap-8">
//         {/* Editor Panel */}
//         {activeTab === 'editor' && (
//           <div className="col-span-2 lg:col-span-1 bg-white rounded-lg shadow p-6 space-y-6">
//             {/* Disclaimer Editor */}
//             <div className="space-y-2">
//               <label className="block font-medium">Disclaimer</label>
//               <textarea
//                 value={formData.disclaimer}
//                 onChange={handleDisclaimerChange}
//                 className="w-full h-32 p-2 border rounded"
//               />
//             </div>

//             {/* Fields Editor */}
//             <div className="space-y-4">
//               <div className="flex justify-between items-center">
//                 <h3 className="text-lg font-semibold">Form Fields</h3>
//                 <button
//                   onClick={addNewField}
//                   className="flex items-center gap-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
//                 >
//                   <Plus size={16} /> Add Field
//                 </button>
//               </div>

//               <div className="space-y-2">
//                 {formData.formFields.map((field, index) => (
//                   <div
//                     key={index}
//                     draggable
//                     onDragStart={() => handleDragStart(index)}
//                     onDragOver={(e) => handleDragOver(e, index)}
//                     onDragEnd={handleDragEnd}
//                     className="bg-gray-50 rounded p-4 border cursor-move"
//                   >
//                     <div className="flex items-center gap-4">
//                       <GripVertical className="text-gray-400" size={20} />
//                       <div className="flex-1">
//                         <div className="flex items-center justify-between">
//                           <span className="font-medium">{field.label || 'Unnamed Field'}</span>
//                           <div className="flex items-center gap-2">
//                             <button
//                               onClick={() => toggleFieldExpansion(index)}
//                               className="p-1 hover:bg-gray-200 rounded"
//                             >
//                               {expandedField === index ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
//                             </button>
//                             <button
//                               onClick={() => removeField(index)}
//                               className="p-1 text-red-500 hover:bg-red-50 rounded"
//                             >
//                               <Trash2 size={16} />
//                             </button>
//                           </div>
//                         </div>
                        
//                         {expandedField === index && (
//                           <div className="mt-4 space-y-4">
//                             <div className="grid grid-cols-2 gap-4">
//                               <div>
//                                 <label className="block text-sm font-medium mb-1">Label</label>
//                                 <input
//                                   type="text"
//                                   value={field.label || ''}
//                                   onChange={(e) => handleFieldChange(index, 'label', e.target.value)}
//                                   className="w-full p-2 border rounded"
//                                 />
//                               </div>
//                               <div>
//                                 <label className="block text-sm font-medium mb-1">Name</label>
//                                 <input
//                                   type="text"
//                                   value={field.name || ''}
//                                   onChange={(e) => handleFieldChange(index, 'name', e.target.value)}
//                                   className="w-full p-2 border rounded"
//                                 />
//                               </div>
//                             </div>
                            
//                             <div className="grid grid-cols-2 gap-4">
//                               <div>
//                                 <label className="block text-sm font-medium mb-1">Type</label>
//                                 <select
//                                   value={field.type}
//                                   onChange={(e) => handleFieldChange(index, 'type', e.target.value)}
//                                   className="w-full p-2 border rounded"
//                                 >
//                                   <option value="text">Text</option>
//                                   <option value="textarea">Textarea</option>
//                                   <option value="number">Number</option>
//                                   <option value="email">Email</option>
//                                   <option value="tel">Telephone</option>
//                                   <option value="date">Date</option>
//                                   <option value="checkbox">Checkbox</option>
//                                   <option value="radio">Radio</option>
//                                   <option value="select">Select</option>
//                                 </select>
//                               </div>
//                               <div className="flex items-center">
//                                 <label className="flex items-center gap-2">
//                                   <input
//                                     type="checkbox"
//                                     checked={field.required || false}
//                                     onChange={(e) => handleFieldChange(index, 'required', e.targetchecked)}
//                                     className="w-4 h-4"
//                                   />
//                                   <span className="text-sm font-medium">Required</span>
//                                 </label>
//                               </div>
//                             </div>

//                             {(field.type === 'select' || field.type === 'radio') && (
//                               <div>
//                                 <label className="block text-sm font-medium mb-1">Options (comma-separated)</label>
//                                 <input
//                                   type="text"
//                                   value={field.options?.join(', ') || ''}
//                                   onChange={(e) => handleFieldChange(index, 'options', e.target.value.split(',').map(opt => opt.trim()))}
//                                   className="w-full p-2 border rounded"
//                                 />
//                               </div>
//                             )}

//                             <div>
//                               <label className="block text-sm font-medium mb-1">Hint (optional)</label>
//                               <input
//                                 type="text"
//                                 value={field.hint || ''}
//                                 onChange={(e) => handleFieldChange(index, 'hint', e.target.value)}
//                                 className="w-full p-2 border rounded"
//                               />
//                             </div>

//                             {/* Conditional Logic */}
//                             <div className="space-y-2">
//                               <label className="block text-sm font-medium">Conditional Display</label>
//                               <div className="grid grid-cols-2 gap-4">
//                                 <div>
//                                   <label className="block text-xs text-gray-500 mb-1">Depends on Field</label>
//                                   <select
//                                     value={field.conditional?.field || ''}
//                                     onChange={(e) => {
//                                       const value = e.target.value;
//                                       handleFieldChange(index, 'conditional', value ? {
//                                         field: value,
//                                         value: field.conditional?.value || ''
//                                       } : undefined);
//                                     }}
//                                     className="w-full p-2 border rounded"
//                                   >
//                                     <option value="">None</option>
//                                     {formData.formFields
//                                       .filter((f, i) => i !== index && (f.type === 'radio' || f.type === 'select'))
//                                       .map((f, i) => (
//                                         <option key={i} value={f.name}>{f.label}</option>
//                                       ))
//                                     }
//                                   </select>
//                                 </div>
//                                 {field.conditional?.field && (
//                                   <div>
//                                     <label className="block text-xs text-gray-500 mb-1">Show when value is</label>
//                                     <select
//                                       value={field.conditional?.value || ''}
//                                       onChange={(e) => {
//                                         handleFieldChange(index, 'conditional', {
//                                           ...field.conditional,
//                                           value: e.target.value
//                                         });
//                                       }}
//                                       className="w-full p-2 border rounded"
//                                     >
//                                       <option value="">Select value</option>
//                                       {formData.formFields
//                                         .find(f => f.name === field.conditional.field)
//                                         ?.options?.map((opt, i) => (
//                                           <option key={i} value={opt}>{opt}</option>
//                                         ))
//                                       }
//                                     </select>
//                                   </div>
//                                 )}
//                               </div>
//                             </div>
//                           </div>
//                         )}
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Preview Panel */}
//         {activeTab === 'preview' && (
//           <div className="col-span-2 lg:col-span-1">
//             <FormPreview formData={formData} />
//           </div>
//         )}

//         {/* JSON Preview for debugging */}
//         <div className="col-span-2 mt-8">
//           <details className="bg-gray-50 p-4 rounded">
//             <summary className="cursor-pointer font-medium">Current JSON Structure</summary>
//             <pre className="mt-2 p-4 bg-gray-100 rounded overflow-x-auto text-sm">
//               {JSON.stringify(formData, null, 2)}
//             </pre>
//           </details>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default FormEditor;
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

  const handleInputChange = (name, value) => {
    setFormValues(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formValues);
    // Add your form submission logic here
  };

  return (
    <div className="max-w-3xl mx-auto bg-white">
      {/* Form Header */}
      <div className="bg-white border-b">
        <div className="max-w-3xl mx-auto px-6 py-4">
          <h2 className="text-xl font-semibold text-gray-900">{formData.metadata.clinic.name}</h2>
          {formData.metadata.clinic.phone && (
            <p className="text-sm text-gray-500 mt-1">
              Contact: {formData.metadata.clinic.phone}
              {formData.metadata.clinic.email && ` | ${formData.metadata.clinic.email}`}
            </p>
          )}
        </div>
      </div>

      {/* Progress Steps */}
      <div className="border-b bg-gray-50">
        <div className="max-w-3xl mx-auto px-6 py-4">
          <div className="flex items-center gap-2 overflow-x-auto">
            {formData.steps.map((step, index) => {
              const Icon = ICONS[step.icon] || User;
              const isActive = activeStep === index;
              const isPast = activeStep > index;
              const isFuture = activeStep < index;

              return (
                <button
                  key={step.id}
                  onClick={() => setActiveStep(index)}
                  disabled={isFuture}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                    isActive 
                      ? 'bg-blue-500 text-white shadow-sm' 
                      : isPast
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-500'
                  } ${isFuture ? 'opacity-50 cursor-not-allowed' : 'hover:bg-opacity-90'}`}
                >
                  <Icon size={16} />
                  <span className="text-sm font-medium">{step.title}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="max-w-2xl mx-auto px-6 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {formData.steps[activeStep].fields.map((field, index) => {
            // Check if field should be shown based on conditional logic
            const shouldShow = !field.conditional || 
              (field.conditional && formValues[field.conditional.field] === field.conditional.value);

            if (!shouldShow) return null;

            const fieldProps = {
              name: field.name,
              required: field.required,
              onChange: (e) => handleInputChange(field.name, e.target.value),
              value: formValues[field.name] || '',
              className: "w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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

                {field.type === 'text' && (
                  <input type="text" {...fieldProps} />
                )}

                {field.type === 'textarea' && (
                  <textarea {...fieldProps} rows={4} />
                )}

                {field.type === 'number' && (
                  <input type="number" {...fieldProps} />
                )}

                {field.type === 'email' && (
                  <input type="email" {...fieldProps} placeholder="email@example.com" />
                )}

                {field.type === 'tel' && (
                  <input type="tel" {...fieldProps} placeholder="(123) 456-7890" />
                )}

                {field.type === 'date' && (
                  <input type="date" {...fieldProps} />
                )}

                {field.type === 'checkbox' && (
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name={field.name}
                      checked={formValues[field.name] || false}
                      onChange={(e) => handleInputChange(field.name, e.target.checked)}
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
                          onChange={(e) => handleInputChange(field.name, e.target.value)}
                          className="h-4 w-4 border-gray-300 text-blue-500 focus:ring-blue-500"
                        />
                        <span className="text-gray-700">{option.label}</span>
                      </div>
                    ))}
                  </div>
                )}

                {field.type === 'select' && field.options && (
                  <select {...fieldProps}>
                    <option value="">Select {field.label}</option>
                    {field.options.map((option, optIndex) => (
                      <option key={optIndex} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
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
                onClick={() => setActiveStep(prev => prev + 1)}
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
      </div>
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