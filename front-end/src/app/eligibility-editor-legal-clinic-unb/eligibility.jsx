import React, { useState, useEffect } from 'react';

function ConfigPage() {
  const [configs, setConfigs] = useState([]);
  const [formData, setFormData] = useState({
    CONSTANTS: {
      INCOME: {
        MIN_ANNUAL: 0,
        MAX_ANNUAL: 0,
        PER_DEPENDENT: 0
      },
      AGE: {
        MIN: 0,
        MAX: 0
      },
      HOUSEHOLD: {
        MAX_DEPENDENTS: 0,
        MIN_SIZE: 0,
        MAX_SIZE: 0
      }
    },
    MONTHLY_THRESHOLDS: {}
  });

  // Fetch all configs on load
  useEffect(() => {
    fetch('http://localhost:3000/eligibility')
      .then(res => res.json())
      .then(data => setConfigs(data))
      .catch(err => console.error('Error fetching configs:', err));
  }, []);

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch('http://localhost:3000/eligibility', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });

    const result = await response.json();
    console.log('Inserted ID:', result.insertedId);
  };

  return (
    <div>
      <h1>Config Manager</h1>
      <button onClick={handleSubmit}>Submit Config</button>

      <h2>All Configs</h2>
      <pre>{JSON.stringify(configs, null, 2)}</pre>
    </div>
  );
}

export default ConfigPage;