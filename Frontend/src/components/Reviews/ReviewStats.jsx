import React, { useState, useEffect } from 'react';
import { StarIcon } from '@heroicons/react/24/solid';
import { StarIcon as StarOutlineIcon } from '@heroicons/react/24/outline';
import apiService from '../../services/api';

const ReviewStats = ({ productId }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStats();
  }, [productId]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await apiService.getReviewStats(productId);
      
      if (response.success) {
        setStats(response.data);
      } else {
        setError(response.message || 'Failed to load review statistics');
      }
    } catch (error) {
      console.error('Error fetching review stats:', error);
      setError('Failed to load review statistics');
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <div key={star} className="relative">
            {star <= fullStars ? (
              <StarIcon className="h-5 w-5 text-yellow-400" />
            ) : (
              <StarOutlineIcon className="h-5 w-5 text-gray-300" />
            )}
            {star === fullStars + 1 && hasHalfStar && (
              <div className="absolute inset-0 overflow-hidden">
                <StarIcon className="h-5 w-5 text-yellow-400" style={{ clipPath: 'inset(0 50% 0 0)' }} />
              </div>
            )}
          </div>
        ))}
        <span className="ml-2 text-sm font-medium text-gray-900">
          {rating.toFixed(1)}
        </span>
      </div>
    );
  };

  const getRatingPercentage = (rating, totalReviews) => {
    if (totalReviews === 0) return 0;
    const ratingCount = stats.ratingDistribution.find(r => r._id === rating)?.count || 0;
    return (ratingCount / totalReviews) * 100;
  };

  if (loading) {
    return (
      <div className="bg-gray-50 p-6 rounded-lg animate-pulse">
        <div className="space-y-4">
          <div className="h-6 w-32 bg-gray-300 rounded"></div>
          <div className="h-4 w-24 bg-gray-300 rounded"></div>
          <div className="space-y-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-3 w-full bg-gray-300 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-50 p-6 rounded-lg text-center">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (!stats || stats.totalReviews === 0) {
    return (
      <div className="bg-gray-50 p-6 rounded-lg text-center">
        <p className="text-gray-600">No reviews yet</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 p-6 rounded-lg">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Reviews</h3>
      
      <div className="flex items-center space-x-4 mb-6">
        {renderStars(stats.averageRating)}
        <span className="text-sm text-gray-600">
          Based on {stats.totalReviews} review{stats.totalReviews !== 1 ? 's' : ''}
        </span>
      </div>

      <div className="space-y-2">
        {[5, 4, 3, 2, 1].map((rating) => {
          const percentage = getRatingPercentage(rating, stats.totalReviews);
          const count = stats.ratingDistribution.find(r => r._id === rating)?.count || 0;
          
          return (
            <div key={rating} className="flex items-center space-x-3">
              <span className="text-sm text-gray-600 w-4">{rating}</span>
              <StarIcon className="h-4 w-4 text-yellow-400" />
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
              <span className="text-sm text-gray-600 w-8 text-right">
                {count}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ReviewStats;

