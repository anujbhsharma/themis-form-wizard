// intake-editor/formHelper.js

export async function saveFormData(formData) {
  try {
    console.log('Saving form data:', formData);
    const response = await fetch('./api/eligibility', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });
    console.log('THE METHOD:', response.method);
    console.log('THE HEADER:', response.headers);
    console.log('THE BODY:', response.body);
    console.log('THE FULL RESPONSE:', response);
    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.error || 'Failed to save data');
    }

    return { success: true, data: result };
  } catch (error) {
    console.error('Error saving form data (QUACK):', error);
    return { success: false, error: error.message };
  }
}

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