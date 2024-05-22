import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { FIREBASE_DB } from "../../firebase/firebase";
import ReviewCard from "./ReviewCard";
import styles from "./Review.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import AddReview from "./AddReview";

const Review = () => {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchReviews = async () => {
      const reviewsCollection = collection(FIREBASE_DB, "reviews");
      const reviewDocs = await getDocs(reviewsCollection);
      setReviews(reviewDocs.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };

    fetchReviews();
  }, []);

  const averageRating =
    reviews.reduce((total, review) => total + Number(review.rating), 0) /
    reviews.length;

  const ratingCounts = [1, 2, 3, 4, 5].map(
    (rating) =>
      reviews.filter((review) => Number(review.rating) === rating).length
  );
  return (
    <div className={styles.container}>
      <div className={styles.reviewsColumn}>
        <div className={styles.ratingContainer}>
          <div className={styles.averageRating}>
            <p>{averageRating.toFixed(2)}</p>
          </div>
          <div className={styles.ratingBars}>
            {ratingCounts.map((count, index) => (
              <div key={1 + index} className={styles.ratingBar}>
                <p>
                  {1 + index} <FontAwesomeIcon icon={faStar} />
                </p>
                <div className={styles.bar}>
                  <div
                    className={styles.filledBar}
                    style={{ width: `${(count / reviews.length) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className={styles.reviewsContainer}>
          {reviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      </div>
      <div className={styles.addReviewColumn}>
        <AddReview setReviews={setReviews} />
      </div>
    </div>
  );
};

export default Review;
