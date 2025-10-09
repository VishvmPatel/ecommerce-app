import React, { useEffect, useState } from 'react';
import { useAuth } from '../../../../contexts/AuthContext';

const GoogleAuthTest = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const [authState, setAuthState] = useState({});

  useEffect(() => {
    const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
    const storedUser = localStorage.getItem('user');
    
    setAuthState({
      hasToken: !!token,
      tokenValue: token ? `${token.substring(0, 20)}...` : 'No token',
      hasStoredUser: !!storedUser,
      storedUser: storedUser ? JSON.parse(storedUser) : null,
      isAuthenticated,
      user
    });
  }, [isAuthenticated, user]);

  const handleLogout = () => {
    logout();
    setAuthState({});
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Google Authentication Test</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Authentication State</h2>
          <div className="space-y-2">
            <p><strong>Is Authenticated:</strong> {isAuthenticated ? '✅ Yes' : '❌ No'}</p>
            <p><strong>User:</strong> {user ? `${user.firstName} ${user.lastName} (${user.email})` : 'None'}</p>
            <p><strong>Has Token:</strong> {authState.hasToken ? '✅ Yes' : '❌ No'}</p>
            <p><strong>Token:</strong> {authState.tokenValue}</p>
            <p><strong>Has Stored User:</strong> {authState.hasStoredUser ? '✅ Yes' : '❌ No'}</p>
            {authState.storedUser && (
              <p><strong>Stored User:</strong> {authState.storedUser.firstName} {authState.storedUser.lastName}</p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Actions</h2>
          <div className="space-x-4">
            <a 
              href="/login" 
              className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
            >
              Go to Login
            </a>
            <a 
              href="/signup" 
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Go to Signup
            </a>
            {isAuthenticated && (
              <button 
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Logout
              </button>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4">Raw Data</h2>
          <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
            {JSON.stringify(authState, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default GoogleAuthTest;

