import React, { useEffect, useState } from 'react';
import SimpleGoogleSignIn from '../../components/SimpleGoogleSignIn/SimpleGoogleSignIn';

const GoogleSignInTest = () => {
  const [isGoogleLoaded, setIsGoogleLoaded] = useState(false);
  const [logs, setLogs] = useState([]);

  const addLog = (message) => {
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  useEffect(() => {
    addLog('Starting Google Sign-In test...');
    
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    
    script.onload = () => {
      addLog('Google script loaded successfully');
      setIsGoogleLoaded(true);
      
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: '947662455533-qoqhict2l8ajf8m8b4vf255ehkcdvvpj.apps.googleusercontent.com',
          callback: (response) => {
            addLog('Google Sign-In response received');
            addLog(`Credential length: ${response.credential.length}`);
            console.log('Google Response:', response);
          },
          auto_select: false,
          cancel_on_tap_outside: true,
          use_fedcm_for_prompt: false // Disable FedCM to avoid browser issues
        });
        addLog('Google Auth initialized');
      } else {
        addLog('ERROR: window.google not available');
      }
    };
    
    script.onerror = () => {
      addLog('ERROR: Failed to load Google script');
    };
    
    document.head.appendChild(script);
    addLog('Google script added to document head');

    return () => {
      const existingScript = document.querySelector('script[src="https://accounts.google.com/gsi/client"]');
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, []);

  const handleGoogleSignIn = () => {
    addLog('Google Sign-In button clicked');
    
    if (!isGoogleLoaded) {
      addLog('ERROR: Google script not loaded yet');
      return;
    }

    if (!window.google) {
      addLog('ERROR: window.google not available');
      return;
    }

    try {
      addLog('Opening Google Sign-In popup...');
      window.google.accounts.id.prompt();
    } catch (error) {
      addLog(`ERROR: ${error.message}`);
    }
  };

  const clearLogs = () => {
    setLogs([]);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Google Sign-In Test</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Test Google Sign-In (GSI Method)</h2>
          
          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-2">
              Status: {isGoogleLoaded ? '✅ Google Script Loaded' : '⏳ Loading...'}
            </p>
            <p className="text-sm text-gray-600 mb-4">
              Client ID: 947662455533-qoqhict2l8ajf8m8b4vf255ehkcdvvpj.apps.googleusercontent.com
            </p>
          </div>

          <button
            onClick={handleGoogleSignIn}
            disabled={!isGoogleLoaded}
            className="w-full flex justify-center items-center px-4 py-3 border border-gray-300 rounded-xl shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Test Google Sign-In (GSI)
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Test Google Sign-In (Alternative Method)</h2>
          <p className="text-sm text-gray-600 mb-4">
            This method uses OAuth popup instead of GSI to avoid FedCM issues
          </p>
          <SimpleGoogleSignIn />
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Debug Logs</h2>
            <button
              onClick={clearLogs}
              className="px-3 py-1 bg-gray-200 text-gray-700 rounded text-sm hover:bg-gray-300"
            >
              Clear Logs
            </button>
          </div>
          
          <div className="bg-gray-50 rounded p-4 h-64 overflow-y-auto">
            {logs.length === 0 ? (
              <p className="text-gray-500 text-sm">No logs yet...</p>
            ) : (
              logs.map((log, index) => (
                <div key={index} className="text-sm font-mono text-gray-700 mb-1">
                  {log}
                </div>
              ))
            )}
          </div>
        </div>

        <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="font-semibold text-yellow-800 mb-2">Troubleshooting Tips:</h3>
          <ul className="text-sm text-yellow-700 space-y-1">
            <li>• Check browser console (F12) for any errors</li>
            <li>• Make sure you're on localhost:5173</li>
            <li>• Verify Google Cloud Console settings</li>
            <li>• Check if popup blockers are enabled</li>
            <li>• Try refreshing the page if Google script fails to load</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default GoogleSignInTest;
