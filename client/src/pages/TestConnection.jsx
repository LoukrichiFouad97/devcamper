import { useEffect, useState } from 'react';
import axios from 'axios';

const TestConnection = () => {
  const [status, setStatus] = useState('Testing connection...');
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    testConnection();
  }, []);

  const testConnection = async () => {
    try {
      console.log('Making request to: /api/v1/bootcamps');
      const response = await axios.get('/api/v1/bootcamps');
      console.log('Response:', response.data);
      setStatus('✅ Successfully connected to backend!');
      setData(response.data);
      setError(null);
    } catch (error) {
      console.error('Connection error:', error);
      setStatus('❌ Failed to connect to backend');
      setError({
        message: error.message,
        code: error.code,
        url: error.config?.url,
        status: error.response?.status,
        statusText: error.response?.statusText,
        responseData: error.response?.data,
      });
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="card">
        <h2 className="text-2xl font-bold mb-4">Connection Test</h2>
        <p className="text-lg mb-4">{status}</p>
        
        {error && (
          <div className="bg-red-50 border border-red-200 p-4 rounded mb-4">
            <p className="font-semibold text-red-700 mb-2">Error Details:</p>
            <pre className="text-sm overflow-auto bg-white p-2 rounded">
              {JSON.stringify(error, null, 2)}
            </pre>
          </div>
        )}
        
        {data && (
          <div className="bg-green-50 border border-green-200 p-4 rounded">
            <p className="font-semibold text-green-700 mb-2">Backend Response:</p>
            <pre className="text-sm overflow-auto bg-white p-2 rounded max-h-96">
              {JSON.stringify(data, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default TestConnection;
