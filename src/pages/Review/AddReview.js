import React, { useState } from "react";
import { collection, addDoc, getDocs } from "firebase/firestore";
import ReactStars from "react-rating-stars-component";
import styles from "./AddReview.module.css";
import { FIREBASE_DB } from "../../firebase/firebase";

const fields = [
  { name: "author", placeholder: "Name", type: "text" },
  { name: "content", placeholder: "Content", type: "textarea" },
  { name: "date", placeholder: "Date", type: "date" },
  { name: "rating", placeholder: "Rating", type: "number" },
];

const AddReview = ({ setReviews }) => {
  const [formValues, setFormValues] = useState({});

  const handleInputChange = (event) => {
    setFormValues({ ...formValues, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const reviewsCollection = collection(FIREBASE_DB, "reviews");
    await addDoc(reviewsCollection, formValues);
    const reviewDocs = await getDocs(reviewsCollection);
    setReviews(reviewDocs.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    setFormValues({ author: "", content: "", date: "", rating: "" });
  };

  return (
    <form className={styles.AddReview} onSubmit={handleSubmit}>
      <h2>New review</h2>
      {fields.map((field) => (
        <div key={field.name} className={styles.fieldContainer}>
          {field.name !== "rating" ? (
            <input
              type={field.type}
              name={field.name}
              placeholder={field.placeholder}
              value={formValues[field.name] || ""}
              onChange={handleInputChange}
              className={styles.input}
            />
          ) : (
            <ReactStars
              count={5}
              onChange={(newRating) => {
                setFormValues({ ...formValues, rating: newRating });
              }}
              size={24}
              activeColor="#ffd700"
              style={{ width: "300px" }}
            />
          )}
        </div>
      ))}
      <button type="submit" className={styles.button}>
        Submit
      </button>
    </form>
  );
};

export default AddReview;
