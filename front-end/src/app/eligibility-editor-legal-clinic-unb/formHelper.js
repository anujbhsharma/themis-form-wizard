// intake-editor/formHelper.js

const cors = require('cors');



const allowedOrigin = 'http://localhost:3001/eligibility';

export async function saveFormData(formData) {
  try {
    console.log('Saving form data:', formData);
    // const db = await connectDB();
    // const response = await db.collection('eligibility').insertOne({
    //   ...formData.body,
    //   createdAt: new Date()
    // });
    const response = await fetch(allowedOrigin, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    const result = await response.json();
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
    const response = await fetch('http://localhost:3001/eligibility');
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