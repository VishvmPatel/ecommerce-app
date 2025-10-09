import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

const GoogleCallbackTest = () => {
  const [searchParams] = useSearchParams();
  const [debugInfo, setDebugInfo] = useState({});
  const [testResult, setTestResult] = useState(null);

  useEffect(() => {
    const code = searchParams.get('code');
    const error = searchParams.get('error');
    const state = searchParams.get('state');

    setDebugInfo({
      code: code ? `${code.substring(0, 20)}...` : 'No code',
      error: error || 'No error',
      state: state || 'No state',
      allParams: Object.fromEntries(searchParams.entries()),
      url: window.location.href
    });

    if (code) {
      testGoogleCallback(code, state);
    }
  }, [searchParams]);

  const testGoogleCallback = async (code, state) => {
    try {
      setTestResult({ status: 'Testing...', loading: true });

      console.log('Testing Google callback with code:', code.substring(0, 20) + '...');

      const response = await fetch('http://localhost:5000/api/auth/google-callback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code, state })
      });

      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);

      const data = await response.json();
      console.log('Response data:', data);

      setTestResult({
        status: response.ok ? 'Success' : 'Failed',
        loading: false,
        response: {
          status: response.status,
          ok: response.ok,
          data: data
        }
      });

    } catch (error) {
      console.error('Test error:', error);
      setTestResult({
        status: 'Error',
        loading: false,
        error: {
          message: error.message,
          stack: error.stack
        }
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Google OAuth Callback Test</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">URL Parameters</h2>
          <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
            {JSON.stringify(debugInfo, null, 2)}
          </pre>
        </div>

        {testResult && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4">API Test Result</h2>
            <div className="mb-4">
              <p><strong>Status:</strong> 
                <span className={`ml-2 px-2 py-1 rounded text-sm ${
                  testResult.status === 'Success' ? 'bg-green-100 text-green-800' :
                  testResult.status === 'Failed' ? 'bg-red-100 text-red-800' :
                  testResult.status === 'Error' ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {testResult.status}
                </span>
              </p>
              {testResult.loading && <p className="text-blue-600">Loading...</p>}
            </div>
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
              {JSON.stringify(testResult, null, 2)}
            </pre>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4">Instructions</h2>
          <div className="space-y-2">
            <p>1. Go to the login page</p>
            <p>2. Click "Continue with Google (Alternative)"</p>
            <p>3. Complete Google authentication</p>
            <p>4. You should be redirected to this page</p>
            <p>5. Check the results above</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoogleCallbackTest;
