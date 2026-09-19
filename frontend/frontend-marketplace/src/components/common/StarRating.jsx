/**
 * StarRating component with fractional/full stars and review count formatting.
 */

import React from 'react';
import { Star, StarHalf } from 'lucide-react';

export const StarRating = ({
  rating = 0,
  totalReviews = null,
  size = 14,
  showNumber = true,
  className = '',
}) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating - fullStars >= 0.3 && rating - fullStars <= 0.7;

  return (
    <div className={`inline-flex items-center gap-1 text-agri-star ${className}`}>
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => {
          if (i < fullStars) {
            return <Star key={i} size={size} className="fill-current" />;
          } else if (i === fullStars && hasHalfStar) {
            return <StarHalf key={i} size={size} className="fill-current" />;
          } else {
            return <Star key={i} size={size} className="text-gray-300" />;
          }
        })}
      </div>
      {showNumber && (
        <span className="text-xs font-semibold text-gray-700 ml-0.5">
          {rating ? rating.toFixed(1) : '0.0'}
        </span>
      )}
      {totalReviews !== null && (
        <span className="text-xs text-gray-500 font-normal">
          ({totalReviews.toLocaleString('en-IN')})
        </span>
      )}
    </div>
  );
};

export default StarRating;
