import React, { useState } from 'react';
import { UserIcon } from '@heroicons/react/24/outline';

const ProfileImage = ({ 
  src, 
  alt, 
  className = "w-8 h-8 rounded-full object-cover border-2 border-white shadow-sm",
  fallbackClassName = "w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center"
}) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleImageError = () => {
    console.log('Profile image failed to load:', src);
    console.log('This is likely due to CORS restrictions on Google profile images');
    setImageError(true);
  };

  const handleImageLoad = () => {
    console.log('Profile image loaded successfully:', src);
    setImageLoaded(true);
  };

  // If there's an error or no src, show fallback
  if (imageError || !src) {
    return (
      <div className={fallbackClassName}>
        <UserIcon className="w-5 h-5 text-white" />
      </div>
    );
  }

  return (
    <img 
      src={src} 
      alt={alt}
      className={className}
      onError={handleImageError}
      onLoad={handleImageLoad}
      style={{ display: imageLoaded ? 'block' : 'none' }}
    />
  );
};

export default ProfileImage;
