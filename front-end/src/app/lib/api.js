// // api.js
// import { getApiUrl } from './config';
// export const submitFormWithFiles = async (formData, files) => {
//     try {
//       // Create FormData instance
//       const submitData = new FormData();
      
//       // Add form data as a string
//       submitData.append('formData', JSON.stringify(formData));
      
//       // Add files with unique names
//       if (files && files.length > 0) {
//         files.forEach((file, index) => {
//           submitData.append(`files`, file); // Keep the field name as 'files'
//         });
//       }
  
//       const response = await fetch(`https://back-end-legal-clinic.onrender.com/api/submit`, {
//         method: 'POST',
//         body: submitData,
//         // Don't set Content-Type header - browser will set it with boundary
//       });
  
//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.error || 'Form submission failed');
//       }
  
//       const data = await response.json();
//       return data;
//     } catch (error) {
//       console.error('Error submitting form:', error);
//       throw error;
//     }
//   };

//   // api.js
//   export const submitFormWithOutFiles = async (formData) => {
//     try {
//       // Create FormData instance
//       const submitData = new FormData();
      
//       // Add form data as a string
//       submitData.append('formData', JSON.stringify(formData));
      
//       const response = await fetch(`https://back-end-legal-clinic.onrender.com/api/submitintake`, {
//         method: 'POST',
//         body: submitData,
//       });
//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.error || 'Form submission failed');
//       }
//       const data = await response.json();
//       return data;
//     } catch (error) {
//       console.error('Error submitting form:', error);
//       throw error;
//     }
//   };

// api.js

// Helper function to handle retries and timeouts
const fetchWithRetry = async (url, options, maxRetries = 3) => {
  let lastError;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Accept': 'application/json',
          ...options.headers
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Request failed');
      }

      return response;
    } catch (error) {
      lastError = error;
      if (attempt === maxRetries) break;
      
      // Wait before retrying (1s, 2s, 4s)
      await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
      console.log(`Retry attempt ${attempt} of ${maxRetries}`);
    }
  }
  throw lastError;
};

export const submitFormWithFiles = async (formData, files) => {
  try {
    if (!navigator.onLine) {
      throw new Error('No internet connection. Please check your connection and try again.');
    }

    const submitData = new FormData();
    submitData.append('formData', JSON.stringify(formData));
    
    if (files && files.length > 0) {
      files.forEach((file) => {
        submitData.append('files', file);
      });
    }

    const response = await fetchWithRetry(
      'https://back-end-legal-clinic.onrender.com/api/submit',
      {
        method: 'POST',
        body: submitData,
      }
    );

    return await response.json();
  } catch (error) {
    console.error('Error submitting form:', error);
    // Provide more user-friendly error messages
    if (error.message.includes('Failed to fetch')) {
      throw new Error('Server is not responding. Please try again later.');
    }
    throw new Error(error.message || 'Failed to submit form. Please try again.');
  }
};

export const submitFormWithOutFiles = async (formData) => {
  try {
    if (!navigator.onLine) {
      throw new Error('No internet connection. Please check your connection and try again.');
    }

    const submitData = new FormData();
    submitData.append('formData', JSON.stringify(formData));
    
    const response = await fetchWithRetry(
      'https://back-end-legal-clinic.onrender.com/api/submitintake',
      {
        method: 'POST',
        body: submitData,
      }
    );

    return await response.json();
  } catch (error) {
    console.error('Error submitting form:', error);
    // Provide more user-friendly error messages
    if (error.message.includes('Failed to fetch')) {
      throw new Error('Server is not responding. Please try again later.');
    }
    throw new Error(error.message || 'Failed to submit form. Please try again.');
  }
};