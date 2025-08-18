import React, { useState } from 'react';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const CustomerReviews = ({ reviews, averageRating, totalReviews }) => {
  const [sortBy, setSortBy] = useState('newest');
  const [filterRating, setFilterRating] = useState('all');

  const ratingDistribution = [
    { stars: 5, count: 45, percentage: 75 },
    { stars: 4, count: 12, percentage: 20 },
    { stars: 3, count: 2, percentage: 3 },
    { stars: 2, count: 1, percentage: 2 },
    { stars: 1, count: 0, percentage: 0 }
  ];

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-serif font-semibold text-foreground">
          Customer Reviews ({totalReviews})
        </h3>
        <Button variant="outline" size="sm">
          Write Review
        </Button>
      </div>

      {/* Rating Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start space-x-2 mb-2">
            <span className="text-3xl font-bold text-foreground">{averageRating}</span>
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Icon
                  key={i}
                  name="Star"
                  size={20}
                  className={i < Math.floor(averageRating) ? 'text-accent fill-current' : 'text-muted-foreground'}
                />
              ))}
            </div>
          </div>
          <p className="text-muted-foreground">Based on {totalReviews} reviews</p>
        </div>

        <div className="space-y-2">
          {ratingDistribution.map((rating) => (
            <div key={rating.stars} className="flex items-center space-x-3">
              <span className="text-sm text-muted-foreground w-8">{rating.stars}★</span>
              <div className="flex-1 bg-muted rounded-full h-2">
                <div
                  className="bg-accent h-2 rounded-full transition-all duration-300"
                  style={{ width: `${rating.percentage}%` }}
                />
              </div>
              <span className="text-sm text-muted-foreground w-8">{rating.count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center space-x-4 mb-6 pb-6 border-b border-border">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-foreground">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="text-sm border border-border rounded px-2 py-1 bg-background"
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="highest">Highest Rating</option>
            <option value="lowest">Lowest Rating</option>
            <option value="helpful">Most Helpful</option>
          </select>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-foreground">Filter:</span>
          <select
            value={filterRating}
            onChange={(e) => setFilterRating(e.target.value)}
            className="text-sm border border-border rounded px-2 py-1 bg-background"
          >
            <option value="all">All Ratings</option>
            <option value="5">5 Stars</option>
            <option value="4">4 Stars</option>
            <option value="3">3 Stars</option>
            <option value="2">2 Stars</option>
            <option value="1">1 Star</option>
          </select>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-6">
        {reviews.map((review) => (
          <div key={review.id} className="border-b border-border pb-6 last:border-b-0 last:pb-0">
            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center flex-shrink-0">
                {review.avatar ? (
                  <Image
                    src={review.avatar}
                    alt={review.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <Icon name="User" size={20} className="text-muted-foreground" />
                )}
              </div>
              
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="font-medium text-foreground">{review.name}</p>
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Icon
                            key={i}
                            name="Star"
                            size={14}
                            className={i < review.rating ? 'text-accent fill-current' : 'text-muted-foreground'}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {formatDate(review.date)}
                      </span>
                    </div>
                  </div>
                  {review.verified && (
                    <div className="flex items-center space-x-1 text-success">
                      <Icon name="CheckCircle" size={14} />
                      <span className="text-xs">Verified Purchase</span>
                    </div>
                  )}
                </div>

                {review.title && (
                  <h4 className="font-medium text-foreground mb-2">{review.title}</h4>
                )}

                <p className="text-muted-foreground mb-3 leading-relaxed">
                  {review.comment}
                </p>

                {review.size && (
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-3">
                    <span>Size purchased: {review.size}</span>
                    <span>Fit: {review.fit}</span>
                  </div>
                )}

                {review.images && review.images.length > 0 && (
                  <div className="flex space-x-2 mb-3">
                    {review.images.map((image, index) => (
                      <div key={index} className="w-16 h-16 rounded-lg overflow-hidden">
                        <Image
                          src={image}
                          alt={`Review image ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex items-center space-x-4">
                  <button className="flex items-center space-x-1 text-sm text-muted-foreground hover:text-foreground transition-colors duration-300">
                    <Icon name="ThumbsUp" size={14} />
                    <span>Helpful ({review.helpful})</span>
                  </button>
                  <button className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-300">
                    Report
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Load More */}
      <div className="text-center mt-6">
        <Button variant="outline">
          Load More Reviews
        </Button>
      </div>
    </div>
  );
};

export default CustomerReviews;