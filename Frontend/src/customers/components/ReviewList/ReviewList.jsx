import React, { useState, useEffect } from 'react';
import StarRating from '../StarRating/StarRating';
import { 
  UserIcon, 
  HandThumbUpIcon, 
  HandThumbDownIcon,
  CheckBadgeIcon,
  PhotoIcon,
  ChevronDownIcon,
  ChevronUpIcon
} from '@heroicons/react/24/outline';
import { StarIcon } from '@heroicons/react/24/solid';

const ReviewList = ({ productId }) => {
  const [reviews, setReviews] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('newest');
  const [ratingFilter, setRatingFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedReviews, setExpandedReviews] = useState(new Set());

  const fetchReviews = async (page = 1, sort = 'newest', rating = '') => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        sortBy: sort,
        ...(rating && { rating })
      });

      const response = await fetch(`http://localhost:5000/api/reviews/product/${productId}?${params}`);
      const data = await response.json();

      if (data.success) {
        setReviews(data.data.reviews);
        setStatistics(data.data.statistics);
        setPagination(data.data.pagination);
        setError(null);
      } else {
        setError(data.message || 'Failed to fetch reviews');
      }
    } catch (err) {
      console.error('Error fetching reviews:', err);
      setError('Failed to fetch reviews');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (productId) {
      fetchReviews(currentPage, sortBy, ratingFilter);
    }
  }, [productId, currentPage, sortBy, ratingFilter]);

  const handleSortChange = (newSort) => {
    setSortBy(newSort);
    setCurrentPage(1);
  };

  const handleRatingFilterChange = (rating) => {
    setRatingFilter(rating === ratingFilter ? '' : rating);
    setCurrentPage(1);
  };

  const handleHelpfulVote = async (reviewId, helpful) => {
    try {
      const response = await fetch(`http://localhost:5000/api/reviews/${reviewId}/helpful`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({ helpful })
      });

      const data = await response.json();
      if (data.success) {
        setReviews(prevReviews =>
          prevReviews.map(review =>
            review._id === reviewId
              ? {
                  ...review,
                  helpful: data.data.helpful,
                  notHelpful: data.data.notHelpful
                }
              : review
          )
        );
      }
    } catch (error) {
      console.error('Error voting on review:', error);
    }
  };

  const toggleReviewExpansion = (reviewId) => {
    setExpandedReviews(prev => {
      const newSet = new Set(prev);
      if (newSet.has(reviewId)) {
        newSet.delete(reviewId);
      } else {
        newSet.add(reviewId);
      }
      return newSet;
    });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getInitials = (firstName, lastName) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, index) => (
          <div key={index} className="bg-white rounded-lg border border-gray-200 p-6 animate-pulse">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-32"></div>
                <div className="h-3 bg-gray-200 rounded w-24"></div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <p className="text-red-700">{error}</p>
        <button
          onClick={() => fetchReviews(currentPage, sortBy, ratingFilter)}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!reviews || reviews.length === 0) {
    return (
      <div className="bg-gray-50 rounded-lg p-8 text-center">
        <UserIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No reviews yet</h3>
        <p className="text-gray-600">Be the first to review this product!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Statistics */}
      {statistics && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Customer Reviews</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Overall Rating */}
            <div>
              <div className="flex items-center space-x-4 mb-4">
                <div className="text-3xl font-bold text-gray-900">
                  {statistics.averageRating?.toFixed(1) || '0.0'}
                </div>
                <div>
                  <StarRating 
                    rating={statistics.averageRating || 0} 
                    interactive={false} 
                    size="lg"
                  />
                  <p className="text-sm text-gray-600 mt-1">
                    Based on {statistics.totalReviews} review{statistics.totalReviews !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>
            </div>

            {/* Rating Distribution */}
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-3">Rating Distribution</h4>
              <div className="space-y-2">
                {[5, 4, 3, 2, 1].map(rating => {
                  const count = statistics.ratingDistribution[rating] || 0;
                  const percentage = statistics.totalReviews > 0 ? (count / statistics.totalReviews) * 100 : 0;
                  
                  return (
                    <div key={rating} className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600 w-4">{rating}</span>
                      <StarIcon className="w-4 h-4 text-yellow-400" />
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-600 w-8">{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters and Sort */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700">Sort by:</label>
              <select
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
                <option value="highest">Highest Rating</option>
                <option value="lowest">Lowest Rating</option>
                <option value="mostHelpful">Most Helpful</option>
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700">Filter by rating:</label>
              <div className="flex space-x-1">
                {[5, 4, 3, 2, 1].map(rating => (
                  <button
                    key={rating}
                    onClick={() => handleRatingFilterChange(rating.toString())}
                    className={`px-2 py-1 rounded text-sm transition-colors ${
                      ratingFilter === rating.toString()
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {rating}+
                  </button>
                ))}
                {ratingFilter && (
                  <button
                    onClick={() => handleRatingFilterChange('')}
                    className="px-2 py-1 rounded text-sm bg-gray-500 text-white hover:bg-gray-600"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="text-sm text-gray-600">
            Showing {reviews.length} of {pagination?.totalReviews || 0} reviews
          </div>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.map((review) => {
          const isExpanded = expandedReviews.has(review._id);
          const shouldTruncate = review.comment.length > 200;
          const displayComment = shouldTruncate && !isExpanded 
            ? review.comment.substring(0, 200) + '...' 
            : review.comment;

          return (
            <div key={review._id} className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-start space-x-4">
                {/* User Avatar */}
                <div className="flex-shrink-0">
                  {review.user?.profilePicture ? (
                    <img
                      src={review.user.profilePicture}
                      alt={`${review.user.firstName} ${review.user.lastName}`}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-purple-600">
                        {getInitials(review.user?.firstName, review.user?.lastName)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Review Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-2">
                    <h4 className="text-sm font-medium text-gray-900">
                      {review.user?.firstName} {review.user?.lastName}
                    </h4>
                    {review.verifiedPurchase && (
                      <CheckBadgeIcon className="w-4 h-4 text-green-500" title="Verified Purchase" />
                    )}
                    <span className="text-sm text-gray-500">•</span>
                    <span className="text-sm text-gray-500">{formatDate(review.createdAt)}</span>
                  </div>

                  <div className="mb-3">
                    <StarRating rating={review.rating} interactive={false} size="sm" />
                  </div>

                  <h5 className="text-sm font-medium text-gray-900 mb-2">{review.title}</h5>
                  
                  <p className="text-sm text-gray-700 mb-3">
                    {displayComment}
                    {shouldTruncate && (
                      <button
                        onClick={() => toggleReviewExpansion(review._id)}
                        className="ml-1 text-purple-600 hover:text-purple-700 font-medium"
                      >
                        {isExpanded ? 'Show less' : 'Read more'}
                      </button>
                    )}
                  </p>

                  {/* Review Images */}
                  {review.images && review.images.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-3">
                      {review.images.map((image, index) => (
                        <img
                          key={index}
                          src={image}
                          alt={`Review image ${index + 1}`}
                          className="w-full h-20 object-cover rounded-lg cursor-pointer hover:opacity-75 transition-opacity"
                          onClick={() => window.open(image, '_blank')}
                        />
                      ))}
                    </div>
                  )}

                  {/* Helpful Votes */}
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span>Was this review helpful?</span>
                    <button
                      onClick={() => handleHelpfulVote(review._id, true)}
                      className="flex items-center space-x-1 hover:text-green-600 transition-colors"
                    >
                      <HandThumbUpIcon className="w-4 h-4" />
                      <span>{review.helpful || 0}</span>
                    </button>
                    <button
                      onClick={() => handleHelpfulVote(review._id, false)}
                      className="flex items-center space-x-1 hover:text-red-600 transition-colors"
                    >
                      <HandThumbDownIcon className="w-4 h-4" />
                      <span>{review.notHelpful || 0}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex justify-center space-x-2">
          <button
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={!pagination.hasPrev}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Previous
          </button>
          
          {[...Array(pagination.totalPages)].map((_, index) => {
            const page = index + 1;
            const isCurrentPage = page === pagination.currentPage;
            
            return (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-2 rounded-lg text-sm ${
                  isCurrentPage
                    ? 'bg-purple-600 text-white'
                    : 'border border-gray-300 hover:bg-gray-50'
                }`}
              >
                {page}
              </button>
            );
          })}
          
          <button
            onClick={() => setCurrentPage(prev => Math.min(pagination.totalPages, prev + 1))}
            disabled={!pagination.hasNext}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default ReviewList;
