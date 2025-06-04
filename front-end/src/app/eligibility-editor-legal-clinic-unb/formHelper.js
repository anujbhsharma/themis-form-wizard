// intake-editor/formHelper.js
// import { createRequire } from "module";
// const require = createRequire(import.meta.url);
//import clientPromise from '../../lib/mongodb'
const cors = require('cors');
const allowedOrigin = '/api/eligibility';

export async function saveFormData(formData) {
  try {
    const { _id, ...safeData } = formData; 
    console.log('Saving form data:', safeData);
    const response = await fetch(allowedOrigin, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(safeData),
    });

    const result = await response.json();
    console.log('Insert result:', result);
    if (!response.ok) {
      throw new Error(result.error || 'Failed to save data');
    }

    return { success: true, data: result };
  } catch (error) {
    console.error('Error saving form data (HELLO):', error);
    return { success: false, error: error.message };
  }
}

export async function getFormData() {
  try {
    const response = await fetch(allowedOrigin);
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

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': allowedOrigin,
    },
  })
}