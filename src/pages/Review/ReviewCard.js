import React from "react";
import styles from "./ReviewCard.module.css";
import ReactStars from "react-rating-stars-component";

const ReviewCard = ({ review }) => (
  <div className={styles.card}>
    <data>{review.date}</data>
    <h3>{review.author}</h3>
    <p>{review.content}</p>
    <p className={styles.bold_text}>
      <span className={styles.span}></span>
      <ReactStars
        count={5}
        value={review.rating}
        size={24}
        activeColor="#ffd700"
        isHalf={true}
        edit={false}
      />
    </p>
  </div>
);

export default ReviewCard;
