import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

const GoogleCallbackDebug = () => {
  const [searchParams] = useSearchParams();
  const [debugInfo, setDebugInfo] = useState({});

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
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Google OAuth Debug Info</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">URL Parameters</h2>
          <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
            {JSON.stringify(debugInfo, null, 2)}
          </pre>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4">Next Steps</h2>
          <div className="space-y-2">
            <p><strong>Code:</strong> {debugInfo.code}</p>
            <p><strong>Error:</strong> {debugInfo.error}</p>
            <p><strong>State:</strong> {debugInfo.state}</p>
            
            {debugInfo.code && debugInfo.code !== 'No code' ? (
              <div className="mt-4 p-4 bg-green-100 rounded">
                <p className="text-green-800 font-semibold">✅ Authorization code received!</p>
                <p className="text-green-700">The OAuth flow should proceed automatically.</p>
              </div>
            ) : (
              <div className="mt-4 p-4 bg-red-100 rounded">
                <p className="text-red-800 font-semibold">❌ No authorization code</p>
                <p className="text-red-700">Check Google Cloud Console redirect URI settings.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoogleCallbackDebug;



