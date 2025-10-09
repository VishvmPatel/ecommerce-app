import React from 'react';

const AdminFallback = () => {
  console.log('🚨 AdminFallback component rendering - this should not happen!');
  return (
    <div className="min-h-screen bg-red-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-red-600 mb-4">Admin Fallback</h1>
        <p className="text-xl text-red-600 mb-8">Something went wrong with admin routing!</p>
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-4">Debug Info</h2>
          <p className="text-gray-600">This component should not be visible.</p>
          <p className="text-gray-600">If you see this, there's a routing issue.</p>
        </div>
      </div>
    </div>
  );
};

export default AdminFallback;

