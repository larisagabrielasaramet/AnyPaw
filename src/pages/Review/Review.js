import React, { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { FIREBASE_DB } from "../../firebase/firebase";
import ReviewCard from "./ReviewCard";
import styles from "./Review.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import AddReview from "./AddReview";

const Review = () => {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const reviewsCollection = collection(FIREBASE_DB, "reviews");
    const unsubscribe = onSnapshot(reviewsCollection, (snapshot) => {
      const newReviews = snapshot.docs
        .map((doc) => {
          const data = doc.data();
          return {
            ...data,
            id: doc.id,
            date: data.createdAt ? data.createdAt.toDate() : null,
          };
        })
        .filter((review) => review.isPosted)
        .sort((a, b) => a.createdAt.seconds - b.createdAt.seconds);
      setReviews(newReviews);
    });

    return () => unsubscribe();
  }, []);

  const handleAddReview = async (review) => {
    const docRef = await addDoc(collection(FIREBASE_DB, "reviews"), {
      ...review,
      createdAt: serverTimestamp(),
      isPosted: false,
    });

    setReviews((prevReviews) => [
      { ...review, id: docRef.id, isPosted: false },
      ...prevReviews,
    ]);
  };

  const averageRating =
    reviews.length > 0
      ? reviews.reduce((total, review) => total + Number(review.rating), 0) /
        reviews.length
      : 0;

  const ratingCounts = [1, 2, 3, 4, 5].map(
    (rating) =>
      reviews.filter((review) => Number(review.rating) === rating).length
  );
  return (
    <div className={styles.container}>
      <div className={styles.ratingColumn}>
        <div className={styles.raintigContainer}>
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
      </div>
      <div className={styles.reviewsColumn}>
        <div className={styles.reviewsContainer}>
          {[...reviews].reverse().map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      </div>
      <div className={styles.addReviewColumn}>
        <AddReview handleAddReview={handleAddReview} />
      </div>
    </div>
  );
};

export default Review;
