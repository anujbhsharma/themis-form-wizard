// intake-editor/formHelper.js
const cors = require('cors');

const allowedOrigin = 'http://localhost:3001/eligibility';

export async function saveFormData(formData) {
  try {
    //DELETE OLD DOCUMENTS (Only three documents will be in the
    //collection at one time)
    // const recentDocs = await collection.find()
    //   .sort({ createdAt: -1 }) 
    //   .limit(2)
    //   .toArray();

    // const recentIds = recentDocs.map(doc => doc._id);
    // await collection.deleteMany({ _id: { $nin: recentIds } });

    console.log('Saving form data:', safeData);
    const response = await fetch(allowedOrigin, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(safeData),
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