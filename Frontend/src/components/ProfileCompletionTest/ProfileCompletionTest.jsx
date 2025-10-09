import React, { useState } from 'react';
import ProfileCompletionModal from '../../customers/components/ProfileCompletionModal/ProfileCompletionModal';

const ProfileCompletionTest = () => {
  const [showModal, setShowModal] = useState(false);
  
  const testUser = {
    id: 'test',
    firstName: 'Test',
    lastName: 'User',
    email: 'test@example.com',
    authProvider: 'google',
    phone: null,
    dateOfBirth: null,
    gender: null,
    address: null
  };

  const handleProfileComplete = async (profileData) => {
    console.log('Profile completion test:', profileData);
    alert('Profile completion test successful!');
    setShowModal(false);
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Profile Completion Test</h2>
      <button
        onClick={() => setShowModal(true)}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Test Profile Completion Modal
      </button>
      
      <ProfileCompletionModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        user={testUser}
        onComplete={handleProfileComplete}
      />
    </div>
  );
};

export default ProfileCompletionTest;
