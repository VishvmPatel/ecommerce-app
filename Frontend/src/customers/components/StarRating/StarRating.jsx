import React, { useState } from 'react';
import { StarIcon } from '@heroicons/react/24/solid';
import { StarIcon as StarIconOutline } from '@heroicons/react/24/outline';

const StarRating = ({ 
  rating = 0, 
  onRatingChange, 
  maxRating = 5, 
  size = 'md', 
  interactive = true,
  showLabel = false 
}) => {
  const [hoverRating, setHoverRating] = useState(0);

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
    xl: 'w-8 h-8'
  };

  const handleClick = (newRating) => {
    if (interactive && onRatingChange) {
      onRatingChange(newRating);
    }
  };

  const handleMouseEnter = (newRating) => {
    if (interactive) {
      setHoverRating(newRating);
    }
  };

  const handleMouseLeave = () => {
    if (interactive) {
      setHoverRating(0);
    }
  };

  const getRatingLabels = () => {
    return {
      1: 'Poor',
      2: 'Fair',
      3: 'Good',
      4: 'Very Good',
      5: 'Excellent'
    };
  };

  const currentRating = hoverRating || rating;
  const labels = getRatingLabels();

  return (
    <div className="flex items-center space-x-1">
      <div className="flex items-center space-x-1">
        {[...Array(maxRating)].map((_, index) => {
          const starRating = index + 1;
          const isFilled = starRating <= currentRating;
          
          return (
            <button
              key={index}
              type="button"
              className={`${sizeClasses[size]} ${
                interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'
              } transition-transform duration-150`}
              onClick={() => handleClick(starRating)}
              onMouseEnter={() => handleMouseEnter(starRating)}
              onMouseLeave={handleMouseLeave}
              disabled={!interactive}
            >
              {isFilled ? (
                <StarIcon className={`${sizeClasses[size]} text-yellow-400`} />
              ) : (
                <StarIconOutline className={`${sizeClasses[size]} text-gray-300`} />
              )}
            </button>
          );
        })}
      </div>
      
      {showLabel && interactive && currentRating > 0 && (
        <span className="ml-2 text-sm text-gray-600">
          {labels[currentRating]}
        </span>
      )}
      
      {!interactive && rating > 0 && (
        <span className="ml-2 text-sm text-gray-600">
          {rating.toFixed(1)} out of {maxRating}
        </span>
      )}
    </div>
  );
};

export default StarRating;

