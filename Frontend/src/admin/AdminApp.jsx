import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useAdmin } from './contexts/AdminContext';
import Dashboard from './pages/Dashboard';
import ProductManager from './pages/ProductManager';
import OrderManager from './pages/OrderManager';
import UserManager from './pages/UserManager';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import RealTimeNotifications from './components/RealTimeNotifications';
import { 
  HomeIcon, 
  ShoppingBagIcon, 
  ClipboardDocumentListIcon,
  UserGroupIcon,
  ChartBarIcon,
  CogIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';

const AdminApp = () => {
  const { admin, logout } = useAdmin();
  const location = useLocation();

  const navigation = [
    { id: 'dashboard', name: 'Dashboard', icon: HomeIcon, path: '/admin' },
    { id: 'products', name: 'Products', icon: ShoppingBagIcon, path: '/admin/products' },
    { id: 'orders', name: 'Orders', icon: ClipboardDocumentListIcon, path: '/admin/orders' },
    { id: 'users', name: 'Users', icon: UserGroupIcon, path: '/admin/users' },
    { id: 'analytics', name: 'Analytics', icon: ChartBarIcon, path: '/admin/analytics' },
    { id: 'settings', name: 'Settings', icon: CogIcon, path: '/admin/settings' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-center h-16 px-4 bg-purple-600">
            <h1 className="text-xl font-bold text-white">Admin Panel</h1>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.id}
                  to={item.path}
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    isActive
                      ? 'bg-purple-100 text-purple-700'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <Icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* User Info & Logout */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center mb-3">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
                  <span className="text-sm font-medium text-purple-600">
                    {admin?.firstName?.charAt(0)}{admin?.lastName?.charAt(0)}
                  </span>
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">
                  {admin?.firstName} {admin?.lastName}
                </p>
                <p className="text-xs text-gray-500">Administrator</p>
              </div>
            </div>
            <button
              onClick={logout}
              className="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-md transition-colors"
            >
              <ArrowRightOnRectangleIcon className="mr-3 h-5 w-5" />
              Sign out
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pl-64">
        {/* Top Bar */}
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-semibold text-gray-900">
                {navigation.find(item => location.pathname === item.path)?.name || 'Dashboard'}
              </h1>
              <div className="flex items-center space-x-4">
                <RealTimeNotifications />
                <span className="text-sm text-gray-500">
                  Welcome back, {admin?.firstName}
                </span>
                <Link
                  to="/"
                  className="text-sm text-purple-600 hover:text-purple-500"
                >
                  View Website
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <main className="p-6">
          {location.pathname === '/admin' && <Dashboard />}
          {location.pathname === '/admin/products' && <ProductManager />}
          {location.pathname === '/admin/orders' && <OrderManager />}
          {location.pathname === '/admin/users' && <UserManager />}
          {location.pathname === '/admin/analytics' && <Analytics />}
          {location.pathname === '/admin/settings' && <Settings />}
        </main>
      </div>
    </div>
  );
};

export default AdminApp;
