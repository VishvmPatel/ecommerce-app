import React, { useEffect } from 'react';
import { AdminProvider, useAdmin } from './contexts/AdminContext';
import AdminLogin from './pages/AdminLogin';
import AdminApp from './AdminApp';

const AdminRouter = () => {
  const { isAuthenticated, loading } = useAdmin();

  useEffect(() => {
    console.log('🔄 AdminRouter - Authentication state changed:', { loading, isAuthenticated });
  }, [loading, isAuthenticated]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AdminLogin />;
  }

  return <AdminApp />;
};

const AdminRoutes = () => {
  return (
    <AdminProvider>
      <AdminRouter />
    </AdminProvider>
  );
};

export default AdminRoutes;
