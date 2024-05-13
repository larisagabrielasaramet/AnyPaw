// Reviews.js
import React from "react";
import "./Review.module.css"; // Make sure to import the CSS for styling

const reviewsData = [
  // ... (existing reviews)
];

// Individual Review Card Component
const ReviewCard = ({ review }) => {
  const { author, date, content, rating } = review;
  return (
    <div className="review-card">
      <h3 className="review-author">{author}</h3>
      <span className="review-date">{date}</span>
      <p className="review-content">{content}</p>
      <div className="review-rating">
        {Array(rating).fill("★").join("")}
        {Array(5 - rating)
          .fill("☆")
          .join("")}
      </div>
    </div>
  );
};

// Reviews Component
const Review = () => {
  return (
    <div className="reviews-section">
      <h1>Client Reviews</h1>
      <div className="reviews-container">
        {reviewsData.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>
    </div>
  );
};

export default Review;
