import React, { useEffect, useRef, useState } from 'react';

const GoogleSignInButton = ({ text = 'Continue with Google' }) => {
  const buttonRef = useRef(null);
  const [isGoogleLoaded, setIsGoogleLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const clientId = '947662455533-qoqhict2l8ajf8m8b4vf255ehkcdvvpj.apps.googleusercontent.com';

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      setIsGoogleLoaded(true);
      initializeGoogleAuth();
    };
    script.onerror = () => {
      console.error('Failed to load Google Sign-In script');
    };
    document.head.appendChild(script);

    return () => {
      const existingScript = document.querySelector('script[src="https://accounts.google.com/gsi/client"]');
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, []);

  const initializeGoogleAuth = () => {
    if (!window.google) return;

    window.google.accounts.id.initialize({
      client_id: clientId,
      callback: handleCredentialResponse,
      auto_select: false,
      cancel_on_tap_outside: true,
      use_fedcm_for_prompt: false, // Disable FedCM to avoid browser issues
      itp_support: true // Enable ITP support for better compatibility
    });
  };

  const handleCredentialResponse = async (response) => {
    setIsLoading(true);
    try {
      console.log('Google Sign-In Response:', response);
      
      const result = await fetch('http://localhost:5000/api/auth/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ credential: response.credential })
      });

      const data = await result.json();
      
      if (data.success) {
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        window.location.href = '/';
      } else {
        console.error('Google Sign-In failed:', data.message);
        alert('Google Sign-In failed. Please try again.');
      }
    } catch (error) {
      console.error('Error during Google Sign-In:', error);
      alert('An error occurred during Google Sign-In. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleButtonClick = () => {
    if (!isGoogleLoaded) {
      alert('Google Sign-In is still loading. Please wait a moment and try again.');
      return;
    }

    if (!window.google) {
      alert('Google Sign-In is not available. Please refresh the page and try again.');
      return;
    }

    try {
      window.google.accounts.id.prompt();
    } catch (error) {
      console.error('Error opening Google Sign-In:', error);
      alert('Failed to open Google Sign-In. Please try again.');
    }
  };

  return (
    <div className="w-full">
      <button
        ref={buttonRef}
        onClick={handleButtonClick}
        disabled={isLoading || !isGoogleLoaded}
        className="w-full flex justify-center items-center px-4 py-3 border border-gray-300 rounded-xl shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600 mr-2"></div>
            Signing in...
          </>
        ) : (
          <>
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
            {text}
          </>
        )}
      </button>
      
      {/* Debug info */}
      <div className="mt-2 text-xs text-gray-500 text-center">
        Google Script: {isGoogleLoaded ? '✅ Loaded' : '⏳ Loading...'}
      </div>
    </div>
  );
};

export default GoogleSignInButton;
