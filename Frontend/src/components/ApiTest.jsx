import { useState } from 'react';
import apiService from '../services/api';

const ApiTest = () => {
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');

  const testConnection = async () => {
    setStatus('Testing connection...');
    setError('');
    
    try {
      const response = await apiService.healthCheck();
      setStatus(`✅ Backend connected! ${response.message}`);
    } catch (err) {
      setError(`❌ Connection failed: ${err.message}`);
      setStatus('');
    }
  };

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', margin: '20px' }}>
      <h3>Backend API Test</h3>
      <button onClick={testConnection}>Test Backend Connection</button>
      {status && <p style={{ color: 'green' }}>{status}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default ApiTest; 