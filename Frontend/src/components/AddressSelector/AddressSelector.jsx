import React, { useState } from 'react';
import { useAddress } from '../../contexts/AddressContext';
import { useToast } from '../../contexts/ToastContext';
import {
  MapPinIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  CheckIcon,
  StarIcon
} from '@heroicons/react/24/outline';

const AddressSelector = ({ 
  selectedAddress, 
  onAddressSelect, 
  onNewAddress, 
  type = 'shipping' 
}) => {
  const { addresses, loading, deleteAddress, setDefaultAddress } = useAddress();
  const { showSuccess, showError } = useToast();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

  const handleAddressSelect = (address) => {
    onAddressSelect(address);
  };

  const handleSetDefault = async (addressId, e) => {
    e.stopPropagation();
    try {
      const result = await setDefaultAddress(addressId);
      if (result.success) {
        showSuccess('Default address updated successfully!');
      } else {
        showError(result.error);
      }
    } catch (error) {
      showError('Failed to set default address');
    }
  };

  const handleDeleteAddress = async (addressId) => {
    try {
      const result = await deleteAddress(addressId);
      if (result.success) {
        showSuccess('Address deleted successfully!');
        setShowDeleteConfirm(null);
        // If the deleted address was selected, clear selection
        if (selectedAddress && selectedAddress._id === addressId) {
          onAddressSelect(null);
        }
      } else {
        showError(result.error);
      }
    } catch (error) {
      showError('Failed to delete address');
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-gray-200 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">
          Select {type === 'shipping' ? 'Shipping' : 'Billing'} Address
        </h3>
        <button
          onClick={onNewAddress}
          className="flex items-center px-4 py-2 text-purple-600 hover:text-purple-700 font-medium transition-colors duration-200"
        >
          <PlusIcon className="w-5 h-5 mr-2" />
          Add New Address
        </button>
      </div>

      {addresses.length === 0 ? (
        <div className="text-center py-8">
          <MapPinIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">No saved addresses found</p>
          <button
            onClick={onNewAddress}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-200 font-medium"
          >
            Add Your First Address
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {addresses.map((address) => (
            <div
              key={address._id}
              className={`p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                selectedAddress && selectedAddress._id === address._id
                  ? 'border-purple-500 bg-purple-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => handleAddressSelect(address)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <h4 className="font-medium text-gray-900">
                      {address.firstName} {address.lastName}
                    </h4>
                    {address.isDefault && (
                      <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        <StarIcon className="w-3 h-3 mr-1" />
                        Default
                      </span>
                    )}
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-1">
                    {address.address}
                  </p>
                  <p className="text-sm text-gray-600 mb-1">
                    {address.city}, {address.state} {address.zipCode}
                  </p>
                  <p className="text-sm text-gray-600 mb-2">
                    {address.country}
                  </p>
                  
                  <div className="flex items-center text-sm text-gray-500">
                    <span className="mr-4">{address.email}</span>
                    <span>{address.phone}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-2 ml-4">
                  {selectedAddress && selectedAddress._id === address._id && (
                    <div className="flex items-center justify-center w-6 h-6 bg-purple-600 rounded-full">
                      <CheckIcon className="w-4 h-4 text-white" />
                    </div>
                  )}
                  
                  {!address.isDefault && (
                    <button
                      onClick={(e) => handleSetDefault(address._id, e)}
                      className="p-1 text-gray-400 hover:text-purple-600 transition-colors duration-200"
                      title="Set as default"
                    >
                      <StarIcon className="w-4 h-4" />
                    </button>
                  )}
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowDeleteConfirm(address._id);
                    }}
                    className="p-1 text-gray-400 hover:text-red-600 transition-colors duration-200"
                    title="Delete address"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div 
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" 
              onClick={() => setShowDeleteConfirm(null)}
            ></div>
            
            <div className="inline-block align-bottom bg-white rounded-xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <TrashIcon className="h-6 w-6 text-red-600" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Delete Address
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to delete this address? This action cannot be undone.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => handleDeleteAddress(showDeleteConfirm)}
                >
                  Delete
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setShowDeleteConfirm(null)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddressSelector;
