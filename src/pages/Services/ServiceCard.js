import React, { useState } from "react";
import styles from "./ServiceCard.module.css";

const ServiceCard = ({ service }) => {
  const [showMore, setShowMore] = useState(false);

  const handleClick = (e) => {
    e.preventDefault();
    setShowMore(!showMore);
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.column}>
          <h2>{service.title}</h2>
          <p>{service.cardDescription}</p>
          <button onClick={handleClick}>{showMore ? "Less" : "More"}</button>
          {showMore && (
            <div className={styles.details}>
              <p className={styles.bold_text}>
                <span className={styles.span}>Description:</span>{" "}
                {service.description}
              </p>
              <p className={styles.bold_text}>
                <span className={styles.span}>Services:</span>{" "}
                {service.services}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;
