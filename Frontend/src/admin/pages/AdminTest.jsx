import React from 'react';

const AdminTest = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-purple-600 mb-4">Admin Panel</h1>
        <p className="text-xl text-gray-600 mb-8">Admin system is working!</p>
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-4">Test Component</h2>
          <p className="text-gray-600">If you can see this, the admin routing is working correctly.</p>
          <div className="mt-4 space-y-2">
            <div className="bg-green-100 text-green-800 p-2 rounded">✅ Admin Context Loaded</div>
            <div className="bg-green-100 text-green-800 p-2 rounded">✅ Admin Routes Working</div>
            <div className="bg-green-100 text-green-800 p-2 rounded">✅ React Router Active</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminTest;

