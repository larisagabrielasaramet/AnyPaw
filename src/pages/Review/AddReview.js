import React, { useState } from "react";
import ReactStars from "react-rating-stars-component";
import styles from "./AddReview.module.css";

const fields = [
  { name: "author", placeholder: "Name", type: "text" },
  { name: "content", placeholder: "Content", type: "textarea" },
  { name: "rating", placeholder: "Rating", type: "number" },
];

const AddReview = ({ handleAddReview }) => {
  const [formValues, setFormValues] = useState({});

  const handleInputChange = (event) => {
    setFormValues({ ...formValues, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    handleAddReview(formValues);
    setFormValues({ author: "", content: "", rating: "" });
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
