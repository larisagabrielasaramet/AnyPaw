import React from "react";
import styles from "./AdoptionCard.module.css";
import { Link } from "react-router-dom";

const AdoptionCard = ({ adoption }) => {
  return (
    <div className={styles.adoption_card}>
      <img src={adoption.imageUrl} alt={adoption.title} />
      <div>
        <h2>{adoption.title}</h2>
        <p>
          <span style={{ fontWeight: "bold" }}>Breed: </span> {adoption.race}
        </p>
        <p>
          <span style={{ fontWeight: "bold" }}>Date of Birth: </span>{" "}
          {adoption.age}
        </p>

        <Link to={`/adoptions/${adoption.title}`}>
          <button>More</button>
        </Link>
      </div>
    </div>
  );
};

export default AdoptionCard;
