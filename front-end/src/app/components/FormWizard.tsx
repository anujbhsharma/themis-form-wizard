// "use client"
// import React, { useState, useEffect,useRef } from 'react';
// import { 
//   AlertCircle,
//   Shield,
//   User,
//   Phone,
//   Home,
//   DollarSign,
//   Scale,
//   ChevronRight,
//   ChevronLeft,
//   Info,
//   CheckCircle,
//   Upload,
//   X,
//   Loader2,
//   FileText,
//   RefreshCcw
// } from 'lucide-react';

// import { Card,  CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
// import { formConfig,CONSTANTS,RESOURCES } from '../lib/formConfig';
// import { submitFormWithFiles } from '../lib/api';
// export default function LegalClinicForm() {
//   const [currentStep, setCurrentStep] = useState(0);
//   const [formData, setFormData] = useState({});
//   const [errors, setErrors] = useState({});
//   const [progress, setProgress] = useState(0);
//   const [visitedSteps, setVisitedSteps] = useState(new Set([0]));
//   const [activeResources, setActiveResources] = useState(null);
//   const [showEmergencyAlert, setShowEmergencyAlert] = useState(false);
//   const [selectedFiles, setSelectedFiles] = useState([]);
//   const [submitStatus, setSubmitStatus] = useState({ loading: false, error: null });
//   const [showSuccess, setShowSuccess] = useState(false);
//   const [submissionId, setSubmissionId] = useState(null);
//   const fileInputRef = useRef(null);
//   const resetForm = () => {
//     setFormData({});
//     setErrors({});
//     setCurrentStep(0);
//     setVisitedSteps(new Set([0]));
//     setSelectedFiles([]);
//     setSubmitStatus({ loading: false, error: null });
//     setShowSuccess(false);
//     setSubmissionId(null);
//     setActiveResources(null);
//     setShowEmergencyAlert(false);
//   };
//   useEffect(() => {
//     const newProgress = ((currentStep + 1) / formConfig.steps.length) * 100;
//     setProgress(newProgress);
//   }, [currentStep]);

//   const validateField = (field, value, allData = formData) => {
//     // Required field validation
//     if (field.required && (!value || value === '')) {
//       return {
//         isValid: false,
//         message: `${field.label} is required`
//       };
//     }
  
//     // Custom validation rules
//     if (field.validation?.rules) {
//       for (const rule of field.validation.rules) {
//         const result = rule(value, allData);
//         if (!result.isValid) {
//           return result;
//         }
        
//         // Handle resources even during validation
//         if (result.resources) {
//           setActiveResources(result.resources);
//         }
//       }
//     }
  
//     return { isValid: true };
//   };

//   const validateStep = (stepIndex) => {
//     const step = formConfig.steps[stepIndex];
//     const newErrors = {};
//     let isValid = true;

//     for (const field of step.fields) {
//       const validation = validateField(field, formData[field.name]);
//       if (!validation.isValid) {
//         newErrors[field.name] = validation.message;
//         isValid = false;
//       }
//     }

//     setErrors(newErrors);
//     return isValid;
//   };
//   const handleFileSelect = (event) => {
//     const files = Array.from(event.target.files);
//     setSelectedFiles(prev => [...prev, ...files]);
//     if (fileInputRef.current) {
//       fileInputRef.current.value = '';
//     }
//   };

//   const removeFile = (fileIndex) => {
//     setSelectedFiles(prev => prev.filter((_, index) => index !== fileIndex));
//   };

//   // Modified handleSubmit function
//   const handleSubmit = async () => {
//     if (!validateStep(currentStep)) {
//       return;
//     }

//     setSubmitStatus({ loading: true, error: null });

//     try {
//       const response = await submitFormWithFiles(formData, selectedFiles);
//       setSubmitStatus({ loading: true, error: null });
//       alert('Form submitted successfully!');
//       setSubmissionId(response.submissionId);
//       setShowSuccess(true);
//       // Optional: Reset form or redirect
//       setSubmitStatus({ loading: false, error: null });
//     } catch (error) {
//       setSubmitStatus({ 
//         loading: false, 
//         error: 'Failed to submit form. Please try again.' 
//       });
//     }
//   };
//   const handleFieldChange = (name, value) => {
//     const newData = { ...formData, [name]: value };
//     setFormData(newData);
  
//     // Clear error when field is modified
//     if (errors[name]) {
//       const newErrors = { ...errors };
//       delete newErrors[name];
//       setErrors(newErrors);
//     }
  
//     // Find the current field
//     const field = formConfig.steps[currentStep].fields.find(f => f.name === name);
    
//     // Special handling for emergency fields
//     if (name === 'immediateRisk') {
//       if (value === 'yes') {
//         setShowEmergencyAlert(true);
//         setActiveResources(RESOURCES.emergency);
//       } else {
//         setShowEmergencyAlert(false);
//         // Only clear resources if shelter isn't needed
//         if (formData.shelterNeeded !== 'yes') {
//           setActiveResources(null);
//         }
//       }
//     }
  
//     // Special handling for shelter needs
//     if (name === 'shelterNeeded') {
//       if (value === 'yes') {
//         const combinedResources = [
//           ...(newData.immediateRisk === 'yes' ? RESOURCES.emergency : []),
//           ...RESOURCES.shelters
//         ];
//         setActiveResources(combinedResources);
//       } else {
//         // If they're still in danger, keep showing emergency resources
//         setActiveResources(newData.immediateRisk === 'yes' ? RESOURCES.emergency : null);
//       }
//     }
  
//     // Run field validation rules
//     if (field?.validation?.rules) {
//       for (const rule of field.validation.rules) {
//         const result = rule(value, newData);
        
//         // Handle validation results
//         if (!result.isValid) {
//           setErrors(prev => ({
//             ...prev,
//             [name]: result.message
//           }));
//         }
        
//         if (result.terminateIfInvalid) {
//           setShowEmergencyAlert(true);
//         }
        
//         // Update resources if provided by validation
//         if (result.resources) {
//           setActiveResources(result.resources);
//         }
//       }
//     }
//   };

//   const handleNext = () => {
//     if (validateStep(currentStep)) {
//       const nextStep = currentStep + 1;
//       setCurrentStep(nextStep);
//       setVisitedSteps(prev => new Set([...prev, nextStep]));
//     }
//   };

//   const handlePrevious = () => {
//     setCurrentStep(prev => Math.max(0, prev - 1));
//   };

//   const handleStepClick = (index) => {
//     if (visitedSteps.has(index) || (index === currentStep + 1 && validateStep(currentStep))) {
//       setCurrentStep(index);
//       setVisitedSteps(prev => new Set([...prev, index]));
//     }
//   };

//   const getIcon = (iconName) => {
//     const icons = {
//       AlertCircle,
//       Shield,
//       User,
//       Phone,
//       Home,
//       DollarSign,
//       Scale
//     };
//     const IconComponent = icons[iconName];
//     return IconComponent ? <IconComponent className="h-5 w-5" /> : null;
//   };

//   const renderField = (field) => {
//     const hasError = errors[field.name];
//     const commonClasses = `
//       w-full p-3 rounded-lg border transition-all
//       focus:ring-2 focus:ring-blue-500 focus:border-transparent
//       ${hasError ? 'border-red-500 bg-red-50' : 'border-gray-200'}
//     `;

//     // Special handling for checkbox groups
//     if (field.type === 'checkbox-group') {
//       return (
//         <div className="space-y-3">
//           {field.options.map(option => (
//             <div
//               key={option.value}
//               className="flex items-center gap-2"
//             >
//               <input
//                 type="checkbox"
//                 id={`${field.name}-${option.value}`}
//                 checked={formData[field.name]?.includes(option.value) || false}
//                 onChange={(e) => {
//                   const currentValues = formData[field.name] || [];
//                   const newValues = e.target.checked
//                     ? [...currentValues, option.value]
//                     : currentValues.filter(v => v !== option.value);
//                   handleFieldChange(field.name, newValues);
//                 }}
//                 className="w-4 h-4 rounded border-gray-300 text-blue-600"
//               />
//               <label htmlFor={`${field.name}-${option.value}`}>
//                 {option.label}
//               </label>
//             </div>
//           ))}
//         </div>
//       );
//     }

//     // Special handling for number fields with currency
//     if (field.type === 'number' && field.name.toLowerCase().includes('income') || 
//         field.name.toLowerCase().includes('expense') || 
//         field.name.toLowerCase().includes('assets')) {
//       return (
//         <div className="relative">
//           <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
//           <input
//             type="number"
//             value={formData[field.name] || ''}
//             onChange={(e) => handleFieldChange(field.name, e.target.value)}
//             className={`${commonClasses} pl-8`}
//             min="0"
//             step="0.01"
//           />
//         </div>
//       );
//     }

//     switch (field.type) {
//       case 'radio':
//         return (
//           <div className="space-y-3">
//             {field.options.map(option => (
//               <div
//                 key={option.value}
//                 onClick={() => handleFieldChange(field.name, option.value)}
//                 className={`
//                   flex items-center p-4 rounded-lg border cursor-pointer
//                   ${formData[field.name] === option.value 
//                     ? 'border-blue-500 bg-blue-50' 
//                     : 'border-gray-200 hover:bg-gray-50'}
//                 `}
//               >
//                 <div className={`
//                   w-5 h-5 rounded-full border-2 mr-3 
//                   flex items-center justify-center
//                   ${formData[field.name] === option.value 
//                     ? 'border-blue-500' 
//                     : 'border-gray-400'}
//                 `}>
//                   {formData[field.name] === option.value && (
//                     <div className="w-3 h-3 rounded-full bg-blue-500" />
//                   )}
//                 </div>
//                 <span>{option.label}</span>
//               </div>
//             ))}
//           </div>
//         );

//       case 'checkbox':
//         return (
//           <div
//             onClick={() => handleFieldChange(field.name, !formData[field.name])}
//             className={`
//               flex items-center p-4 rounded-lg border cursor-pointer
//               ${formData[field.name] 
//                 ? 'border-blue-500 bg-blue-50' 
//                 : 'border-gray-200 hover:bg-gray-50'}
//             `}
//           >
//             <div className={`
//               w-5 h-5 rounded mr-3 border-2
//               flex items-center justify-center
//               ${formData[field.name] ? 'border-blue-500 bg-blue-500' : 'border-gray-400'}
//             `}>
//               {formData[field.name] && (
//                 <CheckCircle className="w-4 h-4 text-white" />
//               )}
//             </div>
//             <span>{field.label}</span>
//           </div>
//         );

//       case 'select':
//         return (
//           <select
//             value={formData[field.name] || ''}
//             onChange={(e) => handleFieldChange(field.name, e.target.value)}
//             className={commonClasses}
//           >
//             <option value="">Select an option</option>
//             {field.options.map(option => (
//               <option key={option.value} value={option.value}>
//                 {option.label}
//               </option>
//             ))}
//           </select>
//         );

//       case 'textarea':
//         return (
//           <textarea
//             value={formData[field.name] || ''}
//             onChange={(e) => handleFieldChange(field.name, e.target.value)}
//             className={`${commonClasses} min-h-[120px]`}
//           />
//         );

//       default:
//         return (
//           <input
//             type={field.type}
//             value={formData[field.name] || ''}
//             onChange={(e) => handleFieldChange(field.name, e.target.value)}
//             className={commonClasses}
//           />
//         );
//     }
//   };

//   const currentStepConfig = formConfig.steps[currentStep];
//   const SuccessModal = () => (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//       <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
//         <div className="text-center">
//           <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
//             <CheckCircle className="w-8 h-8 text-green-600" />
//           </div>
//           <h2 className="mt-4 text-2xl font-bold text-gray-900">
//             Application Submitted Successfully
//           </h2>
//           <p className="mt-2 text-gray-600">
//             Your application has been received. Reference ID: {submissionId}
//           </p>
//           {/* Add any additional information or next steps here */}
//           <div className="mt-6 space-y-3">
//             <button
//               onClick={() => {
//                 // Add navigation logic here if needed
//                 window.location.href = '/thank-you';
//               }}
//               className="w-full px-4 py-2 text-sm font-medium text-white bg-green-600 
//                 rounded-lg hover:bg-green-700"
//             >
//               Continue to Thank You Page
//             </button>
//             <button
//               onClick={() => {
//                 resetForm();
//                 setShowSuccess(false);
//               }}
//               className="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 
//                 rounded-lg hover:bg-gray-200 flex items-center justify-center gap-2"
//             >
//               <RefreshCcw className="w-4 h-4" />
//               Submit Another Application
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
//   return (
//     <div className="min-h-screen bg-gray-50  md:p-2">
//       {showSuccess && <SuccessModal />}
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className=" text-center bg-white rounded-xl  shadow-sm">
//         <Card className="mb-4">
//           <CardHeader>
//             <CardTitle className="text-2xl text-center text-red-800">
//               {formConfig.metadata.clinic.name}
//             </CardTitle>
//             <CardDescription className="text-center">
//               Phone: {formConfig.metadata.clinic.phone} • Email: {formConfig.metadata.clinic.email} •  {formConfig.metadata.clinic.address}
//             </CardDescription>
//           </CardHeader>
//         </Card>
//         </div>
  
//         {/* Progress bar */}
//         <div className="mb-4">
//           <div className="max-w-3xl mx-auto">
//             <div className="h-1 mb-8 rounded-full bg-gray-100 overflow-hidden">
//               <div 
//                 className="h-full bg-red-500 transition-all duration-300 ease-out"
//                 style={{ width: `${progress}%` }}
//               />
//             </div>
//             <div className="flex justify-between">
//               {formConfig.steps.map((step, index) => (
//                 <div
//                   key={step.id}
//                   onClick={() => handleStepClick(index)}
//                   className={`
//                     flex flex-col items-center cursor-pointer
//                     transition-all duration-200
//                     ${index <= currentStep ? 'text-red-600' : 'text-gray-400'}
//                   `}
//                 >
//                   <div className={`
//                     w-8 h-8 rounded-full flex items-center justify-center text-sm
//                     transition-all duration-300
//                     ${currentStep === index 
//                       ? 'bg-red-600 text-white ring-4 ring-red-100' 
//                       : visitedSteps.has(index)
//                       ? 'bg-red-100 text-red-600'
//                       : 'bg-gray-100 text-gray-500'}
//                   `}>
//                     {visitedSteps.has(index) && index !== currentStep ? (
//                       <CheckCircle className="w-4 h-4" />
//                     ) : (
//                       index + 1
//                     )}
//                   </div>
//                   <span className="text-xs mt-2 font-medium hidden md:block">
//                     {step.title}
//                   </span>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
  
//         {/* Emergency alert */}
//         {/* Emergency alert */}
// {showEmergencyAlert && (
//   <div className="mb-6">
//     <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-4">
//       <div className="flex items-start gap-3">
//         <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
//         <div>
//           <h3 className="font-semibold text-red-800 text-lg">
//             Emergency Assistance Required
//           </h3>
//           <p className="text-red-700 mt-1">
//             If you are in immediate danger, please call 911 or your local emergency services immediately.
//           </p>
//           <div className="mt-4 bg-white rounded-lg p-4 border border-red-200">
//             <h4 className="font-medium text-red-800 mb-2">Emergency Contacts:</h4>
//             <div className="space-y-2">
//               {RESOURCES.emergency.map((resource, index) => (
//                 <div key={index} className="flex items-start gap-2">
//                   <Phone className="w-4 h-4 text-red-600 mt-1" />
//                   <div>
//                     <p className="font-medium text-red-800">{resource.name}</p>
//                     <p className="text-red-600">{resource.phoneNumber}</p>
//                     {resource.description && (
//                       <p className="text-sm text-red-700">{resource.description}</p>
//                     )}
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   </div>
// )}
  
//         {/* Main content grid */}
//         <div className="grid md:grid-cols-[2fr,1fr] gap-8">
//           {/* Main form */}
//           <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
//             {/* Step header */}
//             <div className="p-6 border-b border-gray-100">
//               <div className="flex items-center gap-3">
//                 {getIcon(currentStepConfig.icon)}
//                 <h2 className="text-xl font-medium text-gray-900">
//                   {currentStepConfig.title}
//                 </h2>
//                 {currentStepConfig.critical && (
//                   <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
//                     Critical
//                   </span>
//                 )}
//               </div>
//               {currentStepConfig.guidance && (
//                 <p className="text-gray-600 text-sm mt-2">
//                   {currentStepConfig.guidance}
//                 </p>
//               )}
//             </div>
  
//             {/* Form fields */}
//             <div className="p-6">
//               <div className="max-h-[60vh] overflow-y-auto pr-4 space-y-6">
//                 {currentStepConfig.fields.map(field => (
//                   <div key={field.name} className="mb-8 last:mb-0">
//                     <div className="flex items-start justify-between gap-2 mb-2">
//                       <label className="block text-sm font-medium text-gray-700">
//                         {field.label}
//                         {field.required && (
//                           <span className="text-red-500 ml-1">*</span>
//                         )}
//                       </label>
//                       {field.guidance && (
//                         <div className="group relative">
//                           <Info className="w-4 h-4 text-gray-400 cursor-help" />
//                           <div className="absolute right-0 w-64 p-2 bg-gray-800 text-white text-xs rounded-lg 
//                             opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none">
//                             {field.guidance}
//                           </div>
//                         </div>
//                       )}
//                     </div>
  
//                     {renderField(field)}
  
//                     {errors[field.name] && (
//                       <div className="mt-2 text-sm text-red-600 flex items-center gap-1">
//                         <AlertCircle className="w-4 h-4" />
//                         <span>{errors[field.name]}</span>
//                       </div>
//                     )}
//                   </div>
//                 ))}
//               </div>
//               {currentStep === formConfig.steps.length - 1 && (
//           <div className="mt-8 border-t border-gray-200 pt-6">
//             <h3 className="text-sm font-medium text-gray-900 mb-4">
//               Supporting Documents
//             </h3>
//             <div className="space-y-4">
//               <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
//                 <input
//                   type="file"
//                   ref={fileInputRef}
//                   onChange={handleFileSelect}
//                   multiple
//                   className="hidden"
//                   accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
//                 />
//                 <div className="text-center">
//                   <FileText className="mx-auto h-12 w-12 text-gray-400" />
//                   <div className="mt-4 flex text-sm leading-6 text-gray-600 justify-center">
//                     <button
//                       type="button"
//                       onClick={() => fileInputRef.current?.click()}
//                       className="relative font-semibold text-red-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-red-600 focus-within:ring-offset-2 hover:text-red-500"
//                     >
//                       Choose files
//                     </button>
//                     <p className="pl-1">or drag and drop</p>
//                   </div>
//                   <p className="text-xs leading-5 text-gray-600">
//                     PDF, DOC, DOCX, JPG, JPEG, or PNG up to 10MB each
//                   </p>
//                 </div>
//               </div>

//               {/* File list */}
//               {selectedFiles.length > 0 && (
//                 <ul className="divide-y divide-gray-100 rounded-md border border-gray-200">
//                   {selectedFiles.map((file, index) => (
//                     <li key={index} className="flex items-center justify-between py-4 px-4 text-sm">
//                       <div className="flex items-center gap-2">
//                         <FileText className="h-5 w-5 flex-none text-gray-400" />
//                         <div className="min-w-0 flex-auto">
//                           <p className="text-sm font-medium text-gray-900">{file.name}</p>
//                           <p className="text-xs text-gray-500">
//                             {(file.size / 1024 / 1024).toFixed(2)} MB
//                           </p>
//                         </div>
//                       </div>
//                       <button
//                         type="button"
//                         onClick={() => removeFile(index)}
//                         className="ml-4 flex-none text-gray-400 hover:text-red-500"
//                       >
//                         <X className="h-5 w-5" />
//                       </button>
//                     </li>
//                   ))}
//                 </ul>
//               )}
//             </div>
//           </div>
//         )}
      

//       {/* Navigation */}
//       <div className="flex justify-between mt-8 pt-6 border-t border-gray-100">
//         <button
//           type="button"
//           onClick={handlePrevious}
//           disabled={currentStep === 0}
//           className={`
//             px-4 py-2 rounded-lg flex items-center gap-2
//             ${currentStep === 0 
//               ? 'text-gray-400 cursor-not-allowed' 
//               : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'}
//           `}
//         >
//           <ChevronLeft className="w-4 h-4" />
//           Previous
//         </button>

//         {currentStep === formConfig.steps.length - 1 ? (
//           <button
//             type="button"
//             onClick={handleSubmit}
//             disabled={submitStatus.loading}
//             className="px-6 py-2 text-sm font-medium text-white bg-red-600 
//               rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center gap-2"
//           >
//             {submitStatus.loading ? (
//               <>
//                 <Loader2 className="w-4 h-4 animate-spin" />
//                 Submitting...
//               </>
//             ) : (
//               <>
//                 Submit Application
//                 <ChevronRight className="w-4 h-4" />
//               </>
//             )}
//           </button>
//         ) : (
//           <button
//             type="button"
//             onClick={handleNext}
//             className="px-4 py-2 text-sm font-medium text-white bg-red-600 
//               rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center gap-2"
//           >
//             Next
//             <ChevronRight className="w-4 h-4" />
//           </button>
//         )}
    
//     </div>
              
//             </div>
//           </div>
  
//           {/* Side panel */}
//           <div className="space-y-6">
//             {/* Form progress */}
//             <div className="bg-white rounded-xl p-6 border border-gray-200">
//               <h3 className="text-sm font-medium text-gray-900 mb-4 flex items-center gap-2">
//                 <CheckCircle className="w-4 h-4 text-gray-500" />
//                 Form Progress
//               </h3>
//               <div className="space-y-2">
//                 {formConfig.steps.map((step, index) => (
//                   <div
//                     key={step.id}
//                     className={`
//                       flex items-center gap-2 p-2 rounded-lg text-sm
//                       ${currentStep === index 
//                         ? 'bg-red-50 text-red-700' 
//                         : visitedSteps.has(index) 
//                         ? 'text-gray-900' 
//                         : 'text-gray-400'}
//                     `}
//                   >
//                     <span className={`
//                       w-5 h-5 rounded-full flex items-center justify-center text-xs
//                       ${visitedSteps.has(index) 
//                         ? 'bg-green-100 text-green-700' 
//                         : 'border border-current'}
//                     `}>
//                       {visitedSteps.has(index) ? '✓' : index + 1}
//                     </span>
//                     {step.title}
//                   </div>
//                 ))}
//               </div>
//             </div>
  
//             {/* Required Documents */}
//             {currentStepConfig.requiredDocuments && (
//               <div className="bg-white rounded-xl p-6 border border-gray-200">
//                 <h3 className="text-sm font-medium text-gray-900 mb-4 flex items-center gap-2">
//                   <FileText className="w-4 h-4 text-gray-500" />
//                   Required Documents
//                 </h3>
//                 <ul className="space-y-3">
//                   {currentStepConfig.requiredDocuments.map((doc, index) => (
//                     <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
//                       <Info className="w-4 h-4 mt-0.5 text-gray-400" />
//                       <span>{doc}</span>
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//             )}
  
//             {/* Resources */}
//             {activeResources && (
//               <div className="bg-white rounded-xl p-6 border border-gray-200">
//                 <h3 className="text-sm font-medium text-gray-900 mb-4 flex items-center gap-2">
//                   <Phone className="w-4 h-4 text-gray-500" />
//                   Available Resources
//                 </h3>
//                 <div className="space-y-4">
//                   {activeResources.map((resource, index) => (
//                     <div key={index} className="bg-gray-50 rounded-lg p-4">
//                       <h4 className="font-medium text-gray-900">
//                         {resource.name}
//                       </h4>
//                       {resource.phoneNumber && (
//                         <p className="text-sm text-red-600 mt-1 flex items-center gap-2">
//                           <Phone className="w-4 h-4" />
//                           {resource.phoneNumber}
//                         </p>
//                       )}
//                       {resource.location && (
//                         <p className="text-sm text-gray-600 mt-1">
//                           {resource.location}
//                         </p>
//                       )}
//                       {resource.description && (
//                         <p className="text-sm text-gray-500 mt-1">
//                           {resource.description}
//                         </p>
//                       )}
//                       {resource.notes && (
//                         <p className="text-sm text-gray-500 mt-1 italic">
//                           {resource.notes}
//                         </p>
//                       )}
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

"use client"
import React, { useState, useEffect, useRef } from 'react';
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
  CheckCircle,
  Upload,
  X,
  Loader2,
  FileText,
  RefreshCcw
} from 'lucide-react';

import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { formConfig, CONSTANTS, RESOURCES } from '../lib/formConfig';
import { submitFormWithFiles } from '../lib/api';

export default function LegalClinicForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [progress, setProgress] = useState(0);
  const [visitedSteps, setVisitedSteps] = useState(new Set([0]));
  const [activeResources, setActiveResources] = useState(null);
  const [showEmergencyAlert, setShowEmergencyAlert] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [submitStatus, setSubmitStatus] = useState({ loading: false, error: null });
  const [showSuccess, setShowSuccess] = useState(false);
  const [submissionId, setSubmissionId] = useState(null);
  const fileInputRef = useRef(null);

  // Helper function to filter resources by category and criteria
  const filterResourcesByCategory = (resources, category, criteria = {}) => {
    return resources
      .filter(resource => resource.category === category)
      .filter(resource => {
        if (criteria.gender) {
          if (resource.notes?.toLowerCase().includes(`${criteria.gender} only`)) {
            return true;
          }
        }
        if (criteria.isFirstNations && resource.notes?.toLowerCase().includes('first nations')) {
          return true;
        }
        if (criteria.age && resource.notes) {
          if (criteria.age < 25 && resource.notes.toLowerCase().includes('youth')) {
            return true;
          }
        }
        return !resource.notes || 
              (!resource.notes.toLowerCase().includes('only') && 
               !resource.notes.toLowerCase().includes('first nations'));
      });
  };

  const resetForm = () => {
    setFormData({});
    setErrors({});
    setCurrentStep(0);
    setVisitedSteps(new Set([0]));
    setSelectedFiles([]);
    setSubmitStatus({ loading: false, error: null });
    setShowSuccess(false);
    setSubmissionId(null);
    setActiveResources(null);
    setShowEmergencyAlert(false);
  };

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

  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);
    setSelectedFiles(prev => [...prev, ...files]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeFile = (fileIndex) => {
    setSelectedFiles(prev => prev.filter((_, index) => index !== fileIndex));
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) {
      return;
    }

    setSubmitStatus({ loading: true, error: null });

    try {
      const response = await submitFormWithFiles(formData, selectedFiles);
      setSubmitStatus({ loading: true, error: null });
      setSubmissionId(response.submissionId);
      setShowSuccess(true);
      setSubmitStatus({ loading: false, error: null });
    } catch (error) {
      setSubmitStatus({ 
        loading: false, 
        error: 'Failed to submit form. Please try again.' 
      });
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
    
    // Initialize resources array
    let updatedResources = [];
    
    // Handle emergency situations
    if (name === 'immediateRisk') {
      if (value === 'yes') {
        setShowEmergencyAlert(true);
        updatedResources.push(...RESOURCES.emergency);
      } else {
        setShowEmergencyAlert(false);
        if (newData.shelterNeeded !== 'yes') {
          setActiveResources(null);
        }
      }
    }

    // Handle housing/shelter needs
    if (['shelterNeeded', 'housingStatus', 'housingType', 'residenceType'].includes(name)) {
      if (value === 'yes' || 
          value === 'emergency' || 
          value === 'temporary' || 
          value === 'homeless') {
        const shelterResources = filterResourcesByCategory(
          RESOURCES.shelters, 
          'shelters',
          {
            gender: newData.gender,
            isFirstNations: newData.isFirstNations,
            age: newData.age
          }
        );
        updatedResources.push(...shelterResources);
      }
    }

    // Handle First Nations specific resources
    if (name === 'isFirstNations' && value === true) {
      const firstNationsResources = filterResourcesByCategory(
        RESOURCES.firstNationsResources,
        'firstNationsResources'
      );
      updatedResources.push(...firstNationsResources);
    }

    // Handle rehabilitation needs
    if (name === 'rehabilitationNeeded' && value === 'yes') {
      const rehabResources = filterResourcesByCategory(
        RESOURCES.rehabilitation,
        'rehabilitation',
        {
          gender: newData.gender,
          age: newData.age
        }
      );
      updatedResources.push(...rehabResources);
    }

    // Handle legal services
    if (['legalAssistanceType', 'legalMatter'].includes(name)) {
      const legalResources = filterResourcesByCategory(
        RESOURCES.legalAndReferralServices,
        'legalAndReferralServices',
        {
          matter: value
        }
      );
      updatedResources.push(...legalResources);
    }

    // Update active resources
    if (updatedResources.length > 0) {
      // Remove duplicates
      const uniqueResources = Array.from(new Set(updatedResources.map(r => r.name)))
        .map(name => updatedResources.find(r => r.name === name));
      setActiveResources([
        ...(newData.immediateRisk === 'yes' ? RESOURCES.emergency : []),
        ...uniqueResources
      ]);
    } else if (!newData.immediateRisk === 'yes') {
      setActiveResources(null);
    }

    // Run field validation rules
    if (field?.validation?.rules) {
      for (const rule of field.validation.rules) {
        const result = rule(value, newData);
        if (!result.isValid) {
          setErrors(prev => ({
            ...prev,
            [name]: result.message
          }));
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

    // Special handling for checkbox groups
    if (field.type === 'checkbox-group') {
      return (
        <div className="space-y-3">
          {field.options.map(option => (
            <div
              key={option.value}
              className="flex items-center gap-2"
            >
              <input
                type="checkbox"
                id={`${field.name}-${option.value}`}
                checked={formData[field.name]?.includes(option.value) || false}
                onChange={(e) => {
                  const currentValues = formData[field.name] || [];
                  const newValues = e.target.checked
                    ? [...currentValues, option.value]
                    : currentValues.filter(v => v !== option.value);
                  handleFieldChange(field.name, newValues);
                }}
                className="w-4 h-4 rounded border-gray-300 text-blue-600"
              />
              <label htmlFor={`${field.name}-${option.value}`}>
                {option.label}
              </label>
            </div>
          ))}
        </div>
      );
    }

    // Special handling for number fields with currency
    if (field.type === 'number' && 
       (field.name.toLowerCase().includes('income') || 
        field.name.toLowerCase().includes('expense') || 
        field.name.toLowerCase().includes('assets'))) {
      return (
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
          <input
            type="number"
            value={formData[field.name] || ''}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            className={`${commonClasses} pl-8`}
            min="0"
            step="0.01"
          />
        </div>
      );
    }

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

  const SuccessModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="mt-4 text-2xl font-bold text-gray-900">
            Application Submitted Successfully
          </h2>
          <p className="mt-2 text-gray-600">
            Your application has been received. Reference ID: {submissionId}
          </p>
          <div className="mt-6 space-y-3">
            <button
              onClick={() => {
                window.location.href = '/thank-you';
              }}
              className="w-full px-4 py-2 text-sm font-medium text-white bg-green-600 
                rounded-lg hover:bg-green-700"
            >
              Continue to Thank You Page
            </button>
            <button
              onClick={() => {
                resetForm();
                setShowSuccess(false);
              }}
              className="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 
                rounded-lg hover:bg-gray-200 flex items-center justify-center gap-2"
            >
              <RefreshCcw className="w-4 h-4" />
              Submit Another Application
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 md:p-2">
      {showSuccess && <SuccessModal />}
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center bg-white rounded-xl shadow-sm">
          <Card className="mb-4">
            <CardHeader>
              <CardTitle className="text-2xl text-center text-red-800">
                {formConfig.metadata.clinic.name}
              </CardTitle>
              <CardDescription className="text-center">
                Phone: {formConfig.metadata.clinic.phone} • Email: {formConfig.metadata.clinic.email} • {formConfig.metadata.clinic.address}
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Progress bar */}
        <div className="mb-4">
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
                  <span className="text-xs mt-2 font-medium hidden md:block">
                    {step.title}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Emergency alert */}
        {showEmergencyAlert && (
          <div className="mb-6">
            <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-red-800 text-lg">
                    Emergency Assistance Required
                  </h3>
                  <p className="text-red-700 mt-1">
                    If you are in immediate danger, please call 911 or your local emergency services immediately.
                  </p>
                  <div className="mt-4 bg-white rounded-lg p-4 border border-red-200">
                    <h4 className="font-medium text-red-800 mb-2">Emergency Contacts:</h4>
                    <div className="space-y-2">
                      {RESOURCES.emergency.map((resource, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <Phone className="w-4 h-4 text-red-600 mt-1" />
                          <div>
                            <p className="font-medium text-red-800">{resource.name}</p>
                            <p className="text-red-600">{resource.phoneNumber}</p>
                            {resource.description && (
                              <p className="text-sm text-red-700">{resource.description}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main content grid */}
        <div className="grid md:grid-cols-[2fr,1fr] gap-8">
          {/* Main form */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
            {/* Step header */}
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center gap-3">
                {getIcon(currentStepConfig.icon)}
                <h2 className="text-xl font-medium text-gray-900">
                  {currentStepConfig.title}
                </h2>
                {currentStepConfig.critical && (
                  <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                    Critical
                  </span>
                )}
              </div>
              {currentStepConfig.guidance && (
                <p className="text-gray-600 text-sm mt-2">
                  {currentStepConfig.guidance}
                </p>
              )}
            </div>

            {/* Form fields */}
            <div className="p-6">
              <div className="max-h-[60vh] overflow-y-auto pr-4 space-y-6">
                {currentStepConfig.fields.map(field => (
                  <div key={field.name} className="mb-8 last:mb-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <label className="block text-sm font-medium text-gray-700">
                        {field.label}
                        {field.required && (
                          <span className="text-red-500 ml-1">*</span>
                        )}
                      </label>
                      {field.guidance && (
                        <div className="group relative">
                          <Info className="w-4 h-4 text-gray-400 cursor-help" />
                          <div className="absolute right-0 w-64 p-2 bg-gray-800 text-white text-xs rounded-lg 
                            opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none">
                            {field.guidance}
                          </div>
                        </div>
                      )}
                    </div>

                    {renderField(field)}

                    {errors[field.name] && (
                      <div className="mt-2 text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        <span>{errors[field.name]}</span>
                      </div>
                    )}
                  </div>
                ))}

                {/* File upload section on last step */}
                {currentStep === formConfig.steps.length - 1 && (
                  <div className="mt-8 border-t border-gray-200 pt-6">
                    <h3 className="text-sm font-medium text-gray-900 mb-4">
                      Supporting Documents
                    </h3>
                    <div className="space-y-4">
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                        <input
                          type="file"
                          ref={fileInputRef}
                          onChange={handleFileSelect}
                          multiple
                          className="hidden"
                          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                        />
                        <div className="text-center">
                          <FileText className="mx-auto h-12 w-12 text-gray-400" />
                          <div className="mt-4 flex text-sm leading-6 text-gray-600 justify-center">
                            <button
                              type="button"
                              onClick={() => fileInputRef.current?.click()}
                              className="relative font-semibold text-red-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-red-600 focus-within:ring-offset-2 hover:text-red-500"
                            >
                              Choose files
                            </button>
                            <p className="pl-1">or drag and drop</p>
                          </div>
                          <p className="text-xs leading-5 text-gray-600">
                            PDF, DOC, DOCX, JPG, JPEG, or PNG up to 10MB each
                          </p>
                        </div>
                      </div>

                      {/* File list */}
                      {selectedFiles.length > 0 && (
                        <ul className="divide-y divide-gray-100 rounded-md border border-gray-200">
                          {selectedFiles.map((file, index) => (
                            <li key={index} className="flex items-center justify-between py-4 px-4 text-sm">
                              <div className="flex items-center gap-2">
                                <FileText className="h-5 w-5 flex-none text-gray-400" />
                                <div className="min-w-0 flex-auto">
                                  <p className="text-sm font-medium text-gray-900">{file.name}</p>
                                  <p className="text-xs text-gray-500">
                                    {(file.size / 1024 / 1024).toFixed(2)} MB
                                  </p>
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={() => removeFile(index)}
                                className="ml-4 flex-none text-gray-400 hover:text-red-500"
                              >
                                <X className="h-5 w-5" />
                              </button>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Navigation */}
              <div className="flex justify-between mt-8 pt-6 border-t border-gray-100">
                <button
                  type="button"
                  onClick={handlePrevious}
                  disabled={currentStep === 0}
                  className={`
                    px-4 py-2 rounded-lg flex items-center gap-2
                    ${currentStep === 0 
                      ? 'text-gray-400 cursor-not-allowed' 
                      : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'}
                  `}
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </button>

                {currentStep === formConfig.steps.length - 1 ? (
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={submitStatus.loading}
                    className="px-6 py-2 text-sm font-medium text-white bg-red-600 
                      rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center gap-2"
                  >
                    {submitStatus.loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        Submit Application
                        <ChevronRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="px-4 py-2 text-sm font-medium text-white bg-red-600 
                      rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center gap-2"
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Side panel */}
          <div className="space-y-6">
            {/* Form progress */}
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h3 className="text-sm font-medium text-gray-900 mb-4 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-gray-500" />
                Form Progress
              </h3>
              <div className="space-y-2">
                {formConfig.steps.map((step, index) => (
                  <div
                    key={step.id}
                    className={`
                      flex items-center gap-2 p-2 rounded-lg text-sm
                      ${currentStep === index 
                        ? 'bg-red-50 text-red-700' 
                        : visitedSteps.has(index) 
                        ? 'text-gray-900' 
                        : 'text-gray-400'}
                    `}
                  >
                    <span className={`
                      w-5 h-5 rounded-full flex items-center justify-center text-xs
                      ${visitedSteps.has(index) 
                        ? 'bg-green-100 text-green-700' 
                        : 'border border-current'}
                    `}>
                      {visitedSteps.has(index) ? '✓' : index + 1}
                    </span>
                    {step.title}
                  </div>
                ))}
              </div>
            </div>

            {/* Required Documents */}
            {currentStepConfig.requiredDocuments && (
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <h3 className="text-sm font-medium text-gray-900 mb-4 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-gray-500" />
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

            {/* Resources */}
            {activeResources && (
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <h3 className="text-sm font-medium text-gray-900 mb-4 flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gray-500" />
                  Available Resources
                </h3>
                {Object.entries(
                  activeResources.reduce((acc, resource) => {
                    const category = resource.category || 'other';
                    acc[category] = acc[category] || [];
                    acc[category].push(resource);
                    return acc;
                  }, {})
                ).map(([category, resources]) => (
                  <div key={category} className="mb-6 last:mb-0">
                    <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">
                      {category.replace(/([A-Z])/g, ' $1').trim()}
                    </h4>
                    <div className="space-y-4">
                      {resources.map((resource, index) => (
                        <div 
                          key={index} 
                          className="bg-gray-50 rounded-lg p-4 border border-gray-100 hover:border-gray-200 transition-colors"
                        >
                          <h4 className="font-medium text-gray-900 flex items-center justify-between">
                            {resource.name}
                            {resource.category && (
                              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                                {resource.category.replace(/([A-Z])/g, ' $1').trim()}
                              </span>
                            )}
                          </h4>
                          {resource.phoneNumber && (
                            <p className="text-sm text-red-600 mt-1 flex items-center gap-2">
                              <Phone className="w-4 h-4" />
                              <a 
                                href={`tel:${resource.phoneNumber.replace(/[^0-9]/g, '')}`}
                                className="hover:text-red-700 transition-colors"
                              >
                                {resource.phoneNumber}
                              </a>
                            </p>
                          )}
                          {resource.location && (
                            <p className="text-sm text-gray-600 mt-1 flex items-center gap-2">
                              <Home className="w-4 h-4 text-gray-400" />
                              {resource.location}
                            </p>
                          )}
                          {resource.description && (
                            <p className="text-sm text-gray-500 mt-2">
                              {resource.description}
                            </p>
                          )}
                          {resource.email && (
                            <p className="text-sm text-gray-600 mt-1">
                              Email: {resource.email}
                            </p>
                          )}
                          {resource.notes && (
                            <div className="mt-2 text-xs bg-yellow-50 text-yellow-700 p-2 rounded-md flex items-start gap-2">
                              <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
                              <span>{resource.notes}</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}