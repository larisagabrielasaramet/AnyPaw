import React from "react";
import styles from "./AdoptionCard.module.css";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

const AdoptionCard = ({
  adoption,
  handleDelete,
  currentUser,
  userId,
  viewAll,
}) => {
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

        {currentUser && adoption.userId === userId && (
          <button onClick={() => handleDelete(adoption.id)}>
            <FontAwesomeIcon icon={faTrash} />
          </button>
        )}
      </div>
    </div>
  );
};

export default AdoptionCard;
