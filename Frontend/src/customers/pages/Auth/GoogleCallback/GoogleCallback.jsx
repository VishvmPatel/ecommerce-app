import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../../contexts/AuthContext';

const GoogleCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { googleLogin } = useAuth();
  const [status, setStatus] = useState('Processing...');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const handleGoogleCallback = async () => {
      if (isProcessing) {
        console.log('Already processing, skipping...');
        return;
      }
      setIsProcessing(true);

      try {
        const code = searchParams.get('code');
        const error = searchParams.get('error');
        const state = searchParams.get('state');

        if (error) {
          console.error('Google OAuth error:', error);
          setStatus('Authentication failed');
          setTimeout(() => {
            navigate('/login');
          }, 2000);
          return;
        }

        if (!code) {
          console.error('No authorization code received');
          setStatus('No authorization code received');
          setTimeout(() => {
            navigate('/login');
          }, 2000);
          return;
        }

        setStatus('Exchanging code for token...');

        console.log('Google callback - Code:', code ? 'Present' : 'Missing');
        console.log('Google callback - State:', state);

        const response = await fetch('http://localhost:5000/api/auth/google-callback', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ code, state })
        });

        console.log('Google callback - Response status:', response.status);
        console.log('Google callback - Response ok:', response.ok);

        if (!response.ok) {
          const errorData = await response.json();
          console.error('Google callback - API Error:', errorData);
          setStatus('API Error: ' + (errorData.message || 'Unknown error'));
          setTimeout(() => {
            navigate('/login');
          }, 2000);
          return;
        }

        const data = await response.json();
        console.log('Google callback - Response data:', data);

        if (data.success) {
          setStatus('Authentication successful! Redirecting...');
          
          console.log('Google callback - User data:', data.user);
          console.log('Google callback - Token:', data.token ? 'Present' : 'Missing');
          
          localStorage.setItem('authToken', data.token);
          localStorage.setItem('user', JSON.stringify(data.user));
          
          try {
            const loginResult = await googleLogin(data.user, data.token);
            console.log('Google login result:', loginResult);
            
            if (loginResult.success) {
              console.log('Login successful, redirecting to home page...');
              setTimeout(() => {
                window.location.href = '/';
              }, 1000);
            } else {
              console.error('Google login failed:', loginResult.error);
              setTimeout(() => {
                window.location.href = '/';
              }, 1000);
            }
          } catch (loginError) {
            console.error('Error during Google login:', loginError);
            setTimeout(() => {
              window.location.href = '/';
            }, 1000);
          }
        } else {
          setStatus('Authentication failed');
          console.error('Backend authentication failed:', data.message);
          setTimeout(() => {
            navigate('/login');
          }, 2000);
        }

      } catch (error) {
        console.error('Callback error:', error);
        console.error('Error details:', {
          message: error.message,
          stack: error.stack,
          name: error.name
        });
        setStatus('An error occurred: ' + error.message);
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } finally {
        setIsProcessing(false);
      }
    };

    handleGoogleCallback();
  }, [searchParams, navigate, googleLogin, isProcessing]);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <div className="mb-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Google Sign-In</h2>
        <p className="text-gray-600">{status}</p>
        <p className="text-sm text-gray-500 mt-4">This window will close automatically...</p>
      </div>
    </div>
  );
};

export default GoogleCallback;