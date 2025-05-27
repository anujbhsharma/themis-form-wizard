// intake-editor/formHelper.js
import axios from 'axios';

export async function saveFormData(formData) {
  try {
    const response = await axios.post('http://localhost:4000/api/eligibility', formData);
    return response.data;
  } catch (error) {
    console.error("Error posting data (DUCK):", error);
    console.error('Error response data:', error.response.data);
      console.error('Error response status:', error.response.status);
      console.error('Error response headers:', error.response.headers);
    throw error; // Re-throw the error to be handled by the caller
  }
}
  //   const result = await response.json();
  //   console.log('THE METHOD:', response.method);
  //   console.log('THE HEADER:', response.headers);
  //   console.log('THE BODY:', response.body);
  //   console.log('THE FULL RESPONSE:', response);
  //   console.log('THE Result:', result);
  //   if (!response.ok) {
  //     throw new Error(result.error || 'Failed to save data');
  //   }
  //   return { success: true, data: result };

export async function getFormData() {
  try {
    const response = await fetch('/api/eligibility');
    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.error || 'Failed to load data');
    }

    return { success: true, data: result };
  } catch (error) {
    console.error('Error loading form data:', error);
    return { success: false, error: error.message };
  }
}