import React, { useState, useEffect } from 'react';
import { StarIcon } from '@heroicons/react/24/solid';
import { StarIcon as StarOutlineIcon, HandThumbUpIcon, HandThumbDownIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../../contexts/AuthContext';
import apiService from '../../services/api';

const ReviewList = ({ productId }) => {
  const { isAuthenticated } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, [productId, page]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await apiService.getProductReviews(productId, { page, limit: 5 });
      
      if (response.success) {
        if (page === 1) {
          setReviews(response.data);
        } else {
          setReviews(prev => [...prev, ...response.data]);
        }
        setHasMore(response.pagination.hasNext);
      } else {
        setError(response.message || 'Failed to load reviews');
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
      setError('Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (reviewId, isHelpful) => {
    if (!isAuthenticated) {
      alert('Please log in to vote on reviews');
      return;
    }

    try {
      const response = await apiService.markReviewHelpful(reviewId, isHelpful);
      if (response.success) {
        // Update the review in the list
        setReviews(prev => prev.map(review => 
          review._id === reviewId 
            ? { 
                ...review, 
                helpfulCount: response.data.helpfulCount,
                notHelpfulCount: response.data.notHelpfulCount
              }
            : review
        ));
      }
    } catch (error) {
      console.error('Error voting on review:', error);
    }
  };

  const renderStars = (rating) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          star <= rating ? (
            <StarIcon key={star} className="h-4 w-4 text-yellow-400" />
          ) : (
            <StarOutlineIcon key={star} className="h-4 w-4 text-gray-300" />
          )
        ))}
      </div>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading && page === 1) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-gray-50 p-4 rounded-lg animate-pulse">
            <div className="flex items-center space-x-3 mb-2">
              <div className="h-8 w-8 bg-gray-300 rounded-full"></div>
              <div className="space-y-1">
                <div className="h-4 w-32 bg-gray-300 rounded"></div>
                <div className="h-3 w-20 bg-gray-300 rounded"></div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-4 w-full bg-gray-300 rounded"></div>
              <div className="h-4 w-3/4 bg-gray-300 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">{error}</p>
        <button
          onClick={() => {
            setError('');
            setPage(1);
            fetchReviews();
          }}
          className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">No reviews yet. Be the first to review this product!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {reviews.map((review) => (
        <div key={review._id} className="bg-white p-4 rounded-lg border">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                {review.user?.firstName?.charAt(0) || 'U'}
              </div>
              <div>
                <p className="font-medium text-gray-900">
                  {review.user?.firstName} {review.user?.lastName}
                </p>
                <div className="flex items-center space-x-2">
                  {renderStars(review.rating)}
                  <span className="text-sm text-gray-500">
                    {formatDate(review.createdAt)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-3">
            <h4 className="font-semibold text-gray-900 mb-2">{review.title}</h4>
            <p className="text-gray-700 leading-relaxed">{review.comment}</p>
          </div>

          {isAuthenticated && (
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <button
                onClick={() => handleVote(review._id, true)}
                className="flex items-center space-x-1 hover:text-green-600 transition-colors"
              >
                <HandThumbUpIcon className="h-4 w-4" />
                <span>Helpful ({review.helpfulCount})</span>
              </button>
              <button
                onClick={() => handleVote(review._id, false)}
                className="flex items-center space-x-1 hover:text-red-600 transition-colors"
              >
                <HandThumbDownIcon className="h-4 w-4" />
                <span>Not helpful ({review.notHelpfulCount})</span>
              </button>
            </div>
          )}
        </div>
      ))}

      {hasMore && (
        <div className="text-center">
          <button
            onClick={() => setPage(prev => prev + 1)}
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Loading...' : 'Load More Reviews'}
          </button>
        </div>
      )}
    </div>
  );
};

export default ReviewList;


