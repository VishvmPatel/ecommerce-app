import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { KeyIcon, ArrowLeftIcon, CheckCircleIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import apiService from '../../../../services/api';

const OTPVerificationPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [otp, setOtp] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [otpError, setOtpError] = useState('');

  useEffect(() => {
    // Get email from location state or redirect to forgot password
    if (location.state?.email) {
      setEmail(location.state.email);
    } else {
      navigate('/forgot-password');
    }
  }, [location.state, navigate]);

  const validateOTP = (otp) => {
    const otpRegex = /^[0-9]{6}$/;
    return otpRegex.test(otp);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Reset errors
    setError('');
    setOtpError('');

    // Validate OTP
    if (!otp.trim()) {
      setOtpError('OTP is required');
      return;
    }

    if (!validateOTP(otp)) {
      setOtpError('OTP must be exactly 6 digits');
      return;
    }

    setLoading(true);

    try {
      const response = await apiService.verifyOTP(email, otp);
      
      if (response.success) {
        setSuccess(true);
        // Redirect to reset password page after 2 seconds
        setTimeout(() => {
          navigate('/reset-password', { 
            state: { 
              email: email, 
              otp: otp,
              verified: true 
            } 
          });
        }, 2000);
      } else {
        setError(response.message || 'Invalid OTP');
      }
    } catch (error) {
      console.error('OTP verification error:', error);
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError('Failed to verify OTP. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOTPChange = (e) => {
    const value = e.target.value.replace(/\D/g, ''); // Only allow digits
    if (value.length <= 6) {
      setOtp(value);
      if (otpError) {
        setOtpError('');
      }
    }
  };

  const handleResendOTP = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await apiService.forgotPassword(email);
      if (response.success) {
        setError('');
        alert('New OTP sent to your email!');
      } else {
        setError('Failed to resend OTP. Please try again.');
      }
    } catch (error) {
      setError('Failed to resend OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-3xl shadow-2xl p-8 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
              <CheckCircleIcon className="w-10 h-10 text-green-600" />
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              OTP Verified!
            </h1>
            
            <p className="text-lg text-gray-600 mb-6">
              Your OTP has been verified successfully. Redirecting to password reset...
            </p>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
              <p className="text-sm text-blue-600 font-medium">
                ⏰ Redirecting to password reset page in 2 seconds...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-3xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4">
              <KeyIcon className="w-8 h-8 text-purple-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Enter OTP
            </h1>
            <p className="text-gray-600">
              We've sent a 6-digit OTP to <span className="font-semibold text-purple-600">{email}</span>
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
              <div className="flex items-center">
                <ExclamationTriangleIcon className="w-5 h-5 text-red-600 mr-2" />
                <p className="text-sm text-red-800">{error}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-2">
                Enter 6-digit OTP
              </label>
              <input
                type="text"
                id="otp"
                value={otp}
                onChange={handleOTPChange}
                placeholder="123456"
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors duration-200 text-center text-2xl font-mono tracking-widest ${
                  otpError ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
                maxLength={6}
                autoComplete="off"
              />
              {otpError && (
                <p className="mt-2 text-sm text-red-600">{otpError}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || otp.length !== 6}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-6 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>
          </form>

          <div className="mt-6 text-center space-y-4">
            <button
              onClick={handleResendOTP}
              disabled={loading}
              className="text-purple-600 hover:text-purple-700 font-medium text-sm disabled:opacity-50"
            >
              Didn't receive OTP? Resend
            </button>
            
            <div className="text-sm text-gray-500">
              <p>OTP expires in 5 minutes</p>
            </div>
            
            <Link
              to="/forgot-password"
              className="inline-flex items-center text-gray-600 hover:text-purple-600 transition-colors duration-200 text-sm"
            >
              <ArrowLeftIcon className="w-4 h-4 mr-2" />
              Back to Forgot Password
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OTPVerificationPage;


